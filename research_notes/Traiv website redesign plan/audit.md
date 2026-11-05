# Traiv website audit and implementation strategy

## What should change in the current website?

### Takeaway
The redesign should move from a dark, price-led essay to a light, product-led explanation of the real trainer/client workflow. Significant visual and factual cleanup is needed, not just adding stock imagery.

### Cited Findings
- Local source `apps/web/src/app/page.tsx` has section order Hero, Sunday, PriceWall, Promises, Included, Testimonials, Pricing, FAQ, Close. It already includes one HTML mockup (`hero-dashboard.tsx`), but it is an invented charcoal dashboard, including different navigation labels and placeholder people, rather than a faithful current trainer screen. Source: local files.
- Root `apps/web/src/app/layout.tsx` forces `className=dark`, uses Inter body and Bricolage headlines, dark Toaster. Product premium theme has primary #2459b8, navy #182b49, off-white backgrounds; supplied logo navy is #182D4B. Source: local layout, `packages/ui/src/styles/premium-theme.css`, supplied SVG.
- `apps/web/src/content/testimonials.ts` explicitly states every quote/name/number is invented and TESTIMONIALS_ARE_PLACEHOLDER=true. Homepage renders them unconditionally. Remove the entire public testimonial block until permissioned genuine quotes exist. Source: local files.
- Existing site description/headline includes payments; features content promises WhatsApp delivery, Indian household units and other workflows. Conversation implementation record says billing/automations/community/leads are not complete; native health/push scaffolding is not device-validated. Do a public-claim inventory before retaining any of these. Source: local content/site.ts, content/features.ts and supplied implementation context.
- Existing metadata has base/site title/description/OG locale/Twitter card but no default OG image here; JSON-LD already has Organization, WebSite, SoftwareApplication. Sitemap dynamically uses new Date() for every URL, even when content unchanged; replace with meaningful modification dates. Source: local layout.tsx, sitemap.ts, structured-data.tsx.

### Inferences
- Strong homepage structure: (1) clear category + outcome hero, two CTAs; (2) real trainer workspace + paired client phone; (3) short workflow strip assign → client logs → coach reviews; (4) workout builder with set rows and client workout screen; (5) nutrition meal-plan builder with recipe/food images; (6) weekly check-in with ratings, measurements/photos; (7) client app Today/Food/Workouts/Profile views; (8) supporting chat/vault/PDF export mosaic; (9) concise confirmed pricing; (10) useful FAQ; (11) demo/signup close.
- Put pricing after product evidence; move competitor surcharge table/promises to pricing/comparison page. Don't lead every section with pain or guarantees.
- Use read-only server-rendered demo components faithful to app: trainer sidebar/tab names, actual card shapes, Traiv colors/fonts, real controls as inert visuals (not fake functioning app), sanitized demo names/data. Caption these as example screens. Use licensed/local recipe and exercise images where available, no customer photos. Screenshot if accurate layout reuse is harder; real screenshots with synthetic demo data are preferable to approximate UI.
- At mobile sizes, choose cropped focused views and larger labels rather than scaling a full desktop dashboard into illegibility. Keep useful explanatory text/captions outside purely decorative UI.
- Phase order: approve homepage/story/style/claims → implement shared marketing theme/nav/footer + homepage visual components → pricing/features and high-intent feature details → coaches/demo/about → truthful comparisons/blog/tools. Preserve existing URLs; redirects only if required. Legal must not silently become published legal policy.

### Gaps
- Pricing/trial launch policy needs source-of-truth confirmation: site says ₹999 unlimited and free one client, but public marketing shouldn't imply paid billing exists when it does not.
- No rendered browser audit performed here; this is source inspection. Product UI details come from existing code and supplied screenshots, not new live app capture.

## How should server rendering and search readiness work?

### Takeaway
Deliver all main text, links, visuals, FAQs and structured data in initial HTML using Next Server Components, ideally pre-rendered and cached. Keep JavaScript optional and narrow; request-time SSR for a static brochure is unnecessary.

### Cited Findings
- Next defaults pages/layouts to Server Components; interactive state/events/browser APIs need Client Components. Their initial HTML can still be prerendered, so a client island does not make the whole page client rendered. Keep client boundaries small. [Next official docs](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- Google treats AEO/GEO work for Google AI search as SEO; original helpful information, crawlability and high-quality relevant images/video matter. Avoid creating a separate page for every query variant to manipulate AI visibility. [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- No extra AI-specific files or special schema are required for Google's AI features. Indexed/snippet-eligible content is foundational; structured data should match visible content; indexing/citations are not guaranteed. [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
- Google's current documentation changelog says FAQ rich results are no longer shown (May2026 removal). FAQ content still useful to people; don't promise a rich-result win from FAQPage schema. [Google documentation updates](https://developers.google.com/search/updates)
- Mass low-value pages primarily for ranking constitute scaled content abuse regardless of generation method. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

### Inferences
- Remove Reveal dependency for core visibility. Current CSS hides content when scripting-enabled until IntersectionObserver adds visible; JS failure can make readable content invisible despite server HTML. Prefer visible-by-default CSS effects, reduced-motion support, no scroll-jacked sections.
- If user wants literally zero client JS for marketing content: native details/summary, ordinary links, native scroll-snap, CSS hover; server form submission. Mobile menu and demo tabs can use progressively enhanced controls; optional hydration only if specifically approved, never for essential content.
- SEO plan: unique per-page title/description/canonical; one clear H1 and sensible headings; descriptive product-image alt text/captions/dimensions; optimized AVIF/WebP where raster and SVG for vector; above-fold LCP asset prioritized, below-fold lazy loaded; OG share image; crawlable internal feature links; production canonicals fixed to real domain; preview deployments noindex; 404/status correctness; meaningful sitemap lastmod; validate Organization/WebSite/SoftwareApplication and BreadcrumbList on detail pages. No invented ratings/review schema.
- GEO/AEO plan: concise statement of who Traiv is for and what it does, concrete original product walkthroughs, short direct question answers, visible accurate pricing and limits, consistent entity name/logo/company/contact/about facts, dates/source links for comparisons. These improve usability and eligibility; no guarantee of ranking or ChatGPT citations.
- pSEO foundation only now: one data/content model for feature pages, use-case pages and comparisons; route-level metadata and internal links. Later publish only distinct researched pages with unique visuals/examples. No city × trainer doorway grids or one-word substituted near duplicates.
- Suggested performance targets for implementation validation (not claims already achieved): mobile LCP≤2.5s, INP≤200ms, CLS≤0.1; measure screenshots at phone/tablet/desktop, no-JS main-content visibility, accessibility/keyboard and actual initial response HTML.

### Gaps
- SEO eligibility is not a promise of indexing, rank or inclusion in answer engines. Other AI crawler policies should be independently reviewed at implementation, not generalized from Google's guide.
