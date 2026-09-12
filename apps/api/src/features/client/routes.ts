import { schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { forbidden } from "../../errors.js";
import { requireSession } from "../../middleware/session.js";
import { joinByCode, previewJoin, rotateJoinCode, setJoinEnabled } from "./join.js";

export const join: Router = Router();

const code = z.string().min(4).max(16);

/** Public — the scanner sees who they are joining before being asked to sign in. */
join.get("/:code", async (req, res) => {
  const { code: c } = z.object({ code }).parse(req.params);
  res.json(await previewJoin(c));
});

join.post("/:code", async (req, res) => {
  const { userId } = requireSession(req);
  const { code: c } = z.object({ code }).parse(req.params);
  res.json(await joinByCode(userId, c));
});

/* ---- coach-side management, scoped to the active studio ---- */

export const studioJoin: Router = Router();

async function requireOwnedStudio(userId: string, studioId: string | null) {
  if (!studioId) throw forbidden("No active studio.");
  const [m] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(
      and(
        eq(schema.memberships.studioId, studioId),
        eq(schema.memberships.userId, userId),
        isNull(schema.memberships.deletedAt),
      ),
    )
    .limit(1);
  if (!m) throw forbidden("You're not a member of that studio.");
  return studioId;
}

studioJoin.get("/join-code", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const studioId = await requireOwnedStudio(userId, activeStudioId);
  const [studio] = await db
    .select({
      joinCode: schema.studios.joinCode,
      joinEnabled: schema.studios.joinEnabled,
      name: schema.studios.name,
    })
    .from(schema.studios)
    .where(eq(schema.studios.id, studioId))
    .limit(1);
  res.json(studio);
});

studioJoin.post("/join-code/rotate", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const studioId = await requireOwnedStudio(userId, activeStudioId);
  res.json({ joinCode: await rotateJoinCode(studioId) });
});

studioJoin.patch("/join-code", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const studioId = await requireOwnedStudio(userId, activeStudioId);
  const { enabled } = z.object({ enabled: z.boolean() }).parse(req.body);
  await setJoinEnabled(studioId, enabled);
  res.json({ joinEnabled: enabled });
});
