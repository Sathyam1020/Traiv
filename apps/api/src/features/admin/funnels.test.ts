import { newId, schema } from "@traiv/db";
import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const ADMIN = "admin-funnels-admin@example.com";
const TRAINER_A = "admin-funnels-trainer-a@example.com";
const TRAINER_B = "admin-funnels-trainer-b@example.com";
const TRAINER_C = "admin-funnels-trainer-c@example.com";
const ALL = [ADMIN, TRAINER_A, TRAINER_B, TRAINER_C];

/**
 * Admin-only, so the env override follows the same pattern as
 * `no-otp-and-admin.test.ts`: `OTP: false` to sign up over plain HTTP, `ADMIN_EMAIL`
 * pointed at this file's own reserved address.
 */
vi.mock("../../env.js", async (importActual) => {
  const actual = await importActual<typeof import("../../env.js")>();
  return { ...actual, env: { ...actual.env, OTP: false, ADMIN_EMAIL: ADMIN } };
});

const { db } = await import("../../db.js");
const { Agent, startApi } = await import("../../test-support/http.js");
const { resetEmails } = await import("../../test-support/reset.js");

type TestServer = Awaited<ReturnType<typeof startApi>>;
let api: TestServer;
const insertedEventIds: string[] = [];

async function wipe() {
  if (insertedEventIds.length) {
    await db.delete(schema.productEvents).where(inArray(schema.productEvents.id, insertedEventIds));
    insertedEventIds.length = 0;
  }
  await resetEmails(ALL);
}

beforeAll(async () => {
  api = await startApi();
});
afterAll(async () => {
  await wipe();
  await api.close();
});
beforeEach(wipe);

/** Signs up over real HTTP with no code — the way the apps do when `OTP=NO`. */
async function signUp(email: string, name: string) {
  const agent = new Agent(api.url);
  const res = await agent.request("POST", "/auth/direct", { email, name });
  if (res.status !== 200)
    throw new Error(`signup failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { agent, userId: (res.body.user as { id: string }).id };
}

async function seedEvent(name: string, userId: string, receivedAt: Date) {
  const id = newId();
  insertedEventIds.push(id);
  await db.insert(schema.productEvents).values({
    id,
    name,
    occurredAt: receivedAt,
    receivedAt,
    userId,
    studioId: null,
    actorRole: "trainer",
    sourceApp: "trainer",
    properties: {},
  });
}

const TRAINER_ACTIVATION_FUNNEL_ID = "00000000-0000-7000-9000-000000000001";

describe("GET /admin/analytics/funnels/:id", () => {
  it("walks each user in order, stops at their first missing step, and reports drop-off and median gaps correctly", async () => {
    const admin = await signUp(ADMIN, "Admin");
    const a = await signUp(TRAINER_A, "Trainer A");
    const b = await signUp(TRAINER_B, "Trainer B");
    const c = await signUp(TRAINER_C, "Trainer C");

    const base = new Date(Date.now() - 10 * 86_400_000); // well inside the default 30-day window
    const hour = 3_600_000;

    // A completes every step, one hour apart each time.
    await seedEvent("signup_completed", a.userId, base);
    await seedEvent("business_name_confirmed", a.userId, new Date(base.getTime() + hour));
    await seedEvent("client_invited", a.userId, new Date(base.getTime() + 2 * hour));
    await seedEvent("client_joined", a.userId, new Date(base.getTime() + 3 * hour));

    // B reaches step 2 (business_name_confirmed) in half the time, then drops.
    await seedEvent("signup_completed", b.userId, base);
    await seedEvent("business_name_confirmed", b.userId, new Date(base.getTime() + hour / 2));

    // C signs up and drops immediately — never reaches step 2.
    await seedEvent("signup_completed", c.userId, base);

    const res = await admin.agent.get(`/admin/analytics/funnels/${TRAINER_ACTIVATION_FUNNEL_ID}`);
    expect(res.status).toBe(200);
    const steps = res.body.steps as {
      name: string;
      reached: number;
      dropOffRate: number | null;
      medianSecondsSincePreviousStep: number | null;
    }[];

    expect(steps.map((s) => s.name)).toEqual([
      "signup_completed",
      "business_name_confirmed",
      "client_invited",
      "client_joined",
    ]);
    // Step 1 (signup_completed) also counts the admin's own signup — `establishSession`
    // fires it for every new account, this test's included. Only A and B reach step 2;
    // only A reaches 3 and 4.
    expect(steps.map((s) => s.reached)).toEqual([4, 2, 1, 1]);

    expect(steps[0]?.dropOffRate).toBeNull();
    expect(steps[1]?.dropOffRate).toBeCloseTo(1 - 2 / 4, 5);
    expect(steps[2]?.dropOffRate).toBeCloseTo(1 - 1 / 2, 5);
    expect(steps[3]?.dropOffRate).toBeCloseTo(0, 5);

    // Gap into step 2: A took 3600s, B took 1800s — median of those two is 2700s.
    expect(steps[1]?.medianSecondsSincePreviousStep).toBe(2700);
    // Gaps into steps 3 and 4 have only A's one sample each: exactly 3600s.
    expect(steps[2]?.medianSecondsSincePreviousStep).toBe(3600);
    expect(steps[3]?.medianSecondsSincePreviousStep).toBe(3600);
  });

  it("filters by step properties — the 15-step onboarding funnel only matches its own step_index", async () => {
    const admin = await signUp(ADMIN, "Admin");
    const a = await signUp(TRAINER_A, "Trainer A");

    const base = new Date(Date.now() - 5 * 86_400_000);
    // Steps 1 and 2 only, out of 15 — and a decoy event for step 5 one of them never
    // reached, which the property filter must not confuse with step 1 or 2.
    const id1 = newId();
    insertedEventIds.push(id1);
    await db.insert(schema.productEvents).values({
      id: id1,
      name: "onboarding_step_completed",
      occurredAt: base,
      receivedAt: base,
      userId: a.userId,
      studioId: null,
      actorRole: "client",
      sourceApp: "client",
      properties: { step_index: 1 },
    });
    const id2 = newId();
    insertedEventIds.push(id2);
    await db.insert(schema.productEvents).values({
      id: id2,
      name: "onboarding_step_completed",
      occurredAt: new Date(base.getTime() + 60_000),
      receivedAt: new Date(base.getTime() + 60_000),
      userId: a.userId,
      studioId: null,
      actorRole: "client",
      sourceApp: "client",
      properties: { step_index: 2 },
    });

    const res = await admin.agent.get(
      "/admin/analytics/funnels/00000000-0000-7000-9000-000000000002",
    );
    expect(res.status).toBe(200);
    const steps = res.body.steps as { reached: number }[];
    expect(steps[0]?.reached).toBe(1);
    expect(steps[1]?.reached).toBe(1);
    // Steps 3-15 were never logged for anyone.
    expect(steps.slice(2).every((s) => s.reached === 0)).toBe(true);
  });
});
