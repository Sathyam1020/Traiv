# Repository audit

Every finding below was verified by reading the named file, not inferred from naming
conventions or assumed from the master prompt's background description. Where the
master prompt's assumptions turned out wrong, that's called out explicitly — the brief
itself says "verify every feature against the repository before describing it as
available."

## Monorepo structure

pnpm workspace. `apps/trainer` (coach-facing Next.js app), `apps/client` (client-facing
Next.js app), `apps/admin` (internal admin Next.js app — **this is where the new
dashboard integrates**), `apps/web` (marketing site + blog, Next.js), `apps/endorse`
(referral program app), `apps/api` (Express 5, the one backend every app calls),
`packages/db` (Drizzle ORM schemas + Postgres/Neon client), `packages/ui` (shared
component library), `packages/phone`, `packages/nutrition`. No separate "SEO service"
or "content service" exists anywhere.

## Prior SEO work — read first, do not regress

`docs/seo/HANDOFF.md` and `docs/seo/final-audit.md` exist and were read in full. Traiv
completed a 13-phase SEO/AEO/GEO/pSEO/performance/accessibility audit on 2026-11-06,
currently **uncommitted** (confirmed: `git status` at audit time shows the SEO work's
own files as modified/untracked, alongside unrelated in-flight work from this session —
see "Current git state" below). Summary of what exists and must not be rebuilt:

| Area | What exists | File |
|---|---|---|
| Metadata | One shared builder, complete OG/Twitter, typed escaped JSON-LD | `apps/web/src/lib/seo.ts` |
| Structured data | Visible breadcrumbs + escaped JSON-LD component; `BlogPosting` from real API fields; homepage FAQ from visible copy | `apps/web/src/components/seo-schema.tsx` |
| Sitemap | Generated from the same predicates that gate indexability; posts fetched live from the DB-backed blog API | `apps/web/src/app/sitemap.ts` |
| Robots | Allows legal-page crawl so noindex tags are readable; omits sitemap in preview | `apps/web/src/app/robots.ts` |
| pSEO gating | `featureIsIndexable` / `comparisonIsIndexable` — machine checks (verified capability, section-copy length, dated+sourced claims) gate both metadata and sitemap from the same predicate | `apps/web/src/content/features.ts`, `content/competitors.ts` |
| pSEO content | Typed TypeScript records, **not a CMS, not database rows** | `apps/web/src/content/{features,competitors,tools}.ts` |
| Automated QA | Custom crawl scripts checking titles/canonicals/schema/images/links against a live local build | `apps/web/scripts/seo-audit.mjs`, `scripts/responsive-audit.mjs` |
| GSC/Bing | **Not connected.** Setup instructions only, no account access performed | `docs/seo/discoverability-strategy.md` |
| llms.txt / IndexNow | **Not implemented**, deliberately — judged not warranted at current site size | `docs/seo/discoverability-strategy.md` |

**Consequence for this plan:** every document below assumes metadata, structured data,
sitemap, robots, and pSEO gating are solved problems. This plan's job is upstream of
all of that — deciding *what to write about* and *writing it* — and downstream in one
place only: reading real GSC performance once an account exists. Nothing here proposes
touching `apps/web/src/lib/seo.ts`, `components/seo-schema.tsx`, `content/features.ts`,
or `content/competitors.ts`.

## Current git state (verified, not assumed)

At audit time, `git status` shows the prior SEO work's files (per `final-audit.md`'s own
47/49-file list) alongside a large, unrelated body of uncommitted work from an
in-house product-analytics platform (`apps/api/src/features/analytics/`,
`apps/api/src/features/admin/{product-analytics,platform-health}.ts`,
`packages/db/src/schema/product-analytics.ts`, new pages under
`apps/admin/src/app/(app)/analytics/`). **Neither is this plan's to touch, commit, or
describe as part of the SEO system.** They're noted here only because the master
prompt explicitly requires inspecting git status before any future implementation,
and because the product-analytics work is directly relevant to one design decision —
see `architecture.md` §"Deliberately separate from product analytics."

## The blog: database, not MDX — verified

The master prompt's own §13 says "do not assume the storage model" and lists MDX,
Markdown files, database records, or CMS records as options to check. Verified:

- **Table**: `post` (`packages/db/src/schema/marketing.ts:88-120`). Columns: `id`,
  `slug`, `title`, `excerpt`, `body` (Markdown text), `coverUrl`, `coverAlt`,
  `authorName`, `readMinutes` (computed from body length, not stored independently),
  `status` (draft/published), `publishedAt` (null until first published, kept on
  unpublish), `seoTitle`/`seoDescription` (optional overrides), `createdAt`,
  `updatedAt`.
- **Written from**: the admin app, via `apps/api/src/features/marketing/admin.ts` —
  `GET/POST /admin/posts`, `GET/PATCH/DELETE /admin/posts/:id`. Admin-gated
  (`requireAdmin()`, see `security.md`).
- **Read publicly from**: `apps/api/src/features/marketing/routes.ts` — `GET /m/blog`
  (list, published only) and `GET /m/blog/:slug` (single post, 404 if not found or not
  published).
- **Consumed by**: `apps/web/src/lib/api.ts`'s `getPosts()`/`getPost()`, fetched with
  Next's `revalidate: 60` — a post published in the admin app reaches the public site
  within a minute, no deploy. `getPost` deliberately distinguishes a real 404 (returns
  `null`) from an outage (throws, so ISR keeps serving the last good cached page).
- **Rendered with**: `react-markdown`, chosen specifically because it never produces
  raw HTML and never touches `dangerouslySetInnerHTML` — a post body cannot carry a
  script tag regardless of what's typed into it.
- **Admin editor**: a plain Markdown textarea (`apps/admin/src/app/(app)/posts/[id]/page.tsx`),
  not a rich-text/WYSIWYG surface, deliberately — a WYSIWYG produces HTML the renderer
  discards.

**Decision this forces** (detailed in `publishing-design.md`): the content generation
and publishing engine writes `post` rows through the *same* admin API this editor
already uses, gated the same way (draft until approved, then a status flip to
`published`). No new table, no new rendering path, no Git-based publishing workflow.

## pSEO content: typed files, not a CMS — and a real boundary this creates

`content/features.ts` and `content/competitors.ts` are hand-authored TypeScript
records, each gated by a predicate function requiring verified capability, minimum
section-copy length, and — for comparisons — a dated, sourced, HTTPS claim for *every*
line including Traiv's own. This is **not** something an autonomous system should
write into. Editing a typed source file means a code change, a PR, a deploy; it is also
where the prior SEO work put its strictest factual-evidence bar specifically because
comparison claims (competitor pricing/features) are the highest-risk content type a
template page can carry.

**Consequence**: this plan's content types map to the `post` table (blog articles,
guides, resource pages) only. "Software comparison articles" and "competitor
alternative pages," which the master prompt lists as supported content types
(§7), are recommended as blog *posts that discuss* comparisons — not as new entries in
`content/competitors.ts`, which stays human-curated. See `risks-and-open-questions.md`
for the one open question this creates (whether a founder wants autonomous comparison
*pages*, as opposed to posts, ever — current recommendation: no, not without a
separate, explicit decision raising the evidence bar to match the existing predicate).

## Backend: Express 5, Postgres-only job infrastructure — and a real gap found

- **No Redis, no BullMQ, no queue service anywhere in the repository** — confirmed by
  grep across `apps/` and `packages/` for `bullmq`, `ioredis`, `redis`: zero matches
  outside this search itself. The master prompt's §27 asks to verify Redis/BullMQ
  exist before recommending reuse; they don't.
- **A Postgres-backed job table does exist**: `job` (`packages/db/src/schema/job.ts`),
  with `claim`/`succeed`/`fail` (`apps/api/src/jobs/queue.ts`) using
  `FOR UPDATE SKIP LOCKED` for safe concurrent claiming, and an in-process polling
  worker loop (`apps/api/src/jobs/worker.ts`, `startWorker()`, 1-second poll, drains up
  to 10 jobs/tick, lease-based reclaim of crashed-worker jobs). Four kinds are defined:
  `generate_plan`, `generate_food_image`, `weekly_review`, `purge_auth_rows`.
- **Real finding, verified by grep, not assumed working**: `startWorker()` is called
  from nowhere except its own definition file. `enqueue()` is called from nowhere
  except `apps/api/src/jobs/queue.test.ts`. **The job queue is fully built and tested
  but not currently running in the live API process.** Reusing it for anything —
  SEO or otherwise — requires first adding `startWorker()` to `apps/api/src/server.ts`,
  which is not a change this planning task is authorized to make, but must be named as
  an explicit Phase 1 prerequisite rather than silently assumed to already work.
- **A simpler, proven, currently-*running* pattern exists for recurring background
  work**: `startCheckInReminders()` (`apps/api/src/features/notifications/reminders.ts`)
  and `startAnalyticsRollup()` (`apps/api/src/features/analytics/rollup.ts`) — both
  plain `setInterval` timers registered in `server.ts`, each with its own busy-flag
  guard against overlapping ticks, each checkpointed in Postgres so a restart resumes
  rather than reprocessing. See `architecture-decisions.md` for why this plan's daily
  cycle (master prompt §17) follows this pattern rather than the job table for its
  top-level orchestration.
- **An existing LLM integration pattern**, for food-label photo transcription
  (`apps/api/src/integrations/food-label.ts`): a plain `fetch()` to OpenAI's Responses
  API, zod-validated structured output, env-gated with a graceful "not configured" error
  if the key is missing, **no AI SDK, no LangChain, no agent framework**. This is the
  house style `content-generation.md`'s LLM layer follows.

## Database schemas already in the repository

Full inventory in `database-design.md`. Headline finding relevant to every other
document: **two analytics systems already exist and are deliberately kept separate**:

1. `analytics_event`/`analytics_salt` (ADR 0021) — anonymous, cookieless, salted-hash
   marketing-site visitor analytics. No identity.
2. `product_event`/`operational_event`/`daily_metric_rollup`/`studio_activity_summary`
   (built this session, `packages/db/src/schema/product-analytics.ts`) — authenticated
   in-app product usage and API operational health. Explicitly never joined to #1.

This plan adds a **third**, for a third kind of data neither system holds: external
search-engine-reported performance (GSC clicks/impressions/position by page/query/date)
and the SEO system's own research/content-pipeline state. See `architecture.md` for why
this follows the same "separate systems, never joined" precedent rather than extending
either existing one.

## Admin app — integration point

Four screens today: `apps/admin/src/app/(app)/{dashboard,analytics,waitlist,posts}`,
navigated from `apps/admin/src/components/layout/nav-items.ts`. Single-admin auth:
`requireAdmin()` (`apps/api/src/middleware/admin.ts`) is one hardcoded phone number
(`ADMIN_PHONE` env var) compared against the signed-in session — **no roles table, no
real RBAC exists today.** See `security.md` for what this means for a multi-surface
Content Studio.

## Testing conventions

Vitest, scenario-style (real Postgres, real HTTP via `startApi()`/`Agent`, no mocking
of the database) — per `.ai/engineering/testing.md`'s explicit doctrine: "we write
scenario tests, not unit tests." The one place mocking is the house style is
provider/LLM boundaries (`vi.mock` on `env.js` for credential-gated behavior, seen
throughout `apps/api/src/features/*/`.test.ts`). `testing-strategy.md` follows this
exactly.

## Deployment infrastructure

Per `.ai/engineering/architecture.md`: Next.js apps deploy to Vercel; Postgres is Neon;
the API's host is Express-on-a-persistent-process (not serverless — `warmDb()` runs
once at boot, and `startWorker()`/`startAnalyticsRollup()`-style in-process timers only
make sense on a long-running process, confirmed by `server.ts`). No Kubernetes, no
containerized microservices, no separate SEO-specific infrastructure exists or is
implied by anything in the repo.

## Summary table

| Component | Existing implementation | Relevant files | Reusability | Required changes | Risk | Confidence |
|---|---|---|---|---|---|---|
| Blog storage | `post` DB table | `packages/db/src/schema/marketing.ts` | Full — this is the publish target | None to the table; a new `source` column to distinguish autopilot drafts from manual posts (see `database-design.md`) | Low | High |
| Blog admin CRUD | REST routes, admin-gated | `apps/api/src/features/marketing/admin.ts` | Full | Extend with autopilot-specific fields (brief, claims, QA status) | Low | High |
| Public blog read | `GET /m/blog[/:slug]` | `apps/api/src/features/marketing/routes.ts` | Full, unchanged | None | None | High |
| Metadata/schema/sitemap/robots | Complete, shared builders | `apps/web/src/lib/seo.ts`, `components/seo-schema.tsx`, `app/sitemap.ts`, `app/robots.ts` | Full, unchanged | None | None (do not touch) | High |
| pSEO typed content | Hand-curated TS records + predicates | `apps/web/src/content/{features,competitors}.ts` | Reference only — not a write target | None | Would be high-risk if auto-written to | High |
| Job queue table + worker | Built, tested, **not running** | `packages/db/src/schema/job.ts`, `apps/api/src/jobs/{queue,worker}.ts` | Partial — needs `startWorker()` wired into `server.ts` first | Add the missing boot call (prerequisite, Phase 1) | Medium (silent no-op if assumed running) | High |
| Recurring-tick pattern | Two working examples | `apps/api/src/features/notifications/reminders.ts`, `features/analytics/rollup.ts` | Full — this plan's daily-cycle model | None; new tick function follows the pattern | Low | High |
| LLM integration pattern | One working example (food-label OCR) | `apps/api/src/integrations/food-label.ts` | Full — the house style to follow | None; new provider module follows the pattern | Low | High |
| Admin app shell/nav | 4 screens, single-admin auth | `apps/admin/src/components/layout/nav-items.ts`, `apps/api/src/middleware/admin.ts` | Full for shell; RBAC is a real gap | New nav section; RBAC beyond one phone number is explicitly out of scope until a second human needs access | Medium (single point of failure/access) | High |
| Redis/BullMQ/queue service | **Does not exist** | — | N/A | Do not introduce without demonstrated need — see `architecture-decisions.md` | — | High (absence confirmed by grep) |
| GSC/Bing accounts | **Not connected** | `docs/seo/discoverability-strategy.md` | N/A | Founder must create/verify property and grant API access — outside engineering authority | High (blocks `gsc-integration.md` entirely until done) | High |
