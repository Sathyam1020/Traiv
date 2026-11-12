# Architecture audit

Everything below was verified directly against the repository on 2026-11-11, not
recalled from documentation. Where a doc disagreed with the code, the code wins and the
doc discrepancy is noted.

## ⚠️ A documentation staleness found during this audit

`.ai/state/current.md`'s "What exists" / "What does not exist" section (near the bottom
of the file) states: *"No plans, nutrition or payments... The client app exists but only
does auth and attach — no workouts, logs or check-ins, because those tables do not
exist."* This is **false as of the current schema** — `workout.ts` (317 lines),
`check-in.ts`, and `nutrition.ts` all exist, are populated, and are wired into real
routes (confirmed below). The top of the same file (dated entries from 2026-10-30
onward) correctly describes a built nutrition system, meal plans, and client food
logging. The bottom section was evidently never updated after nutrition/workouts/
check-ins shipped. **Do not trust that section for anything** — this audit used the
schema files and route files directly instead. Payments genuinely do not exist, though
(see below) — that part of the stale section happens to still be correct.

## Apps (`apps/`)

| App | Port | Framework | Purpose | Current depth |
|---|---|---|---|---|
| `trainer` | 3000 | Next 16 | Coach-facing app | Full product: clients, workouts, nutrition, check-ins, vault, chat placeholder |
| `client` | 3001 | Next 16, real PWA | Client-facing app | Onboarding, Today, workouts, food, check-ins, profile |
| `admin` | 3003 | Next 16 | Internal/founder tool | **4 pages**: `dashboard`, `analytics`, `posts`, `waitlist` — all under `apps/admin/src/app/(app)/` |
| `endorse` | 3002 | Next 16 | Referrer-facing app | Endorser code, referral list |
| `web` | 3004 | Next 16 | Public marketing site | 24 prerendered routes, own analytics/CMS/waitlist |
| `api` | 4000 | Express 5 | Backend for all of the above | One process, one EC2 instance |

Admin is the smallest, least-developed app in the monorepo — it moved from a single
`TopBar` screen to `AppShell` only once it grew past one screen (ADR 0020, referenced in
`.ai/state/current.md`). It is the natural home for this plan's dashboard, but it should
not be assumed to have any analytics-specific infrastructure beyond what's listed below.

## Packages (`packages/`)

- `db` — Drizzle schema + migrations, the single source of truth for every table.
- `ui` — shared design system (`AppShell`, `Page`, tokens, ~25 components) every app uses.
- `phone`, `nutrition`, `exercises` — domain packages, not relevant to analytics directly.
- `lead-intelligence` — **a separate, already-built research pipeline** (ADR 0033,
  `.ai/state/current.md` top entry, dated 2026-11-11): "Live seven-tab Sheets CRM and
  local CSV/XLSX exports... 61 records... 16-record reviewed shortlist." This is for
  *finding* coach leads (a research tool), not for tracking in-product referral
  conversions — do not conflate it with the referral/endorser analytics in §J below.

## Database — full schema inventory (`packages/db/src/schema/*.ts`)

| File | Tables | Role |
|---|---|---|
| `user.ts` | `user` | One row per person, regardless of role (ADR 0004: "what a person *is*, not what role they hold") |
| `studio.ts` | `studio` | `tier` enum (`free`/`starter`/`pro`/`studio`) — **no billing columns** |
| `client.ts` | `client` | The coaching relationship row |
| `auth.ts` | sessions, `auth_challenge`, OTP state | — |
| `check-in.ts` | `metric`, `check_in`, `check_in_answer` | Weekly check-ins; `metric` is the shared/studio-owned catalog (studio_id nullable = global) |
| `workout.ts` | 317 lines — templates, sessions, exercises, sets | ADR 0024 model: Template → Session → Exercise → Set |
| `nutrition.ts` | `ingredient`, `recipe`, `recipe_ingredient`, `recipe_step`, meal plans, `food_log_entry` | Full nutrition system (ADR 0025, 0026, 0028–0031) |
| `library.ts` | `exercise`, `exercise_customization` | The global exercise library (studio_id nullable = global, same pattern as `metric`) |
| `measurements.ts` | `client_measurement` | Per-client logged values (weight, circumference, photos) |
| `endorse.ts` | `endorser`, `referral` | Referral attribution — **one referral per studio, ever** (`UNIQUE(studioId)`), no commission/payment columns |
| `marketing.ts` | `waitlist`, `post` | Marketing site's launch list + CMS |
| `analytics.ts` | `analytics_event`, `analytics_salt` | **The existing first-party analytics system** — see below |
| `job.ts` | `job` | Generic background-job table — see below |
| `vault.ts`, `messaging.ts`, `tag.ts`, `steps.ts`, `intake.ts`, `feedback.ts`, `client-settings.ts`, `trainer-settings.ts` | — | Supporting features, not analytics-relevant directly |

No schema file for payments, subscriptions, invoices, or transactions exists anywhere in
this list. `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET` exist as env
vars (`.env.example`) with an explicit comment that they are "not read by anything yet —
payments are unbuilt." **Confirmed, not assumed**: revenue analytics has no data source
today.

## The existing analytics precedent — read this before designing anything new

`packages/db/src/schema/analytics.ts` defines `analyticsEvents` and `analyticsSalts`.
`.ai/decisions/0021-marketing-platform.md` is the ADR behind it, and it is explicit:

> "No analytics. The default answer is PostHog or GA. Both mean handing every visitor to
> a third party, a consent banner under the DPDP Act, and a dashboard we cannot join
> against our own tables."

Design, as built:
- A visitor is `sha256(daily-salt + ip + user-agent)`, truncated. The IP is never
  stored; the salt is deleted the next day (`analytics_salt`, one row per UTC day).
  This makes yesterday's hashes **permanently unreadable**, not just inconvenient.
- Cost: "returning visitor" is not a question this data can answer. Same person,
  different id tomorrow. Daily uniques are exact; cross-day identity is not tracked, by
  design.
- No rollup tables. `count(*) group by day` runs directly over the raw table.
- Bot filtering happens once, "at the door" in the collect handler
  (`apps/api/src/features/marketing/collect.ts` — verify exact filename), not as a
  `WHERE` clause repeated across every dashboard query.
- The admin read side is **one endpoint**, `GET /admin/analytics` in
  `apps/api/src/features/marketing/admin.ts`, returning nine aggregates in one request
  via `Promise.all` over raw SQL (`db.execute(sql\`...\`)`), explicitly **not** the Drizzle
  query builder, because — per the comment in that exact file — "an interpolated Drizzle
  column renders *unqualified* inside a `sql` template, which is invisible until a join
  makes it ambiguous." This is also the exact bug class already caught once in this
  codebase on the client roster (documented in `.ai/state/current.md`): a correlated
  subquery silently resolved to the wrong table's `id` column. **This plan reuses raw,
  explicitly-qualified SQL for every aggregate, for the same reason.**
- Write path: `POST /m/collect`, batched up to 20 events, answers `204` unconditionally
  — "it is called from a page the visitor is often leaving... a 400 only teaches a
  scraper what shape to send next."

This is not a toy — it's a real, tested, production precedent for exactly the kind of
system this plan needs to build for authenticated users, with one deliberate difference:
**authenticated product events do not need the salted-hash anonymization at all**,
because a real `userId` and `studioId` already exist on every session. The cookieless
design solved "how do we measure someone we're not allowed to identify." Product
analytics solves a different problem — "how do we measure someone we already know" — and
reusing the anonymization machinery there would be solving a problem that doesn't exist
while discarding information (which trainer, which studio) the business actually needs.

## Background jobs — reuse this, don't add a queue service

`packages/db/src/schema/job.ts`: a generic `job` table (`kind`, `payload` jsonb,
`status` enum, `attempts`/`maxAttempts`, `runAfter`, `lockedAt`/`lockedBy`, `error`).
The file's own comment states the reasoning directly: *"Postgres is already here, `FOR
UPDATE SKIP LOCKED` is exactly the primitive this needs, and the rows are their own audit
trail... Redis or SQS buys throughput this product will not reach for years, at the cost
of infrastructure nobody is paid to run."* This is the exact mechanism this plan uses for
nightly/hourly analytics rollups (daily active users, funnel aggregates, retention
cohorts) — a new `kind` value (e.g. `analytics_rollup`), not a new job system.

## Auth, sessions, and admin access

- Sessions are opaque, revocable tokens (not JWT) — `.ai/state/current.md`, ADR 0005/0010.
- `requireAdmin()` (`apps/api/src/middleware/admin.ts`) is **a single hardcoded phone
  number** (`env.ADMIN_PHONE`), normalized through the same `toE164` phone validation
  used everywhere else. There is **no admin roles table, no RBAC beyond this one check**.
  Every `/admin/*` route is gated by this single middleware. This matters for §8
  (privacy/security): today, "admin access" and "founder access" are the same thing by
  construction, which is simple and correct for a one-person admin app, but will need
  real roles before a second person (e.g. a support hire) needs dashboard-only access.
- Client-minted IDs are UUIDv7 (`packages/db/src/id.ts`, the `uuid` package's `v7()`),
  not a custom ULID. The doc comment is explicit about why: *"time-sortable, and safe to
  mint on a client device... what makes offline sync idempotent."* Every new analytics
  table in this plan uses the same `newId()`.

## Offline/PWA event buffering precedent

`apps/client/src/lib/workouts/outbox.ts` is a durable, IndexedDB-backed write-ahead
queue for logged workout sets — chosen explicitly over `localStorage` because
"`localStorage`'s read-modify-write is not atomic across tabs." The record key is the
server's own natural key, and re-queuing the same key overwrites rather than appends
("only the latest intent matters"). **This plan's offline analytics event buffer reuses
this exact pattern** (same `idb` library, same IndexedDB-not-localStorage reasoning) —
see `event-taxonomy.md` and `implementation-roadmap.md`.

## Logging / monitoring — does not exist

No `pino`, `winston`, `@sentry/*`, or any structured logging library appears in any
`package.json` in the monorepo. The only existing output mechanism is `console.log` /
`console.warn` (e.g. `apps/api/src/server.ts`'s boot message). There is no error
aggregation, no request tracing, no latency percentile tracking anywhere today. §I of
this plan treats this as a real, separate gap from product analytics — see
`architecture-decision.md` for the recommended minimal approach.

## Referral / endorser system — what's real

`endorser` (one per user, unique code) and `referral` (one per studio, ever — enforced by
a unique index on `studioId`) both exist, are tested, and have a UI (ADR 0017,
`.ai/state/current.md`). There is no commission or payout table — "payouts need
payments, so no money is shown anywhere" is accurate. §J of this plan is scoped to what
*can* be measured today: codes created, referral attribution events, conversion from
referral to active studio — not commission, which is billing-dependent.

## Marketing site — acquisition data already exists

`apps/web` already captures UTM parameters and writes `analytics_event` rows with
`utmSource`/`utmMedium`/`utmCampaign` columns, per `packages/db/src/schema/analytics.ts`.
This plan's acquisition/attribution design (`attribution-design.md`) is about
**connecting** this existing capture through signup into the authenticated product
database, not rebuilding visitor tracking from scratch.

## Summary: implemented vs. not, for this plan's purposes

| Capability | Status |
|---|---|
| Anonymous marketing-site analytics | ✅ Built, tested, in production (ADR 0021) |
| Admin RBAC beyond single founder phone | ❌ Does not exist |
| Product/event analytics for trainer/client apps | ❌ Does not exist — this plan's primary scope |
| Background job infrastructure | ✅ Built (`job` table), reusable as-is |
| Structured logging / error monitoring | ❌ Does not exist |
| Billing / subscriptions / payments | ❌ Does not exist at all (env vars only, unused) |
| Offline event buffering precedent | ✅ Built for workouts (`outbox.ts`), reusable pattern |
| Referral/endorser attribution | ✅ Built, no commission layer |
| Client-side identity (userId/studioId on every session) | ✅ Built — this is why product analytics doesn't need cookieless tricks |
