/**
 * Errors carry their HTTP status and a client-safe message. Route handlers throw these;
 * the error middleware is the single place that turns them into responses.
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (code: string, message: string, details?: unknown) =>
  new AppError(400, code, message, details);

export const unauthorized = (message = "Not signed in") =>
  new AppError(401, "unauthorized", message);

export const forbidden = (message = "Not allowed") => new AppError(403, "forbidden", message);

export const notFound = (message = "Not found") => new AppError(404, "not_found", message);

export const tooManyRequests = (message: string) => new AppError(429, "rate_limited", message);
