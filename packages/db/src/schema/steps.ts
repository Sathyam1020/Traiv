import { sql } from "drizzle-orm";
import { check, date, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { clients } from "./client.js";
export const dailySteps = pgTable(
  "daily_steps",
  {
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    date: date().notNull(),
    count: integer().notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.clientId, t.date] }),
    check("steps_count_valid", sql`${t.count} between 0 and 200000`),
  ],
);
export const stepGoals = pgTable(
  "step_goal",
  {
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    effectiveOn: date().notNull(),
    count: integer().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.clientId, t.effectiveOn] }),
    check("step_goal_valid", sql`${t.count} between 100 and 100000`),
  ],
);
