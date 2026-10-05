import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "./db.js";
import { toE164 } from "./features/auth/service.js";
import { studioJoin } from "./features/client/routes.js";
import { studios as studioRouter } from "./features/studio/routes.js";
import { listStudios } from "./features/studio/service.js";
import { Agent, signUpOverHttp, startApi, type TestServer } from "./test-support/http.js";
import { resetPhones } from "./test-support/reset.js";

/**
 * Authorization at the HTTP boundary.
 *
 * The service tests prove the rules; these prove the rules are actually reached. Every
 * case here goes through the real router, the real middleware chain and the real error
 * mapping, because the failure mode this file exists to catch is a route that simply
 * never calls the gate.
 *
 * Numbers are in a reserved 793xxxx range so they cannot collide with the other suites.
 */
const OWNER_A = "7930000001";
const COACH_A = "7930000002";
const OWNER_B = "7930000003";
const LONER = "7930000004";
const ALL = [OWNER_A, COACH_A, OWNER_B, LONER];

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

/** Owner A with a coach in their studio, plus an unrelated owner B. */
async function scenario() {
  const ownerA = await signUpOverHttp(api.url, OWNER_A, "Rahul Deshmukh");
  const coachA = await signUpOverHttp(api.url, COACH_A, "Meera Iyer");
  const ownerB = await signUpOverHttp(api.url, OWNER_B, "Sathyam Sahu");

  const [studioA] = await listStudios(ownerA.userId);
  const [studioB] = await listStudios(ownerB.userId);
  if (!studioA || !studioB) throw new Error("setup: expected both studios");

  const coachMembershipId = newId();
  await db.insert(schema.memberships).values({
    id: coachMembershipId,
    studioId: studioA.id,
    userId: coachA.userId,
    role: "coach",
    status: "active",
  });
  // The invited coach lands in the studio that invited them.
  await coachA.agent.post(`/studios/${studioA.id}/activate`);

  return { ownerA, coachA, ownerB, studioA, studioB, coachMembershipId };
}

describe("authorization at the HTTP boundary", () => {
  it("1 · an anonymous caller gets 401, not 403", async () => {
    const anon = new Agent(api.url);
    const res = await anon.get("/studio/join-code");
    expect(res.status).toBe(401);
  });

  it("2 · a signed-in user with no membership anywhere gets 403", async () => {
    const loner = await signUpOverHttp(api.url, LONER, "No Studio");
    // Strip every membership: a user who holds an account but coaches nowhere, which is
    // what a client is.
    await db.delete(schema.memberships).where(eq(schema.memberships.userId, loner.userId));

    const res = await loner.agent.get("/studio/join-code");
    expect(res.status).toBe(403);
  });

  it("3 · a coach of A cannot reach studio B", async () => {
    const { coachA, studioB } = await scenario();
    const res = await coachA.agent.post(`/studios/${studioB.id}/activate`);
    expect(res.status).toBe(403);
  });

  it("4 · an owner of A cannot reach studio B", async () => {
    const { ownerA, studioB } = await scenario();
    const res = await ownerA.agent.post(`/studios/${studioB.id}/activate`);
    expect(res.status).toBe(403);
  });

  it("5 · a coach is refused an owner-only route", async () => {
    const { coachA } = await scenario();
    expect((await coachA.agent.post("/studio/join-code/rotate")).status).toBe(403);
  });

  it("6 · the owner is allowed the same route", async () => {
    const { ownerA } = await scenario();
    const before = await ownerA.agent.get("/studio/join-code");
    const res = await ownerA.agent.post("/studio/join-code/rotate");

    expect(res.status).toBe(200);
    expect(res.body.joinCode).toEqual(expect.any(String));
    expect(res.body.joinCode).not.toBe(before.body.joinCode);
  });

  it("5b · a coach may still use the member-level route", async () => {
    const { coachA } = await scenario();
    const res = await coachA.agent.get("/studio/join-code");
    expect(res.status).toBe(200);
    expect(res.body.joinCode).toEqual(expect.any(String));
  });

  it("7 · removing a coach revokes access on the very next request", async () => {
    const { coachA, coachMembershipId } = await scenario();
    expect((await coachA.agent.get("/studio/join-code")).status).toBe(200);

    await db.delete(schema.memberships).where(eq(schema.memberships.id, coachMembershipId));

    // Same cookie, same session, same activeStudioId — and no longer authorized.
    expect((await coachA.agent.get("/studio/join-code")).status).toBe(403);
  });

  it("10 · suspending a membership revokes access just as removal does", async () => {
    const { coachA, coachMembershipId } = await scenario();
    await db
      .update(schema.memberships)
      .set({ status: "suspended" })
      .where(eq(schema.memberships.id, coachMembershipId));

    expect((await coachA.agent.get("/studio/join-code")).status).toBe(403);
  });

  it("8 · a stale activeStudioId is not proof, and is cleared once rejected", async () => {
    const { coachA, coachMembershipId, studioA } = await scenario();

    const [before] = await db
      .select({ activeStudioId: schema.sessions.activeStudioId })
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, coachA.userId))
      .limit(1);
    expect(before?.activeStudioId).toBe(studioA.id);

    await db.delete(schema.memberships).where(eq(schema.memberships.id, coachMembershipId));
    expect((await coachA.agent.get("/studio/join-code")).status).toBe(403);

    const [after] = await db
      .select({ activeStudioId: schema.sessions.activeStudioId })
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, coachA.userId))
      .limit(1);
    expect(after?.activeStudioId).toBeNull();
  });

  it("9 · a studio id in the body or query cannot redirect a route", async () => {
    const { coachA, studioA, studioB } = await scenario();

    // The coach may read A, and tries to aim the same route at B by every other means.
    const viaBody = await coachA.agent.patch("/studio/join-code", {
      enabled: false,
      studioId: studioB.id,
    });
    // Refused on role, never on B's behalf.
    expect(viaBody.status).toBe(403);

    const viaQuery = await coachA.agent.get(`/studio/join-code?studioId=${studioB.id}`);
    expect(viaQuery.status).toBe(200);
    const [bRow] = await db
      .select({ joinCode: schema.studios.joinCode, joinEnabled: schema.studios.joinEnabled })
      .from(schema.studios)
      .where(eq(schema.studios.id, studioB.id))
      .limit(1);

    // It answered for A, and B was neither read nor written.
    expect(viaQuery.body.joinCode).not.toBe(bRow?.joinCode);
    expect(bRow?.joinEnabled).toBe(true);
    expect(viaQuery.body.joinCode).toEqual(expect.any(String));
    expect(studioA.id).not.toBe(studioB.id);
  });

  it("11 · rotation is owner-only, and a refused rotation changes nothing", async () => {
    const { coachA, ownerA, studioA } = await scenario();
    const before = await ownerA.agent.get("/studio/join-code");

    expect((await coachA.agent.post("/studio/join-code/rotate")).status).toBe(403);

    const [row] = await db
      .select({ joinCode: schema.studios.joinCode })
      .from(schema.studios)
      .where(eq(schema.studios.id, studioA.id))
      .limit(1);
    expect(row?.joinCode).toBe(before.body.joinCode);
  });

  it("12 · enabling and disabling joins is owner-only", async () => {
    const { coachA, ownerA, studioA } = await scenario();

    expect((await coachA.agent.patch("/studio/join-code", { enabled: false })).status).toBe(403);
    const [untouched] = await db
      .select({ joinEnabled: schema.studios.joinEnabled })
      .from(schema.studios)
      .where(eq(schema.studios.id, studioA.id))
      .limit(1);
    expect(untouched?.joinEnabled).toBe(true);

    expect((await ownerA.agent.patch("/studio/join-code", { enabled: false })).status).toBe(200);
    const [after] = await db
      .select({ joinEnabled: schema.studios.joinEnabled })
      .from(schema.studios)
      .where(eq(schema.studios.id, studioA.id))
      .limit(1);
    expect(after?.joinEnabled).toBe(false);
  });

  it("does not reveal whether another studio exists", async () => {
    const { coachA, studioB } = await scenario();

    const real = await coachA.agent.post(`/studios/${studioB.id}/activate`);
    const imaginary = await coachA.agent.post(`/studios/${newId()}/activate`);

    // A studio that exists and one that does not must be indistinguishable, or this
    // endpoint becomes an oracle for which ids are real.
    expect(real.status).toBe(imaginary.status);
    expect(real.body).toEqual(imaginary.body);
  });

  it("13 · every studio-scoped route goes through the chokepoint", () => {
    // Walks the real routers. A route added later without requireStudio fails here
    // rather than silently shipping unguarded.
    const gated = (router: { stack: unknown[] }, expectation: (path: string) => boolean) => {
      const layers = router.stack as Array<{
        route?: { path: string; stack: Array<{ handle: { name?: string } }> };
      }>;
      const routes = layers.filter((l) => l.route);
      expect(routes.length).toBeGreaterThan(0);

      for (const layer of routes) {
        const route = layer.route;
        if (!route || !expectation(route.path)) continue;
        const names = route.stack.map((h) => h.handle?.name);
        expect(names, `${route.path} is missing requireStudio`).toContain("requireStudioHandler");
      }
    };

    // Everything on the studio-management router is studio-scoped.
    gated(studioJoin as unknown as { stack: unknown[] }, () => true);
    // On the studios router, only the per-studio routes are.
    gated(studioRouter as unknown as { stack: unknown[] }, (path) => path !== "/");
  });
});
