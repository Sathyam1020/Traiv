# Coachway — client management workflow

Deep investigation of the client lifecycle in an authorised trial account, 24 Oct 2026.

**[V]** verified by direct observation · **[I]** inferred from observable evidence ·
**[U]** unknown / not established

**Scope and safety.** Read-only. **Zero non-`GET` requests were issued** — verified by
recording every `requestWillBeSent` on `api.coachway.io` and filtering out `GET`/`OPTIONS`
(result: none). The add-client wizard was opened and closed without submitting; the
roster was confirmed unchanged afterwards (`0 Active | 1 Pending | 0 Paused | 0 Ended |
0 Members`, 1 row). No credentials, tokens or private data are reproduced here; the test
client's UUID is written `<client-id>`.

**Tooling.** REA `list_browser_targets` and `inspect_web_page` (DOM, accessibility tree,
script inventory). REA's `capture_browser_scenario` is unavailable — its provider
`rea-playwright-browser-scenario` requires Playwright, which is not installed — so
navigation and interaction were driven over raw CDP, with real `Input.dispatchMouseEvent`
input. See `evidence-log.md`.

---

## 1 · Page and component hierarchy

### 1.1 Client list — `/clients`

```
AppShell
├─ Sidebar (dark navy, collapsible)
├─ Header
│   ├─ StatusTabBar      5 buttons, count stacked above label (2 lines, 67px tall)
│   │                    0 Active · 1 Pending · 0 Paused · 0 Ended · 0 Members
│   └─ Toolbar
│       ├─ SearchInput           placeholder "Search clients..."
│       ├─ TagFilter   [button]  → searchable listbox, "Search tags..."
│       ├─ SortSelect  [button]  "Duration (Asc)" → listbox, 4 options
│       ├─ Broadcast   [button]  bulk action
│       └─ AddClient   [button]  → 4-step modal wizard
└─ DataTable
    ├─ header: Name · Status · Tags · Last message · Plans · Duration · (menu)
    ├─ SelectAll checkbox  +  per-row SelectRow checkbox
    └─ Row  → navigates via onclick on <tr>; cursor:pointer; no <a href>
        └─ RowMenu "Open menu" → 4 items
```

**[V]** Observed row content:
`Sathyam Client | Pending | No tags | No messages yet | None | 24 Oct - | Open menu`

**[V]** The Duration cell renders `24 Oct -` — start date, trailing dash, no end date.

### 1.2 Client profile — `/clients/<client-id>`

```
ClientHeader
├─ Avatar · Name · StatusBadge("Pending")
├─ Pills:  Chat · Tasks · Notes · Info     → all four open DRAWERS
└─ "Edit duration"
TabBar:    Overview · Development · Vault · Payment · Automations · Settings
ActivityFeed filter: All · Activity · Emails · Invoices
```

**[V]** Tabs and drawers are both URL-addressable, using two different params:

| Control | URL |
|---|---|
| Settings tab | `?tab=settings` |
| Development tab | `?tab=development` |
| Info pill | `?drawer=info` |
| Tasks pill | `?drawer=tasks` |
| Notes pill | `?drawer=notes` |
| **Chat pill** | **`?drawer=messages`** — label and param disagree |

**[V]** Arriving from a filtered list preserves the origin:
`/clients/<client-id>?from=%2Fclients%3Fstatus%3Dpending`

**[V]** This account's profile shows **six** tabs. The marketing/demo material shows
Overview · Development · Nutrition · Workouts · Vault · Payment · Automations.
**[I]** Either tabs are hidden until relevant (this client is Pending and not onboarded),
or they are plan-gated. **[U]** Which.

### 1.3 Sub-structure observed

**[V] Settings tab** sections: `General · Alerts · Access · Danger zone`.
One numeric input, unit **"min"** — **[I]** the `maxVideoMessageDurationMins` /
`maxAudioMessageDurationMins` caps.

**[V] Development tab** — four sections, each with a self-describing subtitle:

| Section | Subtitle (verbatim) |
|---|---|
| Check-in | "Answers, ratings, weight and photos." |
| Nutrition | "Logged food against targets." |
| Body progress | "Weight, circumference and other measurements." |
| Training | "Recent sessions and exercise progress." |

plus photo comparison (`Front Photo · Side Photo · Back Photo · Comparison`), week
stepping (`Previous week · Week 43 (Oct 19 - Oct 25) · Next week`,
`Show previous 7 days · Show next 7 days`), range presets
(`30 days · 90 days · 6 months · 12 months`) and actions `Adjust goal`,
`Adjust targets and nutrition settings`.

**[V] Info drawer** sections: `Personal Information · Activity & Dietary Information ·
Questionnaire`.

---

## 2 · Field inventory

### 2.1 Add-client wizard, step 1 "Details" — **[V]** all observed in the live DOM

Steps: **1 Details · 2 Templates · 3 Membership · 4 Overview**.
**[V]** Steps 2–4 are `disabled` on open; only step 1 is reachable.

Section **"Client — Who they are and how to reach them."**

| Field | Element | Type | `name` | Placeholder | HTML `required` |
|---|---|---|---|---|---|
| First name | `input` | text | `firstName` | "First name" | **false** |
| Last name | `input` | text | `lastName` | "Last name" | **false** |
| Email | `input` | **email** | `email` | "name@example.com" | **false** |
| Phone *(Optional)* | `input` | text | *(none)* | **"+91 12 34 56 78"** | **false** |
| Lives in | custom | country select | — | "Country" | — |
| speaks | custom | language select | — | "English" | — |
| Gender | custom | enum | — | Female / Male / Other | — |
| Tags *(Optional)* | custom | multi-select | — | "Select tags" | — |

Section **"Coaching period — When they can access coaching. Billing is set up separately
in step 3."**

| Field | Values observed |
|---|---|
| Type | **Ongoing** / **Fixed duration** |
| Period | "Oct 24, 2026 — until you or the client ends it" |

Buttons: **Next** (disabled), **Close**.

**[V]** The phone placeholder is `+91 12 34 56 78` — localised to the account's country
(India). **[I]** Derived from `account.country`, not hardcoded.

**[V]** `Gender` here vs `birthDate`/`height` on the client record — the create form
collects *fewer* fields than the entity carries, so the rest arrive via onboarding.

### 2.2 Client entity — **[V]** keys and types from `GET /clients/<client-id>`

Captured as shapes only. Full listing in `data-model-hypotheses.md`. Relevant here:

```jsonc
{ id, createdAt, updatedAt, account, user, status,
  firstName, lastName, email, gender, birthDate, height, phone,
  startDate, endDate, type, tier, tierChangedAt,
  locale, timezone, country, imageId, imageUrl, stripeCustomerId,
  firstAppLoginAt, isOnboardingCompleted, onboardingCompletedAt,
  onboardingForm: { id, title, description, type, language, version },
  notificationSettings: { pushChatMessages, pushCheckIns, pushNewContent,
                          emailChatMessages, emailCampaigns },
  settings,                     // reference → /clients/:id/settings
  isAppAccessGranted, appAccessGrantedAt, appAccessExpiresAt,
  pauseAt, pausedUntil, pauseAppAccessOption, pauseGracePeriodDays, statusBeforePause,
  isAutoActivationSuppressed, allergies: [] }
```

**[V]** `type` and `tier` exist on the entity; the wizard's "Type: Ongoing / Fixed
duration" is **[I]** likely `type`. **[U]** `tier` has no observed control.

---

## 3 · User flows, with reproduction steps

### Flow A — Find and open a client **[V]**

```
1. GET /clients                       → lands on Active tab; "No clients found"
2. Click "1 Pending"                  → URL becomes /clients?status=pending
                                        no document load; table renders
3. Click the row (anywhere)           → /clients/<id>?from=%2Fclients%3Fstatus%3Dpending
4. Profile loads                      → 4 parallel calls (§6)
```

**[V]** Timing: controls are not interactive for **8–14 seconds** after navigation.
Measured directly — the "1 Pending" button was absent from the DOM 9s after navigate and
present by 14s. Every interaction in this investigation needed polling, not fixed waits.

### Flow B — Open the add-client wizard **[V]** (not submitted)

```
1. /clients → click "Add client"      → modal, role="dialog"
2. Step 1 "Details" renders; steps 2-4 disabled; "Next" disabled
3. Type "not-an-email" into input[name=email]; Tab to blur
   → aria-invalid stays "false"; no error message appears; Next still disabled
4. Type "Zz" into input[name=firstName]
   → Next still disabled
5. Escape                             → dialog closes, nothing persisted
```

**[V]** Confirmed after close: zero non-GET requests, roster counts unchanged.

### Flow C — Row actions **[V]**

```
1. /clients?status=pending
2. Click the row's "Open menu" button  ← requires REAL pointer events
3. role="menu" opens with exactly four items:
     Activate Client · Pause Client · Move to membership · End Client
```

**[V] Method note.** A synthetic `element.click()` does **not** open these menus —
Radix primitives listen for `pointerdown`. Only
`Input.dispatchMouseEvent` (mouseMoved → mousePressed → mouseReleased) worked. The
earlier synthetic attempt reported a successful click and produced no menu.

### Flow D — Profile navigation **[V]**

```
Profile → click "Settings"     → ?tab=settings      (General/Alerts/Access/Danger zone)
Profile → click "Development"  → ?tab=development   (4 sections + photo comparison)
Profile → click "Info"         → ?drawer=info       (3 sections incl. Questionnaire)
Profile → click "Tasks"        → ?drawer=tasks
Profile → click "Notes"        → ?drawer=notes
Profile → click "Chat"         → ?drawer=messages
```

---

## 4 · Filters, sorting, search

| Control | Mechanism | Values |
|---|---|---|
| **Status** | **[V]** query param `?status=` | active · pending · paused · ended · members |
| **Sort** | **[V]** listbox, 4 options | Duration (Asc) *default* · Duration (Desc) · Name (A-Z) · Name (Z-A) |
| **Tags** | **[V]** searchable multi-select listbox inside a dialog; "Search tags...", empty state "No tags found." | none exist in this account |
| **Search** | **[V]** single text input, `placeholder="Search clients..."` | — |
| **Pagination** | **[U]** no control visible with 1 client | envelope supports it (§6) |

**[V]** Counts come from a **separate** `GET /clients/counts`, so every tab's number is
correct for the whole roster rather than the current page.

**[U]** Not established: whether search is debounced, server- or client-side, which
fields it matches, whether sort/tags/search appear in the URL (only `status` was observed
to), and page size. One client is not enough data to provoke any of it.

**[I]** Sort has no "recently added" option — only duration and name. Traiv offers
duration / recent / name.

---

## 5 · States

### Empty **[V]** — verbatim

| Surface | Text |
|---|---|
| Client list (Active) | "No clients found" |
| Tag filter | "No tags found." |
| Development tab | "No development data found" |
| Development → Training | "No sessions found" / "No exercises found" |
| Row cells | "No tags" · "No messages yet" · "None" (plans) |
| Profile banner | "Onboarding Pending" |

**[I]** Empty states are written per-surface in natural language, not a generic
"No data". Note the inconsistency: "No clients found" vs "No templates yet" elsewhere.

### Loading **[U]**
A `spinner` chunk exists in the bundle (§8), so a spinner component is shipped.
**[U]** Whether skeletons or spinners are used, and where — the 8–14s window was not
instrumented frame-by-frame.

### Validation / error **[U] — and this is a real gap**

**[V]** With `"not-an-email"` in `input[type=email]`, after blur:
`aria-invalid="false"`, no `role="alert"` node, no visible message, **Next** unchanged.

**[I]** Validation is **not** on blur and **not** via HTML `required` (every field reports
`required: false`). It is **[I]** evaluated on step advance or submit, client-side.

**[U]** Error message copy, placement, and server-side error handling are **unobserved**,
because observing them requires submitting — excluded by the brief.

### Success **[U]**
No write was performed, so no toast, redirect or optimistic update was seen.

---

## 6 · Request and response shapes — captured only

**[V]** Client-management endpoints, all `GET`:

```
GET /clients                 → list
GET /clients/counts          → status tab counts
GET /clients/:id             → the entity (§2.2)
GET /clients/:id/settings    → 20 per-client feature toggles
GET /clients/:id/overview    → the overview aggregate
GET /clients/:id/history     → activity / email audit feed
```

**[V]** List envelope:

```jsonc
{ "data": [], "coachCounts": [],
  "total_items": 0, "current_page": 1, "per_page": 0, "total_pages": 0 }
```

**[V]** `GET /clients/:id/overview`:

```jsonc
{ averageRating: null, startDate, endDate, isOnboardingCompleted,
  nutrition: { allergies: [], preferences: [], eatingDisorderRisk: number },
  checkInTrend: { checkIns: [{ status, date }], completionRate, currentStreak },
  messagesTrend: { weeks: [{ fromDate, toDate,
                             clientMessagesCount, coachMessagesCount }],
                   totalClientMessagesCount, totalCoachMessagesCount } }
```

**[V]** `GET /clients/:id/history` — array of:

```jsonc
{ id, source, timestamp, templateType, recipientEmail, subject,
  systemTemplateId, performedBy: { id, name }, deliveryStatus }
```

**[V]** Opening the add-client wizard additionally triggers `GET /automations` and
`GET /billing/connect/status` — **[I]** prefetch for step 2 (Templates) and step 3
(Membership).

**[V]** Every call is preceded by an `OPTIONS` preflight, because the SPA
(`app.coachway.io`) and the API (`api.coachway.io`) are different origins. That is a
doubled round trip on every request.

**[U]** No write shapes. `POST /clients` is **not** documented here because it was not
observed — inventing it would be guessing.

---

## 7 · Observable persistence behaviour

**[V] No autosave in the create wizard.** Text was typed into `firstName` and `email`,
the dialog was dismissed with Escape, and **no non-GET request was issued at any point**.

**[I] The wizard holds state in memory only.** **[U]** Whether a reopened dialog restores
the typed values was not tested.

**[V] Tab and drawer state is persisted in the URL**, not in storage — `?tab=` and
`?drawer=` change without a document load, so the view is shareable and
back/forward-navigable.

**[I] The profile loads once and tabs render client-side.** Switching between Settings,
Development and Info produced the same set of four client endpoints with no additional
calls. **[U]** This is not conclusive — the capture window spans the whole visit, so a
small lazy fetch could be attributed to initial load.

**[U]** Everything about *how edits save* — inline vs modal, optimistic vs pessimistic,
PATCH vs PUT, conflict handling. The brief excluded writes, and editing the only client
in the account would mutate it.

---

## 8 · Technical observations

**[V]** Build output is Vite — hashed chunks under `/assets/`. Ten scripts loaded:

```
index · vendor · routes · icons · spinner · charts · editor · dnd · emoji · country-select
```

**[I]** The chunk names are a dependency inventory: a **rich-text editor** (notes/content),
**drag-and-drop** (workout/plan ordering), an **emoji picker** (chat), **charts**
(insights/progress), and a **country select** (the "Lives in" field).

**[V]** Accessibility tree on the client list, via REA: **39 buttons, 16 links, 2 regions,
1 textbox — and only 2 headings**, with no `main` or `navigation` landmark exposed.
**[I]** Heading structure and landmarks are weak; a screen-reader user has little to
navigate by. Worth beating rather than copying.

**[V]** The chat composer's accessible textbox is labelled *"Enter your message here..."*.

**[V]** Error reporting goes to Sentry (EU region). **[V]** A `maintenance.json` is
fetched from a CDN rather than the API — **[I]** so a maintenance banner survives an API
outage.

---

## 9 · Data relationships

```
account (tenant)
  └─ client ──┬─ user                     (nullable; roster record exists first)
              ├─ settings      1:1        → /clients/:id/settings, 20 toggles
              ├─ notificationSettings 1:1 (embedded)
              ├─ onboardingForm 1:1       → a versioned form
              ├─ tags          N:M        → /tags
              ├─ history       1:N        → emails + activity, with performedBy
              ├─ stripeCustomerId         → the coach's own Stripe (separate from platform billing)
              └─ overview      derived    → check-ins, messages, nutrition flags
```

**[V]** `client.user` is a separate reference from `client.email`/`firstName` — the roster
record exists before the person has an account. Same split as Traiv's `client.userId`.

**[V]** Status is **not** the same thing as app access: `isAppAccessGranted`,
`appAccessGrantedAt`, `appAccessExpiresAt` are independent fields, and pause has five
dedicated columns including `statusBeforePause`.

**[I]** The status machine, from the row menu (`Activate · Pause · Move to membership ·
End`) plus the five tabs:

```
          ┌──────────── Activate ────────────┐
Pending ──┴──→ Active ⇄ Paused (statusBeforePause restores the prior state)
                 │
                 ├──→ Ended
                 └──→ Members   ("Move to membership")
```

**[U]** Whether Ended → Active is permitted; whether Members is a status or a different
entity type (`client.type`); what "membership" means commercially.

### Remaining uncertainties

| # | Unknown | Why it matters |
|---|---|---|
| 1 | How a check-in row is created — scheduler, client submission, or computed | Decides whether Traiv needs a `check_in` table |
| 2 | Write shapes, validation rules, error copy | Needed before building the create flow |
| 3 | Search/sort/pagination semantics | One client provoked none of it |
| 4 | Whether Workouts/Nutrition tabs are state- or plan-gated | Affects the tab model |
| 5 | What "Members" is | A fifth status with no analogue in Traiv |
| 6 | Autosave on *edit* (as opposed to create) | Only create was observable |

---

## 10 · Acceptance criteria for an independent implementation

Written so each can be verified without reference to Coachway.

### Client list
1. Five status buckets with live counts, each count correct for the **whole** roster, not the page.
2. Status is in the URL and survives reload, back/forward and sharing.
3. Sort offers both directions on at least duration and name; the active option is marked.
4. Tag filter is a **searchable** multi-select with its own empty state.
5. A free-text search over client names.
6. Row click opens the profile **and** the name is a real link — middle-clickable, keyboard-reachable, shows its target on hover. *(Coachway fails this: `onclick` on `<tr>`, no anchor.)*
7. Opening a client from a filtered list returns to that same filtered list.
8. Distinct empty states for "no clients at all" and "none match this filter".
9. Row menu exposes exactly the transitions legal for the row's current status.

### Add client
10. A gated multi-step wizard: later steps unreachable until earlier ones validate.
11. Validation is announced accessibly — `aria-invalid` **and** a message tied by `aria-describedby`. *(Coachway fails this: `aria-invalid` stayed `false` on an invalid email.)*
12. Phone placeholder follows the account's country.
13. Dismissing the wizard issues no write.
14. Optional fields are visibly labelled optional.

### Client profile
15. Tabs and drawers are URL-addressable and deep-linkable.
16. Naming is consistent between label and URL. *(Coachway fails this: "Chat" → `?drawer=messages`.)*
17. A client who has not onboarded says so plainly rather than showing empty sections.
18. The overview is served by **one** aggregate request, not N.
19. Pause records the prior status and restores it on resume.
20. App access is modelled separately from coaching status, with a grace period.

### Non-functional
21. **Interactive within 2 seconds.** Coachway takes 8–14s; Traiv's roster is ~0.85s warm. This is a lead to protect, not a bar to match.
22. No per-navigation refetch of session/account/team — cache it. *(Coachway refetches six endpoints on every route change.)*
23. Proper heading hierarchy and `main`/`nav` landmarks. *(Coachway exposes 2 headings and no landmarks.)*

---

## 11 · Recommended next investigation

**The check-in lifecycle — and it now has a dependency chain that makes it urgent.**

This investigation turned uncertainty #1 from "open question" into a blocker, because
three separate surfaces all resolve to it:

- `overview.checkInTrend` returns `completionRate` and `currentStreak` — both require a
  notion of what *should* have happened.
- Development → Check-in is described as **"Answers, ratings, weight and photos"** — so a
  check-in is a **form submission**, not a workout.
- Account defaults define `defaultCheckInFrequency`, `defaultCheckInPeriod` ("Week") and
  `defaultCheckInWeekday` ("Monday") — so there is a **schedule**.

Together these say a check-in is a *scheduled form submission carrying metric values and
photos*, which is a different entity from Traiv's `training_session`. Traiv's roster
currently defines a check-in as a completed session and therefore cannot produce a
completion rate at all.

**What to investigate next, in order:**

1. **Forms → Metrics → check-in composition.** `/forms` entities carry
   `sections[]` and a `version`; `/metrics` is a registry with `code`, `unit`,
   `unitCategory`. Establish whether a check-in form is assembled from metrics. This is
   observable **read-only** — open a seeded form and a seeded metric.
2. **The onboarding form**, via `client.onboardingForm` and the Info drawer's
   "Questionnaire" section. It is Traiv's `user_intake` expressed as a configurable form,
   and it determines whether Traiv's fixed intake schema should become form-driven.
3. **Only then, write behaviour** — and that needs a second throwaway client so edits
   don't mutate the only real record.

**Why not messaging or automations next:** both are empty in this account, so there is
nothing to observe, and neither blocks the overview page that is next in Traiv's queue.

**Blocked without a write:** validation messages, success states, autosave on edit, and
`POST /clients`. These need either a sacrificial client or an explicit decision to allow
writes in a controlled test.
