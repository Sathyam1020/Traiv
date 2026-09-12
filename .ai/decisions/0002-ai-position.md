# 0002 — AI is a feature, not the product's identity
2026-09-11 · Status: accepted

## Context
An early brief described Traiv as "AI first". Confirmed with the founder that this was
template boilerplate rather than a strategic call.

A separate proposal — a direct-to-consumer AI coach at ₹499 — was evaluated and rejected.

## Decision
AI is part of the product, positioned as **coach leverage**, and lands in **v3**.
Order: client Q&A in the coach's voice → check-in reply drafts → plan first-drafts.

We do not lead with AI in positioning. The line is "coach fifty people like you coach ten",
never "AI writes your programmes".

No direct-to-consumer AI coach.

## Consequences
- v1 and v2 ship with no AI. Differentiation rests on price, WhatsApp delivery and the
  Indian food database.
- No LLM cost against the ₹580–680 contribution during the phases that matter most.
- **TBD:** whether plan first-draft generation is pulled into v1 (~1–2 weeks).

## Alternatives
**AI-first from v1** — rejected on four grounds: Spur.fit already sells exactly that in
India without dominating, so AI isn't the wedge; anyone can wrap an LLM in a weekend while
our moats take months; per-use cost against a thin margin; and it sells against the buyer's
identity — a coach's deepest fear is being replaceable.

**B2C AI coach at ₹499** — rejected: channel conflict. It undercuts our own coaches 6–16×
on the same brand, and HealthifyMe's AI-only plan is already ~₹208 with FitTrack at ₹99.
Revisit only above ₹1L MRR, under a separate brand.
