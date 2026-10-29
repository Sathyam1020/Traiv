import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
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
    imageUrl: text(),
    cues: text(),
    description: text(),

    /**
     * Coachway's "Edit Exercise" step 2, and all of it optional as it is there.
     *
     * Primary focus is `muscle` above; these are the rest. The vocabulary matches
     * `free-exercise-db` (public domain, 876 exercises with images), which is what the
     * library seeds from — so a seeded exercise and a coach-written one carry the same
     * fields rather than the seed having a richer shape than the form.
     */
    secondaryMuscles: text().array(),
    /** Compound or isolation — their "Stimulus". `mechanic` in the source dataset. */
    stimulus: text(),
    /** beginner · intermediate · expert. Their "Experience Level". */
    level: text(),
    /** strength · cardio · stretching · plyometrics · … Their "Exercise Type". */
    category: text(),
    /** Gym · Home · Outdoors. Coachway-specific; not in the dataset. */
    location: text(),
    /** low · medium · high. Coachway-specific; not in the dataset. */
    injuryRisk: text(),

    /**
     * "The fields a set starts with when you add this exercise to a workout, in this
     * order" — their Default fields picker. Copied onto `session_exercise` when the
     * exercise is added, and editable there afterwards.
     */
    defaultFields: text().array().notNull().default(sql`'{"weight","reps","rest"}'::text[]`),

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

export type Exercise = typeof exercises.$inferSelect;
