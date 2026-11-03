import {
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { checkIns } from "./check-in.js";
import { clients } from "./client.js";
import { studios } from "./studio.js";
import { users } from "./user.js";

/** A relationship is the conversation boundary. Channels never cross relationships. */
export const messages = pgTable(
  "chat_message",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    channel: text().notNull().default("chat"),
    author: text().notNull(), // client | coach | activity
    senderId: text().references(() => users.id, { onDelete: "set null" }),
    body: text().notNull().default(""),
    replyTo: text(),
    kind: text().notNull().default("text"),
    sourceId: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("chat_history_idx").on(t.studioId, t.clientId, t.channel, t.createdAt, t.id),
    uniqueIndex("chat_activity_once_idx").on(t.clientId, t.kind, t.sourceId),
  ],
);
export const messageReads = pgTable(
  "chat_read",
  {
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    channel: text().notNull(),
    readAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.clientId, t.userId, t.channel] })],
);
export const messageReactions = pgTable(
  "chat_reaction",
  {
    messageId: text()
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emoji: text().notNull(),
  },
  (t) => [primaryKey({ columns: [t.messageId, t.userId] })],
);
export const mediaAssets = pgTable(
  "media_asset",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    ownerId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text().notNull().default("cloudinary"),
    key: text().notNull(),
    resourceType: text().notNull(),
    format: text(),
    name: text().notNull(),
    bytes: integer(),
    metadata: jsonb().$type<{
      width?: number;
      height?: number;
      duration?: number;
      version?: number;
    }>(),
    verifiedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("media_owner_idx").on(t.clientId, t.ownerId)],
);
export const messageAttachments = pgTable(
  "chat_attachment",
  {
    messageId: text()
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    assetId: text()
      .notNull()
      .references(() => mediaAssets.id),
  },
  (t) => [primaryKey({ columns: [t.messageId, t.assetId] })],
);
export const checkInReviews = pgTable("check_in_review", {
  checkInId: text()
    .primaryKey()
    .references(() => checkIns.id, { onDelete: "cascade" }),
  studioId: text()
    .notNull()
    .references(() => studios.id, { onDelete: "cascade" }),
  reviewerId: text().references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
