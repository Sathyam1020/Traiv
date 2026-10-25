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
import { foods } from "./library.js";
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

export type DietPlan = typeof dietPlans.$inferSelect;
