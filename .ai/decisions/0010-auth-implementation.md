# 0010 — Auth implementation decisions
2026-09-12 · Status: accepted · Extends ADR 0005

## Context

ADR 0005 set the auth architecture. These are the choices made while building it that
were not covered there.

## Decisions

**OTPs are HMAC-hashed with `SESSION_SECRET`, not plain SHA-256.** A six-digit code has a
million possibilities, so a bare hash of it is reversible from a leaked table in seconds.
Keying the hash means a database dump alone is not enough.

**`POST /auth/challenge` responds identically whether or not the number is registered.**
Otherwise it is a customer-enumeration endpoint.

**The signup name lives on the `auth_challenge` row.** It was briefly an in-memory `Map`,
which silently dropped the name on any API restart between the two steps and would have
broken outright on a second instance. Migration `0001_challenge_pending_name`.

**CORS is hand-written, not the `cors` package.** One known origin with credentials is
about ten lines, and `Allow-Origin` must echo a specific origin because `*` is rejected
alongside credentials.

**Apple sign-in dropped. Google only**, and the button renders only when
`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are both set — the UI asks the API via
`GET /auth/config` rather than promising a method that is not wired.

**A Google email matching an existing *unverified* email does not auto-link.** Our users
sign up by phone and type an email they never prove. Linking on that would hand the
account to whoever actually controls the mailbox. They are told to sign in by phone instead.

**`/today` is guarded client-side**, not by Next middleware. The API is the real authority
and rejects unauthenticated requests regardless; the guard only stops a signed-out person
seeing the shell. Middleware would need the same API round-trip.

**Sign-in and sign-up are separate routes** (`/signin`, `/signup`), not one page with a
state toggle. The toggle broke deep-linking, the back button, and left nowhere to put
`?ref=` for affiliate links — and `frontend.md` already said URL state belongs in the URL.

## Consequences

- Recovering an OTP in tests means brute-forcing a million HMACs; the suite takes ~90s
- `/auth/config` is a new public endpoint the UI depends on
- Google users arrive with no phone, so `needsPhone` gates them into the phone step
