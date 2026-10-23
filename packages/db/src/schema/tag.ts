import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { clients } from "./client.js";
import { studios } from "./studio.js";

/**
 * A label a coach puts on their own clients.
 *
 * Scoped to the studio, not global: "Injured" means something specific to one coach's
 * roster, and two coaches sharing a tag list would mean one of them renaming the other's
 * labels. The unique index is on `(studio_id, lower(name))` so "Weight loss" and "weight
 * loss" cannot both exist — the coach who typed the second one meant the first.
 */
export const tags = pgTable(
  "tag",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),

    name: text().notNull(),
    description: text(),
    /** `#rrggbb`, lower case. The CHECK is what stops a stray value reaching the UI. */
    color: text().notNull().default("#6b7280"),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("tag_studio_name_key").on(t.studioId, sql`lower(${t.name})`),
    index("tag_studio_idx").on(t.studioId),
    check("tag_color_is_hex", sql`${t.color} ~ '^#[0-9a-f]{6}$'`),
    check("tag_name_not_blank", sql`length(btrim(${t.name})) > 0`),
  ],
);

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

/**
 * Which tags are on which client.
 *
 * A composite primary key rather than a surrogate id: the pair *is* the fact, and it
 * makes "tag this client" an `on conflict do nothing` instead of a read-then-write that
 * two tabs can race.
 */
export const clientTags = pgTable(
  "client_tag",
  {
    clientId: text()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    tagId: text()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.clientId, t.tagId] }),
    // "Who has this tag" — the filter the roster runs on every load.
    index("client_tag_tag_idx").on(t.tagId),
  ],
);

export type ClientTag = typeof clientTags.$inferSelect;
