import { date, jsonb, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.js";
export const clientSettings = pgTable("client_settings", {
  userId: text()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  birthDate: date(),
  timeZone: text().notNull().default("Asia/Kolkata"),
  language: text().notNull().default("en"),
  units: text().notNull().default("metric"),
  heightCm: real(),
  notifications: jsonb().$type<Record<string, boolean>>().notNull().default({
    chat: true,
    checkIns: true,
    content: true,
    community: true,
    messageEmail: false,
    campaignEmail: true,
  }),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

import { boolean, integer, primaryKey } from "drizzle-orm/pg-core";
import { clients } from "./client.js";
export const healthConnections = pgTable("health_connection", {
  clientId: text()
    .primaryKey()
    .references(() => clients.id, { onDelete: "cascade" }),
  provider: text().notNull(),
  enabled: boolean().notNull().default(false),
  lastSyncedAt: timestamp({ withTimezone: true }),
});
export const healthWorkouts = pgTable(
  "health_workout",
  {
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    externalId: text().notNull(),
    provider: text().notNull(),
    type: text().notNull(),
    startedAt: timestamp({ withTimezone: true }).notNull(),
    endedAt: timestamp({ withTimezone: true }).notNull(),
    duration: integer().notNull(),
    calories: real(),
    source: text(),
  },
  (t) => [primaryKey({ columns: [t.clientId, t.externalId] })],
);
export const pushSubscriptions = pgTable("push_subscription", {
  endpoint: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  platform: text().notNull(),
  credentials: jsonb().$type<{ p256dh?: string; auth?: string }>().notNull().default({}),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export const notificationDeliveries = pgTable(
  "notification_delivery",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: text().notNull(),
    sentAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.eventId] })],
);
