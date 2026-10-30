# Components

## The order of operations — follow it every time

1. **Does shadcn/ui already provide it?** Use it. Do not reimplement.
2. **Does Traiv already wrap it?** Reuse that wrapper.
3. **Can it be composed from existing pieces?** Compose.
4. **Only now** consider a new component — and only with a real product requirement,
   not a hypothetical one.

Creating a component that duplicates a shadcn primitive is a review failure.

## shadcn/ui

The primitive layer. Installed per-component, lives in the repo, ours to modify.

**On adding a shadcn component:** re-style it to our tokens *at the moment of adding*.
shadcn ships with its own default palette and radii; leaving those in is how two competing
visual styles end up in one product. The component's hardcoded values get replaced with
semantic tokens before it's used anywhere.

## Layout — follows shadcn's monorepo convention

```
packages/ui/
  src/styles/globals.css    design tokens — the single source of truth
  src/components/           shadcn primitives: button, input, dialog…
  src/hooks/
apps/*/src/components/      Traiv compositions: ClientRosterRow, SetLogger…
```

Apps import primitives as `@traiv/ui/components/button` and the stylesheet as
`@traiv/ui/styles/globals.css`. `shadcn add` run from an app routes base components into
`packages/ui` and composed blocks into the app, driven by each workspace's
`components.json` aliases.

### Why the split is here and not elsewhere

**shadcn primitives are vendored dependencies, not abstractions we invented.** They belong
in a shared package from day one — five apps will all need the same Button, and more
importantly the *tokens* must live in exactly one place. Five copies of `globals.css` is
precisely the drift the three-tier token architecture exists to prevent.

**Traiv-authored compositions are a different matter.** A `ClientRosterRow` in the dense
desktop coach app and a `SetLogger` in the thumb-driven offline client PWA genuinely
should not be the same component. Those stay in their app.

Promote a Traiv composition to `packages/ui` only after the same thing exists in two apps
and has stopped changing. That rule applies to our components — never to the primitive layer.

### Tailwind scanning

`globals.css` carries `@source` directives for both `packages/ui/src` and `apps/`, because
Tailwind scans relative to the stylesheet. Without them, classes used only inside an app
get tree-shaken away.

## Status

Nothing built yet. As components are added, list them here with their location and purpose
so the next agent can find them instead of rebuilding them.

| Component | Location | Purpose |
|---|---|---|
| `Button` | `packages/ui/src/components/button.tsx` | shadcn primitive. Variants: default (the white action), outline, ghost, secondary, destructive, link. |
| `Badge` | `packages/ui/src/components/badge.tsx` | default is Featurebase's low-contrast pill; `signal` is the one violet badge, for a selected or live state. |
| icons | `packages/ui/src/icons.tsx` | every icon in the product. Import from `@traiv/ui/icons`, never from the icon library. |

## The shadcn token bridge

shadcn components reference their own variable names (`--color-primary`, `--color-border`,
`--radius-md`…). Rather than let a second palette into the product, those names are aliased
onto our semantic tier in an `@theme inline` block in `globals.css`.

The consequence: a shadcn component is on our tokens the moment it is added, with no
restyling pass. `bg-primary` compiles directly to `var(--accent)` — white at 92% in the dark theme.

**Two names to be careful with** — shadcn's `--accent` means *hover fill*, not our brand
accent; their `--primary` is the brand colour. The bridge maps them accordingly.

Adding a new shadcn component that needs a variable the bridge doesn't cover means adding
one alias, never adding a raw value.

## Current shadcn dependencies

`cn` (shadcn's own class-merge package — do **not** hand-write a `cn` util, that's the
duplication this section exists to prevent), `radix-ui`, `class-variance-authority`.

## Icons

Hugeicons Stroke Rounded (ADR 0022), through `@traiv/ui/icons` only. Each icon is a
component named for what a screen uses it for (`Check`, `ChevronDown`, `Loader`), sized
with a `size-*` class. Need one that is not there: find it in `@hugeicons/core-free-icons`,
import it from its own subpath (`@hugeicons/core-free-icons/Tick02Icon`, never the package
root — that re-exports twelve thousand files), and add a named export. A prop typed "an
icon" is `Icon` from the same module.

The selected state of an icon is `text-signal`. Nothing else colours an icon except
semantic state (danger, warning, success). Nutrition macro identities are the explicit
exception in ADR 0028 (`macro-protein`, `macro-carbs`, `macro-fat`).

## Nutrition compositions (trainer)

`apps/trainer/src/app/(app)/nutrition/_components/`: existing Select/Popover/Checkbox
compose multi-select library filters; IngredientPanel and RecipePanel use Sheet;
MacroBars and NutrientSummary visualise computed per-serving nutrition using existing
tokens. MediaField reuses the studio upload signer, hidden without configuration.
IngredientPanel uses a fixed header/footer and scrollable form; System forms save
Personal versions. Ingredient list filter chips use Folder/Tag/Globe/Plus icons. Shared
Select uses anchored poppers, neutral selection fills and consistent item padding.
Recipe line expansion contains preparation notes and a minimum-unit segmented group.
These are app-specific compositions, not new shared primitives.

RecipeSteps supports pointer/touch capture and keyboard pickup/move/drop/cancel without
an added library. Recipe settings reuse RecipeIdentity in Sheet. SolidSidebarIcon is
confined to the desktop rail; it does not change the shared outline icon exports.

StickyPageHeader groups title/search/filter controls inside Page and pins them to the
shell scroll area with an opaque panel background and existing gutters. Used by trainer
Exercises, Templates, Ingredients, Recipes and Settings; Clients stays unchanged.

Mealplans uses StickyPageHeader for the list and a fixed builder toolbar. Its app-local
PlanSettingsSheet shares Create/Edit configuration with a two-column scrollable form,
macro presets and pointer/keyboard distribution controls. PlanRecipePicker composes the
existing left Sheet and library filters; PlanOptionCard/Editor present plan snapshots,
quantities, compare and locks. Nutrient details collapse through native details/summary.
No new shared primitives, fonts or colour tokens. UI acceptance remains pending.
