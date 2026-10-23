import { newId, schema } from "@traiv/db";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { type Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetPhones } from "../../test-support/reset.js";

/**
 * The coach's roster.
 *
 * The signals the filter chips count are correlated subqueries over `training_session`
 * with raw intervals in them — the kind of SQL that typechecks, runs, and quietly counts
 * the wrong thing. So each chip is asserted against a client built to match exactly one
 * of them, rather than against a shape.
 */

const COACH = "+918600000311";
const OTHER = "+918600000312";

let api: TestServer;
let coach: Agent;
let stranger: Agent;
let studioId: string;
let otherStudioId: string;
let coachMembershipId: string;
let otherMembershipId: string;

const ids = { fresh: "", stale: "", ending: "", paused: "", ended: "" };
let tagId = "";

async function membershipFor(userId: string, studio: string) {
  const [row] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(and(eq(schema.memberships.userId, userId), eq(schema.memberships.studioId, studio)))
    .limit(1);
  if (!row) throw new Error("signup did not create a membership");
  return row.id;
}

/** Days ago, as a timestamp the SQL intervals will compare against. */
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

async function addClient(name: string, over: Partial<typeof schema.clients.$inferInsert> = {}) {
  const id = newId();
  // `coachId` is NOT NULL — a client row without a coach is not a coaching relationship.
  await db
    .insert(schema.clients)
    .values({ id, studioId, coachId: coachMembershipId, name, ...over });
  return id;
}

async function logSession(clientId: string, completedAt: Date) {
  await db.insert(schema.sessions_).values({
    id: newId(),
    clientId,
    date: completedAt.toISOString().slice(0, 10),
    completedAt,
  });
}

beforeAll(async () => {
  api = await startApi();
  await resetPhones([COACH, OTHER]);

  const signedUp = await signUpOverHttp(api.url, COACH, "Roster Coach");
  coach = signedUp.agent;
  const them = await signUpOverHttp(api.url, OTHER, "Someone Else");
  stranger = them.agent;

  const mine = (await coach.get("/studios")).body as { studios: { id: string }[] };
  const theirs = (await stranger.get("/studios")).body as { studios: { id: string }[] };
  const first = mine.studios[0];
  const firstOther = theirs.studios[0];
  if (!first || !firstOther) throw new Error("signup did not create a studio");
  studioId = first.id;
  otherStudioId = firstOther.id;

  // `client.coach_id` references `membership.id`, not `user.id` — the coach is a role in
  // a studio, not a person in the abstract.
  coachMembershipId = await membershipFor(signedUp.userId, studioId);
  otherMembershipId = await membershipFor(them.userId, otherStudioId);

  // One client per signal, so a chip counting 1 means it counted the right row.
  ids.fresh = await addClient("Fresh Session");
  await logSession(ids.fresh, daysAgo(2));

  ids.stale = await addClient("Stale Session");
  await logSession(ids.stale, daysAgo(40));

  ids.ending = await addClient("Ending Soon", { endsAt: daysAgo(-10) });
  await logSession(ids.ending, daysAgo(1));

  ids.paused = await addClient("On Hold", { status: "paused" });
  ids.ended = await addClient("All Done", { status: "archived" });
});

afterAll(async () => {
  await db.delete(schema.clients).where(eq(schema.clients.studioId, studioId));
  await resetPhones([COACH, OTHER]);
  await api.close();
});

const roster = (q = "") => coach.get(`/studios/${studioId}/clients${q}`);

type Roster = {
  clients: { id: string; name: string; tags: { id: string; name: string; color: string }[] }[];
  total: number;
  statuses: Record<string, number>;
  filters: Record<string, number>;
};

const body = (res: { body: Record<string, unknown> }) => res.body as unknown as Roster;

type Client = { id: string; status: string; endsAt: string | null };
const client = (res: { body: Record<string, unknown> }) =>
  (res.body as unknown as { client: Client }).client;
type TagBody = { tag: { id: string; color: string } };
const tag = (res: { body: Record<string, unknown> }) => (res.body as unknown as TagBody).tag;
type Tags = { tags: { id: string; name: string; color: string }[] };
const tagsOf = (res: { body: Record<string, unknown> }) => (res.body as unknown as Tags).tags;

describe("the roster", () => {
  it("is scoped to the studio in the path, not the session", async () => {
    expect((await coach.get(`/studios/${otherStudioId}/clients`)).status).toBe(403);
    expect((await stranger.get(`/studios/${studioId}/clients`)).status).toBe(403);
  });

  it("counts every tab in one pass", async () => {
    const res = await roster();
    expect(res.status).toBe(200);
    // Three active (fresh, stale, ending) plus one paused and one ended.
    expect(body(res).statuses).toEqual({ active: 3, paused: 1, archived: 1 });
  });

  it("shows only the tab asked for", async () => {
    const names = (b: unknown) => (b as Roster).clients.map((c) => c.name);
    expect(names((await roster("?status=paused")).body)).toEqual(["On Hold"]);
    expect(names((await roster("?status=archived")).body)).toEqual(["All Done"]);
  });

  it("counts each chip against the right client", async () => {
    const { filters } = body(await roster());
    expect(filters.all).toBe(3);
    // Fresh and ending both logged within the week; stale did not.
    expect(filters["new-checkin"]).toBe(2);
    // Only the one whose last session is 40 days old.
    expect(filters["missing-checkin"]).toBe(1);
    expect(filters["ending-soon"]).toBe(1);
    // There is no messages table yet, so this is zero rather than wrong.
    expect(filters.unread).toBe(0);
  });

  it("filters to exactly what the chip counted", async () => {
    const missing = body(await roster("?filter=missing-checkin"));
    expect(missing.clients.map((c) => c.name)).toEqual(["Stale Session"]);

    const ending = body(await roster("?filter=ending-soon"));
    expect(ending.clients.map((c) => c.name)).toEqual(["Ending Soon"]);
  });

  it("treats a client who has never logged a session as missing, not as fresh", async () => {
    const id = await addClient("Never Started");
    const missing = body(await roster("?filter=missing-checkin"));
    expect(missing.clients.map((c: { name: string }) => c.name)).toContain("Never Started");
    await db.delete(schema.clients).where(eq(schema.clients.id, id));
  });

  it("carries each client's last session on the row, not only in the counts", async () => {
    // Regression. `${schema.clients.id}` interpolates *unqualified* into a `sql`
    // template, so inside the correlated subquery it resolved to `training_session.id`
    // and every row came back as never having trained — while the chip counts, built
    // from the same fragment, were right. It typechecks and it runs.
    const rows = body(await roster()).clients as unknown as {
      name: string;
      lastSessionAt: string | null;
    }[];

    const fresh = rows.find((c) => c.name === "Fresh Session");
    expect(fresh?.lastSessionAt).not.toBeNull();
    expect(rows.find((c) => c.name === "Stale Session")?.lastSessionAt).not.toBeNull();
  });

  it("searches by name, case-insensitively", async () => {
    const res = await roster("?search=stale");
    expect(body(res).clients.map((c) => c.name)).toEqual(["Stale Session"]);
  });

  it("pages, and reports the total for the filter rather than the page", async () => {
    const res = await roster("?perPage=2");
    expect(body(res).clients).toHaveLength(2);
    expect(body(res).total).toBe(3);
  });
});

describe("changing a client", () => {
  it("pauses and resumes", async () => {
    const paused = await coach.patch(`/studios/${studioId}/clients/${ids.fresh}`, {
      status: "paused",
    });
    expect(client(paused).status).toBe("paused");

    await coach.patch(`/studios/${studioId}/clients/${ids.fresh}`, { status: "active" });
    expect(body(await roster()).statuses.active).toBe(3);
  });

  it("sets and clears the end date", async () => {
    const when = "2027-01-31T00:00:00.000Z";
    const set = await coach.patch(`/studios/${studioId}/clients/${ids.stale}`, { endsAt: when });
    expect(new Date(client(set).endsAt as string).toISOString()).toBe(when);

    // Null is a value here, not an omission — clearing a date is a thing a coach does.
    const cleared = await coach.patch(`/studios/${studioId}/clients/${ids.stale}`, {
      endsAt: null,
    });
    expect(client(cleared).endsAt).toBeNull();
  });

  it("will not touch a client belonging to another studio", async () => {
    const theirs = newId();
    await db
      .insert(schema.clients)
      .values({ id: theirs, studioId: otherStudioId, coachId: otherMembershipId, name: "Theirs" });

    // 404, not 403: the coach is allowed in this studio, there is simply no such client
    // in it. Answering 403 would confirm the id exists somewhere.
    const res = await coach.patch(`/studios/${studioId}/clients/${theirs}`, { status: "paused" });
    expect(res.status).toBe(404);

    const [still] = await db.select().from(schema.clients).where(eq(schema.clients.id, theirs));
    expect(still?.status).toBe("active");
    await db.delete(schema.clients).where(eq(schema.clients.id, theirs));
  });
});

describe("tags", () => {
  it("creates one, and refuses a duplicate whatever the casing", async () => {
    const made = await coach.post(`/studios/${studioId}/tags`, {
      name: "Weight loss",
      color: "#EF4444",
      description: "Cutting",
    });
    expect(made.status).toBe(201);
    expect(tag(made).color).toBe("#ef4444");
    tagId = tag(made).id;

    const again = await coach.post(`/studios/${studioId}/tags`, {
      name: "  weight LOSS ",
      color: "#3b82f6",
    });
    expect(again.status).toBe(400);
    expect(again.body.error).toBe("tag_exists");
  });

  it("refuses a colour that is not a hex value", async () => {
    const res = await coach.post(`/studios/${studioId}/tags`, { name: "Nope", color: "red" });
    expect(res.status).toBe(400);
  });

  it("assigns tags as a whole set, so a repeat does not duplicate them", async () => {
    const url = `/studios/${studioId}/clients/${ids.fresh}/tags`;
    const first = await coach.request("PUT", url, { tagIds: [tagId] });
    expect(tagsOf(first)).toHaveLength(1);

    const again = await coach.request("PUT", url, { tagIds: [tagId] });
    expect(tagsOf(again)).toHaveLength(1);

    const rows = await db
      .select()
      .from(schema.clientTags)
      .where(eq(schema.clientTags.clientId, ids.fresh));
    expect(rows).toHaveLength(1);
  });

  it("carries the tags back on the roster row", async () => {
    const row = body(await roster()).clients.find((c) => c.id === ids.fresh);
    expect(row?.tags).toEqual([{ id: tagId, name: "Weight loss", color: "#ef4444" }]);
  });

  it("clears them when sent an empty set", async () => {
    const res = await coach.request("PUT", `/studios/${studioId}/clients/${ids.fresh}/tags`, {
      tagIds: [],
    });
    expect(tagsOf(res)).toEqual([]);
  });

  it("refuses a tag belonging to another studio", async () => {
    const theirs = await stranger.post(`/studios/${otherStudioId}/tags`, {
      name: "Theirs",
      color: "#10b981",
    });

    const res = await coach.request("PUT", `/studios/${studioId}/clients/${ids.fresh}/tags`, {
      tagIds: [tag(theirs).id],
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("unknown_tag");
  });

  it("deletes a tag and takes it off everybody", async () => {
    await coach.request("PUT", `/studios/${studioId}/clients/${ids.fresh}/tags`, {
      tagIds: [tagId],
    });
    expect((await coach.request("DELETE", `/studios/${studioId}/tags/${tagId}`)).status).toBe(204);

    const rows = await db
      .select()
      .from(schema.clientTags)
      .where(inArray(schema.clientTags.clientId, [ids.fresh]));
    expect(rows).toEqual([]);
  });
});

describe("one client", () => {
  type Profile = {
    id: string;
    name: string;
    status: string;
    hasAccount: boolean;
    coachName: string | null;
    tags: { id: string; name: string }[];
    intake: { heightCm: number | null; birthYear: number | null } | null;
    weightKg: number | null;
    lastSessionAt: string | null;
    lastSeenAt: string | null;
  };
  const profile = (res: { body: Record<string, unknown> }) =>
    (res.body as unknown as { client: Profile }).client;

  it("carries who they are and who coaches them", async () => {
    const res = await coach.get(`/studios/${studioId}/clients/${ids.fresh}`);
    expect(res.status).toBe(200);

    const p = profile(res);
    expect(p.id).toBe(ids.fresh);
    expect(p.coachName).toBeTruthy();
    expect(p.lastSessionAt).not.toBeNull();
  });

  /**
   * The whole point of `hasAccount`. Age, sex, height and weight hang off `users.id`,
   * and a client the coach typed in has no user row — so the screen must be told that
   * rather than left to infer it from four nulls that could equally mean "not answered".
   */
  it("says so when the client has never signed in, instead of inventing blanks", async () => {
    const p = profile(await coach.get(`/studios/${studioId}/clients/${ids.fresh}`));
    expect(p.hasAccount).toBe(false);
    expect(p.intake).toBeNull();
    expect(p.weightKg).toBeNull();
    expect(p.lastSeenAt).toBeNull();
  });

  it("carries the intake and the latest weight once there is an account", async () => {
    const userId = newId();
    await db.insert(schema.users).values({ id: userId, name: "Linked", phone: "+918600000399" });
    await db.insert(schema.userIntakes).values({
      id: newId(),
      userId,
      sex: "female",
      birthYear: 1998,
      heightCm: 164,
    });
    // Two rows, so "latest" has to mean latest rather than whichever came back first.
    await db.insert(schema.bodyMetrics).values([
      { id: newId(), userId, weightKg: 70, source: "intake", takenAt: daysAgo(30) },
      { id: newId(), userId, weightKg: 67.5, source: "check_in", takenAt: daysAgo(1) },
    ]);
    await db.update(schema.clients).set({ userId }).where(eq(schema.clients.id, ids.paused));

    const p = profile(await coach.get(`/studios/${studioId}/clients/${ids.paused}`));
    expect(p.hasAccount).toBe(true);
    expect(p.intake?.heightCm).toBe(164);
    expect(p.intake?.birthYear).toBe(1998);
    expect(p.weightKg).toBe(67.5);

    await db.update(schema.clients).set({ userId: null }).where(eq(schema.clients.id, ids.paused));
    await db.delete(schema.users).where(eq(schema.users.id, userId));
  });

  it("will not read a client belonging to another studio", async () => {
    const theirs = newId();
    await db
      .insert(schema.clients)
      .values({ id: theirs, studioId: otherStudioId, coachId: otherMembershipId, name: "Theirs" });

    // 404 rather than 403, for the same reason the PATCH does: the coach is allowed in
    // this studio, there is simply no such client in it. A 403 would confirm the id is
    // real somewhere else.
    expect((await coach.get(`/studios/${studioId}/clients/${theirs}`)).status).toBe(404);
    await db.delete(schema.clients).where(eq(schema.clients.id, theirs));
  });

  it("is refused outright in a studio the coach is not a member of", async () => {
    expect((await coach.get(`/studios/${otherStudioId}/clients/${ids.fresh}`)).status).toBe(403);
  });
});
