# Colour

> **This file and `packages/ui/src/styles/globals.css` must always agree.** Changing one
> without the other is how a design system rots. If you touch a value, touch both in the
> same commit.

## The rule that keeps it from going beige

**Surfaces and borders are neutral. Only the text greys carry warmth.**

Notion's near-black `#37352F` is genuinely warm, and that warmth is the signature — it is
why the product reads calm instead of harsh. But if the page background, the wells and the
borders are *also* warm, every surface compounds and the whole screen reads beige-orange.

So: the page is pure white, surface greys are true neutral, borders are neutral black at
low opacity, and `#37352F` appears on text only.

## Tier 1 — primitives

Warm and paper-like. Ink is olive-tinged rather than neutral black — that is what makes
the surface feel like paper rather than a screen.

```
--paper             #F6F5F0   page
--white             #FFFFFF   cards
--sand-50           #F5F2EA   wells, footers, sidebars
--sand-100          #ECEADD
--line-warm         #DEDFD5   default border
--line-warm-strong  #CBCDC0   inputs, dividers that must read
--stone-400         #9A9D93   tertiary text
--muted             #676B61   secondary text
--ink               #252720   PRIMARY TEXT — olive near-black, never pure #000

--forest            #294B3E   links, focus, selected
--forest-600        #325A4A
--forest-tint       #E6EED9

--yellow            #F6CE69   THE ACTION COLOUR — primary buttons
--yellow-hover      #F3C24C
--yellow-tint       #FFF6D9

--peach             #F4D6BD
--lavender          #E8E3F1

dark
--dark-bg      #1B1A18     --dark-surface #302E2B    --dark-raised #3A3733
--dark-line    #48443E     --dark-muted   #BDB8AF    --dark-text   #F3F0EA

--red-500   #C0503C    --amber-500 #A97A2C    --green-500 #3F7A52
```

## Two naming rules you must not break

**1. Our brand colour lives under `brand-*`, never `accent-*`.**

shadcn/ui owns `--color-accent` and uses it to mean *hover fill* — a translucent black.
Our bridge maps it that way, and because the bridge is declared later in `globals.css`,
it silently wins over anything we put under the same name. Writing `bg-accent` expecting
the brand yellow gets you a grey hover tint instead, with no error.

```
bg-brand          the yellow fill        bg-accent   shadcn hover fill — not ours
text-brand-text   forest, for links      text-accent-foreground   shadcn's
bg-brand-subtle   the pale tint
text-brand-fg     ink, for text on yellow
```

**2. A surface that doesn't change with the theme needs text that doesn't either.**

The brand yellow is the same `#F6CE69` in light and dark — it is the action colour in both.
But `--fg` flips from ink to near-white. So putting `text-fg` on a yellow surface gives you
dark text in light mode and unreadable pale text in dark mode.

Anything sitting on `bg-brand` uses `text-brand-fg` (ink, both themes) and its opacity
variants — never `text-fg` or `text-fg-muted`. The same applies to any future surface
painted in a fixed colour.

```
bg-brand + text-brand-fg        ✅ readable in both themes
bg-brand + text-fg              ❌ white on yellow in dark mode
bg-brand + text-fg-muted        ❌ also fails contrast in light mode (3.4:1)
```

## The other unusual thing in this palette

**The action colour and the interactive-text colour are different.**

`--accent` is yellow and carries no text contrast, so it is only ever a *fill*: primary
buttons, with `--fg-on-accent` (ink) on top. Anything that is interactive *as text* —
links, selected items, focus rings — uses `--accent-text` (forest).

Yellow text on cream fails contrast at every size. If you find yourself writing
`text-brand`, you want `text-brand-text`.

And on a yellow ground, `--fg-muted` (`#676B61`) only reaches about 3.4:1. Use ink at
70–75% opacity for secondary text on the brand panel instead.

## Tier 2 — semantic

```
                     LIGHT              DARK
color.bg.page        paper              dark-bg
color.bg.surface     white              dark-surface
color.bg.sunken      sand-50            dark-raised
color.bg.hover       rgb(37 39 32/.045) rgb(255 255 255/.055)
color.bg.selected    forest-tint        rgb(41 75 62/.5)

color.text.primary   ink                dark-text
color.text.secondary muted              dark-muted
color.text.tertiary  stone-400          #8A857C

color.border.subtle  line-warm          dark-line
color.border.strong  line-warm-strong   #5A554D
color.border.focus   forest             yellow

brand                yellow             yellow
brand.hover          yellow-hover       yellow-hover
brand.subtle         yellow-tint        rgb(246 206 106/.16)
brand.fg             ink                ink
brand.text           forest             #9FC3A8
```

## Rules

1. **The page is warm paper** (`#F6F5F0`); cards are white on top of it. That contrast is what gives the layout depth without shadows.
2. **Borders are nearly invisible** — 8% neutral black. If a border is clearly visible, ask
   whether it should exist. Separation usually comes from space, not lines.
3. **Hover is a faint fill, never an outline.**
4. **Colour means something or it isn't there.** Yellow = the primary action. Forest =
   interactive text, focus, selected. Red, amber and green = state. Nothing is coloured
   for decoration.
5. **Semantic colour is not the accent.** Success green is not a brand colour.
6. **Never put text in `--brand`.** It is a fill colour only. Use `--brand-text`.
7. **Contrast floor 4.5:1** for body text, 3:1 for large text and UI boundaries.
   `text.tertiary` is for non-essential text only.
8. **Coach branding overrides `accent` only** — never text, surface or border, so a bad
   brand colour cannot make the client app unreadable.
