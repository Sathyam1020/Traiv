import { schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
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

studioJoin.get("/join-code", requireStudio(), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
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

// Owner only: rotating invalidates every QR and link the studio has already handed out.
studioJoin.post("/join-code/rotate", requireStudio({ role: "owner" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  res.json({ joinCode: await rotateJoinCode(studioId) });
});

// Owner only: closing the door to new clients is a studio-administration decision.
studioJoin.patch("/join-code", requireStudio({ role: "owner" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const { enabled } = z.object({ enabled: z.boolean() }).parse(req.body);
  await setJoinEnabled(studioId, enabled);
  res.json({ joinEnabled: enabled });
});

/* ---- client-side, scoped to the studio named in the URL ---- */

export const clientApp: Router = Router();

/**
 * Who the client is to this studio, and whose studio it is.
 *
 * The only client route that exists yet, and it has to: a waiting client needs to see
 * they are queued and a frozen one needs to see they are frozen (ADR 0013), which is
 * impossible if every status but `active` is refused outright. Branding comes along
 * because it is on ADR 0014's allowed-read list and the app cannot render a studio
 * without it.
 *
 * Nothing here touches plans, workouts or check-ins — those data models do not exist,
 * and their permissions are deliberately undecided.
 */
clientApp.get("/:studioId/me", requireClient(), async (req, res) => {
  const { studioId, clientId, status } = requireClientAuth(req);

  const [studio] = await db
    .select({
      name: schema.studios.name,
      brandDisplayName: schema.studios.brandDisplayName,
      brandLogoUrl: schema.studios.brandLogoUrl,
      brandColor: schema.studios.brandColor,
    })
    .from(schema.studios)
    .where(eq(schema.studios.id, studioId))
    .limit(1);

  res.json({
    clientId,
    status,
    studio: {
      id: studioId,
      name: studio?.brandDisplayName || studio?.name,
      logoUrl: studio?.brandLogoUrl ?? null,
      color: studio?.brandColor ?? null,
    },
  });
});
