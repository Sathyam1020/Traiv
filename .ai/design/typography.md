# Typography

## The stack

**Inter**, which is cal.com's UI face (ADR 0015). Self-hosted by `next/font` at build
time, so there is no runtime request to Google and no swap flash. Weights 400/500/600
only — the system stack sits behind it so a failed load degrades to the OS font rather
than to Times.

```css
--font-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI",
             Helvetica, "Apple Color Emoji", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
```

Each app sets `--font-inter` on `<html>` from `next/font/google`. An app that forgets it
still renders correctly on the fallback.

**Display face:** cal.com pairs Inter with Cal Sans, their own brand typeface. We do not
ship another product's brand font — the tracking below is the substitute, and it is what
actually produces the look.

**Serif:** Notion's is Lyon Text, licensed from Commercial Type — not free. We do not
ship a serif until there's a real need. If one arises, the options are licensing Lyon or
using Source Serif 4 / Newsreader from Google Fonts. **TBD — not needed yet.**

## Scale

Restrained on purpose. cal.com and Notion both use very few sizes and it is why they
read as calm. Huge
headings are a listed slop pattern — the largest thing on a product screen is 24px.

```
type.display    24px / 1.25 / 600 / -0.02em    page title, used once per screen
type.heading    20px / 1.3  / 600 / -0.015em   section heading
type.subheading 16px / 1.4  / 600 / -0.01em    card or group title
type.body       16px / 1.5  / 400              default. Notion's body size.
type.body-sm    14px / 1.5  / 400              dense surfaces, table cells
type.label      14px / 1.4  / 500              form labels, buttons
type.caption    12px / 1.4  / 400              metadata, helper text
type.mono       13px / 1.5  / 400              numbers in tables, ids
```

That's eight. Do not add a ninth without an ADR.

## Marketing scale — public surfaces only

```
type.hero       44px / 1.08 / 600 / -0.03em    landing and auth headlines
type.hero-sm    32px / 1.12 / 600 / -0.025em   the same, below lg
```

**Product UI stops at `type.display` (24px).** These two exist because a landing page and a
signed-out auth screen are selling, not operating — they get one large headline each. A
signed-in screen never does. Using `text-hero` inside the app is a review failure.

## Rules

1. **Weight does the work, not size.** Hierarchy comes from 400 → 500 → 600 and from
   `text.primary` → `text.secondary`. Reach for weight and colour before size.
2. **600 is the heaviest weight in the product.** No 700, no 800.
3. **Line-height 1.5 on body text.** This is a large part of the Notion feel.
4. **Uppercase only for small labels**, with `0.06em` tracking, at `caption` size,
   in `text.secondary`. Never for headings.
5. **Measure: 65–75 characters** for anything readable. Long-form never spans a wide container.
6. **Tabular numerals wherever digits align** — tables, set logs, weights, money.
   `font-variant-numeric: tabular-nums`.
7. **Never centre body text.** Centring is for a single short empty-state line, nothing else.

## Tracking

Display sizes carry negative tracking. This is what reads as Cal Sans without shipping it:

```
text-heading   -0.02em
text-display   -0.03em
text-hero      -0.04em
text-hero-sm   -0.04em
```

Body and below take no tracking adjustment. It is set on the type token in `globals.css`,
never per component.
