# Phase 6 — pSEO publication quality: reviewed

Reviewed 2026-11-06. This is a review of the existing implementation, not new work — no code changed in this phase.

## What was checked

- Read `pseo-architecture.md` against the actual implementation: `content/features.ts`, `content/competitors.ts`, `content/tools.ts`, `app/features/[slug]/page.tsx`, `app/compare/[slug]/page.tsx`, `app/sitemap.ts`.
- Ran `featureIsIndexable`/`comparisonIsIndexable` against every current record (`pnpm --filter @traiv/api exec tsx`, read-only).
- Ran `pnpm --filter @traiv/web audit:seo` against the already-running local production build (build `.next/BUILD_ID` newer than both content files, so this reflects current source, not a stale server).
- Live `curl` against `/features/<unknown-slug>` and `/compare/<unknown-slug>`.

## Findings

- Gates behave exactly as `pseo-architecture.md` and `HANDOFF.md` claim. Feature predicate: `today`, `plan-builder`, `nutrition`, `check-ins`, `client-app` indexable; `messaging` fails on `points.length < 2`; `vault` fails on `copy.length < 200` (165 chars); `payments` fails because it is not in the repository-verified list. Comparison predicate: all 5 competitors fail, because every comparison's `claims` array includes the shared `OURS` claims, which carry `POSITIONING` (`verified: false`) — see "Open item" below.
- `generateMetadata` in both `[slug]` routes sets `robots.index` from the same predicate the sitemap filters on — one source of truth, no drift between what's crawlable and what's listed.
- Live crawl (`audit:seo`, 35 routes, 0 failures) confirms the sitemap⟺noindex invariant holds for every route, including the specifically-queued noindex pages (`/compare/trainerize`, `/features/payments`, `/features/messaging`) and the ones only discoverable by following links (`/features/vault`, `/compare/fitbudd`, `/compare/everfit`, `/compare/truecoach`, `/compare/coachway`) — all return 200 with `noindex`, not blocked, matching "routes remain available for visitors while failing pages receive noindex."
- Unknown slugs 404 on both dynamic routes, confirmed live: `/features/nope-this-slug-does-not-exist` and `/compare/nope-this-slug-does-not-exist` both return 404.
- No duplicate pages. `audit:seo` asserts unique sitemap URLs, unique `<title>`, and unique `<meta description>` across all 35 crawled routes — passed. `TOOLS` (calculators, templates) are four hand-authored static pages, not a dynamic/mass route; the only `[slug]`/`[doc]` segments in the app are `features`, `compare`, `blog` and `legal` — no city/occupation-style generator exists anywhere in the tree.
- Existing indexable examples (`today`, `plan-builder`, `nutrition`, `check-ins`, `client-app`) are genuinely distinct workflows with their own copy, not templated variants of one page.

## Open item — resolved 2026-11-06

Was: every comparison page included the shared `OURS` claims (monthly price, migration, plan exports), all three sourced to `.ai/product/positioning.md` with `verified: false`, which blocked all 5 comparison pages regardless of how good any single competitor's own figures were.

Now that traiv.fit is deployed, the three `OURS` claims were re-sourced to `https://www.traiv.fit/pricing` (read live, confirmed the page states ₹999/month, the no-automatic-import migration language, and the PDF plan-export capability verbatim) and every competitor-specific claim across all 5 comparisons was independently re-read from each vendor's own live pricing page. Two real factual corrections came out of that pass, not just source URLs — see `content/competitors.ts`'s own header comment for the detail: Trainerize's nutrition add-on is $20–45/month tiered, not a flat $45, and TrueCoach's pricing page does not publish the "5% of revenue" figure the old claim asserted anywhere — that claim was replaced with TrueCoach's actual verified tiered-pricing structure rather than left unverified or guessed at. Coachway's figures were re-confirmed unchanged; the page's EUR→INR conversion constant was also found stale (92, vs. a live 104.95) and corrected to 105.

All 5 comparison pages now pass `comparisonIsIndexable` and are live in the sitemap — verified via `pnpm --filter @traiv/web audit:seo` (35/35, including all 5 `/compare/*` routes with unique titles/descriptions) and a Lighthouse accessibility spot-check (100 on 3 of the 5, mobile and desktop).

## Owner/external follow-up

Human editorial review of originality and qualitative wording (the `fair`/`why`/`stay` prose) still applies on top of the machine gate — the gate is a minimum, not approval, per `pseo-architecture.md`. Re-review monthly per that doc's step 7; `checked` dates will start aging out after 180 days from 2026-11-06.

Next phase: 7, performance — before/after evidence already partially collected per `HANDOFF.md`; final repeat measurements and the Markdown reports are still missing.
