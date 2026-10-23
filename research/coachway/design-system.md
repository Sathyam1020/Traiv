# Coachway — design system

Computed from the live app at `/clients`, 1440px, light theme.
**[V]** read from `getComputedStyle` / stylesheet rules · **[I]** inferred · **[U]** unknown

## Typography

**[V]** `body { font-family: "DM Sans", system-ui, -apple-system, sans-serif }`
**[V]** Body 16px; buttons and inputs **14px / weight 400**.
**[V]** No `--font-*` custom properties — the family is set directly.

**[I]** One family throughout, no display face. Traiv pairs a display face with Inter on
the marketing site and keeps Inter for product UI, which is a more considered split.

## Colour tokens

**[V]** 44 custom properties on `:root`. The ones that carry meaning:

| Token | Value | Role |
|---|---|---|
| `--background` | `#fff` | page |
| `--primary` | **`#33755b`** | primary action — a muted green |
| `--primary-foreground` | `#fff` | |
| `--primary-hover` | `#1c6940` | |
| `--primary-fog` | `#e4e7d5` | **[I]** tint of primary |
| `--secondary` | **`#0a1729`** | the dark navy sidebar |
| `--secondary-foreground` | `#fff` | |
| `--muted-foreground` | `#78716c` | secondary text |
| `--accent` | `#f7f6f2` | hover / subtle fill |
| `--accent-foreground` | `#18181b` | |
| `--accent-hover` | `#ebebeb` | |
| `--destructive` | `#fde8e8` | danger **background** |
| `--destructive-foreground` | `#ef4444` | danger **text** |
| `--border` | `#e6e4e0` | hairline |
| `--ring` | `#09090b` | focus ring |
| `--sidebar-primary` | `var(--primary)` | |
| `--sidebar-accent` | `#fff6` | translucent white on navy |
| `--sidebar-border` | `#17202c` | |
| `--sidebar-ring` | `#1d4fd7` | **[V]** a blue nowhere else in the palette |

**[V]** Token names are shadcn/ui's exact vocabulary — `--background`, `--primary`,
`--primary-foreground`, `--muted-foreground`, `--accent`, `--destructive`, `--border`,
`--ring`, plus the `--sidebar-*` block from shadcn's sidebar block.

**[I] Coachway is a shadcn/ui app.** Same component bones as Traiv. The visual difference
is entirely palette and radius, not component library — which means Traiv's shadcn
bridge in `globals.css` is already the right architecture to match anything here.

**[V]** `--destructive` is a *background* and `--destructive-foreground` the *text* —
inverted from shadcn's default, where destructive is a solid red fill. **[I]** Danger is
rendered as a soft tinted chip rather than a loud button.

## Where this differs from Traiv

**[V]** Traiv's `colors.md` opens: *"There is no brand colour. The primary action is
near-black."* Coachway has a brand colour — a green primary and a navy chrome.

**[I]** Neither is wrong. Coachway's green reads as a product identity; Traiv's near-black
reads as a tool and keeps every studio's own branding dominant, which matters more for a
white-label product where the coach's logo should be the only colour on screen.

**Do not adopt the green.** It would fight `brandColor` on `studio`.

## Shape and spacing

**[V]** `--radius: 0.6rem` (9.6px) — one radius token, not Traiv's three
(`control` / `surface` / `panel`).
**[V]** Measured: button radius **7.6px**, input radius **13.6px** — **[I]** derived from
`--radius` with offsets, same `calc(var(--radius) - 2px)` pattern shadcn uses.
**[V]** Button padding `8px`; input padding `4px 12px 4px 40px` (the 40px left is the
search icon well).
**[V]** Input border `1px solid rgb(228,228,231)`; body text `rgb(12,10,8)` — a warm
near-black, not pure.

**[I]** Traiv's three-tier token system (primitives → semantic → `@theme`) is more
structured than one `--radius` plus raw hexes on `:root`. No reason to simplify toward
Coachway here.

## Layout

**[V]** Fixed dark sidebar, white content area, full-bleed — **no inset panel**.
Traiv's shell puts the content on an inset light panel over a dark ground, which is a
deliberate difference and reads as more modern.
**[V]** Collapsible via a "Toggle Sidebar" control, as Traiv now does.
**[U]** Collapsed behaviour not captured — whether it narrows to icons or hides entirely.

## What is worth taking

1. **Nothing from the palette.** Traiv's no-brand-colour decision is better for
   white-label and is already recorded in `colors.md`.
2. **The confirmation that shadcn is the right base.** Both products are built on it;
   Traiv's token bridge means any layout here is reproducible.
3. **Soft destructive** (`#fde8e8` ground / `#ef4444` text) is a nicer default than a
   solid red fill for a destructive *chip*. Traiv already does something similar with
   `success-subtle`; a matching `danger-subtle` would be consistent.
