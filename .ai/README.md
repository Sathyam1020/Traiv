# .ai — Traiv project knowledge

The repository is the source of truth. Conversation memory is not. Everything a future
agent needs to work on Traiv consistently lives here.

## How to load context

**Always:** `CLAUDE.md` → `.ai/state/current.md` → this file.

**Then, by task type:**

| Task | Read |
|---|---|
| Any feature | `product/principles.md`, `engineering/conventions.md`, `workflows/feature-development.md` |
| UI work | all of `design/`, `workflows/ui-development.md`, `skills/ui-review.md` |
| API / server | `engineering/backend.md`, `engineering/architecture.md`, `engineering/security.md` |
| Schema change | `engineering/database.md`, then open an ADR in `decisions/` |
| Bug | `workflows/bug-fixing.md`, `state/known-issues.md` |
| Tests | `engineering/testing.md` — read it fully, our approach is deliberately unusual |
| Adding a library | `engineering/dependencies.md` — mandatory, no exceptions |

## Structure

- `product/` — what we're building and for whom. Product decisions live here.
- `design/` — the design system. Tokens, type, colour, spacing, components, voice.
- `engineering/` — how we build. Architecture, conventions, testing, security.
- `workflows/` — the process for doing a piece of work end to end.
- `decisions/` — ADRs. Anything consequential, with the reasoning attached.
- `state/` — what exists right now, and what's broken.
- `skills/` — review checklists agents run against their own work.

## Marking unknowns

Anything undecided is marked **TBD** with what's needed to resolve it. Do not
fill a TBD by inventing an answer. TBDs are a to-do list for the human, not for you.
