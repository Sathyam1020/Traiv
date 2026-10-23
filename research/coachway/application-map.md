# Coachway — application map

Reconnaissance of an authorised trial account, 24 Oct 2026. Research only; nothing was
created, deleted, sent or billed. Every finding is marked **[V]** verified by observation,
**[I]** inferred, or **[U]** unknown.

The client UUID observed in this account is written as `<client-id>` throughout. No
credentials, session tokens or personal data are stored in these documents.

## Two hosts, not one

**[V]** The product is split across two origins, and this is the first structural fact
worth copying or rejecting deliberately:

| Host | Role |
|---|---|
| `app.coachway.io` | The SPA. Serves HTML, JS, `version.json` |
| `api.coachway.io` | Every data call. No `/api` prefix — resources sit at the root (`/clients`, `/account`) |
| `r2-cdn.coachway.io` | Static config, including `maintenance.json` |
| `o4509909574090752.ingest.de.sentry.io` | Sentry error reporting, EU region |

**[V]** `GET app.coachway.io/version.json` is polled by the running client. **[I]** This is
a "a new version shipped, reload" check — the standard pattern for a long-lived SPA.

**[V]** `GET r2-cdn.coachway.io/maintenance.json` is fetched on load from a CDN rather
than the API. **[I]** Deliberate: a maintenance banner must still work when the API is the
thing that is down. Traiv has no equivalent.

## The shell

**[V]** Persistent left sidebar, dark navy (`--secondary: #0a1729`), against a white
content area. A "Toggle Sidebar" control is present on every page.

**[V]** Sidebar groups, in order:

```
Clients · Inbox · Leads · Automations · Vault · Content · Insights
Workouts  → Exercises · Templates
Nutrition → Recipes · Ingredients · Mealplan
Forms     → Forms · Metrics
Settings  → Settings · Billing
```

**[V]** Three groups (Workouts, Nutrition, Forms) are collapsible parents with children;
the top seven are flat destinations. This is the same `NavGroup[]` shape Traiv's
`AppShell` already takes.

## Global chrome, present on every route

**[V]** Observed on all 16 routes visited:

- Account switcher, top-left: `TR Traiv Coachway` (account name + avatar)
- **Notifications** bell with an unread count (`/notifications/unread-count`)
- Inbox unread count, fetched separately (`/inbox/unread-count`)
- **Open calendar** control
- User menu, bottom-left: `S Sathyam sahu` + role label `Administrator`
- "Quick navigation" — **[I]** a command palette, present as a heading on every page
- "Product tour overlay" — **[V]** appears on Workouts, Nutrition and Forms pages only

**[V]** Every page issues the same six-call preamble before its own data:

```
GET /users/me          GET /account        GET /users/team
GET /notifications     GET /notifications/unread-count   GET /inbox/unread-count
```

**[I]** This is an unbatched per-navigation refetch rather than a cached session bootstrap.
On Traiv's India→us-east-2 latency this pattern would cost ~1.5s on every single
navigation. Worth not copying — see `unknowns-and-limitations.md`.

## Modules

| # | Module | Route | State in this account |
|---|---|---|---|
| 1 | Clients | `/clients` | 1 client, Pending |
| 2 | Inbox | `/inbox` | Empty; has a Photo log sub-view |
| 3 | Leads | `/leads` | Empty; has conversion analytics |
| 4 | Automations | `/automations` | Empty |
| 5 | Vault | `/vault/resources` | Empty |
| 6 | Content | `/content/articles` | Empty; Articles · Cookbooks · Workout packs |
| 7 | Insights | `/insights` | Populated chrome, no data |
| 8 | Exercises | `/workouts/exercises` | **Seeded library present** |
| 9 | Workout templates | `/workouts/templates` | Empty |
| 10 | Recipes | `/nutrition/recipes` | Empty |
| 11 | Ingredients | `/nutrition/ingredients` | **Seeded library present** |
| 12 | Mealplans | `/nutrition/templates` | Empty |
| 13 | Forms | `/forms` | Seeded (onboarding form exists) |
| 14 | Metrics | `/forms/metrics` | **Seeded library present** |
| 15 | Settings | `/settings/account` | 14 sub-sections |
| 16 | Billing | `/settings/billing` | Live subscription |

**[V]** Three libraries ship seeded on a brand-new trial account: **exercises,
ingredients and metrics**. A fourth, forms, ships with at least a default onboarding form.

**[I]** This is the single most important operational finding for Traiv. Your `exercise`
and `food` tables are empty, which is why no plan can generate. Coachway treats a seeded
library as part of account creation, not as a later content project.

## What the sidebar does not contain

**[V]** No "Dashboard" or "Today" route. `/clients` is the landing page — navigating to
`/` redirects there. **[I]** The roster *is* the home screen; Insights is a separate
analytics destination rather than a daily driver.

Traiv has a `/dashboard` (Today) as its first nav item. Worth deciding whether that is a
considered difference or an accident.
