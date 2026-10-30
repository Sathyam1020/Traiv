# Nutrition — Recipes, Ingredients, Meal Plans, and the client Food tab

Modelled on Coachway, from 59 reference screenshots walked through live by the founder
(trainer: Recipes, Ingredients, Meal Plans, and a client's Nutrition tab; client app: the
Food tab end to end — empty state, assigned-plan state, recipe detail and logging, quick
add, barcode scan, My Recipes). Every claim about their behaviour is marked **[V]**
(observed in a screenshot) or **[I]** (inferred / our design decision); **[U]** marks
something genuinely unknown that a future pass should resolve. This follows the exact
shape and evidence discipline of `.ai/features/check-ins/spec.md`.

**Implementation scope approved 2026-10-30:** complete Ingredients and Recipes (A + B). Indian recipes live in the same Recipes library, never a separate section. System items open in editable forms; saving creates an independent Personal version without requiring a manual Duplicate step (ADR 0028). Shared source rows remain immutable. The founder clarified that the Coachway export must also populate the library: 1,099 source recipes plus 136 Indian recipes. Authenticated details resolve ingredient names and steps; original source images and nutrition snapshots are retained. Indian recipes are authored with explicit ingredient weights and instructions. Meal plans and client food logging remain later phases.

---

## Decision #1 — RESOLVED (2026-10-27): drop the AI diet-plan schema, write ADR 0025

The founder confirmed: no AI generation, remove it entirely, this is the main priority.
The resolution below is approved as written — proceed with it.

Per `.ai/decisions/README.md`'s own rule — *"If new work contradicts an existing ADR:
stop. Identify the conflict, explain it, ask for confirmation, then write a new ADR
marking the old one superseded"* — and CLAUDE.md's *"Never silently overwrite a recorded
decision"*, this has to be surfaced before anything else.

**What exists today, already migrated (migration 0014), and unused by any route except
one boolean check:**

- `packages/db/src/schema/library.ts` → `foods` table: a hand-written ~70-row Indian food
  list, macros **per home measure** ("1 katori"), tagged `veg|egg|nonveg|vegan|jain` and
  `slots: breakfast|lunch|dinner|snack`. The file's own doc comment says: *"Treat this as
  the mechanism proven with plausible data, not as a food database. The real one is a v2
  roadmap item and wants someone qualified to sign each row off."*
- `packages/db/src/schema/plan.ts` → `diet_plan` → `meal` → `meal_item`, plus `meal_log`.
  The model: **the AI generates one 7-day plan per client** (`planSource: "ai" | "coach"`,
  `status: generating | proposed | active | superseded | failed`), composed server-side
  from the `foods` table, a coach approves it. No recipe concept. No reusable templates.
  No ingredient-level composition a coach builds by hand.
- The only live reference anywhere in route code is
  `apps/api/src/features/client/today.ts`: `reveal.food = dietPlan.length > 0` — a single
  existence check for nav-tab gating. Nothing reads or writes `meal` / `meal_item` /
  `meal_log` anywhere else in the app.

**This is flatly incompatible with what the 59 screenshots show.** Coachway has a
trainer-curated **Recipe** library built from a global, per-100g **Ingredient** database
(~4,062 rows, filterable by Category/Tags/Country/Type); a **Meal Plan Template** builder
(%-macro-split targets, per-slot recipe candidates, a "scale to targets" recipe-scaling
engine); and a client-side **daily food log** (barcode scan, quick-add, My Recipes, "add
from yesterday") — with **no AI generation step anywhere in the flow the founder walked
through.**

This mirrors, almost exactly, the situation ADR 0023 → ADR 0024 already resolved for
workouts: an earlier, inferred schema turned out wrong once checked against the real app,
and got superseded. The same move is needed here.

**Recommendation — write ADR 0025, "Nutrition is recipes and meal-plan templates, not
AI-generated diet plans," superseding the food/nutrition half of ADR 0004:**

1. Drop `diet_plan`, `meal`, `meal_item`, `meal_log`, `plan_status`, `plan_source`,
   `meal_slot` entirely. Nothing reads them beyond the one boolean check, which moves to
   the new model's equivalent (§ API, `reveal.food`).
2. Drop `foods` and `food_request`, replaced by the new `ingredient` table below. The
   ~70 hand-written rows in `apps/api/src/library/foods.ts` are not wasted — their
   *names and preparations* are a useful starting checklist for India-specific seeding
   (§ Decision #2), just not in the home-measure shape or table they live in today.
3. `nutrition_target` (`packages/db/src/schema/intake.ts`) is **untouched** — it already
   stores per-client kcal/protein/carbs/fat computed by `@traiv/nutrition` (ADR 0019),
   independent of how a plan gets built, and is exactly the "2,809 kcal recommended for
   this client" auto-suggest seen in the meal-plan-template screenshot.
4. ADR 0004's still-open question — *"Can a coach's custom exercise or food be promoted
   to the global library?"* — gets answered the same way the workout library already
   answers it for exercises: it isn't promoted, a coach's own ingredient/recipe is just a
   row with `studioId` set, visible only to them, same table as the System rows.

**Confirmed:** no AI generation; see ADR 0025 and the approved implementation scope above.

---

## What this phase is

**[V]** Three trainer-app sections under a **Nutrition** nav group (Recipes, Ingredients,
Mealplans — matching the sidebar in the screenshots, sitting alongside the existing
Workouts group) plus a **Nutrition tab on a client's profile**, plus the client app's
existing **Food** tab (currently an empty shell gated by the stale `reveal.food` check).

**[V]** The object model, read directly off the screenshots:

- An **Ingredient** is a global fact: a name, a category, a per-100g macro/micronutrient
  profile, country, dietary tags, allergen flags. ~4,062 rows observed, paginated.
- A **Recipe** is coach-authored (or, in the client app, client-authored): a name,
  servings count, media, meal-type tags, difficulty/prep/cook time, allergen and dietary
  tags, a list of Ingredient rows each with a quantity+unit, and an ordered list of
  instruction steps. Its nutrition is **computed from its ingredients**, never entered
  directly.
- A **Meal Plan Template** is coach-authored: a calorie target, a macro split (%
  protein/carbs/fat), a per-meal-slot % calorie distribution (Breakfast/Morning
  Snack/Lunch/Afternoon Snack/Dinner/Evening Snack, toggleable, percentages must sum to
  100), and — per slot — a set of candidate Recipes ("Breakfast (4 recipes)"), each
  optionally **scaled** so its macros land on that slot's target. The founder's own
  words: *"these are like a bunch of recipes for each time and the client can select any
  of these."* This is **not** one prescribed meal per slot — it's a pickable set.
- A client reaches a Meal Plan the same way they reach a workout: **duplicate, not
  assign.** From their profile's Nutrition tab, a coach either builds one from scratch
  (pre-filled with that client's `nutrition_target`) or duplicates a Live template,
  customising the calorie/macro numbers before creating — **[V]** confirmed by the exact
  two-step "Create from existing" sheet in the screenshots: pick a template → "Use
  existing calories and macros from template" or "Define custom calories and macros."
  Each client's copy is independently editable, same reasoning as ADR 0024's workout
  model: *"each client gets their own programme the coach can edit without touching
  anybody else's."*
- The **client Food tab** is a daily log, independent of whether a plan is assigned —
  **[V]** the empty-state screenshots show full logging (barcode scan, quick-add, My
  Recipes, per-meal "Add item") with **no meal plan present at all**. A plan being
  assigned adds a banner card and a set of pre-built recipe options to pick from; it does
  not gate logging.

---

## Decision #2 — RESOLVED (2026-10-27): use the GitHub dataset, pinned pre-AGPL

Implementation clarification (ADR 0026, 2026-10-30): the import pins the immutable
`@ifct2017/compositions@2.0.8` npm archive (2022), checks its version and MIT package
metadata **and actual LICENSE text** before import, and retains the MIT notice.
This replaces the earlier Git-commit pin mechanism; the archive contains 542 rows.

## The ingredient database architecture (the load-bearing part)

Researched directly, not guessed — current API docs, licensing, and dataset sizes
checked live.

**(a) Seeded System ingredient library — USDA FoodData Central (Foundation Foods + SR
Legacy).** CC0 / public domain, bulk CSV/JSON download (`fdc.nal.usda.gov/download-datasets`,
no live-API dependency needed for the seed), generic unbranded items ("banana, raw",
"chicken breast, raw") — exactly the shape of ingredient Coachway's own list shows
("Agurk, norsk, rå", "Banana, raw"). Seeded the same way `free-exercise-db` was seeded
for exercises (`apps/api/src/library/exercise-db.ts`): a new `apps/api/src/library/fdc-ingredients.ts`,
idempotent upsert on name, run via a seed script.

**(b) India-specific layer, seeded alongside (a) — this is the one place Traiv has to do
work Coachway never did.** Coachway's own Country filter lists Norway, Finland, Denmark,
Sweden, Germany, UK — a Nordic/EU-market coach never needed an India row. Traiv's clients
are Indian, so this matters more than anything else in the ingredient database.

**RESOLVED (2026-10-27)**: use [`nodef/ifct2017`](https://github.com/nodef/ifct2017) —
542 Indian foods across 151 nutrient fields (macros, vitamins, minerals, amino acids,
food codes, regional variants), genuinely seed-ready. **Pin the import to the last
commit/tag before the 2025-04-18 MIT→AGPL-3.0 relicense** (confirm the pinned commit's
`LICENSE` file still reads MIT before writing the seed script) — the data and shape are
unaffected, only the license carried at that point in history, which is what a
closed-source backend needs. `apps/api/src/library/ifct-ingredients.ts`, same idempotent
upsert-on-name pattern as `exercise-db.ts`, mapped into the new per-100g `ingredient`
shape.

**(c) Live barcode-scan lookup — Open Food Facts.** Free, ODbL-licensed, literally
barcode-first by API design (`GET /api/v2/product/{barcode}.json`), ~4 million products
across 182 countries (2025 figure), real but uneven coverage of Indian packaged
goods (strong for international brands sold in India, weaker for small regional ones —
real gap, not fabricated reassurance). On a client's barcode scan: call Open Food Facts
live, and if a match comes back, **write it into our own `ingredient` table** with
`source = "openfoodfacts"` and the barcode stored — so the second scan of the same
product, by anyone, anywhere, is a local lookup, not a repeat external call. This is the
one deliberately-live piece of an otherwise seed-once system; everything else in (a)/(b)
is a build-time import.

**(d) Recipes have no external data source.** Confirmed by the screenshots and by
design: a recipe is coach- or client-authored, built from Ingredient rows, the same way a
workout template is built from Exercise rows. There is no "recipe database" question to
solve — only the ingredient one above.

**Cost shape**: zero recurring per-call cost anywhere except Open Food Facts barcode
calls, which are free and uncapped for this exact use case (a per-scan, user-triggered
lookup — their own docs push bulk-export over scraping, which this isn't). Nothing here
works against the ₹999/month pricing the way a metered commercial nutrition API
(Spoonacular/Edamam/Nutritionix — all checked, all either too-thin free tiers or
recurring paid cost) would.

---

## Schema

New file `packages/db/src/schema/nutrition.ts`. Migration **0023** (next free number).
Eight new tables, five new enums. Mirrors the Template → Session → Exercise → Set shape
ADR 0024 already established for workouts, adapted where recipes genuinely differ from
exercises (a recipe has its own nutrition, computed from children; an exercise doesn't).

```ts
import { sql } from "drizzle-orm";
import {
  check, index, integer, jsonb, pgEnum, pgTable, real, text, timestamp, uniqueIndex,
} from "drizzle-orm/pg-core";
import { clients } from "./client.js";
import { memberships, studios } from "./studio.js";

/** Who authored it. Same split as `templateSource` for workouts — kept as its own enum
 *  rather than reused, same reasoning as every other lifecycle enum in this codebase
 *  (`checkInStatus`, `targetStatus`, `templateStatus` are all independent despite
 *  overlapping values). */
export const recipeSource = pgEnum("recipe_source", ["coach", "client"]);
export const mealPlanStatus = pgEnum("meal_plan_status", ["draft", "active"]);
export const mealPlanSource = pgEnum("meal_plan_source", ["coach", "client"]);
export const mealPlanRecipeSource = pgEnum("meal_plan_recipe_source", ["all", "mine"]);
export const mealPlanRecipeMatching = pgEnum("meal_plan_recipe_matching", [
  "scale", "best_match",
]);

/* -------------------------------------------------------------------------- */
/* Ingredients                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A food, per 100g. The generic fact every Recipe is built from — same relationship
 * `exercise` has to `workout_session`.
 *
 * `studioId` null = shared library (seeded from FDC/IFCT/Open Food Facts on first
 * barcode hit). Set = a coach's own ingredient. Same Personal/System split as
 * `exercise.studioId`, same reason: a coach's private row and a seeded one share one
 * shape rather than the seed having a richer one than the form.
 */
export const ingredients = pgTable(
  "ingredient",
  {
    id: text().primaryKey(),
    studioId: text().references(() => studios.id, { onDelete: "cascade" }),

    name: text().notNull(),
    /** "fdc" | "ifct" | "openfoodfacts" | "coach" | "client" — provenance, for support
     *  and re-import; never shown directly in UI (the Type filter is studioId
     *  null-vs-set, same as exercises). */
    dataSource: text(),
    /** Set only for barcode-cache rows (§ Decision #2c). Unique where present. */
    barcode: text(),

    /** Free text, not a pgEnum — same reasoning as `exercise.category`/`location`:
     *  "Coachway-specific; not in the dataset," and the list keeps growing. */
    category: text(),
    /** ISO-ish country name — "India", "Global", "Norway", … */
    country: text(),

    /** Vegan · Vegetarian · Pescetarian · Pregnancy · PCOS · High Protein · Low Carbs ·
     *  Halal · Kosher · Diabetic Friendly — what a diet or a health flag favours. */
    dietaryTags: text().array().notNull().default(sql`'{}'::text[]`),
    /** Contains Peanuts · Gluten · Fish · Shellfish · Eggs · Soy · Nuts · Sesame ·
     *  Lactose · Dairy · Sugar — positive assertions, not restrictions, so a separate
     *  column from `dietaryTags` rather than overloading one list with opposite meanings. */
    allergenTags: text().array().notNull().default(sql`'{}'::text[]`),

    /** "What a quantity typed against this ingredient resolves to" — e.g. "tsp" + 5 means
     *  5g per tsp, same job `exercise.defaultFields` does for a session_exercise. */
    defaultUnit: text(),
    gramsPerUnit: real(),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),

    /** Fiber, sugar, sodium, saturated fat, cholesterol, iron, calcium, potassium,
     *  vitamin D, and whatever else "Show all nutrients" exposes — held as one blob for
     *  the same reason `workout_template.defaultValues` is: the set of fields the UI
     *  exposes grows, and this is a form's data, not something queried individually. */
    micronutrients: jsonb(),

    imageUrl: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("ingredient_name_key").on(t.name, t.studioId).where(sql`${t.deletedAt} is null`),
    uniqueIndex("ingredient_barcode_key").on(t.barcode).where(sql`${t.barcode} is not null`),
    index("ingredient_studio_idx").on(t.studioId),
    index("ingredient_category_idx").on(t.category),
    check("ingredient_kcal_sane", sql`${t.kcal} between 0 and 2000`),
  ],
);

/* -------------------------------------------------------------------------- */
/* Recipes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A dish, coach- or client-authored, built from Ingredient rows.
 *
 * `clientId` null = a studio recipe (a coach's own, visible across their roster — the
 * "My recipes only" vs "All recipes" split in the meal-plan-template builder reads this
 * column). Set = a client's own "My Recipes" entry in the client app. Exact mirror of
 * `workout_template.clientId`'s null-vs-set meaning.
 *
 * Nutrition is never entered directly — it is the sum of `recipe_ingredient` rows,
 * divided by `servings`. Computed on read, not stored, because a recipe's own ingredient
 * list is the source of truth and nothing else writes to it.
 */
export const recipes = pgTable(
  "recipe",
  {
    id: text().primaryKey(),
    studioId: text().notNull().references(() => studios.id, { onDelete: "cascade" }),
    clientId: text().references(() => clients.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    servings: integer().notNull().default(1),

    imageUrl: text(),
    videoUrl: text(),
    /** YouTube/Vimeo link, kept distinct from an uploaded `videoUrl` — same two-path
     *  upload-or-link pattern the New Recipe panel shows. */
    videoLinkUrl: text(),

    /** Breakfast · Morning Snack · Lunch · Afternoon Snack · Dinner · Evening Snack —
     *  multi-select, a recipe can suit more than one slot. */
    mealTypes: text().array().notNull().default(sql`'{}'::text[]`),
    difficulty: text(),
    prepMinutes: integer(),
    cookMinutes: integer(),

    dietaryTags: text().array().notNull().default(sql`'{}'::text[]`),
    allergenTags: text().array().notNull().default(sql`'{}'::text[]`),

    source: recipeSource().notNull().default("coach"),

    createdBy: text().references(() => memberships.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    index("recipe_studio_idx").on(t.studioId),
    index("recipe_client_idx").on(t.clientId),
    check("recipe_servings_sane", sql`${t.servings} between 1 and 50`),
  ],
);

/** One ingredient line in a recipe. */
export const recipeIngredients = pgTable(
  "recipe_ingredient",
  {
    id: text().primaryKey(),
    recipeId: text().notNull().references(() => recipes.id, { onDelete: "cascade" }),
    ingredientId: text().notNull().references(() => ingredients.id, { onDelete: "restrict" }),

    position: integer().notNull(),
    quantity: real().notNull(),
    /** "grams" | "ml" | "piece" | "tsp" | "cup" | "bar" | "bunch" | "bag" | "can" | "dl" |
     *  "handful" | "head" | "leaf" | "portion" — observed in the unit dropdown. */
    unit: text().notNull(),
  },
  (t) => [
    uniqueIndex("recipe_ingredient_position_key").on(t.recipeId, t.position),
    index("recipe_ingredient_ingredient_idx").on(t.ingredientId),
  ],
);

/** One numbered instruction step. */
export const recipeSteps = pgTable(
  "recipe_step",
  {
    id: text().primaryKey(),
    recipeId: text().notNull().references(() => recipes.id, { onDelete: "cascade" }),
    position: integer().notNull(),
    text: text().notNull(),
  },
  (t) => [uniqueIndex("recipe_step_position_key").on(t.recipeId, t.position)],
);

/* -------------------------------------------------------------------------- */
/* Meal plan templates and programmes                                         */
/* -------------------------------------------------------------------------- */

/**
 * A named nutrition programme. **Template → Slot → candidate Recipes**, the direct
 * analogue of **Template → Session → Exercise**.
 *
 * `clientId` null/set carries the exact same meaning as `workout_template.clientId`:
 * null is the studio's reusable template; set is one client's copy, made by "Create from
 * template" or "Create new plan." The copy is the point — editing a client's plan must
 * never touch the template, or anybody else's copy.
 */
export const mealPlanTemplates = pgTable(
  "meal_plan_template",
  {
    id: text().primaryKey(),
    studioId: text().notNull().references(() => studios.id, { onDelete: "cascade" }),
    clientId: text().references(() => clients.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    coverImageUrl: text(),

    calorieTarget: integer().notNull(),
    recipesPerMeal: integer().notNull().default(4),

    proteinPct: integer().notNull(),
    carbsPct: integer().notNull(),
    fatPct: integer().notNull(),

    dietaryPreferences: text().array().notNull().default(sql`'{}'::text[]`),
    allergensToAvoid: text().array().notNull().default(sql`'{}'::text[]`),

    recipeSourceSetting: mealPlanRecipeSource().notNull().default("all"),
    recipeMatching: mealPlanRecipeMatching().notNull().default("scale"),

    status: mealPlanStatus().notNull().default("draft"),
    source: mealPlanSource().notNull().default("coach"),

    createdBy: text().references(() => memberships.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    archivedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    index("meal_plan_template_studio_idx").on(t.studioId, t.status),
    index("meal_plan_template_client_idx").on(t.clientId),
    check("meal_plan_template_macro_pct_sane",
      sql`${t.proteinPct} + ${t.carbsPct} + ${t.fatPct} = 100`),
  ],
);

/**
 * One meal slot within a template — Breakfast, Lunch, … or a custom name ("+ Add custom
 * meal"). `percentage` is this slot's share of `calorieTarget`; `enabled` is the toggle
 * shown per row (an unchecked slot keeps its % at 0 and is hidden from the client build).
 */
export const mealPlanSlots = pgTable(
  "meal_plan_slot",
  {
    id: text().primaryKey(),
    templateId: text().notNull().references(() => mealPlanTemplates.id, { onDelete: "cascade" }),

    name: text().notNull(),
    position: integer().notNull(),
    percentage: integer().notNull().default(0),
    enabled: integer().notNull().default(1),
  },
  (t) => [
    uniqueIndex("meal_plan_slot_position_key").on(t.templateId, t.position),
    check("meal_plan_slot_pct_sane", sql`${t.percentage} between 0 and 100`),
  ],
);

/**
 * One candidate recipe in a slot. A slot holds several — the client picks one, not all —
 * matching the founder's description exactly: "a bunch of recipes for each time and the
 * client can select any of these."
 *
 * Macros are **copied at assignment time**, not joined — same reasoning as
 * `session_exercise`/`meal_item` elsewhere in this codebase: correcting a typo in a
 * recipe later must not silently rewrite every meal plan that references it. When
 * `recipeMatching = "scale"`, `scaleFactor` is the multiplier applied to the recipe's own
 * per-serving macros to land on the slot's target (the "+70 kcal" diff badge in the
 * builder is `scaledKcal - recipe's own kcal`); `"best_match"` leaves `scaleFactor` at 1.
 */
export const mealPlanRecipes = pgTable(
  "meal_plan_recipe",
  {
    id: text().primaryKey(),
    slotId: text().notNull().references(() => mealPlanSlots.id, { onDelete: "cascade" }),
    recipeId: text().notNull().references(() => recipes.id, { onDelete: "restrict" }),

    position: integer().notNull(),
    scaleFactor: real().notNull().default(1),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),
  },
  (t) => [
    uniqueIndex("meal_plan_recipe_position_key").on(t.slotId, t.position),
    index("meal_plan_recipe_recipe_idx").on(t.recipeId),
    check("meal_plan_recipe_scale_sane", sql`${t.scaleFactor} between 0.1 and 10`),
  ],
);

/* -------------------------------------------------------------------------- */
/* The daily log                                                              */
/* -------------------------------------------------------------------------- */

/**
 * One logged food, one client, one day. The client app's "Today's meals."
 *
 * Exactly one of `recipeId` / `ingredientId` / the manual fields is set — same
 * one-of-N discipline `check_in_answer` already established in this codebase for the
 * same reason (a CHECK makes the invariant a fact the database enforces, not a
 * convention the API has to remember). `recipeId` covers both a coach-assigned recipe
 * and a client's own "My Recipe" (same table, see `recipe.clientId`). `ingredientId`
 * covers a raw ingredient or a barcode-scanned product — both are Ingredient rows, so
 * there is no separate "scanned product" entity. The manual fields back quick-add, where
 * nothing in the library is referenced at all.
 *
 * All nutrition is **frozen at log time** — editing a recipe later must not rewrite what
 * somebody's Tuesday said they ate.
 */
export const foodLogEntries = pgTable(
  "food_log_entry",
  {
    id: text().primaryKey(),
    clientId: text().notNull().references(() => clients.id, { onDelete: "cascade" }),

    date: text().notNull(),
    /** "breakfast" | "lunch" | "dinner" | "snacks" — the four cards the Food tab always
     *  shows, regardless of how many slots the assigned plan itself defines (a plan's
     *  Morning/Afternoon/Evening Snack slots, and anything logged with no plan at all,
     *  all land on the one "Snacks" card client-side). [I] — inferred from the empty-state
     *  and populated-state screenshots both showing exactly these four cards; not
     *  re-verified against decompiled app code (§ Open questions). */
    slot: text().notNull(),

    recipeId: text().references(() => recipes.id, { onDelete: "set null" }),
    ingredientId: text().references(() => ingredients.id, { onDelete: "set null" }),
    /** Servings for a recipe-based entry (e.g. 0.5), or a quantity+unit pair for an
     *  ingredient-based one — mirroring `recipe_ingredient`'s own quantity/unit shape, and
     *  the Serving-vs-grams toggle shown on the logging sheet. */
    servings: real(),
    quantity: real(),
    unit: text(),

    /** Quick-add only: name/calories/macros typed directly, nothing in the library
     *  referenced. */
    manualName: text(),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),

    loggedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("food_log_entry_client_date_idx").on(t.clientId, t.date),
    check(
      "food_log_entry_one_source",
      sql`(${t.recipeId} is not null)::int + (${t.ingredientId} is not null)::int +
          (${t.manualName} is not null)::int = 1`,
    ),
  ],
);

export type Ingredient = typeof ingredients.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type MealPlanTemplate = typeof mealPlanTemplates.$inferSelect;
export type MealPlanSlot = typeof mealPlanSlots.$inferSelect;
export type MealPlanRecipe = typeof mealPlanRecipes.$inferSelect;
export type FoodLogEntry = typeof foodLogEntries.$inferSelect;
```

---

## A prerequisite this phase finally needs to build: a studio-scoped upload signer

`apps/api/src/features/client/uploads.ts` signs direct-to-Cloudinary uploads, but it is
**client-scoped only** (`requireClient`, folder keyed by `clientId`, `kind: "check-in" |
"avatar"`). Recipe images/videos, ingredient images, and meal-plan cover images are all
**coach-uploaded** — there is no studio-scoped equivalent yet (confirmed absent; the
exercise builder's own code comment already flags this as "its own small piece of work
rather than something to improvise inline").

Add `apps/api/src/features/studio/uploads.ts`: same `signUpload`/`sign` shape, mounted at
`POST /:studioId/uploads/sign` on `studioApp` behind `requireStudio`, folder keyed by
`studioId`, `kind: "recipe-image" | "recipe-video" | "ingredient-image" | "mealplan-cover"`.
This is a small, mechanical mirror of the existing client one — ship it first, everything
in Phase B onward depends on it.

---

## API

All under `requireStudio` (trainer routes, `/:studioId/...`) or `requireClient` (client
routes, `/c/:studioId/...`), matching the existing convention exactly.

```
# Ingredients (trainer)
GET    /:studioId/ingredients                 ?search=&category=&tags=&country=&type=&sort=&page=
POST   /:studioId/ingredients
GET    /:studioId/ingredients/:id
PATCH  /:studioId/ingredients/:id
DELETE /:studioId/ingredients/:id

# Recipes (trainer)
GET    /:studioId/recipes                     ?search=&mealType=&tags=&type=&sort=
POST   /:studioId/recipes
GET    /:studioId/recipes/:id
PATCH  /:studioId/recipes/:id                 (name, servings, ingredients[], steps[], tags, media, …)
DELETE /:studioId/recipes/:id

# Meal plan templates (trainer)
GET    /:studioId/mealplan-templates
POST   /:studioId/mealplan-templates
GET    /:studioId/mealplan-templates/:id
PATCH  /:studioId/mealplan-templates/:id      (draft autosave — "Local changes" / "Save")
POST   /:studioId/mealplan-templates/:id/publish
POST   /:studioId/mealplan-templates/:id/slots/:slotId/recipes   (add a candidate recipe)
DELETE /:studioId/mealplan-templates/:id/slots/:slotId/recipes/:mealPlanRecipeId

# A client's Nutrition tab (trainer)
GET    /:studioId/clients/:clientId/mealplan                      (null if none assigned)
POST   /:studioId/clients/:clientId/mealplan                      (create new, from nutrition_target)
POST   /:studioId/clients/:clientId/mealplan/from-template        ({ templateId, useExisting | {calorieTarget, macroSplit} })

# Uploads (trainer — new, see above)
POST   /:studioId/uploads/sign

# Food log (client)
GET    /c/:studioId/food-log?date=YYYY-MM-DD
POST   /c/:studioId/food-log                  ({ date, slot, recipeId? | ingredientId?+quantity+unit | manualName+kcal+macros, servings? })
DELETE /c/:studioId/food-log/:entryId
GET    /c/:studioId/food-log/yesterday?slot=  (for "Add from yesterday")

# Assigned meal plan (client)
GET    /c/:studioId/mealplan                  (the client's own copy, or null)
GET    /c/:studioId/mealplan/recipes/:slotName

# Recipes (client)
GET    /c/:studioId/recipes/:id               (any recipe the client can see: assigned plan's, or their own)
GET    /c/:studioId/recipes/mine              ("My Recipes")
POST   /c/:studioId/recipes/mine
PATCH  /c/:studioId/recipes/mine/:id
DELETE /c/:studioId/recipes/mine/:id

# Barcode lookup (client)
GET    /c/:studioId/barcode/:code             (checks our `ingredient` table first, falls back to
                                                 Open Food Facts live, caches the result, § Decision #2c)
```

**`reveal.food`** (`apps/api/src/features/client/today.ts`) changes from
`dietPlan.length > 0` to checking `mealPlanTemplates` with `clientId = this client` and
`status = 'active'` — same shape the check already has, new source table. **This is a
behaviour-neutral rename, not a new rule**: a client still only sees the Food tab once
something real exists for them to see — except the food-logging flows (quick-add,
barcode, My Recipes) are available with **no plan assigned at all**, per the empty-state
screenshots, so `reveal.food` should gate the tab becoming visible in nav the same way it
always has, while the tab's own content (not the nav) already branches on whether a plan
exists.

---

## UI — Trainer app

### Nutrition nav group

New sidebar group `Nutrition`, below the existing `Workouts` group: **Recipes**,
**Ingredients**, **Mealplans** — **[V]** exact labels and order from the screenshots.

### Recipes — list (`/nutrition/recipes`)

**[V]** Search bar ("Search recipes…"), sort dropdown (Name A-Z, by the pattern in the
screenshot there are more options — mirror whatever `Sort` options the Ingredients list
and Templates list already use for consistency), list/grid view toggle, **+ New Recipe**
button (brand-filled). Filter row: **Tags** (multi-select dropdown — Vegan, Vegetarian,
Pescetarian, Pregnancy, PCOS, High Protein, Low Carbs, Halal, Kosher, Diabetic Friendly,
Contains Peanuts/Gluten/Fish — build with the new multi-select `FilterPill` variant, §
below), **Meal Type** (multi-select — Breakfast, Morning Snack, Lunch, Afternoon Snack,
Dinner, Evening Snack), **Type** (single-select — Personal, System; reuse the existing
`filter-pill.tsx` as-is). Cards: image (or icon fallback, same pattern as
`ProgramCard`/exercise cards), name, kcal, three macro bars (Protein/Carbs/Fat as % of
calories, each with an icon) — **[V]** exact layout from the reference screenshot.

### Recipes — New Recipe panel

**[V]** `Sheet` slide-over, two-step scroll (not a wizard — one scrollable form,
confirmed by the screenshot sequence showing the same panel scrolled further down):

1. **Name*** (255 char counter), **Servings*** (stepper), **Description** (optional,
   2048 char counter), **Upload Media**: toggle between "Upload Video" (drag/drop, MP4/MOV
   ≤150MB) and "YouTube / Vimeo" (link field, renders a play-button preview thumbnail once
   a link is entered) — plus a separate **Recipe Image** upload (PNG/JPG/GIF ≤5MB,
   independent of the video choice).
2. **Recipe Details**: **Meal Type*** (multi-select), **Difficulty** (select — None and
   presumably Easy/Medium/Hard), **Prep Time** / **Cook Time** (free text, "eg. 10
   minutes"), **Allergens** (multi-select), **Dietary Preferences** (multi-select).

Footer: **Cancel** / **Save Recipe** (disabled until Name + Servings + Meal Type are
filled — standard required-field gating).

### Recipe detail / edit (`/nutrition/recipes/:id`) — full page, not a panel

**[V]** Left column (sticky): image with an × to remove it, name, servings, description,
all the recipe's tags (meal-type tags in blue, allergen tags in red/danger, dietary tags
in dark/neutral — **[V]** exact three-colour grouping from the screenshot), then a
**Nutrients** card: a donut/arc chart (green/orange/yellow = protein/carbs/fat, matching
the brand's existing chart-token conventions, not literal Coachway colours — same
reasoning the workouts build already applied for the hero), total kcal in the centre,
Protein/Carbs/Fat grams below, **Show Micronutrients** disclosure.

Right column: **Ingredients** card — each row expandable (chevron), name, a small
`Xg / unit` badge for ingredients with a `gramsPerUnit` conversion, quantity input +
unit dropdown, computed kcal for that line, a "move to…" icon (reorder), × to remove.
**+ Add Ingredient** opens an inline ingredient search (search the same Ingredients
table). Below: **Instructions** — numbered, draggable (`⠿` handle), each a text input with
×, **+ Add Step** at the bottom.

Header: **Edit Recipe** / **Save Recipe** buttons (view mode vs. edit mode — **[V]** the
screenshots show both an explicit "Edit Recipe" toggle button and the page already being
editable simultaneously, so treat edit-mode as always-on for the ingredient/instruction
lists with name/description/media behind the explicit Edit toggle, matching the two
visually distinct interaction zones in the screenshot).

### Ingredients — list (`/nutrition/ingredients`)

**[V]** Search ("Search ingredients by name, SKU…"), sort, **+ New Ingredient**. Filters:
**Category** (single-select — Fruits and Vegetables, Bakery and Bread, Dairy and Eggs,
Ready Meals and Prepared Food, Cheese and Spreads, Meat and Poultry, Fish and Seafood,
Vegan and Vegetarian, Frozen Foods, Pantry and Groceries, Breakfast and Cereal, Snacks and
Sweets, Local Shop Items, + more), **Tags** (multi-select, same dietary-tag vocabulary as
Recipes), **Country** (single-select, flag icons — for Traiv, lead with **India** and
**Global**; the full country list is a later concern), **Type** (Personal/System). Table
columns: Name, Calories (kcal/100g), Nutrients (small P/C/F icons+grams), Category,
Country (flag), Library (Personal/System badge). Pagination footer ("Viewing 25 of
4,062", page numbers).

### Ingredients — New Ingredient panel

**[V]** `Sheet`, sections: **Basic Information** (Name, Category select) → **Nutritional
Information** (Calories/100g, Protein/100g, Carbs/100g, Fat/100g, **Unit** select
[Portion/piece/tsp/…], **Serving Size** [grams], live "1 portion = Ng" readout) →
**Ingredient Type** select, helper text *"Helps categorize ingredients for recipe
generation. Leave as unassigned if unsure"* — **[I]** this is almost certainly the same
field as `category` shown differently, or a second coarser grouping used by whatever
recipe-suggestion logic exists internally on Coachway's side; for Traiv's v1, treat this
as **not needed** — we have no AI recipe-generation step in this plan (§ Deliberately
not in v1), so this field is dropped rather than copied blind → **Tags & Classification**
(Dietary Preferences multi-select, Contains Allergens multi-select) → **Micronutrients**
(Fiber/100g, Sugar/100g, Sodium/100g, Saturated Fat/100g, Cholesterol/100g, Iron/100g,
Calcium/100g, Potassium/100g, Vitamin D/100g, "Show all nutrients" to expand further —
these map to the `micronutrients` jsonb blob). Footer: Cancel / Create Ingredient.

### Mealplans — list (`/nutrition/mealplans`)

**[V]** Search, **+ New Meal Plan**. Table: Name, Calories, Macros (P/C/F %), Status
(Live / Draft / "Local changes" badge for an edited-but-unsaved Live template). Row menu
(`…`) — not screenshotted but assume Duplicate/Archive, matching the Templates list
convention for workouts.

### Mealplans — New meal plan template panel

**[V]** `Sheet`, two-column layout (left: identity + preferences, right: targets):

- Left: **Template name*** (40 char counter), **Description**, **Cover image** upload.
  **Preferences**: "Dietary preferences to favor" (chip multi-select: Vegan, Vegetarian,
  Pescetarian, Pregnancy, PCOS, High Protein, Low Carbs, Halal, Kosher, Diabetic Friendly,
  Other), "Allergens to avoid" (chip multi-select, same 11-item allergen vocabulary as
  Ingredients).
- Right: **Nutrition Targets** — Calories (± stepper), Recipes per meal (± stepper).
  **Macro Split** — Protein/Carbs/Fat % inputs with a running **Total: 100%** validator
  (green check when valid), a visual 3-colour bar, a **Quick Fill** preset dropdown
  ("Default 30/40/30") + **Save as preset…**. **Meal Distribution** — one toggle row per
  slot (Breakfast/Morning Snack/Lunch/Afternoon Snack/Dinner/Evening Snack), each a
  drag-handle + % input + on/off switch, **+ Add custom meal**, running **Total: 100%**.
  Below that: a **Distribution slider** — a draggable 3-(or N-)segment bar showing each
  enabled slot's % and resulting kcal, boundaries draggable (**[I]** needs new build, §
  below). **Settings**: **Recipe source** radio (All recipes [shared + own] / My recipes
  only), **Recipe matching** radio (Scale to targets [adjust ingredients to hit
  calorie/macro targets] / Best match, unscaled [closest fit, ingredients untouched]).

Footer: Cancel / **Save template**.

### Meal plan template detail/builder (`/nutrition/mealplans/:id`)

**[V]** Header: template name, Draft/Live pill, **Edit** / **Publish** (or **Discard
Changes** / **Save** once a Live template has unsaved edits — the "Local changes" state).
Below: a target-summary bar (kcal range, P/C/F grams+% with progress bars, a "Micros: N%
DV" pill). Then one section per enabled slot: **"Breakfast (4 recipes)"**, its own
kcal/macro sub-targets with progress bars, a responsive grid of recipe cards (image, tags
overflow as "+N", name, kcal, P/C/F), each removable (×), **+ Add a meal** opens a
left-side **"Add recipe"** panel: search, a filter icon (opens the same Tags/Meal
Type/etc. filters as the Recipes list, pre-scoped to this slot's meal type), a scrollable
recipe list each with a **+** to add (shows "Already in Breakfast" once added, disabled).
Adding a recipe computes its scaled macros immediately and shows a diff badge ("+70
kcal") against its own unscaled numbers when `recipeMatching = scale`.

Clicking a recipe card in the main grid expands it inline: full ingredient list
(quantity+unit, editable, unit-dropdown per row), **Compare** (presumably toggles
scaled-vs-original — **[U]**, not fully explored in the screenshots, build as a
show/hide of the unscaled numbers alongside the scaled ones), **Lock** (exclude this
recipe from auto-rescaling when the slot's target changes — **[I]**, standard meaning for
a lock icon next to a value that otherwise recomputes), **Save recipe** (presumably saves
the *scaled* version back as a new standalone Recipe — **[U]**, confirm intent before
building if it comes up during implementation), instruction steps shown read-only below.
**Done** / prev / next arrows at the bottom to move between recipes in the panel.

### Client profile → Nutrition tab

**[V]** Empty state: fork/knife icon, *"No meal plan found / This client does not have a
nutrition plan assigned yet."*, **+ Create new plan** / **Create from template** buttons.

**Create from template** → `Sheet`, **"Create from existing"**: a card per Live template
(name, "Live" badge, kcal, P/C/F % bars), **Select Template**. → second screen: editable
**Template Name**, **Macro Configuration** radio — *"Use existing calories and macros
from template"* vs *"Define custom calories and macros"* (reveals Target Calories input +
Macro split dropdown with the same named presets: No macro split, High Protein
(P40/C40/F20), Low Carb (P50/C25/F25), Muscle Gain (P30/C50/F20), Balanced (P40/C30/F30))
→ **Create**. On creation, the picker defaults the template name to **"[Client]'s Meal
Plan"** and, per the screenshot, surfaces an **"Nkcal recommended for this client · Apply"**
chip — this reads directly from `nutrition_target` (ADR 0019), already computed, no new
calc needed.

**Create new plan** → same right-hand form as the standalone "New meal plan template"
panel, pre-filled from the client's `nutrition_target`, saved with `clientId` set
directly (no separate studio-level template created).

---

## UI — Client app (Food tab)

`apps/client/src/app/(app)/food/` (currently absent — this phase builds it for the first
time; the nav tab already exists in `nav-items.ts` gated by `reveal.food`, wired to
nothing).

### Today's meals (`/food`)

**[V]** Date strip (7-day horizontal picker, today circled/filled), a calorie ring +
Protein/Carbs/Fat sub-rings (0 when nothing logged). **No plan assigned**: four always-present
cards — **Breakfast**, **Lunch**, **Dinner**, **Snacks** — each *"Nothing logged yet · 0
kcal"**, an **"Add from yesterday"** row *only when yesterday has entries for that slot*
(shows item count + kcal, a `+` to add them all), **+ Add item to [slot]**. Below the
cards: **My recipes** / **Cookbooks** tiles. Sticky 3-button row above `MobileBar` (reuse
the non-`fixed`, normal-document-flow lesson learned building the workout session's
rest-timer-card — do **not** make this `fixed`): ⚡ quick-add · **+ Log food** (primary,
filled) · barcode scan.

**Plan assigned**: same screen, plus a **green gradient banner card** above "Today's
meals" — *"Active"* pill, *"[Name]'s Meal Plan"*, target kcal + P/C/F pills. Tapping it
opens the **meal plan detail**: hero header (same green gradient, plan name, target
kcal+macros), **Breakfast / Lunch / Dinner** tabs (underline-active), a 2-column grid of
that slot's candidate recipes (image with prep-time pill, name, kcal, protein) — tapping
one opens **recipe detail**.

Once food is logged, each slot card lists the logged items (thumbnail, name, serving
count, kcal), a per-slot `…` menu, still keeps **+ Add item to [slot]**.

### Recipe detail (`/food/recipes/:id`)

**[V]** Full-bleed hero image, back arrow + add(+)/favourite(♥) overlay buttons, title,
kcal/serving + P/C/F, **servings stepper** (− 1 +, recomputes the ring live), **Ingredients**
list (name, qty+unit, P/C/F, kcal — read-only here), **Instructions** numbered list,
sticky **+ Log this meal** button. Tapping Log opens the **logging sheet**: toggle
**Serving** / **g**, quantity stepper, a recomputed ring (kcal + %P/%C/%F), **Meal**
dropdown (defaults to whichever slot it was opened from), **Date** (defaults Today),
**+ Add to [slot] · N kcal**.

### Quick add (⚡)

**[V]** *"QUICK ADD TO [SLOT]"* header, **Log food** title, **Name**, **Calories**,
**Macros (optional)**: Protein/Carbs/Fat grams, **+ Add to [slot]**. Writes a
`food_log_entry` with `manualName` set, no library reference.

### Log food (+ button)

**[V]** Search bar *"Search foods, brands, or recipes"* with three tiles: **Scan
barcode**, **Photo Log** (**[U]** — not explored in the screenshots the founder walked
through; flag as a v1-unknown, not building it blind, § Open questions), **Quick add**
(same sheet as the ⚡ button). Below: presumably **Recent / Favorites / My Recipes**
result tabs — **[V]** confirmed by the founder's own description ("there's the recent,
favorites and my recipes") even though not individually screenshotted; search results
show a **+** per row that opens the same recipe-detail logging sheet used elsewhere.

### Barcode scanner

**[V]** Camera view, frame guide, *"Point camera at barcode" / "Line the barcode up
inside the frame"*, **Enter code manually** fallback (a plain numeric-entry field +
**Look up product**). A successful scan/lookup opens **the same Serving/g logging sheet**
recipes use — confirming a scanned product is handled as an Ingredient, not a separate
entity (§ schema, `food_log_entry.ingredientId`).

### My Recipes

**[V]** Empty state: *"You haven't created any recipes yet."* + **+ Create recipe**.
**Create recipe**: cover photo (optional), **Recipe name…**, **Servings** stepper,
**Ingredients** — *"Search our food database and build your recipe ingredient by
ingredient"* + **+ Add ingredient**, a live nutrition summary bar (*"Add ingredients to
see nutrition"* → updates as ingredients are added) + **Create**. Created recipe opens
its own detail page (**Edit / Duplicate / Delete**, same kcal/macro header, ingredients
list, **+ Log this meal**). List view: a card grid (image, name, kcal · protein).

---

## UI primitives — what exists vs. what's new

| Need | Status |
|---|---|
| Slide-over panel (New Recipe / New Ingredient) | **Exists** — `packages/ui/src/components/sheet.tsx`, same pattern already used by `exercise-panel.tsx` and `duplicate-from-template.tsx`. |
| Single-select filter pill (Category, Country, Type) | **Exists** — `apps/trainer/src/app/(app)/exercises/_components/filter-pill.tsx`, direct reuse. |
| Multi-select filter pill (Tags, Meal Type, Allergens — screenshots show multiple checkmarks) | **New** — `filter-pill.tsx` is single-select only (`value: string | undefined`); build a `multiple` variant (`value: string[]`), same `Popover`+list shape. |
| %-based macro-split input | **Exists** — `packages/ui/src/components/slider.tsx` (Radix), usable as three independent sliders behind a small running-total wrapper. |
| Draggable N-segment meal-distribution bar | **New** — no existing primitive resizes adjacent coloured segments by dragging a shared boundary. Reuse the visual structure of `apps/client/src/app/(app)/workouts/_components/segmented-progress.tsx`, add drag logic fresh. |
| Stepper (servings, calories ±) | Not a shared primitive anywhere — cheap enough to build inline each time, consistent with how the screenshots show it (`Button` + number, no shared component). |
| Studio-scoped signed upload | **New, see "A prerequisite" above** — mirror the existing client-scoped one. |
| Swipe-to-delete a logged food row | **Exists** — `apps/client/src/app/(app)/workouts/_components/swipe-to-delete.tsx`, direct reuse for removing a `food_log_entry`. |

---

## Build phases

Six phases, each independently shippable and reviewable — not one giant PR. Order
follows the dependency chain (an ingredient has to exist before a recipe can reference
one; a recipe before a meal plan can reference one).

**Phase 0 — prerequisite.** Studio-scoped upload signer (`POST /:studioId/uploads/sign`).
Small, mechanical, nothing downstream can ship real images without it.

**Phase A — Ingredient library (implemented with B, 2026-10-30).** Schema + migration 0023 (`ingredient` table only) +
FDC seed script + pinned-MIT IFCT seed script (§ Decision #2) + trainer Ingredients
list/filter/create/edit UI. Ships alone — a coach can browse/search/add ingredients with
nothing else built yet.

**Phase B — Recipes (implemented with A, 2026-10-30).** `recipe`/`recipe_ingredient`/`recipe_step` tables + trainer
Recipes list/filter/New Recipe panel/detail-edit page. Depends on A.

**Phase C — Meal Plan Templates.** `meal_plan_template`/`meal_plan_slot`/`meal_plan_recipe`
tables + trainer Mealplans list/New template panel/builder page (including the
scale-to-targets recipe-matching logic). Depends on B.

**Phase D — Client assignment flow.** The client profile's Nutrition tab (empty state,
Create new plan, Create from template two-step flow), `reveal.food` cutover. Depends on
C.

**Phase E — Client Food tab.** Daily log (today's meals, logging sheet, quick-add,
barcode scan + Open Food Facts integration, My Recipes, "add from yesterday"), meal-plan-assigned
banner + detail view. Depends on A (ingredients, for barcode caching) and D (for the
assigned-plan banner) — but logging itself works with **no plan assigned**, per the
empty-state screenshots, so this phase delivers real value even before D ships if
sequencing needs to flex.

**Phase F — ADR 0025 + cleanup.** Write the ADR, drop `diet_plan`/`meal`/`meal_item`/
`meal_log`/`foods`/`food_request` and their migration remnants, update `.ai/state/current.md`.
Could run any time after Decision #1 is confirmed — listed last only because it's not
blocking, not because it's optional.

---

## Verification

- `pnpm --filter @traiv/api typecheck` / the equivalent for `apps/trainer` and
  `apps/client`.
- `pnpm test` — scenario tests per `.ai/engineering/testing.md`, mirroring the check-ins
  and workouts test shape: ingredient CRUD + search/filter scoping (studio can't see
  another studio's personal ingredients), recipe nutrition computation (sum of
  ingredients ÷ servings, rounds correctly), recipe-to-meal-plan scaling math (macros
  land within tolerance of the slot target), meal-plan-template macro/percentage CHECK
  constraints reject bad input, client "create from template" produces an independent
  copy (editing the client's copy never touches the template), food-log one-of-three-source
  CHECK, barcode lookup caches on first hit and reads local on the second, `reveal.food`
  reflects an active `meal_plan_template` with `clientId` set.
- `pnpm check` (biome) on every new/touched file.
- Driven end-to-end in the real browser via CDP, same discipline as the workouts build:
  sign in as the test client, walk the whole trainer flow (ingredient → recipe → meal
  plan template → publish → assign to a client) and the whole client flow (empty state →
  log via each of the four paths → plan-assigned state → My Recipes), screenshotting each
  screen against its matching reference image from the founder's Downloads folder.

## Acceptance criteria

1. A coach can create a Personal ingredient and it never appears in another studio's
   Ingredients list.
2. A recipe's displayed nutrition always equals the sum of its ingredient lines ÷
   servings — never independently editable.
3. A meal-plan-template's macro split always sums to 100%, enforced by the database, not
   just the form.
4. "Create from template" produces a client-owned copy; editing it afterwards never
   changes the source template or any other client's copy of it.
5. A client with no meal plan can still fully use the Food tab — log via recipe, barcode,
   and quick-add, with no error and no gated UI.
6. Scanning the same barcode twice hits Open Food Facts once; the second scan resolves
   from the local `ingredient` table.
7. A `food_log_entry`'s macros survive a later edit to the recipe or ingredient it was
   logged from.
8. `reveal.food` turns true the moment a client has an active meal plan — not before, and
   never because they have logged food without one.
9. The IFCT import is pinned to `@ifct2017/compositions@2.0.8`; its version, MIT license metadata and actual `LICENSE` text are verified before database writes (§ Decision #2, ADR 0026).

## Deliberately not in v1

- **AI-generated meal plans.** Explicitly not what the screenshots show, and explicitly
  what the superseded schema assumed — see Decision #1.
- **Photo Log** (one of the three tiles on the "Log food" search screen) — not explored
  in the walkthrough, not building blind.
- **Recipe "Compare"/"Save recipe" buttons' exact behaviour inside the meal-plan
  builder's inline ingredient editor** — flagged **[U]** above, confirm intent before
  building if it comes up.
- **Packs/Collections** and a direct bulk "assign to client" button on the Recipes/Templates
  list — already raised and explicitly dropped by the founder earlier this session for
  the workouts phase on the same evidentiary grounds (mobile-APK-only, never seen in the
  real trainer app); the same reasoning applies here and nothing in these 59 screenshots
  suggests otherwise.
- **Nordic/EU national food-composition tables** (the specific Norway/Finland/Denmark/
  Sweden/Germany/UK government datasets Coachway licenses) — not a gap in the *feature*,
  only in one data source neither relevant nor available to a product built for Indian
  coaches. Ingredient breadth otherwise matches Coachway's scale: FDC alone is
  200,000+ rows including branded/international products, plus the IFCT India layer —
  thousands of real rows from day one, not a token starter set. The Country filter itself
  ships fully functional; it just won't have Nordic-government-sourced rows behind it.
