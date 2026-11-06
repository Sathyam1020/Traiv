# Phase 11 — analytics and conversion: audit + one fix

Reviewed and partially implemented 2026-11-06. Scope per the master prompt: audit the funnel, recommend tracking, implement only where the project already supports it or after approval — this is mostly an audit, with one small, safe, zero-storage fix actually shipped (see "Implemented" below).

## Funnel: organic search → landing → product interest → signup → activation → paid conversion

Marketing (`apps/web`) ends at the click on a trial link, which leaves the app for `https://app.traiv.fit/signup` — a separate app, separate deploy, separate auth. Everything past that boundary (signup, activation, payment) lives outside this repo's `apps/web` and was not instrumented or re-architected here; see "What's not implemented, and why" below for why.

### Landing page relevance, hero messaging, CTA clarity

Homepage hero states the product, the differentiator (your name/logo in the client app) and the price in one paragraph (`src/app/page.tsx:13`: "Build workout and diet plans, review check-ins and collect client fees in Traiv. Your name and logo in the app. From ₹999/month. Start your 14-day free trial."). That is the actual positioning, not generic SaaS copy — it names the three things a coach evaluating software for an hour would ask first (what it does, how it's branded, what it costs).

CTA coverage is real, not cosmetic: 7 distinct `TrialLink` placements, each with its own `location` label already wired into `track()` — nav, hero, pricing (per-plan), payments-section, closing, and the `/coaches` and `/gyms` landing pages. This already answers "which part of the page converts" without any new instrumentation; it was there before this phase.

### Pricing discoverability

`/pricing` is a top-level nav item (`nav.tsx`) and the homepage's own pricing section has its own `TrialLink` per plan, labelled with the plan name. Not buried.

### Signup friction

Out of scope to audit — the signup flow itself lives in the trainer app (`app.traiv.fit`), a different app in this monorepo, not touched by this phase's SEO/marketing-site work.

### Trust signals

None present: no testimonials, customer logos, or review counts anywhere on the homepage (confirmed by search — no match for "testimonial", "review", "trusted", "logo" as a customer-proof pattern). This is accurate for where the product actually is — `HANDOFF.md`'s "Important unresolved business/external items" already records no production backend is deployed yet. The correct move is not adding placeholder/fabricated testimonials (that would be fabricated content, which CLAUDE.md and this task both prohibit); it's a real gap to close once there are real coaches to quote, not a defect in this phase's scope.

### Product screenshots, demo availability, feature explanations

`/demo` exists as its own route (already in the sitemap and both audits). `ProductScene` provides a distinct, real (not stock-photo) preview per feature — Development tab, workout builder, diet builder, Inbox, Vault, Payments — each already carrying a descriptive `role="img"`/`aria-label` (the Payments one was the one missing it; fixed in Phase 8, this task). `/features/[slug]` gives each capability its own page with a 3-point explanation. Feature pages that don't yet meet the content bar (`vault`, `messaging`) correctly noindex rather than show a thin page to search engines, but remain visitable — consistent with Phase 6's review.

### Mobile conversion experience

Covered by Phase 7/8's evidence directly: `audit:responsive 360 1280` is 0 failures across all 21 routes (two CTA-relevant fixes already landed this session — the demo payment-preview text and the homepage's bottom nav labels were previously under 11.5px, now legible), and Lighthouse mobile accessibility is 100. Nothing specific to conversion UI was found broken at 360px beyond what Phase 8 already fixed.

### Analytics event coverage

Already covers pageview, scroll depth (25/50/75/100), time-on-page via exit, and CTA clicks with location+plan — see `lib/analytics.ts`/`components/analytics.tsx`. The real gap was not "missing events," it was **attribution not surviving the click to the signup app** — see "Implemented" below.

## Implemented: UTM passthrough on the signup click

**The gap:** `TrialLink`'s `href` only ever carried `?plan=...`. The marketing site's own `campaign()` helper already parses `utm_source`/`utm_medium`/`utm_campaign` off the current URL for its own `click`/`pageview` events, but that context died at the click — `app.traiv.fit/signup` received a visitor with zero indication of which campaign sent them. Every "Recommend tracking: ... Organic conversion rate" in the master prompt's ask is unmeasurable without this.

**The fix** (`apps/web/src/components/analytics.tsx`, `apps/web/src/lib/analytics.ts`): the same already-existing `onClick` handler that fires the `start_trial` click event now also reads the current page's `utm_*` params (via the newly-exported `campaign()`, reusing the exact logic the click/pageview events already use — no new parsing, no new concept) and appends them to the trial link's `href` immediately before the browser navigates. Verified live, both directions:
- A visit with `?utm_source=google&utm_medium=cpc&utm_campaign=brand` → the hero trial link's `href` becomes `https://app.traiv.fit/signup?utm_source=google&utm_medium=cpc&utm_campaign=brand` at the moment of click.
- A visit with no UTM params → the link is untouched, including when it already carries `?plan=trainer` — zero behavior change for the common case.

No storage, no cookie, no new identifier — it only forwards what the current page's own URL already carries, which respects `lib/analytics.ts`'s existing documented privacy stance ("nothing is stored on the device... that is why this file never asks for consent"). `tsc`/biome clean.

## What's not implemented, and why — needs product/privacy approval, not an engineering call

True signup → activation → paid-conversion attribution (knowing that a specific paying trainer account traces back to a specific SEO page or campaign) is not built, and building it is a bigger decision than this phase's scope:

- It requires either (a) the trainer app's signup endpoint reading and storing the `utm_*`/referrer query params this fix now forwards, against the new account, or (b) stitching the marketing site's existing one-day rotating-salt visitor id (`apps/api/.../visitor.ts`) across the origin boundary to a trainer account at signup — neither of which exists today, and (b) specifically extends a mechanism whose entire design point is "a visitor is not followed across weeks by a marketing site they have not even signed up to." Extending it to persist into an actual account record is a real privacy-posture decision, not a code change to make unilaterally.
- The master prompt itself gates this: "Implement privacy conscious analytics instrumentation only where the project already supports it **or after approval**." Storing attribution against a signed-up account is new territory, not an extension of what's already there — so it stays a recommendation, not a diff.

**Recommendation, for whoever has product/privacy authority to approve it:** have the trainer app's signup handler read `utm_source`/`utm_medium`/`utm_campaign` (now arriving on the URL thanks to this fix) and store them once, at account creation, on the new trainer's own record — not in any cross-site cookie or longer-lived client-side store. That's the minimum needed to ever compute organic/paid conversion rate, demo-to-signup rate, or signup-to-paid rate, and it keeps the "nothing persisted on the visitor's device" property intact, since the storage would be server-side and scoped to an account the person actually created.

AI-search-referral identification (`document.referrer` matching known AI crawler/referrer patterns) is a small addition on top of the same pageview event already captured — flagged here as a cheap follow-up, not implemented in this pass since it wasn't the reported gap and the HANDOFF review focus was attribution, not referrer classification.
