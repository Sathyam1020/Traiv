/** One place every cache key is defined, so an invalidation cannot miss a reader. */
export const queryKeys = {
  auth: {
    config: ["auth", "config"] as const,
    session: ["auth", "session"] as const,
  },
  endorser: { me: ["endorser", "me"] as const, referrals: ["endorser", "referrals"] as const },
  admin: {
    stats: ["admin", "stats"] as const,
    analytics: (days: number) => ["admin", "analytics", days] as const,
    waitlist: ["admin", "waitlist"] as const,
    posts: ["admin", "posts"] as const,
    post: (id: string) => ["admin", "posts", id] as const,
  },
} as const;
