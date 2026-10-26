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
import { exercises } from "./library.js";
import { memberships, studios } from "./studio.js";

/**
 * Training, modelled on Coachway's trainer app screen for screen.
 *
 * **Template → Session → Exercise → Set.** A template is a named programme; a *session*
 * is one workout within it ("1 session" on their templates list, "No session added yet"
 * on an empty one, session tabs across the top of the builder). Exercises cannot exist
 * outside a session. This replaces the section/item model in the first cut of ADR 0023,
 * which was inferred from the mobile bundle and was wrong — see ADR 0024.
 *
 * **A client's programme is a copy, not an assignment.** Their flow is "Duplicate from
 * template" → "Customize Template" → a row on the client's Workouts tab with
 * `Source: By coach`. There is no join table and no shared row: each client gets their
 * own programme that the coach can edit without touching anybody else's.
 */

/** Draft is invisible to the client. Publishing is an explicit, confirmed action. */
export const templateStatus = pgEnum("template_status", ["draft", "active"]);

/** Who authored it. Shown on the client's list as "By coach". */
export const templateSource = pgEnum("template_source", ["coach", "client"]);

/* -------------------------------------------------------------------------- */
/* Templates and programmes                                                    */
/* -------------------------------------------------------------------------- */

export const workoutTemplates = pgTable(
  "workout_template",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),

    /**
     * Null is the studio's reusable template. Set means this is one client's programme —
     * a *copy*, made by "Duplicate from template" or written for them directly.
     *
     * The copy is the whole point: a coach editing one client's programme must not
     * change the template it came from, or anybody else's.
     */
    clientId: text().references(() => clients.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    imageUrl: text(),

    status: templateStatus().notNull().default("draft"),
    source: templateSource().notNull().default("coach"),

    /**
     * "These values will be used as the default for new exercises in this template."
     *
     * `{ sets, reps, rest, weightKg, durationSeconds, distanceM }`. Held as one blob
     * because it is a form's memory rather than data anything queries — and because the
     * set of fields grows whenever a new field type is added.
     */
    defaultValues: jsonb(),

    createdBy: text().references(() => memberships.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    index("workout_template_studio_idx").on(t.studioId, t.status),
    index("workout_template_client_idx").on(t.clientId),
  ],
);

/**
 * One workout inside a template.
 *
 * Their builder shows these as tabs with a gear and a `+`, and an exercise cannot be
 * added until one exists — "Create a new session to get started, or copy from another
 * template".
 */
export const workoutSessions = pgTable(
  "workout_session",
  {
    id: text().primaryKey(),
    templateId: text()
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: "cascade" }),

    name: text().notNull(),
    position: integer().notNull(),
  },
  (t) => [uniqueIndex("workout_session_position_key").on(t.templateId, t.position)],
);

/**
 * An exercise in a session.
 *
 * `fields` is the **ordered list of columns this exercise shows** — their "Default
 * fields … the fields a set starts with when you add this exercise to a workout, in this
 * order", copied from the exercise when it is added and then editable per workout. It is
 * why their builder shows `sets · weight · rep range · rest` for one exercise and could
 * show `sets · duration · distance` for another.
 *
 * A list rather than a single set *type*: a set is weight **and** rep range **and** rest
 * at once, which one enum cannot say.
 */
export const sessionExercises = pgTable(
  "session_exercise",
  {
    id: text().primaryKey(),
    sessionId: text()
      .notNull()
      .references(() => workoutSessions.id, { onDelete: "cascade" }),
    exerciseId: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),

    position: integer().notNull(),
    /** `["weight", "rep_range", "rest"]` — which columns, in which order. */
    fields: text().array().notNull().default(sql`'{}'::text[]`),
    /** Exercises sharing a group within a session are a superset. */
    supersetGroup: integer(),
    note: text(),
  },
  (t) => [
    uniqueIndex("session_exercise_position_key").on(t.sessionId, t.position),
    index("session_exercise_exercise_idx").on(t.exerciseId),
  ],
);

/**
 * One prescribed set.
 *
 * A row per set, because their row expands (the chevron) from "sets 3" into the
 * individual sets — a coach can make set 1 a warm-up at 40kg and sets 2-4 working sets
 * at 60, which a count cannot express. The collapsed view shows the common value.
 *
 * Every target is nullable and which ones mean anything is decided by the exercise's
 * `fields`.
 */
export const exerciseSets = pgTable(
  "exercise_set",
  {
    id: text().primaryKey(),
    sessionExerciseId: text()
      .notNull()
      .references(() => sessionExercises.id, { onDelete: "cascade" }),

    position: integer().notNull(),

    reps: integer(),
    /** The top of a rep range — "8 – 10". */
    repsMax: integer(),
    weightKg: real(),
    seconds: integer(),
    distanceM: real(),
    calories: integer(),
    restSeconds: integer(),
  },
  (t) => [
    uniqueIndex("exercise_set_position_key").on(t.sessionExerciseId, t.position),
    // A rep range running backwards is a typo the coach never sees and the client reads
    // as "8 to 6 reps".
    check(
      "exercise_set_rep_range_sane",
      sql`${t.repsMax} is null or ${t.reps} is null or ${t.repsMax} >= ${t.reps}`,
    ),
    check("exercise_set_reps_sane", sql`${t.reps} is null or ${t.reps} between 0 and 1000`),
    check(
      "exercise_set_weight_sane",
      sql`${t.weightKg} is null or ${t.weightKg} between 0 and 1000`,
    ),
  ],
);

/** Their builder's "Sections" tab: a saved run of exercises to drop into a session. */
export const savedSections = pgTable(
  "saved_section",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),

    name: text().notNull(),
    /** A snapshot — editing the workout it came from must not rewrite the saved copy. */
    payload: jsonb().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("saved_section_studio_idx").on(t.studioId)],
);

/* -------------------------------------------------------------------------- */
/* Training                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A session that actually happened. This, not the template, is what the loop reads.
 *
 * `timePeriods` is start/end pairs rather than one span, because their
 * `calculateActiveTime` sums periods — pausing mid-workout is real, and wall clock
 * counts twenty minutes queueing for a rack as training.
 *
 * The metric columns are stored and frozen at completion: an exercise removed from the
 * library later must not change what somebody lifted in March, and the coach's trend has
 * to be readable without re-summing a client's whole history.
 */
export const sessions_ = pgTable(
  "training_session",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    workoutSessionId: text().references(() => workoutSessions.id, { onDelete: "set null" }),

    date: text().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp({ withTimezone: true }),

    /** `[{ startedAt, endedAt }]`, summed for active time. */
    timePeriods: jsonb(),

    /** Their finish screen's `RatingSection`: how it went, and how hard. 1-5. */
    quality: integer(),
    intensity: integer(),
    note: text(),

    totalWeightLiftedKg: real(),
    totalReps: integer(),
    totalSets: integer(),
    totalCompletedSets: integer(),
    totalDistanceM: real(),
    totalSeconds: integer(),
    totalCalories: integer(),
  },
  (t) => [
    index("training_session_client_idx").on(t.clientId, t.date),
    // "When did this client last complete a session" — the roster asks it once per row
    // and four more times for the filter counts, so it is the hottest read in the coach
    // app. Without this it is a sequential scan per client.
    index("training_session_completed_idx").on(t.clientId, t.completedAt),
    index("training_session_workout_idx").on(t.workoutSessionId),
    check(
      "training_session_quality_sane",
      sql`${t.quality} is null or ${t.quality} between 1 and 5`,
    ),
    check(
      "training_session_intensity_sane",
      sql`${t.intensity} is null or ${t.intensity} between 1 and 5`,
    ),
  ],
);

/**
 * One set, as performed.
 *
 * `completed` is the tick the client taps, separate from the values being present: a
 * half-finished exercise has to survive the app closing, and a set can be logged without
 * being ticked.
 */
export const setLogs = pgTable(
  "set_log",
  {
    id: text().primaryKey(),
    sessionId: text()
      .notNull()
      .references(() => sessions_.id, { onDelete: "cascade" }),
    sessionExerciseId: text().references(() => sessionExercises.id, { onDelete: "set null" }),
    exerciseSetId: text().references(() => exerciseSets.id, { onDelete: "set null" }),

    setNumber: integer().notNull(),
    completed: boolean().notNull().default(false),

    reps: integer(),
    loadKg: real(),
    seconds: integer(),
    distanceM: real(),
    calories: integer(),
    restSeconds: integer(),

    loggedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // The key that makes logging idempotent: a double tap on a flaky gym connection
    // corrects the row instead of inventing an extra set.
    uniqueIndex("set_log_slot_key").on(t.sessionId, t.sessionExerciseId, t.setNumber),
    index("set_log_exercise_idx").on(t.sessionExerciseId),
    check("set_log_reps_sane", sql`${t.reps} is null or ${t.reps} between 0 and 1000`),
    check("set_log_load_sane", sql`${t.loadKg} is null or ${t.loadKg} between 0 and 1000`),
  ],
);

export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type SessionExercise = typeof sessionExercises.$inferSelect;
export type ExerciseSet = typeof exerciseSets.$inferSelect;
export type TrainingSession = typeof sessions_.$inferSelect;
export type SetLog = typeof setLogs.$inferSelect;
