# Google Search Console integration

## Why this is required, not optional (master prompt §13)

GSC is the only source of real, measured search-performance data (impressions,
clicks, position, CTR) for Traiv's own site — without it, `opportunity-scoring.md`'s
"verified search demand" and "existing GSC opportunity" dimensions are permanently
`null`, and `performance-feedback.md` has nothing to calibrate against. The
repository audit confirmed **no GSC/Bing connection exists today** — this is new
infrastructure, not a reused integration.

## Auth and access

Google Search Console API via a service account with delegated domain-property
access (the standard GSC API auth path), credentials stored the same way every other
third-party credential in this repo is stored — `env.js`-validated environment
variables, never committed, never logged. **Missing credential = feature disabled,
not a crash** — every GSC-dependent module (`opportunity-scoring.md`,
`performance-feedback.md`) already has an explicit "unknown, not estimated" fallback
path for exactly this case, so GSC can be wired up after the rest of the system ships
without blocking anything.

## Sync job

A daily job (reusing the job-table pattern, kind `seo_gsc_sync`) pulls query- and
page-level performance for Traiv's property, scoped to a rolling window (default 90
days, matching GSC's own practical data-freshness window), and upserts into
`seo_gsc_observations`: `query | page | date | impressions | clicks | ctr | position`.
Idempotent by `(query, page, date)` — a re-run overwrites the same day's row rather
than duplicating it, same idempotency discipline as `workflow-design.md`'s other job
kinds.

## What is derived from GSC data (read-only derivations, never written back to GSC)

- **Emerging opportunities**: queries gaining impressions with no dedicated page —
  feeds `opportunity-scoring.md`'s "existing GSC opportunity" dimension.
- **Underperforming pages**: published pages with declining impressions/clicks or
  stuck position — feeds `performance-feedback.md`'s refresh-candidate detection.
  content needing updates.
- **Cannibalization evidence**: two Traiv URLs both receiving impressions for the same
  query — a stronger signal than the embedding-similarity check in
  `opportunity-scoring.md`, because it's measured, not inferred.
- **Keyword intelligence enrichment**: real impression/click counts attached to
  `seo_keyword_candidates` rows that originated from seed lists or competitor
  analysis, upgrading their evidence tier from "seed" to "measured" over time.

## What this integration never does

Never submits URLs for indexing via any API (no IndexNow, no manual submission
requests) — the prior SEO audit's `HANDOFF.md` explicitly notes this was a deliberate
decision, not an oversight, and this plan does not revisit it. Never modifies
`sitemap.ts`/`robots.ts`. Never writes anything to the GSC property itself — this
integration is read-only in both directions with Google.
