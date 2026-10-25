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
  roster: {
    // Keyed by studio and by every parameter that changes the answer, so paging back
    // and forth is instant and two tabs on different studios never share a cache entry.
    list: (studioId: string, params: Record<string, unknown>) =>
      ["roster", studioId, params] as const,
    tags: (studioId: string) => ["roster", "tags", studioId] as const,
  },
  /**
   * One client's own screen. Deliberately NOT under the `roster` prefix.
   *
   * The roster's optimistic writes patch every cached entry matching `["roster", id]`
   * by rewriting `roster.clients`, and a profile has no `clients` array — sharing the
   * prefix would hand them an object of the wrong shape to map over. Separate keys, and
   * the writes invalidate this one explicitly.
   */
  client: {
    one: (studioId: string, clientId: string) => ["client", studioId, clientId] as const,
    overview: (studioId: string, clientId: string) =>
      ["client", studioId, clientId, "overview"] as const,
    checkIns: (studioId: string, clientId: string) =>
      ["client", studioId, clientId, "check-ins"] as const,
    all: (studioId: string) => ["client", studioId] as const,
  },
  join: {
    // Keyed by studio: two tabs on different studios must not share one cache entry.
    code: (studioId: string) => ["studio", "join-code", studioId] as const,
  },
} as const;
