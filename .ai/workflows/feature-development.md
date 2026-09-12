# Feature development

Nine steps. Do not skip verification because a feature looks simple.

## 1. DISCOVER
Read the request. Identify what is **not** specified. If a product decision is missing —
a rule, a price, a limit, a flow, a piece of copy — **stop and ask**. Do not fill it in.

## 2. PLAN
Read the relevant `.ai/` docs and `state/current.md`. **Search the repo for existing
implementations** of anything you're about to write. Write the plan: files touched,
new files, schema changes, dependencies.

## 3. SPEC
Create `features/<name>/` with `spec.md`, `acceptance.md`, `edge-cases.md`, `tests.md`.
`tests.md` enumerates scenarios covering the five mandatory cases from
`engineering/testing.md`: second attempt, two actors, out of order, after expiry,
abandoned halfway.

**Do not implement while a critical requirement is ambiguous.** Confirm acceptance criteria.

## 4. IMPLEMENT
The smallest clean implementation that satisfies the spec. Existing patterns over new ones.
No abstraction until repetition justifies it. No unrelated refactoring. No new dependency
without `engineering/dependencies.md`.

## 5. TEST
Write the scenario tests from `tests.md`. Run them.

## 6. REVIEW
Run `skills/feature-review.md`, then `skills/architecture-review.md`. Report findings;
don't quietly fix and move on.

## 7. UI REVIEW
Separate pass. Run `skills/ui-review.md`. **Report problems first — do not modify code
during a visual review unless told to.**

## 8. FIX
Address findings. Re-run tests.

## 9. VERIFY & DOCUMENT
Typecheck, lint, tests. Open the app and use it at 360px. Then update
`state/current.md`, add ADRs for any decision made, and update `design/components.md`
if a component was added.

## Done

Only when everything in CLAUDE.md's "Definition of done" is true. Compiling is not done.
