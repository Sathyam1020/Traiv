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
| `Button` | `apps/trainer/src/components/ui/button.tsx` | shadcn primitive. Variants: default, outline, ghost, secondary, destructive, link. |

## The shadcn token bridge

shadcn components reference their own variable names (`--color-primary`, `--color-border`,
`--radius-md`…). Rather than let a second palette into the product, those names are aliased
onto our semantic tier in an `@theme inline` block in `globals.css`.

The consequence: a shadcn component is on our tokens the moment it is added, with no
restyling pass. `bg-primary` compiles directly to `var(--accent)` → `var(--blue-500)`.

**Two names to be careful with** — shadcn's `--accent` means *hover fill*, not our brand
accent; their `--primary` is the brand colour. The bridge maps them accordingly.

Adding a new shadcn component that needs a variable the bridge doesn't cover means adding
one alias, never adding a raw value.

## Current shadcn dependencies

`cn` (shadcn's own class-merge package — do **not** hand-write a `cn` util, that's the
duplication this section exists to prevent), `radix-ui`, `class-variance-authority`,
`lucide-react`.
