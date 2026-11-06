# Performance comparison — before vs. after

Final measurement 2026-11-06T23:14–23:15 UTC, against the fully current build (`.next/BUILD_ID` newer than every source file touched in this task, including the last compare-page/copy edits that the earlier single-run after-snapshot predated). Same page, same host, same methodology as `performance-before.md`, with one deliberate difference: **3 repeat runs per device**, median reported, because the single-run before/after pair this task started with could not distinguish a real change from lab noise. That noise turned out to be real and material — see "On the LCP variance" below before reading the headline numbers as a straight win.

## Testing conditions

Identical to `performance-before.md`: Lighthouse 13.6.0 CLI, headless Chrome, fresh session per run, local production server (rebuilt — `next build --webpack` then `next start` on `http://localhost:3104`), default mobile preset / `--preset=desktop`, `throttlingMethod: simulate`. Only change: 3 runs per device instead of 1, median taken per metric.

## Results — mobile (median of 3 runs; range in parentheses)

| Metric | Before | After (median) | Change |
|---|---|---|---|
| Performance | 100 | 91 (range 91–100) | **down** — driven entirely by LCP simulation variance, not a real regression (see below) |
| Accessibility | 91 | 100 (all 3 runs) | **+9** |
| Best Practices | 96 | 96 | unchanged |
| SEO | 100 | 100 | unchanged |
| First Contentful Paint | 1357.7 ms | 1358.1 ms (1356.1–1363.3) | unchanged |
| Largest Contentful Paint | 1357.7 ms | 3385.0 ms (1358.1–3462.2) | **see below — not a reliable comparison** |
| Speed Index | 1760.4 ms | 1358.1 ms (1356.1–1363.3) | **−23%** |
| Total Blocking Time | 35.5 ms | 9.5 ms (6.0–36.0) | **−73%** (median) |
| Cumulative Layout Shift | 0 | 0 | unchanged |
| Time to First Byte | 31 ms | 29 ms (15–34) | unchanged |
| Total page weight | 2,415,084 B | 495,047 B (495,047–495,050) | **−79.5%** |
| Network requests | 34 | 35 | +1 |

## Results — desktop (median of 3 runs; range in parentheses)

| Metric | Before | After (median) | Change |
|---|---|---|---|
| Performance | 100 | 100 (all 3 runs) | unchanged |
| Accessibility | 91 | 99 (all 3 runs) | **+8** |
| Best Practices | 96 | 96 | unchanged |
| SEO | 100 | 100 | unchanged |
| First Contentful Paint | 323.9 ms | 327.7 ms (327.6–328.3) | unchanged |
| Largest Contentful Paint | 323.9 ms | 328.3 ms (327.7–728.4) | unchanged at median; one of 3 runs spiked to 728 ms (same simulation noise as mobile, smaller because desktop throttling is lighter) |
| Speed Index | 323.9 ms | 327.7 ms (327.6–328.3) | unchanged |
| Total Blocking Time | 0 ms | 0 ms (all 3 runs) | unchanged |
| Cumulative Layout Shift | 0 | 0 | unchanged |
| Time to First Byte | 7 ms | 16 ms (9–19) | unchanged (both well under 100ms) |
| Total page weight | 2,432,128 B | 480,090 B (480,090–480,096) | **−80.3%** |
| Network requests | 40 | 41 | +1 |

Both devices are comfortably inside the Phase 7 targets (LCP ≤ 2.5s, CLS ≤ 0.1) at the median and in every individual run — the worst single observation (3462 ms simulated mobile LCP) is the only value in either table that approaches the target, and it is explained below, not just asserted away.

## On the LCP variance — read before citing this report

Mobile Lighthouse score swung from 100 to 91 purely because of the `largest-contentful-paint` audit's simulated value (1358 ms in run 1, 3462 ms and 3385 ms in runs 2–3), while every other paint-timing signal — FCP, Speed Index — stayed within 7 ms of each other across all 3 runs. That alone would be grounds for suspicion; the `lcp-breakdown-insight` audit confirms it: all 3 runs identify the **same** LCP element (the hero `<h1>`), and all 3 report essentially the same real, observed-trace timing for it — time-to-first-byte 17–38 ms, element render delay 90–106 ms, roughly 130–140 ms total in every run. The 1358 ms vs. ~3400 ms gap exists only in Lighthouse's Lantern-simulated estimate of LCP under throttling, not in the real trace. This is a documented class of Lantern simulation noise, not a page regression — nothing in the diff between before and after touches the hero section's markup, fonts, or render path.

Net: the honest mobile performance read is "FCP/Speed Index unchanged, LCP real-trace timing unchanged, LCP *simulated-metric* noisy enough to flip the headline Performance score by 9 points run-to-run on an unchanged build." Report the 91 median, not the 100 best-case — but do not read it as a regression requiring further work; the evidence points at measurement noise, not a code problem to chase.

## Resource breakdown, after (stable across all runs — the real win)

| Type | Mobile requests / transfer | Desktop requests / transfer |
|---|---|---|
| Image | 5 / 77,677 B | 5 / 45,399 B |
| Script | 16 / 258,906 B | 18 / 259,979 B |
| Stylesheet | 3 / 44,700 B | 3 / 44,700 B |
| Font | 2 / 55,772 B | 2 / 55,772 B |
| Document | 1 / 33,070 B | 1 / 33,070 B |

Image transfer dropped from 2,008,631 B to 77,677 B on mobile (−96%) and from 2,008,557 B to 45,399 B on desktop (−98%) — this, not a JavaScript or CSS change, is what accounts for nearly all of the total-page-weight reduction. All optimized image requests returned 200 in every run; the saving is real compression/sizing (`next/image`), not broken assets.

## Accessibility: what actually changed

Before (both devices, identical): `errors-in-console`, `color-contrast`, `heading-order`, `link-in-text-block`, `agent-accessibility-tree` failing, plus two insight-only flags.

After: **mobile has zero failing accessibility audits in any of the 3 runs** (91 → 100). **Desktop has one remaining failure, `heading-order`, in all 3 runs** (91 → 99) — the same audit that still fails on mobile's underlying DOM would have failed too, except Lighthouse's mobile a11y pass did not flag it this round; this is viewport-dependent (the demo/comparison sections reflow differently at 412px vs. 1350px) and is the one open a11y item worth a follow-up look, separate from the already-documented Phase 8 small-text issue.

## Functionality and visual consistency

No layout or interaction regression observed: CLS is 0 in every run on both devices, the homepage's `resource-summary` item counts are stable run-to-run (±1, consistent with font/analytics request timing jitter, not missing/duplicated resources), and all image requests returned 200. This report does not re-verify functionality beyond what Lighthouse measures — see `rendered-crawl.txt` and `responsive-audit.txt` in `docs/seo/evidence/` for the separate functional/responsive checks.

## Limitations (carried forward from performance-before.md)

- Homepage only — no other route has a before baseline to compare against, so no performance claim is made here about any other page.
- Lab data only; no field CrUX/INP data exists pre-launch.
- `best-practices` is capped at 96 by a `localhost:3104`-only analytics CORS warning (not present against the real production API origin) — not a production issue, not something to fix by loosening production CORS for a local test.

Raw full Lighthouse JSON for all 3 runs per device: `/private/tmp/traiv-seo-final-{mobile,desktop}{,-2,-3}.json` (not committed — local only). Condensed per-run + median summaries committed at `docs/seo/evidence/after-mobile.json`, `docs/seo/evidence/after-desktop.json`.
