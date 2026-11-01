# Traiv porcelain / graphite theme experiment — 2026-11-01

Purpose: give the coaching workspace depth and a recognizable violet identity while
retaining the accepted layouts, fonts, Wensity components, and behavior.

Research references:
- Apple Color: https://developer.apple.com/design/human-interface-guidelines/color
- Apple Dark Mode: https://developer.apple.com/design/human-interface-guidelines/dark-mode
- Apple Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Material semantic color roles: https://m3.material.io/styles/color/roles
- WCAG text contrast: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Synthesis: distinguish workspace, content, and floating elevation through surface
luminance rather than more outlines. Use materials selectively; keep data surfaces
opaque. Treat light and dark as independently tuned palettes. Keep action, selection,
status, and nutrition meanings separate. Apple-inspired restraint is the direction;
this is not an imitation of a native Apple interface.

Design decisions:
- Light: blue-grey ground #e9edf5, porcelain frame #f4f6fb, white content #ffffff,
  ink #25283c, violet #6452cd, fixed midnight rail #252a41.
- Dark: ground #191d2b, graphite frame #222635, slate content #2b3042,
  elevated menus #34394d, text #f0f1f8, lavender interaction text #c5b8ff.
- Keep the existing typeface and scale. Do not redesign information architecture.
- Nutrition retains coral protein, green carbs, golden fat, tuned independently
  between appearances. Labels and values continue to carry meaning alongside color.
- Shadows have slate undertones; stronger elevation is reserved for floating UI.
- No blanket gradients, decorative glow, new entrance motion, or blur behind tables.

Implementation: packages/ui/src/styles/premium-theme.css, imported once by globals.css.
Higher-specificity token selectors override generated Wensity defaults without modifying
the registry source or defeating coach-provided inline brand values.

Rollback ONLY this experiment: remove the premium-theme.css import from globals.css
and delete premium-theme.css. Do not use git restore on globals.css: it contains prior
accepted Wensity and sheet changes. A complete pre-experiment CSS snapshot is saved at
.ai/design/theme-snapshots/pre-premium-globals.css for reference; prefer removing the
import so subsequent unrelated CSS edits survive.

Verification: source review and palette contrast calculations only. No app tests,
typechecks, builds, or browser checks; user manual acceptance remains pending.


## Revision after user rejection — stone / forest

The blue-violet experiment was rejected because sidebar, header, fields, and data
collapsed into one chromatic wash. Its source is preserved in theme-snapshots/
rejected-violet-theme.css. The implementation now uses neutral stone/charcoal work
surfaces, a fixed forest rail, emerald/mint interactions, and separate table-heading,
table-body, and workspace-header tokens. StickyPageHeader has a styling-only data
attribute so its background is independently tunable.

Further research:
- https://www.nngroup.com/articles/color-enhance-design/ — dominant neutral surfaces,
  restrained accents, consistent meaning. The 60/30/10 rule is a composition heuristic,
  not a requirement to cover 10% of every screen in saturated color.
- https://www.carbondesignsystem.com/building-blocks/foundations/color/overview —
  explicit color roles and distinct neutral layers. Light and dark layering differ.
- https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00368/full —
  color effects depend on context; broad real-world psychological claims need caution.

Emerald is an art-direction choice compatible with coaching/nutrition, not evidence
that green will cause trust, adherence, or better outcomes. User acceptance is pending.
Rollback the full experiment by removing the premium stylesheet import; the header
attribute is inert without that stylesheet and can also be removed independently.


### Dark-only revision
Light appearance accepted as nearly complete; preserve all light tokens. Dark mode
now uses neutral graphite (frame #191b1d, content #242729), a near-neutral rail,
inset fields, distinct table heading/body, and mint reserved for interaction.
Previous dark appearance saved as rejected-forest-dark.css. Manual acceptance pending.


### Accepted neutral surfaces; sapphire brand revision
User approved the light and neutral dark structure and requested blue instead of
green branding. Light actions use sapphire #2459b8 with white; dark actions use
#88b7ff with #102139 text. Selection, focus, navigation and table-heading undertones
now coordinate with blue. The existing neutral dark surface ladder is retained.
Success and nutrition greens retain semantic meaning. A 50–950 sapphire ramp is
defined; 60/30/10 remains a heuristic, not a literal screen-pixel requirement.
Previous accepted green source: theme-snapshots/accepted-neutral-green-theme.css.


### Light-only product appearance
User requested light mode only. Trainer, client, admin and endorser root layouts
render without the dark class; UI stores normalize saved preferences and all setters
to light. App theme-toggle slots now render nothing. Dark CSS is retained dormant
for reversible styling history. Marketing routes are outside this appearance change.
No tests/build/browser checks run per standing instruction.
