import { sql } from "drizzle-orm";
import {
  boolean,
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
import { exercises, foods } from "./library.js";
import { memberships } from "./studio.js";
import { users } from "./user.js";

export const planStatus = pgEnum("plan_status", [
  "generating",
  "proposed",
  "active",
  "superseded",
  "failed",
]);
export const planSource = pgEnum("plan_source", ["ai", "coach"]);
export const mealSlot = pgEnum("meal_slot", ["breakfast", "lunch", "dinner", "snack"]);

/**
 * Eight weeks of training, generated once.
 *
 * Two four-week mesocycles. The classic block is three weeks of building load and one
 * deload, and eight to twelve weeks is the documented range for a beginner — so the
 * progression is written into the eight weeks at generation time rather than the client
 * being handed a fresh plan every Monday.
 *
 * Twelve weeks upfront was considered and rejected: eleven of them would be guesses that
 * ignore everything that actually happened, and the first real adjustment throws them away.
 *
 * On the **client**, not the user — unlike intake. A plan is written by one coach for one
 * coaching relationship, and somebody with a lifting coach and a physio should have two.
 */
export const workoutPlans = pgTable(
  "workout_plan",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),

    startDate: text().notNull(),
    weeks: integer().notNull().default(8),

    status: planStatus().notNull().default("generating"),
    source: planSource().notNull(),
    /** The intake and target the draft was built from, so a plan explains itself later. */
    generatedFrom: jsonb(),

    approvedBy: text().references(() => memberships.id, { onDelete: "set null" }),
    approvedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("workout_plan_client_idx").on(t.clientId, t.createdAt),
    // One live plan per client, for the same reason as `nutrition_target`: two would mean
    // the app and the coach looking at different training on the same day.
    uniqueIndex("workout_plan_active_key").on(t.clientId).where(sql`${t.status} = 'active'`),
    check("workout_plan_weeks_sane", sql`${t.weeks} between 1 and 16`),
    check(
      "workout_plan_approval_complete",
      sql`(${t.approvedBy} is null) = (${t.approvedAt} is null)`,
    ),
  ],
);

export const workoutDays = pgTable(
  "workout_day",
  {
    id: text().primaryKey(),
    planId: text()
      .notNull()
      .references(() => workoutPlans.id, { onDelete: "cascade" }),

    /** 0-based week within the plan. */
    weekIndex: integer().notNull(),
    isDeload: boolean().notNull().default(false),
    /** 0 = Monday, matching how every programme in the field is written. */
    dayOfWeek: integer().notNull(),

    title: text().notNull(),
    isRest: boolean().notNull().default(false),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("workout_day_slot_key").on(t.planId, t.weekIndex, t.dayOfWeek),
    check("workout_day_week_sane", sql`${t.weekIndex} between 0 and 15`),
    check("workout_day_dow_sane", sql`${t.dayOfWeek} between 0 and 6`),
  ],
);

export const workoutItems = pgTable(
  "workout_item",
  {
    id: text().primaryKey(),
    dayId: text()
      .notNull()
      .references(() => workoutDays.id, { onDelete: "cascade" }),
    exerciseId: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),

    position: integer().notNull(),
    sets: integer().notNull(),
    /** Text, not a number: "8-10" and "AMRAP" are both real prescriptions. */
    reps: text().notNull(),
    /** "bodyweight", "60% 1RM", "whatever you did last week + 2.5kg". */
    loadHint: text(),
    rpe: real(),
    restSeconds: integer(),
    note: text(),
  },
  (t) => [
    uniqueIndex("workout_item_position_key").on(t.dayId, t.position),
    index("workout_item_exercise_idx").on(t.exerciseId),
    check("workout_item_sets_sane", sql`${t.sets} between 1 and 20`),
    check("workout_item_rpe_sane", sql`${t.rpe} is null or ${t.rpe} between 1 and 10`),
  ],
);

/**
 * Seven days of food.
 *
 * A week, because seven days is the check-in cadence and long enough to read a real trend
 * in weight — and because a month of meal plans written before anybody has eaten one is a
 * month of work thrown away at the first adjustment.
 *
 * The macro header is copied from the `nutrition_target` that produced it rather than
 * joined: a plan must not silently change because the target moved underneath it.
 */
export const dietPlans = pgTable(
  "diet_plan",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),

    weekStart: text().notNull(),

    kcal: integer().notNull(),
    proteinG: integer().notNull(),
    carbsG: integer().notNull(),
    fatG: integer().notNull(),

    status: planStatus().notNull().default("generating"),
    source: planSource().notNull(),
    generatedFrom: jsonb(),

    approvedBy: text().references(() => memberships.id, { onDelete: "set null" }),
    approvedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("diet_plan_client_idx").on(t.clientId, t.weekStart),
    uniqueIndex("diet_plan_active_key").on(t.clientId).where(sql`${t.status} = 'active'`),
    check(
      "diet_plan_approval_complete",
      sql`(${t.approvedBy} is null) = (${t.approvedAt} is null)`,
    ),
  ],
);

export const meals = pgTable(
  "meal",
  {
    id: text().primaryKey(),
    dietPlanId: text()
      .notNull()
      .references(() => dietPlans.id, { onDelete: "cascade" }),

    /** 0-6 within the week. */
    dayIndex: integer().notNull(),
    slot: mealSlot().notNull(),
    position: integer().notNull().default(0),
    name: text().notNull(),
  },
  (t) => [
    index("meal_plan_day_idx").on(t.dietPlanId, t.dayIndex),
    check("meal_day_sane", sql`${t.dayIndex} between 0 and 6`),
  ],
);

/**
 * One food in one meal.
 *
 * Macros are copied from the food at write time rather than joined. Correcting a typo in
 * the library must not silently rewrite what somebody was told to eat last Tuesday — and
 * a plan whose numbers move under it cannot be audited by the coach who approved it.
 */
export const mealItems = pgTable(
  "meal_item",
  {
    id: text().primaryKey(),
    mealId: text()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    foodId: text()
      .notNull()
      .references(() => foods.id, { onDelete: "restrict" }),

    /** Multiples of the food's home measure: 2 = "2 katori". */
    quantity: real().notNull(),

    kcal: integer().notNull(),
    proteinG: real().notNull(),
    carbsG: real().notNull(),
    fatG: real().notNull(),
  },
  (t) => [
    index("meal_item_meal_idx").on(t.mealId),
    check("meal_item_quantity_sane", sql`${t.quantity} > 0 and ${t.quantity} <= 20`),
  ],
);

/** A session that actually happened. This, not the plan, is what the loop reads. */
export const sessions_ = pgTable(
  "training_session",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    workoutDayId: text().references(() => workoutDays.id, { onDelete: "set null" }),

    date: text().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp({ withTimezone: true }),

    note: text(),
  },
  (t) => [index("training_session_client_idx").on(t.clientId, t.date)],
);

export const setLogs = pgTable(
  "set_log",
  {
    id: text().primaryKey(),
    sessionId: text()
      .notNull()
      .references(() => sessions_.id, { onDelete: "cascade" }),
    workoutItemId: text().references(() => workoutItems.id, { onDelete: "set null" }),

    setNumber: integer().notNull(),
    reps: integer(),
    loadKg: real(),
    loggedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("set_log_slot_key").on(t.sessionId, t.workoutItemId, t.setNumber),
    check("set_log_reps_sane", sql`${t.reps} is null or ${t.reps} between 0 and 1000`),
    check("set_log_load_sane", sql`${t.loadKg} is null or ${t.loadKg} between 0 and 1000`),
  ],
);

/** Did they eat it. One row per meal per day, written when the client ticks it. */
export const mealLogs = pgTable(
  "meal_log",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mealId: text()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),

    date: text().notNull(),
    ate: boolean().notNull().default(true),
    loggedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("meal_log_day_key").on(t.userId, t.mealId, t.date)],
);

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type DietPlan = typeof dietPlans.$inferSelect;
