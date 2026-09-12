# Architecture

## Shape

Monorepo. One backend, several Next.js frontends, one Postgres.

```
traiv.app             marketing, blog, macro calculator etc   Next.js (static)
trainer.traiv.app     coach app                           Next.js (SSR)
my.traiv.app          client PWA                          Next.js (static export + service worker)
endorse.traiv.app     affiliate portal                    Next.js (static)
admin.traiv.app       platform admin                      Next.js (static)
api.traiv.app         single API                          Node + Express 5
```

`traiv.app` is canonical. `traiv.dev` and `traiv.in` redirect to it.
Wildcard `*.traiv.app` is reserved — the client app moves to `<coach-slug>.traiv.app`
when white-label branding ships.

## Planned layout

```
traiv/
  apps/
    web/          marketing
    trainer/      coach app
    client/       client PWA
    endorse/      affiliate portal
    admin/        platform admin
    api/          Express API
  packages/
    db/           Drizzle schema + migrations
    core/         domain logic + zod schemas shared across apps
    api-client/   typed client
    tokens/       design tokens
    config/       tsconfig, biome, tailwind preset
  features/       feature specs
  .ai/            this knowledge system
```

## Decisions and why

**Standalone API, not Next route handlers.** Five frontends plus WhatsApp and Razorpay
webhooks hit the same backend. Coupling a payment webhook to the coach app's deployment
would be a mistake.

**Client app is static-exported Next.js.** It's 100% authenticated, has zero SEO value and
must work offline, so there is nothing for SSR to do. Static export + Serwist gives a
service worker without streaming-RSC complications, hosts anywhere, and has no cold start
when someone taps "log set" in a basement.

**One Postgres, no microservices.** Solo team.

**Share tokens, not components.** The coach app is dense desktop; the client PWA is
thumb-driven and sparse. Premature shared components would fit neither.

## Offline-first contract

The client app writes locally and syncs after. Ids for `workout_session`, `set_log`,
`food_log_entry` and `habit_log` are **minted on the device** (UUIDv7), so sync is
`INSERT … ON CONFLICT (id) DO NOTHING` — idempotent under any number of retries.
A logged set must never be lost. This is the single most important behaviour in the product.

## Auth

Passwordless-first. Identity lives in `user`; login methods live in `auth_identity`
rows (`password` / `google` / `apple` / `phone`), so a new provider is a row type rather
than a migration.

Signup: manual → name + phone → WhatsApp OTP → email (unverified) → done.
OAuth → email + name from provider → phone → WhatsApp OTP → done.
Whichever identifier you didn't arrive with, step two collects. Phone is always verified;
email never is at signup.

**Signup progress is derived, not stored** — `phone_verified_at IS NULL` → step 1,
`email IS NULL` → step 2. A stored step column drifts the first time someone resumes days later.

**Sessions are opaque tokens, not JWTs.** Removing a staff member or ending an impersonation
must kill the session immediately, which a JWT cannot do. httpOnly + Secure + SameSite=Lax,
scoped to `.traiv.app` so one session covers all subdomains. Rotate on privilege change.

**Clients do not self-signup** — they arrive via a coach's invite link bound to an existing
`client` row. Same login screen, same OTP; the difference is whether signup is reachable
without a token.

## Third-party boundaries

| Concern | Choice | Notes |
|---|---|---|
| Payments | Razorpay | Route / connected accounts. **We never hold coach funds** — holding them is payment-aggregator territory, which RBI licenses. |
| Messaging | WhatsApp **Cloud API direct**, no BSP | ADR 0009. Auth messages ~₹0.13; BSP markup would be 2–7× that. Meta Business verification + OTP template approval have **days-to-weeks lead time and block all of auth**. |
| Email | AWS SES | Behind a `Mailer` interface: `SesMailer`, `ConsoleMailer` (dev default), `NoopMailer`. Works on env vars alone. |
| Exercise media | EDB Pro, $599 one-time | Self-hosted, converted to WebM loops |
| Object storage | Cloudflare R2 | Zero egress — matters at ₹846 net per coach |

## Hosting

Next apps on **Vercel**. Postgres on **Neon**. API host still open — decided when the API
is first deployed, not now.

No CI on day one. Added on request.

## Reliability

`webhook_event` with `UNIQUE(provider, external_id)` — Razorpay and WhatsApp both retry,
and without it a redelivered payment credits a subscription twice and pays an affiliate twice.

`outbox` — outbound work (WhatsApp sends, invoices, risk recompute) is queued in the same
transaction as the state change that caused it.
