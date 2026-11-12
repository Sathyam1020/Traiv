# Admin analytics dashboard spec

## Design reference — a real, already-shipped precedent

`/Users/sathyamsahu/Work/personal-projects/portfolio` (a separate, unrelated Next.js
project on this machine, built for a different person — **not part of Traiv, do not
import its code**) already contains a self-built, "PostHog-style" analytics dashboard
under `app/admin/(panel)/analytics/`, with sibling pages:
`page.tsx` (overview), `trends/`, `funnels/`, `retention/`, `paths/`, `events/`,
`people/` (+ `people/[id]`), `sessions/` (+ `sessions/[id]`), `activity/`. This maps
almost one-to-one onto the 12 sections requested below, and is worth borrowing the
*shape* of, specifically:

- **Shared scope state in the URL, not component state.** Its `use-analytics.ts` hook
  (`components/admin/analytics/use-analytics.ts`) keeps `range` and `filters` in the URL
  query string via `useSearchParams`/`router.replace`, so every sibling page under the
  same layout shares one date-range/filter bar without prop-drilling or duplicated state,
  and a link to a specific filtered view is just a URL. **Adopt this pattern directly**
  for Traiv's admin analytics nav — it solves exactly the brief's "support date range
  selection... and previous period comparisons" requirement with no new state library.
- **A nav bar as its own layout-level component** (`AnalyticsNav` in
  `components/admin/analytics/ui.tsx`), rendered once in `analytics/layout.tsx` wrapping
  every sub-page — same shape Traiv's `AppShell` already uses for its own sidebar (ADR
  0020), so this is additive to the existing admin layout, not a new pattern.
- **Per-section view components** (`trends-view.tsx`, `funnels-view.tsx`, etc.) each
  owning their own chart composition via Recharts, reading through one `useQuery` against
  a single parameterized API route (`app/api/admin/analytics/[report]/route.ts` — one
  endpoint, a `report` param selecting which aggregate to run, not twelve separate
  endpoints). **Traiv's equivalent**: one `GET /admin/analytics/:report` route in
  `apps/api/src/features/admin/`, mirroring the existing `/admin/analytics` marketing
  endpoint's own "N aggregates in one request" philosophy, parameterized by section.
- A **drilldown route per entity** (`people/[id]`, `sessions/[id]`) rather than a modal —
  this gives every drilldown a real, shareable, bookmarkable URL, which is the right
  default for an internal tool a founder actually lives in day to day.

Visually: reuse Traiv's own tokens (`packages/ui`) — this is a design-*pattern*
reference (layout shape, state management, drilldown-as-route), not a visual-style
reference; Traiv already has its own accepted dark/Featurebase-derived theme (ADR 0022)
and should not inherit the portfolio project's own color choices.

## Navigation — 12 sections, extending the admin app's existing 4 pages

Current admin app (`apps/admin/src/app/(app)/`): `dashboard`, `analytics` (marketing-only
today), `posts`, `waitlist`. This plan adds a new `analytics` sub-nav (renaming/
expanding the existing single `analytics` page into a section with its own layout,
matching the portfolio's `analytics/layout.tsx` pattern) with these 12 children. Each
entry: primary question, KPIs, chart(s), filters, data source, loading/empty state.

### 1. Overview
- **Question:** "Is the business healthy, right now, at a glance?"
- **KPIs:** total trainers, total clients, weekly active clients ÷ total clients (the
  CLAUDE.md north-star), DAU/WAU/MAU (trainer and client, side by side, never blended),
  signups this week vs. last.
- **Charts:** 30-day trend line per KPI, with previous-period comparison (±%).
- **Filters:** date range (shared URL state, per above).
- **Data source:** `daily_metric_rollup`.
- **Empty state:** "No data yet — rollups run nightly; check back after the first
  overnight job, or see `implementation-roadmap.md` Phase 1."
- **Freshness indicator:** "Updated as of [last rollup `analytics_checkpoint` time]."

### 2. Acquisition
- **Question:** "Where are new trainers actually coming from?"
- **KPIs/charts:** signups by `utmSource`/medium/campaign, organic vs. paid vs.
  referral vs. direct, landing-page conversion rate (visits → `NotifyMe` submit, already
  computable from existing `analytics_event`).
- **Data source:** `acquisition_attribution` joined to `user`/`studio` for counts; raw
  marketing `analytics_event` for pre-signup funnel steps.
- **Explicit caveat shown in the UI itself:** "First-touch only; returning anonymous
  visitors are not tracked across sessions (see `attribution-design.md`)."

### 3. Conversion Funnels
- **Question:** "Where do people actually drop off?"
- **UI:** a funnel builder reading `funnel_definition` rows (ordered event-name lists),
  rendering step counts, drop-off %, and median time-between-steps. Default funnels
  pre-seeded: Visitor→Signup→Phone verified→Business name confirmed→First client
  invited→First client joined (the real signup flow this session built), and the
  15-step onboarding intake as its own funnel (`onboarding_step_completed` ×15).
- **Filters:** cohort (signup week), segment (tier, acquisition channel), date window.
- **Data source:** `product_event`, bounded by date range and funnel's own event list.

### 4. Product Usage
- **Question:** "What features actually get used?"
- **KPIs:** feature-adoption rate per feature (workouts, nutrition, check-ins), broken
  down by `studio.tier`.
- **Data source:** `product_event` aggregated by `name`, rolled up daily.

### 5. Engagement
- **Question:** "How often do people come back and do something?"
- **KPIs:** session count/user/week, check-in completion rate, workout completion rate.

### 6. Retention and Cohorts
- **Question:** "Do people stick around?"
- **UI:** a retention heatmap (signup-week cohort × weeks-since-signup), same visual
  pattern as the portfolio reference's `retention-view.tsx` and every standard SaaS
  retention grid. Toggle between the three candidate activation definitions
  (`metric-definitions.md`) to compare which one actually separates retained vs.
  churned cohorts — this toggle *is* the validation tool named in that document.

### 7. Revenue
- **Question:** deferred — **this page ships as an explicit "not available yet" state**,
  not hidden, with a short explanation ("billing infrastructure doesn't exist yet — see
  `metric-definitions.md`"), so the nav structure is ready the day billing lands rather
  than requiring a second redesign.

### 8. Trainers and Studios
- **Question:** "Which accounts need attention?"
- **UI:** a sortable/filterable table (by health score, last login, active-client count),
  each row linking to a per-studio drilldown route (`/admin/analytics/studios/[id]`,
  matching the portfolio reference's `people/[id]` drilldown-as-route pattern) showing the
  health-score explanation (`studioActivitySummaries.healthScoreExplanation`), recent
  activity timeline, and roster snapshot.
- **Explicit label:** "Rule-based triage score, not a predictive model" shown directly
  under the score, every time it's displayed — per the brief's own instruction not to
  present an arbitrary weighted score as validated.

### 9. Client Engagement
- **Question:** "Are clients actually using what their coach set up for them?"
- **KPIs:** weekly active clients, check-in/workout/nutrition-logging adoption, all
  aggregate, no per-client health content ever surfaced here (per `privacy-security.md`).

### 10. Referrals
- **Question:** "Is the endorser program working?"
- **KPIs:** codes created, referrals attributed, conversion rate (attributed → active
  studio). Explicitly separate from the Acquisition page's marketing-channel numbers
  (`attribution-design.md`).

### 11. System Health
- **Question:** "Is anything actually broken right now?"
- **KPIs:** error rate (last 24h, by route), job failure count, p50/p95 API latency.
- **Data source:** `operational_event`, rolled up hourly — kept visually and
  architecturally separate from every product page above.

### 12. Analytics Data Quality
- **Question:** "Can I trust the numbers on the other 11 pages?"
- **KPIs:** events ingested vs. expected (anomaly flag if today's volume is wildly off
  trend), schema-validation failure count, rollup-job lag (`analytics_checkpoint` age),
  known reconciliation checks (see `testing-strategy.md`/`risks-and-open-questions.md`).
  This page exists specifically so a founder never has to *wonder* whether a weird number
  elsewhere is a real business signal or a pipeline bug — it's the one page that answers
  that question directly.

## Cross-cutting UI requirements (every page)

- Date-range picker + previous-period comparison, shared via URL state (portfolio
  pattern above).
- CSV export (aggregate rows only, per `privacy-security.md`).
- Loading state: skeleton rows, never a blank page (Traiv's existing component library
  already has skeleton primitives per this session's own work).
- Empty state: an explanation of *why* it's empty (no data yet vs. filtered to nothing),
  never a bare "No results."
- Data-freshness indicator on every page reading a rollup table, naming the exact last-
  computed time — never let a stale dashboard look live.
