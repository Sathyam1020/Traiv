import { randomInt } from "node:crypto";
import { newId, schema } from "@traiv/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, forbidden, notFound } from "../../errors.js";

// No 0/O/1/I/L/U — these codes get read aloud in a gym and typed by hand when a camera
// won't focus, so every character has to be unmistakable.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LENGTH = 8;

/** Free and Starter cap the roster; Pro and Studio do not. Mirrors ADR 0001. */
const SEAT_LIMIT: Record<string, number | null> = {
  free: 2,
  starter: 8,
  pro: null,
  studio: null,
};

export function newJoinCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return out;
}

export type JoinOutcome =
  | { status: "joined"; clientId: string; studioName: string }
  | { status: "already_joined"; clientId: string; studioName: string };

/** Public preview so the scanner sees who they're about to join before signing in. */
export async function previewJoin(code: string) {
  const [studio] = await db
    .select({
      id: schema.studios.id,
      name: schema.studios.name,
      brandDisplayName: schema.studios.brandDisplayName,
      joinEnabled: schema.studios.joinEnabled,
    })
    .from(schema.studios)
    .where(and(eq(schema.studios.joinCode, code.toUpperCase()), isNull(schema.studios.deletedAt)))
    .limit(1);

  if (!studio) throw notFound("That link isn't valid any more.");
  if (!studio.joinEnabled)
    throw badRequest("join_disabled", "This coach isn't accepting new clients.");

  return { studioId: studio.id, name: studio.brandDisplayName || studio.name };
}

/**
 * Attach a signed-in user to a studio by its join code.
 *
 * Everything happens in one transaction, and the seat limit is counted inside it —
 * checking outside would let two people scanning simultaneously both take the last slot.
 */
export async function joinByCode(userId: string, rawCode: string): Promise<JoinOutcome> {
  const code = rawCode.toUpperCase();

  return db.transaction(async (tx) => {
    const [studio] = await tx
      .select()
      .from(schema.studios)
      .where(and(eq(schema.studios.joinCode, code), isNull(schema.studios.deletedAt)))
      .limit(1);

    if (!studio) throw notFound("That link isn't valid any more.");
    if (!studio.joinEnabled) {
      throw badRequest("join_disabled", "This coach isn't accepting new clients.");
    }

    // A coach cannot be a client of their own studio.
    const [staff] = await tx
      .select({ id: schema.memberships.id })
      .from(schema.memberships)
      .where(
        and(
          eq(schema.memberships.studioId, studio.id),
          eq(schema.memberships.userId, userId),
          isNull(schema.memberships.deletedAt),
        ),
      )
      .limit(1);
    if (staff) {
      throw badRequest("own_studio", "You coach at this studio, so you can't join it as a client.");
    }

    // Scanning twice is a no-op rather than a second row.
    const [existing] = await tx
      .select({ id: schema.clients.id })
      .from(schema.clients)
      .where(
        and(
          eq(schema.clients.studioId, studio.id),
          eq(schema.clients.userId, userId),
          isNull(schema.clients.deletedAt),
        ),
      )
      .limit(1);

    if (existing) {
      return {
        status: "already_joined" as const,
        clientId: existing.id,
        studioName: studio.brandDisplayName || studio.name,
      };
    }

    const limit = SEAT_LIMIT[studio.tier] ?? null;
    if (limit !== null) {
      // Lock the studio row so concurrent joins serialise on the count.
      await tx
        .select({ id: schema.studios.id })
        .from(schema.studios)
        .where(eq(schema.studios.id, studio.id))
        .for("update");

      const [{ count } = { count: 0 }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.clients)
        .where(and(eq(schema.clients.studioId, studio.id), isNull(schema.clients.deletedAt)));

      if (count >= limit) {
        throw forbidden("This coach's roster is full. Ask them to upgrade, then try again.");
      }
    }

    // The owner takes the relationship; assignment to another coach comes later.
    const [owner] = await tx
      .select({ id: schema.memberships.id })
      .from(schema.memberships)
      .where(
        and(
          eq(schema.memberships.studioId, studio.id),
          eq(schema.memberships.role, "owner"),
          isNull(schema.memberships.deletedAt),
        ),
      )
      .limit(1);
    if (!owner) throw notFound("That studio has no coach.");

    const [user] = await tx
      .select({ name: schema.users.name, phone: schema.users.phone, email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    const clientId = newId();
    await tx.insert(schema.clients).values({
      id: clientId,
      studioId: studio.id,
      coachId: owner.id,
      userId,
      name: user?.name || "New client",
      phone: user?.phone ?? null,
      email: user?.email ?? null,
      joinedVia: "join_code",
    });

    return {
      status: "joined" as const,
      clientId,
      studioName: studio.brandDisplayName || studio.name,
    };
  });
}

/** Rotating kills every QR and link already in circulation. */
export async function rotateJoinCode(studioId: string) {
  const code = newJoinCode();
  await db
    .update(schema.studios)
    .set({ joinCode: code, updatedAt: new Date() })
    .where(eq(schema.studios.id, studioId));
  return code;
}

export async function setJoinEnabled(studioId: string, enabled: boolean) {
  await db
    .update(schema.studios)
    .set({ joinEnabled: enabled, updatedAt: new Date() })
    .where(eq(schema.studios.id, studioId));
}
