# Data model (illustrative — not actual schema files)

Conventions followed throughout, matching this repo exactly (`.ai/engineering/database.md`,
`packages/db/src/id.ts`, the existing `analytics.ts`/`job.ts` files):

- `text().primaryKey()`, value = `newId()` (UUIDv7, client-mintable, time-sortable).
- `timestamp({ withTimezone: true })` everywhere, never a bare timestamp.
- Nullable `studioId` for "global vs. studio-scoped" rows, same pattern as `metric`,
  `ingredient`, `recipe`, `exercise` — **not reused here**, because every table below is
  inherently tenant-scoped (a `studioId`/`userId` row, never a shared library), so
  `studioId` is `.notNull()` where it applies.
- Raw SQL for every read-side aggregate (`sql\`...\``, explicitly qualified columns) —
  the marketing-analytics precedent's own stated reason: an interpolated Drizzle column
  renders unqualified in a template, which is how the real `training_session.id` bug
  happened on the client roster.

```ts
// packages/db/src/schema/product-analytics.ts  (illustrative)

export const productEvents = pgTable(
  "product_event",
  {
    id: text().primaryKey(),                 // newId(), client-minted
    name: text().notNull(),                   // e.g. "check_in_submitted"
    occurredAt: timestamp({ withTimezone: true }).notNull(),   // client-reported
    receivedAt: timestamp({ withTimezone: true }).notNull().defaultNow(), // authoritative
    userId: text().references(() => users.id, { onDelete: "set null" }),
    studioId: text().references(() => studios.id, { onDelete: "set null" }),
    actorRole: text().notNull(),               // 'trainer' | 'client' | 'system'
    sourceApp: text().notNull(),               // 'trainer' | 'client' | 'admin' | 'endorse' | 'web'
    properties: jsonb().notNull().default({}),
    privacyClass: text().notNull().default("operational"), // 'operational' | 'sensitive'
    schemaVersion: integer().notNull().default(1),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Every dashboard query is "this event name, over this window" — same reasoning as
    // analytics_event's own index ordering.
    index("product_event_name_time_idx").on(t.name, t.receivedAt),
    index("product_event_studio_time_idx").on(t.studioId, t.receivedAt),
    index("product_event_user_time_idx").on(t.userId, t.receivedAt),
  ],
);

export const operationalEvents = pgTable(
  "operational_event",
  {
    id: text().primaryKey(),
    name: text().notNull(),           // 'api_request_failed' | 'job_failed'
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
  // Short retention — raw rows purged after N days once the hourly rollup (below) exists.
);

export const eventDefinitions = pgTable("event_definition", {
  name: text().primaryKey(),         // the event-taxonomy.md catalog, enforced
  businessPurpose: text().notNull(),
  requiredProps: jsonb().notNull(),  // zod-shape description, validated at ingestion
  privacyClass: text().notNull(),
  schemaVersion: integer().notNull().default(1),
  deprecatedAt: timestamp({ withTimezone: true }),
});

/** Sessions — distinct from auth `session` (which is about being signed in); this is
 *  "one continuous period of app usage" for DAU/session-count purposes. */
export const analyticsSessions = pgTable(
  "analytics_session",
  {
    id: text().primaryKey(),
    userId: text().notNull().references(() => users.id, { onDelete: "cascade" }),
    sourceApp: text().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull(),
    lastSeenAt: timestamp({ withTimezone: true }).notNull(),
    endedAt: timestamp({ withTimezone: true }),   // null = still open (closed by a rollup job after N minutes idle)
  },
  (t) => [index("analytics_session_user_idx").on(t.userId, t.startedAt)],
);

/** Acquisition attribution — bridges the existing anonymous analytics_event (ADR 0021)
 *  to a real signed-up user, the moment signup happens. */
export const acquisitionAttributions = pgTable(
  "acquisition_attribution",
  {
    userId: text().primaryKey().references(() => users.id, { onDelete: "cascade" }),
    firstTouchSource: text(),
    firstTouchMedium: text(),
    firstTouchCampaign: text(),
    firstTouchAt: timestamp({ withTimezone: true }),
    lastTouchSource: text(),
    lastTouchMedium: text(),
    lastTouchCampaign: text(),
    lastTouchAt: timestamp({ withTimezone: true }),
    endorserCode: text(),              // if attributed via referral instead/also
    attributedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
);

/** Funnel definitions — data, not code, so a new funnel doesn't need a deploy. */
export const funnelDefinitions = pgTable("funnel_definition", {
  id: text().primaryKey(),
  name: text().notNull(),             // "Trainer activation"
  steps: jsonb().notNull(),           // ordered array of event names (+ optional property filters)
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

/** Daily aggregates — what every dashboard page actually reads. Computed by a `job`. */
export const dailyMetricRollups = pgTable(
  "daily_metric_rollup",
  {
    day: date().notNull(),             // UTC date
    studioId: text().references(() => studios.id, { onDelete: "cascade" }), // null = platform-wide row
    metric: text().notNull(),          // 'dau' | 'wau' | 'client_activations' | ...
    value: numeric().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.day, t.studioId, t.metric] }),
    index("daily_metric_rollup_metric_idx").on(t.metric, t.day),
  ],
);

/** Account activity summary — denormalized, one row per studio, updated by the same
 *  rollup job. This is what the "Trainers and Studios" health page reads — never a live
 *  join across event tables on every page load. */
export const studioActivitySummaries = pgTable("studio_activity_summary", {
  studioId: text().primaryKey().references(() => studios.id, { onDelete: "cascade" }),
  lastLoginAt: timestamp({ withTimezone: true }),
  activeClientCount: integer().notNull().default(0),
  recentWorkoutActivityAt: timestamp({ withTimezone: true }),
  healthScore: integer(),             // rule-based, see metric-definitions.md — nullable until computed
  healthScoreExplanation: jsonb(),    // the inputs that produced it, for the drilldown view
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

/** Revenue snapshot — schema sketch only, gated on billing existing. Not created in any
 *  phase of this plan until a real payment/subscription table exists to read from. */
export const revenueSnapshots = pgTable("revenue_snapshot", {
  day: date().primaryKey(),
  mrr: numeric(),
  newMrr: numeric(),
  expansionMrr: numeric(),
  contractionMrr: numeric(),
  churnedMrr: numeric(),
  // ... (full shape deferred to whenever billing is designed — see metric-definitions.md)
});

/** Processing checkpoints — so a rollup job is resumable and auditable, same spirit as
 *  the `job` table's own lockedBy/lockedAt fields. */
export const analyticsCheckpoints = pgTable("analytics_checkpoint", {
  rollupName: text().primaryKey(),
  lastProcessedAt: timestamp({ withTimezone: true }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
```

## Indexing & query-pattern notes

- Every dashboard chart reads `daily_metric_rollup` or `studio_activity_summary`, never
  `product_event` directly, once Phase 1 rollups exist (`implementation-roadmap.md`).
  Raw-event queries are for funnel/cohort *exploration* tooling only, bounded by date
  range, and always hit the `(name, receivedAt)` or `(studioId, receivedAt)` index — never
  an unbounded scan.
- No cross-table joins between `product_event` and `operational_event` in any query —
  they answer different questions and mixing them is exactly the "expensive join" trap
  named in the brief.
- Tenant boundary: every admin-facing read that can be scoped to a studio is scoped by
  `studioId` explicitly in the `WHERE` clause, not inferred from a join — same posture as
  `requireStudio`'s existing authorization gate.

## Retention policy

| Table | Raw retention | After that |
|---|---|---|
| `product_event` | 90 days | Deleted (rollups already captured what mattered) |
| `operational_event` | 14 days | Deleted (hourly rollup into a small summary table, same pattern) |
| `analytics_session` | 1 year | Deleted |
| `daily_metric_rollup`, `studio_activity_summary` | Indefinite | Small, cheap to keep forever |
| `acquisition_attribution` | Indefinite | One row per user, tiny |

## Schema evolution

`event_definition.schemaVersion` plus `product_event.schemaVersion` on every row means a
breaking change to an event's `properties` shape ships as a new version number, and the
ingestion validator (Zod, matching this repo's own boundary-validation convention) can
accept both the old and new shape during a migration window rather than silently
accepting malformed old-shape rows forever.
