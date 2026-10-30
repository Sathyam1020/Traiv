# Typography

## Trainer font — 2026-10-30

The founder requested Coachway's font. Its live app computes to **DM Sans** for body,
buttons and table text. Trainer now loads DM Sans weights 400/500/600 via `next/font`
and sets `--font-app-sans`. Shared font tokens prefer that variable and otherwise retain
Inter. Colours, type sizes, layout and light/dark support are unchanged. See ADR 0027.

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

Featurebase's (ADR 0022). Headings are **weight 500** — the quiet weight is what keeps a
48px title composed rather than shouting.

```
type.caption     13px / 1.5  / 400–500           metadata, helper text. The floor.
type.body-sm     14px / 1.43 / 400               dense surfaces, table cells
type.label       14px / 1.43 / 500               nav, buttons, form labels
type.body        16px / 1.5  / 400               default
type.subheading  18px / 1.56 / 600               feature and card titles
type.lead        23px / 1.5  / 400–500           lead paragraphs, large numbers, OTP digits
type.heading     36px / 1.11 / 500 / -0.02em     section heading, a flow's h1   (28 on a phone)
type.display     48px / 1.2  / 500 / -0.02em     the page title, once per screen (32 on a phone)
```

`heading` and `display` are fluid (`clamp`) so a 360px phone gets a title that fits.
`hero` and `hero-sm` survive as aliases of `display` and `heading` for the marketing site —
one scale, not two.

**The 24px product cap from ADR 0006 is gone** — the founder chose Featurebase's scale
everywhere (ADR 0022). What still holds: one `display` per screen, and numbers use `lead`,
not a heading size.

**Marketing headlines** use `font-display`, which resolves to Bricolage Grotesque on
`apps/web` only and to Inter everywhere else.

## Rules

1. **Weight does the work, not size.** Hierarchy comes from 400 → 500 → 600 and from
   `text.primary` → `text.secondary`. Reach for weight and colour before size.
2. **Headings are 500. 600 is for compact titles** (`subheading`, a name in a row) and the
   header button. No 700, no 800.
3. **Line-height 1.5 on body text.** This is a large part of the Notion feel.
4. **Uppercase only for small labels**, with `0.06em` tracking, at `caption` size,
   in `text.secondary`. Never for headings.
5. **Measure: 65–75 characters** for anything readable. Long-form never spans a wide container.
6. **Tabular numerals wherever digits align** — tables, set logs, weights, money.
   `font-variant-numeric: tabular-nums`.
7. **Never centre body text.** Centring is for a single short empty-state line, nothing else.

## Tracking

Set on the token in `globals.css`, never per component — a `tracking-[-0.03em]` beside a
`text-heading` is a review failure.

```
text-heading   -0.02em   (-0.72px at 36)
text-display   -0.02em   (-0.96px at 48)
```

Body and below take no tracking adjustment.
