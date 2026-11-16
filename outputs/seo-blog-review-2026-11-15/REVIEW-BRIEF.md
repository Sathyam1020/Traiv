# Review brief — 10 AI-drafted blog posts for Traiv

You are reviewing blog drafts written by an automated pipeline (Gemini 3.5 Flash-Lite, free tier) for **Traiv** — white-label coaching software for independent coaches in India (personal trainers, online coaches, dietitians, yoga instructors, physiotherapists) and small gyms. **Coaches are the readers**, not their clients. None of these is published; a human publishes after review.

## Known issues already found (generator fixed after this batch — still review these articles)

Found on a manual spot-check after generation; new deterministic checks now block all of them, but these 10 drafts were made before the fix:

- **#2, #3, #6 are almost entirely lower case**, headings included — the model's revision pass returned them that way.
- **Citation stuffing:** #1 links one Coachway page 13 times; #2 links its two sources 8 and 12 times.
- **Second-hand competitor facts:** #2 (Everfit review) and #10 take Everfit's prices from *other competitors'* reviews of Everfit (Coachway, Trainerize), not from Everfit's own site. Treat every competitor price as unverified.
- **Weak topic:** #1 targets "kahunas branded app features" — Kahunas is not one of Traiv's tracked competitors; likely low value for an Indian audience.
- **#6 is thin** (≈415 words) for a broad query.

Please still score these; the point of the review is the patterns.

## Files
- `articles/NN-slug.md` — one per draft: why the topic was picked, the brief, the sources it was allowed to use, the automated check results, the article, and a promotion-kit summary.
- `drafts.json` — the same, complete and machine-readable (includes full image and video prompts).
- `traiv-product-facts.md` — the only permitted source for anything said about Traiv (features, prices).

## Rules the generator was given (check whether it obeyed them)
1. No invented statistics, studies, surveys, quotes, prices, customers, testimonials or case studies. A number appears only if it is in a listed source **and** is linked to it.
2. No first-person experience ("I've coached…", "our clients saw…").
3. Traiv is described only with what `traiv-product-facts.md` says.
4. Competitor pages are context; never copied; competitor facts must be attributed and linked.
5. Voice: plain, specific, second person, sentence case, no exclamation marks. Banned: powerful, seamless, effortless, unlock, elevate, supercharge, streamline, revolutionise, game-changing, empower, leverage, delve, landscape, journey, next level, "in today's fast-paced", "it's important to note", "in conclusion".
6. Useful even to a reader who never buys software; Traiv at most ~3 mentions, only where it genuinely fits.
7. No medical claims.

## What the automated checks already guarantee (deterministic)
External links point only to fetched sources; internal links only to pages that exist; no unlinked statistics; Traiv prices match the site; banned words absent; heading levels valid; SEO title 20–60 and description 70–160 characters; no near-duplicate of an existing post.

## What they cannot judge — please focus here
For each article, score 1–5 and explain briefly:
- **Search intent** — does it actually answer the target query? (e.g. a "best X software" query that names no software fails)
- **Accuracy** — any claim not supported by its sources or by the product facts? Quote it.
- **Usefulness / information gain** — would a coach with 20–50 clients learn something specific, or is it generic?
- **Writing** — clarity, repetition, AI-sounding phrasing, filler.
- **Traiv mentions** — accurate, proportionate, not salesy?
- **SEO** — title, meta description, headings, internal links sensible for the query?
- **Verdict** — publish as is / publish after edits (list them) / reject (why).

Then summarise patterns across all 10 articles and the top 5 changes to the generator's instructions that would most improve the next batch.

## Index
| # | File | Target query | Words | Lane |
|---|---|---|---|---|
| 1 | `articles/01-kahunas-branded-app-features-and-cost.md` | kahunas branded app features | 683 | evergreen |
| 2 | `articles/02-everfit-review-pricing-features-costs.md` | everfit review | 786 | commercial |
| 3 | `articles/03-how-to-choose-online-personal-training-software-india.md` | online personal training software | 735 | evergreen |
| 4 | `articles/04-best-coaching-apps-for-online-coaches-evaluation-framework.md` | best coaching apps for online coaches | 839 | evergreen |
| 5 | `articles/05-how-to-choose-an-online-coaching-platform.md` | how to choose an online coaching platform | 852 | commercial |
| 6 | `articles/06-what-to-look-for-in-fitness-trainer-software.md` | fitness trainer software | 415 | evergreen |
| 7 | `articles/07-best-workout-builder-software-for-online-coaches.md` | best workout builder software for online coaches | 655 | commercial |
| 8 | `articles/08-personal-training-assessment-tools-and-tests.md` | personal training assessment tools | 944 | evergreen |
| 9 | `articles/09-bodybuilding-coaching-software-features.md` | bodybuilding coaching software | 749 | commercial |
| 10 | `articles/10-best-everfit-alternatives-for-fitness-coaches.md` | everfit alternatives | 672 | commercial |
