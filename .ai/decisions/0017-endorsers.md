# 0017 — Endorsers and referral attribution
2026-10-06 · Status: accepted · Implements the affiliate programme in `positioning.md`

## Context

`positioning.md` already specified the programme: 40% for twelve months then 15%,
milestone bonuses at 5, 15 and 40 referrals, a 60-day clawback, two paid months before
any payout, and self-referral blocked. None of it existed.

Payouts need payments, which do not exist either. So this ADR covers **attribution only** —
who referred whom, recorded correctly. The money is calculated later from these rows, and
if the rows are wrong no commission logic can fix them.

## Decisions

**An endorser is a third thing a person can be**, alongside staff and client, and it is a
row rather than a flag — the same shape as `membership` and `client` (ADR 0004). Anyone
signed in can become one: a coach referring a peer, a client who liked the product, or
somebody who has never trained a day in their life.

**One endorser row per user**, enforced by a partial unique index. Two codes for one
person would let them split referrals and collect milestone bonuses twice.

**The referral attaches to the studio, not the coach**, because the studio is what
subscribes. `UNIQUE(studioId)` means a studio is attributed once, ever — without it, a
coach could re-enter a friend's code each month and mint commission, and attribution
would belong to whoever asked last rather than whoever actually referred.

**The code is validated before the OTP is sent**, not after verification. A typo caught
at signup is fixable; a typo discovered later is a referral the endorser earned and
nobody can see is missing.

**It is carried through signup on the challenge row**, exactly as `pendingName` is, and
the referral is written in the same transaction as the user and the studio. A referral
recorded separately could be lost while the account it belongs to survives, and that is
the one failure nobody can detect afterwards.

**An invalid code at verification time does not fail signup.** Losing one attribution is
bad; refusing to create an account over it is worse.

**`onDelete: "restrict"`** from referral to endorser. Money is owed against these rows,
so the endorser they point at cannot be deleted out from under them.

## Two bugs this work surfaced

**A correlated subquery that silently returned zero.** Drizzle renders interpolated
columns *unqualified* inside a `sql` template, so `where endorser_id = id` resolved `id`
against the subquery's own table — comparing `referral.endorser_id` to `referral.id`,
which is never true. Every endorser's referral count read 0. It did not error; it just
answered wrongly, which for a number someone is paid against is the worst possible
failure mode. Replaced with a join and a group-by.

**Drizzle wraps driver errors, so `err.code` is always undefined.** The Postgres code
lives on `cause`. The `isUniqueViolation` written during the auth hardening pass checked
the wrong level, so `rotateJoinCode`'s retry would have rethrown instead of retrying —
and nothing caught it, because the path only runs on a collision that cannot be
reproduced on demand. `lib/db-errors.ts` now walks the cause chain, and a test asserts
that `err.code` is undefined while the helper still finds the code.

## Not built

- **No payouts, commission or clawback.** They need payments. These rows are the input.
- **No endorser app.** The API is complete and tested; there is no UI yet.
- **Codes are not rotatable.** `referral.codeUsed` records the code as it was, so adding
  rotation later will not rewrite history.
- **No fraud checks beyond self-referral.** Someone could refer accounts they control.
  The 60-day clawback and two-paid-months rule in `positioning.md` are the intended
  defence, and both need payments to mean anything.
