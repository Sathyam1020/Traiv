import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { clients } from "./client.js";
/** Standalone coach measurements; check-in answers retain their original source. */
export const clientMeasurements = pgTable(
  "client_measurement",
  {
    id: text().primaryKey(),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    takenAt: timestamp({ withTimezone: true }).notNull(),
    values: jsonb().$type<Record<string, number>>().notNull(),
    imageUrls: jsonb().$type<Record<string, string>>().notNull().default({}),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("client_measurement_date_idx").on(t.clientId, t.takenAt)],
);
