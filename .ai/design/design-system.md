# Design system

## Reference points (confirmed)

**Notion** is the structural base — restraint, typography-led, near-zero borders,
generous line-height, colour only when it means something.
**Apple** is the motion and depth reference — physical, purposeful, never decorative.

What makes something feel like Notion is *not* the font. It's what's absent: no card
around everything, no gradient, no shadow unless something is genuinely floating, no
colour that isn't carrying meaning.

## Token architecture — three tiers, non-negotiable

Adopted from the DTCG-style model. This is the mechanism that stops agents inventing values.

```
primitive  →  semantic  →  component
```

**Tier 1 — primitive.** Raw values. `grey.500`, `size.16`, `duration.200`.
**Never referenced by a component. Ever.** They exist only to be pointed at.

**Tier 2 — semantic.** Role names. `color.text.primary`, `color.bg.surface`,
`space.gutter`, `radius.control`. This is what components use, and it's where
light/dark is resolved.

**Tier 3 — component.** Only when a component genuinely needs its own knob:
`button.primary.bg`. Do not create these pre-emptively.

### The rule that matters

> If you are typing a hex code, a px value, a font size, a radius or a duration into a
> component, you are doing it wrong. Stop and find the token. If no token fits, that is
> a design system conversation with the human — not a CSS decision you get to make.

Tokens are an API: named deliberately, versioned, reviewed. Unused tokens get deleted.

## Files

- `colors.md` — the full palette, all three tiers, light and dark
- `typography.md` — the stack and the scale
- `spacing.md` — 4pt/8pt rhythm, radius, elevation, motion
- `components.md` — what exists, what shadcn gives us, what we may not build
- `patterns.md` — recurring compositions
- `ui-principles.md` — how to compose
- `voice.md` — how to write. Read before any user-facing string.

## Theming

Every semantic token is defined for light and dark. Components read semantic tokens only,
so theming requires no component changes.

Coach-level branding (logo, display name, accent colour) applies to the **client app**
only, and only overrides `color.accent.*`. It never touches text, surface or border
tokens — a coach picking a bad brand colour must not be able to make the app unreadable.

## Governance

- New primitive → requires human approval. Almost never needed.
- New semantic token → justify against an existing one first.
- New component token → only after two real usages.
- Changing a token value → ADR in `.ai/decisions/`.
