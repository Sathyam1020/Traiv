# Coachway — unknowns and limitations

What this reconnaissance could not establish, and why. Nothing here should be treated as
settled when building.

## Structural limits on the whole exercise

**Read-only.** Every one of the 36 observed endpoints was a `GET`. **No write was
performed**, so request payloads, validation rules, error responses and status codes
other than 200 are entirely unobserved. Everything about *writing* in these documents is
inference from field names and UI labels.

**One account, one client, almost no data.** The account is a fresh trial with a single
Pending client. Empty states were abundant and populated states were rare. Pagination,
sorting behaviour, large-list performance and anything that only appears with real data
were not seen.

**No client-side app.** Only the coach-facing web app was examined. Everything the
client experiences — the thing `client.settings`' 20 toggles actually govern — is
unobserved.

**Shapes, not values.** Response bodies were reduced to keys and types by design. Enum
*members* are therefore mostly unknown: `status`, `type`, `tier`, `source`,
`nutritionVisibility`, `noContactTrigger` were all seen as `"string"`.

**No source-level analysis.** The JS bundle was not decompiled or read. Business logic,
validation and computed fields remain black boxes.

## The question that matters most, still open

**How is a check-in created, and by whom?**

**[V]** Known: `checkInTrend.checkIns[]` carries `{status, date}`; `completionRate` and
`currentStreak` exist; account defaults define `defaultCheckInFrequency`,
`defaultCheckInPeriod` ("Week") and `defaultCheckInWeekday` ("Monday").

**[U]** Unknown: whether a scheduler materialises a row per period, whether the client
submits a form that creates it, or whether "missed" is computed on read from a schedule
plus submissions. **[U]** Which statuses exist beyond completed / missed / upcoming.
**[U]** Whether a check-in is a form submission, a metric bundle, or its own entity.

**Why it blocks work:** Traiv must decide whether to add a `check_in` table before
building the overview. A stored row and a computed-on-read view produce the same UI and
very different migrations. Resolving this needs an onboarded client and one completed
check-in — i.e. a write — which was out of scope.

## Specific unknowns by area

| Area | Unknown |
|---|---|
| Client creation | **[U]** Fields, validation, whether invite-by-link or coach-entered |
| Onboarding | **[U]** What the client sees; how `onboardingForm` is assigned |
| Statuses | **[U]** What "Members" means. **[I]** an app user with no coaching relationship — unverified |
| `type` / `tier` | **[U]** Values and what they gate |
| Pause | **[U]** How the five pause columns interact; what `pauseAppAccessOption` offers |
| Automations | **[U]** Trigger/condition/action vocabulary — builder never opened |
| Messaging | **[U]** Thread model, attachments, video/audio replies |
| Tasks / Notes | **[U]** Only seen as header pills; no endpoint observed |
| Workout builder | **[U]** How `defaultValueTypes` drives logging inputs |
| Billing | **[U]** `app-access-breakdown` — **[I]** per-client billing, unverified |
| Permissions | **[U]** The `permissions[]` string vocabulary |
| Mobile / responsive | **[U]** Captured at 1440px only |
| Dark theme | **[U]** Not tested; only light tokens read |
| Collapsed sidebar | **[U]** Whether it narrows to icons or hides |

## Things observed that are probably *not* worth copying

Recorded so they are not adopted by default.

1. **The six-call shell preamble on every navigation.** `/users/me`, `/account`,
   `/users/team`, `/notifications`, `/notifications/unread-count`,
   `/inbox/unread-count` refetch on each route change. At Traiv's India→us-east-2
   latency this is ~1.5s of dead time per click. Traiv already caches session and studio;
   keep that.

2. **8–14 second interactive load.** Measured: a status tab absent from the DOM 9s after
   navigation, present by 14s. Traiv's roster is ~0.85s warm after the connection-pool
   fix. This is a lead worth protecting.

3. **Rows navigating via `onclick` with no anchor.** Breaks middle-click, keyboard, and
   hover preview. Traiv's real `<Link>` plus row-level convenience is better.

4. **Three URL conventions in one app** — path segments, query params and `?section=`.
   Pick one.

5. **A brand colour.** `--primary: #33755b` fights per-studio branding. Traiv's
   near-black decision is better for white-label and is already recorded in `colors.md`.

## Honest assessment of what this was worth

The genuinely new, actionable findings are narrow but real:

- **Seeded libraries on account creation** — exercises, ingredients, metrics. Traiv's are
  empty, which is the current hard blocker on plan generation.
- **`statusBeforePause`** — a one-column fix for a real bug in Traiv's resume logic.
- **App access as a dimension separate from status**, with a grace period.
- **A check-in needs a schedule to have a completion rate** — settles a design question.
- **The `from=` return-path param** — small, cheap, better than Traiv's hardcoded back.
- **A metric registry** as the unit check-in forms compose from.
- **`parentExerciseId` + nullable `accountId`** — the library/fork model, needed *before*
  seeding, not after.

Everything else confirmed decisions Traiv had already made independently: the seven
roster columns, status filtering in the URL, the collapsible shell, shadcn as the
component base, and the separation of roster record from user account.

**What this exercise did not produce: any code to copy.** It produced a list of
decisions, with evidence, which is what competitor research can honestly yield.
