# Testing workflow

Read `.ai/engineering/testing.md` first — the doctrine matters more than the mechanics.

## Writing tests for a feature

1. Open `features/<name>/tests.md`. Scenarios were enumerated at spec time, before
   implementation. If they weren't, the spec was incomplete — go back.
2. Confirm all five mandatory cases are covered: second attempt · two actors · out of
   order · after expiry · abandoned halfway.
3. Write them at the service layer. Real database, real transactions. Fake only what
   crosses the network to a third party.
4. Each test name states the scenario and the expectation:
   `"OTP requested five times, first code entered → rejected"`.

## Before writing a test, check it isn't banned

Asserting a mock was called · testing framework behaviour · markup snapshots · getters and
constructors · a test per function for its own sake. See `engineering/testing.md`.

## Running

TBD — commands land when the API is scaffolded and a runner is chosen.

## Manual verification

Always, regardless of test results. Open the app. Use it at 360px. Do the thing a confused
user would do: double-tap the button, go back mid-flow, lose connection halfway.
