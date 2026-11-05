import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { clients } from "./client.js";
import { studios } from "./studio.js";
import { users } from "./user.js";
/** Private platform feedback. Never expose through coach/roster APIs. */
export const clientFeedback = pgTable(
  "client_feedback",
  {
    id: text().primaryKey(),
    userId: text().references(() => users.id, { onDelete: "set null" }),
    studioId: text().references(() => studios.id, { onDelete: "set null" }),
    clientId: text().references(() => clients.id, { onDelete: "set null" }),
    message: text().notNull(),
    appVersion: text().notNull(),
    status: text().notNull().default("new"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("client_feedback_created_idx").on(t.createdAt),
    index("client_feedback_user_idx").on(t.userId, t.createdAt),
  ],
);
