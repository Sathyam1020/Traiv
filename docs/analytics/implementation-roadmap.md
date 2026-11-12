# Implementation roadmap

Phases are dependency-ordered. Each phase is independently shippable and useful on its
own — no phase requires a later one to deliver value.

## Phase 0 — Foundation (prerequisite for everything else)
- **Objective:** structured logging, so operational visibility (domain I) doesn't need
  to wait for the full product-analytics build.
- **Scope:** replace bare `console.log`/`console.warn` calls in `apps/api/src/server.ts`
  and request-handling middleware with a thin leveled JSON logger (no new dependency
  needed — a ~20-line wrapper is sufficient per `.ai/engineering/dependencies.md`'s own
  rejection criteria for "pulled in for one function").
- **Files:** `apps/api/src/server.ts`, a new `apps/api/src/lib/logger.ts`.
- **DB changes:** none.
- **Testing:** a smoke test asserting a 5xx response produces one structured log line.
- **Acceptance:** every unhandled error in the API produces a parseable JSON log line
  with route, status, duration.
- **Rollback:** revert the file; no data or schema involved.
- **Complexity:** trivial.

## Phase 1 — MVP: event ingestion + the Overview page
- **Objective:** real numbers on one dashboard page, nothing else yet.
- **Scope:**
  - Add `product_event`, `event_definition`, `analytics_session` tables
    (`data-model.md`), via a normal Drizzle migration following
    `.ai/engineering/database.md`'s process.
  - One ingestion route, `POST /analytics/events` (batched, matching the existing
    `/m/collect`'s batching precedent), validating against `event_definition` shapes.
  - Instrument the **top 5 events** only (see `risks-and-open-questions.md`'s top-20
    list, first 5): `signup_completed`, `client_joined`, `check_in_submitted`,
    `workout_session_completed`, `onboarding_step_completed` — all server-side, at the
    exact file locations named in `event-taxonomy.md`.
  - One `job`-table rollup (`kind = 'analytics_daily_rollup'`) computing DAU/WAU/MAU and
    weekly-active-clients into `daily_metric_rollup`.
  - Admin app: the Overview page only (`admin-dashboard-spec.md` §1), reading
    `daily_metric_rollup`.
- **Files:** `packages/db/src/schema/product-analytics.ts` (new), a migration under
  `packages/db/drizzle/`, `apps/api/src/features/analytics/` (new feature dir, routes +
  rollup job), `apps/admin/src/app/(app)/analytics/page.tsx` (rework).
- **Security:** ingestion route requires an authenticated session (no anonymous product
  events — that's `analytics_event`'s job, not this table's); read routes behind
  `requireAdmin()`.
- **Testing:** scenario tests per `.ai/engineering/testing.md`'s doctrine — real DB, real
  HTTP, no mocks: post a batch, assert dedup on retry, assert the rollup job produces the
  expected DAU for a seeded set of events.
- **Acceptance:** Overview page shows real, correct DAU/WAU/weekly-active-clients against
  a seeded test dataset.
- **Rollback:** the new tables are additive; dropping them (if ever needed) affects
  nothing else, since no other feature reads from them yet.
- **Complexity:** medium.

## Phase 2 — Launch: full event catalog + Product Usage, Engagement, Funnels
- **Scope:** instrument the remaining events in `event-taxonomy.md`'s catalog
  (client-side events now included, using the `outbox.ts`-pattern offline buffer for the
  client PWA — `apps/client/src/lib/analytics/outbox.ts`, mirroring
  `apps/client/src/lib/workouts/outbox.ts` exactly). Add `funnel_definition`,
  seed the two default funnels named in `admin-dashboard-spec.md` §3. Build out
  admin-dashboard-spec.md §2–5 (Acquisition, Funnels, Product Usage, Engagement).
- **Files:** `apps/client/src/lib/analytics/` (new), each client component named in
  `event-taxonomy.md`'s instrumentation-location column, `apps/admin/src/app/(app)/
  analytics/{trends,funnels,acquisition}/page.tsx`.
- **Testing:** offline-buffer sync test (queue an event while "offline," confirm it
  flushes and dedupes on reconnect — same test shape as the existing workout-outbox
  tests, if any exist; confirm during implementation).
- **Acceptance:** all Phase-2 nav pages show real data; a simulated offline client event
  survives an app kill and syncs once reconnected.
- **Complexity:** medium-high (client-side buffering is the hardest part).

## Phase 3 — Scale: Retention/Cohorts, Trainers & Studios health, System Health, Data Quality
- **Scope:** `studio_activity_summary` + health-score rollup job; retention cohort
  rollup; `operational_event` table + error/job-failure instrumentation (Phase 0's
  logger feeds this); the Data Quality page itself (reconciliation checks below).
- **Files:** new rollup job kinds, `apps/admin/src/app/(app)/analytics/{retention,
  studios,system-health,data-quality}/page.tsx`.
- **Testing:** health-score unit tests (same explicit-inputs-in/score-out contract as
  `metric-definitions.md`'s weight table); reconciliation test (seed a known event count,
  assert the Data Quality page flags a deliberately-introduced gap).
- **Acceptance:** a studio drilldown shows a correct, explained health score; a
  deliberately-broken rollup is visibly flagged on the Data Quality page within one
  rollup cycle.
- **Complexity:** medium.

## Phase 4 — Scale: Referrals page, remaining funnels, CSV export, aggregation-threshold enforcement
- **Scope:** `admin-dashboard-spec.md` §10, full funnel builder UI (not just the two
  seeded funnels), CSV export with small-cell suppression (`privacy-security.md`).
- **Complexity:** low-medium — mostly UI, the hard data-model work is already done.

## Future (prerequisite-gated, not scheduled)
- **Revenue analytics (`admin-dashboard-spec.md` §7):** blocked on a real billing system
  existing. Prerequisite: a `subscription`/`invoice`/`payment` schema (Razorpay or
  otherwise), webhook-driven, server-authoritative. Once that exists, `revenue_snapshot`
  (`data-model.md`) and the metric formulas in `metric-definitions.md` are ready to wire
  in — this is explicitly scoped as "the next thing to design," not built speculatively
  now.
- **ClickHouse migration:** only if a specific dashboard query is measurably slow with
  Phase 1–4's rollup tables already in place (`architecture-decision.md`).
- **Admin RBAC beyond one phone number:** needed the day a second admin user exists
  (`risks-and-open-questions.md`).
