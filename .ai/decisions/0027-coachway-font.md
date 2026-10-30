# 0027 — DM Sans in the trainer app
2026-10-30 · Status: accepted

## Context
The founder requested Coachway's font after reverting the Tacto theme experiment.
Read-only inspection of the live Coachway app found computed `font-family: "DM Sans",
system-ui, -apple-system, sans-serif` on body, buttons and table content.

## Decision
Use DM Sans in the trainer app through existing `next/font/google`, weights 400/500/600.
Expose `--font-app-sans`; the shared sans/display stacks prefer it and fall back to
existing Inter where an app has not set it. This amends ADR 0015 for trainer typography.
Keep colours, type scale, navigation, spacing and theme switching unchanged.

## Consequences
No new dependency. Next self-hosts font assets. Other apps keep their existing fonts.
The Tacto preview was rejected and removed; it is not part of this change.
