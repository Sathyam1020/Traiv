/**
 * One place every cache key is defined.
 *
 * Keys written inline drift — two components ask for the same data under slightly
 * different keys, one invalidation misses the other, and the UI shows stale data with
 * no error. Anything cached goes here.
 */
export const queryKeys = {
  auth: {
    config: ["auth", "config"] as const,
    session: ["auth", "session"] as const,
  },
  studios: {
    list: ["studios", "list"] as const,
  },
} as const;
