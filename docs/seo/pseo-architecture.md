# Programmatic content architecture

## Existing system

Marketing content lives in typed `content/features.ts`, `competitors.ts`, `tools.ts` and templates. Feature and comparison routes use generateStaticParams plus a reusable server page. Articles are authored in the admin app, stored in the database and exposed through public published-blog API endpoints; marketing fetches them with 60-second ISR. Do not create a second CMS.

## Implemented publication gates

`featureIsIndexable` requires a repository-verified capability, at least two explanatory sections, 200 characters of substantive body/section copy, a unique headline and no building status. These are minimum machine checks, not editorial approval. Routes remain available for visitors while failing pages receive noindex and are excluded from sitemap. Initial indexable examples: workout plans (`/features/plan-builder`), nutrition (`/features/nutrition`), check-ins (`/features/check-ins`), Today and client app. Vault and messaging currently need deeper useful copy; payment implementation requires verification before inclusion.

`comparisonIsIndexable` requires at least two non-null competitor claims, including Traiv claims, each with verified flag, public HTTPS source and checked date within 180 days. Comparison pages revalidate daily so an expired check can be removed from indexing. Sitemap and metadata share the same predicate. Editorial review must also verify qualitative assertions and Traiv claims; the predicate cannot prove truth. All five comparisons currently fail because not all Traiv and competitor claims have public evidence. No new competitive claims or generated comparison pages were published in this task.

## Adding content safely

1. Identify a distinct user question/search intent and a verified product workflow. Never clone a city/occupation page by changing a noun.
2. Record evidence (source file or public primary URL), reviewer and review date in the change description. Never use private customer data in previews.
3. Fill the typed record: unique slug, name/headline, description, substantive workflow sections, limitations and relevant links. Check existing records for overlapping intent.
4. Human reviews originality, factual accuracy, media rights and usefulness. Machine length checks are necessary but insufficient.
5. Add an evidence-backed capability to the verified list only when implemented. The shared gate controls metadata and sitemap together.
6. Run production build and `audit:seo`. Verify breadcrumb, one h1, canonical/social URL and useful server HTML. Test 360px and keyboard.
7. Re-review pricing/comparisons at least monthly; do not manufacture lastModified dates at build time. Current blog API exposes publication time only, so sitemap does not invent update times. Add editorial updatedAt through the API when a real update workflow is available.

## Expansion priorities

Improve existing workout/nutrition/check-in/vault pages before adding audience pages. A strength-coach page needs distinct progression/logging examples; a nutrition-coach page needs distinct meal planning/log review examples. No new alternative/city pages until evidence and editorial review exist. Existing calorie/macro and business calculators satisfy the initial free-tool set; no extra medical calculators were built.

## Scale

Reuse server templates, complete metadata builder, escaped schema component, real publication timestamps and shared sitemap eligibility. At larger scale, introduce a paginated sitemap index only when URL volume warrants it. Keep unpublished/private CMS content inaccessible at API level; noindex is not authentication. Do not expose private product routes or database records through a public sitemap.
