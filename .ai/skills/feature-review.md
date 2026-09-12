# Skill: feature review

Does this actually work, completely?

## Spec conformance
- [ ] Every acceptance criterion met
- [ ] Nothing built that isn't in the spec
- [ ] No invented product rule, limit, price or copy

## The five scenarios
- [ ] **Second attempt** — runs twice: retry, double-click, back button, webhook redelivery
- [ ] **Two actors** — both act, simultaneously and sequentially
- [ ] **Out of order** — step 3 before step 2, accept after cancel
- [ ] **After expiry** — token, mandate, session, invite used past its life
- [ ] **Abandoned halfway** — left mid-flow, returned days later

## Completeness
- [ ] Loading, empty, error states all exist
- [ ] Errors reach the user with something actionable
- [ ] Nothing silently swallowed
- [ ] No TODO or stub on a path a user can reach
- [ ] Not marked done with parts missing

## Permissions
- [ ] Every server entry point authorizes explicitly
- [ ] Scoped by `org_id`
- [ ] Resource loaded before the ownership check
- [ ] Tested as the wrong user, not just the right one

## Data
- [ ] Writes idempotent where retryable
- [ ] Multi-step writes in a transaction
- [ ] Side effects via `outbox`, not fired inside a handler
- [ ] Migration safe against existing rows

## Regressions
- [ ] Existing flows touching this code still work
- [ ] Shared components changed here still correct at every other usage
