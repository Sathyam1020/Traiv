# Typography

## The stack

Notion's UI font is the **system stack**, which is why it feels native everywhere and
loads instantly. We match it exactly. No webfont for UI. No exceptions.

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
             "Apple Color Emoji", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
```

**Serif:** Notion's is Lyon Text, licensed from Commercial Type — not free. We do not
ship a serif until there's a real need. If one arises, the options are licensing Lyon or
using Source Serif 4 / Newsreader from Google Fonts. **TBD — not needed yet.**

## Scale

Restrained on purpose. Notion has very few sizes and it's why it reads as calm. Huge
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
