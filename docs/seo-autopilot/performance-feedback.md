# Performance monitoring and feedback loops

## Tracked per published article (master prompt §14)

Rankings (GSC position per tracked query), organic traffic (GSC clicks/impressions),
CTR, engagement signals (reusing the **existing, separate** product-analytics
pipeline's page-view capability if/when the marketing site emits `analytics_event`
rows for blog pages — not a new tracking mechanism, and explicitly not joined at the
row level into SEO tables; see the cross-system boundary below), conversion
attribution (same caveat — attribution of a signup to a specific blog post, if ever
wanted, is a product-analytics `acquisitionAttributions` question, not something this
system computes itself), content decay (GSC trend over time), featured-snippet
capture (observable only via SERP snapshots, so only available when a SERP provider
is configured), and competitive position shift (`competitor-intelligence.md`'s
periodic diffs).

## Cross-system boundary (restated from `architecture.md`)

This system reads from the product-analytics tables listed above **only as an
optional, best-effort enrichment** — a missing or stale `analytics_event` row for a
given post never blocks a performance report; it's displayed as "no engagement data"
rather than estimated. No SEO table is ever joined into a product-analytics query or
vice versa; any report needing both reads each system's API/tables separately and
combines in the application layer, not in SQL.

## Content-gap detection (ongoing, not a one-time audit)

Re-runs `opportunity-scoring.md`'s coverage check against current GSC data on a
schedule (weekly) to surface: queries with rising impressions and no page,
established pages losing position, and cluster gaps that have opened up since the
last scoring pass — appended to the Opportunity Queue, not a separate dashboard.

## Calibration (ties back to `opportunity-scoring.md`)

60–90 days after publication, each article's actual GSC outcome is compared against
its pre-publication opportunity score's component predictions. The comparison itself
(predicted vs. actual, per dimension) is stored as a `seo_strategy_versions`-linked
evidence row — **a human decides whether and how to adjust weights**; no code path
automatically rewrites scoring weights from this data. This is explicitly not
reinforcement learning and not automated prompt mutation (`risks-and-open-questions.md`
expands on why the master prompt's own framing here is treated as a hypothesis to
validate, not a mechanism to build).

## Content refresh triggers

A published article becomes an `UPDATE_EXISTING` candidate when GSC shows sustained
decay (position or clicks trending down over a rolling window) **or** when
`seo_claims` entries tied to it age past their freshness window (180 days for
competitor claims, matching `comparisonIsIndexable`). Both triggers feed the same
Opportunity Queue as net-new topics — there is one queue, not a separate "refresh
list," so prioritization is always apples-to-apples.
