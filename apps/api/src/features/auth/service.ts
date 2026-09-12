import { newId, schema } from "@traiv/db";
import { and, desc, eq, gte, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound, tooManyRequests, unauthorized } from "../../errors.js";
import { sendOtp } from "../../integrations/otp/index.js";
import { hash, matches, newOtp, newSessionToken } from "../../lib/crypto.js";
import { createDefaultStudio, resolveActiveStudio } from "../studio/service.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_HOUR = 5;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Stored E.164. The UI collects ten digits and we own the country code for now. */
export function toE164(tenDigits: string): string {
  return `+91${tenDigits}`;
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

  const code = newOtp();
  const challengeId = newId();

  await db.insert(schema.authChallenges).values({
    id: challengeId,
    purpose: "phone_verify",
    phone,
    codeHash: hash(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
    requestIp: input.ip ?? null,
    pendingName: input.name?.trim() || null,
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
  if (challenge.consumedAt) throw badRequest("code_used", "That code has already been used.");
  if (challenge.expiresAt < new Date()) throw badRequest("code_expired", "That code has expired.");
  if (challenge.attempts >= MAX_ATTEMPTS) {
    throw tooManyRequests("Too many attempts. Request a new code.");
  }

  if (!matches(input.code, challenge.codeHash)) {
    await db
      .update(schema.authChallenges)
      .set({ attempts: challenge.attempts + 1 })
      .where(eq(schema.authChallenges.id, challenge.id));
    throw badRequest("code_invalid", "That code isn't right. Check the latest message.");
  }

  return db.transaction(async (tx) => {
    await tx
      .update(schema.authChallenges)
      .set({ consumedAt: new Date() })
      .where(eq(schema.authChallenges.id, challenge.id));

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
        await tx.insert(schema.authIdentities).values({
          id: newId(),
          userId: user.id,
          provider: "phone",
          providerUid: phone,
        });
        // Same transaction as the user, so "every trainer has a studio" cannot be
        // broken by a partial failure.
        await createDefaultStudio(tx, user);
      }
    } else if (!user.phoneVerifiedAt) {
      await tx
        .update(schema.users)
        .set({ phoneVerifiedAt: new Date() })
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
    activeStudioId: activeStudioId ?? null,
  });
  return { token, expiresAt };
}

/** Signup step two. Email is stored unverified on purpose — see ADR 0005. */
export async function completeProfile(userId: string, input: { email?: string; name?: string }) {
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (input.email?.trim()) patch.email = input.email.trim().toLowerCase();
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
