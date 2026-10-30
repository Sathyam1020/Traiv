# Colour

> **This file and `packages/ui/src/styles/globals.css` must always agree.** Changing one
> without the other is how a design system rots. If you touch a value, touch both in the
> same commit.

## The rule that holds this palette together

**The action is white. Violet is a signal. Everything else is slate.**

This is Featurebase's system (ADR 0022). The page is a near-black stage, panels are flat
charcoal layers divided by hairlines, and the one filled action on a screen is white with
charcoal text. Violet appears only where something is *selected* or where the product
itself is being shown — the active nav icon, the active tab's underline, a checked box,
the light around a product frame.

When something needs emphasis, the answer is weight, size or space. It is never a new
colour, and it is never more violet.

## Tier 1 — primitives

```
dark stage                                      light counterpart
--void          #050608  page canvas            --paper            #FFFFFF
--ink-surface   #0A0B0F  wells, inputs          --paper-sunken     #F6F7FA
--charcoal      #0F1219  panels, cards          --paper-selected   #F0F1F5
--steel         #151822  raised, popovers       --paper-line       #E4E6EE
--slate-edge    #1F1E2A  hairline dividers      --paper-line-strong #D3D6DF
--slate-edge-strong #33374A  control outlines   --slate-600        #5D6478
                                                --slate-500        #7A8095
--cloud         #FFFFFF
--cloud-soft    #F8F9FC  primary text (softened white)
--frost         #DEE1EA
--misted-slate  #B2B8CD  secondary text
--quiet-slate   #8F94A6  tertiary text

--violet        #7064F2  the signal — icons, fills without text, the glow
--violet-light  #9182F8  violet as text on dark   (6.0:1 on charcoal)
--violet-deep   #5B4FD9  violet as text on light  (5.9:1 on white)

--red-500 #EF4444   --amber-500 #F59E0B   --green-500 #10B981
--red-50  #FEF2F2   --amber-50  #FFFBEB   --green-50  #ECFDF5
```

`slate-edge-strong`, the light slate ramp and the two violet text tints are not in the
Featurebase reference. Each exists because a reference value failed a contrast check —
see ADR 0022.

## Three naming rules you must not break

**1. Our action colour lives under `brand-*`, never `accent-*`.**

shadcn/ui owns `--color-accent` and uses it to mean *hover fill*. Our bridge maps it that
way, and because the bridge is declared later in `globals.css` it silently wins. Writing
`bg-accent` expecting the action colour gets you a hover tint, with no error.

```
bg-brand          the white action fill    bg-accent   shadcn hover fill — not ours
text-brand-fg     charcoal, on that fill   text-accent-foreground   shadcn's
text-brand-text   primary text, for links
bg-signal         violet, never behind text
text-signal-text  violet as readable text
bg-signal-subtle  violet tint, for a selected chip with signal-text on it
```

**2. The action colour inverts between themes. A decorative dark panel must not use it.**

`--accent` is white on dark and **charcoal on light**, so the primary button keeps its
weight in both themes. That makes it wrong for anything meant to stay dark. Use
`bg-contrast` + `text-contrast-fg` for a surface that is dark in both themes — the app
rail and the auth aside.

```
bg-contrast + text-contrast-fg   ✅ dark in both themes
bg-brand    + text-brand-fg      ✅ the primary action, inverts as a pair
bg-signal   + text-white         ❌ 4.38:1 — violet is never behind words
bg-contrast + text-fg            ❌ dark-on-dark in light mode
```

**3. A surface that doesn't follow the theme needs text that doesn't either.**

## Tier 2 — semantic

```
                      DARK (default)          LIGHT
canvas                void                    paper
panel                 charcoal                paper               ← the app shell's frame
surface               steel                   paper               ← cards, one step above the panel
sunken                ink-surface             paper-sunken
raised                steel                   paper
hover                 rgb(255 255 255/.04)    rgb(15 18 25/.04)
selected              rgb(255 255 255/.06)    paper-selected

fg                    cloud-soft              charcoal
fg-muted              misted-slate            slate-600
fg-subtle             quiet-slate             slate-500

line                  slate-edge              paper-line
line-strong           slate-edge-strong       paper-line-strong   ← inputs, outline buttons
line-focus            violet-light            violet-deep

brand (action)        rgb(255 255 255/.92)    charcoal            ← inverts
brand.hover           cloud                   steel
brand.fg              charcoal                cloud               ← inverts with it
brand.text            cloud-soft              charcoal

signal                violet                  violet              ← coach brand overrides this
signal.text           violet-light            violet-deep
signal.subtle         violet/.16              violet/.10

contrast              void                    charcoal            ← dark in both
contrast.fg           cloud                   cloud
```

Two washes, used rarely: `bg-glow-violet` (light around a product frame) and
`bg-glow-lift` (slate haze rising behind a contained visual).

## Rules

1. **Dark is the default.** Every app renders `class="dark"` on `<html>`; light is the
   alternative a person picks with the theme toggle.
2. **Surfaces step up, they don't tint.** Page (Void) → panel (Charcoal) → card (Steel), with
   wells (Ink) sunk into a card. A card is one step above what it sits on, plus a Slate
   Edge hairline. `bg-panel` belongs to the app shell only.
3. **Dividers are Slate Edge.** Never a light grey or white line on a dark surface.
4. **Hover is a faint fill, never an outline.**
5. **The filled action is white.** No coloured filled buttons, ever.
6. **Violet means selected.** Body text, backgrounds and ordinary controls never carry it.
7. **Semantic colour is not an accent.** Red, amber and green mean state, nothing else.
8. **Contrast floor 4.5:1** for body text, 3:1 for large text. The one recorded exception
   is control borders — see ADR 0022.
9. **Coach branding overrides `signal` only** — never the action, text, surface or border.

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

## Nutrition macro icons (ADR 0028)

Protein/carbs/fat use semantic `macro-protein`, `macro-carbs`, `macro-fat` tokens.
Light: #F28A50 / #2C7A62 / #C49A26. Dark: #F5A373 / #74B89E / #E6C65C.
These distinguish nutrient identities in the ingredient table, matching the supplied
Coachway reference; they do not replace the app's action/signal colours.
