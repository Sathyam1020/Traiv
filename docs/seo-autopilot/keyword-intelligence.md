# Keyword intelligence

## Categories (master prompt §3.1)

Every discovered keyword is tagged with exactly one of four categories — offer-based,
industry-based, competitor-based, jobs-to-be-done — stored on
`seo_keyword_candidates.category`. These are organizing labels for the admin
Opportunities view, not a scoring input by themselves.

## Sources, each an optional adapter

| Source | Status | Adapter needed |
|---|---|---|
| Google Search Console | Required, already scoped in `docs/seo/discoverability-strategy.md` | `gsc-integration.md` |
| Licensed keyword API (e.g. a volume/difficulty provider) | Optional, no provider chosen yet | `providers/keyword-api.ts` behind an interface; a `console`/no-op implementation ships first |
| Licensed SERP API | Optional | `providers/serp-api.ts`, see `research-and-verification.md` §SERP analysis |
| Competitor websites | Built from `competitor-intelligence.md`'s crawl, not a separate source | — |
| Existing Traiv content | `apps/web/src/content/{features,competitors,tools}.ts` + the `post` table, read-only | Direct DB/file read, no adapter |
| Google autocomplete / People Also Ask / related searches | Only via a compliant, licensed provider — never scraped directly | Same `serp-api.ts` adapter, if the chosen provider exposes it |
| Manual import | Admin UI, CSV or form entry | No adapter — a database write |
| Historical performance | `seo_keyword_observations`, Traiv's own prior GSC data | Direct DB read |

**No adapter is required for the system to function.** With zero external providers
configured, keyword discovery runs on GSC data (once connected) plus manual imports —
a real, useful, honest starting state, per the master prompt's own instruction that a
missing provider means "unknown," not "blocked."

## What is never fabricated (master prompt §3, restated as enforcement, not policy)

`seo_keyword_candidates` and `seo_keyword_observations` have no column for search
volume, difficulty, or CPC that isn't paired with a `source`, `observed_at`,
`geography`, and `measurement_definition` on the same row (`database-design.md`). The
scoring function (`opportunity-scoring.md`) reads these as nullable; a candidate with
no volume data scores its "verified search demand" dimension as `null` (tracked as
missing evidence, contributing to the completeness score, not silently treated as
zero) rather than inventing a plausible-looking number.

## Normalization

Deterministic, no LLM: lowercase, whitespace-collapse, strip filler words for
dedup-matching only (the *display* string keeps what was actually typed/discovered).
Two candidates whose normalized form matches are the same row (`ON CONFLICT`), with
every source that surfaced it recorded rather than the second discovery being dropped
or silently overwriting the first.

## Seed lists are starting points, not verified opportunities

The master prompt's own four example lists (§3.1 A–D) seed `seo_keyword_candidates`
at `status = 'seed'` with no scores — exactly as labeled in the prompt, "keyword seeds,
not verified opportunities." They enter the same scoring pipeline as anything else
discovered later; nothing about being founder-supplied exempts a seed from the
opportunity-scoring gate in `opportunity-scoring.md`.
