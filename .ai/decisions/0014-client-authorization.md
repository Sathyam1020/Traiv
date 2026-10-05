# 0014 — Client authorization must be decided before `apps/client`
2026-10-05 · Status: **accepted — model decided, not implemented** · Relates to ADR 0004, 0011, 0013

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

## Decisions — founder, 2026-10-05

### The relationship

**A client relationship is separate from membership, and neither stands in for the other.**
`membership` means staff of a studio — owner or coach — and its meaning does not change to
accommodate clients. The coaching relationship is the `client` row.

A user **is a client of a studio** when a `client` row exists for that user and studio and
has not been deleted. Status then decides what they may do. Staff membership is never
proof that someone is a client.

One person may be staff in studio A and a client in studio B on a single session. That is
normal, not an edge case.

### Two gates, declared per endpoint

`requireStudio()` authorizes staff. `requireClient()` authorizes clients. Every endpoint
declares which one it needs; neither is inferred and neither falls back to the other.

Both relationships may be attached to the same request without interacting. If a user
somehow holds both a staff membership and a client relationship **in the same studio**,
the permissions are not merged — the endpoint's declared gate is the only one that
applies. (`joinByCode` already refuses to make a coach a client of their own studio; this
rule is the defence behind that, not a replacement for it.)

### What a client may read

Only their own, scoped by the resolved relationship:

1. Training plans assigned to them
2. Their workout history and logs
3. Their check-ins
4. Goals and constraints belonging to their coaching relationship
5. Relevant studio branding and profile information

Never: other clients, the roster, join codes, other clients' workouts or check-ins,
coach-only or admin data, or internal coach notes.

**Every client endpoint scopes by the authenticated user's own relationship. A client or
user id arriving in a request is never proof of ownership** — it is resolved from the
session and the studio, exactly as `requireStudio` resolves membership.

### What a client may write

May: log workouts, submit check-ins, update their own client-owned goals and constraints
where the product explicitly allows it.

Never: edit coach-authored plans, edit coach notes, modify historical workout data
belonging to the coach, touch another client's data, change their own studio relationship,
or perform any coach or admin operation.

**Start conservative on editing.** A client may create today's workout and check-in
records. Modifying historical or coach-authored records stays closed until a later product
decision opens it specifically.

### Status decides capability

| status | read own data | create coaching activity |
|---|---|---|
| `active` | yes | yes |
| `paused` | yes | **no** — paused by the coach, reactivation reopens it |
| `frozen` | yes, and is told they are frozen | **no** |
| `archived` | **no client access** | no |
| deleted / removed | **no access** | no |

The relationship and its history are preserved in every case. **Nothing is silently
deleted when a relationship is paused, frozen, archived or removed** — those states change
authorization, never retention.

Because `frozen` must be visible to the client (ADR 0013), the read gate admits `frozen`
and `paused` and the endpoint reports status. Only `archived`, deleted, and "not a client"
are refused — and those three are refused identically, so the gate does not reveal whether
a relationship ever existed.

### After the relationship ends

**No client access to history.** Once archived or removed, client authorization ends. The
data remains available to the studio under staff authorization and retention rules.

This is the privacy-safe default: a studio's data stays inside the studio. Letting a
departed client retain or export their own history is a separate product decision, not a
permissions detail to be settled by omission.

### Evaluation is per request, per studio

There is no global role. The same user is staff in one studio and a client in another, and
each request is evaluated against the studio it names:

```
user X · studio A → owner    → staff endpoints in A use requireStudio()
         studio B → client   → client endpoints in B use requireClient()
```

Neither grants the other. The authorization context can carry both without either
replacing the other.

## Model and schema implications

**The `client` table already carries what the gate needs** — `studioId`, `userId`,
`status`, `deletedAt` — and the existing indexes serve the lookup: the partial unique
index `client_studio_user_key (studioId, userId) where userId is not null and deletedAt is
null` matches the gate's predicate exactly, and `client_user_idx` covers the fan-out. No
new index is required for authorization.

**`client_status` must gain `waiting` and `frozen`** (ADR 0013). Until it does, `frozen`
cannot be expressed and this status table is partly unimplementable.

**`userId` is nullable, so a client row may authorize nobody.** A coach-added client with
no account simply never matches the gate. That is correct and needs no guard.

**The context is `{ studioId, clientId, status }`** — a sibling of `StudioAuth`, read via
`requireClientAuth(req)`, with the same rule that a handler reading it without the
middleware is a programming error rather than a 403.

**Capability is derived from status, not re-checked per handler.** `requireClient()` for
read, `requireClient({ write: true })` for anything that creates coaching activity —
mirroring `requireStudio({ role })`, so the rule reads off the route definition.

**Client routes must name their studio in the path.** `session.activeStudioId` is staff
context: a user who is staff in A and a client in B would carry `activeStudioId = A`, and
resolving a client route from it would look for a client relationship in the wrong studio.
Naming the studio explicitly also means the two gates never compete for the same piece of
session state. It is safe for the same reason a staff id in the URL is safe — it is
verified, never trusted.

**Nothing a client reads exists yet.** There are no plans, workout logs or check-in
tables. `requireClient` can be built and tested against the relationship and its statuses,
but the read and write rules above cannot be exercised until the coaching data model
lands. This ADR is the shape; it is not implementable in full today.

## Still open

- **`waiting` is not in the status table.** A queued client (ADR 0013) has a `client` row
  that is not deleted, so by the rule above they *are* a client — but they were never
  admitted. Presumably they may see only that they are waiting. Needs an explicit row.
- **Whether a client may edit their own goals and constraints at all.** The write rules
  allow it "where the product explicitly allows it", and the product has not yet said
  where. Defaults to no until it does.

## Alternatives considered

**Reuse `membership` with a `client` role.** `requireStudio` would have worked unchanged.
Rejected: `membership` would stop meaning "staff", and every existing query that assumes
it does — the studio switcher, seat counting, `joinByCode`'s owner lookup — would silently
begin returning clients. A silent change of meaning across existing code is worse than a
second gate to remember.

## Why this was decided before the code

Deferring is correct — the model should be designed with the client app's real screens in
view rather than guessed at now. The cost is that the accidental safety described above
is invisible: nothing in the code says "clients are excluded because they fail a check
meant for staff". A future agent adding a client route will find `requireStudio` and
reasonably assume it is the gate for everyone.

**Do not widen `requireStudio` to admit non-members.** Client routes get `requireClient`
or they do not ship.
