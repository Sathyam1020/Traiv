import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { studios } from "./studio.js";
import { users } from "./user.js";

/**
 * Federated providers only.
 *
 * `phone` and `password` used to live here as well as on `user`, which meant one
 * credential in two rows with two update paths. Change a number, update `user.phone`,
 * and the stale `auth_identity` row survives — so whoever is assigned that number next
 * could OTP into the account. `user.phone` is the credential and the contact field both,
 * so it had to stay there; this table is now only for identities we do not own.
 *
 * The enum keeps its old values because Postgres cannot drop one, and historical rows
 * still reference them. Nothing writes them any more.
 */
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
    // Per-IP rate limiting reads this; without it the quota check is a sequential scan
    // on the table an attacker is actively growing.
    index("auth_challenge_ip_idx").on(t.requestIp, t.createdAt),
    // Retention: expired rows are swept by age.
    index("auth_challenge_expires_idx").on(t.expiresAt),
    // At most one live code per target. This is what turns "only the newest code is
    // valid" from a query convention into something a double-tap cannot break.
    uniqueIndex("auth_challenge_live_phone_key")
      .on(t.phone, t.purpose)
      .where(sql`${t.consumedAt} is null and ${t.phone} is not null`),
    check(
      "auth_challenge_phone_e164",
      sql`${t.phone} is null or ${t.phone} ~ '^[+][1-9][0-9]{7,14}$'`,
    ),
  ],
);

/**
 * Opaque session tokens — deliberately not JWTs.
 *
 * Revocation is the reason. Signing out everywhere, a changed number, a compromised
 * account — each has to end a session the moment it happens, and a JWT stays valid until
 * it expires no matter what the database says. The token is hashed at rest; the cookie
 * holds the plaintext.
 *
 * Note this is *not* why removing a coach from a studio works: `requireStudio` reads
 * membership on every request, so access ends without touching the session. Revoking on
 * removal would be wrong — it would sign a coach out of their own studio because someone
 * else removed them from theirs.
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
    //
    // The foreign key is defence in depth, not authorization. Studios are soft-deleted,
    // so it rarely fires in normal operation — it catches hard deletes and makes the
    // column's meaning explicit. Membership is still verified on every request, because
    // a valid studio id says nothing about whether this user may act in it.
    activeStudioId: text().references(() => studios.id, { onDelete: "set null" }),

    userAgent: text(),
    ip: text(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    revokedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("session_token_key").on(t.tokenHash),
    index("session_user_idx").on(t.userId),
    // Retention sweeps by expiry, so it needs an index to not scan the hottest table.
    index("session_expires_idx").on(t.expiresAt),
  ],
);

export type AuthIdentity = typeof authIdentities.$inferSelect;
export type AuthChallenge = typeof authChallenges.$inferSelect;
export type Session = typeof sessions.$inferSelect;
