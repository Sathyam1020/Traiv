# Implementation plan — first feature

## 1 · The feature, and why it is first

**The client overview tab** — `/clients/[clientId]`, the body under the header that
currently reads *"The overview is next"*.

Chosen over check-ins, the pause sub-system and per-client settings on four grounds:

1. **It is the only half-finished thing in the product.** The header, the route, the API
   client and the query layer all shipped; the body is a placeholder paragraph.
2. **Every data source already exists.** `body_metric`, `user_intake`,
   `nutrition_target`, `training_session`, `client` — no migration, no new table.
3. **The evidence is verified, not inferred.** The response shape of
   `GET /clients/:id/overview` was captured directly from Coachway, and the card layout
   comes from a screenshot of the running product.
4. **Check-ins cannot be first.** They need a new table *and* carry a genuine `[U]` —
   whether Coachway materialises rows or computes occurrences on read. The spec is
   written (`.ai/features/check-ins/spec.md`); it is second, not first.

## 2 · Evidence grading

**Verified [V]** — observed in a real response or on screen, and relied on here:

- `GET /clients/:id/overview` returns **one aggregate**, not N calls:
  `{ averageRating, startDate, endDate, isOnboardingCompleted, nutrition: { allergies,
  preferences, eatingDisorderRisk }, checkInTrend, messagesTrend }`
- The card layout: *Average rating · Payments · Current weight · Client since* across
  the top; *BMR · TDEE · Recommended* as three boxes; an assessment line; *Current meal
  plan* and *Latest workout* as list cards.
- Current weight renders as value + delta + goal: `72 kg` / `−3 kg this week · 70 kg goal`
- Client since renders as a duration plus the date: `7 days` / `Started 26 jan. 2026`
- Payments with nothing behind them render `N/A` + *"No payments found for this client"*
  — Coachway ships the card and states the absence rather than hiding it.

**Inferred [I]** — noted, not relied on:

- `eatingDisorderRisk: number` is a score with thresholds. **Not reproduced.** Traiv's
  nearest honest equivalent is `reviewReasons()`, which flags pregnancy, medical
  conditions and underweight. Copying a clinical screener without clinical grounding
  would be irresponsible, so this card shows review reasons and is labelled as such.
- `averageRating` is a client rating of sessions. Nothing in Traiv produces it.

**Unknown [U]** — excluded from v1:

- How a check-in row comes into being. Blocks the check-in card only.
- Whether messaging is threads or events. Blocks the messages card only.

## 3 · Files to reuse or modify

### Reuse unchanged
| File | Why |
|---|---|
| `packages/nutrition` — `bmr`, `tdee`, `energyTarget`, `bmi`, `reviewReasons` | Already unit-tested. BMR/TDEE/Recommended come straight out of it |
| `packages/ui/.../page-header.tsx` | `TableCard` and the chrome conventions |
| `apps/trainer/.../_components/client-header.tsx` | Shipped; untouched |
| `apps/trainer/.../duration-cell.tsx` → `shortDate` | Date formatting |
| `@traiv/ui` card, badge, skeleton, tooltip | No new primitives needed |

### Modify
| File | Change |
|---|---|
| `apps/api/src/features/studio/roster.ts` | add `getClientOverview()` |
| `apps/api/src/features/studio/routes.ts` | add `GET …/clients/:clientId/overview` |
| `apps/api/src/features/studio/roster.test.ts` | overview tests |
| `apps/trainer/src/lib/api/types.ts` | `ClientOverview` type |
| `apps/trainer/src/lib/api/roster.ts` | `rosterApi.overview()` |
| `apps/trainer/src/lib/query/keys.ts` | `client.overview(...)` key |
| `apps/trainer/src/lib/query/use-roster.ts` | `useClientOverview()` |
| `apps/trainer/.../[clientId]/page.tsx` | render the overview instead of the placeholder |

### Create
`apps/trainer/.../_components/overview/` — `overview.tsx`, `stat-card.tsx`,
`weight-card.tsx`, `energy-card.tsx`, `nutrition-card.tsx`, `training-card.tsx`.

## 4 · Changes by layer

### Database
**None.** No migration. Every field read already exists.

### Backend — one aggregate endpoint

`GET /studios/:id/clients/:clientId/overview`, behind `requireStudio({ param: "id" })`,
scoped by studio in the `where` clause like every other roster query.

Five queries in parallel (the pattern `listRoster` already uses):

1. the client row — `createdAt`, `endsAt`, `activatedAt`, `userId`
2. `user_intake` — sex, birthYear, heightCm, goal, targetWeightKg, dailyActivity, diet,
   allergies, dislikes, healthFlags
3. `body_metric` — latest, plus the newest row ≥7 days old, for the delta
4. `nutrition_target` — the active one, with its `basis`
5. `training_session` — completed sessions in the last 30 days

Energy is **computed** when there is no stored `nutrition_target`, using
`@traiv/nutrition`, so the card works before any plan exists. When a target *is* stored,
its `basis` is returned — that is the audit trail Coachway does not show.

Returns `null` for `energy` and `nutrition` when `hasAccount` is false. A client who has
never signed in has no body and no intake, and that is a state the UI must show rather
than four empty numbers.

### Frontend

Five cards, mapped to **[V]** observations:

| Card | Source | Coachway equivalent |
|---|---|---|
| **Weight** | `body_metric` + `targetWeightKg` | "Current weight · −3 kg this week · 70 kg goal" |
| **Coaching** | `client.createdAt`, `endsAt`, `activatedAt` | "Client since 7 days" |
| **Energy** | `@traiv/nutrition` or stored target | "BMR / TDEE / Recommended" |
| **Nutrition** | intake diet, allergies, dislikes, flags + `reviewReasons()` | "ED Assessment" + "No preferences or allergies" |
| **Training** | `training_session`, 30 days | "Latest workout" |

Not built, and visibly absent rather than faked: average rating, payments, messages
trend, check-in trend.

## 5 · Acceptance criteria

1. One request serves the whole overview — **[V]** matching Coachway's single aggregate.
2. Current weight shows value, delta against ~7 days ago, and the goal when one is set.
3. No second weight reading → the delta is omitted, not rendered as `0 kg`.
4. BMR, TDEE and the recommended target all render for a client with a complete intake.
5. A stored `nutrition_target` is preferred over a computed one, and its derivation
   (formula, BMR, TDEE, activity factor, adjustment, what bound it) is inspectable.
6. A client with no account shows "hasn't joined yet", not empty cards.
7. A client with an account but an unfinished intake says which answers are missing.
8. Review reasons appear when present; "No flags" when not. **Never** an ED risk score.
9. Cards with nothing behind them (payments, messages) say so — **[V]** Coachway's own
   pattern — rather than being hidden.
10. Works at 390px: cards stack, no horizontal scroll.
11. Studio scoping: another studio's client is a 404; a studio the coach is not in, 403.

## 6 · Tests

**API** (`roster.test.ts`, extending the existing suite):
- returns the overview for a client in the studio
- `hasAccount: false` → `energy: null`, `nutrition: null`
- weight delta computed from the older reading, absent with only one reading
- energy computed from intake when no target is stored
- a stored active target wins over the computed one, and carries its basis
- training counts only `completed_at` sessions inside the window
- 404 for another studio's client; 403 for a studio the coach is not in

**Gate:** `pnpm check`, `pnpm -r typecheck`, `pnpm -r test`, `turbo build --force`.

## 7 · Critical unknowns

**None block this feature.** The two real `[U]`s — how a check-in row is created, and the
messaging model — affect only the two cards deliberately excluded.

One judgement call stated plainly: **`eatingDisorderRisk` is not reproduced.** It is a
number on Coachway's side with unknown derivation and clinical implications. Traiv shows
`reviewReasons()` instead, which is honest about what it is.
