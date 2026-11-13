# traiv.fit — SEO action plan (2026-11-13)

From `FULL-AUDIT-REPORT.md`. Items marked **[decision]** need product/owner input before
any code — per `CLAUDE.md`, copy and positioning are not invented by engineering.

## Critical
None. Nothing blocks indexing.

## High — this week

1. **Verify Search Console + Bing Webmaster** and submit the sitemap. *(owner, external)* — Without it, nothing below can be measured.
2. **Feature page metadata.** Add a dedicated `description` (and optionally `seoTitle`) to each entry in `apps/web/src/content/features.ts`; use it in `app/features/[slug]/page.tsx:22-24` instead of `name`/`blurb`. Titles should say what the thing is in a coach's words (e.g. the "Chat" page is client messaging). **[decision: copy, per `.ai/design/voice.md`]**
3. **Discipline landing pages.** Decide which of dietitians / nutritionists / yoga / physio get a page; `content/disciplines.ts` already has the raw material. One template route (e.g. `/for/[discipline]`), sitemap entry, breadcrumb. **[decision: which disciplines, URL scheme, copy]**
4. **Homepage title brand.** In `apps/web/src/app/page.tsx:11` use `title: { absolute: "… · Traiv" }` (or put the brand in the string) — the layout template doesn't reach the root page.

## Medium — this month

5. `noindex` `/blog` while `getPosts()` returns `[]`; drop it from the sitemap in the same condition (`app/blog/page.tsx`, `app/sitemap.ts`).
6. Replace `r2-cdn.coachway.io` recipe images with self-hosted assets in `apps/web/public/` and remove the two `remotePatterns` entries (`components/demo-media.ts`, `next.config.ts`). **[decision: which images we have rights to]**
7. Expand feature pages past ~200 words with concrete how-it-works detail grounded in the real product (same method as the Vault/Messaging expansion). **[decision: copy]**
8. Compare page descriptions: include the price contrast per competitor, from data already in `content/competitors.ts`.
9. Add `headers()` to `apps/web/next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo off), `X-Frame-Options: DENY`.
10. Publish `/llms.txt` (static route) linking pricing, features, compare, tools.
11. `/about`: named founder + why. **[decision]**
12. `Organization.sameAs` once real profiles exist (`components/structured-data.tsx`). **[owner]**

## Low — backlog

13. Breadcrumbs (+ schema) on `/tools/*` and `/blog/*`.
14. `WebApplication` schema for the three calculators.
15. Self-host or cache exercise images instead of `raw.githubusercontent.com`.
16. Collapse the apex redirect to one hop in Vercel (`http://traiv.fit` → `https://www.traiv.fit`).
17. Serve `/favicon.ico`.
18. Trim first-load JS (~250 KB) — check `motion` usage above the fold.
19. Decide an AI-crawler policy (`Content-Signal` in robots) **[decision]**.

## Phase 3 — content & authority (month 2+)

- First blog posts targeting coach-business questions the tools already answer (pricing your coaching, macro calculation, client retention) — each linking to its tool.
- Outreach: certification academies / partners from `/partnership` are natural backlink sources.

## Ongoing

- Re-run `/seo audit https://www.traiv.fit/` monthly; `pnpm --filter @traiv/web audit:seo` in CI.
- Once GSC has 4–6 weeks of data, re-prioritise by real impressions.
