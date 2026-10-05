import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
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

    // The activation metric. Set on their first logged workout, never before.
    activatedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
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
  ],
);

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
