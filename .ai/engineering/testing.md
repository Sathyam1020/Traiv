# Testing

## The doctrine

**We write scenario tests, not unit tests.**

This is deliberate and it is the opposite of what an agent will do by default. Left alone,
agents write thousands of tests that assert a mock was called, pass forever, and catch
nothing. That is slop with a green checkmark.

### The bug this doctrine exists to catch

A real one, from a real product. An interview rescheduling feature: candidate, interviewer
and co-interviewer could each reschedule. It was tested manually — candidate accepts, then
co-interviewer reschedules. Worked.

In production, rescheduling worked exactly **once**. After any one of the three acted, the
other two were locked out.

No unit test finds that. Every function was correct. The bug lived in **actor × state ×
ordering** — and only a scenario test that plays the second action ever sees it.

## What to test

Test at the **service / use-case layer**. Real database, real transactions, fake only
what crosses the network to a third party (WhatsApp, Razorpay, SES).

Every feature spec enumerates its scenarios before implementation, and must explicitly
cover these five, because this is where the bugs actually are:

1. **The second attempt.** The action runs twice. Retry, double-click, back button, webhook
   redelivery.
2. **Two actors.** Both act. Simultaneously, and one after the other.
3. **Out of order.** Step 3 before step 2. Accept after cancel. Pay after refund.
4. **After expiry.** The token, the mandate, the session, the invite — used past its life.
5. **Abandoned halfway.** Left mid-flow, returned three days later.

If a spec's scenario list doesn't cover all five, the spec isn't finished.

## What is banned

Writing these is a review failure:

- Asserting that a mock was called
- Testing framework or library behaviour (that Next routes, that Drizzle inserts)
- Snapshot tests of markup
- Tests of getters, constructors, or pure re-exports
- A test per function for its own sake
- Coverage targets. **We do not measure coverage.** It rewards exactly the tests above.

## Worked example — auth scenarios

Roughly ten tests cover all of auth, and each maps to a real way it breaks:

- Same phone signs up twice → **logs in**, does not create a second user
- Abandons after OTP, returns three days later → resumes at the email step, no duplicate
- Requests 5 OTPs, enters the 1st → rejected; only the newest code is valid
- Uses a valid OTP twice → the second attempt fails
- Google OAuth with an email that already has a password account → **the account-takeover
  vector**; must require phone verification before linking, never auto-merge on unverified email
- Phone belongs to user A, user B tries to verify it → fails, and does not leak that it's taken
- Signup begun on desktop, OTP entered on phone → the session lands on the desktop that started it
- Coach removes a staff member mid-session → their next request 401s immediately
- Invite link used twice → the second use fails
- Invite link whose client row was deleted → fails gracefully

## Layers

| Layer | Tooling | When |
|---|---|---|
| Scenario / service | TBD — runner not chosen | Every feature. The default. |
| Pure domain logic | same | Only where logic is genuinely intricate (macro maths, commission periods, risk scoring) |
| Component | — | Not written. UI is verified by `skills/ui-review.md`. |
| E2E | Playwright | v2. One smoke test on auth in v1. |

**TBD:** test runner not chosen — decide when the API is scaffolded, following
`dependencies.md`.

## Manual verification is not optional

Scenario tests do not replace opening the app. Before calling anything done: run it, at
360px, and do the thing a confused user would do.
