# Cost estimates and budget controls

## Cost tracking mechanism

`seo_provider_usage`: one row per external call (LLM completion, SERP lookup, GSC
API call), recording provider, model/endpoint, token counts (input/output) or
request units, computed cost, pipeline stage, and the `seo_workflow_runs` row it
belongs to — every cost figure below is an estimate to size the budget control, not a
number this system trusts blindly; actual cost is always read from this table, not
recomputed from the estimate.

## Per-article cost drivers (MVP scope, conservative default cadence of 2–3 posts/week)

- **Research + brief**: 1–2 LLM calls (research synthesis, brief assembly) using the
  cheaper model tier (`content-generation.md`'s tiering).
- **Drafting**: multiple calls (outline + per-section draft), the strongest model
  tier — the dominant cost driver per article.
- **Editorial refinement + fact verification + originality + quality scoring**: 3–4
  calls, mixed tiers (fact verification and originality can run on the cheaper tier;
  editorial refinement and quality scoring benefit from the stronger tier).
- **SERP/competitor data**: only if a licensed provider is configured — zero cost if
  not, by design (`keyword-intelligence.md`/`research-and-verification.md`'s
  "unknown, not blocked" posture extends to cost, not just data availability).

At current (2026) list pricing for the model tiers already in use elsewhere in this
codebase pattern (`food-label.ts`'s provider), a reasonable per-article range is
**low-single-digit dollars to roughly ten dollars** depending on draft length and how
many revision cycles a draft needs before passing quality gates — this is a rough
planning number pending real `seo_provider_usage` data, not a quote; the roadmap's
Phase 1 (`implementation-roadmap.md`) exists specifically to replace this estimate
with measured numbers before scaling cadence.

## Monthly estimate at MVP cadence

At 2–3 posts/week (~10/month) with the per-article range above: roughly **$30–150/month**
in LLM spend, plus any licensed SERP/keyword-data provider's own subscription fee
(skipped entirely in the MVP per `architecture-decisions.md`'s "start with free/owned
data sources" decision) and GSC API usage (free, quota-limited, no cost). This is
materially smaller than one month of a single competitor-analysis/SEO-tool
subscription, consistent with the master prompt's own "cheaper than the best human +
cheaper than the best tool" framing — but it is a target to validate, not a promise.

## Budget controls

A configurable monthly ceiling (admin setting, `/seo/settings`) checked before each
workflow tick starts new drafting work — a ceiling breach pauses new drafts (existing
in-flight work finishes) and surfaces as a banner on `/seo/costs`
(`admin-dashboard.md`), the same non-destructive pause semantics as the kill switch
in `security.md`. Per-call timeouts (`AbortSignal.timeout`, matching `food-label.ts`)
bound worst-case cost from a single runaway call regardless of the monthly ceiling.

## What is explicitly not estimated here

SERP/keyword-data provider subscription cost (deferred — no provider selected in the
MVP), image-generation cost (optional, off by default), and any future paid
competitor-intelligence API (`architecture-decisions.md`'s Option C territory,
explicitly out of this plan's scope).
