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
