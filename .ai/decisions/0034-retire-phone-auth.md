# 0034 — Retire phone auth: Google OAuth + email OTP (Resend) only
2026-11-12 · Status: accepted · Supersedes the auth-method parts of ADR 0005, ADR 0009,
ADR 0010, ADR 0012, ADR 0016, ADR 0018

## Context
Phone auth has never actually worked end to end. WhatsApp Business verification never
completed (ADR 0009), so OTPs went out through an unregistered phone's SIM via a
third-party Android-SMS relay — not a provider, a single device, with no SLA and no DLT
registration for a real SMS fallback. Google sign-in existed alongside it, but did not
stand alone: `AuthGuard` forced every Google signup through a follow-up phone-verification
step (`/link-phone`) before it would let anyone in, because phone was still the
system-of-record identity ADR 0005 built around.

Chasing why OTPs weren't reaching iOS users surfaced the real problem — the transport
itself, not a bug in it — and the decision made in response was to stop operating a phone
channel at all rather than go fix or replace it again.

## Decision
**Google OAuth, or email + OTP sent via Resend. No phone number anywhere in auth, for any
app, for any user.**

The OTP mechanics ADR 0005 established — code hash, 5-minute expiry, attempt limits,
"newest code wins" via a partial unique index, per-identifier and per-IP rate limits — are
unchanged; they now run against `auth_challenge.email` instead of `auth_challenge.phone`.
`purpose` gets `email_verify` alongside the retired `phone_verify`/`phone_link`;
`otp_transport` gets `email` alongside the retired `sms`/`whatsapp`/`android-sms` — all
kept in their enum definitions, never written again, so no migration has to rewrite rows
that already reference them.

Google sign-in is now complete and self-sufficient the moment it returns — the
`/link-phone` detour, `AuthGuard`'s `needsPhone` gate, and the backend's
`requestPhoneLink`/`verifyPhoneLink`/`linkPhoneDirect` are deleted outright, not
deprecated. `requireAdmin()`'s phone match becomes an `ADMIN_EMAIL` env var matched
against `users.email` — the only admin-identification mechanism in the codebase, so this
had to move with everything else or admin access breaks.

One edge case Google sign-in didn't have before: an email collision against an account
that typed the same address at `/profile` but never proved it. Previously this returned
`needs_phone_to_link`, pointing the person at phone verification to resolve it — no longer
an option. Resolution now: if Google vouches for the address (`email_verified`), the
unverified claim on the other account was never real, so it loses the address and the
Google sign-in proceeds as a new account using it. If Google doesn't vouch for it either,
there's no safe way to tell who owns it, so the sign-in is refused (`email_conflict`)
rather than guessed at.

`@traiv/phone` and `PhoneField` are not retired — `apps/web`'s waitlist capture and the
`client.phone`/`user.phone` columns (denormalized contact info, unrelated to auth) still
use them. Only the auth path stops writing to them.

## Consequences
- Every app (trainer, client, admin, endorse) rewrote its own sign-in UI — there was never
  a shared auth-flow package, so this was four independent, near-identical edits rather
  than one.
- `signup_completed`'s tracked `method` becomes `"email" | "google"` — the `"phone"` value
  stops being written but stays valid for historical rows already on disk.
- Resend requires a verified sending domain before it can reach a real inbox; the console
  transport remains the dev/test fallback exactly as it was for phone.
- The MSG91, WhatsApp Cloud API, and android-sms-gateway integrations are deleted, not
  kept as unused fallbacks — there was no plan to use any of them again, and a retired
  transport sitting in the tree reads as "still an option" to the next person who looks.

## Alternatives
**Keep phone as a fallback alongside email** — rejected: the thing being retired is the
transport itself, which never worked reliably; keeping it as a fallback keeps the problem,
just quieter.
**Build a real SMS provider (DLT-registered) instead of retiring phone** — rejected as a
much larger lift (India's DLT registration process, ongoing per-message cost) for a
problem email + Google already solve at zero marginal infrastructure cost.
