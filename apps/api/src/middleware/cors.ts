import type { NextFunction, Request, Response } from "express";
import { env } from "../env.js";

/**
 * A short allowlist with credentials, which is a dozen lines — not worth a dependency.
 * `Allow-Origin` must echo one specific origin rather than `*`, because `*` is rejected
 * whenever credentials are included, so the matched origin is echoed back verbatim.
 *
 * Five apps, one API: coach, client, endorser and admin are separate origins and all
 * carry the session cookie. The marketing site is the odd one out — it has no session at
 * all, and the three routes it calls are public — but it still needs the header, because
 * a browser blocks a cross-origin POST on the response, not on the request.
 */
const ALLOWED: readonly string[] = [
  env.WEB_ORIGIN,
  env.CLIENT_ORIGIN,
  env.ENDORSE_ORIGIN,
  env.ADMIN_ORIGIN,
  env.MARKETING_ORIGIN,
];

export function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (origin && ALLOWED.includes(origin)) {
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
