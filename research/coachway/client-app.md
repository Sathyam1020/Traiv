# Coachway — the client app

Static analysis of the shipped Android app, pulled from the repository owner's own
device. 25 Oct 2026.

**[V]** verified from the artifact · **[I]** inferred · **[U]** unknown

## The artifact

| | |
|---|---|
| Package | `dk.coachway.app` — a **Danish** company |
| Version | 1.1.4 |
| Framework | **Expo SDK 57 / React Native**, bytecode is **Hermes v98** |
| Size | 117 MB, 9 dex files, 32.8 MB JS bundle |
| Locales | `en da no sv fi de` — Nordics + Germany |
| Web target | **`web: { bundler: "metro", output: "static" }`** — Expo already builds this app for the browser |

### How it was read, and what that cost

The bundle is **Hermes bytecode, not JavaScript**. Three approaches failed before one
worked, and the failures are worth recording:

1. **REA's `analyze_javascript_application`** parsed **0 files**. It reads plain JS text;
   a `.hbc` is opaque to it.
2. **`strings(1)`** returns one run-on blob, because Hermes packs every string into a
   single contiguous block with lengths held in a separate table.
3. **Hand-parsing the string table** got ~90% there — the header validates exactly
   (`fileLength` matched the file byte for byte) and offsets decoded correctly, but the
   length field came out wrong and strings truncated mid-word. Using offset deltas as
   boundaries instead failed too, because Hermes *overlaps* storage between strings that
   share a prefix.
4. **`hermes-dec`** (pip, in a venv) parsed it properly: **144,760 complete strings**. It
   warns that v98 is newer than it formally supports, and it worked anyway.

5. **`hermes-dec`'s disassembler**, pointed at selected functions, recovered the control
   flow. Three things in the bytecode made that cheap, and they are worth knowing before
   anyone reads another bundle:
   - **Function names survive.** 80,234 of 111,036 function headers carry a real name
     (`getCheckInHistory`, `executeCheckInSuccessCleanup`, `StepProgressPhotos`). The
     release build minified *module* code but kept the name table.
   - **`NewObjectWithBuffer` prints object literals**, so request payloads, response
     field names and component props read straight out of the listing.
   - **`className` strings are NativeWind Tailwind**, so screen *layout* is recoverable
     as a class tree, not just a screen name.

   Disassembling all 111k functions was never necessary. Indexing which functions load
   which strings took **7 seconds** and narrowed the check-in flow to ~40 functions.

**[V]** Control flow is recovered for the check-in and onboarding flow (below). Other
flows have verified names and paths but un-decompiled logic.

---

## White-label, in one binary

**[V]** `assets/configs/` contains six brand configs:

```
avara · fitbeny · infinite-you · soon2fit · turnussterk · wlwt
```

plus `app.config` carrying `extra.brandKey`, and an `/app/branding` endpoint.

**[I]** One app binary serves every coach's brand, switched by a key at runtime rather
than by rebuilding per customer. That is exactly Traiv's white-label model, and it is
evidence the approach scales — their `account.branding` (logo, two hex colours, header
image) is all the per-brand surface they appear to need.

---

## The client API

**[V]** The client's surface is namespaced **`/app/*`**, cleanly separate from the
coach's `/clients/*` and `/account/*`:

```
GET  /app/today                  the home screen's payload
GET  /app/check-ins              list;  /app/check-ins?id=  one
GET  /app/measurements           body metrics;  /app/measurements/ write
GET  /app/profile                /app/profile?id=
GET  /app/available-metrics      which metrics this client is asked for
GET  /app/branding               the white-label palette and logo
GET  /app/config                 feature flags for this client
POST /app/register-token         push registration
POST /app/remove-token
POST /app/account-deletion-requests
```

**[V]** Shared with the coach app (same bundle, role-gated):

```
/activities  /activities/sync          health-platform sync
/meals  /mealplan  /mealplan/macro-splits  /mealplan/scale-ingredients
/mealplan/search-recipes  /mealplan/templates/compatibility
/nutrition/food-search  /nutrition/create-food?barcode=  /nutrition/calorie-calculator
/messages  /messages/mark-as-read  /messages/mark-as-unread  /chat  /chat/ai/generate
/notifications  /notifications/preferences  /notifications/unread-count
/check-in-reminders/send-due
```

**[V]** Added by the disassembly, which gives the **verb and the function name** rather
than just a path string — these were in the string table but unattributable before:

```
GET  /app/today                       today()
GET  /app/profile                     profile()
GET  /app/available-metrics           getAvailableMetrics()
GET  /app/measurements                getMeasurements()
GET  /app/measurements/:id            getMeasurementHistory()
GET  /app/check-ins                   getCheckInHistory(params)
GET  /app/check-ins/:id               getCheckInDetail(id, params)
POST /check-in-reminders/send-due     sendDue()
GET  /clients/:id/form-schedule       getFormSchedule()   → { period, weekday }
GET  /lead-forms/:id                  getFormConfig()
GET  /onboarding/validate/:token      validateOnboardingToken()
POST /onboarding/complete/:token      completeOnboarding()  + completeOnboardingLegacy()
POST /chat/broadcast/clients          broadcastToClients()
POST /chat/broadcast/segmented        broadcastSegmented()
```

**[V]** The two `/app/check-ins` getters both pass
`{ params, paramsSerializer }` — an axios instance with a custom serializer, so the list
is filterable. **[I]** `completeOnboardingLegacy` alongside `completeOnboarding` is a
migration they are still carrying.

**[I]** `/lead-forms/:id` for `getFormConfig` is the interesting one: the same form engine
serves **public lead-capture forms** and client onboarding. That is a marketing-site
feature built out of the check-in wizard.

**[I]** `/chat/ai/generate` is an assistant drafting replies. `/check-in-reminders/send-due`
is a scheduled job — which confirms check-in reminders are server-driven, not local.
**[V]** A string reads *"Cancelling legacy local check-in reminders"*, so they moved
from on-device scheduling to server push.

---

## Screens — all 72

**[V]** Every name below is a literal string in the bundle.

### Shell and auth
`SplashScreen` · `WelcomeScreen` · `LoginScreen` · `TokenLoginScreen` ·
`ResetPasswordScreen` · `TabsScreen` · `HomeScreen` · `NotFoundScreen` ·
`MaintenanceScreen` · `AppUnavailableScreen` · `AppStoreUpdateScreen` · `UpdateScreen` ·
`AccessRevokedScreen` · `DevScreen`

**[I]** `AccessRevokedScreen` is the client-side of the coach's app-access control —
the screen somebody sees when their coaching ends. `MaintenanceScreen` pairs with the
`maintenance.json` on their CDN found in the earlier web research.

### Workouts
`WorkoutsScreen` · `WorkoutDetailsScreen` · `WorkoutHistoryScreen` ·
`WorkoutCollectionsScreen` · `WorkoutCollectionDetailsScreen` ·
`ActiveWorkoutListScreen` · `ActiveWorkoutDetailedScreen` · `FinishedWorkoutScreen` ·
`ExerciseScreen` · `ExerciseDetailsScreen` · `ListSessionScreen` ·
`DetailedSessionScreen` · `SessionHistoryDetailsScreen` · `TemplateBuilderScreen`

Sheets: `ExercisePickerSheet` · `ExerciseDetailsSheet` · `SelectExerciseDetailsSheet` ·
`ReplaceExerciseSheet` · `AddToWorkoutSheet` · `TemplateSetTypeSheet`

**[V]** Copy: *"An exercise must have at least one set"*, *"Add another exercise before
creating a superset"*, *"Applies to every set on this exercise"*.
**[I]** Supersets exist, and set-level config can be applied across an exercise.

### Nutrition
`NutritionScreen` · `FoodSearchScreen` · `CreateFoodScreen` · `MyFoodsScreen` ·
`MyRecipesScreen` · `RecipeBuilderScreen` · `RecipeDetailsScreen` · `RecipeBooksScreen` ·
`RecipeBookDetailsScreen` · `MealplanDetailsScreen` · `CreateClientMealPlanScreen` ·
`ClientMealPlanBuilderScreen` · `AddRecipesToMealPlanScreen` · `ShoppingListScreen` ·
`CalorieCalculatorScreen`

Sheets: `BarcodeScannerSheet` · `IngredientSearchSheet` · `ServingSheet` ·
`QuickAddSheet` · `AddToMealPlanSheet` · `RecipesInListSheet` · `ReportFoodSheet` ·
`MealPlansDisclaimerSheet`

**[V]** Copy: *"Calories eaten"*, *"Calories left"*, *"Calories per serving"*,
*"Today's meals"*, *"Added to today's diary"*, *"Allow camera access to scan food
barcodes"*, *"Barcode scannen"*.
**[I]** A **shopping list** generated from a meal plan is a feature Traiv has not
considered, and it is the kind of thing a client actually uses weekly.

### Check-ins
`CheckInDetailScreen` · `PreviousCheckinsScreen` · `PhotoLogScreen` ·
`StepsScreen` · `StepsDetailsBottomSheet` · `LogMetricBottomSheet` ·
`BodyCompositionBottomSheet` · `ManualStepsBottomSheet`

Components: `CheckInCard` · `CheckInCardEmptyState` · `CheckInCardSkeleton`

**[V]** Copy: *"Check-in completed successfully"*, *"Check-in updated"*,
*"Check-in not found"*, *"Check-in History"*, *"Continue check-in"* (`Check-in fortsetzen`),
*"Start check-in"* (`Check-in starten`).

> **Correction.** An earlier draft of this document quoted *"Cannot capture check-in.
> Client does not support sending check-ins."* as Coachway copy. It is not. That string
> belongs to `captureCheckIn`, which sits between `lastEventId` and `withMonitor` in the
> bundle and builds an envelope of `type: 'check_in'` against a `dsn` — it is **Sentry's
> cron-monitoring API**, and "check-in" there means a scheduled-job heartbeat. Unrelated
> to the coaching feature. A string match alone is not evidence of a feature.

**[V] A check-in is resumable, and the rules are recovered** — see *Control flow* below.

**[V]** `LogMetricBottomSheet` plus `/app/available-metrics` confirms the metric
registry drives the questions, exactly as built in Traiv.

### Activity and health
`ActivityDetailsScreen` · `NewActivityScreen` · `EditActivityScreen` ·
`LogActivityScreen` · `ActivityTypeSheet`

**[V]** Android permissions: `health.READ_STEPS`, `READ_ACTIVE_CALORIES_BURNED`,
`READ_EXERCISE`, `READ_DISTANCE`, `READ_HEART_RATE`, `READ_ELEVATION_GAINED`,
`READ_TOTAL_CALORIES_BURNED`, plus `ACTIVITY_RECOGNITION`.
**[V]** `/activities/sync`. **[I]** Health Connect on Android, HealthKit on iOS, with
`ManualStepsBottomSheet` as the fallback when no platform is connected.

### Messaging
`ChatScreen` · `ClientChatScreen` · `CoachChatScreen` · `CoachClientChatScreen` ·
`InboxScreen` · `CoachInboxScreen` · `NotificationsScreen` ·
`ChatActionsBottomSheet` · `AttachmentBottomSheet` · `AudioViewerScreen` ·
`VideoViewerScreen` · `ExternalVideoViewerScreen` · `ImageViewerScreen` · `PdfViewerScreen`

**[V]** Permissions include `RECORD_AUDIO` and background `audio`.
**[I]** Voice notes and video replies both ways, with in-app viewers for each media type
rather than handing off to the OS.

### Profile and settings
`ProfileScreen` · `PersonalInfoScreen` · `DocumentsScreen` · `IntegrationsScreen` ·
`ReportIssueScreen` · `SwitchAccountSheet` · `ChangePasswordBottomSheet` ·
`CountryLanguageBottomSheet` · `FeedbackModal` · `SurveyModal`

**[V]** `SwitchAccountSheet` and *"Skift konto"*.
**[I]** One person can hold several coaching relationships and switch between them in
the app — the same multi-coach case Traiv's `user`/`client` split was designed for
(ADR 0004). Good confirmation that decision was right.

---

## Control flow — the check-in, step by step

**[V]** Every name, string, payload field and route below is read out of the bytecode.

### One wizard serves both onboarding and check-in

This is the central design decision in their client app, and it was invisible from the
string table alone.

**[V]** `handleStartCheckIn` does exactly one thing:

```
router.push(`/steps?formId=${checkInForm.id}&isOnboarding=false`)
```

Onboarding pushes the same `/steps` route with `isOnboarding=true`. There is one
`StepsScreen` (#85420), one form store, one submit path, and a `flowType` of
`'check_in' | 'onboarding'` discriminating them. The two `useComplete*` hooks
(`useCompleteCheckIn`, `useCompleteOnboarding`) are both held by that screen and chosen
at submit time.

**[V]** The store carries guards that only make sense because the wizard is shared:
`executeIsDraftForDifferentForm` (compares `formId`), `executeIsDraftForDifferentFlow`
(compares `flowType`).

### The step order is server data, not client code

**[V]** `StepsScreen` reads `formId` from the route, calls `getForm(formId)`, and renders
`currentStepIndex` of `totalSteps`. `getDisplayOrderQuestions` orders them. There is **no
hardcoded sequence** — the coach's form definition is the sequence.

**[V]** Sixteen step components exist, which is the full set of question types:

| Component | `type` discriminator | Props beyond `stepId`, `required` |
|---|---|---|
| `StepNumber` | — | `metric` |
| `StepTextarea` | — | `onInputFocus` |
| `StepSingleSelect` / `StepMultiSelect` | — | `options` |
| `StepRating` | `star_rating` | `metric` |
| `StepRating` | `smiley_rating` | `metric` |
| `StepBodyMeasurement` | `body_measurement` | `measurements` |
| `StepBodyMeasurement` | `circumference_measurement` | `measurements` |
| `StepProgressPhotos` | — | `photoOptions` |
| `StepProfilePicture` | — | `existingImageUrl` |
| `StepPersonalInfo` | — | `countryCode`, `isOnboarding` |
| `StepGoals` · `StepWeightGoal` · `StepActivityLevel` | — | onboarding-only |
| `StepFoodPreferences` · `StepIngredientExclusion` | — | onboarding-only |
| `StepEatingDisorderScreening` | — | onboarding-only |
| `LastStep` | — | `isLoading`, `isOnboarding`, `onFinish` |

**[I]** `smiley_rating` alongside `star_rating` is worth noting: two renderings of the
same stored scale. And `StepEatingDisorderScreening` is a safeguarding step in the
onboarding flow — a duty-of-care question, not a metric.

### The form store

**[V]** Persisted (every mutation stamps `lastUpdatedAt`), shape read from the setters:

```ts
{
  formId, flowType: 'check_in' | 'onboarding',
  startedAt, lastUpdatedAt,
  submissionId,                      // uuid.v4(), generated in initialize()
  currentStepIndex, completedSteps: string[], stepValidities: Record<string, boolean>,
  answers: Record<questionId, Answer>,
  // onboarding-only branches
  personalInformation, type, allergies, eatingHabits, activity, excludedIngredients,
}
```

**[V]** `submissionId` is a **client-generated UUID, minted once in `initialize()` and
persisted with the draft**. It is sent in the payload. That is an idempotency key: a
retried submit after a network failure cannot create a second check-in.

### Resumability has a rule, and it is period-scoped

**[V]** `isDraftFromPreviousPeriod({ draftStartedAt, schedule, today })` compares the
draft against the *current* period boundary and returns `isBefore`. A draft is resumed
only if it belongs to the current period; an older one is stale.

**[V]** `getCurrentCheckInDueDate` computes that boundary from
`GET /clients/:id/form-schedule` → `{ period: 'day'|'week'|'month'|'year', weekday }`,
using `startOfDay` · `startOfMonth` · `getDay` · `addDays` · `subDays`.

**[I] Their cadence is not weekly — it is `day | week | month | year` with a configurable
`weekday`.** Traiv hardcoded a weekly Monday cadence (`studio.checkInWeekday`). This is
the same shape one enum column wider.

### Submit

**[V]** `getCheckInData` builds the payload:

```ts
{ formId, date, submissionId, answers }
```

**[V]** `executeSanitizeAnswersForSubmission` runs first and **throws** rather than
submitting bad data:

> *"Invalid questionId(s) detected before submission: … Only UUID questionId values are
> allowed in payload answers."*

**[V]** Photos do **not** go in that payload. `useParallelUpload({ onComplete,
maxRetries: 2, uploadType })` uploads them separately and in parallel, before submit.

**[V]** On success, `executeCheckInSuccessCleanup` → `cleanupFormPhotos()` then
`formStore.actions.reset()`. Local photo files are deleted only after the server accepts.

**[V]** On failure the draft is kept, and `ErrorState` offers two ways out:

> *"Oops! Something went wrong"* · *"We couldn't submit your form. Don't worry, your
> progress has been saved."* · **Try again** · **Clear saved form** · *"If the problem
> persists, please contact your coach for assistance."*

**[V]** `LastStep`: *"You're all set"* · *"Your {{type}} has been submitted
successfully."* where `type` is `check-in` or `onboarding` · **Continue**.

### So the exact step order is

1. Coach's form exists; `GET /clients/:id/form-schedule` gives `{ period, weekday }`.
2. `getCurrentCheckInDueDate` → the current period's due date.
3. Client taps **Start check-in** / **Continue check-in** on `CheckInCard`.
4. `router.push('/steps?formId=…&isOnboarding=false')`.
5. `getForm(formId)` → questions in display order.
6. Store `initialize()` — but first: is there a draft? `executeHasSavedDraft`, then
   `isDraftForDifferentForm`, `isDraftForDifferentFlow`, `isDraftFromPreviousPeriod`.
   Survive all four and the draft is resumed at its `currentStepIndex`; otherwise a fresh
   `submissionId` is minted.
7. Per step: render by `type`, `setStepValidity(stepId, valid)`, `setCurrentStep(i)`.
   Every change stamps `lastUpdatedAt` and persists.
8. Photos upload in parallel as they are picked, 2 retries each.
9. `LastStep` → `onFinish` → `executeSanitizeAnswersForSubmission` → `completeCheckIn`
   with `{ formId, date, submissionId, answers }`.
10. Success → `cleanupFormPhotos()` + `formStore.reset()`. Failure → draft intact,
    `ErrorState`, retry with the **same** `submissionId`.

### `CheckInDetailScreen` — the coach-side read

**[V]** Response fields, read from the property loads: `title`, `date`, `averageRating`,
`progressPhotos[]`, `metrics[]`, `ratings[]`, `responses[]`.

**[V]** Layout, as a collapsing-header screen: an `Animated.ScrollView`
(`scrollEventThrottle: 16`) under a parallax hero
(`absolute inset-0 bg-custom-primary`) carrying title, formatted date (`MMMM d, yyyy`,
localised via `getDateFnsLocale`) and a three-up summary strip in a
`bg-black/20 rounded-2xl p-2` — **Rating** (`averageRating.toFixed(…) / 5`, or `-`),
**Photos** (`progressPhotos.length`), **Metrics** (`metrics.length`). On scroll, a
`useAnimatedReaction` swaps the status bar to `light` and reveals a sticky
`absolute top-0 … bg-white border-b border-gray-200` bar with the title at
`numberOfLines: 1`. Body: `PhotoCarousel` → `RatingsSection` →
`BodyMeasurementsSection` → `TextResponsesSection`.

**[I]** The three-up strip is the same device Traiv's overview already uses. The
collapsing header is the part Traiv does not have, and on a phone it is what makes the
photos the first thing seen.

---

## What this changes for Traiv

Ordered by how much it would change what we build.

1. **Resumable check-ins, and the draft lives on the client.** Their draft is a persisted
   store on the device, not a server row — which means Traiv needs **no schema change** to
   match it. What it does need is the `submissionId` idempotency key in the submit
   payload, and the period-scoped staleness rule
   (`isDraftFromPreviousPeriod`) so a three-week-old draft is not resumed into this
   week's check-in. That is far cheaper than the draft table I assumed in the first draft
   of this document.
2. **The cadence is an enum, not a weekday.** `period: day | week | month | year` plus
   `weekday`. Traiv has `studio.checkInWeekday` and a hardcoded weekly scheduler. Widening
   `ensureCheckIns()` to a period enum now is one migration; doing it after check-in
   history exists is a backfill.
3. **One wizard for onboarding and check-in.** Both push `/steps?formId=…` and differ by
   `flowType`. Traiv has neither screen yet, so this is free to adopt — and it means the
   client-side check-in submission still owed (see `implementation-plan.md`) should be
   built as a generic form runner, not a check-in form.
4. **Validate before submit, and throw.** `executeSanitizeAnswersForSubmission` refuses to
   send a payload with a non-UUID `questionId`. Traiv's metric answers are already keyed by
   `metric.id`; the equivalent guard belongs in the client, not only in the API's zod
   schema, so a bad draft fails loudly on the device rather than as a 400.
5. **Photos upload separately, before submit, with retries.** Not as part of the payload.
   `maxRetries: 2`, parallel, and the local files are deleted **only after** the server
   accepts the check-in.
6. **The client API is its own namespace.** `/app/*`, not a reuse of the coach's routes.
   Traiv should do the same rather than widening `requireStudio` endpoints.
7. **Health-platform sync** is a first-class feature, not a nice-to-have — eight
   permissions and a dedicated sync endpoint.
8. **Shopping list from a meal plan.** Not on Traiv's roadmap; cheap once meal plans
   exist; clients use it weekly.
9. **Server-sent check-in reminders** (`/check-in-reminders/send-due`), after explicitly
   abandoning on-device scheduling.
10. **Account switching** validates the `user` ↔ `client` split already in Traiv.

## Still unknown

- **[U]** Response *bodies*. Field **names** are now verified for the check-in detail and
  the submit payload, read out of property loads and object literals. Types, nullability
  and the shape of `/app/today` are not.
- **[U]** Layouts outside the check-in flow. The method is proven — `className` strings
  are in the bundle — but only `CheckInDetailScreen` and `StepsScreen` were read.
- **[U]** Which screens a client sees versus a coach. One binary with role routing
  (`userRole`, `isClient*`); the split was not recovered.
- **[U]** Server-side behaviour: what `/app/check-ins` does with a repeated
  `submissionId`. The client treats it as an idempotency key; that the server honours it
  is inference.

**How to close these.** Static analysis can still go further — the same disassembly method
applied to `/app/today`'s consumer would give its field names, and to any screen would give
its layout. What static analysis *cannot* give is response **types** and server behaviour.
That needs the app run against a proxy, which needs a client login.
