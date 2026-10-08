import { schema } from "@traiv/db";
import { eq, inArray, like, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetPhones } from "../../test-support/reset.js";

/**
 * The public marketing API.
 *
 * These three routes are the only unauthenticated writes in the whole system, which is
 * why they get a test each rather than a smoke test between them. The things that would
 * actually hurt are all here: a duplicate person becoming two launch-list rows, a second
 * submission wiping the phone number from the first, a draft post being readable by slug,
 * and a query string carrying personal data into the analytics table.
 */

let api: TestServer;
let anon: Agent;

const EMAIL = "waitlist-test@example.com";
const EMAIL_2 = "waitlist-test-2@example.com";
const PHONE_IN = "9876500011";
const PHONE_E164 = "+919876500011";
const SLUG = "marketing-test-post";
const PATH = "/__marketing-test";
const COACH_PHONE = "+919876500012";

async function countAt(path: string): Promise<number> {
  // `db.execute` hands back a pg QueryResult, not an array — the rows are on `.rows`.
  const rows = (
    await db.execute(sql`select count(*)::int as n from analytics_event where path = ${path}`)
  ).rows as { n: number }[];
  return rows[0]?.n ?? 0;
}

async function cleanUp() {
  await db.delete(schema.waitlist).where(inArray(schema.waitlist.email, [EMAIL, EMAIL_2]));
  await db.delete(schema.waitlist).where(eq(schema.waitlist.phone, PHONE_E164));
  await db.delete(schema.posts).where(like(schema.posts.slug, "marketing-test-%"));
  await db
    .delete(schema.analyticsEvents)
    .where(like(schema.analyticsEvents.path, "/__marketing-test%"));
  await resetPhones([COACH_PHONE]);
}

beforeAll(async () => {
  api = await startApi();
  anon = new Agent(api.url);
  await cleanUp();
});

afterAll(async () => {
  await cleanUp();
  await api.close();
});

describe("the launch list", () => {
  it("refuses a submission with neither an email nor a phone", async () => {
    const res = await anon.post("/m/waitlist", { announcements: true });
    expect(res.status).toBe(400);
  });

  it("refuses a phone number that is not a real one", async () => {
    const res = await anon.post("/m/waitlist", { phone: "12345" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_phone");
  });

  it("stores an entry, normalising the phone to E.164", async () => {
    const res = await anon.post("/m/waitlist", {
      email: "  WaitList-Test@Example.com ",
      phone: PHONE_IN,
      name: "Test Coach",
      announcements: true,
      source: "pricing-card-pro",
      path: "/pricing",
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ ok: true, already: false });

    const [row] = await db.select().from(schema.waitlist).where(eq(schema.waitlist.email, EMAIL));
    // Lower-cased and trimmed by the schema, so one person cannot become two rows by
    // typing their address with a capital letter the second time.
    expect(row?.email).toBe(EMAIL);
    expect(row?.phone).toBe(PHONE_E164);
    expect(row?.announcements).toBe(true);
    expect(row?.source).toBe("pricing-card-pro");
  });

  it("is one row per person, however many buttons they press", async () => {
    const res = await anon.post("/m/waitlist", { email: EMAIL, announcements: false });
    expect(res.status).toBe(200);
    expect(res.body.already).toBe(true);

    const rows = await db.select().from(schema.waitlist).where(eq(schema.waitlist.email, EMAIL));
    expect(rows).toHaveLength(1);
    // The later answer to the consent question wins, because it is the later answer.
    expect(rows[0]?.announcements).toBe(false);
  });

  it("never clears a contact detail the second submission left blank", async () => {
    // The obvious way an upsert like this loses data: they gave a phone the first time
    // and only an email the second, and the phone quietly disappears.
    const [row] = await db.select().from(schema.waitlist).where(eq(schema.waitlist.email, EMAIL));
    expect(row?.phone).toBe(PHONE_E164);
  });

  it("recognises the same person arriving by phone after arriving by email", async () => {
    const res = await anon.post("/m/waitlist", { phone: PHONE_IN, email: EMAIL_2 });
    expect(res.status).toBe(200);
    expect(res.body.already).toBe(true);

    const all = await db
      .select()
      .from(schema.waitlist)
      .where(eq(schema.waitlist.phone, PHONE_E164));
    expect(all).toHaveLength(1);
  });
});

describe("the analytics beacon", () => {
  it("answers 204 to a body it cannot read, rather than teaching a caller the shape", async () => {
    const res = await anon.post("/m/collect", { nope: true });
    expect(res.status).toBe(204);
  });

  it("records an event without storing anything about who sent it", async () => {
    const res = await anon.post("/m/collect", {
      events: [{ name: "pageview", path: PATH, referrer: "https://news.ycombinator.com/item" }],
    });
    expect(res.status).toBe(204);

    const [row] = await db
      .select()
      .from(schema.analyticsEvents)
      .where(eq(schema.analyticsEvents.path, PATH));

    expect(row?.name).toBe("pageview");
    // Hostname only — a full referrer URL is where somebody else's query string lives.
    expect(row?.referrerHost).toBe("news.ycombinator.com");
    // A 32-character hash, not an address. There is no column that could hold one.
    expect(row?.visitor).toMatch(/^[0-9a-f]{32}$/);
  });

  it("drops the query string before the path is ever written", async () => {
    await anon.post("/m/collect", {
      events: [{ name: "pageview", path: `${PATH}/q?email=someone@example.com&utm_source=x` }],
    });

    const rows = await db
      .select({ path: schema.analyticsEvents.path })
      .from(schema.analyticsEvents)
      .where(like(schema.analyticsEvents.path, `${PATH}/q%`));

    expect(rows).toHaveLength(1);
    expect(rows[0]?.path).toBe(`${PATH}/q`);
  });

  it("takes a batch, because the page sends on unload", async () => {
    const res = await anon.post("/m/collect", {
      events: [
        { name: "click", path: `${PATH}/b`, props: { label: "Start free", source: "hero" } },
        { name: "scroll", path: `${PATH}/b`, props: { depth: 75 } },
        { name: "exit", path: `${PATH}/b`, durationMs: 12_000 },
      ],
    });
    expect(res.status).toBe(204);

    expect(await countAt(`${PATH}/b`)).toBe(3);
  });

  it("refuses an unbounded batch", async () => {
    const events = Array.from({ length: 40 }, () => ({ name: "pageview", path: `${PATH}/flood` }));
    await anon.post("/m/collect", { events });

    expect(await countAt(`${PATH}/flood`)).toBe(0);
  });
});

describe("the blog", () => {
  it("does not serve a draft, even to someone who knows the slug", async () => {
    await db.insert(schema.posts).values({
      id: crypto.randomUUID(),
      slug: SLUG,
      title: "Draft",
      excerpt: "Not published",
      body: "Hidden",
      status: "draft",
    });

    const res = await anon.get(`/m/blog/${SLUG}`);
    // 404 rather than 403, so an unpublished slug cannot be discovered by guessing.
    expect(res.status).toBe(404);

    const index = await anon.get("/m/blog");
    const slugs = (index.body.posts as { slug: string }[]).map((p) => p.slug);
    expect(slugs).not.toContain(SLUG);
  });

  it("serves it once it is published", async () => {
    await db
      .update(schema.posts)
      .set({ status: "published", publishedAt: new Date() })
      .where(eq(schema.posts.slug, SLUG));

    const res = await anon.get(`/m/blog/${SLUG}`);
    expect(res.status).toBe(200);
    expect((res.body.post as { title: string }).title).toBe("Draft");
  });
});

describe("the admin surface", () => {
  const ADMIN_PATHS = ["/admin/analytics", "/admin/waitlist", "/admin/posts"];

  it("turns a stranger away before it reads anything", async () => {
    // 401, not 403: nobody is signed in, so the session gate answers first. The
    // distinction matters because the next test is the one that proves a *signed-in*
    // person who is not the admin is also refused.
    for (const path of ADMIN_PATHS) {
      expect((await anon.get(path)).status).toBe(401);
    }
    expect((await anon.post("/admin/posts", { slug: "x" })).status).toBe(401);
    expect((await anon.request("DELETE", "/admin/posts/whatever")).status).toBe(401);
  });

  it("refuses a signed-in coach who is not the administrator", async () => {
    const { agent: coach } = await signUpOverHttp(api.url, COACH_PHONE, "Not The Admin");

    for (const path of ADMIN_PATHS) {
      expect((await coach.get(path)).status).toBe(403);
    }
    // Writes too — a read-only check here would miss the route that actually matters.
    expect((await coach.post("/admin/posts", { slug: "nope" })).status).toBe(403);
    expect((await coach.request("DELETE", "/admin/posts/whatever")).status).toBe(403);
  });
});
