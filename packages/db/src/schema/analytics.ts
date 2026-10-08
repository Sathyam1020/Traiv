import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Our own analytics, because the alternative is giving a third party every visitor we
 * have in exchange for a dashboard we cannot query.
 *
 * ## No cookie, no identifier, no consent banner
 *
 * `visitor` is **not** stored in the browser. It is a hash the server computes on each
 * request from a rotating daily salt, the caller's IP and their user agent — and the IP
 * itself is never written down. Two consequences, both deliberate:
 *
 * - The same person is one visitor within a day and a different one tomorrow. Daily
 *   uniques are exact; "returning visitors" is not a question this table can answer, and
 *   that is the price of not tracking anybody across time.
 * - There is no identifier on the device, so nothing here needs a consent banner under the
 *   DPDP Act, and a visitor who clears nothing is still not followed.
 *
 * The salt must rotate daily and must never be written next to these rows — a stored salt
 * plus a stored hash is a stored IP with extra steps.
 *
 * ## Raw rows, aggregated on read
 *
 * No rollup tables. At the volume a marketing site produces, `count(*) group by day` over
 * an indexed column answers in milliseconds, and a rollup is a second copy of the truth
 * that silently disagrees with the first the day a backfill goes wrong. When this table
 * gets big enough to hurt, the fix is to delete old rows, not to summarise them.
 */
export const analyticsEvents = pgTable(
  "analytics_event",
  {
    id: text().primaryKey(),

    /** pageview · click · submit · scroll · exit. One word, lower case. */
    name: text().notNull(),

    /** Daily, salted, IP-derived. Unique visitors per day, and nothing more. */
    visitor: text().notNull(),

    /** Path only — never the query string, which is where personal data ends up. */
    path: text().notNull(),
    /** Hostname of the referrer, not the full URL. Enough to know where traffic came from. */
    referrerHost: text(),

    utmSource: text(),
    utmMedium: text(),
    utmCampaign: text(),

    /** mobile · tablet · desktop, from the user agent. */
    device: text(),
    browser: text(),
    os: text(),

    /** What was clicked, how far they scrolled, how long the page was open. */
    props: jsonb(),
    /** Milliseconds the page was open, on `exit` only. */
    durationMs: integer(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Every dashboard query is "this event, over this window", so the index leads with
    // time and the name comes second.
    index("analytics_time_idx").on(t.createdAt),
    index("analytics_name_time_idx").on(t.name, t.createdAt),
    index("analytics_path_time_idx").on(t.path, t.createdAt),
    // Unique visitors per day is `count(distinct visitor)` inside a window.
    index("analytics_visitor_idx").on(t.visitor, t.createdAt),
  ],
);

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;

/**
 * The rotating salt, so every process computes the same visitor hash for the same day.
 *
 * One row per day, created by whichever request gets there first. Yesterday's rows are
 * deleted rather than kept: a salt that still exists is a salt that can still be used to
 * reverse the hashes, which is the entire thing this design is avoiding.
 */
export const analyticsSalts = pgTable("analytics_salt", {
  /** The UTC date, as `YYYY-MM-DD`. Primary key, so the insert is `on conflict do nothing`. */
  day: text().primaryKey(),
  salt: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
