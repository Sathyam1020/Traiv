# Admin dashboard design

Lives under `apps/admin`, a new top-level nav entry (`apps/admin/src/components/layout/nav-items.ts`
gets one new item, "SEO Autopilot") alongside the existing four screens — not nested
under `analytics`, since this is a content-operations surface, not a metrics surface,
even though it will eventually display GSC metrics. Reuses the existing admin
shell, auth (`requireAdmin()`), and table/CSV components (`apps/admin/src/lib/csv.ts`)
rather than introducing new primitives.

## Screens (master prompt §15's list, mapped to concrete pages)

| Master-prompt dashboard area | Page | Primary table(s) |
|---|---|---|
| Content pipeline / opportunity queue | `/seo/opportunities` | `seo_content_opportunities` |
| Keyword research | `/seo/keywords` | `seo_keyword_candidates`, `seo_keyword_observations` |
| Competitor intelligence | `/seo/competitors` | `seo_competitors`, their gap records |
| Content calendar | `/seo/calendar` | `seo_articles` scheduled/approved rows |
| Performance dashboard | `/seo/performance` | `seo_gsc_observations`, `seo_articles` |
| Quality review queue | `/seo/review` | `seo_articles` in `READY_FOR_REVIEW`, `seo_quality_checks` |
| Workflow monitoring | `/seo/workflow` | `seo_workflow_runs`, `seo_workflow_steps` |
| Cost tracking | `/seo/costs` | `seo_provider_usage` |
| Strategy configuration | `/seo/settings` | `seo_strategy_versions`, competitor list, cadence settings |

## Opportunity queue (`/seo/opportunities`)

The fields listed verbatim in `opportunity-scoring.md`'s dashboard section, plus
inline approve/reject/override controls. Sortable by score and by evidence
completeness independently — a reviewer can deliberately sort by "most evidence" to
build trust in the system before trusting high-score-low-evidence rows.

## Review queue (`/seo/review`)

Shows the full draft, the claim ledger with each claim's source inline (not a
separate tab a reviewer has to remember to check), every hard-blocking check's
pass/fail individually, the 0–100 rubric score with each dimension labeled
deterministic/LLM-assessed (`quality-assurance.md`), and the three actions
(`approve`, `request revision` with a required comment, `reject` with a required
reason) — a bare approve/reject with no comment field is explicitly not offered,
since `performance-feedback.md`'s calibration data is only as good as the reasons
captured here.

## Workflow monitoring (`/seo/workflow`)

A simple timeline of `seo_workflow_runs` → their `seo_workflow_steps`, each step's
status, duration, and failure reason if any — the same transparency the existing
analytics platform's System Health screen already gives for rollup ticks, reused as
a pattern rather than invented fresh.

## Cost tracking (`/seo/costs`)

Running totals from `seo_provider_usage`, broken down by provider and by pipeline
stage (research/drafting/editorial/scoring), against the budget ceilings in
`cost-estimates.md` — a ceiling breach pauses new work (not retroactively, per
`security.md`'s kill-switch design) and shows as a banner here, not just a log line.

## Strategy configuration (`/seo/settings`)

Competitor roster CRUD, posts-per-week cadence, minimum review window, and a
read-only view of `seo_strategy_versions` history (editing weights creates a new
version; it never edits one in place) — mirroring the funnel-builder's existing
create-new-version-don't-mutate pattern from the product-analytics admin work.
