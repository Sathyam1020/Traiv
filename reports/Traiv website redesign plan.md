# Show Traiv through its real product

Traiv should use a light, visual website that shows the trainer portal and client app working together. The homepage should explain coaching through populated product screens, with short supporting copy and one consistent conversion path. Coachway and EliteTrainer provide useful examples of this approach, but the illustrations, branding and claims should come from Traiv. The existing dark theme, long pricing arguments and approximate dashboard should be replaced. This is an approval plan only; no application code has been changed.

## Competitors make the interface carry the explanation

Coachway uses a chaptered product recording, a populated client-app preview and detailed check-in examples. EliteTrainer introduces screen previews and then explains individual workflows through screenshots. Both make it possible to understand the product before reading an extensive feature list. Trainerize, FitBudd and Everfit reinforce the same pattern: clear audience positioning, tangible app views and a prominent trial or demo path. These observations are based on public page content rather than a rendered mobile visual audit. ([Coachway](https://coachway.io/), [EliteTrainer](https://elitetrainer.fit/), [Trainerize](https://www.trainerize.com/), [FitBudd](https://www.fitbudd.com/), [Everfit](https://everfit.io/))

For Traiv, the strongest story is **coach assigns → client logs → coach reviews**. Show each side of that exchange. Pricing remains easy to find, but follows product understanding; detailed competitor charges belong on pricing and comparison pages.

## Nine sections explain the actual coaching workflow

| Section | Message and product visual |
|---|---|
| 1. Hero | A clear category headline, such as “Your coaching. One connected workspace.” Short audience description, Book a demo and Explore the product links. Large trainer check-in view paired with a client Today screen. |
| 2. Workflow | Three concise steps: build a plan, client follows and logs, review progress. Three faithful screen details connect the steps. |
| 3. Workouts | Trainer session builder with exercise/set rows beside the client's workout logging screen. Show reusable templates and exercise demonstrations where available. |
| 4. Nutrition | Meal-plan builder, recipe photography and the client's meals/macros view. Demonstrate one assigned meal rather than listing every nutrition feature. |
| 5. Check-ins and progress | Client check-in submission paired with trainer ratings, measurements, charts and progress photos using fictional demonstration data. |
| 6. Client experience | Readable Today, Food, Workouts and Profile phone previews. On mobile, show focused views rather than a tiny desktop screenshot. |
| 7. Supporting tools | Compact visual panels for chat, shared vault resources and PDF exports. Each links to a useful feature page. |
| 8. Pricing and questions | Concise, verified launch pricing, direct answers about plans, client access and current limits. No invented testimonials or ratings. |
| 9. Final action | A simple invitation to see Traiv in a demo, with a matching product detail and clear next step. |

The design uses **Traiv blue #2459B8, navy #182D4B, off-white #F3F4F1 and white surfaces**, with the app's typography, card shapes and icon system. Reserve navy for occasional emphasis. Avoid stock gym imagery as a substitute for product explanation.

Use real screenshots with sanitized demo data or **read-only HTML/CSS recreations of the actual app sections**, sharing presentational primitives where practical. Do not invent another dashboard. Label examples clearly, keep annotations outside the screen, and use local licensed media. The main visuals should be visible immediately without requiring a carousel or interaction.

## Server-render the content and keep enhancement optional

Use Next Server Components with pre-rendering and caching for the marketing pages. Main text, links, product examples, FAQs and structured data arrive in the initial HTML; a static brochure does not need request-time rendering on every visit. Native disclosure controls and ordinary links can cover most interactions. Any small client island must remain optional to understanding the page. Remove the current visibility gating that waits for a JavaScript scroll observer. ([Next documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components))

Search work includes unique titles/descriptions, canonicals, semantic headings, descriptive image captions and alt text, optimized media, meaningful sitemap modification dates, production/preview indexing rules, social images and accurate Organization, WebSite, SoftwareApplication and breadcrumb data. Never publish fabricated review markup.

For GEO/AEO, provide direct answers, clear audience and product definitions, consistent company facts and original walkthroughs. Google requires no special AI schema or file; ordinary search eligibility and helpful original content remain foundational. **No implementation can guarantee rankings or answer-engine citations.** ([Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [AI search eligibility](https://developers.google.com/search/docs/appearance/ai-features))

Prepare reusable content models for future pSEO, but publish only distinct, useful feature/use-case/comparison pages. Avoid thin city or keyword permutations. ([Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies))

## Roll out the website after approving this direction

First establish the shared theme, navigation, footer and homepage. Then rework pricing, features and feature-detail pages; continue with coaches, demo and about; finally review comparisons, articles and tools. Preserve useful URLs and links. Before publishing, remove the current placeholder testimonials and verify every pricing, payments, integration and support claim against what is actually available.

Approval covers this design direction and section order. Implementation should begin with the homepage and shared components, followed by the remaining pages in that sequence.
