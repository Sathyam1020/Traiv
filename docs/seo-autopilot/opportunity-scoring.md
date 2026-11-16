# Opportunity scoring

Entirely deterministic code — no LLM call computes a score. An LLM may *populate one
input* (e.g. SERP-analysis intent classification), but the weighting and arithmetic
that turns inputs into a score is a plain function, testable with fixed inputs and an
expected output, per `testing-strategy.md`.

## Dimensions and initial weights (master prompt §6, stated as hypotheses there too)

| Dimension | Weight | Source of the raw input |
|---|---|---|
| Traiv product relevance | 20% | Deterministic keyword-to-feature match against `apps/web/src/content/features.ts`'s verified capability list, plus an LLM relevance judgment when no direct match exists |
| Search intent fit | 20% | SERP analysis (`research-and-verification.md`) when available; otherwise an LLM-only estimate, flagged lower-confidence |
| Ranking feasibility | 15% | Domain-age/authority signal if a licensed provider supplies one; otherwise unknown, not estimated |
| Verified search demand | 10% | GSC impressions if the query already appears there; licensed keyword-volume data if configured; otherwise unknown |
| Competitor content gap | 10% | `competitor-intelligence.md`'s gap records for this topic |
| Existing GSC opportunity | 10% | Query already getting impressions without a dedicated page — the "emerging opportunity" signal from `performance-feedback.md` |
| Topic cluster contribution | 5% | Deterministic — does this fill a gap in an existing cluster per `seo_content_opportunities`'s cluster graph |
| Original information availability | 5% | Does Traiv have verified, citable product detail for this topic (deterministic check against `content/features.ts` + the claim-source catalog) |
| Content freshness need | 5% | Deterministic — age + decay signal from `performance-feedback.md` for an UPDATE_EXISTING candidate |

**These weights are the master prompt's own initial hypotheses, not validated.** They
ship as a named, versioned `seo_strategy_versions` row so a later recalibration
(`performance-feedback.md`) changes a *new* version, never silently rewrites history —
every past scored opportunity stays attributable to the weights that actually produced
its score.

## Required behavior per candidate (master prompt's exact list)

1. **Normalize available evidence** — each dimension's raw input converted to a 0–1
   scale with a documented formula (e.g. GSC impressions bucketed, not linearly
   scaled against an arbitrary ceiling).
2. **Track missing inputs explicitly** — a dimension with no data contributes `null`,
   not `0` and not the category average; see "evidence completeness" below.
3. **Compute interpretable component scores** — each dimension's contribution is
   stored individually (`seo_content_opportunities.component_scores` jsonb), so the
   admin UI can show *why* a score is what it is, the same transparency principle the
   studio health-score in the existing product-analytics work already established
   (`healthScoreExplanation`) — same pattern, new subject.
4. **Overall opportunity score** = weighted sum over dimensions with real data,
   **re-normalized to the weight actually covered** (if 30% of the weight has no
   data, the score is computed over the remaining 70% and scaled back up) — this is
   the one place a naive implementation would silently treat missing data as zero;
   this doesn't.
5. **Evidence completeness** = the fraction of total weight that had real data,
   stored and displayed alongside the score — a 90/100 opportunity score backed by
   30% evidence completeness is flagged very differently in the UI than the same
   score backed by 95%.
6. **Identify uncertainty** — any dimension whose input came from an LLM estimate
   rather than a licensed/measured source is marked, and lowers the overall
   confidence band shown (`low`/`medium`/`high`), independent of the numeric score.
7. **Identify conflicting evidence** — e.g. GSC shows rising impressions but a
   licensed provider's difficulty score is very high; both values are shown, not
   averaged into a number that hides the disagreement.
8. **Check existing Traiv coverage** — before scoring "create new" as viable at all,
   query `seo_articles` + the pSEO content files for existing pages whose primary
   keyword/intent overlaps (the cannibalization check below) — a `CREATE_NEW` action
   is never proposed when `UPDATE_EXISTING` already satisfies the same intent.
9. **Estimate cannibalization risk** — see below.
10. **Recommend an action** — `CREATE_NEW | UPDATE_EXISTING | CONSOLIDATE |
    EXPAND_CLUSTER | MONITOR | SKIP`, each the output of an explicit decision tree
    (not a model's free-text suggestion) that reads the coverage check and
    cannibalization result.

## Cannibalization analysis

Deterministic signals, each computed independently and shown independently (not
averaged into one hidden number):

- Primary + secondary keyword overlap with an existing `seo_articles` row's own
  keywords.
- Search-intent match (same enum value).
- Semantic similarity via embedding comparison — **one signal among several, never
  the sole basis for a merge/delete decision**, per the master prompt's explicit
  instruction. Flags for human review; never triggers an automatic consolidation.
- Existing GSC query overlap — do two Traiv URLs already both receive impressions for
  the same query (a stronger, *measured* signal than semantic similarity).
- Canonical structure and topic-cluster relationship (deterministic graph lookup).

## Opportunity dashboard fields (master prompt's list, verbatim)

Candidate topic, suggested keyword, search intent, opportunity score, evidence
confidence, existing coverage, recommended action, supporting sources, proposed
article type, estimated research effort, status. Manual override and rejection with a
recorded reason are first-class admin actions (`seo_content_opportunities.override_reason`),
not a UI-only convenience — overrides feed `performance-feedback.md`'s calibration
data the same way every other outcome does.

## Calibration process (master prompt's own open requirement)

Not built in the MVP — requires outcomes to calibrate against. Proposed process once
~20–30 published-and-measured articles exist: compare each dimension's pre-publication
estimate against the article's actual GSC performance 60–90 days later; a dimension
whose estimate consistently fails to predict outcome gets its weight reduced in the
*next* `seo_strategy_versions` row, with the comparison itself stored as evidence, not
just the new weight. See `performance-feedback.md` and `risks-and-open-questions.md`
for why this is explicitly not reinforcement learning or prompt auto-mutation.
