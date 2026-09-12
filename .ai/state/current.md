# Current state

**Updated:** 2026-09-11
**Phase:** monorepo root scaffolded · next is the database package, then auth

## How we work

**Phase by phase, feature by feature.** Questions get answered when the phase that needs
them arrives — not up front. A question about studios sharing clients is a Studio-tier
question and gets settled when Studio tier is built.

Do not block work on decisions that belong to a later phase. Do not pre-emptively design
for them either.

## What exists

```
traiv/
  apps/
    api/       Express 5 · auth + studios · Neon · console WhatsApp   ✅ running
    trainer/   Next 16 · /signin /signup /today /style               ✅ running
  packages/
    db/        6 tables, 4 migrations applied to Neon                ✅ live
    ui/        design tokens + 17 shadcn components                  ✅ shared
```

**Verified:** `turbo typecheck` 4/4 · `turbo build` · `biome check` clean ·
**32 scenario tests** passing against the live database.

### Auth — code complete (ADR 0005, 0010, 0012)

`/auth/challenge` · `/auth/verify` · `/auth/profile` · `/auth/me` · `/auth/logout` ·
`/auth/config` · `/auth/google/start` · `/auth/google/callback` · `/auth/dev/*`.

OTP HMAC-hashed with `SESSION_SECRET`, 5-minute expiry, single-use, only the newest code
per number valid, 5 attempts, 5 *successful* sends an hour. Sessions are opaque tokens,
revocable immediately. Signup step derived, never stored. `/auth/challenge` answers the
same whether or not the number is registered.

### OTP delivery (ADR 0012)

One transport interface, three implementations — MSG91 SMS, Meta WhatsApp, console.
Env-selected:

```
OTP_TRANSPORT=sms       # sms | whatsapp | console — one line to switch
OTP_FALLBACK=none       # fires only when the primary send throws
```

`auth_challenge` records `transport`, `sent_at`, `send_error`. A failed send does not
consume the user's quota. The server reports the delivering channel and the UI says so.
Production refuses to boot with a credential-less transport or `OTP_TRANSPORT=console`.

### Studios — complete (ADR 0011)

Every trainer owns one from signup, created in the same transaction. Slug
`firstname-xxxxxx`. Subscription belongs to the studio, so an invited coach still owns a
free one. Sessions open in: the session's studio → the studio that invited them → their
own. Switching verifies membership server-side. Switcher hides itself when there is one.

### Routes

```
web   /signin  /signup  /today (guarded)  /style     / redirects to /signin
api   /health  /auth/*  /studios  /studios/:id/activate
```

### Development without credentials

`ConsoleWhatsApp` prints the OTP to the API's stdout. A **Development sign-in** panel lists
seeded coaches and signs in with one click — it renders only if the API says the bypass is
on, and the API refuses to boot with `NODE_ENV=production` and `AUTH_DEV_BYPASS=true`.
`pnpm --filter @traiv/api seed` creates five coaches and backfills any missing studios.

### To go live, only env vars change

`WHATSAPP_*` switches the OTP transport to Meta Cloud API. `GOOGLE_CLIENT_ID` /
`GOOGLE_CLIENT_SECRET` turn on Google. `COOKIE_DOMAIN=.traiv.app` makes one session cover
every subdomain. No code changes.

## Blocked on things that are not code

| Blocker | Blocks | Needs |
|---|---|---|
| **DLT registration** | real SMS | A registered Indian company — GST/PAN. Individuals are not eligible. `MSG91_FLOW_ID` has nothing to put in it until the template is approved. **On hold by founder decision, 2026-09-12.** |
| **Meta Business verification** | real WhatsApp | Business documents; days to weeks, plus separate OTP template approval |
| **Google OAuth credentials** | Google sign-in | A Google Cloud OAuth client. The code has never executed. |

All three are behind the console transport and the dev bypass, so the full flow is
usable now and none of them blocks further feature work.

## What does not exist

No client roster, plans, nutrition or payments. No invite flow or seat limits — deferred
to the payments module. No client PWA, marketing, endorse or admin apps. **No HTTP-layer
tests** — routes, cookies and CORS are verified manually only. **360px has never been
checked** by anyone.
