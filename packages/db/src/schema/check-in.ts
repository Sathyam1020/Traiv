import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { clients } from "./client.js";
import { studios } from "./studio.js";

/**
 * What a check-in can be.
 *
 * Only `completed` is ever written. The other three are derived on read from the due
 * date and the grace window, because a nightly job that flips statuses is a job that
 * can fail silently and leave the screen asserting something untrue. See
 * `checkInState` in the API for the derivation.
 */
export const checkInStatus = pgEnum("check_in_status", ["pending", "completed"]);

/** What a metric answer holds. Mirrors the four kinds a form can ask for. */
export const metricType = pgEnum("metric_type", ["number", "text", "image", "rating"]);

/**
 * The registry a check-in form is built from.
 *
 * `code` rather than `name` is what everything else refers to — a chart, an export, an
 * automation — so renaming the label a coach sees never breaks a reference.
 *
 * `studioId` null is the shared library; set means a coach made their own. Same split
 * as `exercise`, deliberately, so "library versus mine" is one idea in this codebase
 * rather than two.
 */
export const metrics = pgTable(
  "metric",
  {
    id: text().primaryKey(),
    studioId: text().references(() => studios.id, { onDelete: "cascade" }),

    code: text().notNull(),
    name: text().notNull(),
    type: metricType().notNull(),
    /** "kg", "hours", "1-5". Null for text and image. */
    unit: text(),
    /** Groups convertible units, so kg and lb are one series rather than two. */
    unitCategory: text(),
    /** Lower first. Decides the order questions are asked in. */
    position: integer().notNull().default(0),

    /** Retires a metric without deleting the answers that reference it. */
    archivedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("metric_code_key").on(t.code, t.studioId),
    index("metric_studio_idx").on(t.studioId),
    check("metric_code_shape", sql`${t.code} ~ '^[a-z][a-z0-9_]*$'`),
  ],
);

/**
 * One scheduled check-in.
 *
 * `dueOn` is the whole point of this table. Without a record of what was *expected*
 * there is no completion rate and nothing can ever be missed — which is exactly the
 * limitation of treating a completed `training_session` as a check-in.
 *
 * Rows are materialised ahead of time by the scheduler rather than computed on read,
 * so an answer has something to attach to and so the grid can show the future.
 */
export const checkIns = pgTable(
  "check_in",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),

    /** The day it is due. A date, not a timestamp: nobody checks in at 09:00 sharp. */
    dueOn: date().notNull(),
    /**
     * The last day a submission still counts. Stored rather than derived from the
     * schedule, so changing a client's cadence cannot retroactively turn a check-in
     * somebody submitted in good faith into a missed one.
     */
    closesOn: date().notNull(),

    status: checkInStatus().notNull().default("pending"),
    completedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    /** One per client per due date, so re-running the scheduler is a no-op. */
    uniqueIndex("check_in_due_key").on(t.clientId, t.dueOn),
    index("check_in_client_due_idx").on(t.clientId, t.dueOn),
    check("check_in_window_sane", sql`${t.closesOn} >= ${t.dueOn}`),
    /** A completion without a time, or a time without a completion, is neither. */
    check(
      "check_in_completion_complete",
      sql`(${t.status} = 'completed') = (${t.completedAt} is not null)`,
    ),
  ],
);

/**
 * One metric's value within one check-in.
 *
 * Four nullable columns and a CHECK rather than a single jsonb blob: a weight has to be
 * queryable as a number for the chart that plots it, and "exactly one of these is set"
 * is a rule the database can hold rather than one every reader has to remember.
 */
export const checkInAnswers = pgTable(
  "check_in_answer",
  {
    id: text().primaryKey(),
    checkInId: text()
      .notNull()
      .references(() => checkIns.id, { onDelete: "cascade" }),
    metricId: text()
      .notNull()
      .references(() => metrics.id, { onDelete: "restrict" }),

    numberValue: real(),
    textValue: text(),
    ratingValue: integer(),
    imageUrl: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("check_in_answer_key").on(t.checkInId, t.metricId),
    index("check_in_answer_metric_idx").on(t.metricId),
    check(
      "check_in_answer_one_value",
      sql`(${t.numberValue} is not null)::int + (${t.textValue} is not null)::int
          + (${t.ratingValue} is not null)::int + (${t.imageUrl} is not null)::int = 1`,
    ),
    check(
      "check_in_answer_rating_range",
      sql`${t.ratingValue} is null or ${t.ratingValue} between 1 and 5`,
    ),
  ],
);

export type Metric = typeof metrics.$inferSelect;
export type CheckIn = typeof checkIns.$inferSelect;
export type CheckInAnswer = typeof checkInAnswers.$inferSelect;
