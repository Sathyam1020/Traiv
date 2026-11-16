# Architecture

Grounded entirely in `repository-audit.md`'s findings. See `architecture-decisions.md`
for the three-option comparison this recommendation is drawn from.

## Shape: existing backend, existing database, existing job primitive, no new service

`apps/api` gains one new feature directory (`features/seo/`), following the same
structure every other feature already uses (service functions + Zod-validated routes
+ scenario tests). `packages/db` gains new tables (`database-design.md`), in the same
schema package, migrated the same way every other table is. `apps/admin` gains one new
nav section (`admin-dashboard.md`). No new deployable, no new host, no new runtime.

This is Option A from `architecture-decisions.md`, chosen because nothing in the audit
demonstrates a need for Option B (a dedicated worker process) or Option C (a separate
service) — see that document for the full comparison, including what would change the
answer.

## The daily cycle: a timer, not a job-queue consumer

The master prompt's §17 describes one sequential pipeline per day: check budget, sync
GSC, discover keywords, score, select at most one opportunity, brief it, research it,
draft it, verify it, QA it, queue it for human approval. This is **one unit of
sequential work**, not many small parallelizable units — the opposite of what the
`job` table's claim/lease/retry machinery is for (that machinery exists for "a hundred
independent plan-generation requests a day," not "one orchestrated pipeline").

So the daily cycle is a `startSeoAutopilot()` function, registered in `server.ts`
exactly like `startAnalyticsRollup()` and `startCheckInReminders()`: a `setInterval`
tick (hourly check, same reasoning as the analytics rollup — "has today's cycle
already run" is cheap to check far more often than once a day actually needs),
guarded by a busy-flag against overlapping runs, checkpointed in a new
`seo_workflow_runs` row so a crash mid-cycle resumes rather than silently skipping a
day or double-running. See `workflow-design.md` for the full state machine.

**Where the job table *is* reused**: individual steps that call an external, possibly
slow or transiently-failing provider (an LLM draft call, a SERP API call, a keyword API
call) are each wrapped as one `job` row of a new kind (e.g. `seo_draft_article`), so a
transient provider failure retries with the table's existing backoff instead of
restarting the whole day's cycle from scratch. This requires `startWorker()` actually
running — see `repository-audit.md`'s finding that it currently isn't, and
`implementation-roadmap.md` Phase 1 for making that true first.

## Deliberately separate from product analytics

Two analytics systems already coexist in this repository without being joined:
cookieless anonymous marketing analytics (`analytics_event`) and authenticated
in-app product/operational analytics (`product_event`/`operational_event`). Each
exists because the other's schema and privacy model is wrong for its question.

GSC performance data (what Google reports about Traiv's own pages, not anything about
a visitor) is a **third** kind of data, and gets its own tables
(`seo_gsc_observations` et al., `database-design.md`), never joined to either existing
system, for the same reason the existing two aren't joined to each other: different
subject, different cardinality, different retention, different query pattern.

This also directly answers the master prompt's own instruction not to build revenue
attribution or make subscription revenue the optimization objective: the schema
boundary enforces it structurally, not just by policy. There is no table in this design
with a column that could hold MRR, and no join path from anything here into
`packages/db/src/schema/product-analytics.ts`.

## Layering

```
Admin UI (apps/admin)          — Content Studio, Opportunities, Competitor Intel,
                                  Performance, Optimization Queue, Workflow Ops, Settings
         │ HTTP (admin-gated, same requireAdmin() every other admin route uses)
         ▼
API feature layer (apps/api/src/features/seo/)
  ├─ keyword-intelligence.ts   — provider adapters + normalization
  ├─ competitor-intelligence.ts
  ├─ serp-analysis.ts
  ├─ opportunity-scoring.ts    — deterministic scoring function, no LLM
  ├─ research.ts               — source retrieval + claim ledger
  ├─ content-generation.ts     — multi-stage draft pipeline (LLM calls isolated here)
  ├─ seo-validation.ts         — deterministic checks, no LLM
  ├─ quality-gate.ts           — combines deterministic + LLM-assessed scores
  ├─ publishing.ts             — writes to the EXISTING `post` table via the EXISTING
  │                              admin post-CRUD functions, not a parallel path
  ├─ gsc-sync.ts                — official GSC API client, incremental
  ├─ performance-intelligence.ts
  ├─ orchestrator.ts            — the daily-cycle tick function
  └─ providers/                — LLM + external API adapters, each behind an interface
         │
         ▼
packages/db (new tables, see database-design.md) + EXISTING `post`/`membership`/`user` tables
         │
         ▼
Postgres (Neon) — same database, same connection pool as everything else
```

External calls (LLM providers, SERP/keyword APIs, GSC API) happen only from
`providers/`, each behind a narrow interface with a `console`/fake implementation for
development and tests — the exact pattern `apps/api/src/integrations/food-label.ts`
and the OTP transport system (`apps/api/src/integrations/otp/`) already use
successfully twice in this codebase.

## What this explicitly does not touch

- `apps/web/src/lib/seo.ts`, `components/seo-schema.tsx`, `app/{sitemap,robots}.ts` —
  complete, reused as-is.
- `apps/web/src/content/{features,competitors,tools}.ts` — hand-curated, read-only
  reference for competitor-gap analysis, never a write target.
- `packages/db/src/schema/product-analytics.ts` and everything under
  `apps/api/src/features/analytics/` — a different system answering a different
  question, per the master prompt's own instruction.
- `apps/api/src/jobs/{queue,worker}.ts` — reused, not modified, except for the one
  prerequisite boot-wiring change named in `implementation-roadmap.md` Phase 1.
