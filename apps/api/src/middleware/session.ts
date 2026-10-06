import { schema } from "@traiv/db";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../db.js";
import { unauthorized } from "../errors.js";
import { readCookie, SESSION_COOKIE } from "../lib/cookies.js";
import { hash } from "../lib/crypto.js";

/** How stale `lastUsedAt` is allowed to get before a request refreshes it. */
const LAST_USED_THROTTLE_MS = 5 * 60 * 1000;

export type SessionUser = { userId: string; sessionId: string; activeStudioId: string | null };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: SessionUser;
    }
  }
}

/**
 * Resolves the session on every request. Opaque token, looked up in the table, so
 * revoking a row ends the session immediately — which a JWT cannot do. See ADR 0005.
 */
export async function loadSession(req: Request, _res: Response, next: NextFunction) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return next();

  // Joined to the user, because deletion is soft: a deleted account's sessions stay in
  // the table and would keep authenticating until every call remembered to check. One
  // join here is the only place that has to remember.
  const [row] = await db
    .select({
      id: schema.sessions.id,
      userId: schema.sessions.userId,
      activeStudioId: schema.sessions.activeStudioId,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(
      and(
        eq(schema.sessions.tokenHash, hash(token)),
        isNull(schema.sessions.revokedAt),
        gt(schema.sessions.expiresAt, new Date()),
        isNull(schema.users.deletedAt),
      ),
    )
    .limit(1);

  if (row) {
    req.auth = { userId: row.userId, sessionId: row.id, activeStudioId: row.activeStudioId };

    // Throttled, and not awaited. Touching this on every authenticated request turns
    // every page load into a write on the hottest table in the database — dead tuples,
    // WAL, and autovacuum pressure, for a column nothing reads at that resolution.
    // Five minutes of granularity is irrelevant against a 30-day session.
    void db
      .update(schema.sessions)
      .set({ lastUsedAt: new Date() })
      .where(
        and(
          eq(schema.sessions.id, row.id),
          lt(schema.sessions.lastUsedAt, new Date(Date.now() - LAST_USED_THROTTLE_MS)),
        ),
      )
      .catch(() => {
        // A missed touch costs nothing; failing the request over it would cost a login.
      });
  }
  next();
}

export function requireSession(req: Request): SessionUser {
  if (!req.auth) throw unauthorized();
  return req.auth;
}
