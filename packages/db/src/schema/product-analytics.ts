import { index, integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { studios } from "./studio.js";
import { users } from "./user.js";

/**
 * First-party product analytics — authenticated usage, not the marketing site's
 * anonymous visitors (that's `analyticsEvents`/`analyticsSalts` in `./analytics.ts`,
 * ADR 0021). The two are deliberately separate systems: a signed-in coach or client
 * already has a real identity, so there is no cookieless-salted-hash trick to do here —
 * `userId`/`studioId` are the identity, same as every other tenant-scoped table.
 *
 * Every row's primary key is client-minted (`newId()`), which is what makes a retried
 * send a no-op (`ON CONFLICT (id) DO NOTHING`) rather than a duplicate — at-least-once
 * delivery, exactly-once effect, the same pattern `check_in`/`recipe_ingredient` already
 * use for the same reason.
 */
export const productEvents = pgTable(
  "product_event",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    /** Client-reported — display/debugging only. `receivedAt` orders everything that
     *  actually matters, so a wrong device clock cannot corrupt a funnel or a DAU count. */
    occurredAt: timestamp({ withTimezone: true }).notNull(),
    receivedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    userId: text().references(() => users.id, { onDelete: "set null" }),
    studioId: text().references(() => studios.id, { onDelete: "set null" }),
    actorRole: text().notNull(),
    sourceApp: text().notNull(),
    properties: jsonb().notNull().default({}),
    privacyClass: text().notNull().default("operational"),
    schemaVersion: integer().notNull().default(1),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Every dashboard query is "this event name, over this window" — same ordering
    // reasoning as analytics_event's own indexes.
    index("product_event_name_time_idx").on(t.name, t.receivedAt),
    index("product_event_studio_time_idx").on(t.studioId, t.receivedAt),
    index("product_event_user_time_idx").on(t.userId, t.receivedAt),
  ],
);
export type ProductEvent = typeof productEvents.$inferSelect;
export type NewProductEvent = typeof productEvents.$inferInsert;

/**
 * The event catalog — a human-browsable reference table, not read on every ingest.
 * Validation happens against the in-code Zod shapes in `features/analytics/service.ts`
 * (this repo's own boundary-validation convention); this table exists so "what events
 * exist and why" has one place to look, same spirit as `metric`'s own catalog role.
 */
export const eventDefinitions = pgTable("event_definition", {
  name: text().primaryKey(),
  businessPurpose: text().notNull(),
  privacyClass: text().notNull(),
  schemaVersion: integer().notNull().default(1),
  deprecatedAt: timestamp({ withTimezone: true }),
});
export type EventDefinition = typeof eventDefinitions.$inferSelect;

/**
 * Daily aggregates — what every dashboard page actually reads. Computed by a recurring
 * tick (`features/analytics/rollup.ts`), same "a plain interval timer, not a new queue"
 * shape as `startCheckInReminders`. Raw `product_event` rows are for funnel/cohort
 * *exploration* later, never for painting a chart on every page load.
 */
/** Sentinel for "every studio" — a `studioId` FK can't be part of a primary key while
 *  also being nullable (Postgres rejects null in a PK column), so a platform-wide row
 *  is a real, non-null, non-FK value instead of null. */
export const PLATFORM_ROLLUP_SCOPE = "platform";

export const dailyMetricRollups = pgTable(
  "daily_metric_rollup",
  {
    day: text().notNull(), // 'YYYY-MM-DD', UTC — matches the Day-as-string convention check-ins already use
    /** A real studio id, or `PLATFORM_ROLLUP_SCOPE` for the platform-wide row. Not an FK:
     *  the sentinel value would violate one, and the per-studio rows are looked up by id
     *  at read time rather than joined. */
    studioId: text().notNull().default(PLATFORM_ROLLUP_SCOPE),
    metric: text().notNull(),
    value: integer().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.day, t.studioId, t.metric] }),
    index("daily_metric_rollup_metric_idx").on(t.metric, t.day),
  ],
);
export type DailyMetricRollup = typeof dailyMetricRollups.$inferSelect;

/** So the rollup is resumable/auditable — same spirit as `job`'s own lockedBy/lockedAt. */
export const analyticsCheckpoints = pgTable("analytics_checkpoint", {
  rollupName: text().primaryKey(),
  lastProcessedDay: text().notNull(), // 'YYYY-MM-DD', the last day fully rolled up
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export type AnalyticsCheckpoint = typeof analyticsCheckpoints.$inferSelect;

/**
 * "One continuous period of app usage," for DAU/session-count purposes — distinct from
 * the auth `session` table (`schema/auth.ts`), which is about being signed in, not about
 * using the app right now. Opened by the client SDK's `session_started` event; closed by
 * the rollup job once `lastSeenAt` has been idle long enough (`rollup.ts`), never by the
 * client itself — a tab closed without warning must not leave the row open forever.
 */
export const analyticsSessions = pgTable(
  "analytics_session",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceApp: text().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull(),
    lastSeenAt: timestamp({ withTimezone: true }).notNull(),
    endedAt: timestamp({ withTimezone: true }),
  },
  (t) => [index("analytics_session_user_idx").on(t.userId, t.startedAt)],
);
export type AnalyticsSession = typeof analyticsSessions.$inferSelect;

/**
 * Bridges `apps/web`'s anonymous, cookieless `analytics_event` (ADR 0021) to a real
 * `userId` the moment signup happens — the one new thing `attribution-design.md` adds to
 * that existing system. Written once, at `signup_completed`, from the UTM params carried
 * on the signup request itself (never re-derived from a cookie — ADR 0021 has none).
 */
export const acquisitionAttributions = pgTable("acquisition_attribution", {
  userId: text()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  firstTouchSource: text(),
  firstTouchMedium: text(),
  firstTouchCampaign: text(),
  firstTouchAt: timestamp({ withTimezone: true }),
  lastTouchSource: text(),
  lastTouchMedium: text(),
  lastTouchCampaign: text(),
  lastTouchAt: timestamp({ withTimezone: true }),
  /** Set instead of the touch columns when attribution is a referral, not a UTM-tagged
   *  visit — `attribution-design.md`'s "separate channel, not blended." */
  endorserCode: text(),
  attributedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export type AcquisitionAttribution = typeof acquisitionAttributions.$inferSelect;

/**
 * A funnel is data, not code — an ordered list of `product_event` names (with optional
 * property filters, e.g. a specific `step_index`), so a new funnel ships without a
 * deploy. Read by the admin Funnels page (`admin-dashboard-spec.md` §3); computed
 * on-demand from `product_event`, bounded by date range — a funnel is exploration, not
 * a chart painted on every page load, so it has no rollup of its own.
 */
export const funnelDefinitions = pgTable("funnel_definition", {
  id: text().primaryKey(),
  name: text().notNull(),
  /** `{ name: string; properties?: Record<string, unknown> }[]`, in order. */
  steps: jsonb().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export type FunnelDefinition = typeof funnelDefinitions.$inferSelect;

/**
 * Technical/operational telemetry — deliberately a separate table from `product_event`,
 * never joined to it in any query: `architecture-decision.md` §"Operational monitoring"
 * calls mixing high-cardinality request-level telemetry into product tables exactly the
 * "expensive query pattern" the brief warns against. Short retention (14 days per
 * `data-model.md`) — this is for "is anything broken right now," not a permanent log.
 */
export const operationalEvents = pgTable(
  "operational_event",
  {
    id: text().primaryKey(),
    // 'api_request_failed' | 'api_request_completed' | 'job_failed' |
    // 'admin_drilldown_viewed'. The latter two are Phase 3 additions beyond
    // `event-taxonomy.md`'s original two: `api_request_completed` because System
    // Health's p50/p95 latency needs the full request-duration distribution, not only
    // failures; `admin_drilldown_viewed` per `privacy-security.md`'s own "every admin
    // read of a specific studio's raw-ish data is itself logged" instruction.
    name: text().notNull(),
    receivedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    route: text(),
    statusCode: integer(),
    durationMs: integer(),
    jobKind: text(),
    error: text(),
  },
  (t) => [
    index("operational_event_time_idx").on(t.receivedAt),
    index("operational_event_route_idx").on(t.route, t.receivedAt),
  ],
);
export type OperationalEvent = typeof operationalEvents.$inferSelect;

/**
 * Denormalized, one row per studio, overwritten in place by the health-score job —
 * never a live join across event tables on every page load. The "Trainers and Studios"
 * health page (`admin-dashboard-spec.md` §8) reads this and nothing else.
 */
export const studioActivitySummaries = pgTable("studio_activity_summary", {
  studioId: text()
    .primaryKey()
    .references(() => studios.id, { onDelete: "cascade" }),
  lastLoginAt: timestamp({ withTimezone: true }),
  activeClientCount: integer().notNull().default(0),
  recentWorkoutActivityAt: timestamp({ withTimezone: true }),
  /** Rule-based, 0-100 — see `metric-definitions.md`'s weight table. Nullable until the
   *  job has run once for this studio. Never described in the admin UI as predictive. */
  healthScore: integer(),
  /** The exact inputs that produced `healthScore`, for the drilldown's "why" — each key
   *  matches one row of `metric-definitions.md`'s weight table. */
  healthScoreExplanation: jsonb(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export type StudioActivitySummary = typeof studioActivitySummaries.$inferSelect;
