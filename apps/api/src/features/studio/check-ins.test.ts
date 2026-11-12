import { newId, schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { type Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetEmails } from "../../test-support/reset.js";
import {
  addDays,
  checkInState,
  checkInTrend,
  ensureCheckIns,
  nextWeekdayAfter,
  submitCheckIn,
} from "./check-ins.js";

/**
 * Check-ins.
 *
 * The four states are derived from two dates and a flag, so every boundary is tested
 * against a fixed "today" rather than the clock — a suite whose answers change at
 * midnight is a suite nobody trusts at 23:58.
 */

const COACH = "studio-checkins-coach@example.com";
let api: TestServer;
let coach: Agent;
let studioId: string;
let membershipId: string;

/** A Monday, so the weekday arithmetic is legible in the assertions below. */
const MONDAY = "2026-06-01";

beforeAll(async () => {
  api = await startApi();
  await resetEmails([COACH]);

  const up = await signUpOverHttp(api.url, COACH, "Check Coach");
  coach = up.agent;

  const mine = (await coach.get("/studios")).body as { studios: { id: string }[] };
  const first = mine.studios[0];
  if (!first) throw new Error("signup did not create a studio");
  studioId = first.id;

  const [m] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(eq(schema.memberships.studioId, studioId))
    .limit(1);
  if (!m) throw new Error("signup did not create a membership");
  membershipId = m.id;
});

afterAll(async () => {
  await resetEmails([COACH]);
  await api.close();
});

async function addClient(over: Partial<typeof schema.clients.$inferInsert> = {}) {
  const id = newId();
  await db.insert(schema.clients).values({
    id,
    studioId,
    coachId: membershipId,
    name: "Subject",
    // Joined well before the window every test uses, so scheduling has room.
    createdAt: new Date("2026-05-01T00:00:00Z"),
    ...over,
  });
  return id;
}

beforeEach(async () => {
  await db.delete(schema.clients).where(eq(schema.clients.studioId, studioId));
});

/* -------------------------------------------------------------------------- */

describe("the date helpers", () => {
  it("finds the next weekday strictly after a date", () => {
    // 2026-06-01 is a Monday. The next Monday is a week later, not the same day —
    // otherwise a client joining on a Monday gets a check-in due the instant they join.
    expect(nextWeekdayAfter(MONDAY, 1)).toBe("2026-06-08");
    expect(nextWeekdayAfter(MONDAY, 2)).toBe("2026-06-02");
    expect(nextWeekdayAfter(MONDAY, 0)).toBe("2026-06-07");
  });

  it("adds days across a month boundary", () => {
    expect(addDays("2026-06-29", 7)).toBe("2026-07-06");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("the four states", () => {
  const row = (status: "pending" | "completed") => ({
    dueOn: "2026-06-08",
    closesOn: "2026-06-15",
    status,
  });

  it("is upcoming before the due date", () => {
    expect(checkInState(row("pending"), "2026-06-07")).toBe("upcoming");
  });

  it("is overdue from the due date until the window closes, inclusive", () => {
    expect(checkInState(row("pending"), "2026-06-08")).toBe("overdue");
    expect(checkInState(row("pending"), "2026-06-14")).toBe("overdue");
    // The closing day itself still counts — a deadline nobody can use on the last day
    // is a deadline a day earlier than it says.
    expect(checkInState(row("pending"), "2026-06-15")).toBe("overdue");
  });

  it("is missed the day after the window closes", () => {
    expect(checkInState(row("pending"), "2026-06-16")).toBe("missed");
  });

  it("is completed whatever the dates say", () => {
    expect(checkInState(row("completed"), "2026-09-01")).toBe("completed");
  });
});

describe("scheduling", () => {
  it("schedules weekly on the studio's weekday, out to the horizon", async () => {
    const id = await addClient();
    await ensureCheckIns(id, MONDAY);

    const rows = await db
      .select({ dueOn: schema.checkIns.dueOn, closesOn: schema.checkIns.closesOn })
      .from(schema.checkIns)
      .where(eq(schema.checkIns.clientId, id))
      .orderBy(schema.checkIns.dueOn);

    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(new Date(`${r.dueOn}T00:00:00Z`).getUTCDay()).toBe(1);
      // Seven days of grace, the studio default.
      expect(r.closesOn).toBe(addDays(r.dueOn, 7));
    }
    // Four weeks ahead, no further. ISO dates sort lexically, so a string compare is
    // the right one here — `toBeLessThanOrEqual` only takes numbers.
    expect((rows.at(-1)?.dueOn ?? "") <= addDays(MONDAY, 28)).toBe(true);
  });

  it("is idempotent — running it again adds nothing", async () => {
    const id = await addClient();
    await ensureCheckIns(id, MONDAY);
    const first = await db.$count(schema.checkIns, eq(schema.checkIns.clientId, id));

    await ensureCheckIns(id, MONDAY);
    await ensureCheckIns(id, MONDAY);

    expect(await db.$count(schema.checkIns, eq(schema.checkIns.clientId, id))).toBe(first);
  });

  it("never schedules before the client joined", async () => {
    const id = await addClient({ createdAt: new Date("2026-06-10T00:00:00Z") });
    await ensureCheckIns(id, "2026-06-20");

    const rows = await db
      .select({ dueOn: schema.checkIns.dueOn })
      .from(schema.checkIns)
      .where(eq(schema.checkIns.clientId, id));

    // Otherwise a brand-new client opens on a wall of misses for a relationship that
    // did not exist yet.
    for (const r of rows) expect(r.dueOn >= "2026-06-10").toBe(true);
  });

  it("honours a per-client weekday over the studio's", async () => {
    const id = await addClient({ checkInWeekday: 5 });
    await ensureCheckIns(id, MONDAY);

    const rows = await db
      .select({ dueOn: schema.checkIns.dueOn })
      .from(schema.checkIns)
      .where(eq(schema.checkIns.clientId, id));

    for (const r of rows) expect(new Date(`${r.dueOn}T00:00:00Z`).getUTCDay()).toBe(5);
  });

  it("schedules nothing for a paused client, or one with check-ins off", async () => {
    const paused = await addClient({ status: "paused" });
    const off = await addClient({ checkInsEnabled: false });

    expect(await ensureCheckIns(paused, MONDAY)).toBe(0);
    expect(await ensureCheckIns(off, MONDAY)).toBe(0);
    expect(await db.$count(schema.checkIns, eq(schema.checkIns.clientId, paused))).toBe(0);
  });

  /** Decision 7: changing the cadence must not rewrite what already happened. */
  it("keeps existing check-ins when the schedule changes", async () => {
    const id = await addClient();
    await ensureCheckIns(id, MONDAY);

    const before = await db
      .select({ id: schema.checkIns.id, dueOn: schema.checkIns.dueOn })
      .from(schema.checkIns)
      .where(eq(schema.checkIns.clientId, id));

    await db
      .update(schema.clients)
      .set({ checkInWeekday: 4, checkInGraceDays: 2 })
      .where(eq(schema.clients.id, id));
    await ensureCheckIns(id, MONDAY);

    const after = await db
      .select({ id: schema.checkIns.id })
      .from(schema.checkIns)
      .where(eq(schema.checkIns.clientId, id));

    // Every original row is still there, by id.
    const kept = new Set(after.map((r) => r.id));
    for (const r of before) expect(kept.has(r.id)).toBe(true);
  });
});

describe("the trend", () => {
  /** Writes a settled history directly, so the arithmetic is unambiguous. */
  async function history(clientId: string, weeks: ("completed" | "missed")[]) {
    // Oldest first, ending TWO weeks before `MONDAY` so the last one's grace window
    // has closed. Ending one week back leaves it overdue — its window shuts exactly
    // on `MONDAY`, and overdue is deliberately not a miss.
    let due = addDays(MONDAY, -7 * (weeks.length + 1));
    for (const w of weeks) {
      await db.insert(schema.checkIns).values({
        id: newId(),
        clientId,
        dueOn: due,
        closesOn: addDays(due, 7),
        status: w === "completed" ? "completed" : "pending",
        completedAt: w === "completed" ? new Date(`${due}T10:00:00Z`) : null,
      });
      due = addDays(due, 7);
    }
  }

  it("rates completed against completed plus missed", async () => {
    const id = await addClient();
    await history(id, ["completed", "completed", "missed", "completed"]);

    const t = await checkInTrend(id, MONDAY);
    expect(t.completed).toBe(3);
    expect(t.missed).toBe(1);
    expect(t.completionRate).toBe(75);
  });

  /** Decision 8, and the reason for it. */
  it("excludes upcoming from the rate, so a new week does not read as failure", async () => {
    const id = await addClient();
    await history(id, ["completed", "completed"]);
    // A check-in due next week, nobody's fault, not yet answerable.
    await db.insert(schema.checkIns).values({
      id: newId(),
      clientId: id,
      dueOn: addDays(MONDAY, 7),
      closesOn: addDays(MONDAY, 14),
    });

    const t = await checkInTrend(id, MONDAY);
    expect(t.completionRate).toBe(100);
  });

  it("excludes overdue too — there is still time", async () => {
    const id = await addClient();
    await history(id, ["completed"]);
    await db.insert(schema.checkIns).values({
      id: newId(),
      clientId: id,
      dueOn: addDays(MONDAY, -2),
      closesOn: addDays(MONDAY, 5),
    });

    const t = await checkInTrend(id, MONDAY);
    expect(t.completionRate).toBe(100);
    expect(t.checkIns.some((c) => c.state === "overdue")).toBe(true);
  });

  it("has no rate at all before anything has settled", async () => {
    // Joined yesterday, so their first check-in is still upcoming. A client who joined
    // a month ago and never checked in has a rate, and it is nought.
    const id = await addClient({ createdAt: new Date(`${addDays(MONDAY, -1)}T00:00:00Z`) });
    await ensureCheckIns(id, MONDAY);

    // Null, not nought: "nothing has been asked yet" and "everything was missed" are
    // different facts and must not render identically.
    const t = await checkInTrend(id, MONDAY);
    expect(t.completionRate).toBeNull();
  });

  it("counts a streak back from the most recent settled check-in", async () => {
    const id = await addClient();
    await history(id, ["completed", "missed", "completed", "completed"]);

    expect((await checkInTrend(id, MONDAY)).currentStreak).toBe(2);
  });

  it("does not break a streak on an upcoming or overdue check-in", async () => {
    const id = await addClient();
    await history(id, ["completed", "completed"]);
    await db.insert(schema.checkIns).values([
      { id: newId(), clientId: id, dueOn: addDays(MONDAY, -1), closesOn: addDays(MONDAY, 6) },
      { id: newId(), clientId: id, dueOn: addDays(MONDAY, 7), closesOn: addDays(MONDAY, 14) },
    ]);

    // This week not being filled in yet should not wipe out last month's run.
    expect((await checkInTrend(id, MONDAY)).currentStreak).toBe(2);
  });

  it("ends the streak at a genuine miss", async () => {
    const id = await addClient();
    await history(id, ["completed", "completed", "missed"]);
    expect((await checkInTrend(id, MONDAY)).currentStreak).toBe(0);
  });
});

describe("submitting", () => {
  async function metricId(code: string) {
    const [m] = await db
      .select({ id: schema.metrics.id })
      .from(schema.metrics)
      .where(eq(schema.metrics.code, code))
      .limit(1);
    if (!m) throw new Error(`seed metric ${code} is missing — run seed:metrics`);
    return m.id;
  }

  async function dueCheckIn(clientId: string) {
    const id = newId();
    await db.insert(schema.checkIns).values({
      id,
      clientId,
      dueOn: addDays(MONDAY, -1),
      closesOn: addDays(MONDAY, 6),
    });
    return id;
  }

  it("records answers and marks the check-in completed", async () => {
    const client = await addClient();
    const checkIn = await dueCheckIn(client);

    const out = await submitCheckIn(
      studioId,
      checkIn,
      [
        { metricId: await metricId("weight"), numberValue: 74.2 },
        { metricId: await metricId("energy"), ratingValue: 4 },
        { metricId: await metricId("notes"), textValue: "Shoulder felt better." },
      ],
      MONDAY,
    );

    expect(out.state).toBe("completed");
    expect(out.answers).toHaveLength(3);
    expect(out.answers.find((a) => a.code === "weight")?.numberValue).toBe(74.2);
  });

  it("appends a weight answer to body_metric, so the chart has one series", async () => {
    const userId = newId();
    await db.insert(schema.users).values({ id: userId, name: "Linked", phone: "+918600000412" });
    const client = await addClient({ userId });
    const checkIn = await dueCheckIn(client);

    await submitCheckIn(
      studioId,
      checkIn,
      [{ metricId: await metricId("weight"), numberValue: 71.5 }],
      MONDAY,
    );

    const [metric] = await db
      .select({ weightKg: schema.bodyMetrics.weightKg, source: schema.bodyMetrics.source })
      .from(schema.bodyMetrics)
      .where(eq(schema.bodyMetrics.userId, userId));

    expect(metric?.weightKg).toBe(71.5);
    expect(metric?.source).toBe("check_in");

    await db.delete(schema.clients).where(eq(schema.clients.id, client));
    await db.delete(schema.users).where(eq(schema.users.id, userId));
  });

  it("replaces previous answers rather than doubling them", async () => {
    const client = await addClient();
    const checkIn = await dueCheckIn(client);
    const weight = await metricId("weight");

    await submitCheckIn(studioId, checkIn, [{ metricId: weight, numberValue: 80 }], MONDAY);
    const out = await submitCheckIn(
      studioId,
      checkIn,
      [{ metricId: weight, numberValue: 79 }],
      MONDAY,
    );

    expect(out.answers).toHaveLength(1);
    expect(out.answers[0]?.numberValue).toBe(79);
  });

  it("refuses a check-in whose window has closed", async () => {
    const client = await addClient();
    const checkIn = await dueCheckIn(client);

    // Two days past the closing date. The grace window has to end or it is not one.
    await expect(
      submitCheckIn(
        studioId,
        checkIn,
        [{ metricId: await metricId("weight"), numberValue: 70 }],
        addDays(MONDAY, 8),
      ),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("refuses a metric belonging to another studio", async () => {
    const client = await addClient();
    const checkIn = await dueCheckIn(client);

    const theirs = newId();
    const otherStudio = newId();
    await db.insert(schema.studios).values({
      id: otherStudio,
      slug: `other-${otherStudio.slice(0, 6)}`,
      name: "Other",
      joinCode: otherStudio.slice(0, 8),
    });
    await db.insert(schema.metrics).values({
      id: theirs,
      studioId: otherStudio,
      code: "private_thing",
      name: "Private",
      type: "number",
    });

    await expect(
      submitCheckIn(studioId, checkIn, [{ metricId: theirs, numberValue: 1 }], MONDAY),
    ).rejects.toMatchObject({ status: 400 });

    await db.delete(schema.metrics).where(eq(schema.metrics.id, theirs));
    await db.delete(schema.studios).where(eq(schema.studios.id, otherStudio));
  });

  it("will not touch a check-in belonging to another studio", async () => {
    const client = await addClient();
    const checkIn = await dueCheckIn(client);
    const stranger = newId();

    await expect(submitCheckIn(stranger, checkIn, [], MONDAY)).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("over HTTP", () => {
  it("serves the trend, and schedules on first read", async () => {
    const id = await addClient();
    const res = await coach.get(`/studios/${studioId}/clients/${id}/check-ins`);

    expect(res.status).toBe(200);
    const trend = (res.body as unknown as { trend: { checkIns: unknown[] } }).trend;
    // Nothing had been scheduled; the read materialised it rather than showing nothing.
    expect(trend.checkIns.length).toBeGreaterThan(0);
  });

  it("lists the seeded shared metrics", async () => {
    const res = await coach.get(`/studios/${studioId}/metrics`);
    const metrics = (res.body as unknown as { metrics: { code: string }[] }).metrics;

    expect(metrics.some((m) => m.code === "weight")).toBe(true);
    expect(metrics.some((m) => m.code === "photo_front")).toBe(true);
  });

  it("creates a studio metric and refuses a duplicate code", async () => {
    const body = { code: "mood", name: "Mood", type: "rating", unit: "1-5" };
    expect((await coach.post(`/studios/${studioId}/metrics`, body)).status).toBe(201);

    const again = await coach.post(`/studios/${studioId}/metrics`, body);
    expect(again.status).toBe(400);
    expect(again.body.error).toBe("metric_exists");

    await db
      .delete(schema.metrics)
      .where(and(eq(schema.metrics.studioId, studioId), eq(schema.metrics.code, "mood")));
  });

  it("refuses a code that is not a usable key", async () => {
    const res = await coach.post(`/studios/${studioId}/metrics`, {
      code: "Not A Code",
      name: "Bad",
      type: "number",
    });
    expect(res.status).toBe(400);
  });
});
