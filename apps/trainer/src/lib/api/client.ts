import axios, { AxiosError } from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
/** The marketing site (apps/web) — Terms/Privacy live there once, not duplicated per app. */
export const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL ?? "http://localhost:3004";

export const http = axios.create({
  baseURL: API_BASE,
  // The session is an httpOnly cookie, so every request has to carry credentials.
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** One field-level reason — what a 400 from `errorHandler`'s Zod branch carries per
 * issue, and what `badRequest(code, message, details)` can carry on purpose. */
export type ApiErrorDetail = { path: string; message: string };

/** What the API returns on failure — see apps/api/src/middleware/error.ts. */
type ApiErrorBody = { error?: string; message?: string; details?: ApiErrorDetail[] };

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Normalise every failure into one shape, so callers never branch on axios internals
 * or guess whether `.response` exists.
 */
http.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const body = error.response?.data as ApiErrorBody | undefined;
      return Promise.reject(
        new ApiError(
          error.response?.status ?? 0,
          body?.error ?? (error.code === "ERR_NETWORK" ? "network" : "unknown"),
          body?.message ?? "Couldn't reach the server. Try again.",
          Array.isArray(body?.details) ? body.details : undefined,
        ),
      );
    }
    return Promise.reject(error);
  },
);

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/**
 * The server's own field-level reason, when there is one — a validation failure is
 * specific ("Height must be between 90 and 250 cm"), not a generic "couldn't save
 * that." Falls back to the given message for anything that isn't a field-level 400
 * (a network failure, a 500) — there genuinely isn't a more specific reason to show.
 */
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (isApiError(err) && err.status === 400 && err.details?.length) {
    return err.details[0]?.message || fallback;
  }
  return fallback;
}
