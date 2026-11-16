# Database design

All new tables live in a new Drizzle schema file, `packages/db/src/schema/seo-autopilot.ts`,
following the exact file-per-domain convention already used by `product-analytics.ts`
and `marketing.ts` — a new file, not additions to either existing schema file, keeping
this system's tables importable/removable as one unit. Every table is additive; no
existing table (`post`, `analytics_event`, `product_events`, `job`) is altered.

## Tables (grouped by the document that specifies their contents in detail)

| Table | Specified in | Purpose |
|---|---|---|
| `seo_competitors` | `competitor-intelligence.md` | Admin-managed competitor roster |
| `seo_keyword_candidates` | `keyword-intelligence.md` | Normalized keyword universe, any source |
| `seo_keyword_observations` | `keyword-intelligence.md` | Per-source raw signal history for a candidate |
| `seo_serp_snapshots` | `research-and-verification.md` | One row per `(query,country,language,device,provider,timestamp)` |
| `seo_content_opportunities` | `opportunity-scoring.md` | Scored candidate with component scores, action recommendation, cluster links |
| `seo_content_briefs` | `content-generation.md` | Brief fields for a selected opportunity |
| `seo_research_sources` | `research-and-verification.md` | Source catalog per brief |
| `seo_claims` | `research-and-verification.md` | Claim ledger, one row per material factual claim |
| `seo_articles` | `content-generation.md` / `publishing-design.md` | Draft/published article metadata + state machine status |
| `seo_article_revisions` | `publishing-design.md` | Full prior content snapshot before any `UPDATE_EXISTING` write |
| `seo_quality_checks` | `quality-assurance.md` | Hard-blocking check results + rubric score per article version |
| `seo_approvals` | `publishing-design.md` | Human approval record tied to a specific `seo_quality_checks` snapshot |
| `seo_publication_jobs` | `publishing-design.md` | Job-table-pattern tracking of the publish step itself |
| `seo_workflow_runs` | `workflow-design.md` | One row per daily-cycle execution |
| `seo_workflow_steps` | `workflow-design.md` | Per-step state within a run, optimistic-concurrency `status` column |
| `seo_gsc_observations` | `gsc-integration.md` | Daily query/page performance, upserted idempotently |
| `seo_optimization_recommendations` | `quality-assurance.md` / `performance-feedback.md` | Internal-link and refresh suggestions awaiting human action |
| `seo_strategy_versions` | `opportunity-scoring.md` | Versioned scoring weights, never overwritten in place |
| `seo_provider_usage` | `cost-estimates.md` | Per-call token/cost/model record for every LLM and external-API call |
| `seo_audit_logs` | `security.md` | Append-only record of every autonomous write action |

## Cross-table relationships worth calling out explicitly

- `seo_content_opportunities.cluster_id` self-references within the same table to
  form the topic-cluster graph referenced throughout (`opportunity-scoring.md`'s
  cannibalization check, `quality-assurance.md`'s internal-linking check).
- `seo_claims.article_id` + `supporting_source_id` is the enforcement point for "no
  claim without a source" — a claim row with a null source is, by construction,
  `UNSUPPORTED`.
- `seo_articles.post_id` is nullable (a draft has no `post` row yet) and becomes
  non-null only at the publishing step, pointing at the **existing** `post` table —
  this is the one foreign key this schema takes into existing marketing-schema
  territory, and it is one-directional (SEO tables reference `post`; `post` has no
  column referencing back).
- `seo_workflow_steps.job_id` is nullable and populated only for steps that actually
  run through the job table (the slow/external ones) — most of the 21-step cycle runs
  synchronously within one tick and never touches `job` at all (`workflow-design.md`).

## Indexing

Every table gets an index on its natural lookup key (`seo_keyword_candidates.keyword`,
`seo_articles.status`, `seo_workflow_steps.(run_id, status)`, `seo_gsc_observations.(query,page,date)`
as the idempotency key itself). No index is speculative — each one is justified by a
named query in the document that owns the table, per this repo's existing migration
conventions (`packages/db/src/schema/` has no unused-index precedent to deviate from).

## Migration sequencing

One migration per table group (competitors+keywords, research+claims,
articles+revisions+quality+approvals, workflow, gsc+recommendations+strategy,
provider-usage+audit-logs) — six migrations, matching the phased roadmap's own
groupings in `implementation-roadmap.md`, so a phase's migration is reviewable as one
unit rather than one 19-table migration no one can meaningfully review.
