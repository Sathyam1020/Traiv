import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { clients } from "./client.js";
import { memberships, studios } from "./studio.js";

/**
 * Nutrition, modelled on Coachway's trainer app screen for screen, same discipline ADR
 * 0024 used for workouts. See `.ai/features/nutrition/spec.md` and ADR 0025, which
 * supersedes the food/nutrition half of ADR 0004: this replaces `food`/`food_request`
 * (library.ts) and `diet_plan`/`meal`/`meal_item`/`meal_log` (plan.ts) entirely. Those
 * modelled an AI generating one plan per client; Coachway's real app — and what this
 * product ships — is a coach-curated Recipe library built from an Ingredient database,
 * assembled into Meal Plan Templates, duplicated onto a client the same way a workout
 * template is.
 *
 * **Ingredient → Recipe → Meal Plan Template → Slot → candidate Recipes.** Direct
 * analogue of Template → Session → Exercise → Set, see `workout.ts`.
 */

/** Who authored it — kept as its own enum rather than reused from `workout.ts`, same
 *  reasoning every other lifecycle enum in this codebase follows: `checkInStatus`,
 *  `targetStatus` and `templateStatus` are all independent despite overlapping values. */
export const recipeSource = pgEnum("recipe_source", ["system", "coach", "client"]);
export const mealPlanStatus = pgEnum("meal_plan_status", ["draft", "active"]);
export const mealPlanSource = pgEnum("meal_plan_source", ["coach", "client"]);
export const mealPlanRecipeSource = pgEnum("meal_plan_recipe_source", ["all", "mine"]);
export const mealPlanRecipeMatching = pgEnum("meal_plan_recipe_matching", ["scale", "best_match"]);

/* -------------------------------------------------------------------------- */
/* Ingredients                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A food, per 100 g (or per 100 ml for volume-labeled client foods). The generic fact every Recipe is built from — same relationship
 * `exercise` has to `session_exercise`.
 *
 * `studioId` null = shared library (seeded from USDA FoodData Central and IFCT 2017, or
 * cached from a client's barcode scan). Set = a coach's own ingredient. Same
 * Personal/System split as `exercise.studioId`.
 */
export const ingredients = pgTable(
  "ingredient",
  {
    id: text().primaryKey(),
    studioId: text().references(() => studios.id, { onDelete: "cascade" }),

    clientId: text().references(() => clients.id, { onDelete: "cascade" }),
    name: text().notNull(),
    /** "fdc" | "ifct" | "openfoodfacts" | "coach" | "client" — provenance, for support
     *  and re-import. Never shown directly; the Type filter is studioId null-vs-set. */
    dataSource: text(),
    /** Shared barcode cache or private client food. Unique within its ownership scope. */
    barcode: text(),
    brand: text(),

    /** Free text, not a pgEnum — same reasoning as `exercise.category`/`location`: the
     *  list keeps growing and isn't part of any external dataset's fixed shape. */
    category: text(),
    /** "India", "Global", … */
    country: text(),

    /** Vegan · Vegetarian · Pescetarian · Pregnancy · PCOS · High Protein · Low Carbs ·
     *  Halal · Kosher · Diabetic Friendly — what a diet or health flag favours. */
    dietaryTags: text().array().notNull().default(sql`'{}'::text[]`),
    /** Contains Peanuts · Gluten · Fish · Shellfish · Eggs · Soy · Nuts · Sesame ·
     *  Lactose · Dairy · Sugar — positive assertions, so a separate column from
     *  `dietaryTags` rather than overloading one list with opposite meanings. */
    allergenTags: text().array().notNull().default(sql`'{}'::text[]`),

    /** What a typed quantity resolves to — e.g. "tsp" + 5 means 5g per tsp, the same job
     *  `exercise.defaultFields` does for a session_exercise. */
    baseUnit: text().notNull().default("grams"),
    nutrientType: text(),
    defaultUnit: text(),
    gramsPerUnit: real(),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),

    /** Fiber, sugar, sodium, saturated fat, cholesterol, iron, calcium, potassium,
     *  vitamin D, and whatever "Show all nutrients" exposes beyond that — held as one
     *  blob for the same reason `workout_template.defaultValues` is: a form's data whose
     *  field set grows, not something queried field-by-field. */
    micronutrients: jsonb(),

    imageUrl: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("ingredient_name_key")
      .on(t.name, t.studioId)
      .where(sql`${t.deletedAt} is null and ${t.clientId} is null`),
    uniqueIndex("ingredient_system_name_key")
      .on(t.name, t.dataSource)
      .where(
        sql`${t.studioId} is null and ${t.clientId} is null and ${t.barcode} is null and ${t.deletedAt} is null`,
      ),
    uniqueIndex("ingredient_barcode_key")
      .on(t.barcode)
      .where(sql`${t.barcode} is not null and ${t.clientId} is null`),
    uniqueIndex("ingredient_client_barcode_key")
      .on(t.clientId, t.barcode)
      .where(
        sql`${t.barcode} is not null and ${t.clientId} is not null and ${t.deletedAt} is null`,
      ),
    uniqueIndex("ingredient_client_name_key")
      .on(t.clientId, t.name)
      .where(sql`${t.deletedAt} is null`),
    index("ingredient_client_idx").on(t.clientId),
    index("ingredient_studio_idx").on(t.studioId),
    index("ingredient_category_idx").on(t.category),
    check("ingredient_base_unit_sane", sql`${t.baseUnit} in ('grams', 'ml')`),
    check("ingredient_kcal_sane", sql`${t.kcal} between 0 and 2000`),
  ],
);

/* -------------------------------------------------------------------------- */
/* Recipes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A dish, coach- or client-authored, built from Ingredient rows.
 *
 * `clientId` null = a studio recipe, visible across the coach's roster. Set = a client's
 * own "My Recipes" entry in the client app. Exact mirror of `workout_template.clientId`.
 *
 * Nutrition is never entered directly — it is computed from `recipe_ingredient` rows
 * divided by `servings`, same reason a recipe's own ingredient list is the only source
 * of truth and nothing else writes to it.
 */
export const recipes = pgTable(
  "recipe",
  {
    id: text().primaryKey(),
    studioId: text().references(() => studios.id, { onDelete: "cascade" }),
    clientId: text().references(() => clients.id, { onDelete: "cascade" }),

    seedKey: text(),
    name: text().notNull(),
    description: text(),
    servings: integer().notNull().default(1),

    imageUrl: text(),
    /** An uploaded video. Distinct from `videoLinkUrl` — the New Recipe panel offers
     *  "Upload Video" or "YouTube / Vimeo" as alternatives, never both at once. */
    videoUrl: text(),
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
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("recipe_seed_key").on(t.seedKey),
    check(
      "recipe_owner_sane",
      sql`(${t.source}::text = 'system' and ${t.studioId} is null and ${t.clientId} is null) or (${t.source}::text <> 'system' and ${t.studioId} is not null)`,
    ),
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
    recipeId: text()
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    ingredientId: text()
      .notNull()
      .references(() => ingredients.id, { onDelete: "no action" }),

    position: integer().notNull(),
    preparationNote: text(),
    minimumUnitAmount: text().notNull().default("all"),
    quantity: real().notNull(),
    /** "grams" | "ml" | "piece" | "tsp" | "cup" | "bar" | "bunch" | "bag" | "can" | "dl" |
     *  "handful" | "head" | "leaf" | "portion". */
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
    recipeId: text()
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    position: integer().notNull(),
    text: text().notNull(),
  },
  (t) => [uniqueIndex("recipe_step_position_key").on(t.recipeId, t.position)],
);

/* -------------------------------------------------------------------------- */
/* Meal plan templates and programmes                                         */
/* -------------------------------------------------------------------------- */

/**
 * A named nutrition programme. **Template → Slot → candidate Recipes.**
 *
 * `clientId` null/set carries the exact same meaning as `workout_template.clientId`:
 * null is the studio's reusable template; set is one client's copy, made by "Create from
 * template" or "Create new plan." The copy is the point — editing a client's plan must
 * never touch the template, or anybody else's copy of it.
 */
export const mealPlanTemplates = pgTable(
  "meal_plan_template",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    clientId: text().references(() => clients.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    coverImageUrl: text(),

    draftDocument: jsonb(),
    publishedDocument: jsonb(),
    calorieTarget: integer().notNull(),
    recipesPerMeal: integer().notNull().default(4),

    proteinPct: real().notNull(),
    carbsPct: real().notNull(),
    fatPct: real().notNull(),

    dietaryPreferences: text().array().notNull().default(sql`'{}'::text[]`),
    allergensToAvoid: text().array().notNull().default(sql`'{}'::text[]`),

    recipeSourceSetting: mealPlanRecipeSource().notNull().default("all"),
    recipeMatching: mealPlanRecipeMatching().notNull().default("scale"),

    status: mealPlanStatus().notNull().default("draft"),
    source: mealPlanSource().notNull().default("coach"),

    createdBy: text().references(() => memberships.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    index("meal_plan_template_studio_idx").on(t.studioId, t.status),
    index("meal_plan_template_client_idx").on(t.clientId),
    check(
      "meal_plan_template_macro_pct_sane",
      sql`${t.proteinPct} between 0 and 100 and ${t.carbsPct} between 0 and 100 and ${t.fatPct} between 0 and 100 and abs(${t.proteinPct} + ${t.carbsPct} + ${t.fatPct} - 100) < 0.02`,
    ),
  ],
);

/**
 * One meal slot within a template — Breakfast, Lunch, … or a custom name ("+ Add custom
 * meal"). `percentage` is this slot's share of `calorieTarget`; `enabled` is the toggle
 * shown per row.
 */
export const mealPlanSlots = pgTable(
  "meal_plan_slot",
  {
    id: text().primaryKey(),
    templateId: text()
      .notNull()
      .references(() => mealPlanTemplates.id, { onDelete: "cascade" }),

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
 * One candidate recipe in a slot. A slot holds several — the client picks one, not all.
 *
 * Macros are **copied at assignment time**, not joined — same reasoning as
 * `session_exercise`/`meal_item` elsewhere: correcting a typo in a recipe later must not
 * silently rewrite every meal plan that references it. When `recipeMatching = "scale"`,
 * `scaleFactor` is the multiplier applied to the recipe's own per-serving macros to land
 * on the slot's target; `"best_match"` leaves it at 1.
 */
export const mealPlanRecipes = pgTable(
  "meal_plan_recipe",
  {
    id: text().primaryKey(),
    slotId: text()
      .notNull()
      .references(() => mealPlanSlots.id, { onDelete: "cascade" }),
    recipeId: text()
      .notNull()
      .references(() => recipes.id, { onDelete: "no action" }),

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

export const mealPlanPresets = pgTable(
  "meal_plan_preset",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    name: text().notNull(),
    proteinPct: real().notNull(),
    carbsPct: real().notNull(),
    fatPct: real().notNull(),
  },
  (t) => [
    uniqueIndex("meal_plan_preset_name_key").on(t.studioId, t.name),
    check(
      "meal_plan_preset_split_sane",
      sql`${t.proteinPct} between 0 and 100 and ${t.carbsPct} between 0 and 100 and ${t.fatPct} between 0 and 100 and abs(${t.proteinPct}+${t.carbsPct}+${t.fatPct}-100)<0.02`,
    ),
  ],
);

/* -------------------------------------------------------------------------- */
/* The daily log                                                              */
/* -------------------------------------------------------------------------- */

/**
 * One logged food, one client, one day. The client app's "Today's meals."
 *
 * Exactly one of `recipeId` / `ingredientId` / `manualName` is set — same one-of-N
 * discipline `check_in_answer` established for the same reason: a CHECK makes the
 * invariant a fact the database enforces, not a convention the API has to remember.
 * `recipeId` covers both a coach-assigned recipe and a client's own "My Recipe" (same
 * table, see `recipe.clientId`). `ingredientId` covers a raw ingredient or a
 * barcode-scanned product — both are Ingredient rows, so there is no separate "scanned
 * product" entity. The manual fields back quick-add, where nothing in the library is
 * referenced at all.
 *
 * All nutrition is **frozen at log time** — editing a recipe later must not rewrite what
 * somebody's Tuesday said they ate.
 */
export type FoodSnapshot = {
  id: string;
  kind: "food" | "recipe" | "plan" | "manual" | "personal";
  planId?: string;
  recipeId?: string;
  servingLabel?: string;
  name: string;
  imageUrl: string | null;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  micronutrients: Record<string, number>;
  baseGrams: number | null;
  baseUnit?: "grams" | "ml";
  owned: boolean;
  steps: string[];
  ingredients: {
    id: string;
    name: string;
    grams: number;
    nutrition?: {
      kcal: number;
      proteinG: number;
      carbsG: number;
      fatG: number;
      micronutrients?: Record<string, number>;
    };
  }[];
};
export const foodLogEntries = pgTable(
  "food_log_entry",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),

    date: text().notNull(),
    /** "breakfast" | "lunch" | "dinner" | "snacks" — the four cards the Food tab always
     *  shows, regardless of how many slots the assigned plan itself defines. */
    slot: text().notNull(),

    recipeId: text().references(() => recipes.id, { onDelete: "set null" }),
    ingredientId: text().references(() => ingredients.id, { onDelete: "set null" }),
    /** Servings for a recipe-based entry, or a quantity+unit pair for an ingredient-based
     *  one — mirrors `recipe_ingredient`'s own quantity/unit shape. */
    servings: real(),
    quantity: real(),
    unit: text(),

    /** Quick-add only: typed directly, nothing in the library referenced. */
    manualName: text(),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),

    snapshot: jsonb().$type<FoodSnapshot>(),
    revision: integer().notNull().default(1),
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
export type RecipeStep = typeof recipeSteps.$inferSelect;
export type MealPlanTemplate = typeof mealPlanTemplates.$inferSelect;
export type MealPlanSlot = typeof mealPlanSlots.$inferSelect;
export type MealPlanRecipe = typeof mealPlanRecipes.$inferSelect;
export type FoodLogEntry = typeof foodLogEntries.$inferSelect;

/** Client food tooling is relationship-scoped, never user-wide or studio-public. */
export const nutritionPermissions = pgTable("nutrition_permission", {
  clientId: text()
    .primaryKey()
    .references(() => clients.id, { onDelete: "cascade" }),
  search: integer().notNull().default(1),
  barcode: integer().notNull().default(1),
  photoLog: integer().notNull().default(1),
  calculator: integer().notNull().default(1),
  personalPlans: integer().notNull().default(1),
});
export const foodFavorites = pgTable(
  "food_favorite",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    kind: text().notNull(),
    resourceId: text().notNull(),
  },
  (t) => [uniqueIndex("food_favorite_client_resource_key").on(t.clientId, t.kind, t.resourceId)],
);
export const foodGoals = pgTable(
  "food_goal",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    /** default, weekday:0..6, or YYYY-MM-DD. Exact dates override recurring targets. */
    day: text().notNull(),
    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),
  },
  (t) => [uniqueIndex("food_goal_client_day_key").on(t.clientId, t.day)],
);
export const foodPhotoMessages = pgTable(
  "food_photo_message",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    author: text().notNull(),
    imageUrl: text(),
    note: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("food_photo_client_idx").on(t.clientId, t.createdAt)],
);
export const foodReports = pgTable("food_report", {
  id: text().primaryKey(),
  clientId: text()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  ingredientId: text()
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),
  note: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export const foodShoppingItems = pgTable(
  "food_shopping_item",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    ingredientId: text().references(() => ingredients.id, { onDelete: "set null" }),
    name: text().notNull(),
    amount: real().notNull(),
    unit: text().notNull(),
    category: text().notNull().default("Other"),
    note: text(),
    checked: integer().notNull().default(0),
    /** Contributions are explanatory snapshots; quantities remain normalized columns. */
    contributions: jsonb().$type<{ name: string; amount: number }[]>().notNull().default([]),
  },
  (t) => [
    index("food_shopping_client_idx").on(t.clientId),
    uniqueIndex("food_shopping_ingredient_key")
      .on(t.clientId, t.ingredientId)
      .where(sql`${t.ingredientId} is not null`),
  ],
);
export const foodPersonalPlans = pgTable(
  "food_personal_plan",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: text().notNull(),
    targets: jsonb().$type<{ kcal: number; proteinG: number; carbsG: number; fatG: number }>(),
    meals: jsonb()
      .$type<{ name: string; percentage: number; options: FoodSnapshot[] }[]>()
      .notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("food_personal_plan_client_idx").on(t.clientId)],
);

/** Persistent retry guards and external label-read quotas, keyed by the relationship. */
export const foodOperations = pgTable(
  "food_operation",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    kind: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("food_operation_client_kind_idx").on(t.clientId, t.kind, t.createdAt)],
);
