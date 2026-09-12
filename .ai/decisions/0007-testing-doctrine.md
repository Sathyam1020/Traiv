# 0007 — Scenario testing over unit testing
2026-09-11 · Status: accepted

## Context
The founder's direct experience: agents left alone write thousands of tests that are
impractical and catch nothing.

The motivating bug, from a real product — an interview rescheduling feature where candidate,
interviewer and co-interviewer could each reschedule. Manually tested one path and it worked.
In production, rescheduling succeeded exactly **once**; after any one actor acted, the other
two were locked out. Every individual function was correct. The bug lived in
**actor × state × ordering**.

## Decision
Scenario tests at the service layer, with a real database. Fake only what crosses the
network to a third party.

Every feature spec enumerates scenarios before implementation and must cover five cases:
**second attempt · two actors · out of order · after expiry · abandoned halfway.**

Banned: asserting a mock was called · testing framework behaviour · markup snapshots ·
tests of getters and constructors · a test per function for its own sake ·
**coverage targets, which are not measured** because they reward exactly those tests.

## Consequences
- Far fewer tests, each mapping to a real failure. All of auth is ~10 tests.
- Slower individual tests (real database) — acceptable at this count.
- Requires a seeded, realistic test database.
- Refactors don't break tests, because tests target behaviour rather than structure.
- **TBD:** test runner not yet chosen — decide at API scaffold, per `dependencies.md`.

## Alternatives
Conventional unit testing with coverage targets — rejected as the exact failure mode this
project exists to avoid.
