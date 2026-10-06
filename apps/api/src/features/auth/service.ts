import { newId, schema } from "@traiv/db";
import { and, desc, eq, gt, gte, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound, tooManyRequests, unauthorized } from "../../errors.js";
import { sendOtp } from "../../integrations/otp/index.js";
import { hash, hashOtp, newOtp, newSessionToken, otpMatches } from "../../lib/crypto.js";
import { createDefaultStudio, defaultStudioFor, resolveActiveStudio } from "../studio/service.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_HOUR = 5;
/** Across every challenge for one number, not per code — resending must not reset it. */
const MAX_FAILED_PER_HOUR = 15;
/** One IP, any number. Counts unsent rows too: invalid numbers must not be free. */
const MAX_SENDS_PER_IP_PER_HOUR = 20;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * The one way a phone number becomes storable.
 *
 * It used to be `+91${input}` with no validation, which meant an already-normalised
 * number came back as `+91+919876543210` and anything at all could be written to a column
 * whose uniqueness depends on a single representation. Everything that reaches the
 * database goes through here, and the CHECK constraints catch anything that does not.
 *
 * India only, deliberately — it is the market we serve, and accepting other country codes
 * is how an OTP endpoint becomes a route to premium-rate numbers.
 */
export function toE164(input: string): string {
  const digits = input.replace(/[\s()\-.]/g, "");

  const national = digits.startsWith("+91")
    ? digits.slice(3)
    : digits.startsWith("0091")
      ? digits.slice(4)
      : digits.startsWith("91") && digits.length === 12
        ? digits.slice(2)
        : digits.startsWith("0")
          ? digits.slice(1)
          : digits;

  // Indian mobile numbers are ten digits starting 6-9. Landlines cannot receive an SMS,
  // so refusing them here is a feature rather than a gap.
  if (!/^[6-9]\d{9}$/.test(national)) {
    throw badRequest("phone_invalid", "Enter a valid Indian mobile number.");
  }
  return `+91${national}`;
}

/**
 * Issue an OTP for a phone number.
 *
 * Deliberately does not reveal whether the number already has an account — the same
 * response either way, so this endpoint can't be used to enumerate customers.
 */
export async function requestChallenge(input: {
  phone: string;
  name?: string | undefined;
  ip?: string | undefined;
}) {
  const phone = toE164(input.phone);
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const [{ count } = { count: 0 }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.authChallenges)
    .where(
      and(
        eq(schema.authChallenges.phone, phone),
        eq(schema.authChallenges.purpose, "phone_verify"),
        gte(schema.authChallenges.createdAt, hourAgo),
        isNotNull(schema.authChallenges.sentAt),
      ),
    );

  if (count >= MAX_SENDS_PER_HOUR) {
    throw tooManyRequests("Too many codes requested. Try again in an hour.");
  }

  // Per IP, and deliberately counting rows we never sent. The per-phone quota ignores
  // failed sends because an outage is ours not the user's — but applying that here would
  // make deliberately invalid numbers a free way to hammer the endpoint, which is exactly
  // how SMS pumping works.
  if (input.ip) {
    const [{ count: fromIp } = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.authChallenges)
      .where(
        and(
          eq(schema.authChallenges.requestIp, input.ip),
          gte(schema.authChallenges.createdAt, hourAgo),
        ),
      );
    if (fromIp >= MAX_SENDS_PER_IP_PER_HOUR) {
      throw tooManyRequests("Too many codes requested. Try again in an hour.");
    }
  }

  const code = newOtp();
  const challengeId = newId();

  // "Only the newest code is valid" was a query-ordering convention, which a double-tap
  // on resend could break by leaving two live rows. Superseding in the same transaction
  // as the insert makes it an invariant, and the partial unique index on
  // (phone, purpose) where consumed_at is null is what enforces it.
  await db.transaction(async (tx) => {
    await tx
      .update(schema.authChallenges)
      .set({ consumedAt: new Date() })
      .where(
        and(
          eq(schema.authChallenges.phone, phone),
          eq(schema.authChallenges.purpose, "phone_verify"),
          isNull(schema.authChallenges.consumedAt),
        ),
      );

    await tx.insert(schema.authChallenges).values({
      id: challengeId,
      purpose: "phone_verify",
      phone,
      codeHash: hashOtp(challengeId, code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      requestIp: input.ip ?? null,
      pendingName: input.name?.trim() || null,
    });
  });

  try {
    const { transport, fellBack } = await sendOtp(phone, code);
    await db
      .update(schema.authChallenges)
      .set({ transport, sentAt: new Date() })
      .where(eq(schema.authChallenges.id, challengeId));

    // When the console transport handled it, the code was printed to stdout and is
    // therefore already not a secret — so returning it leaks nothing. Production
    // refuses to boot with OTP_TRANSPORT=console, so this can never be reachable there.
    // It is what lets tests skip brute-forcing a million HMACs per sign-in.
    return {
      sent: true as const,
      transport,
      fellBack,
      ...(transport === "console" ? { code } : {}),
    };
  } catch (error) {
    // Record why, and leave sentAt null so this attempt doesn't count against the
    // user's hourly quota — the outage is ours, not theirs.
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(schema.authChallenges)
      .set({ sendError: message.slice(0, 500) })
      .where(eq(schema.authChallenges.id, challengeId));
    console.error("[otp] every transport failed:", message);
    throw badRequest("otp_send_failed", "Couldn't send the code right now. Try again.");
  }
}

export async function verifyChallenge(input: {
  phone: string;
  code: string;
  ip?: string | undefined;
  userAgent?: string | undefined;
}) {
  const phone = toE164(input.phone);

  // Only the newest outstanding code is valid — requesting a second one invalidates the
  // first, which is what stops an attacker keeping many live codes in play.
  const [challenge] = await db
    .select()
    .from(schema.authChallenges)
    .where(
      and(
        eq(schema.authChallenges.phone, phone),
        eq(schema.authChallenges.purpose, "phone_verify"),
      ),
    )
    .orderBy(desc(schema.authChallenges.createdAt))
    .limit(1);

  if (!challenge) throw badRequest("no_challenge", "Request a code first.");

  // Per-challenge attempts reset every time a new code is issued, so on its own the cap
  // only costs an attacker a resend. This counts failures across every challenge for the
  // number in the last hour, which is the limit that actually binds.
  const [{ failed } = { failed: 0 }] = await db
    .select({ failed: sql<number>`coalesce(sum(${schema.authChallenges.attempts}), 0)::int` })
    .from(schema.authChallenges)
    .where(
      and(
        eq(schema.authChallenges.phone, phone),
        eq(schema.authChallenges.purpose, "phone_verify"),
        gte(schema.authChallenges.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
      ),
    );
  if (failed >= MAX_FAILED_PER_HOUR) {
    throw tooManyRequests("Too many incorrect codes. Try again in an hour.");
  }

  // Deliberately not filtered on consumedAt above: the unique index guarantees at most
  // one live row, so the newest is it — and finding a consumed row is what lets this say
  // "already used" instead of "request a code first", which is true but unhelpful.
  //
  // Spend the attempt and re-check every precondition in one statement, before comparing.
  // Reading, checking and then incrementing let concurrent requests all read the same
  // count: twenty parallel guesses cost one attempt between them. The guard clauses live
  // in the WHERE so the database, not this process, decides who gets the attempt.
  const [spent] = await db
    .update(schema.authChallenges)
    .set({ attempts: sql`${schema.authChallenges.attempts} + 1` })
    .where(
      and(
        eq(schema.authChallenges.id, challenge.id),
        isNull(schema.authChallenges.consumedAt),
        gt(schema.authChallenges.expiresAt, new Date()),
        lt(schema.authChallenges.attempts, MAX_ATTEMPTS),
      ),
    )
    .returning();

  if (!spent) {
    // One of the preconditions failed. Re-read to say which, rather than guessing.
    if (challenge.consumedAt) throw badRequest("code_used", "That code has already been used.");
    if (challenge.expiresAt < new Date()) {
      throw badRequest("code_expired", "That code has expired.");
    }
    throw tooManyRequests("Too many attempts. Request a new code.");
  }

  if (!otpMatches(spent.id, input.code, spent.codeHash)) {
    throw badRequest("code_invalid", "That code isn't right. Check the latest message.");
  }

  // Claim the code. Conditional on still being unconsumed, so two correct submissions
  // racing each other produce exactly one session rather than two.
  const [won] = await db
    .update(schema.authChallenges)
    .set({ consumedAt: new Date() })
    .where(and(eq(schema.authChallenges.id, spent.id), isNull(schema.authChallenges.consumedAt)))
    .returning({ id: schema.authChallenges.id });

  if (!won) throw badRequest("code_used", "That code has already been used.");

  return db.transaction(async (tx) => {
    let [user] = await tx
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.phone, phone), isNull(schema.users.deletedAt)))
      .limit(1);

    const isNew = !user;

    if (!user) {
      const name = challenge.pendingName ?? "";
      const [created] = await tx
        .insert(schema.users)
        .values({
          id: newId(),
          phone,
          name,
          phoneVerifiedAt: new Date(),
        })
        .returning();
      user = created;

      if (user) {
        // No phone row in auth_identity. The number on `user` is the credential, and a
        // second copy here would be a second thing to keep in step on every change —
        // which is how a stale identity outlives a phone number and lets its next owner
        // in. auth_identity is for providers we do not own.
        //
        // Same transaction as the user, so "every trainer has a studio" cannot be broken
        // by a partial failure.
        await createDefaultStudio(tx, user);
      }
    } else {
      // Refreshed on every successful OTP, not only the first. Indian carriers reassign
      // disconnected numbers after about 90 days, and this is the column that makes
      // "how long since this number proved itself" answerable at all.
      await tx
        .update(schema.users)
        .set({ phoneVerifiedAt: new Date(), updatedAt: new Date() })
        .where(eq(schema.users.id, user.id));
    }

    if (!user) throw badRequest("user_failed", "Could not create the account.");

    const activeStudioId = await resolveActiveStudio(user.id, null, tx);
    const session = await issueSession(tx, user.id, input.ip, input.userAgent, activeStudioId);
    return {
      user: { ...user, phoneVerifiedAt: user.phoneVerifiedAt ?? new Date() },
      session,
      isNew,
    };
  });
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * `activeStudioId` is resolved here rather than at each call site. A session carrying
 * null fails every studio-scoped route with a 403, and the sign-in paths kept omitting
 * it — the dev bypass and both returning-user Google branches all shipped that way.
 * Pass it explicitly only from inside a transaction, where the studio is not yet
 * committed and `defaultStudioFor` could not see it.
 */
async function issueSession(
  tx: Tx | typeof db,
  userId: string,
  ip?: string,
  userAgent?: string,
  activeStudioId?: string,
) {
  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await tx.insert(schema.sessions).values({
    id: newId(),
    userId,
    tokenHash: hash(token),
    expiresAt,
    ip: ip ?? null,
    userAgent: userAgent ?? null,
    activeStudioId: activeStudioId ?? (await defaultStudioFor(userId, tx)),
  });
  return { token, expiresAt };
}

/** Signup step two. Email is stored unverified on purpose — see ADR 0005. */
export async function completeProfile(userId: string, input: { email?: string; name?: string }) {
  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (input.email?.trim()) {
    const email = input.email.trim().toLowerCase();

    // An unverified claim must not take an address that someone has already proven.
    // Without this, typing a stranger's address silently blocks them from ever linking
    // Google — the unique index holds it, and nobody can evict it.
    const [taken] = await db
      .select({ id: schema.users.id, verifiedAt: schema.users.emailVerifiedAt })
      .from(schema.users)
      .where(and(eq(schema.users.email, email), isNull(schema.users.deletedAt)))
      .limit(1);

    if (taken && taken.id !== userId) {
      throw badRequest("email_taken", "That email is already on another account.");
    }
    patch.email = email;
    // Changing the address drops any proof attached to the old one.
    patch.emailVerifiedAt = null;
  }

  if (input.name?.trim()) patch.name = input.name.trim();

  const [user] = await db
    .update(schema.users)
    .set(patch)
    .where(eq(schema.users.id, userId))
    .returning();

  if (!user) throw notFound("Account not found.");
  return user;
}

export async function getUser(userId: string) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.id, userId), isNull(schema.users.deletedAt)))
    .limit(1);
  if (!user) throw unauthorized();
  return user;
}

export async function revokeSession(sessionId: string) {
  await db
    .update(schema.sessions)
    .set({ revokedAt: new Date() })
    .where(eq(schema.sessions.id, sessionId));
}

/** Dev only — guarded at the route. */
export async function devIssueSession(userId: string) {
  await getUser(userId);
  return issueSession(db, userId);
}

export function publicUser(u: typeof schema.users.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    // Every step is derived from the row, never stored — a stored step column drifts the
    // first time someone abandons the flow and comes back days later. See ADR 0005.
    needsPhone: !u.phoneVerifiedAt,
    needsProfile: !u.email,
  };
}

export { issueSession };
