import { randomInt } from "node:crypto";
import { newId, schema } from "@traiv/db";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, forbidden, notFound } from "../../errors.js";
import { isUniqueViolation } from "../../lib/db-errors.js";
import { membershipIsLive } from "../studio/service.js";

// No 0/O/1/I/L/U — these codes get read aloud in a gym and typed by hand when a camera
// won't focus, so every character has to be unmistakable.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LENGTH = 8;

/** Free and Starter cap the roster; Pro and Studio do not. Mirrors ADR 0001. */
/** Active and paused hold a seat; waiting, frozen and archived do not. ADR 0013. */
const SEAT_CONSUMING = ["active", "paused"] as const;

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
    // Locked on the way in, not just around the seat count. The duplicate check was a
    // read before the lock, so two taps in the same second both saw no existing row,
    // both inserted, and the second hit the unique index as a 500 instead of coming back
    // as "already joined". Holding the row for the whole transaction serialises every
    // join into this studio.
    const [studio] = await tx
      .select()
      .from(schema.studios)
      .where(and(eq(schema.studios.joinCode, code), isNull(schema.studios.deletedAt)))
      .limit(1)
      .for("update");

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
          membershipIsLive(schema.memberships),
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
      // Only statuses that actually occupy a seat — ADR 0013. Counting every undeleted
      // row meant an archived client held a place forever, and would mean queued and
      // frozen clients blocked each other out of the very list they are queued in.
      const [{ count } = { count: 0 }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.clients)
        .where(
          and(
            eq(schema.clients.studioId, studio.id),
            isNull(schema.clients.deletedAt),
            inArray(schema.clients.status, SEAT_CONSUMING),
          ),
        );

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
          membershipIsLive(schema.memberships),
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

/**
 * Rotating kills every QR and link already in circulation.
 *
 * Retries on collision. A random code meeting a unique index is a 1-in-6.5e11 event per
 * attempt, which is small enough to ignore right up until it happens to a coach mid-
 * demo and surfaces as a 500. Retrying is three lines; explaining the 500 is not.
 */
export async function rotateJoinCode(studioId: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newJoinCode();
    try {
      const [updated] = await db
        .update(schema.studios)
        .set({ joinCode: code, updatedAt: new Date() })
        .where(and(eq(schema.studios.id, studioId), isNull(schema.studios.deletedAt)))
        .returning({ id: schema.studios.id });

      if (!updated) throw notFound("That studio no longer exists.");
      return code;
    } catch (err) {
      if (!isUniqueViolation(err) || attempt === 4) throw err;
    }
  }
  // Unreachable: the loop either returns or throws.
  throw new Error("could not allocate a join code");
}

export async function setJoinEnabled(studioId: string, enabled: boolean) {
  await db
    .update(schema.studios)
    .set({ joinEnabled: enabled, updatedAt: new Date() })
    .where(eq(schema.studios.id, studioId));
}
