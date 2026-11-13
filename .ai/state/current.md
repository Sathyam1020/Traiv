# Current state

## Retire phone auth — Google OAuth + email OTP via Resend, 2026-11-12

ADR `0034-retire-phone-auth.md`. Phone number is no longer an auth method anywhere, for
any app, for any user — only Google OAuth or email + OTP. `.env`/`.env.example`:
`ADMIN_PHONE` → `ADMIN_EMAIL`, `MSG91_*`/`WHATSAPP_*`/`ANDROID_SMS_*` removed,
`RESEND_API_KEY`/`RESEND_FROM_ADDRESS` added, `OTP_TRANSPORT`/`OTP_FALLBACK` enums now
`email | console` / `email | none`.

Schema: `otp_transport` gets `email` and `challenge_purpose` gets `email_verify`
(migration `0057`, applied to dev and `traiv_test`); both retired alongside
`phone_verify`/`phone_link`/`sms`/`whatsapp`/`android-sms` in their enum definitions —
never written again, never dropped, so no migration has to touch rows that already
reference them. A new partial unique index + CHECK on `auth_challenge.email` mirrors the
existing phone ones exactly.

Backend: `apps/api/src/integrations/otp/{sms,whatsapp,android-sms}.ts` deleted outright;
`resend.ts` added. `requestChallenge`/`verifyChallenge`/`signInDirect`/`establishSession`
in `features/auth/service.ts` re-keyed from `phone` to `email`;
`requestPhoneLink`/`verifyPhoneLink`/`linkPhoneDirect` and their three
`/auth/phone/*` routes deleted (no replacement — Google sign-in no longer needs a
follow-up verification step of any kind). `requireAdmin()` matches `ADMIN_EMAIL` against
`users.email` — the only admin-identification mechanism in the codebase. `signup_completed`'s
tracked `method` is `"email" | "google"`.

`completeGoogleLogin` (`features/auth/google.ts`) got one real behavior fix the plan
hadn't anticipated: an email collision against an unverified address used to resolve by
pointing the person at phone verification (`needs_phone_to_link`); with phone gone, it
now resolves by freeing the unverified claim when Google vouches for the address (and
falling through to create a new account) or refusing outright when neither side vouches
for it (`email_conflict`).

Frontend: all four apps (trainer, client, admin, endorse) rewrote their own sign-in UI —
there is no shared auth-flow package. Trainer additionally deleted `/link-phone`,
`use-link-phone-flow.ts`, `link-phone-form.tsx`, and the `needsPhone` redirects in
`AuthGuard`/`business-name-form.tsx` — Google sign-in is now complete and self-sufficient
the moment it returns. Client's `/join/[code]` invite-claim flow is now email+OTP, same
mechanism, no backend change needed (it already called the generic
`/auth/challenge`/`/auth/verify`, just with the wrong field name). All four apps' dev-bypass
picker now shows email instead of phone.

`@traiv/phone`/`PhoneField` are untouched — `client.phone`/`user.phone` stay as
denormalized contact info, and the marketing site's waitlist capture
(`apps/web/src/components/notify-me.tsx`) still uses `PhoneField` for something
unrelated to auth.

## In-house product analytics — Phases 0–4 (full roadmap except "Future"), 2026-11-11

Plan: `docs/analytics/*.md` (12 docs, not committed). Phase 0 (structured logging) and
Phase 1 (event ingestion + the admin Overview page) of `implementation-roadmap.md` are
built and tested, not yet committed.

Phase 0: `apps/api/src/lib/logger.ts`, wired into `middleware/error.ts` and a new
request-timing stamp in `app.ts`.

Phase 1: `product_event`/`event_definition`/`daily_metric_rollup`/`analytics_checkpoint`
tables (migration `0052`, applied to dev and `traiv_test`); `POST /analytics/events`
ingestion (`features/analytics/routes.ts`); the top 5 events instrumented server-side
at the exact call sites named in `event-taxonomy.md` (`signup_completed` ×2 paths,
`client_joined`, `check_in_submitted`, `workout_session_completed`,
`onboarding_step_completed`), each outside its transaction and `.catch(() => {})`'d so
tracking can never fail the real action; an hourly, checkpoint-resumable daily rollup
(`features/analytics/rollup.ts`) computing DAU/WAU/MAU per role into
`daily_metric_rollup`, started from `server.ts`; an admin read API
(`features/admin/product-analytics.ts`, `GET /admin/analytics/overview`); the admin
app's Overview page (`apps/admin/src/app/(app)/analytics/overview`), with the existing
marketing dashboard relocated to `analytics/marketing` under a shared sub-nav layout.

Five scenario tests (`features/analytics/analytics.test.ts`) cover retry/dedup, two
actors, the untrusted-`occurredAt`-vs-server-`receivedAt` ordering guarantee, day/month
boundary correctness, and checkpoint resumption — the boundary test caught and fixed a
real bug (a bare `::date` cast comparing against a `timestamptz` column was resolving
against the session timezone, not UTC, shifting DAU bucket edges). `tsc --noEmit`,
`biome check`, and the full API test suite (420/422; the 2 failures are pre-existing
and unrelated — an `ingredient` upsert ON CONFLICT constraint and an exercise-library
404 bug in `studio/workouts.test.ts`) pass. The admin app's `next build` and `tsc
--noEmit` pass.

Phase 2 (full event catalog + client SDK + Acquisition/Funnels/Product Usage/
Engagement): all ~13 remaining `event-taxonomy.md` events instrumented — 10 server-side
(`business_name_confirmed`, `client_invited`, `workout_template_created`/
`workout_assigned_to_client` split by `clientId` in one `createTemplate`,
`workout_session_started`, `check_in_schedule_set`/`roster_status_changed` split by
which fields actually changed in one `updateClient`, `recipe_created`, `mealplan_created`,
`referral_code_created`, `referral_attributed`) plus 3 client-originated
(`session_started`, `meal_logged`, `measurement_logged`) via a new offline-buffered,
append-only IndexedDB outbox (`apps/client/src/lib/analytics/{outbox,track}.ts`,
deliberately not the workout outbox's "latest write wins" semantics — an event is a
fact, not a correction). `onboarding_abandoned` stays unimplemented (no single trigger
exists for it; needs an inactivity threshold nothing in `.ai/` specifies). New schema:
`analytics_session` (unpopulated so far — flagged, not papered over),
`acquisition_attribution`, `funnel_definition` (migrations `0053`–`0055`, applied to
dev and `traiv_test`; `0055` seeds the two funnels named in `admin-dashboard-spec.md`
§3). The acquisition bridge threads `utm_source/medium/campaign` from the signup
page's own query string through `auth_challenge`'s new `pending_utm_*` columns (phone
path) and a short-lived `traiv_oauth_utm` cookie (Google path, mirroring the existing
`OAUTH_STATE`/`OAUTH_APP` cookies) into `acquisition_attribution`, written in the same
transaction as the new user. Four new read endpoints
(`features/admin/product-analytics.ts`: `/acquisition`, `/product-usage`,
`/engagement`, `/funnels` + `/funnels/:id`) and four new admin pages, all querying raw
`product_event` bounded by date range rather than extending the rollup (data-model.md's
own "funnel/cohort exploration, bounded by date range" posture) — the funnel endpoint
walks each user's events in JS (ordered-step-with-break, median gap per step), not one
large SQL aggregate.

11 new scenario tests across `features/analytics/phase2-events.test.ts` (conditional
event-firing correctness — the false→true edge, field-vs-field independence,
clientId-based event split, referral idempotency, invalid-code handling, create-vs-
update) and `features/admin/funnels.test.ts` (the funnel walk itself) caught two real
bugs before they shipped: a `name = any($1,$2,...)` raw-SQL mismatch (drizzle renders
an interpolated array as an `IN`-shaped list, not a single array value `ANY()` needs),
and a raw `db.execute` timestamp column coming back as a string, not a `Date`, breaking
every gap calculation. `tsc --noEmit`, `biome check`, and the full API suite (428/430 —
same 2 pre-existing unrelated failures as Phase 1) pass; `next build` passes for api,
admin, client, and trainer.

Phase 3 (Retention/Cohorts, Trainers & Studios health, System Health, Data Quality —
`admin-dashboard-spec.md` §6, §8, §11–12): new `operational_event` table (separate from
`product_event`, never joined to it) — `api_request_failed` from the existing error
middleware, a new `api_request_completed` on every request via a `res.on("finish")`
hook (added beyond `event-taxonomy.md`'s original two names because System Health's
p50/p95 latency KPI needs the full duration distribution, not just failures),
`job_failed` from `jobs/queue.ts`'s `fail()` only on the permanent give-up branch (not
a requeued retry), and `admin_drilldown_viewed` on every studio drilldown read, per
`privacy-security.md`'s own instruction. A rule-based (0–100) studio health score
(`features/analytics/health-score.ts`, `metric-definitions.md`'s weight table exactly:
25/25/20/15/15), computed hourly alongside the existing rollup tick into a new
`studio_activity_summary` table, with every input's pass/fail or rate stored in
`healthScoreExplanation` for the drilldown's "why." The "no drop in active clients vs.
30 days ago" input has no real baseline on day one — it defaults to full credit,
explicitly labeled `no_baseline_yet` rather than faking a comparison; the job also
writes today's per-studio active-client count into `daily_metric_rollup` each run, so
that baseline becomes real after 30 days. Retention cohorts (signup-week × weeks-since,
cell = % of cohort weekly-active) and the Trainers & Studios list/drilldown are computed
on demand from `product_event`/`studio_activity_summary`, same "bounded by date range,
no new rollup" posture as Phase 2's Funnels. Migrations `0056` (new tables). 4 new admin
pages (Retention, Studios + `[id]` drilldown, System Health, Data Quality).

A new scenario test (`features/analytics/health-score.test.ts`) seeds one studio that
clears every input and one that clears none, asserting the exact weighted score (100
and 15) and that `onboardingCompletionRate`'s 0/1 rate reads as 0, not a silent
full-credit default — the one input that's supposed to do that is `noDropInActiveClients30d`,
and only when there's genuinely no baseline. `tsc --noEmit`, `biome check`, the full API
suite (429/431 — same 2 pre-existing unrelated failures as Phase 1/2), and `next build`
for api/admin/client/trainer all pass.

Phase 4 (Referrals page, full funnel builder UI, CSV export, aggregation-threshold
enforcement — `implementation-roadmap.md`'s last scheduled phase): `GET
/admin/analytics/referrals` (codes created, referrals attributed, and a
still-active-conversion rate computed only over attributed studios — kept separate
from Acquisition's UTM numbers per `attribution-design.md`); full funnel CRUD (`POST`/
`PATCH`/`DELETE /admin/analytics/funnels[/:id]`, plus `GET .../event-names` so the
builder's step picker reads the real server-side event catalog instead of a second
hardcoded list) and a builder sheet in the Funnels page — create, edit, and delete a
funnel with no deploy, not just view the two seeded ones. A shared CSV-export utility
(`apps/admin/src/lib/csv.ts`) with small-cell suppression (masks any count under 5 as
`"<5"` rather than silently dropping the row, which would still leak its approximate
size via the gap in the total) wired into Acquisition, Product Usage, Studios, System
Health, Retention, and Funnels — Retention additionally masks a whole cohort's
percentages, not just its size, since the percentage alone would still reveal a single
studio's outcome in a cohort that small.

3 new scenario tests (`features/admin/phase4.test.ts`) cover the funnel CRUD round
trip end to end (create → list → compute → edit → recompute → delete → 404), the
<2-steps rejection, and that the referrals conversion rate correctly excludes a
referred studio that was later soft-deleted. `tsc --noEmit`, `biome check`, the full
API suite (432/434 — same 2 pre-existing unrelated failures as every earlier phase),
and `next build` for admin pass.

**This closes every phase in `implementation-roadmap.md` except "Future"** (revenue
analytics, a possible ClickHouse migration, admin RBAC beyond one phone number — all
three explicitly prerequisite-gated in that doc, not scheduled work).

**Not done:** manual browser verification of any new page; populating
`analytics_session` itself (nothing writes to it yet — Engagement's "sessions/week" is
a `session_started`-event proxy, not real sessions); a generic multi-property-filter
funnel step (the builder supports one `key=value` filter per step, the only shape any
real funnel in this codebase has needed so far).

## Lead intelligence — 2026-11-11

Initial executed research pipeline in `packages/lead-intelligence`, with 201 records (147 gyms, 50 published-online-offer coaching prospects, 4 unverified trainers). The additional 25-prospect batch requested on 12 November 2026 is complete; no ongoing search or outreach. Live seven-tab Sheets CRM and local CSV/XLSX exports delivered. See package README and feature acceptance for verification, evidence, commands and limitations. Stretch collection targets and fully automated enrichment are not complete. No outreach sent.

## PWA rollout (client + trainer) — in progress, not committed

Phases 0–5 done, phase 6 in progress. Full plan, the six founder-approved requirements,
and phase-by-phase status: `.ai/state/pwa-rollout.md`. Nothing from this initiative has
been committed or pushed yet.

## Public website SEO work — 2026-11-06, done and pushed

All 13 phases closed and committed (`a134656`, `748c330` on `main`, pushed to `origin`). Metadata/schema/sitemap, pSEO gates with all 5 `/compare/*` pages and 7 of 8 `/features/*` pages indexable (real sourced competitor data, re-verified live against traiv.fit once it went live), performance (-80% page weight), accessibility (100 on every checked route), UTM attribution, favicon-in-Google-Search fix (SVG → ImageResponse PNG, Google's favicon crawler doesn't support SVG). Full detail in `docs/seo/final-audit.md` and `docs/seo/HANDOFF.md`.

**Owner follow-up, not yet done:** Search Console/Bing setup (external account access); Organization schema's `sameAs` (LinkedIn/Twitter/Instagram links) and formal legal/contact fields are deliberately empty — no real profiles/entity exist yet to cite, and nothing was invented. Give the real URLs once they exist and it's a small code change in `structured-data.tsx`. Blog is empty in production (no posts published yet, not a bug — `/blog` correctly shows its empty state).

## Public website SEO follow-up — 2026-11-13, branch `seo/code-only-fixes`, not committed

Re-audit of production with Claude SEO v2.6.0: score 69/100, report and action plan in
`docs/seo/audit-2026-11-13/`. Code-only fixes applied in `apps/web`:
homepage `<title>` now carries the brand (root page sits outside the layout's
`title.template`; `pageMetadata` now reads `title.absolute`); `/blog` is `noindex` and out
of the sitemap while `getPosts()` returns nothing — this also triggers if the API is down
at revalidation, lifting on the next good one; baseline security headers in
`next.config.ts` (no CSP yet — needs nonces/hashes for Next's inline scripts and JSON-LD);
`/llms.txt` built from the same content files and indexability predicates as the sitemap;
visible + `BreadcrumbList` breadcrumbs on the four `/tools/*` pages. Verified on a local
production build: typecheck, `audit:seo` 32/32, `audit:responsive 360 1280` clean, 360px
screenshot. Still open and needing product decisions: discipline landing pages
(`content/disciplines.ts` is unused), feature page titles/descriptions, replacing the
`r2-cdn.coachway.io` recipe images, founder content on `/about`.

**Updated:** 2026-11-01
**Phase:** nutrition A–F implemented; founder functional/UI acceptance pending

## Wensity shared UI migration — 2026-11-01

Shared primitives now use official Wensity registry source via Base UI and Tabler,
with compatibility adapters at the existing public imports. Traiv purple/light/dark
tokens and product layouts remain. CLI configuration and update instructions:
`docs/wensity-ui.md`. Dependency installation and source review completed; tests,
typechecks, builds and browser checks were not run per user instruction. Manual
acceptance is pending; do not describe this migration as release-verified.

## Client UI interaction polish — 2026-11-01

Client-only visual/motion tokens, touch/focus feedback, structural food loading,
contextual query recovery, workout intent-prefetch, ordered set saving with error
recovery, compact pauseable rest timer, and truthful save/finish feedback implemented.
No API contract or dependency changes. Targeted lint/typecheck and four save-queue tests
pass; Webpack production build passes (default Turbopack CSS worker port restriction
in this environment). Browser/device acceptance remains pending.
Handoff and audit: `docs/client-ui-polish.md`.

## Nutrition Phase F closeout — 2026-11-01

Legacy schema/code removal was already complete under migration 0024. Repository searches
found no remaining runtime dependencies; a read-only schema query confirmed `food`, `foods`,
`food_request`, `diet_plan`, `meal`, `meal_item`, `meal_log` absent in the configured database.
No new destructive migration or data transfer was required. Historical migrations and
snapshots are retained. ADR 0025 and the nutrition spec now agree with ADR 0031: Food is
available before plan assignment, and imported System recipes exist.

Client routes now include `/food/log`, `/food/recipes`, `/food/recipes/[recipeId]`,
`/food/foods`, `/food/plans/[planId]`, and published option detail pages. Recipe library
cards open details; Edit/Duplicate/Delete are explicit actions. Diary-origin library
navigation preserves its return destination. Private food brand support is migration
0035 (applied). Client mobile navigation uses the opt-in labelled glass style; Chat is
still a placeholder, not implemented messaging. Cookbooks remain excluded.

Handoff: `docs/nutrition-acceptance.md`. No tests, typechecks, builds or browser checks
were run. Functional acceptance and provider/device-dependent checks remain pending.

## Published plan detail page — 2026-10-31

The Food plan card now navigates to `/food/plans/[planId]` rather than opening a sheet.
The page uses a purple theme hero, back navigation, calorie/macro pill, rounded content
panel, underline meal tabs, and a two-column recipe grid. Cards show real calories and
protein; time badges use available recipe prep/cook metadata. Recipe logging continues
using the published adjusted option snapshot. The selected diary date travels through
navigation and back to Food. UI testing remains with the founder as requested.

## Food layout correction — 2026-10-31

Food now owns a full-height frame: its header and floating logging actions sit outside
an independently scrolling diary. This removes sticky-header travel and footer movement
at the end of content. The header follows the supplied Coachway reference: shopping icon,
centered date, calendar popover, and seven circular-date pills in Sunday–Saturday order.
Horizontal snapping pages complete weeks; tapping a date keeps the same week in place.
Quick add and barcode use circular icon buttons around a theme-primary Log food pill, anchored
above the existing mobile navigation. Selected dates use the app signal color; controls
use the existing primary/surface/foreground theme tokens. Other client pages and app navigation are unchanged.
No tests/typechecks/browser checks run, following the founder's code-only instruction.

## Client Food — expanded Phase E, 2026-10-31

Food now includes a daily diary, frozen recipe/food/plan logging, serving/gram/ml quantities,
quick add, edits/moves/copies/yesterday, date selection and calorie/macro summaries. Published
plans retain server-owned adjusted portions. Added private client foods/recipes, favorites,
recent results, barcode camera/manual lookup and Open Food Facts cache, label transcription
with confirmation, Photo Log conversation and coach replies, shopping lists with aggregation,
calorie/weekly/date goals, and private personal plans with recipe choices. Cookbooks excluded.

Trainer Client → Nutrition includes diary/photo/report access and five enforced client
permission switches. Read/mutation status rules remain shared with existing client auth.
Migrations 0032–0034 are applied to the configured development database. The client Food tab
now reveals without requiring an assigned plan. Label OCR needs
FOOD_LABEL_API_KEY; optional model FOOD_LABEL_MODEL. Uploads reuse Cloudinary configuration.
No deployment or LAN configuration changed. ADR 0031 records boundaries and data ownership.
Tests/typechecks/browser checks not run under the founder's code-only instruction; UI
acceptance remains pending. See the expanded Phase E checklist in the feature spec.

## Client nutrition assignment — Phase D, 2026-10-30

Trainer Client → Nutrition is enabled. Empty state offers a new client-only plan or a
copy from a published studio template. New plans reuse PlanSettingsSheet and show the
existing overview calorie recommendation with Apply. Copy uses the source published
snapshot, a two-step picker, optional calorie/macro overrides and fresh slot/option IDs.
Both paths create private drafts with clientId set, so they never appear in Mealplans.

The existing builder is extracted into PlanBuilder and embedded in the client tab,
including recipe sheets, manual quantities/steps, lock, save, publish and discard.
Client plan selector supports several plans; archive removes a plan from the tab and
client visibility. Shared library routes retain clientId-null listing, while single-plan
operations authorize by studio and the client's roster relationship.

Client GET /c/:studioId/mealplans derives clientId from requireClient; only active,
unarchived published snapshots are returned. Food reveal requires a published snapshot;
/food offers a read-only plan/recipe/ingredients/steps view. Draft changes stay private
until Publish. Food logging and barcode features remain Phase E. No schema migration or
new dependency. No tests/typechecks/browser checks run for this phase; founder UI
acceptance pending, following the standing code-only instruction.

## Meal plan recipe sheet — 2026-10-30

Clicking a recipe card now opens a rounded right-side meal sheet instead of expanding
inline. It lists the meal's recipes with collapsible editors, thumbnails, macro totals,
compare, lock and Personal-save actions. Ingredients support quantity/unit edits, library
search/add and removal. Show/Hide Steps reveals the existing editable/reorderable RecipeSteps
composition. Nutrients toggle separately. Previous/Done/Next stays fixed at the bottom.
Changes update the device draft; Save changes persists the plan, and Publish remains
separate. API reconciles additions against visible ingredients and preserves server-owned
nutrition/allergen metadata. Original library recipes remain unchanged. No tests run.

## Meal plan templates — Phase C, 2026-10-30

Implemented trainer `/nutrition/mealplans` and `/nutrition/mealplans/:id`, with a shared
Create/Edit settings sheet. Defaults populate four recipe alternatives for each enabled
meal where eligible recipes exist. Settings include targets, percent/gram entry, studio
macro presets, ordered/custom meals, draggable distribution, preferences, source and
matching. Builder supports recipe selection/removal, per-plan ingredient quantities and
unit conversion, original comparison, locks and saving a Personal recipe. Headers remain
fixed inside the existing shell; both themes use existing tokens and font.

Server selects eligible recipes and fits ingredient quantities deterministically. Allergens
are exclusions; dietary preferences influence ranking. Shortages remain explicit. Calories
are choice ranges, and macros/micros are averages across each slot's alternatives, never a
sum of all alternatives or invented DV scores. Published snapshots survive draft edits;
Live/Local changes, publish, discard, duplicate and archive are implemented with studio
scoping, idempotent creation and revision checks. Device draft recovery is included.

Migrations 0030–0031 applied to development and test databases. No new dependencies or
branch. No tests, typechecks or browser checks run, as requested; founder UI acceptance
remains pending. Phase D client assignment was subsequently implemented below; Phase E client logging remains pending.
See ADR 0029 and `features/meal-plan-templates/`.

## Fixed library headers — 2026-10-30

Exercises, Templates, Ingredients and Recipes pin their title/search/filter controls
as one opaque sticky header inside the shell scroll region. Settings pins its heading.
Recipe and workout detail editors retain their existing fixed headers. Clients routes
are unchanged. Shared StickyPageHeader preserves Page gutters and mobile shell offset.
Recipe toolbar now has Search/Sort icons, Tag/Meal type/Type filter icons and a segmented
List/Grid icon control in place of the view dropdown. Code-only change; no tests or
browser checks run, per founder instruction.

## Recipe interaction corrections — 2026-10-30

Founder requested code edits only and will test the UI personally. No tests, typechecks
or browser checks were run for this correction (the earlier 360 passing scenarios
precede these UI changes).

Ingredient move arrows removed; rows keep only Delete. Instructions have pointer/touch
and keyboard drag handles and Delete, using an app-local RecipeSteps composition with
no dependency. Ingredient detail expansion animates open/closed and honours reduced
motion. Edit recipe opens a right-hand settings sheet with Cancel restoring its opening
snapshot. Save uses a normalised comparison with the saved recipe, so merely opening
settings or reverting edits does not enable it. Micronutrients are collapsed by default.
Right-side shared sheets have rounded top-left/bottom-left corners; left sheets mirror
them. Only desktop sidebar navigation, theme and account icons use solid silhouettes; mobile and
content icons remain outlined. Recipe filter chips stay compact rather than full-width.
Phase C was subsequently approved and implemented; see the entry below.

## Nutrition editing and reference polish — 2026-10-30

Ingredient table now follows the supplied Coachway structure: compact heading, search
icon, sort/new toolbar, icon filter pills, macro icons, category/country/library columns
and contained pagination. Ingredient edit sheets have fixed header/footer, grouped fields,
common and expandable additional micronutrients, serving conversion and ingredient type.
System ingredient/recipe forms are editable; saving creates a private Personal version
without a manual duplication step. Shared source PATCH permissions remain unchanged.
Recipe ingredient expansions edit preparation notes and minimum-unit choices; both persist
and survive duplication. Migration 0029 applied to development/test; 664 source ingredient
types populated from the existing export. Select menus anchor below controls and use
neutral selection, consistent padding and rounded surfaces. See ADR 0028.
Phase C was subsequently approved and implemented; see the entry below.

## Trainer typography — 2026-10-30

Coachway's live font is DM Sans, verified through computed body/button/table styles.
Trainer now uses DM Sans (400/500/600), with existing colours and light/dark support.
The earlier Tacto appearance preview was reverted. See ADR 0027.

## Ingredient search — 2026-10-30

Salt was present but buried by alphabetically sorted substring matches ("with salt",
"without salt"). Ingredient search now ranks exact names, phrase prefixes and whole
words before incidental substrings, before pagination, with shorter names breaking ties.
Whitespace is trimmed and SQL/regex metacharacters remain literal. The ingredient list
and recipe picker share this API. Regression covers retries, two studios, pagination,
case/whitespace and literal punctuation; all 8 nutrition scenarios and API typecheck pass.

## Nutrition layout refinement — 2026-10-30

Ingredients and Recipes lists use the same `Page max-w-none` container as Exercises.
The sidebar and its collapse preference are unchanged. Recipe details have a compact
header with the standard sidebar toggle, a summary/nutrients column and an ingredients/
instructions column that scroll independently from 768px. Phones use one scrolling
column. Ingredient rows disclose macro details, show conversion badges and calories;
changing a serving unit preserves ingredient weight. Nutrients use a semicircle and
visible micronutrient breakdown. Browser verified expanded/collapsed desktop sidebar,
independent left scrolling and gram-to-teaspoon conversion (32 g → 6.4 tsp, 499 kcal).

## Nutrition library — 2026-10-30

Phases A + B implemented. Trainer `/nutrition/ingredients`, `/nutrition/recipes`,
`/nutrition/recipes/:id`. Search, sort, pagination, multi-select filters, Personal/System
visibility, ingredient create/edit/delete, recipe create/edit/duplicate/delete, ordered
ingredients/instructions, servings and live calculated macro/micronutrient totals.
Shared source records remain immutable; editable System forms save independent Personal versions (ADR 0028).
All 136 Indian recipes live in this same library alongside 1,099 Coachway source recipes
(1,235 combined). The authenticated detail export resolves all 664 source ingredients
and preserves real preparation steps; 23 source recipes have none. Ingredient imports and migrations
0023–0028 are applied to development and test databases. See ADR 0026 and
`docs/nutrition-data.md` for datasets, pinned MIT IFCT archive, and original recipe data.

Device drafts survive navigation; stale recipe revisions return 409 instead of overwriting.
Signed uploads remain configuration-gated; hosted media URLs work without credentials.
One shared `@traiv/nutrition/recipes` calculation serves the editor and API.

Verified: 358 API scenarios, all workspace typechecks, trainer webpack production build.
Browser: shared Indian recipe search, duplication, quantity change/save, draft recovery,
mobile recipe creation and ingredient creation; layouts inspected at 360px and 1280px.
The old entries below describe earlier milestones and include outdated feature-absence
claims; this section and newer ADRs take precedence for nutrition.

Not included: meal-plan builder, client assignment, client Food screens or barcode scan.
Indian recipes currently use icon fallbacks; imported source recipes use their original image URLs.

## How we work

**Phase by phase, feature by feature.** Questions get answered when the phase that needs
them arrives — not up front. A question about studios sharing clients is a Studio-tier
question and gets settled when Studio tier is built.

Do not block work on decisions that belong to a later phase. Do not pre-emptively design
for them either.

## What exists

```
traiv/
  apps/
    api/       Express 5 · auth, studios, clients, endorsers · Neon   ✅ running
    trainer/   Next 16 · coach app, :3000                             ✅ running
    client/    Next 16 · client app, :3001                            ✅ running
    endorse/   Next 16 · referrer app, :3002                          ✅ running
    admin/     Next 16 · platform counts, :3003                       ✅ running
  packages/
    db/        12 tables, 14 migrations · 0012-13 not yet on Neon    ⚠️  pending
    ui/        tokens, 25 components, icons, the shell every app uses ✅ shared
    phone/     the one phone rule, 245 countries (ADR 0018)           ✅ shared
    nutrition/ BMR → TDEE → kcal → macros, no AI (ADR 0019)          ✅ shared
```

**Verified:** `pnpm -r typecheck` 9/9 · `turbo build` 4/4 · `biome check` clean ·
**207 tests** in ~3s against a local Postgres (`TEST_DATABASE_URL`).

### Visual direction — Featurebase (ADR 0022)

Every app is dark by default (`class="dark"` on `<html>`, the store falls back to dark;
light is a toggle away). Void canvas, charcoal panels, slate hairlines, a white primary
action, violet only for selected states and the product-frame glow. Headings are Inter
500 at 48/36 everywhere (fluid on phones); the marketing site keeps Bricolage for
headlines and is dark-only. Icons are Hugeicons Stroke Rounded through
`@traiv/ui/icons`; lucide is gone. Verified by screenshot on the marketing home, trainer
sign-in, trainer Today and Clients (dark and light), and the client sign-in; the web
responsive audit is clean at 360px.

Not yet done: coach brand colour is read by the API but not applied to `--signal` in the
client app; phone input and dev sign-in toggle are 40px tall on touch (pre-existing).

### Auth — code complete (ADR 0005, 0010, 0012)

`/auth/challenge` · `/auth/verify` · `/auth/profile` · `/auth/me` · `/auth/logout` ·
`/auth/config` · `/auth/google/start` · `/auth/google/callback` · `/auth/dev/*`.

OTP HMAC-hashed with `SESSION_SECRET`, 5-minute expiry, single-use, only the newest code
per number valid, 5 attempts, 5 *successful* sends an hour. Sessions are opaque tokens,
revocable immediately. Signup step derived, never stored. `/auth/challenge` answers the
same whether or not the number is registered.

### Client onboarding (ADR 0019)

Six steps between verifying a phone number and the client's home: goal, body, activity and
training, nutrition, a note for the coach, availability. **It blocks Today** — until it is
finished the home screen redirects into it. Each step saves as it is left, so a half-finished
intake resumes rather than restarts.

The answers are keyed on the **user**, not the coaching relationship, so hiring a second
coach asks nothing twice.

Finishing computes a calorie and macro target through `@traiv/nutrition` — Mifflin-St Jeor,
no model involved, every target storing the derivation that produced it. Pregnancy, the
conditions that need clinical context, extremes of BMI or age, and an undisclosed sex all
produce a `proposed` target that waits for the coach instead of reaching the client.

Weight lives in `body_metric` as a series, and targets are append-only, because both are
what the adaptation loop will read. Neither the loop nor any AI generation is built yet.

### Phone numbers (ADR 0018)

`@traiv/phone` wraps `libphonenumber-js/mobile` and is the only definition of a valid
number — the API, all four apps and the seed import it. The country is a dropdown over
245 countries, India first; everything is stored as E.164; landlines are rejected because
they cannot receive the code; no error message names a specific country's digit rules.

### OTP delivery (ADR 0012)

One transport interface, three implementations — MSG91 SMS, Meta WhatsApp, console.
Env-selected:

```
OTP_TRANSPORT=sms       # sms | whatsapp | console — one line to switch
OTP_FALLBACK=none       # fires only when the primary send throws
```

`auth_challenge` records `transport`, `sent_at`, `send_error`. A failed send does not
consume the user's quota. The server reports the delivering channel and the UI says so.
Production refuses to boot with a credential-less transport or `OTP_TRANSPORT=console`.

### Studios — complete (ADR 0011)

Every trainer owns one from signup, created in the same transaction. Slug
`firstname-xxxxxx`. Subscription belongs to the studio, so an invited coach still owns a
free one. Sessions open in: the session's studio → the studio that invited them → their
own. Switching verifies membership server-side. Switcher hides itself when there is one.

### Routes

```
trainer :3000   /signin  /signup  /dashboard (guarded)  /settings (guarded)
client  :3001   / (sign in)  /dashboard (guarded)  /join/:code

api :4000
  /health  /auth/*
  /studios                             your memberships
  /studios/:id/activate                requireStudio({ param: "id" })
  /studios/:studioId/join-code         requireStudio()  — any member
  /studios/:studioId/join-code/rotate  requireStudio({ role: "owner" })
  /studios/:studioId/join-code PATCH   requireStudio({ role: "owner" })
  /join/:code                          GET public preview, POST attaches
  /c                                   studios you are a client of — ungated by design
  /c/:studioId/me                      requireClient()
  /e/code/:code                        public endorser-code check
  /e/join · /e/me · /e/referrals       your own endorser record
```

**Authorization.** Three relationships, three gates, never interchangeable:
`requireStudio` for staff (ADR 0014), `requireClient` for clients, and endorser routes
scoped to the caller's own row. The studio always comes from the URL —
`session.activeStudioId` is where to land after signing in and authorizes nothing
(ADR 0016).

### Development without credentials

`ConsoleWhatsApp` prints the OTP to the API's stdout. A **Development sign-in** panel lists
seeded coaches and signs in with one click — it renders only if the API says the bypass is
on, and the API refuses to boot with `NODE_ENV=production` and `AUTH_DEV_BYPASS=true`.
`pnpm --filter @traiv/api seed` creates five coaches and backfills any missing studios.

### To go live, only env vars change

`WHATSAPP_*` switches the OTP transport to Meta Cloud API. `GOOGLE_CLIENT_ID` /
`GOOGLE_CLIENT_SECRET` turn on Google. `COOKIE_DOMAIN=.traiv.app` makes one session cover
every subdomain. No code changes.

## Blocked on things that are not code

| Blocker | Blocks | Needs |
|---|---|---|
| **DLT registration** | real SMS | A registered Indian company — GST/PAN. Individuals are not eligible. `MSG91_FLOW_ID` has nothing to put in it until the template is approved. **On hold by founder decision, 2026-09-12.** |
| **Meta Business verification** | real WhatsApp | Business documents; days to weeks, plus separate OTP template approval |
| **Google OAuth credentials** | Google sign-in | A Google Cloud OAuth client. The code has never executed. |

All three are behind the console transport and the dev bypass, so the full flow is
usable now and none of them blocks further feature work.

## What does not exist

No plans, nutrition or payments. The `client` table, the join code and seat limits
(free 2 / starter 8 / pro and studio unlimited) exist and are tested; a full roster
currently throws at the client rather than waitlisting — see ADR 0013. There is no
coach-facing roster UI and no way to add a client by hand: `joinByCode` is the only
path that creates a client row.

The client app exists but only does auth and attach — no workouts, logs or check-ins,
because those tables do not exist. Endorsers have a tested API and a UI (ADR 0017) but
payouts need payments, so no money is shown anywhere. The admin app shows counts only.

The trainer and client UIs have had no adversarial review.

### The coach's roster (`/clients`)

The first coach-facing screen on real data. `GET /studios/:id/clients` returns the rows,
the three tab counts and the five chip counts in one request; `PATCH .../clients/:id`
changes status and the end date; tags are a studio-scoped table with a join, written as
a whole set so a double-tap cannot leave a tag the coach unticked.

Two columns are still sample content and say so in the footer: the last message (there is
no messages table) and the plan icons (there is no generator). "Unread messages" counts
zero for the same reason — the chip is there so it works the day messaging does.
"New" and "missing" check-ins are derived from `training_session`, which is real.

`client.ends_at` is new. Null is open-ended and is shown as ∞; a date that has passed
does **not** change `status` on its own — it means the coach should look, not that the
system quietly ended the relationship behind them.

Three bugs found by driving it in a real browser, each of which typechecked and ran:

- **A Drizzle column interpolated into a `sql` template renders unqualified.** Inside the
  correlated subquery for "last session", `${schema.clients.id}` became a bare `"id"` and
  resolved to `training_session.id`, so every row came back as never having trained —
  while the chip counts, built from the same fragment, were correct. Written out as
  `sql.raw('"client"."id"')`, with a regression test.
- **CORS did not allow `PUT`.** The preflight answered 204 and the browser then refused
  to send the real request, so the tag write vanished with nothing in the server log.
  `cors.test.ts` now asserts every verb.
- **`shadcn add` overwrites `button.tsx`**, which took the `pointer-coarse` tap sizing
  with it. There is a note in the file now.

### Layout (ADR 0020)

One shell in `packages/ui/src/components/shell/`. `AppShell` — fixed sidebar from `lg`,
floating capsule bar below — for the trainer and client apps; `TopBar` for endorse and
admin, which have one screen each. `Page` is the single content measure at 1280px.

`lg` is the only breakpoint where navigation changes shape, and it is written once.
Single-task forms and long-form text stay narrow on purpose; everything else fills.

The client's tabs are **Today** and **You**, growing to Today · Plan · Progress · Chat · You
as features land.

## The marketing site (`apps/web`, port 3004)

Twenty-four routes, every one of them prerendered — `next build` shows no route that is
not `○` or `●`. Content lives in typed files under `src/content/`, so a feature, a
competitor, a guide or a tool is a data entry rather than a new page.

| Route | What is on it |
|---|---|
| `/` | Hero, the Sunday problem, the price wall, six promises, what you get, testimonials, pricing, FAQ |
| `/pricing` | Three tiers with a monthly/yearly switch, the price wall, the add-on table, a 12-question FAQ |
| `/features` + 12 × `/features/[slug]` | Every screen, with the four unbuilt ones marked |
| `/compare` + 5 × `/compare/[slug]` | Trainerize · FitBudd · Everfit · TrueCoach · Coachway |
| `/tools` + 3 calculators | Macro calculator (runs `@traiv/nutrition`), income, what to charge |
| `/blog` + `/blog/[slug]` | Every article. Written in the admin app, rendered from the database |
| `/tools/templates` | The copy-to-clipboard message pack |
| `/coaches` · `/about` · `/partnership` · `/affiliate` · `/demo` | |
| 3 × `/legal/[doc]` | **Drafts, `noindex`, and labelled as drafts on the page** |
| `sitemap.xml` · `robots.txt` · `not-found` | Sitemap is derived from the content files |

Three things to know before touching it:

- **Signing up is not open, so every button opens the launch-list form.** One component,
  `NotifyMe`, asks for an email and/or a phone and an explicit consent checkbox, and
  writes to `waitlist` through `POST /m/waitlist`. When signup opens, that component
  becomes a link in one place. See ADR 0021.
- **`src/content/testimonials.ts` is invented and says so at the top.** Six fake coaches
  are on the landing page right now. They have to be replaced with real attributed quotes
  before the site is public — published testimonials from people who do not exist are a
  misrepresentation under the Consumer Protection Act's endorsement rules.
- **No competitor number without a source and a date.** `comparison.ts` and
  `competitors.ts` enforce it; only the Coachway figures were read off a live pricing page
  (2026-10-08) and the rest render as "recorded, not re-checked since".
- **The legal pages need a lawyer and three values** — registered entity, GSTIN, grievance
  contact. A payment gateway will ask for all three, so this blocks launch, not just the
  site.

`@traiv/nutrition` now imports its own modules through its `exports` map
(`@traiv/nutrition/bmr`) rather than `./bmr.js`. Turbopack does not strip a `.js`
extension off a `.ts` file, so the public calculator could not bundle the package at all.
A new module in that package needs an `exports` entry.

**The marketing site is checked at 320 · 390 · 430 · 768 · 1024 · 1280 · 2000**, on all
21 routes, by `pnpm --filter @traiv/web audit:responsive` — headless Chrome with touch
emulation below 1024, reporting sideways scroll, tap targets under 44px and text under
11.5px. All clean. The product apps have not been through it yet; the script's `ROUTES`
list is where they would go.

What it caught, none of which was visible in the markup: a `min-w-[32rem]` table inside
an `overflow-x-auto` dragging its whole grid column to 534px on a 360px screen (grid
items are `min-width: auto`, so the fix is `min-w-0` on the *column*); the hero doing the
same thing at 320; footer rows and the sheet's links at 17px against a 44px rule; shadcn
controls defaulting to 36px; a range input with a 16px hit area; and a hydration mismatch
on every page, from an inline script stamping `data-js` on `<html>` — now replaced by the
`scripting: enabled` media query, which asks the same question in CSS and costs nothing.

### Components, animation and the blog

Everything on the site is a shadcn component on the repo's own tokens — the header is
Radix `NavigationMenu` (which tracks pointer direction, so the dropdown no longer closes
while you are moving toward it), the mobile menu is `Sheet`, the billing switch is
`Tabs`, and the calculators use `Select`, `Slider` and `ToggleGroup`. A short-lived
hand-rolled `field.tsx` is gone: `globals.css` already aliases every shadcn variable onto
the three-tier tokens, so shadcn components were always going to match.

**Two class-merging traps, both now fixed, both worth knowing before touching any
component.** `cn` only knew Tailwind's own scales, so every token this repo invented was
unrecognised and could not displace the built-in it was meant to replace: `text-body-sm`
was filed as a *colour* and silently dropped `text-primary-foreground` beside it (every
dark button in every app rendered black on black), and `rounded-control` could not
override a shadcn `rounded-sm` (hover shapes differed between items in the same menu).
`packages/ui/src/lib/cn.ts` now declares all four custom scales, and nothing imports from
`"cn"` directly. Separately, Radix `asChild` merges `className` by joining strings rather
than through `cn`, so a class on the child ties with the component's own — put the class
on the Radix component. Both are written up in `engineering/dependencies.md`.

The header capsule is always solid rather than fading in on scroll. The faded version
read as a header that had failed to load.

**`tw-animate-css` was missing and nobody knew.** Every shadcn component in the repo is
written against `animate-in` / `fade-in-0` / `zoom-in-95`, which are not Tailwind
utilities — so every dialog, dropdown, sheet and tooltip in all five apps had been
appearing and vanishing with no transition at all. An unrecognised class is simply not
emitted, so there was no warning. One `@import` in `globals.css` fixes it everywhere.

Scroll reveals are CSS behind a `[data-js]` flag set by an inline script, toggled by one
`IntersectionObserver` per element (`Reveal`). Deliberately not a motion component per
section: a library's `initial={{ opacity: 0 }}` is rendered into the HTML, so a bundle
that fails to load leaves the whole page invisible.

`/blog` and `/blog/[slug]` render posts from the database with `revalidate = 60`.

**There is one writing section, not two.** `/guides` and `/blog` were the same thing
under two names — a reader could not tell which held what, and the author had to decide
every time. The three guides are now ordinary posts (`pnpm --filter @traiv/api
seed:posts`, idempotent), the templates pack moved to `/tools/templates` because it is a
resource rather than an article, and `/guides`, `/guides/:slug` and `/guides/templates`
308-redirect permanently in `next.config.ts`.

### The marketing backend

| Route | Who | What |
|---|---|---|
| `POST /m/waitlist` | public | The launch list. Idempotent per person, never clears a detail a later blank submission omitted |
| `POST /m/collect` | public | Analytics beacon, batched up to 20 events, 204 whatever happens |
| `GET /m/blog`, `/m/blog/:slug` | public | Published posts only; a draft 404s rather than 403s |
| `GET /admin/analytics?days=` | admin | Nine aggregates in one request |
| `GET /admin/waitlist` | admin | The only admin surface that reads personal data |
| `GET/POST/PATCH/DELETE /admin/posts` | admin | The CMS |

**Analytics store no identifier.** A visitor is a hash of a daily rotating salt, their IP
and their user agent; the IP is never written and the salt is deleted the next day. Daily
uniques are therefore exact and "returning visitors" is unanswerable — the trade that
means the site needs no consent banner. Bots are dropped in the collect handler, not in
nine dashboard queries.

The admin app now has four screens (Platform · Analytics · Launch list · Blog) and moved
from `TopBar` to `AppShell`. The waitlist CSV export can only contain people who ticked
the consent box.

**Still to do before launch:** nobody has actually been sent the announcement the form
promises — that needs a mailer and a job, and `waitlist.notifiedAt` exists for it.
