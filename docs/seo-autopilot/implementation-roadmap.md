# Implementation roadmap

Phased per the master prompt's own "earn autonomy" instruction (§23) and
`architecture-decisions.md`'s MVP (1–8) vs. fully-featured (9–12) split. Every phase
ships with its own migration group (`database-design.md`) and scenario tests
(`testing-strategy.md`) — no phase is "done" without both, matching this repo's
Definition of Done.

## Phase 1 — Foundations
`providers/llm.ts`, `seo_provider_usage` cost tracking, `seo_competitors` +
`seo_keyword_candidates`/`seo_keyword_observations` tables and seeding (the 5
existing competitor names, a manually-entered seed keyword list — no external
provider required to start). Wire `startWorker()` into the API boot sequence
(currently dead code per the repository audit — a prerequisite for any job-table-based
step this plan relies on). No content generation yet; this phase proves the plumbing.

## Phase 2 — Opportunity scoring
`seo_content_opportunities`, the scoring function (deterministic, fully unit-tested
against fixed inputs before anything touches it live), `seo_strategy_versions` v1
with the master-prompt's initial weights. Admin `/seo/opportunities` read-only view.
No GSC yet — every GSC-sourced dimension starts `null`/unknown, exercising the
re-normalization path for real from day one.

## Phase 3 — Research and briefs
`seo_research_sources`, `seo_claims` ledger, `seo_content_briefs`. Research sourced
from Traiv's own `.ai`/feature docs and general fitness-industry sources only — no
competitor crawling yet. Proves the never-invent + claim-ledger discipline before
drafting exists to consume it.

## Phase 4 — Content generation
`seo_articles`, the 10-stage pipeline, `providers/llm.ts`'s drafting calls. Output
stops at `DRAFT`/`RESEARCHED` — no quality gate, no publish path yet. Reviewed
manually end-to-end by a founder reading raw draft output before Phase 5 builds the
automated gate around it.

## Phase 5 — Quality assurance
`seo_quality_checks`, all hard-blocking checks, the rubric scorer, `/seo/review`.
This is the phase that makes `READY_FOR_REVIEW` a real, enforced status rather than a
label.

## Phase 6 — Publishing
`seo_approvals`, `seo_publication_jobs`, `seo_article_revisions`, the call into the
existing `admin.ts` blog-write path. First end-to-end article goes genuinely live
here — the riskiest single phase, deliberately placed after five phases of
groundwork rather than earlier.

## Phase 7 — Workflow orchestration
`seo_workflow_runs`/`seo_workflow_steps`, `startSeoAutopilot()`'s daily tick,
`admin-dashboard.md`'s `/seo/workflow` monitoring, the kill switch. Turns the
phases above from "manually invoked scripts" into the actual autonomous daily cycle —
deliberately late, so the cycle it automates has already been proven manually.

## Phase 8 — Competitor intelligence
`seo_competitors` gap crawling, `seo_optimization_recommendations`. Deliberately
last in the MVP group because it's the lowest-confidence, lowest-urgency input per
`opportunity-scoring.md`'s own weighting (10%) and `competitor-intelligence.md`'s own
"compounds with performance data, not before it" note.

## Phase 9+ (fully-featured, post-MVP, requires a separate approval)
GSC integration (`gsc-integration.md`), performance feedback and calibration
(`performance-feedback.md`), licensed SERP/keyword-volume providers, image
generation, cross-system engagement enrichment from product-analytics. Each requires
its own credential and its own go/no-go, not a continuation of this approval.

## Explicitly excluded from this roadmap (per the master prompt's own "Future" bucket
and this plan's scope boundary)
Revenue/ad-ROI attribution, any autonomous-without-review publishing tier, any write
path into pSEO typed files or `sitemap.ts`/`robots.ts`.
