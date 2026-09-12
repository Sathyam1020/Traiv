# Auth

Covers sign-in, sign-up, sessions, OTP delivery and studio creation.

## Problem

A coach needs an account and a studio to own their work. Every point of friction costs
activation, and activation is the metric the business is judged on.

## Users

Coaches signing up or signing in. **Clients do not use this flow** — they arrive by
invite (ADR 0005), which is not built.

## Flow

```
/signup   name + phone → OTP → email (skippable) → /today
/signin   phone        → OTP → /today
Google    consent → email + name from Google → phone + OTP → /today
```

Whichever identifier the user did not arrive with is collected next. **Phone is always
verified. Email never is at signup** — verification is optional, later.

Signing up creates the trainer's own studio in the same transaction, owned by them.

## Functional requirements

**OTP** — 6 digits, 5-minute expiry, single-use, only the newest code per number is valid,
5 attempts per code, 5 *successful* sends per number per hour. HMAC-hashed with
`SESSION_SECRET`, never stored in plaintext.

**Delivery** — one transport interface, env-selected (`OTP_TRANSPORT`), optional fallback
on send failure (`OTP_FALLBACK`). The server returns which channel delivered and the UI
says so. A failed send records the error and does not consume the hourly quota.

**Enumeration** — `POST /auth/challenge` returns an identical response whether or not the
number is registered.

**Sessions** — opaque tokens, hashed at rest, revocable immediately. Signup progress is
**derived** (`phoneVerifiedAt` / `email` null), never stored.

**Studios** — every trainer owns one from signup. Slug `firstname-xxxxxx`. Sessions open
in: the session's studio if still valid → the studio that invited them → their own.
Switching verifies membership server-side.

**Google** — offered only when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
A Google email matching an existing **unverified** email must not auto-link.

## Non-functional

- Development works with zero third-party credentials (console transport, dev bypass)
- Production refuses to boot with a misconfigured transport or the dev bypass enabled

## States

Loading on every submit (label changes, control disabled) · errors inline and specific ·
resend behind a 30-second countdown · `/today` shows a checking state while the session
resolves.

## Permissions

`/auth/profile`, `/auth/me`, `/studios*` require a session. `/auth/dev/*` requires
`AUTH_DEV_BYPASS=true` and a non-production `NODE_ENV`.

## Scenarios

`tests.md` — 32 implemented and passing.

## Not built

Client invite flow · email verification · Apple sign-in (dropped, Google only) ·
password credentials · seat limits and the `invitation` table (payments module) ·
HTTP-layer tests (routes, cookies, CORS are covered manually only).
