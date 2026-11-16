# 0037 — Indexing, sitemap and crawler rules for the marketing site
2026-11-16 · Status: accepted (founder approved the technical SEO plan) · Builds on ADR 0036

## Context

Before the free-tools launch we audited the marketing site against production. The basics
were already right: one 308 redirect from apex and http to `https://www.traiv.fit`,
absolute canonicals without query strings, previews noindexed with an empty sitemap, legal
drafts noindexed but crawlable, JSON-LD only for facts shown on the page. The gaps: no
`lastmod`, `priority` values Google ignores, an internal `/demo` link that redirects off
site, and SEO checks that only ran when someone remembered.

## Decision

1. **One `sitemap.xml`.** 132 URLs is far below the protocol's 50,000 URL / 50 MB limit.
   Split into a sitemap index (`generateSitemaps`) only when a content type has real pages
   and needs its own Search Console report, for example public trainer or gym sites. No
   empty category sitemaps.
2. **`lastmod` only where the date is real.** Tools use `TOOLS_UPDATED` in
   `content/tools/registry.ts`, the same value the page shows as "Updated" and the schema
   uses as `dateModified`; bump it with each copy review. Blog posts use `publishedAt`
   (the public API does not expose an update date). Every other URL has none. No
   `priority`, no `changefreq`.
3. **A page is in the sitemap only if the same predicate makes it indexable.** Features
   (`featureIsIndexable`) and comparisons (`comparisonIsIndexable`) already work this
   way. Every future content type (location pages, trainer or gym profiles, new feature
   pages) gets one predicate used by both its robots meta and the sitemap. It must require:
   published; core content in server HTML; an intent no other Traiv page already serves;
   unique copy beyond template text; formulas tested and claims sourced with a checked
   date; internal links in and out; a 200 that is not a soft 404. Eligibility is not a
   promise that Google indexes it.
4. **Crawler policy unchanged** (ADR 0036, decision 8): every crawler allowed, AI search,
   retrieval and training bots included, with `Content-Signal: search=yes, ai-input=yes,
   ai-train=yes`. Lighthouse reports the line as an unknown directive; robots parsers
   ignore unknown lines (RFC 9309), so it stays. robots.txt is not access control; the app
   lives on separate, authenticated subdomains.
5. **`/demo` is a redirect, never a page.** Internal links point straight at
   `SITE.demoUrl` in a new tab. `audit:seo` asserts the redirect, that `/demo` is not in
   the sitemap, that every `lastmod` parses and is not in the future, and that no
   `priority` is emitted.
6. **The checks run on every PR** (`.github/workflows/seo.yml`): build, `next start`, then
   `audit:seo`, `phase6-audit.py` and `phase8-audit.py` against localhost. No secrets and
   no production traffic; the blog API is unreachable there, so the build sees no posts.
   Production checks run by hand after a deploy (see `features/free-tools/research/`).
7. **Not used:** the Google Indexing API (job postings and livestreams only), sitemap
   pings (retired by Google and Bing), Atom, an image sitemap (two images in `public/`),
   HowTo markup (rich result retired). RSS waits until the blog has posts.

## Consequences

- A change that puts a noindex page in the sitemap, breaks a canonical or an internal
  link, or lets Markdown drift from the page fails the PR.
- `TOOLS_UPDATED` is one date for every tool page. Per-tool dates need a field in each
  copy file; worth doing once tools are reviewed on different days.
