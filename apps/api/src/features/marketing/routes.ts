import { newId, schema } from "@traiv/db";
import { parsePhone } from "@traiv/phone";
import { and, desc, eq, isNotNull, or } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";
import { parseAgent, referrerHost, visitorId } from "./visitor.js";

/**
 * The public marketing API.
 *
 * Every route here is unauthenticated by design — it is called by a static site that has
 * no session and no user. That makes the validation on each one the only thing standing
 * between us and a junk table, so none of it is optional.
 */
export const marketing: Router = Router();

/* -------------------------------------------------------------------------- */
/* Waitlist                                                                    */
/* -------------------------------------------------------------------------- */

const waitlistBody = z.object({
  // Both optional in the schema and at least one required below, because "give me an
  // email or a phone" is not something zod expresses without making one field lie.
  email: z.string().trim().toLowerCase().email().max(254).optional().or(z.literal("")),
  phone: z.string().trim().max(24).optional().or(z.literal("")),
  name: z.string().trim().max(80).optional(),
  intent: z.enum(["signup", "signin", "demo", "affiliate", "partnership"]).default("signup"),
  source: z.string().trim().max(60).optional(),
  path: z.string().trim().max(200).optional(),
  announcements: z.boolean().default(false),
  utmSource: z.string().trim().max(80).optional(),
  utmMedium: z.string().trim().max(80).optional(),
  utmCampaign: z.string().trim().max(80).optional(),
});

/**
 * Join the launch list.
 *
 * Idempotent on purpose: someone who presses "Start free" on three different pages is one
 * person, not three rows. A second submission updates what we know about them — the later
 * consent wins, and a blank second submission never clears a contact detail we already
 * have, which is the obvious way an upsert like this loses data.
 */
marketing.post("/waitlist", async (req, res) => {
  const parsed = waitlistBody.safeParse(req.body);
  if (!parsed.success) throw badRequest("invalid_waitlist", "Check the form and try again.");
  const body = parsed.data;

  const email = body.email ? body.email : null;

  // Through the same parser the product uses, so a number stored here is the same shape
  // as the one that will exist on their account when they do sign up.
  let phone: string | null = null;
  if (body.phone) {
    const result = parsePhone(body.phone);
    if (!result.ok) throw badRequest("invalid_phone", "That phone number does not look right.");
    phone = result.e164;
  }

  if (!email && !phone) {
    throw badRequest("no_contact", "Add an email address or a phone number.");
  }

  const referrer = typeof req.headers.referer === "string" ? req.headers.referer : null;

  // Look for an existing row on either contact detail before writing, so the same person
  // arriving once by email and once by phone does not become two rows.
  const [existing] = await db
    .select({ id: schema.waitlist.id })
    .from(schema.waitlist)
    .where(
      or(
        email ? eq(schema.waitlist.email, email) : undefined,
        phone ? eq(schema.waitlist.phone, phone) : undefined,
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(schema.waitlist)
      .set({
        // Only ever fills a gap. A second visit with the email box blank must not wipe
        // the address they gave us the first time.
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        ...(body.name ? { name: body.name } : {}),
        announcements: body.announcements,
        intent: body.intent,
        ...(body.source ? { source: body.source } : {}),
        ...(body.path ? { path: body.path } : {}),
      })
      .where(eq(schema.waitlist.id, existing.id));

    res.status(200).json({ ok: true, already: true });
    return;
  }

  await db.insert(schema.waitlist).values({
    id: newId(),
    email,
    phone,
    name: body.name ?? null,
    intent: body.intent,
    source: body.source ?? null,
    path: body.path ?? null,
    referrer,
    utmSource: body.utmSource ?? null,
    utmMedium: body.utmMedium ?? null,
    utmCampaign: body.utmCampaign ?? null,
    announcements: body.announcements,
  });

  res.status(201).json({ ok: true, already: false });
});

/* -------------------------------------------------------------------------- */
/* Analytics ingest                                                            */
/* -------------------------------------------------------------------------- */

const event = z.object({
  name: z.enum(["pageview", "click", "submit", "scroll", "exit"]),
  // Path only. The browser strips the query string before it gets here, and this strips
  // it again, because the one time it does not is the time somebody puts an email in it.
  path: z
    .string()
    .trim()
    .max(200)
    .transform((p) => (p.split(/[?#]/)[0] || "/").slice(0, 200)),
  referrer: z.string().trim().max(500).optional(),
  utmSource: z.string().trim().max(80).optional(),
  utmMedium: z.string().trim().max(80).optional(),
  utmCampaign: z.string().trim().max(80).optional(),
  props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  durationMs: z.number().int().min(0).max(86_400_000).optional(),
});

/**
 * One request, up to twenty events.
 *
 * Batched because the page sends on unload as well as on navigation, and a `sendBeacon`
 * per click is a request the browser may not finish. Twenty is a cap rather than a
 * target — it is there so a malformed or malicious caller cannot post a megabyte.
 *
 * Always 204, even when the body is nonsense. This endpoint is called from a page the
 * visitor is often leaving; there is nobody to show an error to, and answering 400 only
 * teaches a scraper what shape to send next.
 */
marketing.post("/collect", async (req, res) => {
  const agent = parseAgent(req.headers["user-agent"]);
  // Bots are most of the traffic to a public site and none of the signal. Dropped at the
  // door rather than filtered in every query afterwards.
  if (agent.bot) {
    res.sendStatus(204);
    return;
  }

  const parsed = z.object({ events: z.array(event).min(1).max(20) }).safeParse(req.body);
  if (!parsed.success) {
    res.sendStatus(204);
    return;
  }

  const visitor = await visitorId(req);
  const ownHost = (() => {
    try {
      return req.headers.origin ? new URL(req.headers.origin).hostname : undefined;
    } catch {
      return undefined;
    }
  })();

  await db.insert(schema.analyticsEvents).values(
    parsed.data.events.map((e) => ({
      id: newId(),
      name: e.name,
      visitor,
      path: e.path,
      referrerHost: referrerHost(e.referrer, ownHost),
      utmSource: e.utmSource ?? null,
      utmMedium: e.utmMedium ?? null,
      utmCampaign: e.utmCampaign ?? null,
      device: agent.device,
      browser: agent.browser,
      os: agent.os,
      props: e.props ?? null,
      durationMs: e.durationMs ?? null,
    })),
  );

  res.sendStatus(204);
});

/* -------------------------------------------------------------------------- */
/* Blog, public                                                                */
/* -------------------------------------------------------------------------- */

const publishedOnly = and(
  eq(schema.posts.status, "published"),
  isNotNull(schema.posts.publishedAt),
);

/** The index. Bodies are left out — a list page that ships every post's Markdown is slow. */
marketing.get("/blog", async (_req, res) => {
  const rows = await db
    .select({
      slug: schema.posts.slug,
      title: schema.posts.title,
      excerpt: schema.posts.excerpt,
      coverUrl: schema.posts.coverUrl,
      coverAlt: schema.posts.coverAlt,
      authorName: schema.posts.authorName,
      readMinutes: schema.posts.readMinutes,
      publishedAt: schema.posts.publishedAt,
    })
    .from(schema.posts)
    .where(publishedOnly)
    .orderBy(desc(schema.posts.publishedAt))
    .limit(200);

  res.json({ posts: rows });
});

marketing.get("/blog/:slug", async (req, res) => {
  const { slug } = z.object({ slug: z.string().max(200) }).parse(req.params);

  const [post] = await db
    .select()
    .from(schema.posts)
    .where(and(publishedOnly, eq(schema.posts.slug, slug)))
    .limit(1);

  // A draft and a post that was never written answer identically, so the slug of an
  // unpublished post cannot be discovered by guessing.
  if (!post) throw notFound("No such post.");

  res.json({ post });
});
