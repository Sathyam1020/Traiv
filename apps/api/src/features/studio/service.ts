import { randomInt } from "node:crypto";
import { newId, schema } from "@traiv/db";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "../../db.js";
import { forbidden, notFound } from "../../errors.js";
import { newJoinCode } from "../client/join.js";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

/**
 * `sathyam-k3n9qa` — first name plus six random characters.
 *
 * A random suffix rather than collision-retry logic: one insert, no read-then-write race,
 * and no `-2` / `-3` tails. This becomes `<slug>.traiv.app` when white-label ships, so it
 * has to be URL-safe and stable.
 */
// Explicit alphabet. base64url would have been shorter to write, but it emits `-` and
// `_` — an underscore is not legal in a hostname, and this becomes <slug>.traiv.app.
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

  await tx.insert(schema.studios).values({
    id: studioId,
    slug: studioSlug(user.name),
    name: displayName,
    tier: "free",
    joinCode: newJoinCode(),
  });

  await tx.insert(schema.memberships).values({
    id: newId(),
    studioId,
    userId: user.id,
    role: "owner",
    status: "active",
  });

  return studioId;
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

/** Switching studios is a membership check, not a preference — verify before setting. */
export async function activateStudio(userId: string, sessionId: string, studioId: string) {
  const mine = await listStudios(userId);
  const target = mine.find((s) => s.id === studioId);
  if (!target) throw forbidden("You're not a member of that studio.");

  await db
    .update(schema.sessions)
    .set({ activeStudioId: studioId })
    .where(eq(schema.sessions.id, sessionId));

  return target;
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
  if (!mine.length) throw notFound("No studio for this account.");

  if (current && mine.some((s) => s.id === current)) return current;

  const invited = mine.find((s) => s.role === "coach");
  const own = mine.find((s) => s.role === "owner");
  return (invited ?? own ?? mine[0])?.id as string;
}
