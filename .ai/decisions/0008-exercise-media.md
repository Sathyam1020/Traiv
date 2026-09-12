# 0008 — Exercise media sourcing
2026-09-11 · Status: accepted

## Context
The product needs a few hundred demonstrated movements at launch. Two constraints rule out
most options: the client app is **white-label** (third-party branding in videos is
disqualifying) and **offline-first** (hot-link-only CDN delivery is disqualifying).

## Decision
Three phases.

1. **Taxonomy seed** — `free-exercise-db` JSON (Unlicense) for names, muscles, equipment.
   Metadata only; the images have murky upstream provenance. Normalise and deduplicate.
2. **Licensed media** — EDB Pro, $599 one-time. 1,394 exercises, self-hosted,
   platform-neutral commercial licence, no branding. Includes substitutions, progressions
   and regressions, which power "bad knee, swap this". Convert GIFs to silent WebM loops.
3. **Own footage from month 4** — shoot the top 150–250 movements. ~₹1,00,000 in India
   (videographer ~₹20,000/day, models ₹5,000–20,000/day). Replace licensed clips
   highest-frequency first.

Then v3: coach-uploaded exercise videos.

## Consequences
- ~₹53,000 one-time, no recurring media cost.
- Library ≈ 420MB as WebM. Hosted on Cloudflare R2 (zero egress) — matters at ₹846 net.
- Self-hosted media can be precached by the service worker, which is what makes basement
  gyms work.
- Coach-uploaded video in v3 turns the biggest content cost into the deepest switching cost.

## Alternatives
**MuscleWiki API** — rejected on both constraints: videos must be hot-linked (no offline,
no caching) and their embedded branding must be preserved (kills white-label).
**Stock (Envato, Storyblocks)** — rejected: exercise coverage is hopeless.
**AI-generated** — rejected: joint angles and rep mechanics come out subtly wrong, and
wrong form in a fitness app is a liability problem.
