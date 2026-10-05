# 0015 — cal.com as the visual direction
2026-10-06 · Status: accepted · **Supersedes the palette in ADR 0006**

## Context

ADR 0006 set the direction as Notion's structure with youform.com's palette — warm paper
`#F6F5F0`, forest `#294B3E`, and yellow `#F6CE69` as the action colour. That shipped and
worked, but the founder asked for a cal.com/Notion replica instead, and on review the two
references disagree in ways that matter:

| | cal.com | Notion |
|---|---|---|
| neutrals | pure, no warmth | warm, `#37352F` ink |
| action | near-black | blue `#097FE8` |
| face | Inter + Cal Sans | system stack |
| radius | 8 / 12 / 16 | 4 / 8 / 12 |

Both share the part that matters: neutral-led, typography carries hierarchy, hairline
borders, no decorative colour. They differ on warmth, radius and accent, so "both" is not
a direction — one had to be chosen.

## Decision

**cal.com, replicated.** Pure neutral ramp, near-black primary action, Inter, 8/12/16
radius ladder. Founder's choice, 2026-10-06, after seeing both palettes side by side.

**The yellow is gone.** This is the substantive change. cal.com has no brand hue —
`#3B82F6` appears so rarely in their marketing that it reads as accidental — and a replica
that keeps a yellow primary button is not a replica. Emphasis now comes from weight, size
and whitespace.

**A `contrast` surface was added**, dark in both themes with its own fixed foreground. The
action colour inverts between themes (ink on light, white on dark) so the primary button
holds its weight either way, which makes it wrong for a decorative dark panel — reusing it
there turns the auth aside into a white slab in dark mode. That is the same class of bug
as the white-on-yellow one this project already shipped once.

**Cal Sans is not shipped.** It is cal.com's brand typeface, and taking another product's
brand font is a step past replicating a style. Negative tracking on Inter at display sizes
(-0.02 to -0.04em) is the substitute and is what actually produces the look.

## Consequences

- Traiv has no colour of its own. The product reads as competent and neutral; it does not
  read as *Traiv* at a glance. If a brand identity is wanted later it has to arrive
  somewhere other than the primary button — a mark, an illustration style, a photo
  treatment.
- Changing the three primitives was enough to repaint the product, because components
  reference the semantic tier only. That is what the three-tier system was for, and this
  is the first time it has been proven.
- `brand-text` was forest and is now ink, so what used to be a green tick or a green label
  is now simply dark. Nothing is wrong, but nothing is coloured either — worth looking at
  whether those spots still read as interactive.
- Radii dropped: cards 16→12, panels 24→16. The UI reads slightly tighter.
- Inter is a real font load. `next/font` self-hosts it, so the cost is bundle size rather
  than a request to Google, and the system stack still sits behind it.

## Alternatives considered

**Notion replica.** Warm `#37352F` ink, blue accent, system font, 4px radii. Closer to
where the product already was and cheaper to adopt, but the founder preferred cal.com's
colder, more product-like feel.

**Notion base, keep the yellow.** Would have preserved the one distinctive thing about the
UI. Rejected by the founder in favour of a true replica.

**Keep ADR 0006 as-is.** The palette was coherent and already shipped. Rejected: the
founder judged it the wrong feel for the product, and that is their call to make.
