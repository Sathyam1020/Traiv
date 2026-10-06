import { schema } from "@traiv/db";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { Router } from "express";
import { db } from "../../db.js";
import { requireAdmin } from "../../middleware/admin.js";

export const admin: Router = Router();

/**
 * Platform totals.
 *
 * Counts only — no names, no phone numbers, nothing about an individual coach or client.
 * An admin surface that reads personal data is a far larger thing to secure, and nothing
 * here needs it yet.
 */
admin.get("/stats", requireAdmin(), async (_req, res) => {
  const [[trainers], [clients], [studios], [endorsers], [referrals]] = await Promise.all([
    // A trainer is someone holding a live staff membership, counted once however many
    // studios they work in.
    db
      .select({ n: sql<number>`count(distinct ${schema.memberships.userId})::int` })
      .from(schema.memberships)
      .innerJoin(schema.studios, eq(schema.studios.id, schema.memberships.studioId))
      .where(
        and(
          eq(schema.memberships.status, "active"),
          isNull(schema.memberships.deletedAt),
          isNull(schema.studios.deletedAt),
        ),
      ),

    // A client is a coaching relationship, not a person: somebody coached by two studios
    // counts twice, because that is what a roster and a seat limit count.
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.clients)
      .where(
        and(isNull(schema.clients.deletedAt), inArray(schema.clients.status, ["active", "paused"])),
      ),

    db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.studios)
      .where(isNull(schema.studios.deletedAt)),

    db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.endorsers)
      .where(isNull(schema.endorsers.deletedAt)),

    db.select({ n: sql<number>`count(*)::int` }).from(schema.referrals),
  ]);

  res.json({
    trainers: trainers?.n ?? 0,
    clients: clients?.n ?? 0,
    studios: studios?.n ?? 0,
    endorsers: endorsers?.n ?? 0,
    referrals: referrals?.n ?? 0,
  });
});

/** Whether the caller is the admin. The admin app uses it to decide what to render. */
admin.get("/me", requireAdmin(), (_req, res) => {
  res.json({ admin: true });
});
