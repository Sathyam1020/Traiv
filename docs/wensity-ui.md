# Wensity UI in Traiv

The shared `@traiv/ui` primitive layer uses source copied from the official Wensity
registry with Wensity CLI 0.1.14 on 2026-11-01.

References: https://ui.wensity.com/docs/getting-started,
https://ui.wensity.com/docs/cli, https://ui.wensity.com/docs/theming.

## Structure

- `packages/ui/wensity.json`: registry, output paths, icon and font configuration.
- `packages/ui/src/components/wensity/`: official source with documented local adaptations.
- Existing `packages/ui/src/components/*.tsx` imports: compatibility adapters so existing
  application code consumes Wensity without rewriting every form and navigation action.
- `packages/ui/src/styles/globals.css`: CLI-managed primitive tokens followed by Traiv
  theme bindings outside the generated block. Purple signal colors, existing font,
  light/dark palettes, and coarse-pointer target sizes remain Traiv-owned.

Migrated primitives: buttons, inputs, textarea, selects, dialogs, sheets, popovers,
dropdown menus, tabs, checkbox, radio group, switch, slider, toggles, tooltip, cards,
badges, avatar, calendar, labels, separator, skeleton, tables, navigation menus,
alerts and toasts. Base UI provides interactive behavior; Tabler provides the
primitive icons; existing `motion/react` provides animations.

Domain layouts (nutrition cards, app shell, glass mobile navigation, client avatars,
and other product-specific compositions) remain application code. This migration
replaces their shared primitive foundation; it does not substitute unrelated Wensity
demos for product workflows. Paid Pro components and blocks are not included.

## Compatibility decisions

Adapters retain legacy size/variant names, compositional select options and groups,
filter icons/custom labels, single-value slider arrays, toast calls, and calendar
single-date selection/disabled matchers. Dialog and sheet adapters preserve cancelled
outside dismissal for unsaved edits. Sheet corner rounding remains intact.

Local registry-source changes:

- use the existing `motion/react` dependency instead of `framer-motion`;
- input `nativeLayout` mode keeps existing input width/ref/className behavior;
- select `displayLabel` supports compact application filter captions;
- tab triggers retain `data-state` for existing active-tab classes;
- sheet popup retains `data-slot="sheet-content"` for application styling.

## Maintenance

Run the Wensity CLI from `packages/ui` so it reads that package's configuration.
Use `pnpm dlx wensity@latest --help` before an update because CLI syntax can change.
Review registry-source and generated-token diffs before accepting an update: do not
blindly overwrite the adaptations listed above. Keep Traiv token bindings outside
the generated markers and keep adapters outside the registry output directory.
Only add dependencies actually imported by installed components. Never add a
self-dependency on `@traiv/ui` if suggested by the registry dependency metadata.

## Verification status

Dependency installation and source review were completed. Tests, typechecks, builds,
and browser/UI checks were deliberately not run under the user's standing instruction.
The migration still needs manual acceptance across forms, dropdowns, overlays, calendar
selection, mobile layouts, and both themes before treating it as release-verified.
