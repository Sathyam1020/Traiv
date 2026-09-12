# 0011 — Studios and membership
2026-09-12 · Status: accepted · Amends ADR 0004

## Context

Every trainer needs a tenant to own clients, plans and branding. A trainer may also work
inside someone else's studio — a studio owner adds coaches once they are on the Studio
plan. So one person must be able to hold several memberships and move between them.

Checked against how Slack, Notion, Linear and the B2B auth vendors model this. The pattern
is uniform: one identity, a workspace table, a membership junction carrying the role, and
a persisted last-used workspace with a switcher. Linear's detail is the one that matters
here — **billing attaches to the workspace, not the person.**

## Decisions

**The tenant is called `studio`.** Not `org`. It is the word the founder and the users use.

**Every trainer owns a studio from signup.** Created in the same transaction as the user,
so "at least one studio" cannot be broken by a partial failure. Slug is
`firstname-xxxxxx` — first name plus six random characters. A random suffix rather than
collision retries: one insert, no read-then-write race, no `-2` tails. It becomes
`<slug>.traiv.app` when white-label ships.

**A trainer with no usable name gets "My studio"**, renameable in settings.

**The subscription belongs to the studio, not the person.** An invited coach still owns a
studio of their own on the free tier. This was the point that decided it: the alternative —
locking your own studio until you pay — contradicts ADR 0001's free tier and removes the
most natural expansion path there is, invited coaches becoming customers.

**A session opens in**: whatever the session already held, if it is still valid → else the
studio that invited them, if they were invited → else their own. An invited coach lands
where they were invited, which is what they came for.

**Switching verifies membership server-side**, then writes `session.active_studio_id`.
It is an authorization check, not a preference.

**Clients are visible studio-wide.** `client.coach_id` records who owns the relationship;
everyone in the studio can see all of them. That is how small studios work, and it is far
easier to tighten later than to loosen.

## Consequences

- Reads inside a signup transaction must take the transaction handle. `resolveActiveStudio`
  originally queried through `db` and could not see the studio the same transaction had
  just written — caught by a test that now pins it.
- `listStudios` and `resolveActiveStudio` both accept an optional `tx`.
- The switcher reloads the page rather than refetching, since every query is studio-scoped.
- Seat limits, the `invitation` table and the invite UI are deferred to the payments module.

## Alternatives

**Subscription on the user** — rejected; contradicts ADR 0001 and blocks invited coaches
from trying Traiv without paying.
**Per-coach client walls inside a studio** — rejected for now; harder to relax than tighten.
**Identity per studio (Slack's model)** — rejected; one login across studios is simpler and
matches Notion and Linear.
