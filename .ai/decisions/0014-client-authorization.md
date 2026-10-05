# 0014 — Client authorization must be decided before `apps/client`
2026-10-05 · Status: **proposed — blocks `apps/client`** · Relates to ADR 0004, 0011, 0013

## Context

Coach-side authorization is now one chokepoint: `requireStudio` reads live membership on
every request, and `membership` is the sole source of studio access. That model has no
room for a client.

A client is not a member. `client` is a separate table precisely because a client may
have no account at all (ADR 0004), and `membership` means *staff of a studio*. So today
every studio-scoped route correctly refuses a client — not by design, but because they
fail the membership check. The moment `apps/client` needs to read anything, that
accidental safety disappears and a second authorization model has to exist.

Writing it reactively, route by route, is how the coach side ended up with the same check
implemented three times. This has to be decided first.

## Questions that must be answered first

**1 · What makes a user a client of a studio?**
A `client` row with `userId` set, `deletedAt` null, and which `status` values? ADR 0013
adds `waiting` and `frozen` — neither is an active coaching relationship.

**2 · Membership, a separate relationship, or both?**
Reusing `membership` would make `requireStudio` work unchanged, at the cost of
`membership` no longer meaning "staff" — and every existing query that assumes it does
would silently start returning clients. A separate `requireClient` keeps the meanings
clean and adds a second thing to forget.

**3 · Exactly what may a client read?**
Their own plans, logs, check-ins and the studio's branding — not the roster, not other
clients, not the join code, not anything belonging to another client of the same coach.
This needs enumerating, not describing.

**4 · Exactly what may a client modify?**
Logging a workout and submitting a check-in, presumably. Can they edit their own goal or
constraints, which the coach wrote? Can they edit yesterday's log, or only today's?

**5 · Can a client belong to several studios?**
The schema already allows it — uniqueness is per studio, deliberately, so a lifting coach
and a dietitian are two relationships. So the client app needs the same active-studio
concept the coach app has, with the same rule that it is state and never proof.

**6 · How is the relationship created?**
Link only. `joinByCode` is the single path, and ADR 0013 records that as a product rule.

**7 · What happens when a client is frozen, paused, archived or removed?**
Each needs an explicit answer for read and for write. ADR 0013 says a frozen client is
told they are frozen and keeps their history — so frozen is *some* access, not none.
`paused` and `archived` are undecided.

**8 · Can a client read their history after the relationship ends?**
Their logged workouts are arguably theirs. The coach's programme is arguably the coach's.
This is a product decision with a data-export dimension, not a permissions detail.

**9 · How do client and coach authorization interact?**
One person can be a coach in one studio and a client in another, with one session. So the
two models must compose on the same request without either being able to stand in for the
other.

## Decision

**None yet.** This ADR exists to stop `apps/client` starting before there is one.

What is already decided and must hold:

- Authorization is server-side. Client-side checks are UX.
- A client-supplied id is never proof of anything; the relationship is re-read per request.
- Whatever the model, it goes through one chokepoint, like `requireStudio`.
- Tests exercise the real HTTP boundary.

## Consequences of deferring

Deferring is correct — the model should be designed with the client app's real screens in
view rather than guessed at now. The cost is that the accidental safety described above
is invisible: nothing in the code says "clients are excluded because they fail a check
meant for staff". A future agent adding a client route will find `requireStudio` and
reasonably assume it is the gate for everyone.

Until this ADR is accepted: **do not add client-facing routes, and do not widen
`requireStudio` to admit non-members.**
