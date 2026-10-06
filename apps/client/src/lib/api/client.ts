import axios, { AxiosError } from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const http = axios.create({
  baseURL: API_BASE,
  // The session is an httpOnly cookie, so every request has to carry credentials.
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** What the API returns on failure — see apps/api/src/middleware/error.ts. */
type ApiErrorBody = { error?: string; message?: string };

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
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
        ),
      );
    }
    return Promise.reject(error);
  },
);

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}
