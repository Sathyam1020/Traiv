import { newId, schema } from "@traiv/db";
import { desc, eq, sql } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import { isUniqueViolation } from "../../lib/db-errors.js";
import { requireAdmin } from "../../middleware/admin.js";

/**
 * Everything the admin app reads and writes about the marketing site.
 *
 * Mounted under `/admin`, so every route here is behind `requireAdmin` — the single
 * administrator named by `ADMIN_PHONE`, and no endpoint anywhere grants that role.
 */
export const marketingAdmin: Router = Router();

marketingAdmin.use(requireAdmin());

/* -------------------------------------------------------------------------- */
/* Analytics                                                                   */
/* -------------------------------------------------------------------------- */

const range = z.object({ days: z.coerce.number().int().min(1).max(365).default(30) });

/**
 * The dashboard, in one request.
 *
 * Seven aggregates rather than seven endpoints, because they are always read together and
 * a dashboard that paints in seven stages looks broken. All of them are plain SQL over one
 * indexed table — no rollups, no cache, nothing that can disagree with the rows.
 *
 * Written as raw SQL rather than the query builder on purpose: an interpolated Drizzle
 * column renders *unqualified* inside a `sql` template, which is invisible until a join
 * makes it ambiguous. Explicit column names cannot drift that way.
 */
marketingAdmin.get("/analytics", async (req, res) => {
  const { days } = range.parse(req.query);
  const since = sql.raw(`now() - interval '${days} days'`);

  const [totals, series, paths, referrers, devices, browsers, clicks, sources, funnel] =
    await Promise.all([
      db.execute(sql`
        select
          count(*) filter (where name = 'pageview')::int as pageviews,
          count(distinct visitor)::int                   as visitors,
          count(*)::int                                   as events,
          coalesce(avg(duration_ms) filter (where name = 'exit' and duration_ms > 0), 0)::int
            as avg_ms
        from analytics_event
        where created_at >= ${since}
      `),

      db.execute(sql`
        select
          to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
          count(*) filter (where name = 'pageview')::int        as pageviews,
          count(distinct visitor)::int                          as visitors
        from analytics_event
        where created_at >= ${since}
        group by 1
        order by 1
      `),

      db.execute(sql`
        select path,
               count(*) filter (where name = 'pageview')::int as views,
               count(distinct visitor)::int                   as visitors
        from analytics_event
        where created_at >= ${since} and name = 'pageview'
        group by 1
        order by views desc
        limit 20
      `),

      db.execute(sql`
        select coalesce(referrer_host, 'Direct / none') as source,
               count(distinct visitor)::int             as visitors
        from analytics_event
        where created_at >= ${since} and name = 'pageview'
        group by 1
        order by visitors desc
        limit 15
      `),

      db.execute(sql`
        select coalesce(device, 'unknown') as label, count(distinct visitor)::int as visitors
        from analytics_event
        where created_at >= ${since}
        group by 1
        order by visitors desc
      `),

      db.execute(sql`
        select coalesce(browser, 'unknown') as label, count(distinct visitor)::int as visitors
        from analytics_event
        where created_at >= ${since}
        group by 1
        order by visitors desc
        limit 8
      `),

      // What people actually press. `props->>'label'` is set by the tracker on the site.
      db.execute(sql`
        select coalesce(props->>'label', '(unlabelled)') as label,
               coalesce(props->>'source', '')            as place,
               count(*)::int                             as clicks
        from analytics_event
        where created_at >= ${since} and name = 'click'
        group by 1, 2
        order by clicks desc
        limit 20
      `),

      db.execute(sql`
        select coalesce(utm_source, '(none)') as utm_source,
               coalesce(utm_medium, '')        as utm_medium,
               coalesce(utm_campaign, '')      as utm_campaign,
               count(distinct visitor)::int    as visitors
        from analytics_event
        where created_at >= ${since} and utm_source is not null
        group by 1, 2, 3
        order by visitors desc
        limit 15
      `),

      // The only funnel that matters right now: saw a page, opened the form, finished it.
      db.execute(sql`
        select
          count(distinct visitor) filter (where name = 'pageview')::int as saw,
          count(distinct visitor) filter (
            where name = 'click' and props->>'label' is not null
          )::int as clicked,
          count(distinct visitor) filter (where name = 'submit')::int as submitted
        from analytics_event
        where created_at >= ${since}
      `),
    ]);

  const [waitlistTotals] = (
    await db.execute(sql`
      select
        count(*)::int                                            as total,
        count(*) filter (where created_at >= ${since})::int       as recent,
        count(*) filter (where announcements)::int                as consented,
        count(*) filter (where email is not null)::int            as with_email,
        count(*) filter (where phone is not null)::int            as with_phone
      from waitlist
    `)
  ).rows;

  res.json({
    days,
    totals: totals.rows[0] ?? {},
    funnel: funnel.rows[0] ?? {},
    waitlist: waitlistTotals ?? {},
    series: series.rows,
    paths: paths.rows,
    referrers: referrers.rows,
    devices: devices.rows,
    browsers: browsers.rows,
    clicks: clicks.rows,
    campaigns: sources.rows,
  });
});

/* -------------------------------------------------------------------------- */
/* Waitlist                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The actual list, with contact details.
 *
 * This is the one admin surface that reads personal data, which is the whole reason it
 * exists — you cannot write to a launch list you cannot see. It is also why there is no
 * public route anywhere that returns a waitlist row.
 */
marketingAdmin.get("/waitlist", async (req, res) => {
  const { limit } = z
    .object({ limit: z.coerce.number().int().min(1).max(1000).default(200) })
    .parse(req.query);

  const rows = await db
    .select()
    .from(schema.waitlist)
    .orderBy(desc(schema.waitlist.createdAt))
    .limit(limit);

  res.json({ entries: rows });
});

/* -------------------------------------------------------------------------- */
/* Posts                                                                       */
/* -------------------------------------------------------------------------- */

/** Roughly 200 words a minute, counted from the body so it cannot drift from the text. */
function readMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lower case, numbers and single hyphens.");

const postBody = z.object({
  slug,
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(400),
  body: z.string().min(1).max(200_000),
  coverUrl: z.string().url().max(2000).nullish(),
  coverAlt: z.string().trim().max(300).nullish(),
  authorName: z.string().trim().min(1).max(80).default("Traiv"),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().trim().max(200).nullish(),
  seoDescription: z.string().trim().max(400).nullish(),
});

/** Everything, drafts included. The public route is the one that filters. */
marketingAdmin.get("/posts", async (_req, res) => {
  const rows = await db
    .select({
      id: schema.posts.id,
      slug: schema.posts.slug,
      title: schema.posts.title,
      excerpt: schema.posts.excerpt,
      status: schema.posts.status,
      authorName: schema.posts.authorName,
      readMinutes: schema.posts.readMinutes,
      publishedAt: schema.posts.publishedAt,
      updatedAt: schema.posts.updatedAt,
    })
    .from(schema.posts)
    .orderBy(desc(schema.posts.updatedAt))
    .limit(500);

  res.json({ posts: rows });
});

marketingAdmin.get("/posts/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);
  const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
  if (!post) throw notFound("No such post.");
  res.json({ post });
});

marketingAdmin.post("/posts", async (req, res) => {
  const parsed = postBody.safeParse(req.body);
  if (!parsed.success) {
    throw badRequest("invalid_post", parsed.error.issues[0]?.message ?? "Check the fields.");
  }
  const p = parsed.data;

  try {
    const [created] = await db
      .insert(schema.posts)
      .values({
        id: newId(),
        ...p,
        coverUrl: p.coverUrl ?? null,
        coverAlt: p.coverAlt ?? null,
        seoTitle: p.seoTitle ?? null,
        seoDescription: p.seoDescription ?? null,
        readMinutes: readMinutes(p.body),
        // The CHECK constraint requires these two to agree, so the date is set here
        // rather than left to whoever remembers.
        publishedAt: p.status === "published" ? new Date() : null,
      })
      .returning();

    res.status(201).json({ post: created });
  } catch (err) {
    if (isUniqueViolation(err)) throw badRequest("slug_taken", "That slug is already used.");
    throw err;
  }
});

marketingAdmin.patch("/posts/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);
  const parsed = postBody.partial().safeParse(req.body);
  if (!parsed.success) {
    throw badRequest("invalid_post", parsed.error.issues[0]?.message ?? "Check the fields.");
  }
  const p = parsed.data;

  const [current] = await db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
  if (!current) throw notFound("No such post.");

  // Publishing stamps the date; unpublishing clears it. Keeping an old date on a draft
  // would break the CHECK, and re-using it on re-publish would date the post to a day it
  // was not public.
  const status = p.status ?? current.status;
  const publishedAt = status === "published" ? (current.publishedAt ?? new Date()) : null;

  try {
    const [updated] = await db
      .update(schema.posts)
      .set({
        ...p,
        status,
        publishedAt,
        ...(p.body ? { readMinutes: readMinutes(p.body) } : {}),
      })
      .where(eq(schema.posts.id, id))
      .returning();

    res.json({ post: updated });
  } catch (err) {
    if (isUniqueViolation(err)) throw badRequest("slug_taken", "That slug is already used.");
    throw err;
  }
});

marketingAdmin.delete("/posts/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().max(64) }).parse(req.params);
  const deleted = await db.delete(schema.posts).where(eq(schema.posts.id, id)).returning();
  if (deleted.length === 0) throw notFound("No such post.");
  res.sendStatus(204);
});
