import { randomInt } from "node:crypto";
import { newId, schema } from "@traiv/db";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "../../db.js";
import { notFound } from "../../errors.js";
import { newJoinCode } from "../client/join.js";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

/**
 * `sathyam-k3n9qa` — first name plus six random characters.
 *
 * A random suffix rather than collision-retry logic: one insert, no read-then-write race,
 * and no `-2` / `-3` tails. This becomes `<slug>.traiv.fit` when white-label ships, so it
 * has to be URL-safe and stable.
 */
// Explicit alphabet. base64url would have been shorter to write, but it emits `-` and
// `_` — an underscore is not legal in a hostname, and this becomes <slug>.traiv.fit.
const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function studioSlug(name: string): string {
  const first =
    name
      .trim()
      .split(/\s+/)[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "studio";

  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += SLUG_CHARS[randomInt(SLUG_CHARS.length)];
  return `${first}-${suffix}`;
}

/**
 * Every trainer owns a studio from the moment they sign up.
 *
 * Created in the same transaction as the user, so the "at least one studio" rule can
 * never be violated by a partial failure. Free tier — the subscription belongs to the
 * studio, not the person, so an invited coach still gets their own on free (ADR 0001).
 */
export async function createDefaultStudio(tx: Tx, user: { id: string; name: string }) {
  const studioId = newId();
  const displayName = user.name.trim() || "My studio";

  // Slug and join code are both random against unique indexes, and this runs inside the
  // signup transaction — so a collision would abort the whole thing and lose the user,
  // not just the studio. `onConflictDoNothing` leaves the transaction usable, so a clash
  // costs a retry instead of an account.
  //
  // The slug is the real risk: six random characters behind a first name, so two coaches
  // called Priya collide far sooner than two join codes do.
  let created = false;
  for (let attempt = 0; attempt < 5 && !created; attempt++) {
    const [row] = await tx
      .insert(schema.studios)
      .values({
        id: studioId,
        slug: studioSlug(user.name),
        name: displayName,
        tier: "free",
        joinCode: newJoinCode(),
      })
      .onConflictDoNothing()
      .returning({ id: schema.studios.id });
    created = Boolean(row);
  }
  if (!created) throw new Error("could not allocate a studio slug and join code");

  await tx.insert(schema.memberships).values({
    id: newId(),
    studioId,
    userId: user.id,
    role: "owner",
    status: "active",
  });

  return studioId;
}

/**
 * What makes a membership count.
 *
 * Two conditions, and checking only one is the mistake waiting to happen — it already
 * happened: `requireStudio` required `status = 'active'` while `joinByCode` checked only
 * `deletedAt`, so a suspended owner could still be handed a new client. Every caller uses
 * this, so the two can never disagree again.
 */
export function membershipIsLive(t: typeof schema.memberships) {
  return and(eq(t.status, "active"), isNull(t.deletedAt));
}

export async function listStudios(userId: string, tx: Tx = db) {
  return tx
    .select({
      id: schema.studios.id,
      slug: schema.studios.slug,
      name: schema.studios.name,
      tier: schema.studios.tier,
      role: schema.memberships.role,
    })
    .from(schema.memberships)
    .innerJoin(schema.studios, eq(schema.studios.id, schema.memberships.studioId))
    .where(
      and(
        eq(schema.memberships.userId, userId),
        eq(schema.memberships.status, "active"),
        isNull(schema.memberships.deletedAt),
        isNull(schema.studios.deletedAt),
      ),
    )
    .orderBy(asc(schema.studios.createdAt));
}

/**
 * Records the switch. Membership was verified by `requireStudio` before this runs —
 * this must not be called on a studio that has not been through that gate.
 */
export async function activateStudio(sessionId: string, studioId: string) {
  await db
    .update(schema.sessions)
    .set({ activeStudioId: studioId })
    .where(eq(schema.sessions.id, sessionId));

  const [studio] = await db
    .select({
      id: schema.studios.id,
      slug: schema.studios.slug,
      name: schema.studios.name,
      tier: schema.studios.tier,
    })
    .from(schema.studios)
    .where(eq(schema.studios.id, studioId))
    .limit(1);
  return studio;
}

/**
 * Which studio a session opens in.
 *
 * Priority: what the session already had → the studio they were invited into, if they
 * were → their own. An invited coach lands in the studio that invited them, which is
 * what they came for.
 */
export async function resolveActiveStudio(userId: string, current?: string | null, tx: Tx = db) {
  const mine = await listStudios(userId, tx);
  if (current && mine.some((s) => s.id === current)) return current;

  const picked = preferredStudio(mine);
  if (!picked) throw notFound("No studio for this account.");
  return picked;
}

/**
 * The same choice as `resolveActiveStudio`, but `null` instead of a throw when the user
 * belongs to no studio — which is the normal case for a client, who has an account but
 * never a membership. Callers issuing a session use this; it must not refuse a client.
 */
export async function defaultStudioFor(userId: string, tx: Tx = db) {
  return preferredStudio(await listStudios(userId, tx));
}

/** Null when the user belongs to no studio — a client, who never has a membership. */
export function preferredStudio(mine: Awaited<ReturnType<typeof listStudios>>): string | null {
  const invited = mine.find((s) => s.role === "coach");
  const own = mine.find((s) => s.role === "owner");
  return (invited ?? own ?? mine[0])?.id ?? null;
}
