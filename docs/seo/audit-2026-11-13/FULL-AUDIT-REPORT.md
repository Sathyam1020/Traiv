# traiv.fit — Full SEO audit (2026-11-13)

Tool: Claude SEO v2.6.0 (`/seo audit`), run against production `https://www.traiv.fit/`
with findings mapped to `apps/web`. This audit builds on — and does not repeat — the
2026-11-06 SEO pass recorded in `docs/seo/HANDOFF.md` and `docs/seo/final-audit.md`.

## Executive summary

**SEO Health Score: 69 / 100**
**Business type:** B2B SaaS (coaching software), India-first, INR pricing.

The technical foundation is solid: server-rendered pages, correct canonicals, a sitemap
derived from content, preview noindex, valid JSON-LD, 0 layout shift and sub-2s LCP on
throttled mobile. What holds the score down is not engineering — it is **what the pages
say and which searches they can rank for.** Titles and H1s are brand slogans rather than
the phrases coaches type; feature pages are ~200 words with 30–40 character meta
descriptions; the blog is indexed but empty; and four of the five coach types the
product is for (dietitians, nutritionists, yoga instructors, physiotherapists) have no
page at all.

### Top 5 issues

1. **No page targets four of the five coach types.** `content/disciplines.ts` already
   holds per-discipline copy but is imported nowhere. (High)
2. **Feature pages are thin with stub meta descriptions** (30–40 chars, e.g. "Your
   client's day in one place"). (High)
3. **Titles/H1s don't carry search terms.** "Today · Traiv", "Chat · Traiv",
   "Shared resources · Traiv"; homepage title omits the brand. (High)
4. **`/blog` is indexable with 86 words and "Nothing published yet."** (Medium)
5. **Homepage demo images hot-linked from a competitor's CDN** (`r2-cdn.coachway.io`). (Medium — brand/availability risk more than ranking)

### Top 5 quick wins

1. Add `Traiv` to the homepage `<title>` (one line, `app/page.tsx`).
2. Give each feature page a real `description` field instead of reusing `blurb`.
3. `noindex` `/blog` while it has zero posts (flip back automatically when `posts.length > 0`).
4. Add baseline security headers in `next.config.ts` (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
5. Publish `/llms.txt` pointing at pricing, features, compare and tools.

## Scorecard

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 85 | 18.7 |
| Content Quality | 23% | 55 | 12.7 |
| On-Page SEO | 20% | 60 | 12.0 |
| Schema / Structured Data | 10% | 75 | 7.5 |
| Performance (CWV) | 10% | 90 | 9.0 |
| AI Search Readiness | 10% | 60 | 6.0 |
| Images | 5% | 70 | 3.5 |
| **Total** | | | **69** |

## Scope and method

- Crawled all 28 sitemap URLs + 2 legal pages linked from the footer (30 pages, all 200).
- Parsed each page's title, description, canonical, robots, headings, images, links, schema, OG.
- Lab Core Web Vitals via Playwright: 360×780 mobile, 4× CPU throttle, 1.6 Mbps / 150 ms RTT. (PageSpeed Insights' shared anonymous quota was exhausted; no CrUX field data — the site has no Google API key configured.)
- Agent-readiness HTTP checks incl. AI user-agent matrix.
- No GSC / GA4 / backlink data available — rankings, impressions and link profile are **not** assessed.

---

## Technical SEO — 85

**What works**
- Server-rendered/prerendered (Vercel `x-vercel-cache: PRERENDER`); 1,448 words visible without JS on `/`.
- One canonical per page, all absolute to `https://www.traiv.fit`; `robots.txt` allows all and points to the sitemap.
- Sitemap generated from content (`app/sitemap.ts`), 28 URLs, no duplicates; noindex pages (legal, `/features/payments`) correctly excluded.
- Real 404s for unknown routes; HSTS set (`max-age=63072000`).
- GPTBot, ClaudeBot, PerplexityBot etc. all receive the same 200 response as a browser.

**Findings**

| Severity | Finding | Where |
|---|---|---|
| Medium | No security headers beyond HSTS (no `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`/`frame-ancestors`). Not a ranking factor, but flagged by Lighthouse Best Practices and trust scanners. | `apps/web/next.config.ts` (add `headers()`) |
| Low | `http://traiv.fit` → `https://traiv.fit` → `https://www.traiv.fit` is two 308 hops. Already noted as Vercel-owned in HANDOFF. | Vercel domain config |
| Low | Static sitemap entries have no `lastModified`. Acceptable (better than a fake build date, per the existing comment), but Google uses it for recrawl scheduling once pages change. | `apps/web/src/app/sitemap.ts` |
| Low | `/favicon.ico` returns 404. `app/icon.tsx` serves `/icon` and is linked, which is what Google uses, so this is cosmetic (browser/RSS reader fallbacks). | `apps/web/src/app/` |
| Info | Search Console / Bing Webmaster not verified (owner follow-up from 2026-11-06). Without it there is no indexation or query data — highest-leverage external task. | external |

## Content Quality — 55

**What works**
- Distinct, specific voice; tools pages (`/tools/templates` 951 words, calculators ~400) are genuinely useful, ungated assets — good link/citation bait.
- Comparison pages cite sources with dates — strong trust signal.

**Findings**

| Severity | Finding | Where |
|---|---|---|
| High | **No landing pages for dietitians, nutritionists, yoga instructors or physiotherapists** — the product's stated audience (`CLAUDE.md`). Every page speaks to "personal trainers and gyms". `DISCIPLINES` (5 tailored write-ups) exists but no route imports it. *Which disciplines get pages, and their copy, is a product decision.* | `apps/web/src/content/disciplines.ts` (unused) |
| High | Feature pages are thin: 190–250 words each (`/features/today` 190, `/vault` 192, `/client-app` 205). They pass the internal indexability gate (≥200 chars) but are light for ranking against established competitors. | `apps/web/src/content/features.ts` |
| Medium | `/blog` is indexable but empty (86 words). Thin page in the index; also an E-E-A-T gap — no dated, authored content anywhere on the site. | `apps/web/src/app/blog/page.tsx` |
| Medium | `/about` is 196 words with no named people. For E-E-A-T and AI citation, who builds Traiv and why they're credible is the missing piece (the demo page already promises "the person who built it"). | `apps/web/src/app/about/page.tsx` |
| Low | `/tools` hub is 125 words; `/coaches` 189. | respective `page.tsx` |

## On-Page SEO — 60

| Severity | Finding | Where |
|---|---|---|
| High | Feature page meta descriptions are the `blurb` field, 30–40 chars ("Their coaching, wherever they are"). Google will usually rewrite these; they also don't say what the page is. | `app/features/[slug]/page.tsx:24` uses `f.blurb` |
| High | Feature titles use internal product names with no search intent: "Today", "Chat", "Shared resources", "Client app". Template yields e.g. `Chat · Traiv`. | `content/features.ts` `name` → `app/features/[slug]/page.tsx:22` |
| Medium | Homepage `<title>` is `Coaching app for personal trainers and gyms` — **no brand**. `title.template` from the root layout doesn't apply to the root `page.tsx` (same segment), so the `· Traiv` suffix never appears. | `apps/web/src/app/page.tsx:11` |
| Medium | H1s are slogans ("More coaching. Less chasing.", "The plan. The person. The progress.") with no keyword. Fine for conversion; the fix is to make sure the title + a visible subheading/H2 carry the term instead. | page heroes |
| Medium | All 5 compare descriptions share one template ("Compare X and Traiv: coaching workflows, plan details and considerations before switching."). Not duplicates, but generic — they don't mention price, which is what "X alternative" searchers want. | `app/compare/[slug]/page.tsx:24` |
| Low | No "India"/INR-intent phrasing in any title. Whether to target "India" explicitly is a positioning call. | — |

## Schema / Structured Data — 75

**Present & valid:** `Organization`, `WebSite`, `SoftwareApplication` (with INR `Offer`s) site-wide; `FAQPage` on `/`; `BreadcrumbList` on feature and compare pages. All blocks parse.

| Severity | Finding | Where |
|---|---|---|
| Medium | `Organization.sameAs` empty — no entity links. Known owner follow-up (no profiles yet). | `components/structured-data.tsx` |
| Low | Calculator tools have no `WebApplication`/`SoftwareApplication` markup of their own. | `app/tools/*` |
| Low | `/tools/*` and `/blog` have no `BreadcrumbList` (features/compare do). | `components/seo-schema.tsx` `Breadcrumbs` |
| Info | `SoftwareApplication` without `aggregateRating` won't earn a rich result — deliberately omitted until real reviews exist (correct). | — |
| Info | `areaServed: "Worldwide"` vs India-first pricing — fine, revisit if positioning narrows. | — |

## Performance — 90

Lab, throttled mobile 360px (see `evidence/cwv-lab.json`):

| Page | LCP | CLS | FCP | TTFB | JS (transfer) |
|---|---|---|---|---|---|
| `/` | 1.96 s | 0 | 1.96 s | 283 ms | 250 KB |
| `/features` | 1.85 s | 0 | 1.85 s | 256 ms | 250 KB |
| `/pricing` | 1.56 s | 0 | 1.56 s | 268 ms | 250 KB |
| `/tools/calorie-calculator` | 1.87 s | 0 | 1.87 s | 282 ms | 277 KB |
| `/features/nutrition` | 1.86 s | 0 | 1.86 s | 292 ms | 250 KB |

All "good" (LCP < 2.5 s, CLS < 0.1). LCP is text, so it tracks FCP — no image bottleneck.

| Severity | Finding |
|---|---|
| Low | ~250 KB compressed JS on every marketing page; LCP = FCP means JS isn't blocking paint today, but it's the main cost for INP on low-end Android. Candidates: the `motion` animations on above-the-fold sections. |
| Info | No field (CrUX) data — the site likely has too little traffic yet. INP is unmeasured. |

## Images — 70

| Severity | Finding | Where |
|---|---|---|
| Medium | Recipe demo images are served from **a competitor's CDN** (`r2-cdn.coachway.io`), proxied via `/_next/image`. If they rotate or block the paths, the homepage and `/features/nutrition` show broken images; it's also an IP/brand exposure. HANDOFF already flagged "rights/availability should be owner-verified." | `apps/web/src/components/demo-media.ts:26`, `next.config.ts:13-14` |
| Low | Exercise images hot-linked from `raw.githubusercontent.com/yuhonas/free-exercise-db` — public-domain, but GitHub raw isn't a CDN and can rate-limit. | `next.config.ts:10` |
| Info | `alt=""` on the 6 exercise thumbnails is correct (decorative inside a labelled mock), not a defect. | `components/product-scenes.tsx:257,284` |

## AI Search Readiness — 60

**Works:** content present without JS; AI crawlers not blocked or challenged; homepage FAQ gives direct, extractable answers; prices are stated plainly in text.

| Severity | Finding |
|---|---|
| Medium | No `/llms.txt`. Optional for Google, but it's a counted pass in Lighthouse's agentic audit and a cheap pointer for answer engines. |
| Medium | Little citable, entity-level content: no named founder/team, no `sameAs`, no dated articles. LLMs cite sources with clear authorship and specific claims; compare pages are the strongest asset here. |
| Low | `robots.txt` has no explicit AI-crawler groups or `Content-Signal`. Everything falls through to `*` (allowed), which is fine unless you want to opt out of training while staying in AI search — a policy decision. |

## Visual / mobile

Mobile (360) and desktop screenshots in `screenshots/`. H1 and primary CTA visible above the fold; no horizontal scroll; base font 16px; touch targets OK.

## Not covered

Rankings, impressions, CTR (no GSC); backlinks (no Moz/Bing/Ahrefs keys); keyword volumes (no DataForSEO/Keyword Planner). Connect GSC first — it turns several "Medium" items above into measurable ones.
