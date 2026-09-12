# Code review

Review in this order. Stop at the first level that fails — no point discussing naming in
code that's architecturally wrong.

## 1. Correctness
Does it do what the spec says? Are the five scenario cases handled — second attempt, two
actors, out of order, after expiry, abandoned halfway?

## 2. Security
Authorized explicitly? Scoped by `org_id`? Resource loaded before the ownership check, or
org taken from the request body (IDOR)? Secrets out of logs and bundles? Webhook signature
verified?

## 3. Data
Migration safe against existing rows, not just an empty database? Deletes leave orphans?
Uniqueness enforced by a constraint rather than by hope?

## 4. Architecture
In the right layer? Route handlers thin? An abstraction invented for one caller? A new
dependency that went through `dependencies.md`?

## 5. Scope
Anything here unrelated to the task? Drive-by refactors get removed, not praised.

## 6. Conventions
`any`, `@ts-ignore`, swallowed errors, invented tokens, arbitrary Tailwind values, money as
a float, `console.log` left behind.

## 7. Completeness
Loading, empty and error states present? Works at 360px? Keyboard reachable?
`state/current.md` updated? Decisions recorded?

## How to report

Most severe first. Each finding: the file and line, what breaks, and a concrete failure
scenario — inputs and state that produce the wrong result. "This could be cleaner" is not
a finding.
