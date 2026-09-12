import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../env.js";
import { AppError } from "../errors.js";

/**
 * The only place an error becomes an HTTP response.
 *
 * Express 5 forwards rejected promises from async handlers here automatically, so route
 * handlers never need try/catch and never build error responses themselves.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.code, message: err.message, details: err.details });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "invalid_request",
      message: "Some fields are invalid.",
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
    return;
  }

  // Unexpected. Log it with context and return nothing internal — stack traces and
  // messages from deep in the stack are exactly where secrets leak.
  console.error("[unhandled]", err);
  res.status(500).json({
    error: "internal_error",
    message: "Something failed on our side. Try again.",
    ...(env.NODE_ENV === "development" && { debug: String(err) }),
  });
}
