import { http } from "./client";

export type Stats = {
  trainers: number;
  clients: number;
  studios: number;
  endorsers: number;
  referrals: number;
};

export const adminApi = {
  stats: async () => (await http.get<Stats>("/admin/stats")).data,
};

/* -------------------------------------------------------------------------- */
/* Product analytics                                                          */
/* -------------------------------------------------------------------------- */

export type ProductOverview = {
  freshness: { lastRolledUpDay: string | null; updatedAt: string | null };
  totals: { trainers: number; clients: number };
  weeklyActiveClientsRatio: number | null;
  latest: {
    dauTrainer: number;
    dauClient: number;
    wauTrainer: number;
    wauClient: number;
    mauTrainer: number;
    mauClient: number;
  };
  signups: { thisWeek: number; lastWeek: number };
  series: Record<
    | "dau_trainer"
    | "dau_client"
    | "wau_trainer"
    | "wau_client"
    | "mau_trainer"
    | "mau_client"
    | "signups_trainer",
    { day: string; value: number }[]
  >;
};

export type AcquisitionReport = {
  days: number;
  totalNewTrainers: number;
  referred: number;
  channels: { source: string; medium: string; campaign: string; signups: number }[];
};

export type ProductUsageReport = {
  days: number;
  features: {
    feature: string;
    byTier: { tier: string; adopted: number; total: number; rate: number | null }[];
  }[];
};

export type EngagementReport = {
  days: number;
  sessionsPerUserPerWeek: number;
  checkInOnTimeRate: number | null;
  workoutCompletionRate: number | null;
};

export type FunnelSummary = { id: string; name: string; stepCount: number };

export type FunnelReport = {
  id: string;
  name: string;
  days: number;
  steps: {
    name: string;
    properties: Record<string, unknown>;
    reached: number;
    dropOffRate: number | null;
    medianSecondsSincePreviousStep: number | null;
  }[];
};

export type FunnelStepInput = {
  name: string;
  propertyKey?: string;
  propertyValue?: string | number | boolean;
};
export type FunnelInput = { name: string; steps: FunnelStepInput[] };
export type Funnel = { id: string; name: string; steps: Record<string, unknown>[] };

export type ReferralsReport = {
  days: number;
  codesCreated: number;
  referralsAttributed: number;
  activeConversionRate: number | null;
};

export type RetentionCohort = { week: string; size: number; retention: (number | null)[] };
export type RetentionReport = {
  weeks: number;
  cohortFilter: "all" | "narrow" | "broad" | "client";
  cohorts: RetentionCohort[];
};

export type StudioRow = {
  studioId: string;
  name: string;
  tier: string;
  healthScore: number | null;
  lastLoginAt: string | null;
  activeClientCount: number;
  updatedAt: string | null;
};
export type StudiosReport = { studios: StudioRow[]; scoreLabel: string };

export type StudioDrilldown = {
  studio: { id: string; name: string; tier: string; createdAt: string };
  healthScore: number | null;
  healthScoreExplanation: Record<string, unknown> | null;
  scoreLabel: string;
  activeClientCount: number;
  lastLoginAt: string | null;
  recentWorkoutActivityAt: string | null;
  roster: { id: string; name: string; status: string; joinedVia: string | null }[];
  recentActivity: { name: string; receivedAt: string; actorRole: string }[];
};

export type SystemHealthReport = {
  sinceHours: number;
  byRoute: { route: string; total: number; failed: number }[];
  latencyMs: { p50: number | null; p95: number | null };
  jobFailures: number;
};

export type DataQualityReport = {
  eventsToday: number;
  trailingSevenDayAverage: number;
  volumeAnomaly: boolean;
  rollupLagHours: number | null;
  lastRolledUpDay: string | null;
  schemaValidationFailuresLast24h: number;
};

export const productAnalyticsApi = {
  overview: async () => (await http.get<ProductOverview>("/admin/analytics/overview")).data,
  acquisition: async (days: number) =>
    (await http.get<AcquisitionReport>("/admin/analytics/acquisition", { params: { days } })).data,
  productUsage: async (days: number) =>
    (await http.get<ProductUsageReport>("/admin/analytics/product-usage", { params: { days } }))
      .data,
  engagement: async (days: number) =>
    (await http.get<EngagementReport>("/admin/analytics/engagement", { params: { days } })).data,
  funnels: async () =>
    (await http.get<{ funnels: FunnelSummary[] }>("/admin/analytics/funnels")).data,
  funnel: async (id: string, days: number) =>
    (await http.get<FunnelReport>(`/admin/analytics/funnels/${id}`, { params: { days } })).data,
  retention: async (weeks: number, cohortFilter: RetentionReport["cohortFilter"]) =>
    (
      await http.get<RetentionReport>("/admin/analytics/retention", {
        params: { weeks, cohortFilter },
      })
    ).data,
  studios: async () => (await http.get<StudiosReport>("/admin/analytics/studios")).data,
  studio: async (id: string) =>
    (await http.get<StudioDrilldown>(`/admin/analytics/studios/${id}`)).data,
  systemHealth: async () =>
    (await http.get<SystemHealthReport>("/admin/analytics/system-health")).data,
  dataQuality: async () =>
    (await http.get<DataQualityReport>("/admin/analytics/data-quality")).data,
  eventNames: async () =>
    (await http.get<{ names: string[] }>("/admin/analytics/event-names")).data.names,
  createFunnel: async (input: FunnelInput) =>
    (await http.post<{ funnel: Funnel }>("/admin/analytics/funnels", input)).data.funnel,
  updateFunnel: async (id: string, input: FunnelInput) =>
    (await http.patch<{ funnel: Funnel }>(`/admin/analytics/funnels/${id}`, input)).data.funnel,
  deleteFunnel: async (id: string) => {
    await http.delete(`/admin/analytics/funnels/${id}`);
  },
  referrals: async (days: number) =>
    (await http.get<ReferralsReport>("/admin/analytics/referrals", { params: { days } })).data,
};

/* -------------------------------------------------------------------------- */
/* The marketing site                                                          */
/* -------------------------------------------------------------------------- */

export type AnalyticsRow = Record<string, string | number | null>;

export type Analytics = {
  days: number;
  totals: { pageviews: number; visitors: number; events: number; avg_ms: number };
  funnel: { saw: number; clicked: number; submitted: number };
  waitlist: {
    total: number;
    recent: number;
    consented: number;
    with_email: number;
    with_phone: number;
  };
  series: { day: string; pageviews: number; visitors: number }[];
  paths: { path: string; views: number; visitors: number }[];
  referrers: { source: string; visitors: number }[];
  devices: { label: string; visitors: number }[];
  browsers: { label: string; visitors: number }[];
  clicks: { label: string; place: string; clicks: number }[];
  campaigns: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    visitors: number;
  }[];
};

export type WaitlistEntry = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  intent: string;
  source: string | null;
  path: string | null;
  announcements: boolean;
  notifiedAt: string | null;
  createdAt: string;
};

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: "draft" | "published";
  authorName: string;
  readMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
};

export type Post = PostSummary & {
  body: string;
  coverUrl: string | null;
  coverAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  authorName: string;
  status: "draft" | "published";
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export const marketingApi = {
  analytics: async (days: number) =>
    (await http.get<Analytics>("/admin/analytics", { params: { days } })).data,

  waitlist: async () =>
    (await http.get<{ entries: WaitlistEntry[] }>("/admin/waitlist")).data.entries,

  posts: async () => (await http.get<{ posts: PostSummary[] }>("/admin/posts")).data.posts,

  post: async (id: string) => (await http.get<{ post: Post }>(`/admin/posts/${id}`)).data.post,

  createPost: async (input: PostInput) =>
    (await http.post<{ post: Post }>("/admin/posts", input)).data.post,

  updatePost: async (id: string, input: Partial<PostInput>) =>
    (await http.patch<{ post: Post }>(`/admin/posts/${id}`, input)).data.post,

  deletePost: async (id: string) => {
    await http.delete(`/admin/posts/${id}`);
  },
};
