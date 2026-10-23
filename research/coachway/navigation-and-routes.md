# Coachway — navigation and routes

**[V]** verified by visiting · **[I]** inferred · **[U]** unknown

## Front-end routes

Every route below was navigated to directly and its landing URL recorded.

| Requested | Lands on | Title | Note |
|---|---|---|---|
| `/` | `/clients` | Clients | **[V]** redirect; no dashboard route |
| `/clients` | `/clients` | Clients | |
| `/clients?status=pending` | same | Clients | **[V]** status is a query param |
| `/clients/<client-id>` | same | *client's name* | **[V]** title is the client's name |
| `/inbox` | `/inbox` | Inbox | |
| `/leads` | `/leads` | Leads | |
| `/automations` | `/automations` | Automations | |
| `/vault` | `/vault/resources` | Vault | **[V]** redirect to a default child |
| `/content` | `/content/articles` | Articles | **[V]** redirect to a default child |
| `/insights` | `/insights` | Insights | |
| `/workouts/exercises` | same | Exercises | |
| `/workouts/templates` | same | Workout Templates | |
| `/nutrition/recipes` | same | Recipes | |
| `/nutrition/ingredients` | same | Ingredients | |
| `/nutrition/templates` | same | Mealplans | **[V]** route says templates, title says Mealplans |
| `/forms` | `/forms` | Forms | |
| `/forms/metrics` | same | Metrics | |
| `/settings` | `/settings/account` | Account | **[V]** redirect to a default child |
| `/settings/billing` | same | Billing | |
| `/settings/statuses` | same | — | **[V]** its own route |

## Three different URL conventions, in one app

This is worth noting because it is inconsistent and Traiv should pick one.

**[V] 1 · Path segment** for sibling sections:
`/vault/resources`, `/content/articles`, `/workouts/exercises`, `/forms/metrics`

**[V] 2 · Query param** for a filter over one collection:
`/clients?status=pending` — the status tabs (Active / Pending / Paused / Ended / Members)

**[V] 3 · `?section=` param** for settings panes:
`/settings/account?section=client-defaults`
…yet `/settings/statuses` and `/settings/billing` are *path* routes. **[I]** Likely
historical: the older panes got routes, newer ones were added as sections of Account.

**Traiv already does (1) and (2) consistently.** Do not copy (3).

## Return-path preservation

**[V]** Clicking a client from a filtered roster produces:

```
/clients/<client-id>?from=%2Fclients%3Fstatus%3Dpending
```

The *filtered* list URL is URL-encoded into a `from` parameter, so the back control
returns to the exact view the coach left — not to a bare `/clients`.

**Traiv's `ClientHeader` currently hardcodes `href="/clients"`.** A coach who filtered to
Paused, opened someone, then pressed back lands on Active. This is a small, real
improvement and the cheapest thing on this list to adopt.

## Client status tabs

**[V]** Five buckets, each with a live count, rendered as stacked two-line buttons
(count above label):

```
0 Active   1 Pending   0 Paused   0 Ended   0 Members
```

**[V]** Counts come from `GET /clients/counts`, separate from `GET /clients`.

Against Traiv's three (`active`, `paused`, `archived`):

| Coachway | Traiv | Gap |
|---|---|---|
| Active | `active` | — |
| **Pending** | — | **[V]** a client who has been added but has not finished onboarding |
| Paused | `paused` | — |
| Ended | `archived` | naming only |
| **Members** | — | **[I]** a non-coached app user; see data-model-hypotheses |

**[I]** Traiv's schema already *has* `waiting` in the `client_status` enum (ADR 0013) but
the roster deliberately exposes only three. Coachway's "Pending" is the same idea,
surfaced. Traiv's test data shows the problem this solves: six of seven clients have
`userId = null` and show as Active, which is not true — they have not joined.

## Roster table columns

**[V]** Exactly:

```
Name · Status · Tags · Last message · Plans · Duration · (row menu)
```

**[V]** Traiv's clients table already renders these same seven columns. That convergence
was reached from screenshots; it is now confirmed against the live product.

**[V]** Observed row content: `Sathyam Client | Pending | No tags | No messages yet |
None | 24 Oct - | Open menu`. The Duration cell renders a start date with a trailing
dash for an open-ended relationship — the same `startedAt – endsAt|∞` shape Traiv built.

**[V]** Rows navigate via a JS `onclick` on `<tr>` (`cursor: pointer`), **not** an
anchor. There is no `<a href>` anywhere in the row.

**[I]** This is a worse choice than Traiv's. Traiv's name cell is a real `<Link>`, so it
is middle-clickable, keyboard-reachable and shows its target on hover, with a row-level
handler as a convenience on top. Keep Traiv's version.
