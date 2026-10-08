# Traiv — context handoff

Paste everything below into a fresh agent.

---

You are picking up an in-progress product called **Traiv**. Read this whole brief before
touching anything, then read `.ai/README.md` and `.ai/state/current.md` in the repo.

## What it is

A white-label coaching platform for independent Indian coaches — personal trainers,
dietitians, nutritionists, yoga instructors, physiotherapists. Coaches pay; their clients
use it free under the coach's branding.

**The customer is the coach. The user is their client.** Coaches buy for coach-facing
features and cancel when their clients stop opening the app, so weekly-active-clients ÷
total-clients is the metric everything is judged on. Given two implementations, pick the
one more likely to get a client to open the app this week.

## Stack

pnpm workspaces + catalog (one version source) · Turborepo · Biome · Node 24.

| | |
|---|---|
| `apps/api` | Express 5, Drizzle ORM, Neon Postgres via pooled `pg`, Zod at the boundary, Vitest — port 4000 |
| `apps/trainer` | Next 16, React 19, Tailwind 4, shadcn/ui, TanStack Query, Zustand — port 3000 |
| `apps/client` | same stack — port 3001 |
| `apps/endorse` | referrer app — port 3002 |
| `apps/admin` | platform counts — port 3003 |
| `packages/db` | schema + migrations, 9 tables, 11 applied |
| `packages/ui` | design tokens + 22 shadcn components + the logo |
| `packages/phone` | the single definition of a valid phone number |

## The architectural idea you must not break

**There is no role column.** Identity lives in `user`. What you *are* comes from which
table your id appears in:

- a row in `membership` → you are staff of that studio (`owner` / `coach` / `staff`)
- a row in `client` → you are somebody's client
- a row in `endorser` → you refer coaches

One human can be all three at once with one account and one phone number. A trainer who
hires a coach at another studio is two membership rows, not a new account. This is ADR
0004 and it is load-bearing — a `role` column would collapse all of it.

Three authorization gates follow from that, and **they are never interchangeable**:

```
requireStudio({ param, role })   staff only; reads live membership per request
requireClient({ write })         clients only; status must be in a permitted set
requireAdmin()                   session phone === env ADMIN_PHONE; no table, no endpoint grants it
```

**Tenant comes from the URL, never the session.** `session.activeStudioId` means "where
to land after login" and authorizes nothing. A nonexistent studio and an inaccessible one
return byte-identical errors, so the API is not a membership oracle.

## Auth

Phone number is the only identity — no email, no username, no password. If the number is
wrong the account is unreachable forever.

- `POST /auth/challenge` → OTP, HMAC-hashed with `SESSION_SECRET`, 5-minute expiry,
  single-use, only the newest code per number valid, 5 attempts, 5 *successful* sends/hour.
  Answers identically whether or not the number is registered.
- `POST /auth/verify` → consumes the challenge and issues a session.
- `POST /auth/direct` → the `OTP=NO` development path. **Production refuses to boot with it.**
- Sessions are opaque tokens, revocable immediately. The signup step is derived from what
  the server knows about the account, never from a local guess, so an abandoned signup
  resumes in the right place.
- OTP transports: MSG91 SMS, Meta WhatsApp, console — one env line switches. A failed send
  does not consume the user's quota.

Google OAuth is written but unreachable: no credentials. SMS/WhatsApp are blocked on DLT
registration and Meta business verification. Until then `OTP=NO` in development.

## Phone numbers (ADR 0018)

`@traiv/phone` wraps `libphonenumber-js/mobile` and is the **only** definition of a valid
number — the API and all four apps import it. It replaced `/^[6-9]\d{9}$/` that had been
copy-pasted into nine places.

Country is a searchable dropdown over 245 countries, India first. Everything is stored as
E.164. Landlines are rejected because they cannot receive the code. No error message names
a specific country's digit rules. The `/mobile` metadata costs ~46 KB gzipped and loads on
`/signin` and `/signup` only.

## Endorsers (ADR 0017)

Attribution only — there are no payments, so no money is displayed anywhere. Anyone signed
in can become an endorser and gets an 8-character code. A coach enters it at signup; the
referral attaches to the **studio**, not the coach, with `UNIQUE(studioId)` so a studio is
attributed once ever. The code is validated before the OTP is sent.

## Testing doctrine (.ai/engineering/testing.md)

Scenario tests against a real database and the real service layer. Nothing is mocked —
the bugs worth catching live in the interaction between rows and ordering, which a mock
hides. Every feature gets tested for: **the second attempt, two actors, out of order,
after expiry, abandoned halfway.** Unit tests of pure functions are mostly noise here.

157 tests, ~2s, against local Postgres via `TEST_DATABASE_URL`. Against Neon it took 515s.

## Hard rules

- **Never invent product requirements.** Pricing, copy, features, business rules — if it
  is not in `.ai/`, it is not decided. Ask.
- **Never add a dependency without `.ai/engineering/dependencies.md`**: check the registry
  for the latest version, fetch and read the current docs *before* installing, record it
  in the table with a justification. Versions live in the pnpm catalog, never as literals.
- **Never invent a colour, font size, spacing, radius or duration.** Use tokens.
- **Never suppress a type error.** No `any`, no `@ts-ignore`, no `!` to silence tsc.
- **The repo is public. Never commit `.env` or any credential.**
- **Minimal code.** No defensive scaffolding, no abstraction for one call site, no
  commentary restating what the line does. Comments explain *why*, and only where a
  reader would otherwise be puzzled.
- Done means: behaviour matches spec, loading/empty/error states deliberately designed,
  works at 360px *tested not assumed*, keyboard reachable, scenario tests pass, no token
  invented, `.ai/state/current.md` updated, decisions recorded in `.ai/decisions/`.

## The failure mode this codebase keeps having

**Silent failure.** Blank pages instead of errors. A count returning 0 instead of throwing.
A stale dev process serving code from eleven hours ago. `.env` quietly disabling the test
that proved codes cannot be skipped. A Drizzle correlated subquery comparing the wrong
column because interpolated columns render unqualified inside `sql` templates, so it
matched nothing and reported zero rather than failing.

Fixes consistently move the check **into the database** (atomic updates, partial unique
indexes on `deleted_at is null`, check constraints) or **into one shared module**, rather
than relying on every caller remembering. Prefer that shape.

Two specific traps already paid for:
- Drizzle wraps driver errors, so `err.code` is undefined — the Postgres code is on
  `cause`. `apps/api/src/lib/db-errors.ts` walks the chain.
- Interpolated columns render *unqualified* inside `sql` templates. Use joins, not
  correlated subqueries.

## What exists and works

Auth for all four apps, separate `/signin` and `/signup` routes, studios and memberships,
join-by-code creating client rows, seat limits (free 2 / starter 8 / pro and studio
unlimited), endorser attribution with a UI, admin counts. 18 ADRs in `.ai/decisions/`.

## What does not exist

**Everything that makes it a coaching product.** No exercises, programmes, workouts, logs
or check-ins — those tables have never been designed. No payments, no nutrition. No
coach-facing roster UI and no way to add a client by hand; `joinByCode` is the only path
that creates a client row. A full roster throws instead of waitlisting (ADR 0013). No
marketing site. Payouts need payments.

The coaching data model is the real blocker for v1. Everything above is scaffolding around
a product that cannot yet do the thing it is sold for.

The trainer and client UIs have had **no adversarial review, and 360px has never been
checked by anyone.**

## Current state

Branch `auth/authorization-hardening`, with uncommitted work: the country-agnostic phone
package and two fixes to buttons that were enabled when they should not have been. Last
verified: 157 tests pass, `pnpm -r typecheck` 8/8, `turbo build` 4/4, `biome check` clean.

Start by reading `.ai/state/current.md` and `.ai/decisions/README.md`, then ask what to
build. Do not start writing code from this brief alone.
