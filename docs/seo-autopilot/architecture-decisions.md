# Architecture decisions

## The three options (master prompt §27)

### A. Existing backend + Postgres + existing job infrastructure

Everything lives in `apps/api`, one new feature directory, new tables in the existing
`packages/db` schema, the daily cycle as an in-process timer (`architecture.md`),
individual slow/external-call steps as `job` rows once `startWorker()` is wired in.

- **Complexity**: low — no new deployable, no new protocol, no new operational
  surface. Every engineer who can work on `apps/api` today can work on this.
- **Cost**: the only new recurring cost is external provider usage (LLM tokens, any
  licensed keyword/SERP API) — no new hosting, no new database, no new queue service.
- **Reliability**: inherits the existing process's reliability. A crash restarts
  everything together; the checkpoint-based daily cycle (same pattern as
  `analytics_checkpoint`) and the job table's lease-reclaim already handle the two
  failure modes that matter (missed a cycle, crashed mid-job).
- **Deployment risk**: a new feature directory in an app that already deploys daily.
  No new release pipeline to build.
- **Maintainability**: one codebase, one set of conventions, one test runner.
- **Security**: inherits `requireAdmin()` and the existing session/auth model — no new
  trust boundary to design from scratch.
- **Performance**: a daily content pipeline and an hourly GSC sync are negligible load
  next to the API's existing request traffic; nothing here is latency-sensitive to a
  live user request.
- **Operational burden**: zero new on-call surface. The existing API's uptime is the
  SEO system's uptime.

### B. Existing backend + a dedicated SEO worker process

Same code, but the orchestrator and job consumers run as a second deployable
(e.g. a second `tsx src/seo-worker.ts` entrypoint sharing `apps/api`'s codebase and
database).

- **Complexity**: medium — one more process to build, deploy, and monitor
  independently; shared code between two entrypoints needs discipline to keep in sync.
- **Cost**: one more always-on compute unit, continuously, for a workload that
  currently amounts to "once a day, plus an hourly GSC check."
- **Reliability**: marginally better isolation (a runaway LLM call can't starve the
  main API's event loop) — but nothing in the audit shows the main process has ever
  been starved by `startCheckInReminders()` or `startAnalyticsRollup()`, which run the
  same kind of background work today without incident.
- **Deployment risk**: higher — two things to deploy in the right order, two things
  that can disagree about schema version during a rollout.
- **Operational burden**: a second thing to page on.

### C. Separate SEO service, independent deployment

A standalone service (own repo or own package), own database or own schema, talking to
`apps/api` or directly to Postgres over a defined interface.

- **Complexity**: high — new auth between services, new deployment target, new
  monitoring, a second place migrations can drift from.
- **Cost**: meaningfully higher — a new always-on service, likely its own database
  connection pool, its own CI/CD.
- **Reliability**: better fault isolation in theory; in practice, for a single-admin,
  single-EC2-class deployment (per `.ai/engineering/architecture.md`), it's one more
  thing that can be down while nothing else is, which is a reliability *cost* for an
  operator with no dedicated platform team, not a benefit.
- **Deployment risk / maintainability / operational burden**: all worse, for a system
  whose entire workload (per the master prompt's own operating philosophy — quality
  over volume, "a valid daily outcome is NO_ACTION") is intentionally small.

## Recommendation: Option A

Nothing in the repository audit shows Traiv operating at a scale where B or C's
isolation benefits outweigh their cost. The explicit non-goals in the master prompt
itself — no Kafka, no Kubernetes, no ClickHouse, no multi-agent framework "without a
concrete demonstrated need" — describe exactly the gap between B/C and what this
workload actually requires. Revisit B only if the daily cycle's provider calls start
measurably degrading the main API's request latency (a thing to observe, via the
existing `operational_event` p50/p95, not to pre-optimize for).

## AI model architecture: logical roles, not separate running agents

The master prompt's §18 lists nine "roles" (Keyword Analyst, SERP Analyst, Competitor
Researcher, Content Strategist, Research Synthesizer, Article Writer, Fact
Verification Reviewer, SEO Editor, Editorial Quality Reviewer, Performance Analyst).
These are **prompts/functions, not separate deployed agents** — `providers/llm.ts`
exposes one typed `complete<T>(role, input): Promise<T>` call per role, each with its
own system prompt and Zod output schema, all going through the same provider adapter.
This mirrors the one existing LLM integration in the codebase
(`apps/api/src/integrations/food-label.ts`): a typed, schema-validated, single-purpose
call, not a framework. No LangChain, no agent-orchestration library — confirmed absent
from `package.json` across every app, and not warranted by this workload.

Deterministic code, never an LLM call, handles: URL/slug validation, metadata presence
checks, schema validation, link checking, job scheduling, authorization, cost
calculation, every database write, every publication state transition. See
`quality-assurance.md` for exactly which checks are deterministic vs. LLM-assessed.

## Final architecture review (master prompt §29)

**Which components are overengineered for day one?** Competitor change-monitoring
(§4's "monitor material content changes") and the full feedback-loop weight-recalibration
(§16) both require weeks of accumulated outcome data before they can do anything
useful. Both are designed in `competitor-intelligence.md` / `performance-feedback.md`
but scheduled last in `implementation-roadmap.md` — building them before there's data
to feed them would be building a report nobody can read yet.

**Which tasks should not use AI?** Every deterministic check listed above, plus: slug
generation, cannibalization detection's *mechanical* half (query/keyword overlap,
canonical structure — semantic similarity is the only part that's a model call, and
even that is one embedding comparison, not a chat completion), cost tracking, and
every publication state transition. See `opportunity-scoring.md` and
`quality-assurance.md`.

**Which providers are genuinely necessary?** One LLM provider (drafting/research
synthesis/editorial review). GSC's own API (official, free, required — this is the
single most important data source and the one already partially scoped in
`docs/seo/discoverability-strategy.md`). Everything else — licensed keyword APIs,
licensed SERP APIs — is explicitly optional per the master prompt itself ("where
provider access is available") and is designed in `keyword-intelligence.md` /
`research-and-verification.md` as adapters behind an interface with no-provider =
"unknown, not fabricated" as the default state, not a blocker.

**Which features can be postponed?** Everything in `implementation-roadmap.md` Phase
11 (autonomous scheduling under budget) and Phase 10 (performance intelligence beyond
raw GSC display) — both need Phases 1–9 generating real outcomes first.

**What happens if an API becomes unavailable?** Per-provider: GSC sync skips a cycle
and logs via `operational_event` (reusing the pattern, not the table, per
`architecture.md`); the daily cycle's provider-dependent steps (keyword/SERP
enrichment) degrade to "insufficient evidence, lower confidence score" rather than
failing the whole cycle — per the master prompt's own instruction that unknown values
must remain unknown, not block.

**What happens if the system produces incorrect content?** It never reaches a reader
without a human clicking "approve" — see `quality-assurance.md`'s hard-blocking checks
and `publishing-design.md`'s approval-binds-to-revision design. If something incorrect
is approved anyway, `publishing-design.md`'s rollback/unpublish path and version
history apply, same as a human-written post getting something wrong.

**How is publication prevented without approval?** `seo_articles.status` transitions
to `published` only through one function, which requires a non-null
`approved_revision_id` matching the revision being published — enforced in code, not
just in the admin UI. See `publishing-design.md`.

**How are existing SEO pages protected?** By never writing to them — see
`architecture.md`'s "what this explicitly does not touch." The autopilot's write
surface is the `post` table and its own new tables; it has no code path that opens
`content/features.ts` or `content/competitors.ts` for writing.

**How are costs controlled?** Server-side budget enforcement before every expensive
call, not advisory — see `cost-estimates.md`.

**How does the system avoid thin content?** The same way `featureIsIndexable` and
`comparisonIsIndexable` already do it for the existing pSEO pages: a documented,
checkable originality requirement (master prompt §9) enforced as a hard QA gate, not a
style suggestion — see `quality-assurance.md`.

**How does it distinguish actual rankings from estimates?** Every numeric claim
carries a source, timestamp, and measurement definition, enforced at the data-model
level (`database-design.md`'s `seo_keyword_observations`/`seo_serp_snapshots` schemas
have no nullable-but-implied-real column) — an unset value renders as "unknown" in the
dashboard, never as zero or omitted silently.

**How will it behave with insufficient GSC data?** Treated as a distinct, displayed
state ("not enough data yet"), never interpreted as "zero searches" — explicit
master-prompt instruction, enforced in `gsc-integration.md` and `performance-feedback.md`.

**What must be manually configured?** A GSC property + API credentials (founder
action, blocks Phase 2 entirely); an LLM provider API key; optionally a keyword/SERP
API key; the daily/monthly budget ceilings; the initial competitor list. See
`risks-and-open-questions.md`.

**What are the biggest production risks?** (1) `startWorker()` not actually running
today — silent no-op if this plan assumed otherwise; (2) single-admin auth means one
phone number gates every approval — a real single-point-of-failure the master prompt
doesn't ask this plan to fix, but which `security.md` flags explicitly; (3) budget
enforcement must be airtight before any autonomous LLM calls go live, since a runaway
loop against a metered API is a real-money failure mode, not just a bug.

## Minimum viable vs. fully-featured target

**MVP** (Phases 1–8 in `implementation-roadmap.md`): durable workflow state, GSC
ingestion, manual keyword-opportunity entry (provider adapters optional), deterministic
opportunity scoring, research + claim ledger, single-LLM-pass drafting, deterministic
QA gates, human approval, manual publish to the existing `post` table. This alone
delivers the master prompt's core ask: an evidence-grounded, human-approved content
pipeline replacing ad hoc blog writing.

**Fully-featured target** (Phases 9–12): licensed keyword/SERP provider integration,
competitor change-monitoring, scheduled publishing, performance-decay detection, and
the calibration half of the feedback loop — each genuinely needs the MVP running first
to have real outcomes to learn from.
