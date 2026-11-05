import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./client.js";
import { studios } from "./studio.js";

export const vaultResources = pgTable(
  "vault_resource",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text().notNull().default(""),
    type: text().notNull().default("Document"),
    link: text(),
    storageKey: text(),
    storageType: text(),
    format: text(),
    bytes: integer(),
    verifiedAt: timestamp({ withTimezone: true }),
    allClients: boolean().notNull().default(false),
    tagIds: jsonb().$type<string[]>().notNull().default([]),
    gender: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("vault_studio_idx").on(t.studioId)],
);

export const vaultAssignments = pgTable(
  "vault_assignment",
  {
    resourceId: text()
      .notNull()
      .references(() => vaultResources.id, { onDelete: "cascade" }),
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    assignedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    openedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    primaryKey({ columns: [t.resourceId, t.clientId] }),
    index("vault_client_idx").on(t.clientId),
  ],
);

/** Seen state is separate from assignments: viewing a shared resource never grants access. */
export const vaultReads = pgTable(
  "vault_read",
  {
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    resourceId: text()
      .notNull()
      .references(() => vaultResources.id, { onDelete: "cascade" }),
    seenAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.clientId, t.resourceId] })],
);
