# 0013 — A full roster puts the client on a waitlist, not into an error
2026-10-05 · Status: accepted · Implementation deferred · Relates to ADR 0001, ADR 0004

## Context

Seat limits ship with the join code (`SEAT_LIMIT` in `features/client/join.ts`): free 2,
starter 8, pro and studio unlimited. When the count is reached, `joinByCode` currently
throws:

> "This coach's roster is full. Ask them to upgrade, then try again."

Three things are wrong with that, and they are all product problems rather than bugs:

1. **The paywall fires at the wrong person.** The client hits it, but the coach is the
   customer. We are asking someone who just scanned a QR in a gym to go chase their
   trainer about billing.
2. **The coach never finds out.** Demand arrives and vanishes with no record. The single
   most persuasive upgrade argument — *three people tried to join you this week* — is
   thrown away at exactly the moment it is generated.
3. **It is a dead end for the client.** They did the hard part. The next screen says no,
   with an instruction to go nag somebody.

This matters disproportionately because weekly-active-clients ÷ total-clients is the
metric the product is judged on, and this failure deletes a client who was *actively
trying to activate*.

## Decision

A join against a full roster **succeeds into a waiting state** rather than failing.

**Client side** — confirmation, not an error. They are on the coach's list, the coach has
been told, nothing more is required of them. They are never asked to contact the coach
about money.

**Coach side** — waiting clients are surfaced as a named list ("3 people are waiting to
join"), with who and when, and the upgrade as the obvious next action. Reviewing it is
how a coach discovers the ceiling, so it has to be visible without being nagging.

Confirmed by the founder, 2026-10-05.

## Resolved — founder, 2026-10-05

**Attachment is link-only.** There is no manual add and no manual admit. `joinByCode` is
the only path that creates a client row, and no coach action can place someone on a
roster or promote them over the limit. This is a product rule, not an unbuilt feature —
do not add a "create client" endpoint.

**The coach is told by a modal.** No push, no WhatsApp, no digest. Waiting clients
surface when the coach is already in the app. Demand is not a notification stream.

**A waiting client is not shown their position.** They are told they are on the list and
nothing further.

**A downgrade freezes, it does not delete.** Clients over the new limit become frozen,
and frozen is visible on *both* sides: the client is told their account is frozen, the
coach sees the same state on their roster. No one is silently dropped.

**State lives on `client_status`.** The enum gains `waiting` and `frozen`:

```
active | paused | waiting | frozen | archived
```

Chosen over a separate waitlist table because freeze is a second non-active state and a
separate table would need a third, with rows shuttling between tables on every tier
change. A client row is a durable relationship with an identity — once plans, logs and
check-ins reference `client.id`, moving the row is a foreign-key problem, and a client
who waits, joins, freezes and resumes must stay the same person throughout.
`client_studio_status_idx (studioId, status)` already indexes this access pattern.

## Consequences

- **The seat count must stop counting everything.** `joinByCode` currently counts every
  non-deleted row in the studio. With `waiting` added, waiting clients would block each
  other out of the very list they are queued in. Counting has to narrow to the statuses
  that genuinely occupy a seat.
- `JoinOutcome` gains a `waitlisted` variant; every caller must handle a third outcome.
- Every roster read now filters on status, not just `deletedAt`.
- Promotion on upgrade is one transactional operation against the new limit, not a loop.
- Rotating or disabling a join code must not strand people who are waiting.
- **Frozen is visible to the client**, which means a coach's downgrade is visible to
  their clients. That is the deliberate cost of not silently dropping anyone — worth
  watching for whether coaches find it exposing.

## Seat accounting and downgrade — founder, 2026-10-05

**What occupies a seat**

```
active    consumes      the normal case
paused    consumes      the coach paused the relationship, they are still a client
waiting   does not      queued, never admitted
frozen    does not      pushed out by a downgrade
archived  does not      the relationship ended
```

`paused` consuming a seat is the load-bearing one: if it did not, a coach could pause
their way under any limit and pausing would become the bypass. Paused means *temporarily
paused*, not *removed*.

**`joinByCode` must change.** It counts every row with `deletedAt is null`, which
includes `archived` and would include `waiting` the moment that status exists — queued
clients would block each other out of the list they are queued in. The count narrows to:

```sql
status in ('active', 'paused')
```

This is correct on its own terms today, before any of the rest ships.

**Downgrade ranking**

```
1. client.createdAt   descending   newest relationships rank highest
2. client.id          tiebreaker   guarantees a total order
```

Keep the highest-ranked N seat-consuming clients, freeze the rest. No manual selection,
by anyone or at any tier. Frozen clients stay attached to the coach and keep all their
data and history.

Newest-first is a **proxy for recency of activity**, which is what we actually want to
preserve and cannot yet measure. A client who joined last week is more likely to be
mid-onboarding and still logging than one who joined eight months ago.

The id tiebreaker is not decoration. Two clients created in the same transaction share a
timestamp, and without a column that cannot tie, the outcome depends on whatever order
the planner returns rows in — "deterministic" quietly stops being true, and it would pass
every test written against small data.

**Activity tracking is explicitly out of scope.** No `lastActivityAt`, no new tracking of
any kind, as part of this work. It arrives when the product has a defined activity model,
and this ranking is revisited then.

Two columns look like substitutes and are not:

- `updatedAt` mutates on any write, including a coach editing someone's notes — ranking
  by it would let a coach promote a client past the limit by typing in their profile.
  **Do not rank by `updatedAt`.**
- `activatedAt` is the *first* logged workout, set once and never again. It is a
  milestone, not a recency signal.

**Deterministic and idempotent**

The operation is *reconcile the roster to the current limit*, not *apply a downgrade*:

- Seat-consuming count at or under the limit → no-op.
- Over the limit → freeze the lowest-ranked until it equals the limit.
- **Reconcile only ever freezes. It never unfreezes, automatically or otherwise.**

Because ranking reads only `createdAt` and `id` — both immutable — repeated runs over an
unchanged roster produce an identical result. Reconcile is therefore safe to run on any
tier change, on a schedule, or twice by accident.

Both reconcile and any future promotion run inside a transaction holding the same
`for update` lock on the studio row that `joinByCode` takes, so a join landing mid-
downgrade cannot slip past the limit.

**Known cost:** ranking newest-first means a coach's longest-standing relationships
freeze first. Accepted for now because join date is the only honest signal available —
revisit when there is a real activity model.

## Alternatives considered

**Keep the hard error.** Honest and already built, but it destroys demand at the moment of
peak intent and leaves the coach blind. Rejected.

**Silently exceed the limit and bill later.** Invisible to the coach until an invoice
arrives. Rejected — surprise billing is how you lose a ₹999/mo customer permanently.

**Notify the coach but still reject the client.** Fixes the coach's blindness but leaves
the client at a dead end. Rejected — it solves our problem and not theirs.
