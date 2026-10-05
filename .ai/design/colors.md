# Colour

> **This file and `packages/ui/src/styles/globals.css` must always agree.** Changing one
> without the other is how a design system rots. If you touch a value, touch both in the
> same commit.

## The rule that holds this palette together

**There is no brand colour. The primary action is near-black.**

This is a cal.com-style system (ADR 0015), and the defining choice is the absence of a
hue. Hierarchy comes from type weight, hairline borders and whitespace — not from colour.
A single near-black fill carries every primary action, and nothing else on the screen
competes with it.

So when something needs emphasis, the answer is weight, size or space. It is never a new
colour. Adding one is what makes a product look like a template.

## Tier 1 — primitives

A pure neutral ramp. No warmth anywhere, including the ink — `#111111`, not a tinted
near-black.

```
--white     #FFFFFF   page and cards
--grey-25   #F8F9FA   wells, sunken areas
--grey-50   #F5F5F5   content cards, selected rows
--grey-100  #F3F4F6   softest hairline
--grey-200  #E5E7EB   default border
--grey-400  #898989   tertiary text
--grey-500  #6B7280   secondary text
--grey-700  #374151   body text on dark-on-light blocks
--ink       #111111   PRIMARY TEXT and THE ACTION FILL
--ink-raised #242424  action hover

dark
--dark-bg     #0B0B0B   --dark-surface #101010   --dark-raised #1A1A1A
--dark-line   #262626   --dark-line-strong #333333
--dark-subtle #71717A   --dark-muted #A1A1AA     --dark-text #FAFAFA

--red-500 #EF4444   --amber-500 #F59E0B   --green-500 #10B981
--red-50  #FEF2F2   --amber-50  #FFFBEB   --green-50  #ECFDF5
```

Each semantic tint is the 50-step of its own family, so the pair stays in key.

## Three naming rules you must not break

**1. Our action colour lives under `brand-*`, never `accent-*`.**

shadcn/ui owns `--color-accent` and uses it to mean *hover fill*. Our bridge maps it that
way, and because the bridge is declared later in `globals.css` it silently wins. Writing
`bg-accent` expecting the action colour gets you a grey hover tint, with no error.

```
bg-brand          the near-black fill      bg-accent   shadcn hover fill — not ours
text-brand-fg     white, on that fill      text-accent-foreground   shadcn's
text-brand-text   ink, for links
bg-brand-subtle   grey-50
```

**2. The action colour inverts between themes. A decorative dark panel must not use it.**

`--accent` is ink on light and **white on dark**, so the primary button keeps its weight
in both themes. That makes it wrong for anything meant to stay dark: painting the auth
aside with `bg-brand` gives you a black panel in light mode and a glaring white slab in
dark.

Use `bg-contrast` + `text-contrast-fg` for a surface that is dark in both themes. It has
its own fixed foreground for exactly this reason.

```
bg-contrast + text-contrast-fg   ✅ dark panel, readable in both themes
bg-brand    + text-brand-fg      ✅ the primary action, inverts as a pair
bg-contrast + text-fg            ❌ dark-on-dark in light mode
bg-brand    + text-fg            ❌ breaks the moment the theme flips
```

**3. A surface that doesn't follow the theme needs text that doesn't either.**

The general form of rule 2. Any fixed-colour surface pairs with its own fixed foreground
token, never with `text-fg` or `text-fg-muted`.

## Tier 2 — semantic

```
                     LIGHT              DARK
color.bg.page        white              dark-bg
color.bg.surface     white              dark-surface
color.bg.sunken      grey-25            dark-raised
color.bg.hover       rgb(17 17 17/.04)  rgb(255 255 255/.06)
color.bg.selected    grey-50            dark-raised

color.text.primary   ink                dark-text
color.text.secondary grey-500           dark-muted
color.text.tertiary  grey-400           dark-subtle

color.border.subtle  grey-200           dark-line
color.border.strong  #D4D7DC            dark-line-strong
color.border.focus   ink                dark-text

brand                ink                dark-text      ← inverts
brand.hover          ink-raised         white
brand.subtle         grey-50            dark-raised
brand.fg             white              ink            ← inverts with it
brand.text           ink                dark-text

contrast             #101010            #1A1A1A        ← does NOT invert
contrast.fg          #FFFFFF            #FFFFFF
```

## Rules

1. **The page is pure white**, and cards are white on white separated by hairlines. Depth
   comes from borders and space, not from a tinted page.
2. **Borders are nearly invisible** — `#E5E7EB`. If a border reads clearly, ask whether it
   should exist. Separation usually comes from space.
3. **Hover is a faint fill, never an outline.**
4. **Colour means something or it isn't there.** Near-black = the primary action. Red,
   amber and green = state. Nothing is coloured for decoration, and there is no fifth hue.
5. **Semantic colour is not an accent.** Success green is not a brand colour.
6. **Links are ink**, distinguished by weight and underline rather than by hue.
7. **Contrast floor 4.5:1** for body text, 3:1 for large text and UI boundaries.
   `text.tertiary` is for non-essential text only.
8. **Coach branding overrides `brand` only** — never text, surface or border, so a bad
   brand colour cannot make the client app unreadable.

## The mark

`packages/ui/src/components/logo.tsx` — a T with downward tabs inside a rounded square,
built from four rounded rectangles on one radius over a 24-unit grid. No curves, so it
does not degrade at 16px where the favicon lives.

```
container  24x24, rx 5.4
crossbar   x 5.6  y 7   w 12.8  h 2.8   rx 1.4
tabs       x 5.6 / 15.6  y 7   w 2.8   h 5.4   rx 1.4
stem       x 10.6  y 7   w 2.8   h 10    rx 1.4
```

7 units of margin above and below the glyph, so it is optically centred rather than
mathematically centred.

Both colours are props, not tokens. The mark has to sit on a light surface, on
`bg-contrast`, and inside an OS app icon, and in the last case there is no theme to
follow — a mark whose palette moved with the theme would be the wrong colour exactly
where it is least fixable.

Stored as: `app/icon.svg` (Next turns this into the favicon), `packages/ui/src/assets/`
(`logo.svg` with the container, `logo-glyph.svg` as `currentColor` with none), and
`apps/trainer/public/logo.svg` for anything needing a URL.

`<Wordmark />` pairs the mark with the name as live text in Inter — never as paths, so it
stays selectable and does not ship a second copy of the typeface.
