# Discoverability and acquisition strategy

## Positioning and useful search intent

Traiv is fitness coaching software for personal trainers and gyms. Keep global product positioning; INR pricing is a published commercial fact, not a geographic restriction. Priorities below are intent hypotheses, not measured search volumes:

| Intent | Existing destination | Next useful evidence/content |
|---|---|---|
| workout builder for personal trainers | /features/plan-builder | Sets/reps/rest workflow, template reuse and PDF example |
| nutrition coaching software | /features/nutrition | Portions, targets and food-log review walkthrough |
| fitness check-in software | /features/check-ins | Actual check-in questions, measurement history and trainer review |
| coaching app for clients | /features/client-app | Browser/home-screen behavior and real demo limitations |
| personal trainer software pricing | /pricing | Exact ₹999/₹2,499 plans, trial and trainer limits |
| coaching business templates | /tools/templates | Editable original examples and context for when to use them |

The homepage now gives a direct definition of Traiv in the existing FAQ, with FAQ schema generated from exactly the visible answers. Existing server copy, crawlable links, pricing and product demonstrations remain. Article and breadcrumb markup identify page context. No testimonials, usage statistics or company credentials were invented.

## AI discovery

Existing wildcard public access remains; no new training-crawler policy is imposed. Googlebot/Bingbot/OAI-SearchBot/ChatGPT-User/PerplexityBot are not disallowed by the marketing robots file. This is not proof that hosting firewall/bot defenses permit their real IP ranges; owner must inspect production logs/settings. Search crawling and training are separate purposes: OpenAI documents OAI-SearchBot for search and GPTBot for training. Review training policy separately, without weakening auth or assuming crawler user agents authenticate a request.

No llms.txt added: this site already has a small crawlable feature/navigation/sitemap structure rather than a large documentation corpus. It is optional documentation discovery, not an established ranking requirement. No special markup guarantees AI citations.

## Citation and authority work

Publish original walkthroughs with real product examples first. Then publish founder-reviewed onboarding/migration instructions that honestly distinguish manual rebuilding from automatic imports. Request permission for any future customer case study; record dates and measured outcomes. Keep comparison sources publicly checkable. Seek relevant partner/trainer associations and editorial mentions using real product evidence; do not buy links or fabricate reviews. Company legal identity, public contact and verified social profiles need owner confirmation before schema sameAs/contact fields are added.

## Internal links and conversion

Feature pages link related features and pricing; blog articles link related posts. New visible breadcrumbs connect detail pages to Home and their hub. Keep signup CTA obvious; reuse current trial-click instrumentation, no new analytics vendor. Scroll-depth markers now reset when the route changes. Signup completion/activation/payment conversion must be tracked inside their respective authenticated apps/backend, not guessed from a marketing click. Review referrer attribution (including AI search) only where available; some traffic has no identifiable referrer.

## Owner setup — no account changes performed

1. Open Google Search Console. Add a Domain property for traiv.fit (covers subdomains); copy its DNS TXT verification value and add it through your DNS provider after review. Alternatively verify the HTTPS www URL-prefix property. Do not commit verification credentials to source.
2. Select the verified property → Sitemaps → submit `https://www.traiv.fit/sitemap.xml` after deployment.
3. URL inspection: inspect homepage, pricing, one feature and one article; run Live test, check selected canonical/server HTML, then request indexing for representative pages.
4. Check Pages report for excluded/noindex vs intentional exclusions; Core Web Vitals for actual users. New sites may lack sufficient field data.
5. In Bing Webmaster Tools add/import the verified website, verify ownership and submit the same canonical sitemap. Inspect representative URLs and crawl errors.
6. IndexNow is not configured: needs host verification/key and a CMS publishing/deletion notification workflow. Revisit with permission if publishing frequency warrants it; it does not guarantee indexing.
7. Inspect existing cookieless marketing collection in admin and test one trial click and demo request. Do not add a duplicate analytics tag. API reachability and origin allowlist must work after backend deployment.
8. Weekly: impressions/clicks/CTR by landing page, qualified signup starts/completions, activation and paid conversion where genuinely implemented. Compare cohorts, not just traffic. No numeric lift forecast without a baseline.

## Primary documentation consulted

- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Google structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google robots guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Search Console setup](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- [OpenAI crawler purposes](https://developers.openai.com/api/docs/bots)
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [IndexNow protocol](https://www.indexnow.org/documentation)
- [Next metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)

External validator submissions, Search Console/Bing accounts and production field data were not available/changed in this task. Rankings, indexing and AI visibility are not guaranteed.
