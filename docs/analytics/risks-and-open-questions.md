# Performance SLOs, final self-review, and open questions

## Performance SLOs (operational targets, not hard requirements, unless marked)

| Target | Value | How measured |
|---|---|---|
| Event ingestion latency (p95) | < 200ms | API route timing, same as any other endpoint |
| Ingestion availability | Same as the API's own uptime — no separate SLA | Inherits existing monitoring (Phase 0) |
| Dashboard query latency (p95) | < 1s against rollup tables | Query timing in the admin API routes |
| Data freshness | Rollups complete within 1 hour of day-end (daily), or within the hour (hourly operational rollup) | `analytics_checkpoint` age, surfaced on the Data Quality page itself |
| Event processing lag | < 5 minutes between ingestion and inclusion in the *next* rollup run | Same checkpoint mechanism |
| Data-loss tolerance | Zero for events that reach the ingestion route successfully (durable Postgres write); **non-zero and accepted** for events never sent at all (an offline device that's lost/wiped before syncing) — this is a stated, accepted gap, not a hidden one |
| Recovery time (rollup job failure) | Next scheduled run self-heals via the checkpoint; no manual intervention required for a single missed run | Tested directly (`testing-strategy.md`) |
| **Hard requirement:** analytics must not degrade product flows | Ingestion is fire-and-forget from the caller's perspective (client doesn't block on it; the offline outbox already handles this for the client PWA); a product action succeeding/failing is never contingent on an analytics write succeeding | Enforced by design: analytics write failures are logged (Phase 0), never thrown back to the user-facing action |

## Final critical self-review

1. **Overengineering risk:** the 12-page nav is the brief's own ask, but shipping all 12
   simultaneously (explicitly warned against) would be the real overengineering mistake.
   The roadmap phases it; Phase 1 ships exactly one page.
2. **Unnecessary infrastructure:** none introduced. No queue, no second database, no new
   third-party credential. The entire design runs inside the existing Postgres instance
   and the existing `job` table.
3. **Expensive query patterns avoided:** every dashboard read hits a small rollup table,
   never a raw-event full scan; every query is explicitly column-qualified raw SQL,
   avoiding the exact unqualified-column bug class already caught once in this codebase.
4. **Privacy risks called out, not hidden:** sensitive health data is excluded by
   contract, not by convention; the admin-RBAC single-point-of-access gap is named
   directly rather than assumed away.
5. **Inaccurate-metric risks:** activation has no single definition yet — three
   candidates are proposed with an explicit validation plan, rather than declaring a
   number without evidence it means anything. The health score is labeled rule-based,
   never predictive.
6. **Missing event sources:** revenue/billing events don't exist because billing
   doesn't exist — documented as a prerequisite, not invented.
7. **Scaling bottlenecks:** addressed via the growth-scale table in
   `architecture-decision.md`; the single concrete trigger for re-evaluating Postgres
   (a measurably slow query *after* aggregation exists) is named explicitly, avoiding an
   open-ended "scale concern."
8. **Operational failure scenarios:** a crashed rollup job is recoverable via its own
   checkpoint (same mechanism the existing `job` table already provides for lock
   recovery); ingestion failures never block product actions.
9. **Implementation dependencies:** Phase 0 (logging) has none; Phase 1 depends on
   nothing outside this repo; client-side buffering (Phase 2) depends on the existing
   `idb` package already used for the workout outbox — no new dependency to justify
   under `.ai/engineering/dependencies.md`.
10. **Where a simpler alternative is better:** CAC/ROAS via a live ad-platform
    integration would be more "complete" but a manual monthly CSV import is simpler, has
    no new credential to manage, and is honest about being a point-in-time manual entry
    rather than implying a live sync that doesn't exist.

## Recommended architecture (restated)

Postgres-only (Option A), reusing the existing database and the existing `job` table's
background-processing pattern, through at least the 10,000-trainer horizon. No new
service, no new infrastructure, no third-party analytics SaaS for the core system.

## Estimated cost

- **Initial (Phase 0–2, current scale):** $0 incremental infrastructure cost. Possibly a
  small Neon/RDS compute-tier bump once raw event volume is in the tens of millions of
  rows (low tens of dollars/month, the same kind of bump the existing database would
  need anyway as the product itself grows).
- **At 10,000-trainer scale:** still Postgres-only per the growth table in
  `architecture-decision.md` (~330GB/year raw, trimmed to a fraction of that by the
  90-day retention policy) — a mid-tier managed Postgres instance, still a two-to-three-
  figure monthly cost, not a new budget line requiring a different order of magnitude of
  spend.
- **At 100,000-trainer scale:** this is the point where Option B (ClickHouse) becomes
  worth a real cost estimate — deferred, since it's a multi-year-out decision for a
  product currently measured in single-digit real trainers.

## Prioritized phases

See `implementation-roadmap.md` in full. Summary: Phase 0 (logging) → Phase 1 (ingestion
+ Overview page, the 5 highest-value events) → Phase 2 (full event catalog + client-side
buffering + Acquisition/Funnels/Product-Usage/Engagement pages) → Phase 3 (Retention,
Health scoring, System Health, Data Quality) → Phase 4 (Referrals, full funnel builder,
export) → Future (Revenue, gated on billing existing).

## Top 20 events to instrument first (in priority order)

1. `signup_completed` (server)
2. `client_joined` (server, authoritative)
3. `check_in_submitted` (server)
4. `workout_session_completed` (server) — feeds the CLAUDE.md north-star metric directly
5. `onboarding_step_completed` (client) — the 15-step funnel
6. `session_started` (all apps) — DAU/WAU input
7. `business_name_confirmed` (server)
8. `client_invited` (server)
9. `workout_template_created` (trainer)
10. `workout_assigned_to_client` (trainer)
11. `meal_logged` (client)
12. `measurement_logged` (client)
13. `recipe_created` / `mealplan_created` (trainer)
14. `check_in_schedule_set` (trainer)
15. `roster_status_changed` (trainer)
16. `referral_code_created` (server)
17. `referral_attributed` (server, authoritative)
18. `workout_session_started` (client→server)
19. `onboarding_abandoned` (server-inferred, not emitted live)
20. `api_request_failed` / `job_failed` (operational, Phase 0/3)

## Top 15 admin metrics to launch with

1. Weekly active clients ÷ total clients (the product's own stated north star)
2. Total trainers / total clients (platform size)
3. DAU/WAU/MAU, trainer and client, separately
4. Signups this week vs. last (with %Δ)
5. Trainer:client ratio
6. Onboarding completion rate (the 15-step intake)
7. Check-in completion rate
8. Signup→first-client-joined funnel conversion
9. Acquisition channel breakdown (UTM source/medium)
10. Referral code creation + attribution conversion rate
11. Feature adoption rate (workouts, nutrition, check-ins)
12. Week-over-week retention (engagement-retention definition)
13. Studio health score distribution (how many are red/amber/green)
14. API error rate, last 24h
15. Rollup/data freshness indicator (the Data Quality page's own headline number)

## Biggest technical risks

1. **Client-side offline buffering is the hardest single piece** (Phase 2) — it's the
   one part of this plan without a 1:1 existing precedent to copy verbatim (the workout
   outbox is close but not identical: analytics events are append-only/fire-and-forget,
   workout sets are upsert-by-natural-key). Budget real implementation time here, not
   "just like the outbox."
2. **Activation has no validated definition yet** — every "activation rate" number shown
   before the validation step (`metric-definitions.md`) is provisional, and the dashboard
   should say so rather than presenting a candidate definition as settled.
3. **Single-admin RBAC** is a real structural gap the moment a second person needs
   access — small to fix later, but easy to forget until it's urgent.
4. **Revenue analytics' absence** will be the first thing asked for in practice once the
   founder starts using this dashboard daily, and there is no shortcut — it waits on
   billing.
5. **`client_invited` undercounts real invite-sharing.** Its only real server-visible
   trigger is `rotateJoinCode` (`apps/api/src/features/client/join.ts`) — generating a
   *new* code. Showing or copying an already-issued QR/link is a client-side render of
   data already on the device, with no server round-trip to observe. A coach who never
   rotates their code but shares it constantly will show zero `client_invited` events
   despite actively inviting people. No workaround short of a client-side "share tapped"
   beacon, which was judged not worth a new call site for this one funnel step in Phase
   2 — revisit if the Funnels page's drop-off numbers for this step look implausible.

## Decisions requiring founder input (not resolved in this document)

1. **Which activation definition becomes "the" one**, once there's enough cohort data to
   validate against (`metric-definitions.md`).
2. **Whether a device identifier is ever worth it** for multi-touch marketing
   attribution, given the explicit DPDP/consent tradeoff ADR 0021 already made once
   (`attribution-design.md`) — this plan does not revisit that decision, but flags that
   only the founder can decide to revisit it.
3. **When to actually schedule Phase "Future" (revenue)** — depends entirely on when
   billing itself gets designed and built, which is a separate, larger decision outside
   this document's scope.
4. **Minimum aggregation-threshold cell size for exports** (`privacy-security.md`
   suggested 5 as a default — confirm or adjust).
5. **Whether EU/GDPR exposure is real enough to warrant separate legal review**
   (`privacy-security.md`) — this audit found no confirmation either way in the time
   available and does not want to assert a market claim it couldn't verify.
