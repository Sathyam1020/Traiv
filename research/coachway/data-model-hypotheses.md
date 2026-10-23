# Coachway — data model hypotheses

Derived from response **shapes** captured over CDP: field names and value types only.
No values were recorded, so nothing here contains account or client data.

**[V]** field observed in a real response · **[I]** inferred · **[U]** unknown

## Conventions

**[V]** Every list endpoint returns the same envelope:

```jsonc
{ "data": [...], "total_items": 0, "current_page": 1, "per_page": 20, "total_pages": 0 }
```

`/clients` adds one field: `coachCounts: []` — **[I]** per-coach totals for a
multi-coach studio, so the roster can show "12 clients" per team member.

**[V]** Ids are UUID v4 strings. Every entity carries `createdAt` / `updatedAt`.
**[I]** Soft delete is expressed per-entity rather than globally: metrics use
`archivedAt`, clients use a `status` enum. There is no visible `deletedAt` convention.

---

## `account` — the tenant

**[V]** `GET /account`

```jsonc
{
  id, name, description, locale, timezone, currency, country,
  imageUrl, email, phone, websiteUrl, termsAndConditionsUrl, privacyPolicyUrl,
  weightUnit, distanceUnit,
  platformStripeCustomerId, platformSubscriptionId, platformSubscriptionStatus,
  platformTrialEndsAt, platformCancelAtPeriodEnd, platformCurrentPeriodEnd,
  branding: { id, logoImageUrl, headerImageUrl,
              primaryColor, secondaryColor, backgroundColor },
  settings: { notificationSenderDisplay, showPreviousWorkoutData,
              clientActivationMode, clientAutomationStatusSync,
              clientActivationDraftContentSync,
              defaultCheckInFrequency, defaultCheckInPeriod, defaultCheckInWeekday,
              defaultNoContactThresholdDays, defaultNoContactTrigger,
              defaultAppAccessAfterEnd, defaultAppAccessGracePeriodDays },
  accessPolicy: { coachAccessStatus, coachAccessSusp… }
}
```

**Maps to Traiv's `studio`.** Three things Traiv's `studio` lacks:

1. **[V]** `termsAndConditionsUrl` / `privacyPolicyUrl` per account — each coach points
   at their own legal pages. Relevant to Traiv's white-label and the DPDP Act.
2. **[V]** `currency`, `weightUnit`, `distanceUnit` on the tenant. Traiv hardcodes
   `timezone: "Asia/Kolkata"` and assumes kg.
3. **[V]** A whole `settings` sub-object of **defaults that cascade onto new clients**.
   Traiv has no cascade concept.

**[V]** `branding` is only three colours plus two images — notably **no font**. Confirms
white-label at Coachway means logo + palette, nothing deeper.

---

## `client`

**[V]** `GET /clients/<client-id>`

```jsonc
{
  id, createdAt, updatedAt, account, user, status,
  firstName, lastName, email, gender, birthDate, height, phone,
  startDate, endDate, type, tier, tierChangedAt,
  locale, timezone, country, imageId, imageUrl, stripeCustomerId,

  firstAppLoginAt, isOnboardingCompleted, onboardingCompletedAt,
  onboardingForm: { id, title, description, type, language, version },
  notificationSettings: { pushChatMessages, pushCheckIns, pushNewContent,
                          emailChatMessages, emailCampaigns },
  settings,                      // id reference → /clients/:id/settings

  isAppAccessGranted, appAccessGrantedAt, appAccessExpiresAt,
  pauseAt, pausedUntil, pauseAppAccessOption, pauseGracePeriodDays, statusBeforePause,
  isAutoActivationSuppressed,
  allergies: []
}
```

### Four findings that matter for Traiv

**1 · App access is separate from status. [V]**
`isAppAccessGranted`, `appAccessGrantedAt`, `appAccessExpiresAt` are independent of
`status`. A client can be Ended but retain app access for a grace period, or be Active
with access revoked. Traiv conflates the two: `StatusGate` derives everything from
`status` alone.

**2 · Pause is a sub-system, not a flag. [V]**
Five dedicated columns: `pauseAt` (scheduled), `pausedUntil` (auto-resume),
`pauseGracePeriodDays`, `pauseAppAccessOption` (what happens to the app), and
`statusBeforePause` — so resuming restores the *previous* status rather than assuming
Active.

Traiv's `useUpdateClient` sets `status: "active"` on resume unconditionally. If a client
was `waiting` before being paused, Traiv promotes them incorrectly. **`statusBeforePause`
is the fix, and it is one nullable column.**

**3 · `user` is a separate reference. [V]**
Alongside `firstName`/`email` on the client row. **[I]** Same split as Traiv's
`client.userId` — the roster record exists before the person has an account. Confirms
ADR 0004 was the right call.

**4 · `height` lives on the client, not a profile. [V]**
`height` and `birthDate` are on the client row. Traiv puts them on `user_intake` keyed by
`users.id`, so one person answers once across coaches. **[I]** Traiv's model is better
for the multi-coach case; Coachway's duplicates per relationship. Keep Traiv's.

**[U]** `type` and `tier` values were not observed. **[I]** `tier` + `tierChangedAt`
suggests per-client service levels the coach charges differently for.

---

## `client.settings` — per-client feature flags

**[V]** `GET /clients/<client-id>/settings` — 20 toggles on one client:

```jsonc
{
  nutritionVisibility, hideWeightInfo, hideChat,
  allowFoodBarcodeScanner, allowFoodPhotoLog, allowFoodDatabaseSearch,
  allowClientRecipeCreation, allowClientMealPlanCreation,
  allowCalorieCalculator, allowClientTargetEditing,
  requireStepProof,
  allowVideoMessages, allowAudioMessages,
  maxVideoMessageDurationMins, maxAudioMessageDurationMins,
  noContactThresholdDays, noContactTrigger,
  unitSystem, dailyStepsGoal
}
```

**[I]** This is the most distinctive thing in the product. The coach configures *what the
client's app can do*, per client. `hideWeightInfo` is an eating-disorder accommodation;
`allowClientTargetEditing` decides whether a client may override their own calorie target.

**[V]** `noContactThresholdDays` + `noContactTrigger` — a **configurable** staleness
window. Traiv hardcodes `STALE_DAYS = 10` and `FRESH_DAYS = 7` in `roster.ts`. Coachway
makes it a per-client setting with an account-level default.

---

## `client overview` — the screen in question

**[V]** `GET /clients/<client-id>/overview`

```jsonc
{
  averageRating: null,
  startDate, endDate, isOnboardingCompleted,
  nutrition: { allergies: [], preferences: [], eatingDisorderRisk: 0 },
  checkInTrend: { checkIns: [{ status, date }], completionRate, currentStreak },
  messagesTrend: { weeks: [{ fromDate, toDate,
                             clientMessagesCount, coachMessagesCount }],
                   totalClientMessagesCount, totalCoachMessagesCount }
}
```

**This is one aggregate call, not six.** The whole overview screen — rating, dates,
nutrition flags, the check-in grid and the message chart — is served by a single
endpoint. Compare Traiv's roster, which fans out to five parallel queries.

**[V]** `eatingDisorderRisk` is a **number**, not a boolean. The UI renders it as "ED
Assessment · No Risk". **[I]** A score with thresholds. Traiv's nearest equivalent is
`nutrition_target.reviewReasons`, which flags pregnancy / medical / underweight — related
but not a screener. Do not copy this without clinical grounding.

**[V]** `checkInTrend.checkIns[]` carries `{status, date}` — so a check-in is a **real
scheduled entity with a status**, not a derived fact. It can be *missed*, which means it
must have been *expected*, which means there is a schedule.

**This settles the open question in Traiv.** Traiv's roster currently defines a check-in
as "a completed `training_session`", which can only ever produce "did something / did
nothing" — it cannot produce `completionRate` or `currentStreak`, because nothing says
what *should* have happened. A `check_in` table with a schedule is required before the
overview's grid can mean anything.

Account defaults confirm the schedule: `defaultCheckInFrequency`, `defaultCheckInPeriod`
(observed value **"Week"**), `defaultCheckInWeekday` (observed **"Monday"**).

---

## Library entities

**[V]** `GET /exercises` — seeded on a new account

```jsonc
{ id, name, description,
  primaryMuscleGroup, secondaryMuscleGroup, tertiaryMuscleGroup,
  stimulus, location, equipment, injuryRisk, experienceLevel, exerciseType,
  imageUploadId, imageUrl, videoUrl, externalVideoUrl,
  defaultType, defaultValueTypes: [], popularityRating,
  source, parentExerciseId, accountId, createdAt, updatedAt }
```

**[V]** `source` + `parentExerciseId` + `accountId` together are a **fork model**: a
global library exercise has `accountId: null`; a coach's customisation is a new row with
`parentExerciseId` pointing at the original. The UI confirms it with a `Library` column
and a `Type: Personal` filter.

**[I]** Traiv's `exercises` table should adopt `parentExerciseId` + nullable `studioId`
before seeding, or coaches will edit shared rows.

**[V]** `defaultValueTypes` is an array — **[I]** an exercise declares which inputs it
logs (reps / load / time / distance), so a plank logs seconds and a squat logs kg×reps.
Traiv's `workout_item` hardcodes `sets` + `reps` text + `loadHint`.

**[V]** `GET /ingredients` — seeded. UI columns: Name · Calories · Nutrients · Category ·
Country · Library. **[V]** A **Country** facet, and a Country filter.
**[I]** Directly relevant to Traiv's Indian-foods positioning.

**[V]** `GET /metrics` — seeded

```jsonc
{ id, name, unit, type, code, source, unitCategory, archivedAt }
```

**[I]** A metric registry: `code` is a stable machine key, `unitCategory` groups
convertible units, `archivedAt` retires one without deleting history. This is what makes
check-in forms composable. Traiv has no equivalent — `body_metric` is weight only.

**[V]** `GET /forms` — `{ title, description, type, language, version, sections[] }`
**[V] Forms are versioned and language-tagged.** **[I]** `version` exists so historical
responses still resolve against the form as it was when answered — the same reason
Traiv's `meal_item` copies macros at write time.

---

## Identity and permissions

**[V]** `GET /users/me`

```jsonc
{ id, name, email, emailVerifiedAt, imageUrl, locale,
  lastLoginAt, lastLoginIp,
  role: { id, name, color }, permissions: [string],
  isOwner, isSuperAdmin }
```

**[V]** A real RBAC layer: a named, **coloured** role plus a flat `permissions` array,
with `isOwner` and `isSuperAdmin` as separate booleans.

**[I]** Traiv's ADR 0004 deliberately has **no role column** — what you are is which table
your id is in, and `membership.role` is just `owner | coach`. Coachway's model is heavier
and needed for studios with staff. Traiv should not adopt it now; it is the right answer
at team scale, not at solo-coach scale. Revisit if studios with assistants become real.

**[V]** `GET /users/team` and `GET /users/all` are distinct. **[I]** `team` = staff,
`all` = staff + clients, for mention/assignment pickers.

---

## Endpoints observed

```
/account                    /account/nutrition-settings
/clients                    /clients/counts
/clients/:id                /clients/:id/settings
/clients/:id/overview       /clients/:id/history
/users/me                   /users/me/settings
/users/team                 /users/all
/tags                       /notifications      /notifications/unread-count
/inbox                      /inbox/unread-count
/leads                      /lead-status        /leads/analytics/conversion-rate
/automations                /vault/resources    /articles
/exercises                  /workout/templates/list
/recipes                    /recipes/meal-types /ingredients   /mealplan
/forms                      /metrics
/insights/dashboard         /insights/sales-report
/platform-billing/subscription  /platform-billing/invoices
/platform-billing/app-access-breakdown
```

**[V]** All 36 are `GET`. No write was performed, by design.

**[V]** `/clients/:id/history` returns delivery records:
`{ id, source, timestamp, templateType, recipientEmail, subject, systemTemplateId,
performedBy: {id, name}, deliveryStatus }` — **[I]** an audit log of every system email
sent to the client, with delivery status and who triggered it. Traiv has no audit trail.
