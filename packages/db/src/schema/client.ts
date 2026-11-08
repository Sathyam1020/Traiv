import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { memberships, studios } from "./studio.js";
import { users } from "./user.js";

/**
 * Appended rather than ordered logically: Postgres cannot reorder an existing enum
 * without recreating the type, and nothing sorts on this column. See ADR 0013 (waiting,
 * frozen) and ADR 0014 (what each one may do).
 */
export const clientStatus = pgEnum("client_status", [
  "active",
  "paused",
  "archived",
  "waiting",
  "frozen",
]);

/**
 * A person on a coach's roster.
 *
 * `userId` is nullable on purpose. A coach adds someone days before they activate, and
 * some clients never activate at all — the in-person ones a coach logs for from their own
 * phone. A generic "user with a client role" cannot express that without inventing a fake
 * user row, and deleting a user account must not take the coach's roster with it.
 *
 * One person may appear as a client in several studios: a lifting coach and a dietitian
 * are two separate relationships, so the uniqueness is per studio. See ADR 0004.
 */
export const clients = pgTable(
  "client",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    // The coach who owns this relationship. Everyone in the studio can still see them.
    coachId: text()
      .notNull()
      .references(() => memberships.id, { onDelete: "restrict" }),
    userId: text().references(() => users.id, { onDelete: "set null" }),

    name: text().notNull(),
    phone: text(),
    email: text(),

    goal: text(),
    // Injuries, PCOS, thyroid — shown at the top of every plan.
    constraints: text(),

    status: clientStatus().notNull().default("active"),
    joinedVia: text(), // "join_code" | "manual" — how the relationship started

    /**
     * When the coaching relationship officially began — editable, unlike `createdAt`.
     * Defaults to `createdAt` for a client who joins today, but a coach onboarding a
     * gym's existing roster is recording people who started months or years ago; without
     * this, every backfilled client would show a "started today" that is simply false.
     * `createdAt` still holds the untouched fact of when the row was actually added, so
     * nothing here can retroactively inflate a duration metric derived from that.
     */
    startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

    /**
     * When the coaching is agreed to finish. Null is open-ended, which is the default —
     * most coaching has no end date until somebody sets one, and a required date would
     * mean inventing one for every client.
     *
     * It does not change `status` on its own. A date that has passed means the coach
     * should look, not that the system has quietly ended the relationship behind them.
     */
    endsAt: timestamp({ withTimezone: true }),

    /**
     * This client's own check-in cadence. Null inherits the studio's, which is what
     * almost every client will do — an override exists because a competition prep and
     * a general-fitness client do not want the same rhythm.
     */
    checkInWeekday: integer(),
    checkInGraceDays: integer(),
    /** Null means check-ins are off for this client entirely. */
    checkInsEnabled: boolean().notNull().default(true),

    // The activation metric. Set on their first logged workout, never before.
    activatedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    // A person is a client of a given studio exactly once. Partial, because several
    // clients in one studio may legitimately have no user account yet.
    uniqueIndex("client_studio_user_key")
      .on(t.studioId, t.userId)
      .where(sql`${t.userId} is not null and ${t.deletedAt} is null`),
    index("client_studio_status_idx").on(t.studioId, t.status),
    index("client_coach_idx").on(t.coachId),
    index("client_user_idx").on(t.userId),
    // Same shape as user.phone. Matching a client to an account by number is only
    // possible if both sides are stored identically.
    check("client_phone_e164", sql`${t.phone} is null or ${t.phone} ~ '^[+][1-9][0-9]{7,14}$'`),
    check("client_email_lower", sql`${t.email} is null or ${t.email} = lower(${t.email})`),
    check(
      "client_checkin_weekday",
      sql`${t.checkInWeekday} is null or ${t.checkInWeekday} between 0 and 6`,
    ),
    check(
      "client_checkin_grace",
      sql`${t.checkInGraceDays} is null or ${t.checkInGraceDays} between 1 and 60`,
    ),
  ],
);

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
