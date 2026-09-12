# Security

## Authorization

The default risk in this product is one coach reading another coach's clients. Every
handler authorizes explicitly; every tenant query scopes by `org_id`. Load the resource,
then check its org — never trust an org id from the request body.

## Sessions

Opaque tokens, not JWTs — revocation must be immediate. httpOnly, Secure, SameSite=Lax,
scoped to `.traiv.app`. Rotate on privilege change. Revoking kills the row.

## OTP

6 digits, 5-minute expiry, hashed at rest, single-use, constant-time compare. Only the
newest code is valid. Rate limits: 5 sends per phone per hour, 5 attempts per code,
limited independently per-IP and per-phone.

## Account linking — the takeover vector

OAuth returning an email that already exists as a password account must **never**
auto-merge. Require phone verification before linking. This is the single most likely way
someone takes over a coach's account.

## Secrets

Env vars only, parsed through a zod schema at boot. Never logged, never in client bundles,
never in error messages. Anything reaching the browser is public — only `NEXT_PUBLIC_*`.

## Webhooks

Verify the signature before doing anything else. Razorpay and WhatsApp both sign; an
unverified webhook handler is an unauthenticated write endpoint.

## Payments

**We never hold coach funds.** Razorpay Route or connected accounts, so money goes
directly to the coach. Holding it would put us in payment-aggregator territory, which RBI
licenses.

## Impersonation

Admin "view as coach" is audited — every impersonation writes an `audit_log` row with
actor, target, and what was done. Build the audit trail with the feature, never after.

## Uploads

Progress photos and form-check videos are private by default. Validate type and size
server-side, store outside the web root, serve through signed short-lived URLs. Never
trust a client-supplied content type.

## PII

Phone numbers, progress photos and health constraints are sensitive. Never in logs, never
in analytics event properties, never in error reports.
