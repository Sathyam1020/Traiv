# Traiv SEO Autopilot — planning index

**Status: PLANNING ONLY. Nothing in this directory has been approved, and nothing
described here has been implemented.** No application code, migration, dependency,
production config, or scheduled job exists yet for any of this. This is the repository
audit and architecture design requested for an autonomous SEO content/intelligence
platform, written against the actual repository as it exists today.

## Read order

1. **`repository-audit.md`** — what already exists, file by file. Read this first;
   every other document assumes it.
2. **`architecture.md`** — the proposed system shape, reusing what the audit found.
3. **`architecture-decisions.md`** — the three options the master prompt asked to be
   evaluated, the recommendation, and the self-critical final review (prompt §29).
4. Domain documents, each independent but cross-referencing the above:
   `workflow-design.md`, `keyword-intelligence.md`, `competitor-intelligence.md`,
   `opportunity-scoring.md`, `research-and-verification.md`, `content-generation.md`,
   `quality-assurance.md`, `publishing-design.md`, `gsc-integration.md`,
   `performance-feedback.md`.
5. **`database-design.md`** — every proposed table, grounded in the schemas the audit
   found already in use.
6. **`admin-dashboard.md`** — the UI, inside the existing admin app.
7. **`security.md`**, **`cost-estimates.md`**, **`testing-strategy.md`** — cross-cutting.
8. **`implementation-roadmap.md`** — phases, dependency-ordered, each independently
   approvable.
9. **`risks-and-open-questions.md`** — what's genuinely undecided. Read this before
   assuming anything else here is settled.

## The one fact every document depends on

**The marketing blog is already a database table (`post`, in
`packages/db/src/schema/marketing.ts`), written from the admin app, read by the
marketing site over HTTP with 60-second ISR.** It is not MDX, not a separate CMS, and
not something this plan would introduce. The entire Content Generation and Publishing
design (`content-generation.md`, `publishing-design.md`) is "write a `post` row," not
"build a CMS." See `repository-audit.md` for the full finding.

## The one fact every document is careful not to contradict

**Traiv underwent a complete, 13-phase SEO/AEO/GEO/pSEO/performance/accessibility audit
on 2026-11-06** (`docs/seo/HANDOFF.md`, `docs/seo/final-audit.md`). That work is
uncommitted but complete and is the reason this plan does not re-propose metadata
builders, structured-data components, sitemap logic, or the pSEO gating predicates —
all of that exists and this plan reuses it without modification. See
`repository-audit.md` §"Prior SEO work" for what that audit left for a human
(Search Console setup, comparison-claim evidence re-sourcing is done, deployment
verification) — several of those manual follow-ups are exactly what this system's GSC
integration and content-decay detection are designed to eventually make continuous.

## Scope boundary, stated once

This system optimizes for organic search visibility (impressions, clicks, position,
CTR, indexed coverage, keyword visibility, topic coverage, content quality, freshness).
It does not build revenue attribution, MRR reporting, LTV, ad ROI, or payment analytics
— the master prompt is explicit about this, and nothing proposed here touches
`packages/db/src/schema/product-analytics.ts` or any of the in-house product-analytics
work built elsewhere in this repository's history. See `architecture.md`
§"Deliberately separate from product analytics."
