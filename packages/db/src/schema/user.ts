import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Identity only. No role, no org, no business data.
 *
 * What someone *is* comes from which table their id appears in — `membership` (org staff),
 * `client`, `affiliate`, `platform_admin`. That's what lets one person be a coach, an
 * affiliate, and someone else's client with a single login. See ADR 0004.
 */
export const users = pgTable(
  "user",
  {
    id: text().primaryKey(),

    // At least one of these must exist — see the CHECK below.
    // Indian clients often arrive with only a phone; coaches sign up with email.
    email: text(),
    phone: text(), // E.164, e.g. +919876543210

    // Null for clients, who authenticate by OTP and never set one. Requiring it would
    // force a fake password on every client onboarded — and client activation is the
    // metric the business is judged on. See ADR 0005.
    passwordHash: text(),

    name: text().notNull(),
    avatarUrl: text(),
    locale: text().notNull().default("en-IN"),

    // Phone is always verified at signup; email never is. Email verification is optional
    // and happens later from inside the app.
    emailVerifiedAt: timestamp({ withTimezone: true }),
    phoneVerifiedAt: timestamp({ withTimezone: true }),

    lastSeenAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("user_email_key").on(t.email),
    uniqueIndex("user_phone_key").on(t.phone),
    index("user_last_seen_idx").on(t.lastSeenAt),
    check("user_email_or_phone", sql`${t.email} is not null or ${t.phone} is not null`),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
