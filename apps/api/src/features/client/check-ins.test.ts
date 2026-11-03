import { newId, schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetPhones } from "../../test-support/reset.js";
import { toE164 } from "../auth/service.js";
import { listStudios } from "../studio/service.js";

/**
 * The client's own side of check-ins, over HTTP, against the real database.
 *
 * Three failures are what this file exists to catch, and all three are quiet:
 *
 *  - **A retry creates a second check-in.** The client mints a `submissionId` per draft
 *    and resends it when a response is lost. If submission is not idempotent, a flaky
 *    connection turns one week into two completed check-ins and the completion rate
 *    becomes a number nobody can trace.
 *  - **One client reads another's check-in.** `requireClient` proves you may act in a
 *    studio, not that a given id is yours, so the ownership check is the only thing
 *    standing between a client and their coach's whole roster.
 *  - **A paused client submits.** Reading history while paused is correct; writing into
 *    a relationship that is not running is not, and the two sit on adjacent routes.
 *
 * Numbers are in a reserved 870xxxx range so they cannot collide with the other suites.
 */
const COACH = "8700000001";
const PERSON = "8700000002";
const OTHER = "8700000003";

const ALL = [COACH, PERSON, OTHER];

let api: TestServer;

beforeAll(async () => {
  api = await startApi();
});

afterAll(async () => {
  await api.close();
  await resetPhones(ALL.map(toE164));
});

beforeEach(async () => {
  await resetPhones(ALL.map(toE164));
});

/** A coach, a client of theirs, and a second client in the same studio. */
async function scenario(status: "active" | "paused" = "active") {
  const coach = await signUpOverHttp(api.url, COACH, "Rahul Deshmukh");
  const person = await signUpOverHttp(api.url, PERSON, "Priya Nair");
  const other = await signUpOverHttp(api.url, OTHER, "Arjun Rao");

  const [studio] = await listStudios(coach.userId);
  if (!studio) throw new Error("setup: expected a studio");

  const [owner] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(eq(schema.memberships.studioId, studio.id))
    .limit(1);
  if (!owner) throw new Error("setup: no owner membership");

  const mine = newId();
  const theirs = newId();

  await db.insert(schema.clients).values([
    {
      id: mine,
      studioId: studio.id,
      coachId: owner.id,
      userId: person.userId,
      name: "Priya Nair",
      status,
      joinedVia: "join_code",
      // Yesterday's weekday, so the first materialised check-in is already due rather
      // than a week away — otherwise there is nothing to submit to.
      createdAt: new Date(Date.now() - 14 * 86_400_000),
    },
    {
      id: theirs,
      studioId: studio.id,
      coachId: owner.id,
      userId: other.userId,
      name: "Arjun Rao",
      status: "active",
      joinedVia: "join_code",
      createdAt: new Date(Date.now() - 14 * 86_400_000),
    },
  ]);

  return { coach, person, other, studio, mine, theirs, userId: person.userId };
}

const today = (s: string) => `/c/${s}/today`;
const checkIns = (s: string) => `/c/${s}/check-ins`;

type TodayBody = {
  today: {
    firstName: string;
    checkIn: { id: string; state: string } | null;
    weight: { series: { kg: number }[]; latest: number | null; delta: number | null };
    measurements: { code: string; value: number }[];
    reveal: { workouts: boolean; food: boolean; chat: boolean };
  };
};

type ListBody = {
  checkIns: { id: string; state: string }[];
  completed: number;
  missed: number;
  completionRate: number | null;
};

/** The seeded shared library. Tests assume `seed:metrics` has been run, as the coach's do. */
async function metricId(code: string) {
  const [m] = await db
    .select({ id: schema.metrics.id })
    .from(schema.metrics)
    .where(eq(schema.metrics.code, code))
    .limit(1);
  if (!m) throw new Error(`seed metric ${code} is missing — run seed:metrics`);
  return m.id;
}

/** The open check-in on the client's own Today, which is also what materialises them. */
async function openCheckIn(agent: Agent, studioId: string) {
  const res = await agent.get(today(studioId));
  const id = (res.body as TodayBody).today.checkIn?.id;
  if (!id) throw new Error("setup: expected an open check-in");
  return id;
}

describe("who may look", () => {
  it("refuses an anonymous caller with 401, not 403", async () => {
    const { studio } = await scenario();
    expect((await new Agent(api.url).get(today(studio.id))).status).toBe(401);
  });

  it("refuses a user who is not this studio's client", async () => {
    const { studio } = await scenario();
    const outsider = await signUpOverHttp(api.url, "8700000009", "Nobody");
    expect((await outsider.agent.get(today(studio.id))).status).toBe(403);
    await resetPhones([toE164("8700000009")]);
  });

  it("answers 404, not 403, for another client's check-in in the same studio", async () => {
    const { person, other, studio } = await scenario();
    const theirCheckIn = await openCheckIn(other.agent, studio.id);

    // 403 would confirm the id exists. The client has no business learning that.
    const res = await person.agent.get(`${checkIns(studio.id)}/${theirCheckIn}`);
    expect(res.status).toBe(404);
  });

  it("refuses submitting into another client's check-in", async () => {
    const { person, other, studio } = await scenario();
    const theirCheckIn = await openCheckIn(other.agent, studio.id);

    const res = await person.agent.post(`${checkIns(studio.id)}/${theirCheckIn}`, {
      answers: [{ metricId: await metricId("energy"), ratingValue: 4 }],
    });
    expect(res.status).toBe(404);
  });
});

describe("a paused client", () => {
  it("still reads their own history, because they need to see why it stopped", async () => {
    const { person, studio } = await scenario("paused");
    expect((await person.agent.get(checkIns(studio.id))).status).toBe(200);
  });

  it("cannot submit", async () => {
    // Materialise while active, then pause — a paused client may still have an open row.
    const { person, studio, mine } = await scenario();
    const id = await openCheckIn(person.agent, studio.id);

    await db.update(schema.clients).set({ status: "paused" }).where(eq(schema.clients.id, mine));

    const res = await person.agent.post(`${checkIns(studio.id)}/${id}`, {
      answers: [{ metricId: await metricId("energy"), ratingValue: 4 }],
    });
    expect(res.status).toBe(403);
  });
});

describe("submitting", () => {
  it("is idempotent: the same submissionId twice leaves one completed check-in", async () => {
    const { person, studio, mine } = await scenario();
    const id = await openCheckIn(person.agent, studio.id);
    const submissionId = crypto.randomUUID();
    const energy = await metricId("energy");

    const body = { submissionId, answers: [{ metricId: energy, ratingValue: 4 }] };

    expect((await person.agent.post(`${checkIns(studio.id)}/${id}`, body)).status).toBe(200);
    // The retry a dropped response produces. It must converge, not accumulate.
    expect((await person.agent.post(`${checkIns(studio.id)}/${id}`, body)).status).toBe(200);

    const rows = await db
      .select({ id: schema.checkIns.id })
      .from(schema.checkIns)
      .where(and(eq(schema.checkIns.clientId, mine), eq(schema.checkIns.status, "completed")));
    expect(rows).toHaveLength(1);

    // And one answer, not two — answers are replaced rather than appended.
    const answers = await db
      .select({ id: schema.checkInAnswers.id })
      .from(schema.checkInAnswers)
      .where(eq(schema.checkInAnswers.checkInId, id));
    expect(answers).toHaveLength(1);
  });

  it("appends a weight answer to body_metric, so Today's chart has a point", async () => {
    const { person, studio, userId } = await scenario();
    const id = await openCheckIn(person.agent, studio.id);

    await person.agent.post(`${checkIns(studio.id)}/${id}`, {
      answers: [{ metricId: await metricId("weight"), numberValue: 71.5 }],
    });

    const rows = await db
      .select({ weightKg: schema.bodyMetrics.weightKg, source: schema.bodyMetrics.source })
      .from(schema.bodyMetrics)
      .where(eq(schema.bodyMetrics.userId, userId));

    expect(rows).toEqual([{ weightKg: 71.5, source: "check_in" }]);

    const res = await person.agent.get(today(studio.id));
    expect((res.body as TodayBody).today.weight.latest).toBe(71.5);
  });

  it("refuses a rating outside 1-5 rather than storing it", async () => {
    const { person, studio } = await scenario();
    const id = await openCheckIn(person.agent, studio.id);

    const res = await person.agent.post(`${checkIns(studio.id)}/${id}`, {
      answers: [{ metricId: await metricId("energy"), ratingValue: 9 }],
    });
    expect(res.status).toBe(400);
  });
});

describe("the history tally", () => {
  it("reports null, not 0%, when nothing has settled yet", async () => {
    const { person, studio, mine } = await scenario();

    // A client who joined today: every row is upcoming, so nothing has been decided.
    await db
      .update(schema.clients)
      .set({ createdAt: new Date() })
      .where(eq(schema.clients.id, mine));
    await db.delete(schema.checkIns).where(eq(schema.checkIns.clientId, mine));

    await person.agent.get(today(studio.id));
    const res = await person.agent.get(checkIns(studio.id));
    const body = res.body as ListBody;

    expect(body.completed).toBe(0);
    // 0% would say they failed at something they have not been asked to do yet.
    expect(body.completionRate).toBeNull();
  });
});

describe("Today", () => {
  it("keeps Food and Chat available before a workout plan is assigned", async () => {
    const { person, studio } = await scenario();
    const res = await person.agent.get(today(studio.id));
    const { reveal } = (res.body as TodayBody).today;

    // Workouts need a published plan. Food logging and conversations stand alone.
    expect(reveal).toEqual({ workouts: false, food: true, chat: true });
  });

  it("reveals the workouts tab once a published copy exists for this client", async () => {
    const { person, studio, mine } = await scenario();

    // The shape of "Duplicate from Template": a row scoped to this client, not a join.
    await db.insert(schema.workoutTemplates).values({
      id: newId(),
      studioId: studio.id,
      clientId: mine,
      name: "Lower body",
      status: "active",
      source: "coach",
    });

    const res = await person.agent.get(today(studio.id));
    expect((res.body as TodayBody).today.reveal.workouts).toBe(true);
  });

  it("does not reveal a studio template that was never copied to this client", async () => {
    const { person, studio } = await scenario();

    // A library template with no `clientId` — nobody's programme yet.
    await db.insert(schema.workoutTemplates).values({
      id: newId(),
      studioId: studio.id,
      name: "Somebody else's workout",
      status: "active",
      source: "coach",
    });

    const res = await person.agent.get(today(studio.id));
    expect((res.body as TodayBody).today.reveal.workouts).toBe(false);
  });

  it("does not reveal a copy that is still a draft", async () => {
    const { person, studio, mine } = await scenario();

    // Verified against the real trainer app: "even if the template is assigned to a
    // client in draft stage the client doesn't see it, only after publishing."
    await db.insert(schema.workoutTemplates).values({
      id: newId(),
      studioId: studio.id,
      clientId: mine,
      name: "Pull",
      status: "draft",
      source: "coach",
    });

    const res = await person.agent.get(today(studio.id));
    expect((res.body as TodayBody).today.reveal.workouts).toBe(false);
  });

  it("greets by first name only", async () => {
    const { person, studio } = await scenario();
    const res = await person.agent.get(today(studio.id));
    expect((res.body as TodayBody).today.firstName).toBe("Priya");
  });
});

describe("development and daily steps", () => {
  it("corrects a daily total instead of accumulating duplicates and isolates clients", async () => {
    const { person, other, coach, studio, mine } = await scenario();
    const date = "2026-01-05";
    expect(
      (await person.agent.request("PUT", `/c/${studio.id}/steps`, { date, count: 4500 })).status,
    ).toBe(200);
    expect(
      (await person.agent.request("PUT", `/c/${studio.id}/steps`, { date, count: 6500 })).status,
    ).toBe(200);
    const response = await person.agent.get(`/c/${studio.id}/steps?start=${date}&end=2026-01-11`);
    expect(response.status).toBe(200);
    expect(response.body.days).toMatchObject([{ date, count: 6500 }]);
    const hidden = await other.agent.get(`/c/${studio.id}/steps?start=${date}&end=2026-01-11`);
    expect(hidden.body.days).toEqual([]);
    const trainer = await coach.agent.get(
      `/studios/${studio.id}/clients/${mine}/steps?start=${date}&end=2026-01-11`,
    );
    expect(trainer.body.days).toMatchObject([{ date, count: 6500 }]);
  });
  it("keeps dated goals and rejects invalid totals and paused writes", async () => {
    const { person, coach, studio, mine } = await scenario();
    for (const count of [-1, 2.5, 200001])
      expect(
        (await person.agent.request("PUT", `/c/${studio.id}/steps`, { date: "2026-01-05", count }))
          .status,
      ).toBe(400);
    expect(
      (
        await person.agent.request("PUT", `/c/${studio.id}/steps`, {
          date: "2026-02-30",
          count: 10,
        })
      ).status,
    ).toBe(400);
    for (const [date, count] of [
      ["2026-01-05", 8000],
      ["2026-01-08", 10000],
    ])
      expect(
        (
          await coach.agent.request("PUT", `/studios/${studio.id}/clients/${mine}/step-goal`, {
            date,
            count,
          })
        ).status,
      ).toBe(200);
    const response = await person.agent.get(
      `/c/${studio.id}/steps?start=2026-01-05&end=2026-01-11`,
    );
    expect(response.body.goals).toMatchObject([
      { effectiveOn: "2026-01-08", count: 10000 },
      { effectiveOn: "2026-01-05", count: 8000 },
    ]);
    await db.update(schema.clients).set({ status: "paused" }).where(eq(schema.clients.id, mine));
    expect(
      (
        await person.agent.request("PUT", `/c/${studio.id}/steps`, {
          date: "2026-01-05",
          count: 10,
        })
      ).status,
    ).toBe(403);
  });
  it("loads only this client's development and shares check-in review status", async () => {
    const { person, coach, studio, mine, theirs } = await scenario();
    const id = await openCheckIn(person.agent, studio.id);
    await db
      .update(schema.checkIns)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(schema.checkIns.id, id));
    const path = `/studios/${studio.id}/clients/${mine}/development`;
    expect((await coach.agent.get(path)).body.checkIns).toMatchObject([{ id, reviewed: false }]);
    expect((await coach.agent.post(path + "/" + id + "/review", {})).status).toBe(200);
    expect((await coach.agent.get(path)).body.checkIns).toMatchObject([{ id, reviewed: true }]);
    expect(
      (
        await coach.agent.post(
          `/studios/${studio.id}/clients/${theirs}/development/${id}/review`,
          {},
        )
      ).status,
    ).toBe(404);
  });
});
