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
    api/       Express 5 · auth, studios, clients, endorsers · Neon   ✅ running
    trainer/   Next 16 · coach app, :3000                             ✅ running
    client/    Next 16 · client app, :3001                            ✅ running
    endorse/   Next 16 · referrer app, :3002                          ✅ running
    admin/     Next 16 · platform counts, :3003                       ✅ running
  packages/
    db/        12 tables, 14 migrations · 0012-13 not yet on Neon    ⚠️  pending
    ui/        tokens, 25 components, the shell every app uses        ✅ shared
    phone/     the one phone rule, 245 countries (ADR 0018)           ✅ shared
    nutrition/ BMR → TDEE → kcal → macros, no AI (ADR 0019)          ✅ shared
```

**Verified:** `pnpm -r typecheck` 9/9 · `turbo build` 4/4 · `biome check` clean ·
**207 tests** in ~3s against a local Postgres (`TEST_DATABASE_URL`).

### Auth — code complete (ADR 0005, 0010, 0012)

`/auth/challenge` · `/auth/verify` · `/auth/profile` · `/auth/me` · `/auth/logout` ·
`/auth/config` · `/auth/google/start` · `/auth/google/callback` · `/auth/dev/*`.

OTP HMAC-hashed with `SESSION_SECRET`, 5-minute expiry, single-use, only the newest code
per number valid, 5 attempts, 5 *successful* sends an hour. Sessions are opaque tokens,
revocable immediately. Signup step derived, never stored. `/auth/challenge` answers the
same whether or not the number is registered.

### Client onboarding (ADR 0019)

Six steps between verifying a phone number and the client's home: goal, body, activity and
training, nutrition, a note for the coach, availability. **It blocks Today** — until it is
finished the home screen redirects into it. Each step saves as it is left, so a half-finished
intake resumes rather than restarts.

The answers are keyed on the **user**, not the coaching relationship, so hiring a second
coach asks nothing twice.

Finishing computes a calorie and macro target through `@traiv/nutrition` — Mifflin-St Jeor,
no model involved, every target storing the derivation that produced it. Pregnancy, the
conditions that need clinical context, extremes of BMI or age, and an undisclosed sex all
produce a `proposed` target that waits for the coach instead of reaching the client.

Weight lives in `body_metric` as a series, and targets are append-only, because both are
what the adaptation loop will read. Neither the loop nor any AI generation is built yet.

### Phone numbers (ADR 0018)

`@traiv/phone` wraps `libphonenumber-js/mobile` and is the only definition of a valid
number — the API, all four apps and the seed import it. The country is a dropdown over
245 countries, India first; everything is stored as E.164; landlines are rejected because
they cannot receive the code; no error message names a specific country's digit rules.

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
trainer :3000   /signin  /signup  /dashboard (guarded)  /settings (guarded)
client  :3001   / (sign in)  /dashboard (guarded)  /join/:code

api :4000
  /health  /auth/*
  /studios                             your memberships
  /studios/:id/activate                requireStudio({ param: "id" })
  /studios/:studioId/join-code         requireStudio()  — any member
  /studios/:studioId/join-code/rotate  requireStudio({ role: "owner" })
  /studios/:studioId/join-code PATCH   requireStudio({ role: "owner" })
  /join/:code                          GET public preview, POST attaches
  /c                                   studios you are a client of — ungated by design
  /c/:studioId/me                      requireClient()
  /e/code/:code                        public endorser-code check
  /e/join · /e/me · /e/referrals       your own endorser record
```

**Authorization.** Three relationships, three gates, never interchangeable:
`requireStudio` for staff (ADR 0014), `requireClient` for clients, and endorser routes
scoped to the caller's own row. The studio always comes from the URL —
`session.activeStudioId` is where to land after signing in and authorizes nothing
(ADR 0016).

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

No plans, nutrition or payments. The `client` table, the join code and seat limits
(free 2 / starter 8 / pro and studio unlimited) exist and are tested; a full roster
currently throws at the client rather than waitlisting — see ADR 0013. There is no
coach-facing roster UI and no way to add a client by hand: `joinByCode` is the only
path that creates a client row.

The client app exists but only does auth and attach — no workouts, logs or check-ins,
because those tables do not exist. Endorsers have a tested API and a UI (ADR 0017) but
payouts need payments, so no money is shown anywhere. The admin app shows counts only.

The trainer and client UIs have had no adversarial review. **360px has never been
checked** by anyone.

### Layout (ADR 0020)

One shell in `packages/ui/src/components/shell/`. `AppShell` — fixed sidebar from `lg`,
floating capsule bar below — for the trainer and client apps; `TopBar` for endorse and
admin, which have one screen each. `Page` is the single content measure at 1280px.

`lg` is the only breakpoint where navigation changes shape, and it is written once.
Single-task forms and long-form text stay narrow on purpose; everything else fills.

The client's tabs are **Today** and **You**, growing to Today · Plan · Progress · Chat · You
as features land.

## The marketing site (`apps/web`, port 3004)

Twenty-four routes, every one of them prerendered — `next build` shows no route that is
not `○` or `●`. Content lives in typed files under `src/content/`, so a feature, a
competitor, a guide or a tool is a data entry rather than a new page.

| Route | What is on it |
|---|---|
| `/` | Hero, the Sunday problem, the price wall, six promises, what you get, testimonials, pricing, FAQ |
| `/pricing` | Three tiers with a monthly/yearly switch, the price wall, the add-on table, a 12-question FAQ |
| `/features` + 12 × `/features/[slug]` | Every screen, with the four unbuilt ones marked |
| `/compare` + 5 × `/compare/[slug]` | Trainerize · FitBudd · Everfit · TrueCoach · Coachway |
| `/tools` + 3 calculators | Macro calculator (runs `@traiv/nutrition`), income, what to charge |
| `/guides` + 3 guides + `/guides/templates` | Written, not generated. Templates are copy-to-clipboard |
| `/coaches` · `/about` · `/partnership` · `/affiliate` · `/demo` | |
| 3 × `/legal/[doc]` | **Drafts, `noindex`, and labelled as drafts on the page** |
| `sitemap.xml` · `robots.txt` · `not-found` | Sitemap is derived from the content files |

Three things to know before touching it:

- **Signing up is not open, so every button opens the launch-list form.** One component,
  `NotifyMe`, asks for an email and/or a phone and an explicit consent checkbox, and
  writes to `waitlist` through `POST /m/waitlist`. When signup opens, that component
  becomes a link in one place. See ADR 0021.
- **`src/content/testimonials.ts` is invented and says so at the top.** Six fake coaches
  are on the landing page right now. They have to be replaced with real attributed quotes
  before the site is public — published testimonials from people who do not exist are a
  misrepresentation under the Consumer Protection Act's endorsement rules.
- **No competitor number without a source and a date.** `comparison.ts` and
  `competitors.ts` enforce it; only the Coachway figures were read off a live pricing page
  (2026-10-08) and the rest render as "recorded, not re-checked since".
- **The legal pages need a lawyer and three values** — registered entity, GSTIN, grievance
  contact. A payment gateway will ask for all three, so this blocks launch, not just the
  site.

`@traiv/nutrition` now imports its own modules through its `exports` map
(`@traiv/nutrition/bmr`) rather than `./bmr.js`. Turbopack does not strip a `.js`
extension off a `.ts` file, so the public calculator could not bundle the package at all.
A new module in that package needs an `exports` entry.

360px is still unverified by eye on the marketing site — the browser extension was not
connected. Every table is inside its own `overflow-x-auto`, which is the only place the
page can go wider than the viewport.

### Components, animation and the blog

Everything on the site is a shadcn component on the repo's own tokens — the header is
Radix `NavigationMenu` (which tracks pointer direction, so the dropdown no longer closes
while you are moving toward it), the mobile menu is `Sheet`, the billing switch is
`Tabs`, and the calculators use `Select`, `Slider` and `ToggleGroup`. A short-lived
hand-rolled `field.tsx` is gone: `globals.css` already aliases every shadcn variable onto
the three-tier tokens, so shadcn components were always going to match.

**`tw-animate-css` was missing and nobody knew.** Every shadcn component in the repo is
written against `animate-in` / `fade-in-0` / `zoom-in-95`, which are not Tailwind
utilities — so every dialog, dropdown, sheet and tooltip in all five apps had been
appearing and vanishing with no transition at all. An unrecognised class is simply not
emitted, so there was no warning. One `@import` in `globals.css` fixes it everywhere.

Scroll reveals are CSS behind a `[data-js]` flag set by an inline script, toggled by one
`IntersectionObserver` per element (`Reveal`). Deliberately not a motion component per
section: a library's `initial={{ opacity: 0 }}` is rendered into the HTML, so a bundle
that fails to load leaves the whole page invisible.

`/blog` and `/blog/[slug]` render posts from the database with `revalidate = 60`.

### The marketing backend

| Route | Who | What |
|---|---|---|
| `POST /m/waitlist` | public | The launch list. Idempotent per person, never clears a detail a later blank submission omitted |
| `POST /m/collect` | public | Analytics beacon, batched up to 20 events, 204 whatever happens |
| `GET /m/blog`, `/m/blog/:slug` | public | Published posts only; a draft 404s rather than 403s |
| `GET /admin/analytics?days=` | admin | Nine aggregates in one request |
| `GET /admin/waitlist` | admin | The only admin surface that reads personal data |
| `GET/POST/PATCH/DELETE /admin/posts` | admin | The CMS |

**Analytics store no identifier.** A visitor is a hash of a daily rotating salt, their IP
and their user agent; the IP is never written and the salt is deleted the next day. Daily
uniques are therefore exact and "returning visitors" is unanswerable — the trade that
means the site needs no consent banner. Bots are dropped in the collect handler, not in
nine dashboard queries.

The admin app now has four screens (Platform · Analytics · Launch list · Blog) and moved
from `TopBar` to `AppShell`. The waitlist CSV export can only contain people who ticked
the consent box.

**Still to do before launch:** nobody has actually been sent the announcement the form
promises — that needs a mailer and a job, and `waitlist.notifiedAt` exists for it.
