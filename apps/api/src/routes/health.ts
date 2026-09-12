import { Router } from "express";

export const health: Router = Router();

health.get("/", (_req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});
