# Initial SEO audit — 2026-11-06

Scope: public `apps/web` (Next 16.3.4, React 19.3.0, App Router, Tailwind 4); separate trainer/client/admin/endorse apps. Clean main working tree before audit. No infrastructure changes authorized or performed.

## Evidence and priorities

| Issue | Route/file | Category | Severity | Evidence / impact | Fix | Complexity | Verification |
|---|---|---|---|---|---|---|---|
| Canonical default differs from deployed hostname | content/site.ts | Canonical | High | Live apex responds 308 to www, then 200; fallback defaults apex, preview hostname can become canonical | Stable www production fallback; preview noindex | Low | HTTP + rendered tags |
| Child pages inherit homepage social title and URL | page metadata / root layout | Metadata | High | Pages specify title/description/canonical without OG/Twitter overrides; Next shallow inheritance retains root values | Shared complete metadata builder | Medium | Crawl all rendered pages |
| Unverified comparison pages indexed | compare/[slug], competitors.ts | Content | High | Source explicitly says most competitor claims unverified; some internal source paths | Gate comparison indexing and sitemap on verified external evidence | Medium | Render noindex, omit from sitemap |
| Blog outage treated as missing post | lib/api.ts | Availability | High | Every non-200 and network failure becomes null => 404 | Distinguish genuine 404 from upstream failure; bounded request timeout | Medium | Simulated upstream outage/missing |
| Private apps lack noindex | four root layouts | Indexing | High | No robots metadata in root layouts | noindex/nofollow, preserve auth | Low | Typecheck/static inspection |
| Legal robots disallow conflicts with noindex | robots.ts | Crawling | Medium | Live robots blocks /legal; crawlers cannot see noindex | Allow crawl, retain legal noindex | Low | Robots + HTML |
| Duplicate sitemap URL | sitemap.ts | Crawling | Medium | /tools/templates appears in TOOLS and explicitly | Deduplicate, use only genuine publication dates | Low | XML URL set |
| No article/breadcrumb schema | blog, feature routes | Structured data | Medium | Only global Organization/WebSite/SoftwareApplication | Escaped typed JSON-LD, linked entity IDs, breadcrumbs/blog | Medium | Parse JSON-LD, external validation manual |
| Mobile a11y failures | homepage | Accessibility | Medium | Lighthouse 91: contrast, heading order, inline link distinction | Target measured selectors, preserve visual system | Low | Lighthouse + 360px audit |
| Remote preview image payload | product-scenes/client-demo | Performance | Medium | Mobile lab total transfer 2,415,084 bytes; direct full-size remote media | Responsive Next image with explicit host allowlist, lazy below fold | Medium | Comparable Lighthouse/resource measurements |
| Analytics scroll marks not reset on navigation | components/analytics.tsx | Conversion | Medium | seen Set belongs to mount-only effect | Reset listener state per pathname | Low | Inspect navigation behavior |
| No automated rendered SEO audit | web scripts | Regression | Medium | Existing responsive audit only | Dependency-free rendered crawl plus content/schema checks | Medium | Run against production build |
| No field CWV or webmaster evidence | external accounts | Observability | Medium | No Search Console/Bing/CrUX access provided | Document exact manual checks | Low | Owner verification required |

## What already works

Server-rendered primary copy and native FAQ disclosures; per-page canonical tags; self-hosted next/font; OG PNG exists; permanent legacy redirects; no fabricated aggregate rating. Homepage production HTTP response contains real content and is prerendered. API data is limited to blog/forms/analytics; product demos use demonstration data, not private client content.

## Live inspection

Read-only curl: HTTP apex -> HTTPS apex (308) -> HTTPS www (308) -> 200. HTTPS apex -> www is one hop. Vercel HIT, x-nextjs-prerender=1. Production HTML 229,091 uncompressed bytes. Live robots sitemap points to www. No DNS or account settings modified. HTTP two-hop chain is deployment-owned; follow up in Vercel after approval.

## References

- https://nextjs.org/docs/app/api-reference/functions/generate-metadata (also installed version docs read)
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/ai-features
- https://schema.org/BlogPosting

No rankings, rich results, field performance or business lift claimed.
