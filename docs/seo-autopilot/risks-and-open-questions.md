# Risks and open questions

## Major risks

1. **Content quality regression risk.** AI-generated content that reads as generic
   or inaccurate damages trust in the Traiv brand faster than no content at all.
   Mitigation: the hard-blocking gate in `quality-assurance.md` plus mandatory human
   approval (`publishing-design.md`) for the entire MVP — autonomy is earned, not
   assumed, per the master prompt's own phasing instruction.
2. **Unsupported/fabricated claims reaching publication.** The single highest-harm
   failure mode (`research-and-verification.md`'s never-invent list), especially for
   health/fitness content. Mitigation: defense in depth (prompt constraint + post-draft
   claim-ledger check + mandatory `NEEDS_EXPERT_REVIEW` for health claims) — but this
   is a mitigation, not a guarantee; a founder/editor remains the backstop for the
   entire MVP.
3. **Cost overrun from retry loops or a misbehaving prompt.** Mitigated by per-call
   timeouts, the monthly budget ceiling (`cost-estimates.md`), and bounded job retries
   (`workflow-design.md`) — but the ceiling is checked per-tick, not per-call, so a
   single expensive run between checks could still exceed intent; worth tightening if
   real usage shows this matters.
4. **Scoring weights are unvalidated hypotheses** (`opportunity-scoring.md`,
   explicitly carried from the master prompt itself). Early opportunity rankings may
   simply be wrong until 60–90 days of real outcome data exists to calibrate against.
5. **Low initial evidence completeness.** Without GSC (Phase 9+) and without a
   licensed SERP/keyword provider, most scoring dimensions start as LLM estimates or
   `null` — early opportunity scores carry a `low` confidence band by design, and the
   admin UI must make this legible or the system will look less reliable than it
   honestly is.
6. **Competitor-crawl fragility.** Public competitor sites change markup/structure
   without notice; the crawler adapter degrading to "could not observe" rather than a
   hard failure is the mitigation, but this means competitor-intelligence data can go
   stale silently if no one is watching `/seo/competitors`' last-observed timestamps.
7. **Job-queue activation risk.** This plan depends on `startWorker()` actually being
   wired into the API boot sequence (Phase 1) — it is currently dead code. Any other
   team effort that starts using the job queue concurrently should coordinate on this
   same activation step to avoid two independent "first to turn this on" attempts.

## Open questions requiring founder decision (master prompt §29/§30's own list, answered as questions, not assumptions)

1. **Which LLM provider(s)** to standardize on for `providers/llm.ts` — this plan
   assumes "a provider," matching `food-label.ts`'s existing single-provider pattern,
   but does not pick one; whichever is chosen should be the same one already used
   elsewhere in the codebase unless there's a specific reason not to.
2. **Posts-per-week target** — this plan defaults to 2–3/week as a conservative
   starting cadence; the founder may want slower (fully manual review bandwidth) or
   explicitly accept a faster pace later.
3. **Whether to license a SERP/keyword-volume provider at all**, and if so which one
   — the MVP deliberately ships without one; this is a real recurring cost decision,
   not a technical one.
4. **Who performs `NEEDS_EXPERT_REVIEW` approvals for health/fitness claims** — this
   plan assumes the existing single-admin reviewer for the MVP, but the master
   prompt's own framing implies this might eventually need a qualified-professional
   reviewer distinct from "the admin," which is a product/staffing decision, not an
   engineering one.
5. **Whether blog-post engagement/conversion enrichment from product-analytics is
   wanted at all** — `performance-feedback.md` treats this as optional and
   best-effort; building it properly would mean instrumenting marketing-site page
   views into `analytics_event`, which isn't scoped here.
6. **Monthly budget ceiling value** — `cost-estimates.md` gives a rough range, not a
   number; the founder should set the actual ceiling based on real risk tolerance.

## What this plan deliberately does not resolve

The calibration process in `performance-feedback.md`/`opportunity-scoring.md` is
described as a future human-driven process, not a built mechanism — building an
automatic weight-adjustment system before any real outcome data exists would be
building on a guess. Similarly, no autonomous-publish tier is designed at all in this
plan; if the founder wants one after a track record is established, that is a
distinct, later proposal with its own risk review — not a toggle this architecture
ships with today.
