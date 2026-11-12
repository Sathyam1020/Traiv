# Metric definitions

## Executive / business

- **Total trainers** — distinct `user` rows with an active `membership` where `role =
  'owner'` in a non-deleted `studio`. (Not "total users" — a client is also a `user` row;
  these must never be conflated in a count.)
- **Total clients** — distinct `client` rows where `status != 'archived'` (roster statuses
  per `.ai/state/current.md`'s roster work).
- **DAU** — distinct `userId` with ≥1 `product_event` (or `analytics_session`) in the
  trailing 24h, **computed separately for trainers and clients** — a combined "DAU" across
  two very different usage patterns (a coach checking in once a day vs. a client logging a
  meal 4x a day) is not a meaningful single number, and this plan does not produce one.
- **WAU / MAU** — same, 7-day / 30-day trailing windows.
- **DAU/MAU ratio** — a stickiness proxy, reported per role (trainer, client), never
  blended.
- **Trainer:client ratio** — total active clients ÷ total active trainers, platform-wide
  and per-tier (`studio.tier`).
- **Subscription adoption** — **not computable today.** `studio.tier` exists as an enum
  but nothing enforces or bills against it yet; this is reported as "tier distribution of
  signups" (how many studios are on each enum value) not "paying customers," until
  billing exists.

## Activation — candidates, not one true definition (per the brief's own instruction)

Three candidate activation definitions are proposed, to be validated against real
cohort data once there's enough of it:

1. **Trainer activation, narrow:** first client successfully joined (`client_joined`
   event fires) within 7 days of `signup_completed`.
2. **Trainer activation, broad:** narrow definition **plus** at least one
   `workout_template_created` or `recipe_created` event within the same window (evidence
   the coach actually built something, not just invited someone).
3. **Client activation:** first `workout_session_completed` **or** first
   `check_in_submitted` within 14 days of `client_joined` — two OR'd events because the
   product supports either path to "doing something," and requiring both would undercount
   real engagement.

Validation plan: once ~50+ real trainer signups exist, compute week-4 retention
separately for "activated" vs. "not activated" under each candidate definition; whichever
produces the largest retention gap between the two groups is the one with actual
predictive value, and that's the one promoted to "the" activation metric company-wide.
This is explicitly a future step, not a decision made in this document.

## Product engagement

- **Feature adoption rate** (per feature) — distinct studios/users with ≥1 corresponding
  event in a 30-day window ÷ total active studios/users in that window.
- **Weekly active clients** — distinct `client` rows with ≥1 engagement event
  (`workout_session_completed`, `check_in_submitted`, `meal_logged`,
  `measurement_logged`) in the trailing 7 days. **This is CLAUDE.md's own stated
  north-star metric** ("weekly-active-clients ÷ total-clients is what this product is
  judged on") — this plan's dashboard puts it on the Overview page, not buried in a
  sub-page.
- **Check-in completion rate** — `check_in_submitted` count ÷ `check_in` rows with
  `dueOn` in the window, using the server's own `checkInState` function as the source of
  truth for what counted as due — never a separately-computed definition that could drift
  from the one the product itself enforces.
- **Onboarding completion rate** — users reaching the final intake step ÷ users starting
  step 1, within a cohort (signup week).
- **Time to first meaningful action** — median time between `signup_completed` /
  `client_joined` and the relevant activation event above.

## Retention

- **User retention** — did this specific person come back and do something, by role.
- **Account retention** — did this studio (regardless of which specific person logged
  in — an owner or an invited coach) stay active. Different from user retention when a
  studio has multiple coaches.
- **Revenue retention** (gross/net) — **not computable** until billing exists; defined
  here only as a placeholder: Net Revenue Retention = (starting MRR of a cohort +
  expansion − contraction − churn) ÷ starting MRR, standard SaaS definition, to be wired
  once `revenue_snapshot` has real data.
- **Engagement retention** — % of a signup cohort still meeting the "weekly active
  client" bar N weeks later. This is the one retention cut that matters most given the
  product's own stated metric, and gets its own cohort heatmap on the dashboard.

## Revenue (prerequisite-gated — see `architecture-audit.md`)

MRR, ARR, new/expansion/contraction/churned/reactivation MRR, ARPA, LTV, CAC, LTV:CAC,
gross/net revenue retention, trial-to-paid conversion, failed payments, refunds,
discounts: **all require a real billing system first.** This document defines the
standard SaaS formulas for each (available on request / in a follow-up doc once billing
is scoped) but does not design dashboards against data that doesn't exist, per the
brief's explicit instruction. The prerequisite is described precisely in
`implementation-roadmap.md`'s "Future" phase.

Distinguishing booked/billed/collected/refunded/recurring revenue, currency handling, and
tax/discount treatment are all billing-system design questions that come *before*
analytics can report on them — they are out of scope for this document and flagged as a
founder decision in `risks-and-open-questions.md`.

## Trainer/studio health score — explainable, not predictive

A **rule-based** score (0–100), built from a small, fixed set of inputs, each with a
visible weight:

| Input | Weight | Rationale |
|---|---|---|
| Logged in within 7 days | 25 | Recency is the single strongest simple signal |
| ≥1 active client with recent engagement | 25 | A coach with zero engaged clients has nothing to retain |
| Used a core feature (workout/nutrition/check-in create) in 14 days | 20 | Building, not just checking in |
| Client onboarding completion rate for their roster | 15 | Are their clients even getting set up |
| No drop in active-client count vs. 30 days ago | 15 | Churn-within-roster signal |

The score and **its inputs** are both stored (`studioActivitySummaries.healthScoreExplanation`)
so the admin drilldown always shows *why* a number is what it is — never a bare number
presented as if it were a validated churn model. It is explicitly **not** described
anywhere in the admin UI as a prediction; it's a triage heuristic for a founder/support
person deciding who to check in on.

## Client engagement — aggregate only

Workout completion rate, weekly active clients (above), check-in completion rate,
nutrition-logging adoption rate, onboarding completion rate: all are **counts and
rates**, computed over `product_event` rows whose `properties` never carry the
underlying health values (per `event-taxonomy.md`'s explicit exclusion list).
