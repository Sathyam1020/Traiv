import type { NextFunction, Request, Response } from "express";
import { env } from "../env.js";

/**
 * One known origin with credentials, which is ten lines — not worth a dependency.
 * `Allow-Origin` must echo a specific origin rather than `*`, because `*` is rejected
 * whenever credentials are included.
 */
export function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (origin === env.WEB_ORIGIN) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.header("Vary", "Origin");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
}
