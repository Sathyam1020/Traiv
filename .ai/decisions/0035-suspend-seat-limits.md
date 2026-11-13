# 0035 — Suspend Free/Starter seat limits until payments exist
2026-11-13 · Status: accepted · Temporarily suspends the "Free and Starter tiers need
enforced client limits" consequence of ADR 0001

## Context

`joinByCode` (`apps/api/src/features/client/join.ts`) enforces ADR 0001's per-tier seat
caps — Free at 2 clients, Starter at 8 — by rejecting a join past the limit with "This
coach's roster is full. Ask them to upgrade, then try again." There is no payment flow
yet, so "upgrade" is not something a coach can actually do. The cap's only real effect
right now is turning away real users trying the product, for a limit that exists to
protect revenue that does not yet exist to protect.

## Decision

**Every tier is unlimited until payments ship.** `SEAT_LIMIT` in `join.ts` maps every
tier — including `free` and `starter` — to `null`. The enforcement code itself,
including the studio-row lock that makes a concurrent seat count race-safe, is
unchanged and untouched; only the numbers are reset to "no limit," the same way `pro`
and `studio` already read. Restoring real caps when payments exist is flipping
`free`/`starter` back to numbers, not rebuilding anything.

## Consequences

- A Free-tier coach can take an unbounded roster today. Acceptable: the cost of a
  coach with 50 unpaying clients is borne for a short, known window, not indefinitely —
  this gets revisited the moment payments exist, not left to drift.
- `join.test.ts`'s former "seat limits" scenarios (reject past two, succeed after
  upgrading) are replaced with one confirming a free studio now takes a third client,
  and the concurrency scenario now expects both concurrent joiners to succeed rather
  than one losing a race for "the last slot" — there is no last slot right now.
- ADR 0001's pricing itself — ₹999 unlimited hero, Free/Starter/Studio numbers — is
  unchanged. Only enforcement is suspended.

## Alternatives

**An env flag / feature toggle instead of editing the table directly** — rejected: the
table already expresses "no limit" as `null` for `pro`/`studio`; a second mechanism to
turn the same thing off would be two ways to express one idea. **Raise the numbers
instead of nulling them** — rejected: an arbitrary larger number is still a cap someone
will hit, and still implies a decision about where the real line is that has not
actually been made yet.
