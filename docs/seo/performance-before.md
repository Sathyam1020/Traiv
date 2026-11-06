# Performance baseline — before

Captured 2026-11-06T16:52–16:55 UTC, before any Phase 7 performance changes. Page tested: homepage (`/`) only — the representative page the rest of this task's Lighthouse evidence is built around. No other route has a before baseline; treat that as a documented scope limit, not an oversight (see "Limitations" below).

## Testing conditions

- Lighthouse 13.6.0, CLI, headless Chrome, fresh browser session per run.
- Local production server: `pnpm --filter @traiv/web exec next build --webpack` then `next start` on `http://localhost:3104`.
- Mobile: Lighthouse's default mobile preset (Moto G Power emulation, 412×823, DPR 1.75, simulated throttling — RTT 150ms, 1.6 Mbps down, 4× CPU slowdown).
- Desktop: `--preset=desktop` (1350×940, no DPR scaling, simulated throttling — RTT 40ms, 10 Mbps, 1× CPU).
- `throttlingMethod: simulate` (Lantern simulation from a single unthrottled trace), not real device/network throttling.
- One run per device. This is a genuine limitation, not a choice: do not read single-run numbers below as noise-free. The after-measurement (`performance-after.md`) uses 3 repeat runs per device specifically to correct for this.

## Results — mobile

| Metric | Value |
|---|---|
| Performance | 100 |
| Accessibility | 91 |
| Best Practices | 96 |
| SEO | 100 |
| First Contentful Paint | 1357.7 ms |
| Largest Contentful Paint | 1357.7 ms |
| Speed Index | 1760.4 ms |
| Total Blocking Time | 35.5 ms |
| Cumulative Layout Shift | 0 |
| Time to First Byte | 31 ms |
| Total page weight | 2,415,084 B (2.4 MB) |
| Network requests | 34 |

## Results — desktop

| Metric | Value |
|---|---|
| Performance | 100 |
| Accessibility | 91 |
| Best Practices | 96 |
| SEO | 100 |
| First Contentful Paint | 323.9 ms |
| Largest Contentful Paint | 323.9 ms |
| Speed Index | 323.9 ms |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Time to First Byte | 7 ms |
| Total page weight | 2,432,128 B (2.4 MB) |
| Network requests | 40 |

## Resource breakdown (mobile, the binding constraint)

| Type | Requests | Transfer |
|---|---|---|
| Image | 5 | 2,008,631 B |
| Script | 15 | 252,315 B |
| Stylesheet | 3 | 44,462 B |
| Font | 2 | 55,772 B |
| Document | 1 | 29,116 B |

Images are 83% of total page weight. This is the primary target identified for Phase 7 — not JavaScript, which was already a modest 252 KB transferred.

## Accessibility findings present at baseline

`errors-in-console`, `color-contrast`, `heading-order`, `link-in-text-block`, `agent-accessibility-tree`, plus two insight-only flags (`network-dependency-tree-insight`, `render-blocking-insight`) — identical set on mobile and desktop.

## Limitations

- Single run per device: Lighthouse's simulated-throttling LCP estimate is known to vary run-to-run (confirmed directly in the after-measurement, where 3 repeat runs on an unchanged build produced LCP values from 1358 ms to 3462 ms on mobile). This baseline cannot be treated as the true mean — only as one legitimate sample.
- Homepage only. Other representative pages (a feature page, a comparison page) were not baselined before changes started, so Phase 7's before/after comparison is scoped to the homepage. Any performance claim about other routes is unmeasured and should be treated as unverified.
- Lab data only (Lighthouse simulation). No field data (CrUX, real INP) exists for this pre-launch site.
- `best-practices` capped at 96 by an analytics CORS warning specific to `localhost:3104` not being in the production API's CORS allowlist — a local-testing artifact, not a production issue, and out of scope to "fix" by changing production CORS.

Raw full Lighthouse JSON: `/private/tmp/traiv-seo-before-mobile.json`, `/private/tmp/traiv-seo-before-desktop.json` (not committed — local only). Condensed summaries committed at `docs/seo/evidence/before-mobile.json`, `docs/seo/evidence/before-desktop.json`.
