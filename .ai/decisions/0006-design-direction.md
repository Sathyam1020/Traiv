# 0006 — Design direction and token architecture
2026-09-11 · Status: accepted

> **The palette in this ADR is superseded by ADR 0015 (cal.com).** The structural
> decisions — Notion's restraint, the three-tier token system, the type scale — still
> stand. The warm paper, forest and yellow values do not.

## Context
The founder named Notion and Apple as references, and asked specifically for Notion's
typography and theme, purposeful animation, and distinctive copy rather than generic SaaS
wording. Preventing AI-generated visual slop is an explicit project goal.

## Decision
**Notion as the structural base, Apple as the motion and depth reference.**

Concretely: system font stack (what Notion actually uses), warm near-black `#37352F`
instead of pure black, borders at ~9% opacity, hover as a faint fill rather than an
outline, 3px control radius, 1.5 body line-height, eight type sizes, nothing above 24px,
colour only where it carries meaning.

**Three-tier tokens** — primitive → semantic → component. Primitives are never referenced
by components. The rule: *typing a hex, px, size, radius or duration into a component is a
review failure.*

`.ai/design/voice.md` governs copy, with an enforced banned-words list.

Coach branding overrides `color.accent.*` only — never text, surface or border tokens, so
a bad brand colour can't make the client app unreadable.

## Consequences
- Agents cannot invent a colour, because no raw value exists outside the primitive file.
  This is the mechanism preventing drift — as the reference guide put it, without tokens AI
  amplifies drift, with tokens it amplifies consistency.
- No webfont for UI: instant load, native feel on every device.
- **No serif yet.** Notion's is Lyon Text, licensed and not free. TBD if one is needed.
- A restrained system needs discipline; the temptation to add a size or a colour will recur
  and must be resisted via ADR.

## Alternatives
Dense/utilitarian (Linear), data-forward (Whoop), Indian-consumer (Cred) — all presented;
Notion chosen by the founder.
