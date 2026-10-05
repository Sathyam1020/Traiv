# Spacing, radius, elevation, motion

## Spacing — 4pt base, 8pt rhythm

```
space.0    0
space.1    4px
space.2    8px
space.3    12px
space.4    16px     ← default gap between related elements
space.5    20px
space.6    24px     ← default gap between groups
space.8    32px
space.10   40px
space.12   48px     ← section separation
space.16   64px
```

Semantic aliases: `space.gutter` = 16px mobile / 24px desktop · `space.stack` = 16px ·
`space.section` = 48px · `space.inline` = 8px.

**Rules**
1. Layout with flex/grid + `gap`. Not per-element margins — they collapse and double.
2. Space groups things. If you're adding a border to separate, try more space first.
3. Nothing outside this scale. No `13px`, no `18px`.

## Radius

```
radius.none     0
radius.control  8px     ← buttons, inputs, menu items. The default.
radius.surface  16px    ← cards, dialogs, popovers
radius.panel    24px    ← full-height inset panels only
radius.full     9999px  ← avatars, and the mobile tab bar. Not "pills" as decoration.
```

Nothing is more rounded than `radius.surface` except an avatar and the mobile tab bar.
Radius still carries meaning — it marks a separate object — so it is spent by role, not
stamped on everything.

**The mobile tab bar is a capsule.** It is the one component that floats free of the
page on every screen, and the capsule is what reads as "floating control" rather than
"panel stuck to the bottom" — the iOS tab bar convention our users already know. A tab
bar at `radius.surface` with a squarer chip inside it reads as a segmented control.
Nothing else earns `radius.full` by being round; this earns it by floating.

**Note on the default border colour:** Tailwind v4 defaults `border-color` to
`currentColor`, so a bare `border` renders as text colour. `globals.css` resets it to
`--color-line` in a base layer. Do not remove that rule — every shadcn component depends
on it.

## Elevation

Shadow means "this is floating above the page". Nothing else gets one. A card sitting
in a list is not floating.

```
elevation.0   none                                       ← default for everything
elevation.1   0 1px 2px rgba(15,15,15,.06)               ← hover lift on a draggable
elevation.2   0 4px 12px rgba(15,15,15,.10)              ← dropdown, popover
elevation.3   0 12px 32px rgba(15,15,15,.14)             ← dialog, sheet
```

Dark mode uses the same geometry with a lighter border instead of a stronger shadow —
shadows barely read on dark grounds.

## Motion — Apple as the reference

Motion explains where something came from. It is never decoration.

```
duration.instant  100ms   hover, focus, colour change
duration.fast     160ms   dropdown, tooltip, small reveal
duration.base     240ms   dialog, sheet, page transition
duration.slow     360ms   large surface, onboarding step change

ease.standard    cubic-bezier(0.25, 0.1, 0.25, 1)
ease.out         cubic-bezier(0.16, 1, 0.3, 1)     ← entrances. Apple's decelerate.
ease.in          cubic-bezier(0.4, 0, 1, 1)        ← exits
ease.spring      spring(1, 90, 14, 0)              ← sheets, drag release
```

**Rules**
1. Animate `transform` and `opacity`. Nothing else — layout-triggering properties drop frames
   on the budget Android our clients use.
2. Entrances decelerate (`ease.out`), exits accelerate (`ease.in`).
3. Things enter from where they came from. A sheet rises from the bottom edge it's
   attached to; a dropdown expands from its trigger.
4. Nothing loops. Nothing bounces for attention. No scroll-triggered reveals.
5. `prefers-reduced-motion: reduce` → opacity only, 100ms, no transforms. Mandatory.
6. If you can't say what a motion communicates, delete it.
