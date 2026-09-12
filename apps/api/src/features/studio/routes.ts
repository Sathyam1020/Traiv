import { Router } from "express";
import { z } from "zod";
import { requireSession } from "../../middleware/session.js";
import { activateStudio, listStudios, resolveActiveStudio } from "./service.js";

export const studios: Router = Router();

studios.get("/", async (req, res) => {
  const { userId, sessionId: _s, activeStudioId } = requireSession(req);
  const mine = await listStudios(userId);
  res.json({ studios: mine, activeStudioId: await resolveActiveStudio(userId, activeStudioId) });
});

studios.post("/:id/activate", async (req, res) => {
  const { userId, sessionId } = requireSession(req);
  const { id } = z.object({ id: z.string().min(1) }).parse(req.params);
  const studio = await activateStudio(userId, sessionId, id);
  res.json({ studio });
});
