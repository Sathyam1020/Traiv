import { sql } from "drizzle-orm";
import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const studioTier = pgEnum("studio_tier", ["free", "starter", "pro", "studio"]);
export const studioStatus = pgEnum("studio_status", ["active", "past_due", "cancelled"]);
export const membershipRole = pgEnum("membership_role", ["owner", "coach"]);
export const membershipStatus = pgEnum("membership_status", ["active", "invited", "suspended"]);

/**
 * The tenant. A solo coach is a studio of one.
 *
 * Every trainer has at least one — their own, created at signup and owned by them — and
 * may be a member of others. The subscription belongs to the studio, not the person, so
 * a coach invited into a paid studio still has their own on the free tier.
 */
export const studios = pgTable(
  "studio",
  {
    id: text().primaryKey(),
    // firstname + 6 random chars, e.g. "sathyam-k3n9qa". Random suffix rather than
    // collision retries, and it becomes <slug>.traiv.fit when white-label ships.
    slug: text().notNull(),
    name: text().notNull(),

    tier: studioTier().notNull().default("free"),
    status: studioStatus().notNull().default("active"),

    // Branding lives on the studio, not the coach — a studio with several coaches must
    // show one identity to its clients.
    brandDisplayName: text(),
    brandLogoUrl: text(),
    brandColor: text(),

    // Shown as a QR and a link in settings. Anyone who opens it joins this studio, so
    // it is rotatable — a code that leaks onto social media can be replaced without
    // changing the studio slug — and has a kill switch.
    joinCode: text().notNull(),
    joinEnabled: boolean().notNull().default(true),

    timezone: text().notNull().default("Asia/Kolkata"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("studio_slug_key").on(t.slug).where(sql`${t.deletedAt} is null`),
    uniqueIndex("studio_join_code_key").on(t.joinCode).where(sql`${t.deletedAt} is null`),
  ],
);

/** Staff of a studio. The junction that lets one person work across several. */
export const memberships = pgTable(
  "membership",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: membershipRole().notNull().default("coach"),
    status: membershipStatus().notNull().default("active"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    // Partial, so re-inviting a coach who was removed does not collide with the old row.
    uniqueIndex("membership_studio_user_key")
      .on(t.studioId, t.userId)
      .where(sql`${t.deletedAt} is null`),
    index("membership_user_idx").on(t.userId),
    index("membership_studio_idx").on(t.studioId, t.status),
  ],
);

export type Studio = typeof studios.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
