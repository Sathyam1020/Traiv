# Competitor intelligence

## Configuration

`seo_competitors` (`database-design.md`), admin-editable (master prompt requirement).
Seeded at Phase 3 with the five names the master prompt itself lists as initial
candidates (Trainerize, Everfit, TrueCoach, My PT Hub, Coachway) — the same five
`apps/web/src/content/competitors.ts` already carries for the existing `/compare/*`
pages, so this reuses, not duplicates, prior evidence-gathering.

## What this does and does not do

- Fetches **publicly accessible** pages only — their own marketing site, blog,
  pricing page. No login, no anti-bot bypass, no scraping behind an account wall —
  explicit master-prompt instruction, enforced by the crawler adapter refusing any
  response that required auth or defeated a bot challenge (treated as "could not
  observe," not retried harder).
- Respects `robots.txt` and rate limits on every fetch, same posture as the existing
  marketing-site crawl scripts (`apps/web/scripts/seo-audit.mjs`) already take toward
  Traiv's *own* site.
- Records only what was actually observed: source URL, observation timestamp, the
  extracted topic/structure — never a traffic or ranking number unless a licensed
  provider supplied it (`seo_serp_snapshots`, not this table).
- **Never reproduces competitor content.** The content-generation pipeline is told
  "here is a topic and a described weakness," never given the competitor's own text
  to paraphrase — enforced by not passing raw competitor HTML/body text into any
  drafting prompt, only the structured gap record below.

## Gap record (master prompt §4, "Competitor gap output")

```ts
type CompetitorGap = {
  competitor: string;
  sourceUrl: string;
  topic: string;
  searchIntent: "informational" | "commercial" | "transactional" | "navigational" | "mixed";
  observedWeakness: string;   // what was actually found missing/thin/outdated
  interpretation: string;     // the model's reading of why it matters — kept separate
  trafficAngle: string;       // Traiv's proposed differentiated angle
  evidence: { url: string; observedAt: string }[];
  confidence: "low" | "medium" | "high";
  recommendedAction: string;
};
```

The split between `observedWeakness` (what a human could independently verify by
visiting the URL) and `interpretation` (the model's judgment call) is the master
prompt's own required distinction ("the system must distinguish an observed weakness
from an AI interpretation") — enforced as two separate, separately-labeled fields in
the admin UI, not folded into one paragraph.

## Monitoring cadence

A competitor's observations refresh on a configurable interval (default: weekly, admin
setting) — not on every daily cycle. Comparing today's crawl to the last stored one for
a "material content change" is a cheap deterministic diff (title/section/structure
changed) before anything is handed to an LLM for interpretation, so the expensive call
only runs when something actually changed.

## Explicitly deferred to real outcome data

Real differentiation ("where could Traiv's own content genuinely be better") needs
Traiv's content to exist and be measured first — this module's value compounds with
`performance-feedback.md`'s content-gap detection, not before it. Early cycles will
produce gap records with lower confidence scores; that's the honest state, not a bug.
