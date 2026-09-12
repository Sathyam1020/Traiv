import { index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const authProvider = pgEnum("auth_provider", ["password", "google", "apple", "phone"]);
export const otpTransport = pgEnum("otp_transport", ["whatsapp", "sms", "console"]);
export const challengePurpose = pgEnum("challenge_purpose", [
  "phone_verify",
  "login",
  "client_invite",
  "password_reset",
]);

/**
 * One row per way a user can log in.
 *
 * Provider data lives here rather than on `user`, so adding Apple later is a row type
 * rather than a migration, and one person can hold Google + password + phone at once.
 */
export const authIdentities = pgTable(
  "auth_identity",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: authProvider().notNull(),
    // Google `sub`, or the phone/email the credential belongs to.
    providerUid: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("auth_identity_provider_uid_key").on(t.provider, t.providerUid),
    index("auth_identity_user_idx").on(t.userId),
  ],
);

/**
 * OTP codes and one-time links.
 *
 * Codes are stored hashed, are single-use, and only the newest code for a given
 * phone+purpose is valid. `attempts` and the rate limits around it are what stop this
 * being brute-forceable. See ADR 0005.
 */
export const authChallenges = pgTable(
  "auth_challenge",
  {
    id: text().primaryKey(),
    purpose: challengePurpose().notNull(),

    // The challenge targets a phone or an email, and may exist before any user does —
    // signup begins before the user row is created.
    phone: text(),
    email: text(),
    userId: text().references(() => users.id, { onDelete: "cascade" }),

    // Carried from signup to verification. Held here rather than in process memory so a
    // restart, or a second instance, cannot silently drop the name the user typed.
    pendingName: text(),

    codeHash: text().notNull(),
    attempts: integer().notNull().default(0),

    // Which channel actually delivered, and whether it did. Rate limiting counts only
    // rows where sentAt is set, so a provider outage doesn't burn the user's quota.
    transport: otpTransport(),
    sentAt: timestamp({ withTimezone: true }),
    sendError: text(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    consumedAt: timestamp({ withTimezone: true }),

    requestIp: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("auth_challenge_phone_idx").on(t.phone, t.purpose, t.createdAt),
    index("auth_challenge_email_idx").on(t.email, t.purpose, t.createdAt),
  ],
);

/**
 * Opaque session tokens — deliberately not JWTs.
 *
 * Removing a staff member or ending an impersonation must kill the session immediately,
 * which a JWT cannot do. The token is hashed at rest; the cookie holds the plaintext.
 */
export const sessions = pgTable(
  "session",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text().notNull(),

    // Which studio the user is currently acting in. Set at signup and updated by the
    // switcher, so a returning session lands where they left off.
    activeStudioId: text(),

    userAgent: text(),
    ip: text(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    revokedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("session_token_key").on(t.tokenHash), index("session_user_idx").on(t.userId)],
);

export type AuthIdentity = typeof authIdentities.$inferSelect;
export type AuthChallenge = typeof authChallenges.$inferSelect;
export type Session = typeof sessions.$inferSelect;
