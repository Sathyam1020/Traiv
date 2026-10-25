# 0022 — Featurebase as the visual direction
2026-10-24 · Status: accepted · **Supersedes ADR 0015's palette, radius and type scale**

## Context

ADR 0015 replicated cal.com: a pure neutral ramp, a near-black action, white pages, 24px
as the largest thing in the product. The founder asked for the whole product to be
redesigned against a Featurebase style reference (a dark "violet-lit support console"),
with Apple's Human Interface Guidelines as the craft and accessibility check, and
Featurebase's icon style in place of lucide.

The reference is a marketing site and is dark-only, so four parts of it collided with
recorded rules. The founder settled each one:

| Question | Decision |
|---|---|
| Featurebase is dark-only | **Dark is the default; light is kept** as the alternative a person picks |
| 48/36px headings vs "nothing above 24px in product" | **48/36 everywhere**, product included |
| What a coach's brand colour overrides | **The violet signal** — never the action |
| Bricolage Grotesque on the marketing site | **Kept** for marketing headlines; Inter everywhere else |
| Icons | **Hugeicons Stroke Rounded** (free); Featurebase's duotone is Pro-only |

## Decision

**Featurebase, replicated, dark by default.**

- **Surfaces** step up from Void `#050608` (page) → Ink `#0a0b0f` (wells) → Charcoal
  `#0f1219` (panels, cards) → Steel `#151822` (raised controls, popovers), divided by Slate
  Edge `#1f1e2a` hairlines.
- **The action is white**, `rgb(255 255 255 / .92)` with Charcoal text, inverting to a
  Charcoal fill on light. It is never a colour.
- **Violet `#7064f2` is the one hue, and it is a signal**: selected nav icons, active tab
  underlines, checkboxes/switches/radios, counts on the active tab, the glow around a
  product frame. A new semantic group, `signal` / `signal-text` / `signal-subtle`, carries
  it. It is never a fill behind text.
- **Type** is Featurebase's: headings at weight 500, display 48 / section 36 (fluid down
  to 32 / 28 on a phone), an 18px/600 feature title, a 23px lead, a 13px caption floor.
- **Radius** 12 for controls, 16 for every card and panel.
- **Shadows** are Featurebase's black stacks (`inset`, `float`, `raised`) plus one violet
  `glow` reserved for a product frame.
- **The shell** is Featurebase's product workspace: the rail on the Void ground, the
  working panel a lit Charcoal frame rising out of it.

## Consequences

- **Traiv has a colour now.** ADR 0015 noted the product did not read as Traiv at a
  glance. Violet does that job, in a handful of places, without touching the action.
- **Coach branding is safer than before.** A coach's colour used to fill every primary
  button; now it can only reach selected states and the glow. A bad brand colour can no
  longer make the main action unreadable.
- **Contrast, computed:** Frost text 14.3:1, Misted Slate 9.5:1 and Quiet Slate 6.2:1 on
  Charcoal; the white button's text 15.9:1. Violet as *text* would be 4.28:1 on Charcoal,
  so text uses `violet-light` `#9182f8` (6.0:1) on dark and `violet-deep` `#5b4fd9`
  (5.9:1) on light. White on a violet fill is 4.38:1, which is why violet is never a fill
  behind words.
- **Known trade-off — control borders.** Slate Edge is 1.14:1 against Charcoal, far below
  the 3:1 WCAG 1.4.11 asks of a control boundary. Featurebase uses it anyway. We keep it
  for dividers, and outline inputs and outline buttons with `slate-edge-strong`
  `#33374a` (≈1.7:1) on an Ink fill, so a field is told apart by fill and border together.
  This still does not reach 3:1; it is the price of the look and is written down here so
  it is a choice, not an accident. Revisit if an accessibility audit flags it.
- **Three values were derived rather than taken from the reference**: `slate-edge-strong`,
  the light-theme slate ramp, and the two violet text tints. Each exists because a
  Featurebase value failed a contrast check.
- **The OS appearance setting is no longer consulted.** Dark is the product's own
  appearance; Apple's HIG prefers following the system, and we diverge on purpose. The
  theme toggle remains.
- **48px titles in product.** Page titles grew from 24 to 48 and flow headings from 20 to
  36. Pages that tucked a small title under the panel edge with `py-2` needed their
  padding back.
- **Icons:** one module, `@traiv/ui/icons`, is the only importer of Hugeicons. Moving to the
  Pro duotone style is a change to its imports and nothing else.

## Alternatives considered

**Featurebase dark-only.** Truest to the reference, one palette to maintain. Rejected:
clients read their plan on a phone in daylight, and light costs little to keep because
components already read semantic tokens.

**48/36 on marketing only, product stays at 24.** Recommended, and rejected by the
founder in favour of the reference's scale throughout.

**Hugeicons Pro duotone.** The exact Featurebase look; needs a paid licence. Deferred.
