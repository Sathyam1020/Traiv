# Research, SERP analysis, and fact verification

## SERP analysis (master prompt §5)

Only runs when a licensed SERP provider is configured (`providers/serp-api.ts`); with
none configured, a content brief proceeds without it and is marked accordingly — it
does not block the pipeline, per `keyword-intelligence.md`'s same "unknown, not
blocked" posture.

When available, one `seo_serp_snapshots` row per `(query, country, language, device,
provider, timestamp)` — intentionally that granular, because the master prompt is
explicit that one country's results are not universal evidence. Stores: result URLs,
observed page types, visible SERP features, an LLM-assisted intent classification
(informational/commercial/transactional/navigational/mixed), and a confidence value.
**A SERP analysis is never claimed to have happened unless a real provider response
was stored** — there is no code path that synthesizes a plausible-looking SERP from
training data; the brief-generation step either has a real `seo_serp_snapshots` row
to cite or explicitly states it has none.

## Research and source collection (master prompt §8)

`seo_research_sources`: one row per source consulted for a brief, each with URL,
title, publisher, access timestamp, publication date (if available), the specific
extracted claim(s) relevant to this brief, a reliability tier, and usage restrictions.
Sources come from: official product documentation (Traiv's own `.ai/` docs and feature
code — the single most reliable source this system has, since it's the ground truth
for "does Traiv actually do this"), government/established-publication sources for
general fitness-industry facts, and the competitor's own public pages for comparison
claims (with the same evidence bar `comparisonIsIndexable` already enforces: dated,
sourced, HTTPS).

## Claim ledger

Every material factual claim in a draft gets one `seo_claims` row:

```
claim_text | supporting_source_id | evidence_excerpt | status | confidence | last_verified_at
```

`status ∈ { VERIFIED, PARTIALLY_SUPPORTED, UNSUPPORTED, CONFLICTING,
NEEDS_HUMAN_REVIEW }`. **An `UNSUPPORTED` claim blocks publication** — enforced in
`quality-assurance.md`'s hard-blocking checks, not left as a quality-score deduction a
high-enough score could outweigh.

## What is never invented (master prompt's list, verbatim, enforced as a drafting-prompt
constraint *and* a post-draft claim-ledger check — defense in depth, not policy alone)

Statistics, research studies, testimonials, customer stories, product features,
competitor pricing, customer counts, awards, certifications, expert quotes, user
experiences. No code path lets a draft reach `READY_FOR_REVIEW` with a claim-ledger
entry of status `UNSUPPORTED` in any of these categories.

**Competitor pricing/features** specifically require a dated verification no older
than the same 180-day window `comparisonIsIndexable` already enforces for
`/compare/*` pages — reusing that exact threshold rather than inventing a second one.

**Health/fitness claims** get one additional gate: `quality-assurance.md`'s
`NEEDS_EXPERT_REVIEW` outcome is mandatory (not optional) whenever a claim touches
individualized exercise, nutrition, or medical advice — the draft cannot reach
`READY_FOR_REVIEW` through the normal path; it routes to a distinct review queue.
Traiv's own product explicitly avoids prescribing individualized medical advice
(per the nutrition feature's own documented scope in `.ai/decisions/0025-nutrition-recipes-not-ai-plans.md`
and related ADRs) — content about the product must not accidentally cross a line the
product itself doesn't.

## Originality requirement (master prompt §9)

Every `seo_articles` row carries a non-empty `originality_statement` — one of: a
verified Traiv product demonstration, a screenshot, an original workflow example, an
expert-reviewed explanation, an original comparison, real (permission-cleared) product
data, or genuinely original analysis. **If the research stage cannot produce one, the
opportunity is returned to `MONITOR` or `SKIP`, never drafted anyway** — the master
prompt's own instruction: "do not manufacture originality through paraphrasing."
