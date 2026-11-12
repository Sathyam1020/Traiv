import { schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { db } from "../db.js";
import { env } from "../env.js";
import { forbidden } from "../errors.js";
import { requireSession } from "./session.js";

/**
 * The platform administrator.
 *
 * Deliberately not a table and not a role column. There is exactly one admin, named by
 * `ADMIN_EMAIL` — ADR 0034, was `ADMIN_PHONE` — and no endpoint anywhere that grants the
 * role — so the only way to become admin is to change the environment and restart. That
 * matters because every other privilege in this system is data, and data can be written
 * by a bug.
 *
 * Unset means nobody is an admin, which is the right default for a deployment that
 * forgot to configure it.
 */
export function requireAdmin(): RequestHandler {
  return async function requireAdminHandler(req: Request, _res: Response, next: NextFunction) {
    try {
      const { userId } = requireSession(req);

      if (!env.ADMIN_EMAIL) throw forbidden("Not allowed.");

      // Same normalisation applied everywhere else an email is stored or compared.
      const adminEmail = env.ADMIN_EMAIL.trim().toLowerCase();

      const [row] = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(
          and(
            eq(schema.users.id, userId),
            eq(schema.users.email, adminEmail),
            isNull(schema.users.deletedAt),
          ),
        )
        .limit(1);

      // One message for "not signed in as the admin" and for "no admin configured", so
      // this cannot be used to discover whether an admin exists.
      if (!row) throw forbidden("Not allowed.");
      next();
    } catch (err) {
      next(err);
    }
  };
}
