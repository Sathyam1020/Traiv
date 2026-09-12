import { schema } from "@traiv/db";
import { and, eq, gt, isNull } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../db.js";
import { unauthorized } from "../errors.js";
import { readCookie, SESSION_COOKIE } from "../lib/cookies.js";
import { hash } from "../lib/crypto.js";

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

  const [row] = await db
    .select({
      id: schema.sessions.id,
      userId: schema.sessions.userId,
      activeStudioId: schema.sessions.activeStudioId,
    })
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.tokenHash, hash(token)),
        isNull(schema.sessions.revokedAt),
        gt(schema.sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (row) {
    req.auth = { userId: row.userId, sessionId: row.id, activeStudioId: row.activeStudioId };
    await db
      .update(schema.sessions)
      .set({ lastUsedAt: new Date() })
      .where(eq(schema.sessions.id, row.id));
  }
  next();
}

export function requireSession(req: Request): SessionUser {
  if (!req.auth) throw unauthorized();
  return req.auth;
}
