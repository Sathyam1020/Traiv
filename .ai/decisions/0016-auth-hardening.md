# 0016 — Auth hardening after external review
2026-10-06 · Status: accepted · Amends ADR 0005, ADR 0010

## Context

An external review of the schema found twelve issues. Verified against the code, nine
landed; three were already handled and the reviewer could not see it, because only the
schema was shared. The three it got wrong are worth recording so nobody re-"fixes" them:

- **OTPs were already HMAC'd** with a server-side key, not plainly hashed.
- **Federated pre-hijacking was already blocked** — Google refuses to auto-link to an
  account whose email was never verified.
- **Primary keys were already UUIDv7**, so inserts were never scattered.

## Decisions

**The OTP verify is atomic.** It read the row, checked `attempts`, compared, then
incremented — so twenty concurrent requests all read zero and shared one attempt between
them. Verified: the old code left `attempts` at 1 after twenty guesses; it now reaches the
cap of 5 and refuses the rest. Spending happens in one `UPDATE … WHERE attempts < max …
RETURNING`, with every precondition in the WHERE, so the database decides who gets the
attempt. Consuming is conditional on still being unconsumed, so two correct submissions
produce one session.

**Resending no longer resets the budget.** Per-challenge attempts reset with each new
code, which made the cap cost an attacker a resend. Failures are now summed per number
over the last hour.

**One live code per target, enforced by a partial unique index.** "Only the newest code is
valid" was a query-ordering convention that a double-tap on resend could break. Issuing
supersedes live rows in the same transaction.

**OTPs get their own pepper and are bound to their challenge.** A six-digit code and a
256-bit token should not share a key, and without the id in the HMAC the same digits hash
identically in every row.

**Phone numbers have one representation.** `toE164` was `` `+91${input}` `` with no
validation — it would happily produce `+91+919876543210`. It now normalises the six forms
people actually type and rejects anything it cannot store, and CHECK constraints enforce
the shape on `user`, `client` and `auth_challenge` so a path that skips the normaliser
fails loudly.

**Unique indexes are partial on `deleted_at is null`.** A deleted account held its phone
number forever and a removed coach could not be re-invited. The pattern already existed on
`client`; it was never applied anywhere else.

**The phone credential lives in one place.** `auth_identity` held a `phone` row duplicating
`user.phone`: two rows, two update paths, and a stale identity that would outlive a changed
number and let its next owner authenticate. `auth_identity` is now federated providers
only.

**`activeStudioId` no longer authorizes anything.** One session is shared by every tab, so
a coach with studio A open in one and B in another had the first tab's writes land in B —
and the membership check passed, because they belong to both. Every studio-scoped route
names its studio in the path, `requireStudio` requires that parameter, and the session
value is only where to land after signing in. The trainer app holds the current studio in
per-tab state.

**Linking a federated identity revokes existing sessions**, and a verified Google claim
evicts an unverified holder of that address — otherwise an unverified claim blocks the
real owner forever behind a unique index nobody can lift.

**`lastUsedAt` is throttled to five minutes** and not awaited. Touching it per request made
every page load a write on the hottest table.

**Retention exists.** `pnpm --filter @traiv/api retention` purges expired challenges and
dead sessions after 30 days and scrubs IP and user-agent from older rows. Nothing was ever
deleted before, and those columns are personal data under the DPDP Act.

## Known and deliberately not fixed

- **No captcha on send.** Per-phone, per-IP and country limits are in; Turnstile needs an
  account and a key. SMS pumping remains the main cost risk until it lands.
- **No global daily send budget.** Needs somewhere to alert to.
- **Phone recycling.** Indian carriers reassign numbers after ~90 days, and for a client
  the number is the only credential. `phoneVerifiedAt` now refreshes on every successful
  OTP so dormancy is measurable; the policy itself is undecided.
- **Account deletion does not scrub PII**, because there is no deletion flow yet. When one
  is built it must revoke sessions and null email, phone and name in the same transaction —
  `client.constraints` holds health data.
- **`client_invite` and `password_reset`** remain unused enum values. Invites need their own
  table — long-lived, looked up by token, belonging to a client rather than a phone — not a
  purpose on `auth_challenge`.
- **Impersonation is not implemented.** The session comment claimed it as justification for
  opaque tokens; the justification is revocation, and the comment now says so.

## Why the review found what we did not

Everything built here was tested for behaviour, not for adversaries. The testing doctrine
lists "two actors" as mandatory and it had been applied to studios, clients and seat
limits — never to the OTP flow, which is the one place a race is directly exploitable.
The partial-index pattern was understood well enough to be used on `client` and documented
there, and never swept across the other tables. Construction and review find different
things, and no review pass was scheduled.
