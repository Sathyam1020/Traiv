# Coachway — user flows

Only flows actually walked are recorded as verified. Flows requiring a write, a send, a
payment or an invite were excluded by the brief and are marked **[U]**.

## Flow 1 — Coach opens a client **[V]**

Walked end to end.

```
/clients                       default tab = Active
  → GET /users/me, /account, /users/team, /notifications,
        /notifications/unread-count, /inbox/unread-count      (shell preamble)
  → GET /clients, GET /clients/counts
  → Active is empty: "No clients found"

click "1 Pending"
  → URL becomes /clients?status=pending          (query param, no reload)
  → table renders: Name · Status · Tags · Last message · Plans · Duration

click the row  (onclick on <tr>, no anchor)
  → /clients/<client-id>?from=%2Fclients%3Fstatus%3Dpending
  → document.title becomes the client's name
  → GET /clients/:id, /clients/:id/settings,
        /clients/:id/history, /clients/:id/overview
  → heading "Onboarding Pending"; pills Chat · Tasks · Notes
```

**Observations**

- **[V]** The filtered list URL is preserved in `from=`, so back returns to Pending.
- **[V]** Four parallel calls for the detail page; the overview is one aggregate.
- **[V]** The six-call shell preamble repeats on every navigation.
- **[V]** Pages take **8–14 seconds** to render interactive controls in this account.
  Measured: a status tab was not in the DOM 9s after navigation but was present by 14s.

**[I]** That is slow enough that Traiv's current roster (~0.85s warm) is already ahead,
and worth not regressing when the overview is built.

## Flow 2 — Status filtering **[V]**

**[V]** Tabs are buttons, not links; the count sits above the label on two lines.
**[V]** Selecting one rewrites the query string without a document load.
**[V]** Counts come from a separate `/clients/counts`, so they are correct for the whole
roster rather than the current page.

**[I]** Traiv does the same thing with chips in the URL — convergent, and Traiv's are
already real links, which is better for back/forward.

## Flow 3 — Settings navigation **[V]**

```
/settings  → redirects to /settings/account
click "Client defaults" → /settings/account?section=client-defaults
                          (section param, same route)
click "Statuses"        → /settings/statuses
                          (its own route — inconsistent with the above)
/settings/billing       → its own route
```

**[V]** Two different mechanisms for the same kind of navigation. Documented in
`navigation-and-routes.md` as the one convention not to copy.

## Flow 4 — Module landing redirects **[V]**

`/vault → /vault/resources`, `/content → /content/articles`,
`/settings → /settings/account`. **[I]** Each parent nav item points at a default child
rather than a hub page.

## Not walked

| Flow | Why |
|---|---|
| Create a client **[U]** | Would write data |
| Send a message / video reply **[U]** | Excluded: no real client communications |
| Complete a check-in **[U]** | Requires an onboarded client and a write |
| Build a workout or meal plan **[U]** | Would write data |
| Create a form or metric **[U]** | Would write data |
| Activate an automation **[U]** | Explicitly excluded |
| Invite a team member **[U]** | Excluded: no external invites |
| Any billing action **[U]** | Excluded: live Stripe subscription on this account |
| Pause / end a client **[U]** | Reversible in principle, but mutates the only client |
| Onboarding form as the client sees it **[U]** | Would need the client-side app |

**[I]** The highest-value unwalked flow is **check-in completion**, because it is the one
that would confirm whether `checkInTrend.checkIns[].status` is written by a scheduler, by
the client, or by the coach. See `unknowns-and-limitations.md`.
