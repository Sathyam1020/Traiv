# 0036 — Free tools: functional parity with Coachway's library
2026-11-15 · Status: accepted · Plan: `features/free-tools/plan.md`

## Context
Coachway publishes 109 free calculators, readers and generators for coaches, each on its
own page with long-form copy, schema and a trial CTA. The founder decided to match that
library tool for tool, as an acquisition channel.

`product/principles.md` §8 says "nothing gets built because a competitor has it." That
principle governs the **product**: it exists so we don't spend build time on features
that don't retain clients. These are **marketing pages** that bring coaches to the site,
not product surface area.

## Decision
1. **§8 does not apply to marketing tools.** We build all 109 tools plus the existing
   templates page (110 pages).
2. **Functional parity, original expression.** Slugs, inputs, ranges, defaults, toggles,
   options, sample rows, result layout, page section order, FAQ counts and SEO mechanics
   match the research in `features/free-tools/research/`. Every sentence a reader sees,
   along with the message templates readers and generators output, is written by us. So is
   our implementation, from the primary published formulas. Coachway's text, code and visual
   assets are not copied.
3. **Defaults are Coachway's**: imperial-first where they are, with EUR as the currency
   default. Every money tool gets a currency switch (EUR, USD, GBP, INR) that changes
   formatting only, with no exchange-rate conversion.
4. **Demo booking goes to Cal.com.** The URL is `SITE.demoUrl`, and the button hides itself if
   it is empty. `/demo` redirects there.
5. **Attribution.** Tool trial links carry `utm_source=traiv-tools`, `utm_medium=tool`,
   `utm_campaign=<slug>` and `utm_content=<slug>-<placement>`. `components/analytics.tsx`
   replaces source, medium and campaign with the visit's own campaign when there is one, so
   `utm_content` is the field that always survives. Tool events reuse the existing
   `click`/`submit` event names with a `props.event` discriminator, so neither the
   collector nor the table changes.
6. **Results are not carried into the app after signup.** That needs a product decision
   about where a result lands for a coach with no clients. Revisit with tool-level signup data.
7. **The author byline is wired but off.** `TOOL_AUTHOR` in `content/site.ts` is `null`. Once
   it is set, every tool page renders the byline and adds `author` to the Article schema.

## Consequences
- ~300,000 words of original copy across 110 pages, reviewed per phase.
- Tools stay open to everyone: no email capture, no gating.
- The three old tool URLs redirect only once their replacements ship, so nothing points at a
  404 in between.

## What would change this
If the tools draw traffic that doesn't convert after six months of Search Console and
signup data, fold the weakest pages into stronger ones instead of keeping 110 thin pages.


## Phase 2 founder clarification — 15 November 2026

The founder explicitly selected Wilks 2020 (Wilks-2) instead of original Wilks,
and sourced strength standards instead of invented thresholds. Wilks coefficients
come from the IPF March 2020 formula evaluation, Appendix 1. Strength standards
use Strength Level's published aggregate bodyweight ratios, checked 15 November
2026, for squat, bench press, deadlift and shoulder press. These describe that
lifting community, not general-population percentiles or age-adjusted standards.

Reference pages for length and structure comparison are re-downloaded on demand and kept outside
the repository; they are never application content.
Phase 2 passed its gates on 16 November 2026: 19 tools live, each at or above the researched
length with matching FAQ counts and section flags.
Phase 3 passed its gates on 16 November 2026: 11 body composition tools, 60 live in total. The skeletal muscle
calculator uses Lee et al. (2000) with the ethnicity term set to zero, and the page says so.
Phase 4 passed its gates on 16 November 2026: 11 heart rate and cardio tools, 71 live in total. VO2 max ratings use
the widely reproduced Cooper Institute–based general-population norm table, and Cooper test ratings use Cooper's
published 12-minute distance norms.
Phase 5 (business, 38 tools) passed its gates on 16 November 2026; all 109 tools are live. The tool stack
calculator compares with Traiv by default, as the reference compares with itself. Its default tool prices are
vendor USD list prices converted once to rupees at 93.97 INR per USD (x-rates.com, 16 November 2026), shown as
an editable starting point. This is the only conversion anywhere: the currency switch still changes formatting
only and never converts what a coach types.
