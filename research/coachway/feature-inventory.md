# Coachway — complete feature inventory

Full sweep of every module, builder, dialog and settings pane reachable from an
authorised trial account. 24 Oct 2026.

**[V]** verified by observation · **[I]** inferred · **[U]** unknown / unreachable

**Safety.** Read-only throughout. Every capture asserts on non-`GET` traffic to
`api.coachway.io`; **none was ever observed**. Creation dialogs were opened and dismissed
without submitting. No credentials or personal data recorded; the test client's UUID is
written `<client-id>`.

**Method note.** Radix primitives listen for `pointerdown`, so synthetic
`element.click()` opens nothing — all interaction uses real `Input.dispatchMouseEvent`.
Controls render **8–14 seconds** after navigation, so every click polls for its target.

---

## Seeded content — what a brand-new account starts with

**[V]** Row counts on an account created the same day:

| Library | Rows | Ownership |
|---|---|---|
| Exercises | **25+** | `System` |
| Ingredients | **25+** | `System` |
| Metrics | **5** | `Personal` |
| Forms | **2** | incl. "Client Onboarding Form" |
| Recipes · Mealplans · Workout templates · Automations · Vault · Content | **0** | — |

**[V]** Sample exercise rows: Barbell Bench Press, Barbell Squat, Barbell Deadlift,
Bench Press, Deadlift (Lower Back), Deadlift (Glutes), Squats, Leg Press, Cable Lat
Pulldown, Dumbbell Bicep Curl, Dumbbell Bench Press, Pull-Up, Barbell High Bar Squat,
Seated Leg Press, Push-up, Leg Extension, Dumbbell Shoulder Press, Barbell Bent Over Row,
Barbell Row, Romanian Deadlift. Rendered as `Name  ·  MuscleGroup - Equipment`.

**[V]** Sample ingredient row:
`100% Hype Whey, Vanilla, NP Nutrition | 392 kcal / 100g | 78 g 4 g 7 g | Local Shop Items | Global | System`

**[V]** Sample metric row: `Sleep | Rating | - | Personal | Active`

**[I]** The split matters: exercises and ingredients are **System**-owned (global library,
forked per account), metrics are **Personal** (seeded *into* the account). Traiv's empty
`exercise`/`food` tables need the System model with `parentExerciseId`, and its metrics
equivalent does not exist at all.

---

## Creation flows — field inventories

### Create Exercise — `/workouts/exercises/create` **[V]**

A 2-step dialog: **1 Details · 2 Exercise**.

| Step | Fields |
|---|---|
| 1 Details | `name` (**0/255** counter), `description` |
| Media | **Upload Video** / **YouTube / Vimeo** / **Upload Image** (file inputs) |
| 2 Exercise | **[U]** gated behind step 1 |

Buttons: `Next`, `Close`.

### New Ingredient — `/nutrition/ingredients/create` **[V]**

Sections: *Basic Information* / *Nutritional Information*.

**[V]** Complete nutrient schema, all **per 100g**:

```
Calories · Protein · Carbs · Fat          (the four headline macros)
Fiber · Sugar · Sodium · Saturated Fat · Cholesterol
Iron · Calcium · Potassium · Vitamin D
```

plus `Name`, `Serving Size`, `Category` (select), `Portion`, preferences, allergens,
and a **Show all nutrients** expander. Buttons: `Cancel`, `Create Ingredient`.

**This is directly usable as Traiv's `food` schema**, which is currently empty.

### Add New Metric — `/forms/metrics/create` **[V]**

| Field | Required | Values |
|---|---|---|
| `Name` | **yes** (`*`) | text |
| `Type` | **yes** (`*`) | **Number · Text · Image · Rating** |
| `Unit` | **yes** (`*`) | text |

**[V]** `Save` is **disabled** until valid. Buttons: `Cancel`, `Save`.

**[I]** Four metric types is the whole vocabulary a check-in form can be built from.
`Image` as a first-class metric type is how progress photos become a tracked value
rather than an attachment.

### Create New Lead — `/leads/create` **[V]**

| Field | Required |
|---|---|
| `firstName` | **First Name \*** |
| `lastName` | **Last Name \*** |
| `email` | **Email \*** |
| `phone` | optional |
| Country | **Country \*** |
| Status, Assignee (`Unassigned`), Tags, Follow-up date, `notes` | optional |

Buttons: `Cancel`, `Create Lead`.

**[V]** Required fields are marked with a visible `*` here — **unlike** the add-client
wizard, where no field carried a required marker and `required` was `false` on all of
them. The two forms are inconsistent with each other.

### New meal plan template — `/nutrition/templates/create` **[V]**

The richest form in the product.

- `Template name *` (**0/40**), `Description` (**0/4096**), cover image (drag & drop)
- **Diet tags:** Vegan · Vegetarian · Pescetarian · Pregnancy · **PCOS** · High Protein ·
  Low Carbs · **Halal** · Kosher · Diabetic Friendly · Other
- **Allergens:** Contains Peanuts · Gluten · Fish · Shellfish · Eggs · Soy · Nuts ·
  Sesame · Lactose · Dairy · Sugar
- **Macro distribution:** `%` / `g` toggle, preset **"Default 30/40/30"**, *"Save as preset…"*
- **Add custom meal**
- **Recipe source:** *All recipes* ("Shared library and your own collection") /
  *My recipes only*
- **Scaling strategy:** *Scale to targets* ("Ingredients adjusted to hit your calorie and
  macro targets") / *Best match, unscaled* ("Find recipes that fit closest without
  modifying ingredients")

**[I]** The scaling toggle is the interesting design decision — generate against targets
by rescaling ingredients, or preserve recipes as written and accept drift.

**[I]** PCOS and Halal are present; **Jain and Eggetarian are not**. Traiv's `diet_type`
enum has both, and `.ai/` records them as non-negotiable for the Indian market. That is a
real, defensible gap in Coachway's coverage.

### Workout template builder — `/workouts/templates/create` **[V]**

- Tabs: **Edit · Exercises · Sections · Articles**
- Exercise picker with **Muscle / Equipment / Type** filters and `Search for exercises`
- Empty state: *"No exercises added yet"* → **Add First Section**

**[I]** A plan is composed of **Sections** containing exercises — a grouping level Traiv's
`workout_day` → `workout_item` model does not have. **Articles** as a tab means written
content can be embedded in a programme.

### Recipe builder — `/nutrition/recipes/create` **[V]**

`Edit Recipe` · `Save Recipe` · **Add Ingredient** · **Add Step**, with step text
*"Describe step 1 in detail…"*. **[I]** Ingredients plus ordered method steps.

### Automation builder — `/automations/create` **[V]**

- Sections: **Details · Steps**
- Fields: `Name`, `Short Description`
- **Trigger:** *By tag* / *Manually*, plus **Select tags** and **Client activation date**
- **Step types:** **Chat message · Document · Video · Audio**
- Validation: **"Add at least one step"**

**[I]** A drip-sequence engine: triggered by tag assignment or activation date, offset
from the client's start, delivering content. Not a general rules engine.

### Create Client — see `client-management.md` **[V]**
4-step gated wizard: Details · Templates · Membership · Overview.

### Form builder **[U]**
`/forms/create` returns **Page Not Found**, and clicking the existing form row did not
navigate. The builder exists (forms carry `sections[]` and a `version`) but its route was
not found. **Unresolved.**

---

## Settings — 14 panes, three different mechanisms

**[V]** Verified by probing every route and clicking every tab:

| Pane | Mechanism | Content observed |
|---|---|---|
| Account | `/settings/account` | Profile: brand name, email, phone, website, **logo** (Change Picture / Delete); *Legal documents — optional overrides*: Terms, Privacy ("Leave blank to use the default") |
| **App** | **`/settings/branding`** | **Primary / Secondary colour hex**, Title, Message, **portrait video, MP4 or MOV, up to 150 MB** |
| **Team** | **`/settings/team`** | `Search users…` |
| **Tags** | **`/settings/tags`** | `Search tags…`, *"No tags found"* |
| **Email** | **`/settings/email`** | `Search templates…` — an email **template library** |
| Statuses | `/settings/statuses` | `Search statuses…` — custom client statuses |
| Billing | `/settings/billing` | Billing · Invoices · Manage · Cancel subscription |
| Client defaults | `?section=client-defaults` | activation mode, check-in schedule, no-contact, app access |
| Integrations | `?section=integrations` | **Zapier**, **Create key** → `GET /zapier/api-keys` |
| Nutrition defaults | `?section=nutrition-defaults` | four presets (below) |
| Notifications & app | `?section=notifications` | sender display: **"Coach's name"** |
| Stripe · Business | **[U]** | 404 as routes; `?section=` falls back to Account. **[I]** gated or differently-slugged |

**[V] Nutrition default presets** — a feature-count summary per preset:

| Preset | Description | Features |
|---|---|---|
| Full access | "Every nutrition tool available." | **7 of 7** |
| Standard | "Log food without personal meal plans or the calculator." | **3 of 7** |
| Photo only | "Snap meals, no counting." | **1 of 7** |
| Plan only | "Follows the plan, no logging." | — |

**[I]** These presets write the per-client toggles in `/clients/:id/settings`. A coach
picks a preset rather than setting 20 switches — a pattern worth copying if Traiv ever
adds per-client capability flags.

**[V]** Legal URLs are **optional overrides** with a platform default. Relevant to
Traiv's white-label and the DPDP Act.

---

## Client profile tabs — all six **[V]**

| Tab | URL | Content |
|---|---|---|
| Overview | `?tab=overview` | the aggregate cards (one `/overview` call) |
| Development | `?tab=development` | Check-in · Nutrition · Body progress · Training; photo comparison (Front/Side/Back); week stepper; 30d/90d/6m/12m |
| Vault | `?tab=vault` | *"No client vault resources yet"* → **Add from library** / **Upload Resource** |
| **Payment** | `?tab=payment` | **Payment History**, **"Payment Plan Not Setup"** → **Add payment plan**, **View details**, **End access** |
| Automations | `?tab=automations` | *"No automations assigned"* → **Add automation** |
| Settings | `?tab=settings` | General · Alerts · Access · **Danger zone** |

Drawers: `?drawer=info` (Personal Information · Activity & Dietary Information ·
**Questionnaire**) · `?drawer=tasks` · `?drawer=notes` · `?drawer=messages` (Chat).

**[I]** The Payment tab proves the coach bills the client **through** Coachway —
`client.stripeCustomerId` plus `/billing/connect/status` (seen prefetched by the add-client
wizard) means Stripe Connect. That is the per-client revenue flow Traiv's 0%-platform-fee
positioning is aimed at.

**[V]** `Add from library` on the client Vault tab — resources are assigned from the
account library, not uploaded per client.

---

## Modules with no data in this account

**[V]** Structure and endpoints confirmed; behaviour **[U]** because all are empty.

| Module | Route | Controls | Empty state |
|---|---|---|---|
| Inbox | `/inbox` | Inbox / **Photo log**, "Refine the list" | — |
| Photo log | `/inbox/photo-log` | — | **renders "Error"** |
| Leads | `/leads` | Add lead, Customize, 3-month range, salesrep + tag + country + status filters | — |
| Automations | `/automations` | Filter, view toggle, sort by Date Created | "No automations found" |
| Vault | `/vault/resources` | Add file → **Upload Resource**, Resource type + tag filters | "No resources found" |
| Content | `/content/{articles,cookbooks,workout-packs}` | **Create collection** | "No collections found" |
| Insights | `/insights` | Sales · Monthly sales by rep · Leads · Client growth · Engagement; Last 30 days | — |

**[V]** `/inbox/photo-log` renders an **Error** heading for a client with no photos —
**[I]** an unhandled empty case, not a designed state. Worth not reproducing.

**[V]** Content types are "collections" — Articles, Cookbooks, Workout packs all use the
same **Create collection** control.

---

## Still unresolved

| # | Unknown | Why it stayed unknown |
|---|---|---|
| 1 | Form builder route | `/forms/create` is 404; row click did not navigate |
| 2 | Step 2+ of every wizard | Gated behind valid step 1, which needs a submit-path |
| 3 | Stripe and Business settings panes | 404 as routes, fall back to Account as `?section=` |
| 4 | All write behaviour | Excluded by design — no POST/PATCH/PUT was issued |
| 5 | Messaging, tasks, notes internals | Drawers opened; no data and no endpoints observed |
| 6 | Search / sort / pagination semantics | One client, 25 library rows — too little to provoke |
| 7 | How a check-in row is created | Still the central open question |

---

## What is worth taking, ranked

1. **Seeded libraries at account creation** — Traiv's `exercise: 0` / `food: 0` is the
   live blocker on plan generation, and the ingredient form above is a ready schema.
2. **Metric types (Number · Text · Image · Rating)** — the vocabulary check-in forms
   compose from. Traiv's `body_metric` is weight-only.
3. **Nutrition presets over 20 switches** — the right UX for per-client capability flags.
4. **Sections inside workout templates** — a grouping level Traiv's plan model lacks.
5. **Meal-plan scaling strategy** — scale-to-targets vs best-match-unscaled is a real
   product decision Traiv will face the moment it generates plans.
6. **Legal URLs as optional per-account overrides** — cheap, and DPDP-relevant.

**Not worth taking:** the inconsistent required-field marking between Create Lead and
Create Client; three different settings navigation mechanisms; `/inbox/photo-log`
rendering "Error" as an empty state; and the 8–14s interactive load.
