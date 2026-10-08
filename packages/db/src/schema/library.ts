import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { studios } from "./studio.js";

export const movementPattern = pgEnum("movement_pattern", [
  "squat",
  "hinge",
  "push_horizontal",
  "push_vertical",
  "pull_horizontal",
  "pull_vertical",
  "lunge",
  "carry",
  "core",
  "cardio",
  "mobility",
]);

export const imageStatus = pgEnum("image_status", ["none", "queued", "ready", "failed"]);

/**
 * A movement the product knows about.
 *
 * The model selects from this table and may not invent a name. An exercise that does not
 * exist here cannot reach a client's plan, which is the only way to guarantee every
 * movement has a demonstration behind it — a plan item naming "Bulgarian split squat"
 * with no video is a client standing in a gym with no idea what to do.
 *
 * `pattern` is what makes substitution possible: a flagged knee swaps a squat for a hinge
 * without the model having to reason about anatomy.
 */
export const exercises = pgTable(
  "exercise",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    pattern: movementPattern().notNull(),
    /** Primary muscle, for the coach's eye rather than for logic. */
    muscle: text().notNull(),
    /** Must be a value the intake also offers, or equipment filtering silently fails. */
    equipment: text().notNull(),

    videoUrl: text(),
    cues: text(),

    /** Null for the shared library; set when a coach adds their own. */
    studioId: text().references(() => studios.id, { onDelete: "cascade" }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("exercise_name_key").on(t.name, t.studioId).where(sql`${t.deletedAt} is null`),
    index("exercise_pattern_idx").on(t.pattern, t.equipment),
  ],
);

/**
 * A food, in the unit somebody actually eats it in.
 *
 * Macros are per `homeMeasure`, not per 100g, because nobody weighs a roti and a plan that
 * says "85g dal" is a plan that gets ignored. One katori, one roti, one glass.
 *
 * This table is the reason a generated diet plan can be checked. The model is handed these
 * rows and composes from them; it never states a calorie count of its own. When it wants
 * something that is not here it says so, and that lands in `food_request` instead of
 * becoming an invented number on somebody's plan.
 *
 * `imageUrl` is filled once, by the first client whose plan references the food, and
 * reused by everyone after. Images belong to the food, never to a plan — that is what
 * makes the cost one-time rather than per-client.
 */
export const foods = pgTable(
  "food",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    /** "1 katori", "2 roti", "1 glass". The unit the macros below describe. */
    homeMeasure: text().notNull(),
    grams: real().notNull(),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),

    /** veg | egg | nonveg | vegan | jain — what diets may contain it. */
    tags: text().array().notNull(),
    /** Which meals it makes sense in: breakfast | lunch | dinner | snack. */
    slots: text().array().notNull(),

    recipe: text(),

    imageUrl: text(),
    imageStatus: imageStatus().notNull().default("none"),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("food_name_key").on(t.name).where(sql`${t.deletedAt} is null`),
    index("food_image_idx").on(t.imageStatus).where(sql`${t.imageStatus} <> 'ready'`),
    // Macros that do not account for their own calories are a typo in the seed, and a typo
    // in the seed becomes a wrong calorie target for every client who eats that food.
    // 4/4/9 with a generous margin for rounding and fibre.
    check(
      "food_macros_account_for_kcal",
      sql`abs((${t.proteinG} * 4 + ${t.carbsG} * 4 + ${t.fatG} * 9) - ${t.kcal}) <= greatest(25, ${t.kcal} * 0.15)`,
    ),
    check("food_kcal_sane", sql`${t.kcal} between 1 and 2000`),
    check("food_grams_sane", sql`${t.grams} between 1 and 2000`),
  ],
);

/**
 * Something the model wanted and could not find.
 *
 * The library grows from what plans actually needed rather than from guesses about what
 * Indian clients eat. Counting repeats tells us what to add next.
 */
export const foodRequests = pgTable(
  "food_request",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    /** How many drafts have asked for it. */
    timesRequested: integer().notNull().default(1),
    resolvedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("food_request_name_key").on(t.name)],
);

export type Exercise = typeof exercises.$inferSelect;
export type Food = typeof foods.$inferSelect;
