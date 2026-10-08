import { newId, schema } from "@traiv/db";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { Agent, signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetPhones } from "../../test-support/reset.js";
import { toE164 } from "../auth/service.js";
import { listStudios } from "../studio/service.js";

/**
 * Client onboarding, over HTTP, against the real database.
 *
 * The thing this file protects is that a half-finished intake stays half-finished and a
 * finished one produces exactly one live number. Both failures are quiet: a client who
 * loses their answers just gives up, and two active targets means the app and the coach
 * read different calories for the same person on the same day.
 *
 * Numbers are in a reserved 840xxxx range so they cannot collide with the other suites.
 */
const COACH = "8400000001";
const PERSON = "8400000002";
const OTHER = "8400000003";
const COACH_B = "8400000004";
const ALL = [COACH, PERSON, OTHER, COACH_B];

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

type Status = "active" | "paused";

async function scenario(status: Status = "active") {
  const coach = await signUpOverHttp(api.url, COACH, "Rahul Deshmukh");
  const person = await signUpOverHttp(api.url, PERSON, "Priya Nair");

  const [studio] = await listStudios(coach.userId);
  if (!studio) throw new Error("setup: expected a studio");

  const [owner] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(eq(schema.memberships.studioId, studio.id))
    .limit(1);
  if (!owner) throw new Error("setup: no owner membership");

  const clientId = newId();
  await db.insert(schema.clients).values({
    id: clientId,
    studioId: studio.id,
    coachId: owner.id,
    userId: person.userId,
    name: "Priya Nair",
    status,
    joinedVia: "join_code",
  });

  return { coach, person, studio, clientId, userId: person.userId };
}

const intake = (studioId: string) => `/c/${studioId}/intake`;
const complete = (studioId: string) => `/c/${studioId}/intake/complete`;

/** A full set of answers for a healthy 30-year-old woman. */
const answers = {
  step1: { step: 1, goal: "lose_fat", targetWeightKg: 58 },
  step2: {
    step: 2,
    sex: "female",
    birthYear: new Date().getUTCFullYear() - 30,
    heightCm: 165,
    weightKg: 68,
  },
  step3: {
    step: 3,
    dailyActivity: "moderate",
    experience: "some",
    daysPerWeek: 4,
    sessionMinutes: 45,
    equipment: ["full_gym"],
  },
  step4: { step: 4, diet: "vegetarian", mealsPerDay: 3, allergies: "none", dislikes: "mushrooms" },
  step5: { step: 5, healthFlags: [], healthNote: "" },
  step6: { step: 6, trainingDays: ["mon", "tue", "thu", "sat"], preferredTime: "morning" },
} as const;

async function fillAll(agent: Agent, studioId: string, over: Record<string, unknown> = {}) {
  for (const body of Object.values(answers)) {
    await agent.patch(intake(studioId), { ...body, ...(over[`step${body.step}`] ?? {}) });
  }
  return agent.post(complete(studioId));
}

/** `Reply.body` is deliberately `unknown`; this is the shape these routes answer with. */
type IntakeBody = {
  intake: { lastStep: number | null; goal: string | null; completedAt: string | null } | null;
  weightKg: number | null;
  target: { kcal: number } | null;
  awaitingReview: boolean;
};

const body = (res: { body: unknown }) => res.body as IntakeBody;

async function targetsFor(userId: string) {
  return db
    .select()
    .from(schema.nutritionTargets)
    .where(eq(schema.nutritionTargets.userId, userId));
}

describe("who may answer", () => {
  it("refuses an anonymous caller with 401, not 403", async () => {
    const { studio } = await scenario();
    expect((await new Agent(api.url).get(intake(studio.id))).status).toBe(401);
  });

  it("refuses someone who is not this coach's client", async () => {
    const { studio } = await scenario();
    const outsider = await signUpOverHttp(api.url, OTHER, "Nobody");
    expect((await outsider.agent.patch(intake(studio.id), answers.step1)).status).toBe(403);
  });

  it("refuses to write while the coaching is paused", async () => {
    const { person, studio } = await scenario("paused");
    expect((await person.agent.patch(intake(studio.id), answers.step1)).status).toBe(403);
    // Reading is still fine — the app has to be able to say why it is read-only.
    expect((await person.agent.get(intake(studio.id))).status).toBe(200);
  });
});

describe("answering", () => {
  it("starts empty", async () => {
    const { person, studio } = await scenario();
    const res = await person.agent.get(intake(studio.id));
    expect(res.status).toBe(200);
    expect(body(res).intake).toBeNull();
    expect(body(res).target).toBeNull();
  });

  it("remembers where someone stopped", async () => {
    const { person, studio } = await scenario();
    await person.agent.patch(intake(studio.id), answers.step1);
    await person.agent.patch(intake(studio.id), answers.step2);

    const res = await person.agent.get(intake(studio.id));
    expect(body(res).intake?.lastStep).toBe(2);
    expect(body(res).intake?.goal).toBe("lose_fat");
    expect(body(res).weightKg).toBe(68);
    expect(body(res).intake?.completedAt).toBeNull();
  });

  it("corrects a weight instead of inventing a second measurement", async () => {
    const { person, studio, userId } = await scenario();
    await person.agent.patch(intake(studio.id), answers.step2);
    await person.agent.patch(intake(studio.id), { ...answers.step2, weightKg: 70 });

    const rows = await db
      .select()
      .from(schema.bodyMetrics)
      .where(and(eq(schema.bodyMetrics.userId, userId), eq(schema.bodyMetrics.source, "intake")));

    expect(rows).toHaveLength(1);
    expect(rows[0]?.weightKg).toBe(70);
  });

  it("rejects a slipped decimal rather than feeding it to the calculator", async () => {
    const { person, studio } = await scenario();
    // Height typed into the weight box.
    const res = await person.agent.patch(intake(studio.id), { ...answers.step2, weightKg: 1650 });
    expect(res.status).toBe(400);
  });
});

describe("finishing", () => {
  it("produces one active target a coach can reproduce by hand", async () => {
    const { person, studio, userId } = await scenario();
    const res = await fillAll(person.agent, studio.id);

    expect(res.status).toBe(200);
    expect(body(res).awaitingReview).toBe(false);

    const rows = await targetsFor(userId);
    expect(rows).toHaveLength(1);
    const t = rows[0];
    expect(t?.status).toBe("active");
    expect(t?.createdBy).toBe("system");

    // 10(68) + 6.25(165) − 5(30) − 161 = 1400.25 BMR, × 1.55 = 2170.4 maintenance,
    // −20% = 1736.3, rounded to 1740. Deficit 434 kcal, so no floor binds.
    const basis = t?.basis as { bmr: number; tdee: number; boundBy: string };
    expect(basis.bmr).toBe(1400);
    expect(basis.tdee).toBe(2170);
    expect(t?.kcal).toBe(1740);
    expect(basis.boundBy).toBe("none");
  });

  it("closes the intake and stops asking", async () => {
    const { person, studio } = await scenario();
    await fillAll(person.agent, studio.id);

    const res = await person.agent.get(intake(studio.id));
    expect(body(res).intake?.completedAt).not.toBeNull();
    expect(body(res).intake?.lastStep).toBeNull();
    expect(body(res).target?.kcal).toBeGreaterThan(0);
  });

  it("finishes without a number when the client skipped what it needs", async () => {
    const { person, studio, userId } = await scenario();
    // Only the goal — everything else skipped.
    await person.agent.patch(intake(studio.id), answers.step1);
    const res = await person.agent.post(complete(studio.id));

    expect(res.status).toBe(200);
    expect(body(res).target).toBeNull();
    expect(body(res).awaitingReview).toBe(false);
    expect(await targetsFor(userId)).toHaveLength(0);

    const after = await person.agent.get(intake(studio.id));
    expect(body(after).intake?.completedAt).not.toBeNull();
  });

  it("finishes for someone who skipped everything", async () => {
    const { person, studio } = await scenario();
    const res = await person.agent.post(complete(studio.id));
    expect(res.status).toBe(200);
    expect(body(res).target).toBeNull();
  });
});

describe("what waits for a coach", () => {
  it("holds a pregnant client's target back, and never puts her in a deficit", async () => {
    const { person, studio, userId } = await scenario();
    const res = await fillAll(person.agent, studio.id, {
      step5: { healthFlags: ["pregnancy"] },
    });

    expect(body(res).awaitingReview).toBe(true);
    expect(body(res).target).toBeNull();

    const [t] = await targetsFor(userId);
    expect(t?.status).toBe("proposed");
    expect(t?.reviewReasons).toContain("pregnancy");

    const basis = t?.basis as { goalAdjustmentPct: number; tdee: number };
    expect(basis.goalAdjustmentPct).toBe(0);
    expect(t?.kcal ?? 0).toBeGreaterThanOrEqual(basis.tdee - 10);
  });

  it("holds it back when a condition needs clinical context", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id, { step5: { healthFlags: ["diabetes"] } });

    const [t] = await targetsFor(userId);
    expect(t?.status).toBe("proposed");
    expect(t?.reviewReasons).toContain("medical_condition");
  });

  it("does not hold it back for a knee, which changes exercises not calories", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id, { step5: { healthFlags: ["knee"] } });

    const [t] = await targetsFor(userId);
    expect(t?.status).toBe("active");
  });

  it("never shows a proposed target to the client", async () => {
    const { person, studio } = await scenario();
    await fillAll(person.agent, studio.id, { step5: { healthFlags: ["pregnancy"] } });

    const res = await person.agent.get(intake(studio.id));
    expect(body(res).target).toBeNull();
    expect(body(res).awaitingReview).toBe(true);
  });
});

describe("doing it twice", () => {
  it("supersedes the old target rather than keeping two live", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id);
    await person.agent.patch(intake(studio.id), { ...answers.step2, weightKg: 62 });
    await person.agent.post(complete(studio.id));

    const rows = await targetsFor(userId);
    expect(rows).toHaveLength(2);
    expect(rows.filter((r) => r.status === "active")).toHaveLength(1);
    expect(rows.filter((r) => r.status === "superseded")).toHaveLength(1);
  });

  it("keeps one intake row however many times it is answered", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id);
    await fillAll(person.agent, studio.id);

    const rows = await db
      .select()
      .from(schema.userIntakes)
      .where(eq(schema.userIntakes.userId, userId));
    expect(rows).toHaveLength(1);
  });

  it("leaves the history readable after a change", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id);
    const [first] = await targetsFor(userId);

    await person.agent.patch(intake(studio.id), { ...answers.step1, goal: "build_muscle" });
    await person.agent.post(complete(studio.id));

    const rows = await targetsFor(userId);
    const old = rows.find((r) => r.id === first?.id);
    expect(old?.kcal).toBe(first?.kcal); // the old number is still there, unedited
    expect(rows.find((r) => r.status === "active")?.kcal).toBeGreaterThan(first?.kcal ?? 0);
  });
});

describe("hiring a second coach", () => {
  it("does not ask the same person anything twice", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id);

    // A dietitian alongside the lifting coach. Same person, same body.
    const coachB = await signUpOverHttp(api.url, COACH_B, "Meera Iyer");
    const [studioB] = await listStudios(coachB.userId);
    if (!studioB) throw new Error("setup: expected a second studio");

    const [ownerB] = await db
      .select({ id: schema.memberships.id })
      .from(schema.memberships)
      .where(eq(schema.memberships.studioId, studioB.id))
      .limit(1);
    if (!ownerB) throw new Error("setup: no owner membership for studio B");

    await db.insert(schema.clients).values({
      id: newId(),
      studioId: studioB.id,
      coachId: ownerB.id,
      userId,
      name: "Priya Nair",
      status: "active",
      joinedVia: "join_code",
    });

    const res = await person.agent.get(intake(studioB.id));
    expect(res.status).toBe(200);
    expect(body(res).intake?.completedAt).not.toBeNull();
    expect(body(res).intake?.goal).toBe("lose_fat");
    expect(body(res).weightKg).toBe(68);
  });

  it("keeps one target for the person, not one per coach", async () => {
    const { person, studio, userId } = await scenario();
    await fillAll(person.agent, studio.id);
    const rows = await targetsFor(userId);
    expect(rows.filter((r) => r.status === "active")).toHaveLength(1);
  });
});
