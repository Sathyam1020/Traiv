# Conventions

## TypeScript

Strict, everywhere. `strict: true`, `noUncheckedIndexedAccess: true`,
`noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`.

**`exactOptionalPropertyTypes` is deliberately off.** It conflicts with a pattern that is
everywhere in React and Radix — destructure an optional prop, pass it straight through —
and we vendor shadcn/ui, so it would mean patching third-party source on every
`shadcn add`. It catches real bugs, but not enough to pay that cost forever. Everything
else stays strict.

**No `any`. No `@ts-ignore`. No `!` to silence the compiler.** If types are fighting you,
the model is wrong — fix the model. `unknown` plus a zod parse at the boundary is the
answer, not a cast.

Validate at boundaries with zod: HTTP request bodies, webhook payloads, env vars, anything
crossing from outside. Inside the boundary, trust the types.

## Naming

- Files: `kebab-case.ts`. React components: `PascalCase.tsx`.
- Database: `snake_case`, tables singular (`client`, not `clients`).
- Booleans read as assertions: `isActive`, `hasVerifiedPhone`.
- Money always carries the unit: `priceInPaise`, never `price`.
- Dates carry the type: `startsOn` (date), `createdAt` (timestamp).

## Structure

Group by feature, not by technical layer. `features/client-roster/` beats
`controllers/`, `services/`, `types/` spread across the tree.

## Errors

**Never swallow.** No empty `catch {}`, no `|| true`, no `2>/dev/null` on anything that
matters. If you catch, either handle it or log it with context and rethrow.

Errors that reach a user get a message saying what broke and what to do — see
`design/voice.md`.

## Abstractions

**Do not abstract until it hurts.** Two similar things are a coincidence. Three are a
pattern. A generic helper written for a single caller is a liability.

Copying ten lines is usually better than the wrong abstraction. Delete dead code rather
than keeping it "just in case" — git remembers.

## Comments

Explain *why*, never *what*. Code that needs a comment to say what it does should be
rewritten. A comment explaining a non-obvious constraint, a workaround, or a decision is
valuable and should be kept.

## Git

Branches: `feat/`, `fix/`, `chore/`. One logical change per commit. Message says what
changed and why, in the imperative.

## Money

Integer paise. `999_00` is ₹999. Never floats. Never a `number` field called `price`.

## Time

`timestamptz`, stored UTC, displayed in `org.timezone`. Client-written rows also carry
`client_created_at` — the device clock, kept but never trusted.
