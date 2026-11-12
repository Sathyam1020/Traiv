/** One place every cache key is defined, so an invalidation cannot miss a reader. */
export const queryKeys = {
  auth: {
    config: ["auth", "config"] as const,
    session: ["auth", "session"] as const,
  },
  endorser: { me: ["endorser", "me"] as const, referrals: ["endorser", "referrals"] as const },
  admin: {
    stats: ["admin", "stats"] as const,
    productOverview: ["admin", "analytics", "overview"] as const,
    acquisition: (days: number) => ["admin", "analytics", "acquisition", days] as const,
    productUsage: (days: number) => ["admin", "analytics", "product-usage", days] as const,
    engagement: (days: number) => ["admin", "analytics", "engagement", days] as const,
    funnels: ["admin", "analytics", "funnels"] as const,
    funnel: (id: string, days: number) => ["admin", "analytics", "funnels", id, days] as const,
    retention: (weeks: number, cohortFilter: string) =>
      ["admin", "analytics", "retention", weeks, cohortFilter] as const,
    studios: ["admin", "analytics", "studios"] as const,
    studio: (id: string) => ["admin", "analytics", "studios", id] as const,
    systemHealth: ["admin", "analytics", "system-health"] as const,
    dataQuality: ["admin", "analytics", "data-quality"] as const,
    eventNames: ["admin", "analytics", "event-names"] as const,
    referrals: (days: number) => ["admin", "analytics", "referrals", days] as const,
    analytics: (days: number) => ["admin", "analytics", days] as const,
    waitlist: ["admin", "waitlist"] as const,
    posts: ["admin", "posts"] as const,
    post: (id: string) => ["admin", "posts", id] as const,
  },
} as const;
