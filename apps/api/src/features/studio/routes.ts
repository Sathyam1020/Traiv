import { Router } from "express";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { requireSession } from "../../middleware/session.js";
import { activateStudio, listStudios, preferredStudio } from "./service.js";

export const studios: Router = Router();

/**
 * Not studio-scoped — it lists the memberships the caller has, so it is the one place
 * that legitimately reads across studios. The active studio is derived from that same
 * list rather than re-queried, and a session naming a studio no longer in it simply
 * does not win.
 */
studios.get("/", async (req, res) => {
  const { userId, activeStudioId } = requireSession(req);
  const mine = await listStudios(userId);
  const active = mine.some((s) => s.id === activeStudioId) ? activeStudioId : preferredStudio(mine);
  res.json({ studios: mine, activeStudioId: active });
});

/** Switching is an authorization decision, so it goes through the same gate as any other. */
studios.post("/:id/activate", requireStudio({ param: "id" }), async (req, res) => {
  const { sessionId } = requireSession(req);
  const { studioId } = requireStudioAuth(req);
  res.json({ studio: await activateStudio(sessionId, studioId) });
});
