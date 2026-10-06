import { schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { db } from "../db.js";
import { forbidden } from "../errors.js";
import { requireSession } from "./session.js";

export type MembershipRole = (typeof schema.membershipRole.enumValues)[number];

/** Proof that this user may act in this studio, established per request. */
export type StudioAuth = {
  studioId: string;
  membershipId: string;
  role: MembershipRole;
};

declare global {
  namespace Express {
    interface Request {
      studio?: StudioAuth;
    }
  }
}

/**
 * The single place that decides whether a user may act in a studio.
 *
 * Membership is the source of truth, and it is read on every request — not cached, not
 * inferred from the session. A coach removed from a studio loses access on their next
 * call even though their session is still valid and still names that studio.
 *
 * A studio that does not exist and a studio the caller is not a member of return the
 * same error. Distinguishing them would turn this into an oracle for which studio ids
 * are real.
 */
export async function authorizeStudio(userId: string, studioId: string): Promise<StudioAuth> {
  const [row] = await db
    .select({ id: schema.memberships.id, role: schema.memberships.role })
    .from(schema.memberships)
    .innerJoin(schema.studios, eq(schema.studios.id, schema.memberships.studioId))
    .where(
      and(
        eq(schema.memberships.studioId, studioId),
        eq(schema.memberships.userId, userId),
        eq(schema.memberships.status, "active"),
        isNull(schema.memberships.deletedAt),
        isNull(schema.studios.deletedAt),
      ),
    )
    .limit(1);

  if (!row) throw forbidden("You don't have access to that studio.");
  return { studioId, membershipId: row.id, role: row.role };
}

/** Reads the request's authorization context. Throws if the route forgot the middleware. */
export function requireStudioAuth(req: Request): StudioAuth {
  if (!req.studio) {
    throw new Error("requireStudio middleware missing on a studio-scoped route");
  }
  return req.studio;
}

export type RequireStudioOptions = {
  /**
   * Route parameter naming the studio, e.g. `{ param: "id" }` for `/studios/:id/...`.
   * Required — there is no implicit tenant.
   *
   * Only a parameter the route declares is read. Body and query are deliberately
   * ignored: a caller must not be able to redirect an endpoint at another studio by
   * adding a field the route never asked for.
   */
  param: string;
  /** Restrict to a role. Omit to allow any member. */
  role?: MembershipRole;
};

/**
 * Authorization for every studio-scoped route.
 *
 * The studio always comes from the request, never from the session. One session is shared
 * by every tab, so resolving the tenant from `activeStudioId` meant a coach with studio A
 * open in one tab and B in another had the first tab's writes land in B — and the
 * membership check passed, because they belong to both. `activeStudioId` is now only
 * where to land after signing in, and nothing authorizes against it.
 *
 * Accepting the id from the request is safe for the reason it was always safe: membership
 * is verified on every call, so where the id came from never mattered. What mattered was
 * trusting one that was never checked.
 */
export function requireStudio(options: RequireStudioOptions): RequestHandler {
  // Named, not anonymous: `authz.test.ts` walks the router stack and asserts that every
  // studio-scoped route carries this handler, so a new route cannot quietly skip the gate.
  return async function requireStudioHandler(req: Request, _res: Response, next: NextFunction) {
    try {
      const { userId } = requireSession(req);

      const raw = req.params[options.param];
      const target = typeof raw === "string" && raw.length > 0 ? raw : undefined;
      if (!target) throw forbidden("No studio in the request.");

      const auth = await authorizeStudio(userId, target);

      if (options.role && auth.role !== options.role) {
        throw forbidden("Only the studio owner can do that.");
      }

      req.studio = auth;
      next();
    } catch (err) {
      next(err);
    }
  };
}
