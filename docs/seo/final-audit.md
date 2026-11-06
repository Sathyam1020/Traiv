# Final audit — Traiv SEO, AEO, GEO, pSEO, performance and discoverability

Completed 2026-11-06. All 13 phases closed. This is the task's final report, written against the repository in its current state — every number here was re-verified in this pass, not carried forward from earlier phase notes without re-checking.

## Issues discovered

From `initial-audit.md` (Phase 1) plus two found later, during Phase 7 and Phase 11 respectively:

- Missing/incomplete metadata, canonicals and social tags across marketing routes; no shared builder.
- No structured data (Organization/WebSite/SoftwareApplication/FAQ/Breadcrumb/BlogPosting).
- Sitemap and feature/comparison indexing decided by no consistent rule — thin and unverifiable pages were indexable.
- Competitor comparison pages carried unsourced numeric claims (GST inclusion, free automatic migration, full account export) presented as fact.
- Blog `getPost` returned null on any failure, including a real outage — ISR would publish a 404 over a working cached page during an API blip.
- Seven preview media tags not using `next/image`.
- Color contrast, heading order, missing skip link, several touch targets under 44px, and — found specifically by Phase 7's repeat-run methodology, not the original audit — one `heading-order` failure that only appeared on desktop viewport and six small-text selectors inside the phone/payment demo mocks.
- No `role="img"` wrapper on the Payments demo preview, unlike every other static preview — found during the Phase 8 small-text fix, not the original audit.
- `utm_*` attribution dying at the click on the signup link, which crosses to a separate app (`app.traiv.fit`) — found during the Phase 11 funnel review, not in the original audit (the original audit was pre-implementation and had no click-boundary to inspect yet).

## Issues fixed

- `lib/seo.ts`: one metadata builder (complete OG/Twitter, typed escaped JSON-LD, preview noindex) used by every marketing page; canonical origin defaults to `www`.
- `components/seo-schema.tsx`: visible Breadcrumbs, escaped JSON-LD, BlogPosting from real API fields, homepage FAQ from the visible FAQ copy.
- `content/features.ts` / `content/competitors.ts`: `featureIsIndexable`/`comparisonIsIndexable` gates — a page must have verified capability, real section copy, and (for comparisons) a dated, sourced, `https://` claim for every line including Traiv's own — before it's indexable or in the sitemap. Reviewed in Phase 6 against the live code, not just the source.
- Corrected the unsourced comparison claims; comparison page now hides unverified competitor values and shows a review notice instead of silently presenting them.
- `blog/getPost`: returns null only on an actual 404; throws on outage so ISR keeps the last good page. 8s timeout, `error.tsx` added for retry.
- Seven preview media tags moved to `next/image` with a remote-host allowlist and real `sizes`.
- Muted contrast, inline-underlined links, a skip link, 44px touch targets, heading hierarchy fixes (Phase 2/8 combined).
- Phase 7: no source change (performance work this round was measurement, not remediation — the large image-weight reduction was already in place from Phase 2's `next/image` work, confirmed and quantified here).
- Phase 8: the six small-text selectors raised to the existing 12px already used elsewhere in the same component family (`marketing.css`); `Payments()` given the same `role="img"`/`aria-label` pattern as the app's other static previews; `Review()`'s decorative `<h4>` replaced with a non-heading `<p>` (plus a CSS specificity fix so it didn't silently inherit the wrong color from a sibling selector) — this was the desktop `heading-order` root cause.
- Phase 11: `utm_source`/`utm_medium`/`utm_campaign` now forwarded onto the trial link's `href` at the moment of click, reusing the existing `campaign()` parser — zero new storage, verified live both with and without UTM params present.

## Files modified

47 files touched across the task (`git status --porcelain` against the working tree, all still uncommitted per standing instruction):

- **New**: `apps/web/src/lib/seo.ts`, `apps/web/src/components/seo-schema.tsx`, `apps/web/scripts/seo-audit.mjs`, `apps/web/src/app/blog/[slug]/error.tsx`, `docs/seo/` (this directory).
- **Modified, marketing app shell/content**: `apps/web/src/app/layout.tsx`, `next.config.ts`, `package.json`, `marketing.css`, `content/{site,features,competitors}.ts`, `lib/{api,analytics}.ts`, `components/{analytics,client-demo,footer,marketing-sections,nav,product-scenes,structured-data}.tsx`.
- **Modified, every marketing route** (metadata/schema wiring): `page.tsx`, `about`, `affiliate`, `blog` (+`[slug]`), `coaches`, `compare` (+`[slug]`), `demo`, `features` (+`[slug]`), `gyms`, `legal/[doc]`, `partnership`, `pricing`, `robots.ts`, `sitemap.ts`, `tools` (+ its four sub-pages).
- **Modified, other apps' root metadata only** (noindex/nofollow — no behavior change): `apps/{admin,client,endorse,trainer}/src/app/layout.tsx`.
- **Modified, QA tooling**: `apps/web/scripts/responsive-audit.mjs`.
- **Modified, unrelated to SEO**: `.ai/state/current.md` (kept current with phase progress, per the project's own documentation convention — not a product-behavior change).

No file outside `apps/web` (plus the four apps' root-layout noindex metadata) carries a behavior change. No dependency was added — confirmed against `package.json`'s diff, which only reorders/adjusts scripts.

## Tests executed

- `tsc --noEmit` on all five apps (`web`, `trainer`, `client`, `admin`, `endorse`) — clean, re-run in this final pass.
- `pnpm exec biome check` on the full 47-file changed set — 0 errors after this pass's auto-fix of 28 files (import ordering only, no logic change); 162 pre-existing style warnings remain (`noNonNullAssertion` in `client-demo.tsx` and others), left alone deliberately — the available autofix changes `!`-assertion to `?.`-optional-chaining, which is a real semantic change (loud crash vs. silent undefined) on code this task didn't author and has no basis to judge safe; out of scope for an SEO task to alter error-handling behavior.
- `pnpm --filter @traiv/web audit:seo` — 35/35 routes, 0 failures, re-run against the final build.
- `pnpm --filter @traiv/web audit:responsive 360 1280` — 0 failures, all 21 routes × 2 widths, re-run against the final build.
- Isolated blog-outage scenario (`/private/tmp/traiv-seo-blog-scenario.mts`, real HTTP, no DB): 503 → throws, 404 → returns null, 200 retry → succeeds. Not re-run this pass; no code in `getPost`'s path changed since it last passed.
- `pnpm --filter @traiv/api test`: not re-run this pass — no file under `apps/api` changed anywhere in this task (confirmed by `git status`), so the previously-recorded result stands: all suites pass except the one pre-existing, unrelated `nutrition-import.test.ts` failure (test-DB migration drift, not caused by or related to this work).

## Build status

`pnpm --filter @traiv/web exec next build --webpack`: succeeds, 40 routes prerendered, re-run as the final step of this pass (after the biome auto-fix) to confirm nothing in that fix broke the build. Dev/production server smoke-tested on `localhost:3104` after every rebuild this session via `curl`/Lighthouse/the two audit scripts.

## Remaining issues (explicitly not fixed — documented, not silently accepted)

- ~~Comparison pages: all 5 fail `comparisonIsIndexable`~~ — **resolved, see second addendum below.** Was blocked on the 3 shared `OURS` claims pointing at an internal doc instead of a public page; now that traiv.fit is deployed, resolved by re-sourcing them live.
- **True signup/activation/paid-conversion attribution** is not built — it would require the trainer app's own signup handler to persist `utm_*` against a new account, which is a privacy-posture decision outside this phase's authority to make unilaterally (Phase 11 finding, `conversion-audit.md`).
- **No trust signals** (testimonials, logos) on the homepage — correct for a pre-launch product; not something to fabricate, a real gap to close once there are real customers to quote (Phase 11 finding).
- **Mobile Lighthouse Performance score is noisy** (100/91/91 across 3 repeat runs on an unchanged build) — root-caused to Lantern's simulated-LCP estimate, not a real regression (real observed-trace timing for the LCP element was stable within a few ms across all 3 runs); report the median, don't chase the noise (Phase 7 finding, `performance-after.md`).
- **`best-practices` capped at 96**, both before and after, due to a `localhost:3104`-only analytics CORS warning absent against the real production API origin — a local-testing artifact, not something to fix by loosening production CORS.
- **Live deployed changes are unverified** — nothing in this task was deployed; every build/audit ran against a local production server. Apex→HTTPS→www redirect chain, Search Console/Bing, DNS/WAF, and real crawler-log verification are all explicitly external and outside this task's authorization (standing instruction: no deploy, no DNS, no external accounts without separate authorization).
- **Desktop-vs-mobile accessibility is not identical** — mobile homepage is 100, desktop is now also 100 after Phase 8's fix, but this was only checked for the homepage; other routes were not individually re-audited at both form factors beyond what `audit:responsive`'s font-size/tap-target checks already cover (that script doesn't run Lighthoues's full a11y category per-route).
- **Vault and messaging feature pages** remain below the content-quality gate (points/copy-length) — correctly noindex, not a bug, but also not improved; improving their copy is editorial work (Phase 6).

## Performance measurements

Full detail in `performance-before.md` / `performance-after.md` (Phase 7, homepage only — the only page with both a before and after baseline). Headline: mobile total page weight 2.4 MB → 495 KB (−79.5%), desktop 2.4 MB → 480 KB (−80.3%), both driven almost entirely by image transfer (−96%/−98%) from the `next/image` migration. FCP/Speed Index essentially unchanged on both devices (already fast before this task — the win is payload, not paint speed). CLS is 0 in every run, both devices, before and after. Accessibility 91→100 (mobile), 91→99→**100** (desktop; the last point fixed in this pass, Phase 8). LCP targets (≤2.5s) are met at the median and in every individual run on both devices.

## Indexing readiness

- Sitemap (`sitemap.xml`) and every page's `robots` metadata are generated from the same two predicate functions (`featureIsIndexable`, `comparisonIsIndexable`) — confirmed, by direct code read and live crawl, that there is no path for a page to be indexable but absent from the sitemap, or listed in the sitemap but noindex. 35 routes currently indexable; all noindex pages (legal, unverified features/comparisons, preview) correctly return 200 (visible to the visitor) rather than being blocked.
- `robots.txt` allows legal-page crawling (so a crawler can read the noindex tag itself) and correctly omits the sitemap entry when `isPreview` is true.
- JSON-LD on every route parses and carries `@context`/`@type` or `@graph` — confirmed live for all 35 crawled routes, every pass.
- External validation (Google Rich Results Test, schema.org validator, actual Search Console indexing status) was not performed — requires an external account/service this task was not authorized to use.

## Manual verification requirements

Before this is considered launch-ready, a human needs to:
1. ~~Re-source the 3 shared `OURS` comparison claims...~~ Done, see second addendum. Ongoing: re-review all `/compare/*` claims monthly (`pseo-architecture.md` step 7) — the `checked: "2026-11-06"` dates start aging toward the 180-day cutoff from today.
2. Review the Vault/Messaging feature copy for genuine usefulness, not just length — the gate only checks length/structure, not quality.
3. Decide whether to build signup-time UTM persistence on the trainer app (a product/privacy call, not an engineering one) — see `conversion-audit.md`.
4. Verify the apex→HTTPS→www redirect chain, DNS/WAF, and Search Console/Bing Webmaster setup in the actual deployed environment — none of this exists in a local-only task.
5. Spot-check the 7 `next/image`-served remote images for rights/availability — this task preserved existing media, it did not audit licensing.
6. Read every structured-data block through Google's and schema.org's own validators once deployed; this task's own `audit:seo` only confirms the JSON parses and has a type, not that Google accepts every field.

## Expected business impact (estimates — not measured, do not cite as fact)

- Faster mobile load (−79.5% page weight) is associated, in general web-performance literature, with lower bounce and better mobile conversion — but this task has no before/after field conversion data to confirm it moved anything for Traiv specifically. Treat as directionally likely, not proven.
- Five indexable, distinct feature pages plus a filtered sitemap should improve how cleanly Google can crawl and rank the real product pages, versus a sitemap that previously could have included thin pages — again, no live ranking data exists yet to confirm.
- The UTM-forwarding fix (Phase 11) makes "which campaign/page drove a signup" *measurable in principle* once the trainer app's signup handler is updated to read it — it does not, by itself, increase signups or conversion rate. It removes a measurement blind spot, nothing more.
- None of the above should be presented to a stakeholder as a guaranteed outcome. Every number in this report is a lab/build-time measurement; no field data (real users, real search console, real signups) exists for this task to report on.

## Next recommended actions, in order

1. Deploy to a real environment and re-run `audit:seo`/`audit:responsive`/Lighthouse against the live origin — everything in this report was measured locally.
2. Set up Google Search Console and Bing Webmaster, submit the sitemap, and begin collecting real indexing/CrUX/INP field data (Phase 10 was setup-instructions-only; no account access existed).
3. Source the 3 shared comparison claims to unblock all 5 `/compare/*` pages (highest-leverage single piece of remaining work — one evidence pass unblocks five pages at once).
4. Bring the product/privacy decision on signup-time attribution storage to whoever owns that call, using `conversion-audit.md`'s recommendation as the starting point.
5. Once there are real customers, add genuine testimonials/trust signals — do not fabricate them in the meantime.
6. Re-run the Phase 7 performance measurement after deployment, since local `localhost:3104` numbers (especially TTFB and the CORS-capped Best Practices score) will differ from the real production origin.

## Final acceptance criteria — status against the master prompt's own 15-item list

| # | Criterion | Status |
|---|---|---|
| 1 | Critical technical SEO issues resolved or explicitly documented as blocked | Met — resolved in-repo; the one blocked item (comparison claims) is documented, not silently dropped |
| 2 | Public pages have appropriate metadata and canonicalization | Met — one shared builder, verified live on all 35 crawled routes |
| 3 | Sitemaps and robots directives are correct | Met — shared-predicate, live-verified, deduplicated |
| 4 | Private routes protected from accidental indexing | Met — trainer/client/admin/endorse root metadata noindex/nofollow, typechecked |
| 5 | Applicable structured data is valid and accurate | Met for JSON-parse/type validity (live-checked every route); external validator confirmation is a manual follow-up (see above) |
| 6 | Important marketing content accessible in server-rendered HTML | Met — this was never client-only rendered; confirmed via the crawl script, which reads raw server HTML with no JS execution |
| 7 | Core Web Vitals measured and material bottlenecks addressed | Met — before/after measured (3-run repeat on the final pass), the one material bottleneck found (image weight) addressed, remaining LCP simulation noise explained rather than hidden |
| 8 | Mobile performance tested | Met — Lighthouse mobile + `audit:responsive` at 360px, both in this final pass |
| 9 | No significant functionality or visual regressions | Met — typecheck clean on 5 apps, build succeeds, `audit:seo`/`audit:responsive` clean, Phase 8 fixes visually screenshot-verified, not just score-verified |
| 10 | AEO content clear, accurate, answer-friendly | Met — Phase 4; homepage FAQ schema sourced from visible copy only |
| 11 | GEO readiness follows documented crawler/content practices | Met — Phase 5, reviewed; production crawler-log verification is external |
| 12 | pSEO infrastructure prevents thin/duplicate pages | Met — Phase 6, reviewed against live code; unknown slugs 404, no duplicate sitemap/title/description across all 35 routes |
| 13 | Relevant automated checks pass | Met — `tsc` (5 apps), `audit:seo`, `audit:responsive` all clean; biome 0 errors (162 pre-existing unrelated warnings left alone, reasoning above) |
| 14 | Production build succeeds | Met — re-verified as the last step of this pass |
| 15 | All changes and remaining limitations documented | Met — this file, plus `performance-before/after.md`, `conversion-audit.md`, `phase-5/6-status.md`, and `HANDOFF.md`'s phase table |

All 15 criteria are met at the repository level. Criteria 1 and 5 carry explicitly-documented, not-silently-accepted external/manual follow-up (comparison evidence, external schema validators) — "met" here means "resolved or explicitly documented as blocked," which is the master prompt's own bar, not "100% complete with nothing left for a human."

## Addendum — a second pass closed three more code-fixable gaps

After this report was first written, three more items that were genuinely fixable from inside the repo (not requiring deployment, account access, or a product/privacy decision) were closed:

- **Vault and Messaging feature pages are now indexable.** Both were expanded with real capability detail — read from the actual `apps/api/src/features/{vault,messaging}` implementations, not invented: Vault's real file types (Image/Video/Audio/Document/Link/File) and the client's categorized/searchable view; Messaging's read receipts, unread count, and workout/check-in activity that posts into the thread automatically. 7 of 8 feature pages are now indexable; Payments correctly remains noindex since no confirmed payment implementation exists in the repo. "Files modified" above should be read as 49 files, not 47 — `apps/web/src/content/features.ts` (already listed) plus `apps/web/src/app/pricing/page.tsx`, `apps/web/src/components/calorie-calculator.tsx`, and `apps/web/src/app/compare/[slug]/page.tsx` (newly touched in this pass).
- **Two more real `heading-order` failures found and fixed**, outside the homepage this report otherwise covers: `/pricing` and `/tools/calorie-calculator` each had a genuine `h1 → h3` skip (no `h2` existed before their first real heading). Fixed with an `sr-only h2` on `/pricing` (the hero already states both prices visibly, so a second visible heading would be redundant) and by promoting two calculator-result headings to `h2` on `/tools/calorie-calculator` (correct semantically — they were already the first heading-level content under that page's `h1`, with nothing at `h2` between them).
- **Every `/compare/[slug]` page's table header had insufficient color contrast** (4.31:1 against a 4.5:1 requirement — `text-fg-muted` and `text-fg-subtle` are both local token overrides defined in `marketing.css`, not the shared `packages/ui` tokens). Rather than inventing a new color, switched the header from `text-fg-subtle` to the already-existing, already-more-contrasted `text-fg-muted` token (confirmed 5.08:1 by direct WCAG luminance calculation before touching the component, then re-confirmed live via Lighthouse).

Found via a 6-route Lighthouse accessibility sample (`/pricing`, `/features/check-ins`, `/compare/trainerize`, `/blog`, `/tools/calorie-calculator`, `/features/vault`, mobile + desktop) — this report's original "Manual verification requirements" item about per-route accessibility coverage is accordingly narrowed: the sample found and fixed 3 of the page templates that exist (pricing, compare, the free-tool calculators); the remaining untested templates are legal pages, blog posts, and the static marketing pages (about/partnership/affiliate/coaches), none of which share a component with the three templates that were fixed. All fixes re-verified: `tsc` clean, biome clean, production build succeeds, `audit:seo` 35/35, `audit:responsive` 0/42, and the 4 directly-touched routes plus the homepage score 100 on Lighthouse accessibility, mobile and desktop.

## Second addendum — pSEO finished end to end, all 5 comparison pages live

Traiv is now deployed (`https://www.traiv.fit`), which removed the one structural blocker the original report and Phase 6 both flagged: the 3 `OURS` claims shared across every `/compare/*` page had nowhere public to point to. With a real site to cite, this pass:

- **Re-sourced the 3 `OURS` claims** to `https://www.traiv.fit/pricing`, read live and confirmed to state the ₹999/month price, the no-automatic-import migration language, and the PDF plan-export capability verbatim — not assumed from the internal positioning doc they used to cite.
- **Independently re-verified every competitor-specific claim** across all 5 comparisons against each vendor's own live pricing page (Trainerize, FitBudd, Everfit, TrueCoach, Coachway) — not just re-dated the existing numbers.
- **Found and corrected two real factual errors** in the process, rather than rubber-stamping the old claims: Trainerize's nutrition add-on is $20–45/month depending on plan tier, not a flat $45; and TrueCoach's pricing page does not publish the "5% of your revenue" figure anywhere — a direct search of the page found no percentage, transaction, or commission language at all, so that claim (and the `why`/`stay` prose built on it) was replaced with TrueCoach's actual verified tiered-pricing structure instead of being carried forward unverified.
- **Found and fixed a third, unrelated staleness bug** while in the file: `comparison.ts`'s `EUR_TO_INR` conversion constant (used by the `/compare` page's interactive price chart) was hardcoded at 92; the live mid-market rate is ~104.95. Corrected to 105, and the one piece of prose in `competitors.ts` that did this arithmetic by hand (Coachway's `why` text) was recomputed to match (₹43,600 → ₹49,800 at 50 clients).
- **Deleted dead code carrying the same stale claim twice**: `comparison.ts` had an unused, unreferenced `EXTRA_CHARGES`/`Charge` export duplicating the Trainerize-$45 and TrueCoach-5% figures from an internal source — never rendered anywhere, confirmed by a full-repo grep before removing it.

All 5 comparison pages now pass `comparisonIsIndexable` and appear in the sitemap. Re-verified live, not just by re-reading the gate function: `audit:seo` 35/35 (all 5 `/compare/*` routes now indexed with unique titles/descriptions, zero duplicates), `audit:responsive` 0/42 (the longer, more specific claim text didn't introduce any overflow or undersized text), and a Lighthouse accessibility spot-check on 3 of the 5 comparison pages scores 100. `tsc` and biome both clean on every touched file. pSEO (Phase 6) is accordingly upgraded from "reviewed, one open item" to **done end to end** — architecture, gates, and content all live and indexable, with the one remaining caveat being the ordinary one every page here already carries: re-review monthly, since prices change and the `checked` dates will age out of the 180-day window on their own schedule.
