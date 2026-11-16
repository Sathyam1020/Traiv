# Free tools: Coachway parity plan

2026-11-16 · Branch `feat/free-tools-expansion` · Status: **Phases 0–4, 5a and 5b implemented: 95 tools live plus templates. Next: Phase 5c (generators), 5d (platform-cost tools).**

Research files, kept next to this one:
- `research/inventory.md`: all 109 tools by category, with every input, default, option,
  FAQ count, prompt block and word count
- `research/coachway-tool-specs.json`: the same data in machine-readable form; the build reads it
  per tool

---

## 1. Decisions (founder, 2026-11-15)

| # | Question | Answer |
|---|---|---|
| 1 | Principle §8 ("nothing because a competitor has it") | Overridden for marketing tools. Build all 109. Recorded as ADR 0036 in Phase 0. |
| 2 | Localisation | **Coachway's defaults exactly.** Same units (imperial-first where they are), same sample values, same currency default (EUR, with USD/GBP). No India-specific tools or examples. Change: **every money tool gets a currency switch**, including the ones where Coachway has none, and the list also includes INR. |
| 3 | Author byline | **Off for now, but wired.** An empty `TOOL_AUTHOR` in `content/site.ts`. When it is filled, every tool page renders the byline and adds `author` to the Article schema automatically. The hook is documented in `.ai/state/current.md` so the next agent finds it. |
| 4 | ChatGPT prompt block and "Researching with AI?" links | Included, on the same tools where Coachway has them (27 and 17). |
| 5 | Recipe macro calculator | Same as Coachway: a manual ingredient table (name, grams, protein/carbs/fat per 100 g), four sample rows pre-filled, add/remove rows, servings, and a whole / per serving / per 100 g switch. **No food database.** (My earlier note was wrong.) |
| 6 | Competitor-price tools | Build like Coachway: the same platforms and the same currency filter. Each price is checked against the vendor's own pricing page and stored with a checked-date, as `content/competitors.ts` already does. |
| 7 | Medical-adjacent tools | Build like Coachway: GLP-1 planner, scope-of-practice, injury swap, cycle phase. Disclaimers go wherever Coachway has them. |
| 8 | AI crawlers | Allow everything: `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. |
| 9 | Demo button | Shown on the same 70 tools as Coachway, plus the hub, next to the trial button in the closing band. It opens the **Cal.com booking page** `https://cal.com/sathyamsahu` in a new tab. The URL lives in `SITE.demoUrl` (`content/site.ts`), and if it is empty the button doesn't render. The placeholder `/demo` page redirects to the same URL, so nothing points at a fake page. |
| 10 | Order | Any. Nutrition first. |
| 11 | Scope is final | All 109 tools plus templates (110 pages), all phases completed before full launch. No MVP and no placeholders. |
| 12 | Content depth | Unchanged: long-form at the depth the research shows (median ~2,700 words, range ~1,800–4,600), FAQ counts per tool, worked examples, sources. All of it original and specific to the tool. No filler repeated across pages. |
| 13 | Contextual CTAs | **Yes.** The CTA under each result and the product pitch follow on from what the tool just calculated. They come from a reusable mapping (§4.1), and the wording is written per tool. They never promise a feature that `.ai/state/current.md` doesn't confirm exists. |
| 14 | Moving results into the app | **Deferred.** Not in this effort; reasons in §4.1. Revisit once tool-level signup data shows which tools are worth it. |
| 15 | Currency switch | Changes the **symbol and number format only**, with no exchange-rate conversion. All money inputs are the user's own, so conversion would need a live rate source (a new external dependency) for no gain. |
| 16 | Analytics | Our cookieless first-party analytics only (ADR 0021). Event design in §4.2. |
| 17 | Search growth | New **Phase 7**: keyword research (runs before Phase 1 copy), backlinks and distribution, and optional embeddable widgets. §5.1. |

### What "exactly like Coachway" covers, and the one thing it doesn't

**Matched 1:1, per tool:** URL slug · tool kind · every input, its type, range, step and
**default value** · every toggle and its default · dropdown options and default · sample rows ·
result layout (headline number, cards, tables, view switches, "next" links) · which page
sections exist and in what order · FAQ count · prompt block, AI-research links, demo button,
sources and disclaimer where they have them · title and meta lengths · schema types ·
hub grouping · related-tool cards · trial-link attribution per placement.

**Written by us:** every sentence a reader reads: headings, intros, explanations, worked
examples, FAQ questions and answers, ChatGPT prompts, CTA lines, and the message templates
the readers and generators output (hooks, captions, bios, outreach messages, objection
replies). That text belongs to Coachway, so copying or lightly rewording it is off the table.
It is also the only part Google would score as duplicate content. Calculations come from the
original published formulas.

---

## 2. Scope: 109 tools

| Group | Count | Kinds |
|---|---|---|
| Calories & nutrition | 28 | calculators |
| Strength & programming | 19 | calculators, plus workout plan builder (generator) and injury swap (reader) |
| Body composition | 11 | calculators |
| Heart rate & cardio | 11 | calculators, plus workout timer |
| Coaching business | 40 | 17 money calculators, 10 readers, 12 generators/builders |
| **Total** | **109** | 86 calculators · 12 generators · 10 readers · 1 timer |

The full per-tool list is in `research/inventory.md`.

### Our existing 4 tools
Their URLs are already indexed, so they shouldn't 404:

| Ours | → Coachway-equivalent slug | Action |
|---|---|---|
| `/tools/calorie-calculator` | `/tools/macro-calculator` | 308 redirect |
| `/tools/income-calculator` | `/tools/personal-trainer-income-calculator` | 308 redirect |
| `/tools/pricing-calculator` | `/tools/coaching-rate-calculator` | 308 redirect |
| `/tools/templates` | (no equivalent) | stays, listed on the hub under the business group |

That makes **110 tool pages**: 109 plus templates. The old components are deleted once the
redirects are live.

---

## 3. Research summary (what we are matching)

### Page anatomy
Every page has: eyebrow → H1 → intro → **tool above the fold** → result → "the short answer"
→ method section(s) → "how coaches use this" → product pitch → FAQ → "keep going" links →
"more free calculators" (6 cards) → closing CTA band.

On some pages only (driven per tool by the specs JSON):
- ChatGPT prompt block: 27 tools
- "Researching with AI?" links: 17
- Demo button in the closing band: 70
- Sources list: 11
- Disclaimer: health tools

Median 6 FAQs (range 4–13). Median ~2,700 words (range 1,800–4,600).

### SEO
- Titles are ~57 characters, `<Tool> - <benefit> (2026)` · meta descriptions ~155, starting "Free …"
- Schema on every page: `FAQPage`, `BreadcrumbList`, `WebPage` with `speakable`. On 95 pages:
  `WebApplication` (offer price 0) and `Article`. Site-wide: `Organization`. Hub:
  `CollectionPage` + `ItemList`.
- `robots: index, follow, max-snippet:-1, max-image-preview:large`
- robots.txt allows every crawler, AI crawlers included. llms.txt lists the tools hub.
- Each tool page links to ~12–14 other tools. The hub links all 109.
- Statically rendered, with no client JS except the tool itself.

### Funnel
- No email capture or gating anywhere. The trial is the only conversion.
- Trial links on each page: one "next →" under the result (`src=tools-<slug>-coach`) and one
  in the closing band (`src=tools-<slug>-band`); the hub has `src=tools-band`
- The product pitch matches the tool (a nutrition tool pitches the meal planner, a strength
  tool pitches the workout builder, a reader pitches the inbox)
- Their trial is card-first through Stripe. **Ours stays `SITE.app.signup`.** Our signup flow
  is out of scope here.
- Demo: their "Book a demo" is always the secondary button (58 tools link to `/sign-up/` and 15
  to `/book-a-demo/`, with some overlap). Ours goes to Cal.com (decision 9).

### Where we are already ahead or can be (no extra scope)
- Visible breadcrumbs (theirs exist only in schema)
- A per-tool OG image (theirs is one image for every page)
- No third-party trackers. Attribution runs on our cookieless analytics (ADR 0021).
  This requires fixing `CtaBand`, which ignores its `source` prop today
  (`apps/web/src/components/cta-band.tsx:3`).

---

## 4. Architecture

```
packages/calculators/               NEW workspace package, zero deps, pure functions
  src/{nutrition,strength,body,cardio,business}/<tool>.ts
  test/<tool>.scenario.test.ts      reference values from the source papers + edge inputs
  (BMR/TDEE re-use @traiv/nutrition so marketing and product agree)

apps/web/src/content/tools/
  registry.ts                       109 + templates: slug, group, kind, seo, sections flags
                                    (prompt/aiLinks/demo/sources/disclaimer), related,
                                    pitch target, faq, status
  copy/<slug>.ts                    our original long-form copy per tool
  currency.ts                       EUR default · USD · GBP · INR, formatting via Intl
  pitches.ts                        feature → { href, verified fact } for contextual CTAs (§4.1)

apps/web/src/app/tools/
  page.tsx                          hub: 5 groups, CollectionPage + ItemList
  [slug]/page.tsx                   one route, generateStaticParams from registry
  [slug]/opengraph-image.tsx        per-tool OG image (next/og, already available)

apps/web/src/components/tools/
  tool-page.tsx                     the anatomy above, sections switched by registry flags
  result-panel.tsx                  headline value, cards, tables, view switch, "next" links
  segmented.tsx                     the toggle pills used across ~all tools
  reader.tsx · generator.tsx · prompt-block.tsx · ai-research-links.tsx
  related-tools.tsx · tool-schema.tsx · byline.tsx (renders only if TOOL_AUTHOR is set)
  widgets/<slug>.tsx                interactive part, client component, one per tool
```

- **No new dependencies.** The workout timer uses the Web Audio API and the Wake Lock API.
- Existing pieces re-used: `tool-controls.tsx`, `CopyButton`, `FaqList`,
  `Breadcrumbs`/`JsonLd`, `TrialLink`, `pageMetadata`.
- The sitemap, hub, nav dropdown and llms.txt all read the registry. Nav keeps ~5 top picks
  plus "All free tools".
- Styling uses our design tokens and components, not Coachway's colours. Layout, density and
  control types match theirs. (CLAUDE.md: no invented colours or sizes.)

### 4.1 Contextual CTAs and attribution

**Mapping, not ~110 one-off CTAs.** Each registry entry has `pitch: PitchKey`, which points to
one of about 8 entries in `pitches.ts`: meal plans, recipes, client nutrition, workout
templates, check-ins, inbox, client roster, business. Each entry holds the link (a
`/features/*` page or signup) and the facts we are allowed to claim, each checked against
`.ai/state/current.md` before it is written. The CTA line itself sits in the tool's copy file,
so "Turn these macros into a meal plan for a client" reads as following on from that result.
A tool whose natural pitch is a feature we don't have (payments, for example) maps to the
nearest feature that is real.

**Placements unchanged:** a "next →" link under the result, the product pitch block, and the
closing band (trial + demo). Server-rendered text, so no cost to performance or SEO.

**Attribution on every trial link:**
`?utm_source=traiv-tools&utm_medium=tool&utm_campaign=<slug>&utm_content=<placement>`.
`state/current.md` records that signup already carries the UTM parameters through to the new
account, so every signup is attributed to a tool and a placement with no new machinery. The
same parameters go on the Cal.com link (exact parameter support to be confirmed against
Cal.com's current docs in Phase 0).

**Anonymous visitors:** tools stay fully open, with no gate and no email capture, as on
Coachway. Nothing needs to survive sign-in.

**Why results don't move into the app (decision 14):**
1. **It needs a product decision that hasn't been made.** Most results belong to a *client*
   (macro targets, a 1RM), and a coach who just signed up has none. Where the numbers would
   land is a requirement nobody has decided, and CLAUDE.md forbids inventing it.
2. **It crosses origins and auth.** The state would have to survive a jump from `apps/web` to
   the trainer app, then Google OAuth or email OTP, and then each kind of result would need its
   own import endpoint.
3. **It isn't proven to matter.** UTM attribution will show which tools produce signups. Moving
   results then becomes its own spec, for only the tools that earn it.

### 4.2 Analytics events

Sent through the existing `track()` (ADR 0021: raw rows, no cookies). Names follow
`.ai/engineering` event taxonomy conventions, checked in Phase 0.

| Event | When | Properties |
|---|---|---|
| page view | already collected | path identifies the tool |
| `tool_calculate` | a result is produced, **once per settled result** (debounced, not per keystroke) | `slug`, `group`, `kind` |
| `tool_result_action` | copy result / copy message / copy prompt / switch view | `slug`, `action` |
| `tool_cta_click` | any CTA | `slug`, `group`, `placement` (`next`/`pitch`/`band`), `target` (`trial`/`demo`/`feature`) |
| `tool_related_click` | a related-tool card or "keep going" link | `from`, `to` |

Signup attribution comes from the UTM parameters above. Paid-conversion attribution waits
until payments exist (ADR 0035). No new dashboard; the admin analytics screen can group by
`slug` and `group` later.

---

## 5. Phases

Each phase is one PR, verified at 360px and with the keyboard only, and updates
`state/current.md`.

| Phase | Ships | Notes |
|---|---|---|
| **0. Foundation** | ADR 0036; calculators package; registry; `[slug]` route; ToolPage with every section variant; result panel, segmented control, reader, generator, prompt block; schema + OG; currency module; author hook; CtaBand/TrialLink attribution fix + UTM params; `pitches.ts` contextual CTA mapping; `SITE.demoUrl` Cal.com button + `/demo` redirect; analytics events (§4.2); hub rebuilt into 5 groups; robots Content-Signal; sitemap/llms from registry; 3 redirects | Proven end to end with **TDEE + recipe macro** as the two reference tools |
| **7a. Keyword research** | runs **right after Phase 0, before Phase 1 copy** (see §5.1) | sets how deep each tool is written and the order tools are promoted |
| **1. Nutrition** | the other 26 | TDEE family shares one engine |
| **2. Strength** | 19 | one 1RM engine behind 1RM/bench/squat/deadlift/OHP; Wilks/DOTS/IPF GL/Sinclair coefficients from the federations' published tables |
| **3. Body composition** | 11 | Navy, Boer, Lee 2000, FFMI, BMI, Devine/Robinson/Miller/Hamwi |
| **4. Cardio** | 11 | workout timer is the only stateful widget |
| **5. Business** | 40 | 5a money calculators (all with the currency switch) · 5b readers · 5c generators · 5d platform-cost/tool-stack/fit-finder with sourced, dated prices |
| **6. Verification pass** | route + sitemap audit (all 110 accounted for), internal-link audit (≥12 tool links per page), title/meta length check, schema validation, CTA destination check, Lighthouse a11y/SEO/performance as a check (not the definition of done), Search Console + Bing Webmaster submission | |
| **7b/7c. Search growth** | backlinks and distribution; optional embeddable widgets | after launch; see §5.1 |
| **8. AI discoverability** | Bing + IndexNow, richer llms.txt, Markdown page versions, citable answers, AI-referral tracking | after launch; see §5.2 |

**The long pole is copy:** ~110 pages × ~2,700 words (~300,000 words) of original writing,
plus the message templates for 22 readers and generators. Code per phase is days. This
spans many sessions. I'll draft all of it. You review a phase's copy before it merges.

### 5.1 Phase 7: search growth

The plan so far makes the pages *eligible* to rank. Ranking at the top also needs the
right target searches, links from other sites, and time. Head terms like "TDEE calculator"
belong to sites with years of backlinks (calculator.net, Omni and similar), and Coachway
doesn't rank for them either.

**7a. Keyword research (before Phase 1 copy)**
- For all 109 tools: search volume, keyword difficulty, current top 10, and the related
  questions people ask. Via the DataForSEO skill if its extension is connected, otherwise
  Search Console and manual SERP checks.
- Sort each tool into a tier:
  - **Win now:** coach-focused, low difficulty (most business tools, e.g. "coaching package
    pricing calculator", "client churn rate calculator")
  - **Long-tail:** fitness tools reached through a qualifier ("macro calculator for coaches",
    "RPE to percentage chart")
  - **Long game:** head terms, 12+ months, dependent on backlinks
- Output: `research/keywords.md`, with the primary and secondary keywords per tool and the
  FAQ questions taken from real searches. That file then sets each page's title, H1,
  FAQ choice and depth. **Tools and scope don't change**; only emphasis and the order
  they are promoted.

**7b. Backlinks and distribution (after launch, ongoing)**
- Submit to Google Search Console and Bing Webmaster Tools, with IndexNow. Bing's index feeds
  ChatGPT search.
- Outreach for a place in coaching blogs, certification bodies' resource pages, and "best
  free tools for personal trainers" roundups
- Communities: answer real questions in r/personaltraining, r/fitness and coach groups, with a
  link to the right tool, not spam
- Launch listings: Product Hunt, SaaS and tool directories
- Track per tool in Search Console; the pages that are close to page 1 get written deeper
  and promoted harder

**7c. Embeddable widgets (approved 2026-11-15; own spec first)**
- An `<iframe>` or script embed of selected calculators for coaches' own sites, with a
  "Powered by Traiv" link. Each embed earns a backlink, which is how calculator sites grow.
- New scope with a security surface (embedding, framing headers, abuse), so it gets its
  own spec under `features/` before any code

**Expected timeline**

| When | Realistic outcome |
|---|---|
| 2–4 weeks after launch | Indexed; ranking for "Traiv + tool" searches |
| 3–6 months | Page 1 for many coach-focused business tools and long-tail searches |
| 6–12+ months | Competing for head terms, depending on backlinks |

No one can guarantee a #1 position. These are targets we track, not promises.

---

### 5.2 Phase 8: AI discoverability (answer engines)

Goal: make ChatGPT, Perplexity, Claude, Gemini and Google AI Overviews find, read and cite the
tool pages, so Traiv is recommended when people ask these assistants coaching and nutrition questions.

**Already in place (Phases 0 and 1):** FAQs rendered as plain HTML with no JavaScript needed,
`FAQPage` schema with the same text as the page, a "short answer" block marked `speakable`, a
`robots.txt` that allows AI crawlers (`Content-Signal: search=yes, ai-input=yes, ai-train=yes`), and
every tool listed in the sitemap and `llms.txt`.

**To do:**
- **Bing first.** ChatGPT search relies heavily on Bing's index. On launch day, verify the site in
  Bing Webmaster Tools, submit the sitemap, and add IndexNow so new and changed tool pages are
  pinged immediately rather than waiting for a crawl.
- **Richer `llms.txt`.** Add each tool's short answer and its FAQ questions, or link to an
  `llms-full.txt`, so assistants can read the answers without fetching every page.
- **Markdown versions.** Serve a plain-Markdown copy of each tool page (e.g. `/tools/<slug>.md`),
  generated from the same copy files, for agents that prefer Markdown.
- **Citable answers.** Check that each short answer and FAQ answer stands on its own (names the
  tool, gives the number or method, makes sense quoted out of context).
- **Entity clarity.** Organization schema with a consistent name, description and `sameAs` links,
  plus an About page that says plainly what Traiv is, so assistants describe it correctly.
- **Measure.** Track referral traffic from chatgpt.com, perplexity.ai, gemini.google.com and
  copilot in our own analytics, and spot-check monthly what each assistant says when asked about
  the tools' topics and about Traiv.
- **Mentions and links (overlaps with 7b).** Assistants favour sources cited elsewhere; outreach,
  directories and community answers feed this as much as markup does.

**Done when:** the site is verified in Bing with IndexNow running, `llms.txt` carries answers, Markdown
versions are served, and a monthly AI-referral and citation check is in place.

## 6. Per-tool definition of done
- [ ] Inputs, ranges, steps, defaults, toggles and options match `coachway-tool-specs.json`
- [ ] Result layout matches theirs (cards/tables/view switch/"next" links)
- [ ] Formula from the primary source and checked against it independently, with scenario
      tests (reference values, 0, extremes, unit switch, currency formatting)
- [ ] Health tools: limits stated, no unsupported medical claims, floors applied where a
      result could be unsafe (same doctrine as the existing macro calculator)
- [ ] Contextual CTA maps to a real feature; trial links carry UTM params; demo button
      present where the specs say, opening Cal.com
- [ ] Analytics events fire once per settled result and once per CTA click
- [ ] Section flags (prompt, AI links, demo, sources, disclaimer) match theirs
- [ ] FAQ count matches; every word original and passes `.ai/design/voice.md`
- [ ] Title ≤ 60 characters, meta ≤ 160, schema set, OG image, breadcrumbs, in sitemap
- [ ] Trial links carry `tools-<slug>-coach` / `tools-<slug>-band`
- [ ] Works at 360px, keyboard reachable, visible focus, results in `aria-live`

---

## 7. Open items (none block Phase 0)
- **Voice vs. "exact":** our voice guide bans exclamation marks, Title Case and some words.
  I'll follow our guide wherever it conflicts with Coachway's style (e.g. our H1s are sentence
  case). Tell me if you'd rather match their style instead.
- **Product pitch targets:** Coachway pitches its own features. Ours point to our
  `/features/*` pages through `pitches.ts` (§4.1). Where we don't have the feature (e.g.
  payments), the pitch goes to the nearest real feature, never to one we don't have.
- **Cal.com parameters:** confirm in Phase 0 which query parameters Cal.com records on a
  booking (UTM/metadata), from its current docs.
- **7c embeddable widgets:** approved (2026-11-15). Spec written under `features/` before any code.
- **Keyword data source:** DataForSEO if its extension is connected; otherwise manual SERP
  checks, which are slower and give no volume numbers.
