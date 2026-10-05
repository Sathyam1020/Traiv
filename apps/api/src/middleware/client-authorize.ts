import { schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { db } from "../db.js";
import { forbidden } from "../errors.js";
import { requireSession } from "./session.js";

export type ClientStatus = (typeof schema.clientStatus.enumValues)[number];

/** Proof that this user is a client of this studio, established per request. */
export type ClientAuth = {
  studioId: string;
  clientId: string;
  status: ClientStatus;
};

declare global {
  namespace Express {
    interface Request {
      client?: ClientAuth;
    }
  }
}

/**
 * Which statuses may reach the client app at all.
 *
 * `waiting` and `frozen` are in here because both must be *told* their state — a queued
 * client needs to see they are queued, and ADR 0013 requires a frozen client be shown
 * they are frozen. Refusing them would leave the app with a bare 403 and nothing to say.
 */
const READABLE: ReadonlySet<ClientStatus> = new Set<ClientStatus>([
  "active",
  "paused",
  "waiting",
  "frozen",
]);

/**
 * Which statuses may create coaching activity. Only `active`.
 *
 * `paused` is the coach pausing the relationship, `frozen` is a downgrade pushing them
 * out of a seat, and `waiting` was never admitted. None of the three may log a workout.
 */
const WRITABLE: ReadonlySet<ClientStatus> = new Set<ClientStatus>(["active"]);

/**
 * The single place that decides whether a user is a client of a studio.
 *
 * Deliberately separate from `requireStudio`: membership means staff of a studio, and
 * neither relationship stands in for the other. A user may be staff in one studio and a
 * client in another on one session, so this is evaluated per request against the studio
 * the request names. See ADR 0014.
 *
 * `archived`, deleted, and never-a-client are refused identically, so the gate cannot be
 * used to discover whether a relationship exists.
 */
export async function authorizeClient(userId: string, studioId: string): Promise<ClientAuth> {
  const [row] = await db
    .select({ id: schema.clients.id, status: schema.clients.status })
    .from(schema.clients)
    .innerJoin(schema.studios, eq(schema.studios.id, schema.clients.studioId))
    .where(
      and(
        eq(schema.clients.studioId, studioId),
        eq(schema.clients.userId, userId),
        isNull(schema.clients.deletedAt),
        isNull(schema.studios.deletedAt),
      ),
    )
    .limit(1);

  if (!row || !READABLE.has(row.status)) {
    throw forbidden("You don't have access to that studio.");
  }
  return { studioId, clientId: row.id, status: row.status };
}

/** Reads the request's client context. Throws if the route forgot the middleware. */
export function requireClientAuth(req: Request): ClientAuth {
  if (!req.client) {
    throw new Error("requireClient middleware missing on a client-scoped route");
  }
  return req.client;
}

export type RequireClientOptions = {
  /** Require a status that may create coaching activity. Omit for read-only access. */
  write?: boolean;
};

/**
 * Authorization for every client-scoped route.
 *
 * The studio comes from the URL, never from `session.activeStudioId`. That column is
 * staff context: a user who is staff in A and a client in B carries A in their session,
 * and resolving a client route from it would look in the wrong studio entirely. Taking
 * it from the path is safe for the same reason a staff id in the path is safe — it is
 * verified against the relationship, never trusted.
 *
 * Routes name the parameter `studioId`.
 */
export function requireClient(options: RequireClientOptions = {}): RequestHandler {
  // Named so the route-coverage test can find it, exactly as requireStudioHandler is.
  return async function requireClientHandler(req: Request, _res: Response, next: NextFunction) {
    try {
      const { userId } = requireSession(req);

      const raw = req.params.studioId;
      const studioId = typeof raw === "string" && raw.length > 0 ? raw : undefined;
      if (!studioId) throw forbidden("No studio in the request.");

      const auth = await authorizeClient(userId, studioId);

      if (options.write && !WRITABLE.has(auth.status)) {
        throw forbidden("Your coaching is paused, so this can't be changed right now.");
      }

      req.client = auth;
      next();
    } catch (err) {
      next(err);
    }
  };
}
