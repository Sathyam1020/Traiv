# Event taxonomy

Every event below is grounded in an action that exists in the repo today — the
"instrumentation location" column names the real file and function/route. No event here
represents a feature that doesn't exist yet.

## Contract shape (every event has these fields)

| Field | Notes |
|---|---|
| `id` | client-minted UUIDv7 (`newId()`, same as every other table — dedup key) |
| `name` | `snake_case`, `noun_verb_past` tense (`workout_logged`, not `log_workout`) — chosen to match this repo's own SQL/DB naming convention (snake_case columns throughout) rather than inventing a second casing style |
| `occurred_at` | client-reported event time (may differ from `received_at`; see clock-skew note below) |
| `received_at` | server-assigned, authoritative for ordering |
| `user_id` | nullable — null only for pre-auth marketing events, which stay in `analytics_event`, not here |
| `studio_id` | nullable — null for client-only or pre-studio events |
| `actor_role` | `trainer` \| `client` \| `system` (server-originated events, e.g. a job completing) \| `endorser` (added Phase 2 — `becomeEndorser` is reachable by anyone signed in and is explicitly neither role) |
| `source_app` | `trainer` \| `client` \| `admin` \| `endorse` \| `web` |
| `properties` | small, typed JSON — see per-event "required/optional properties" below, never free-form |
| `privacy_class` | `operational` (safe to show in raw form to any admin) \| `sensitive` (aggregate-only, never exported raw — see `privacy-security.md`) |
| `dedup_key` | see "Deduplication strategy" below |
| `schema_version` | integer, starts at 1 — see §9 in `architecture-decision.md`'s self-review for why this exists from day one |

## Deduplication strategy (applies to every event)

At-least-once delivery, not exactly-once — this repo doesn't claim exactly-once
anywhere else either (`onConflictDoNothing` on a client-minted id is the standing
pattern — see `ADR 0004` and the `check_in` / `recipe_ingredient` tables). Every event's
primary key is its client-minted `id`; a retried send with the same id is a no-op
(`ON CONFLICT (id) DO NOTHING`). For events with a natural idempotency key beyond the
random id (e.g. "this exact check-in was submitted"), the event also carries that
resource's own id in `properties` so a duplicate business action is detectable even if
two different event ids were minted for it (a double-tap generating two client-side
event rows) — funnel/count queries de-dupe on `(user_id, name, properties->>'resource_id')`
within a short window where that matters, documented per-event below.

## Core identity & session events

| Event | Purpose | Trigger | Required props | Optional props | Source | Instrumentation location |
|---|---|---|---|---|---|---|
| `session_started` | DAU/WAU, session counting | First authenticated page load / app open in a new client session | `app_version` | `platform` (web/pwa-installed) | all apps | App-shell mount, e.g. `apps/client/src/app/(app)/layout.tsx` |
| `signup_completed` | Funnel step, activation cohort anchor | Server-side, the moment a `user` row + `studio` row commit in one transaction | `method` (phone/google) | `endorser_code` if attributed | **server**, `api` | `createDefaultStudio` transaction, `apps/api/src/features/auth/*` |
| `business_name_confirmed` | Funnel step (this session's own fix) | `studio.nameConfirmed` flips true | — | — | server | `renameStudio`, `apps/api/src/features/studio/service.ts` |
| `client_invited` | Funnel step | A join code is generated/shared or `joinByCode` succeeds | `invite_method` | — | server | `apps/api/src/features/studio/*` (join-code route) |
| `client_joined` | Funnel step, trainer-activation signal | `joinByCode` creates the `client` row | — | — | **server**, authoritative | `joinByCode`, per `.ai/state/current.md`: "the only path that creates a client row" |

## Product usage — trainer side

| Event | Purpose | Trigger | Required props | Source | Instrumentation location |
|---|---|---|---|---|---|
| `workout_template_created` | Feature adoption | A new row in the templates table commits | `session_count` | trainer | workout template create route, per ADR 0024 (Template→Session→Exercise→Set) |
| `workout_assigned_to_client` | Activation signal | A template is attached to a client | — | trainer | workout assignment route |
| `check_in_schedule_set` | Feature adoption | Studio/client check-in weekday or grace-days changed | — | trainer | `apps/api/src/features/studio/check-ins.ts` (`scheduleFor`) |
| `recipe_created` / `mealplan_created` | Feature adoption | Nutrition create routes | `source` (coach/system-copy) | trainer | `apps/api/src/features/studio/nutrition.ts` |
| `roster_status_changed` | Engagement signal | `PATCH /studios/:id/clients/:id` | `from_status`, `to_status` | trainer | roster PATCH route, `.ai/state/current.md` |

## Product usage — client side (aggregate/pseudonymous properties only — see privacy-security.md)

| Event | Purpose | Trigger | Required props | Source | Instrumentation location |
|---|---|---|---|---|---|
| `onboarding_step_completed` | **The** funnel for the 15-step intake | Each `flow.next(stepIndex, patch)` call resolves | `step_index` | client | `apps/client/src/components/intake/use-intake-flow.ts` |
| `onboarding_abandoned` | Drop-off detection | Session ends with onboarding incomplete (inferred server-side from last-saved step + inactivity, not a client "goodbye" event — those are unreliable) | `last_step_index` | **server**, inferred | computed in the rollup job, not emitted live |
| `check_in_submitted` | Core activation metric input | `submitCheckIn` / `submitClientCheckIn` succeeds | `check_in_id`, `on_time` (bool, derived from `checkInState`) | **server** | `apps/api/src/features/studio/check-ins.ts` / `apps/api/src/features/client/check-ins.ts` |
| `workout_session_started` | Engagement | `startSession` | `template_id` | client→server confirmed | per the existing client-workout API plan (`GET .../sessions/:id/start`) |
| `workout_session_completed` | **Weekly-active-clients input** (CLAUDE.md's stated north-star metric) | `finishSession` | `template_id`, `total_seconds` | **server** | finish-session route |
| `meal_logged` | Engagement | `POST /entries` in the food logger | `kind` (`food`/`recipe`/`manual`/`plan`/`personal` — the real `FoodItem.kind` domain) — **never** the food name or quantity as a raw analytics property, that's product data already in `food_log_entry`, not analytics | client | `apps/client/src/app/(app)/food/_components/logger.tsx` |
| `measurement_logged` | Engagement | `saveOnboardingMeasurement` / `MeasurementEditor` save | `metric_code` (e.g. `weight`, `arm` — never the value) | client | `apps/client/src/app/(app)/you/_components/profile-actions.tsx` |

Note on `measurement_logged`/`meal_logged`: the **event** records that an action
happened and its category, never the health value itself. The value already lives in
`client_measurement`/`food_log_entry` — the system of record — and analytics has no
business duplicating it (§H of the brief, and `privacy-security.md`).

## Referral / growth

| Event | Purpose | Trigger | Required props | Source | Instrumentation location |
|---|---|---|---|---|---|
| `referral_code_created` | Growth funnel input | `endorser` row created | — | server | `apps/api/src/features/endorse/*` |
| `referral_attributed` | Referral conversion | `referral` row created (the one-per-studio insert) | `endorser_id` | **server**, authoritative | referral attribution route, per `endorse.ts`'s `UNIQUE(studioId)` constraint |

## Operational events (separate privacy class, see `architecture-decision.md` §I)

| Event | Purpose | Trigger | Required props | Source |
|---|---|---|---|---|
| `api_request_failed` | Error-rate dashboard | Any 5xx (and optionally 4xx) response | `route`, `status`, `duration_ms` | server middleware |
| `job_failed` | Background-job visibility | A `job` row transitions to `status = 'failed'` | `kind`, `attempts`, `error` | job runner, reusing `packages/db/src/schema/job.ts` |

These two live in a **separate table** from product events (`architecture-decision.md`'s
explicit instruction not to mix high-cardinality operational telemetry into product
tables) — see `data-model.md`'s `operational_event` table.

## What is explicitly NOT an event property, anywhere

- Raw workout notes, chat messages, meal-photo URLs, medical/health free text.
- Exact measurement values (weight in kg, circumference in cm) — only that a
  measurement *of a given type* was logged.
- Full names, phone numbers, emails in `properties` — identity is carried by `user_id`/
  `studio_id` foreign keys, which the admin dashboard resolves through a join when a
  human with the right access actually needs a name, not by copying PII into every event
  row.

## Clock skew

`occurred_at` is client-reported and untrusted for anything except display/debugging
("this device thought it was 3 minutes ago"). `received_at` (server `now()`) is
authoritative for every funnel/retention/ordering calculation. A client whose clock is
wrong by hours doesn't corrupt any metric that matters, because nothing orders by
`occurred_at`.
