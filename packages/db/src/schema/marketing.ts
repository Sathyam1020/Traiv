import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * People who asked to be told when Traiv opens.
 *
 * Deliberately not a `user` row. Nobody here has an account, has verified anything, or
 * has agreed to our terms — they left a contact detail on a marketing page. Writing them
 * into `user` would mean every count, every auth query and every export has to learn the
 * difference between a coach and a stranger who typed an email once.
 *
 * `announcements` is a real consent flag, not decoration: under the DPDP Act the lawful
 * basis for sending them anything is this box, so it is stored as given, with the time
 * and the page it was given on. Unticked means we may answer them and nothing else.
 */
export const waitlist = pgTable(
  "waitlist",
  {
    id: text().primaryKey(),

    /** At least one of these — see the CHECK. Most people give both. */
    email: text(),
    /** E.164, normalised through @traiv/phone before it ever reaches here. */
    phone: text(),

    name: text(),

    /** Which button they pressed: signup · signin · demo · affiliate · partnership. */
    intent: text().notNull().default("signup"),
    /** Where on the site, e.g. "nav" or "pricing-card-pro". Tells us what sells. */
    source: text(),
    /** The path they were on. */
    path: text(),

    referrer: text(),
    utmSource: text(),
    utmMedium: text(),
    utmCampaign: text(),

    /** Consent to be emailed or messaged when we launch. Unticked is a real answer. */
    announcements: boolean().notNull().default(false),

    /** Set when somebody has actually been written to, so nobody is told twice. */
    notifiedAt: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // One row per person, not one per time they pressed a button. Partial, because a
    // plain unique over a nullable column would let one null-email row block the rest.
    uniqueIndex("waitlist_email_key").on(t.email).where(sql`${t.email} is not null`),
    uniqueIndex("waitlist_phone_key").on(t.phone).where(sql`${t.phone} is not null`),
    index("waitlist_created_idx").on(t.createdAt),
    check("waitlist_has_a_contact", sql`${t.email} is not null or ${t.phone} is not null`),
  ],
);

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type NewWaitlistEntry = typeof waitlist.$inferInsert;

export const postStatus = pgEnum("post_status", ["draft", "published"]);

/**
 * Blog posts, written in the admin app rather than in the repo.
 *
 * The alternative — MDX files in `apps/web/src/content` — means every typo is a commit, a
 * review and a deploy, and nobody outside this repo can ever publish. Posts are content,
 * not code, and content that needs an engineer stops being written by about week three.
 *
 * The body is Markdown, stored as typed. Rendering happens on the marketing site, where a
 * post is a static page revalidated on a timer — so publishing is a database write and the
 * public page catches up on its own, with no build and no deploy.
 */
export const posts = pgTable(
  "post",
  {
    id: text().primaryKey(),
    slug: text().notNull(),

    title: text().notNull(),
    /** The index card and the meta description. */
    excerpt: text().notNull(),
    /** Markdown. */
    body: text().notNull(),

    coverUrl: text(),
    coverAlt: text(),

    authorName: text().notNull().default("Traiv"),
    /** Counted from the body on save, so it cannot drift from what is actually there. */
    readMinutes: integer().notNull().default(1),

    status: postStatus().notNull().default("draft"),
    /** Null until first published. Kept when unpublished, so re-publishing is honest. */
    publishedAt: timestamp({ withTimezone: true }),

    /** Overrides for the two tags that matter. Both fall back to title and excerpt. */
    seoTitle: text(),
    seoDescription: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("post_slug_key").on(t.slug),
    // The public query: published, newest first.
    index("post_published_idx").on(t.publishedAt).where(sql`${t.status} = 'published'`),
    // A published post has a date and a draft does not. Without this the index above
    // silently skips posts and the blog loses pages nobody notices are missing.
    check(
      "post_published_has_a_date",
      sql`(${t.status} = 'published') = (${t.publishedAt} is not null)`,
    ),
    check("post_slug_shape", sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
  ],
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
