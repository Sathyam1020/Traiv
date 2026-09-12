# Skill: UI review

Run against any UI change. **Report problems. Do not modify code during this review
unless explicitly told to.**

## Slop detection — check these first

Presence of any is a failure, not a preference:

- [ ] Gradients used decoratively
- [ ] Glassmorphism / backdrop blur as ornament
- [ ] Cards inside cards
- [ ] Everything wrapped in a bordered rounded card
- [ ] An icon beside every label
- [ ] Emoji as section markers
- [ ] Pills used for decoration rather than state
- [ ] Shadows on things that aren't floating
- [ ] Headings above 24px
- [ ] More than one accent colour on screen
- [ ] Animation that doesn't explain a change
- [ ] Centred body text
- [ ] A stat-tile grid nobody asked for
- [ ] Borders on everything
- [ ] Generic SaaS copy — check against `design/voice.md`'s banned list

## Tokens

- [ ] No hex codes in components
- [ ] No arbitrary Tailwind values (`w-[437px]`, `text-[#333]`)
- [ ] No font size, radius, duration or spacing outside the scales
- [ ] Colour used only where it carries meaning

## Hierarchy and composition

- [ ] Clear first thing to look at
- [ ] Hierarchy from weight and colour before size
- [ ] Repeated elements share edges, baselines and inner padding
- [ ] Separation by space before lines
- [ ] Density suits the surface — dense for the coach's roster, sparse for a workout screen

## States

- [ ] Loading designed, matching the real layout so nothing jumps
- [ ] Empty state says what goes here and gives the control to add it
- [ ] Error says what broke and offers the way out
- [ ] Submit disabled while in flight, label changed
- [ ] Optimistic updates roll back on failure

## Mobile

- [ ] Opened at 360px — actually opened
- [ ] No horizontal body scroll
- [ ] Tap targets ≥ 44×44
- [ ] Tables become row lists, not sideways-scrolling tables
- [ ] Reachable one-handed
- [ ] Not a desktop layout squeezed down

## Accessibility

- [ ] Every interactive element keyboard reachable
- [ ] Visible `:focus-visible`
- [ ] Labels bound to inputs
- [ ] Icon-only buttons have accessible names
- [ ] Errors tied with `aria-describedby`
- [ ] Dialogs trap focus and restore it on close
- [ ] Body text ≥ 4.5:1 contrast
- [ ] `prefers-reduced-motion` respected

## Reuse

- [ ] Doesn't duplicate a shadcn primitive
- [ ] Doesn't duplicate an existing Traiv component
- [ ] Matches sibling instances of the same pattern
- [ ] Any new component added to `design/components.md`

## Report format

Severity first. Each finding: what, where, why it's wrong, what to do. Separate
**must fix** from **worth considering**.
