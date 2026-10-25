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
 * Training, modelled as Coachway models it: a **template library with assignment**.
 *
 * The unit is a reusable workout a coach writes once and assigns to many clients — not a
 * calendar plan generated per client. That is read out of their client bundle rather
 * than guessed: `POST /workout/templates` to create, `PATCH /workout/templates/:id/assign`
 * to attach it to clients, `/duplicate`, `/status`. Supersedes the
 * `workout_plan → workout_day → workout_item` model from ADR 0004 — see ADR 0023.
 *
 * Why it matters beyond parity: a coach with forty clients writing "Upper push" forty
 * times is the thing that makes a coaching app unusable at scale, and a per-client plan
 * has no way to express "everyone on the beginner block gets this".
 */

/** **[V]** Coachway's template status. Draft is invisible to clients. */
export const templateStatus = pgEnum("template_status", ["draft", "active"]);

/** Who wrote it. A client-authored workout is the same row with a `clientId`. */
export const templateSource = pgEnum("template_source", ["coach", "client"]);

/**
 * **[V]** `ESetType` from their `SetTypePicker`, with their own labels:
 * Weight × Reps · Rep range · AMRAP · Time × Distance · Time × Weight · Calories.
 *
 * The type decides which target columns on `item_set` mean anything, which is why they
 * are all nullable and a check constraint enforces the shape per type. A single
 * `reps: text` column — what we had — cannot express "AMRAP at 60kg" and a timed carry
 * as different things, so neither the logger nor the analytics can read them back.
 */
export const setType = pgEnum("set_type", [
  "weight_reps",
  "rep_range_weight",
  "amrap_weight",
  "time_distance",
  "time_weight",
  "calories",
]);

/* -------------------------------------------------------------------------- */
/* Authoring                                                                   */
/* -------------------------------------------------------------------------- */

export const workoutTemplates = pgTable(
  "workout_template",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),

    /**
     * Set only when a client wrote this one themselves, or pulled it out of a pack into
     * their own list. Null is the coach's library — the shared thing that gets assigned.
     *
     * One nullable column rather than two tables, because
     * `createClientWorkoutTemplateFromCollection` proves the two are the same shape: a
     * client adding a pack workout to their plan produces a row the session logger
     * cannot tell apart from a coach's.
     */
    clientId: text().references(() => clients.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    imageUrl: text(),

    status: templateStatus().notNull().default("draft"),
    source: templateSource().notNull().default("coach"),
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
    // A client-authored workout must say whose it is, and a coach's library row must not
    // claim to belong to one client. Without this the two kinds blur and the assignment
    // query silently returns somebody else's private workout.
    check(
      "workout_template_source_shape",
      sql`(${t.source} = 'client') = (${t.clientId} is not null)`,
    ),
  ],
);

/**
 * **[V]** A workout is sections, not a flat list — their `TemplateBuilderScreen` works in
 * `sections[]`, each holding `exercises[]`, with `appendSection` and "Edit section".
 *
 * `rounds` is what makes a section a circuit rather than a heading.
 */
export const workoutSections = pgTable(
  "workout_section",
  {
    id: text().primaryKey(),
    templateId: text()
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: "cascade" }),

    name: text().notNull(),
    position: integer().notNull(),
    /** Null is a plain section. 3 means "go round these three times". */
    rounds: integer(),
  },
  (t) => [
    uniqueIndex("workout_section_position_key").on(t.templateId, t.position),
    check("workout_section_rounds_sane", sql`${t.rounds} is null or ${t.rounds} between 1 and 20`),
  ],
);

export const sectionItems = pgTable(
  "section_item",
  {
    id: text().primaryKey(),
    sectionId: text()
      .notNull()
      .references(() => workoutSections.id, { onDelete: "cascade" }),
    exerciseId: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),

    position: integer().notNull(),
    /**
     * Items sharing a group within a section are a superset — done back to back, rest
     * after the group rather than after each. Their store has a whole parallel set of
     * actions for this (`toggleSupersetSet`, `toggleSupersetExerciseInSet`), so it is a
     * first-class relationship and not a note on an exercise.
     */
    supersetGroup: integer(),
    note: text(),
  },
  (t) => [
    uniqueIndex("section_item_position_key").on(t.sectionId, t.position),
    index("section_item_exercise_idx").on(t.exerciseId),
  ],
);

/**
 * One prescribed set.
 *
 * A row per set rather than `sets: int`, because Coachway lets a coach type each one
 * separately — set 1 a warm-up at 40kg, sets 2-4 working at 60. A count cannot say that,
 * and the client's logger shows one row per set regardless.
 */
export const itemSets = pgTable(
  "item_set",
  {
    id: text().primaryKey(),
    itemId: text()
      .notNull()
      .references(() => sectionItems.id, { onDelete: "cascade" }),

    position: integer().notNull(),
    type: setType().notNull().default("weight_reps"),

    targetReps: integer(),
    /** Only for `rep_range_weight` — the top of "8-10". */
    targetRepsMax: integer(),
    targetWeightKg: real(),
    targetSeconds: integer(),
    targetDistanceM: real(),
    targetCalories: integer(),
    restSeconds: integer(),
  },
  (t) => [
    uniqueIndex("item_set_position_key").on(t.itemId, t.position),
    // A rep range that runs backwards is a typo the coach will never see and the client
    // will read as "8 to 6 reps".
    check(
      "item_set_rep_range_sane",
      sql`${t.targetRepsMax} is null or ${t.targetReps} is null or ${t.targetRepsMax} >= ${t.targetReps}`,
    ),
    check("item_set_reps_sane", sql`${t.targetReps} is null or ${t.targetReps} between 0 and 1000`),
    check(
      "item_set_weight_sane",
      sql`${t.targetWeightKg} is null or ${t.targetWeightKg} between 0 and 1000`,
    ),
  ],
);

/**
 * **[V]** `POST /workout/sections/:id/save-for-reuse` and `GET /workout/sections/saved`.
 *
 * A snapshot rather than a reference: a coach who saves "Warm-up A" and later edits the
 * workout it came from must not have the saved copy change underneath them. `payload`
 * holds the items and sets as written.
 */
export const savedSections = pgTable(
  "saved_section",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),

    name: text().notNull(),
    payload: jsonb().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("saved_section_studio_idx").on(t.studioId)],
);

/* -------------------------------------------------------------------------- */
/* Packs and assignment                                                        */
/* -------------------------------------------------------------------------- */

/** **[V]** Coachway's "packs" — `/collections`, shown to the client as "From your coach". */
export const collections = pgTable(
  "collection",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    imageUrl: text(),
    status: templateStatus().notNull().default("draft"),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("collection_studio_idx").on(t.studioId, t.status)],
);

export const collectionItems = pgTable(
  "collection_item",
  {
    collectionId: text()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    templateId: text()
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: "cascade" }),
    position: integer().notNull(),
  },
  (t) => [
    uniqueIndex("collection_item_key").on(t.collectionId, t.templateId),
    uniqueIndex("collection_item_position_key").on(t.collectionId, t.position),
  ],
);

/**
 * Who has been given what.
 *
 * A join table rather than a column, because the whole point of a template is that it
 * goes to many clients — and unassigning must not destroy the sessions already logged
 * against it, which a cascade from the template would.
 */
export const templateAssignments = pgTable(
  "template_assignment",
  {
    templateId: text()
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: "cascade" }),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),

    assignedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    assignedBy: text().references(() => memberships.id, { onDelete: "set null" }),
  },
  (t) => [
    uniqueIndex("template_assignment_key").on(t.templateId, t.clientId),
    index("template_assignment_client_idx").on(t.clientId),
  ],
);

export const collectionAssignments = pgTable(
  "collection_assignment",
  {
    collectionId: text()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    assignedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("collection_assignment_key").on(t.collectionId, t.clientId),
    index("collection_assignment_client_idx").on(t.clientId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Training                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A session that actually happened. This, not the template, is what the loop reads.
 *
 * `timePeriods` is start/end pairs rather than one span, because their
 * `calculateActiveTime` sums periods — pausing a workout mid-session is a real thing a
 * client does, and elapsed-wall-clock counts the twenty minutes they spent queueing for
 * a rack as training.
 *
 * The metric columns are **stored, not derived**. They are computed from the logged sets
 * at completion and then frozen: an exercise deleted from the library later must not
 * silently change what somebody lifted in March, and the coach's trend has to be
 * readable without re-summing every set in the client's history.
 */
export const sessions_ = pgTable(
  "training_session",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    templateId: text().references(() => workoutTemplates.id, { onDelete: "set null" }),

    date: text().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp({ withTimezone: true }),

    /** `[{ startedAt, endedAt }]`. Summed by `calculateActiveTime`. */
    timePeriods: jsonb(),

    /** **[V]** Their `RatingSection`: how it went, and how hard it was. 1-5. */
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
    index("training_session_template_idx").on(t.templateId),
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
 * `completed` is the tick the client taps — their `toggleSet`, which also starts the rest
 * timer. A set can be logged with numbers and *not* ticked, which is how a half-finished
 * exercise survives leaving the app, so the flag is separate from the values being
 * present.
 *
 * `itemSetId` rather than an item plus a number: the prescription already has a row per
 * set, so pointing at it keeps "set 2 of this exercise" meaningful even after the coach
 * reorders the workout. Nullable because a client can add a set that was never planned.
 */
export const setLogs = pgTable(
  "set_log",
  {
    id: text().primaryKey(),
    sessionId: text()
      .notNull()
      .references(() => sessions_.id, { onDelete: "cascade" }),
    itemId: text().references(() => sectionItems.id, { onDelete: "set null" }),
    itemSetId: text().references(() => itemSets.id, { onDelete: "set null" }),

    setNumber: integer().notNull(),
    type: setType().notNull().default("weight_reps"),
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
    uniqueIndex("set_log_slot_key").on(t.sessionId, t.itemId, t.setNumber),
    index("set_log_item_idx").on(t.itemId),
    check("set_log_reps_sane", sql`${t.reps} is null or ${t.reps} between 0 and 1000`),
    check("set_log_load_sane", sql`${t.loadKg} is null or ${t.loadKg} between 0 and 1000`),
  ],
);

export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type WorkoutSection = typeof workoutSections.$inferSelect;
export type SectionItem = typeof sectionItems.$inferSelect;
export type ItemSet = typeof itemSets.$inferSelect;
export type TrainingSession = typeof sessions_.$inferSelect;
export type SetLog = typeof setLogs.$inferSelect;
