import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { studios } from "./studio.js";
import { users } from "./user.js";

/**
 * Someone who refers coaches to Traiv.
 *
 * Another row that says what a person *is* — the same shape as `membership` and
 * `client`, and for the same reason (ADR 0004). Anyone can be one: a coach who refers a
 * peer, a client who liked the product, or somebody who has never trained a day in their
 * life. None of that is a different kind of account, it is a different row.
 *
 * One per user, so a person cannot accumulate codes and split their referrals across
 * them to game milestone bonuses.
 */
export const endorsers = pgTable(
  "endorser",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Shared out loud, in an Instagram bio, over WhatsApp. Same alphabet as the join
    // code — no 0/O/1/I/L/U — because it gets read aloud and typed by hand.
    code: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    // Partial, like every other unique in this schema: leaving should not reserve your
    // code or your account forever.
    uniqueIndex("endorser_user_key").on(t.userId).where(sql`${t.deletedAt} is null`),
    uniqueIndex("endorser_code_key").on(t.code).where(sql`${t.deletedAt} is null`),
  ],
);

/**
 * Which endorser brought a studio in.
 *
 * Attached to the studio rather than the coach, because the studio is what subscribes —
 * the same reason the subscription lives there. A coach who belongs to two studios does
 * not drag a referral between them.
 *
 * `UNIQUE(studioId)` is the rule from positioning.md: a studio is attributed once, ever.
 * Without it, a coach could re-enter a friend's code every month and mint commission,
 * and attribution would depend on whoever asked last rather than who actually referred.
 *
 * `onDelete: "restrict"` on the endorser: money is owed against these rows, so an
 * endorser with referrals cannot be deleted out from under them.
 */
export const referrals = pgTable(
  "referral",
  {
    id: text().primaryKey(),
    studioId: text()
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    endorserId: text()
      .notNull()
      .references(() => endorsers.id, { onDelete: "restrict" }),

    // The code as it was at the time. Endorser codes are not rotatable today, but an
    // attribution record that silently changes meaning later is not a record.
    codeUsed: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("referral_studio_key").on(t.studioId),
    index("referral_endorser_idx").on(t.endorserId, t.createdAt),
  ],
);

export type Endorser = typeof endorsers.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
