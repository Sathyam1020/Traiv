import { randomInt } from "node:crypto";
import { newId, schema } from "@traiv/db";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";

/** Same alphabet as the join code: no 0/O/1/I/L/U, because this gets read aloud. */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LENGTH = 8;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export function newEndorserCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return out;
}

export function normaliseCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export type EndorserSummary = {
  id: string;
  code: string;
  createdAt: Date;
  referrals: number;
};

/**
 * Become an endorser, or return the one you already are.
 *
 * Idempotent on purpose. "Join the programme" is a button someone will double-tap, and
 * two codes for one person would let them split referrals across both and reach milestone
 * bonuses twice. The partial unique index on `userId` is the real guarantee; this just
 * makes the common case not throw.
 */
export async function becomeEndorser(userId: string): Promise<EndorserSummary> {
  const existing = await findEndorserByUser(userId);
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt++) {
    const [row] = await db
      .insert(schema.endorsers)
      .values({ id: newId(), userId, code: newEndorserCode() })
      // Covers both races at once: a second tap (userId collides) and the astronomically
      // unlikely code collision. Either way nothing is inserted and we look again.
      .onConflictDoNothing()
      .returning();

    if (row) return { id: row.id, code: row.code, createdAt: row.createdAt, referrals: 0 };

    const now = await findEndorserByUser(userId);
    if (now) return now; // lost the race to our own second request — that is a success
  }
  throw new Error("could not allocate an endorser code");
}

export async function findEndorserByUser(userId: string): Promise<EndorserSummary | null> {
  // A join and a group-by, not a correlated subquery. Drizzle renders interpolated
  // columns unqualified inside a `sql` template, so `where endorser_id = id` resolved
  // `id` against the subquery's own table — comparing referral.endorser_id to
  // referral.id, which is never true. It returned 0 rather than failing, which is the
  // worst way for a count to be wrong.
  const [row] = await db
    .select({
      id: schema.endorsers.id,
      code: schema.endorsers.code,
      createdAt: schema.endorsers.createdAt,
      referrals: sql<number>`count(${schema.referrals.id})::int`,
    })
    .from(schema.endorsers)
    .leftJoin(schema.referrals, eq(schema.referrals.endorserId, schema.endorsers.id))
    .where(and(eq(schema.endorsers.userId, userId), isNull(schema.endorsers.deletedAt)))
    .groupBy(schema.endorsers.id)
    .limit(1);

  return row ?? null;
}

/**
 * Public check, used before an OTP is sent.
 *
 * Validating at signup rather than after verification means a typo is caught while the
 * person can still fix it. Silently dropping a bad code would cost the endorser a
 * referral they earned, and neither party would ever find out.
 *
 * Returns only the endorser's display name — enough to confirm "yes, that is who you
 * meant", and nothing that would turn this into a way to enumerate codes.
 */
export async function previewEndorserCode(rawCode: string): Promise<{ name: string }> {
  const code = normaliseCode(rawCode);

  const [row] = await db
    .select({ name: schema.users.name })
    .from(schema.endorsers)
    .innerJoin(schema.users, eq(schema.users.id, schema.endorsers.userId))
    .where(
      and(
        eq(schema.endorsers.code, code),
        isNull(schema.endorsers.deletedAt),
        isNull(schema.users.deletedAt),
      ),
    )
    .limit(1);

  if (!row) throw notFound("That endorser code isn't valid.");
  return { name: row.name || "A Traiv endorser" };
}

/**
 * Attribute a studio to an endorser. Called once, inside the signup transaction.
 *
 * Deliberately forgiving: a code that has stopped being valid between the challenge and
 * the verification does not fail signup. Losing one attribution is bad; refusing to
 * create someone's account over it is worse. The caller is creating a user — that has to
 * succeed.
 *
 * Returns whether the referral was recorded, so the caller can say so.
 */
export async function attributeStudio(
  tx: Tx,
  input: { studioId: string; ownerUserId: string; code: string },
): Promise<boolean> {
  const code = normaliseCode(input.code);

  const [endorser] = await tx
    .select({ id: schema.endorsers.id, userId: schema.endorsers.userId })
    .from(schema.endorsers)
    .where(and(eq(schema.endorsers.code, code), isNull(schema.endorsers.deletedAt)))
    .limit(1);

  if (!endorser) return false;

  // You cannot refer yourself. Unreachable at signup today — the user is created in this
  // same transaction, so they cannot already hold a code — but the rule is the rule, and
  // the day a code can be entered after signup this is the only thing standing in the way.
  if (endorser.userId === input.ownerUserId) return false;

  const [row] = await tx
    .insert(schema.referrals)
    .values({
      id: newId(),
      studioId: input.studioId,
      endorserId: endorser.id,
      codeUsed: code,
    })
    // A studio is attributed once, ever. Re-entering a code later must not overwrite who
    // actually brought this coach in.
    .onConflictDoNothing()
    .returning({ id: schema.referrals.id });

  return Boolean(row);
}

export type ReferralRow = {
  studioName: string;
  joinedAt: Date;
  tier: string;
};

/**
 * Who this endorser brought in.
 *
 * Studio name and join date only. An endorser is owed money for these, so they get to
 * see them — but they are not staff of those studios and get nothing else about them.
 */
export async function listReferrals(userId: string): Promise<ReferralRow[]> {
  const endorser = await findEndorserByUser(userId);
  if (!endorser) throw badRequest("not_an_endorser", "You haven't joined the programme yet.");

  return db
    .select({
      studioName: schema.studios.name,
      joinedAt: schema.referrals.createdAt,
      tier: schema.studios.tier,
    })
    .from(schema.referrals)
    .innerJoin(schema.studios, eq(schema.studios.id, schema.referrals.studioId))
    .where(and(eq(schema.referrals.endorserId, endorser.id), isNull(schema.studios.deletedAt)))
    .orderBy(desc(schema.referrals.createdAt));
}
