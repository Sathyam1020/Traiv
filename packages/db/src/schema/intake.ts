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
import { memberships } from "./studio.js";
import { users } from "./user.js";

export const goal = pgEnum("goal", [
  "lose_fat",
  "build_muscle",
  "get_stronger",
  "maintain",
  "improve_fitness",
  "general_health",
]);

/** Biological sex, because the BMR equation needs it. Not gender, and not displayed. */
export const sex = pgEnum("sex", ["male", "female", "undisclosed"]);

export const activityLevel = pgEnum("activity_level", [
  "sedentary",
  "light",
  "moderate",
  "very",
  "extra",
]);

export const trainingExperience = pgEnum("training_experience", ["new", "some", "experienced"]);

/** Eggetarian and Jain are not decoration — a plan that ignores them is quietly abandoned. */
export const dietType = pgEnum("diet_type", [
  "vegetarian",
  "non_vegetarian",
  "eggetarian",
  "vegan",
  "jain",
]);

export const targetStatus = pgEnum("target_status", ["proposed", "active", "superseded"]);

/**
 * What a person told us about themselves, once.
 *
 * Keyed on the user, not on the coaching relationship. Age, sex, height, what they eat and
 * what hurts are facts about a person — asking for them again because they hired a second
 * coach is the app admitting it wasn't listening the first time. Somebody who adds a
 * dietitian alongside their lifting coach answers nothing twice.
 *
 * The cost is that both coaches read the same row, including the same goal. That is
 * deliberate: `client.goal` already exists per relationship (ADR 0004) for a coach who
 * needs to track something different for their own programme, and a coach editing their
 * copy should not reach back and rewrite what the client said about themselves.
 *
 * Nearly everything is nullable. A client may leave any single answer blank — the coach
 * fills the gap after session one — and `lastStep` is what lets a half-finished intake
 * resume instead of restarting.
 *
 * Current weight is deliberately *not* here. It belongs in `body_metric`, because a single
 * frozen number cannot show a plateau and spotting a plateau is the whole point of the
 * loop this feeds.
 */
export const userIntakes = pgTable(
  "user_intake",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    goal: goal(),
    targetWeightKg: real(),

    sex: sex(),
    /** Year only. Nobody needs a client's birthday to work out a calorie target. */
    birthYear: integer(),
    heightCm: real(),

    dailyActivity: activityLevel(),
    experience: trainingExperience(),
    daysPerWeek: integer(),
    sessionMinutes: integer(),
    /** full_gym | home_basics | dumbbells | bodyweight | bands */
    equipment: text().array(),

    diet: dietType(),
    allergies: text(),
    dislikes: text(),
    mealsPerDay: integer(),

    /** knee | lower_back | shoulder | diabetes | blood_pressure | thyroid | pcos | pregnancy */
    healthFlags: text().array(),
    /** Their own words, passed to the coach verbatim and never interpreted by a model. */
    healthNote: text(),

    /** mon…sun */
    trainingDays: text().array(),
    /** morning | afternoon | evening | varies */
    preferredTime: text(),

    /** 1-6. Null once finished; set while they are partway through. */
    lastStep: integer(),
    completedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("user_intake_user_key").on(t.userId),
    // Ranges wide enough for any real person and narrow enough to catch a slipped decimal
    // or centimetres typed into the kilograms box, which would otherwise reach the
    // calculator and come back out as a calorie target.
    check("intake_height_sane", sql`${t.heightCm} is null or ${t.heightCm} between 90 and 250`),
    check(
      "intake_target_weight_sane",
      sql`${t.targetWeightKg} is null or ${t.targetWeightKg} between 25 and 400`,
    ),
    check(
      "intake_birth_year_sane",
      sql`${t.birthYear} is null or ${t.birthYear} between 1900 and 2100`,
    ),
    check("intake_days_sane", sql`${t.daysPerWeek} is null or ${t.daysPerWeek} between 1 and 7`),
    check(
      "intake_session_sane",
      sql`${t.sessionMinutes} is null or ${t.sessionMinutes} between 10 and 240`,
    ),
    check("intake_meals_sane", sql`${t.mealsPerDay} is null or ${t.mealsPerDay} between 1 and 8`),
    check("intake_last_step_sane", sql`${t.lastStep} is null or ${t.lastStep} between 1 and 6`),
  ],
);

/**
 * A measurement of a body at a moment.
 *
 * Append-only and deliberately boring. Weight is a series, not a field: "has this person
 * plateaued for three weeks" is unanswerable from a column that gets overwritten, and that
 * question is what decides whether their calories should move.
 *
 * On the user for the same reason as the intake — a person has one weight, whoever is
 * coaching them. Onboarding writes the first row; check-ins write the rest.
 */
export const bodyMetrics = pgTable(
  "body_metric",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    takenAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    weightKg: real().notNull(),
    /** intake | check_in | coach */
    source: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("body_metric_user_taken_idx").on(t.userId, t.takenAt),
    // Onboarding owns exactly one row. Someone stepping back to fix a typo in their weight
    // should correct the measurement, not add a second one and invent a trend out of a
    // mistake. Everything after onboarding appends normally.
    uniqueIndex("body_metric_intake_key").on(t.userId).where(sql`${t.source} = 'intake'`),
    check("body_metric_weight_sane", sql`${t.weightKg} between 25 and 400`),
  ],
);

/**
 * What a client should eat, and why.
 *
 * Append-only. An adjustment is a new row, never an edit, so a coach can see that someone
 * went 2,200 → 2,000 → 1,900 over four months and what each change was based on. A column
 * that gets overwritten throws that away, and a number nobody can account for is a number
 * a coach cannot defend to their client.
 *
 * `basis` holds the full derivation from `@traiv/nutrition` — formula version, BMR, TDEE,
 * activity factor, the adjustment applied and which floor bound it. It is jsonb because
 * the derivation will gain fields as the loop grows, and because nothing queries inside it.
 *
 * `proposed` is the default for anyone the calculator flagged. Those targets wait for a
 * coach; they do not reach the client.
 */
export const nutritionTargets = pgTable(
  "nutrition_target",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    effectiveFrom: timestamp({ withTimezone: true }).notNull().defaultNow(),

    kcal: integer().notNull(),
    proteinG: integer().notNull(),
    carbsG: integer().notNull(),
    fatG: integer().notNull(),

    basis: jsonb().notNull(),
    /** Why a human had to look: pregnancy, medical_condition, underweight, … */
    reviewReasons: text().array(),

    status: targetStatus().notNull().default("proposed"),
    /** system | coach */
    createdBy: text().notNull(),
    approvedBy: text().references(() => memberships.id, { onDelete: "set null" }),
    approvedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("nutrition_target_user_idx").on(t.userId, t.effectiveFrom),
    // One live target per person. Two coaches prescribing different calorie numbers to the
    // same body is not a thing anyone can act on — they would be eating one or the other.
    uniqueIndex("nutrition_target_active_key").on(t.userId).where(sql`${t.status} = 'active'`),
    check("nutrition_target_kcal_sane", sql`${t.kcal} between 800 and 8000`),
    // An approval without an approver is how an unreviewed target quietly becomes a
    // reviewed one.
    check(
      "nutrition_target_approval_complete",
      sql`(${t.approvedBy} is null) = (${t.approvedAt} is null)`,
    ),
  ],
);

export type UserIntake = typeof userIntakes.$inferSelect;
export type NewUserIntake = typeof userIntakes.$inferInsert;
export type BodyMetric = typeof bodyMetrics.$inferSelect;
export type NutritionTarget = typeof nutritionTargets.$inferSelect;
