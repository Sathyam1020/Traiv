import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const jobStatus = pgEnum("job_status", ["queued", "running", "done", "failed"]);

/**
 * Work that happens after the request has already answered.
 *
 * Generating a plan takes a minute of model time. Doing it inside the HTTP request means
 * the client watches a spinner until something times out, and a redeploy mid-generation
 * loses the work with nothing to show it ever started.
 *
 * A table rather than a queue service. Postgres is already here, `FOR UPDATE SKIP LOCKED`
 * is exactly the primitive this needs, and the rows are their own audit trail — when a
 * coach asks why a client never got a plan, the answer is a row with an error on it rather
 * than a log line that rotated away. Redis or SQS buys throughput this product will not
 * reach for years, at the cost of infrastructure nobody is paid to run.
 *
 * `lockedBy` and `lockedAt` are what make a crashed worker recoverable: a job held past
 * the lease is reclaimed rather than stuck `running` forever, which is the failure mode
 * every hand-rolled queue has on its first bad deploy.
 */
export const jobs = pgTable(
  "job",
  {
    id: text().primaryKey(),
    /** generate_plan | generate_food_image | weekly_review | purge_auth_rows */
    kind: text().notNull(),
    payload: jsonb().notNull(),

    status: jobStatus().notNull().default("queued"),
    attempts: integer().notNull().default(0),
    maxAttempts: integer().notNull().default(3),

    /** Set in the future to delay or back off; a job is invisible until it passes. */
    runAfter: timestamp({ withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp({ withTimezone: true }),
    lockedBy: text(),

    /** The last failure, kept on the row so a dead job explains itself. */
    error: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    // The claim query: queued, due, oldest first. Partial, because done and failed rows
    // are history and must not slow down the only query that runs every second.
    index("job_claim_idx").on(t.runAfter).where(sql`${t.status} = 'queued'`),
    index("job_kind_idx").on(t.kind, t.createdAt),
    check("job_attempts_sane", sql`${t.attempts} >= 0 and ${t.attempts} <= ${t.maxAttempts}`),
    // A finished job is done or failed, and an unfinished one is neither. Without this the
    // two drift apart and "is this still running?" stops being answerable.
    check(
      "job_finished_matches_status",
      sql`(${t.finishedAt} is null) = (${t.status} in ('queued', 'running'))`,
    ),
  ],
);

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
