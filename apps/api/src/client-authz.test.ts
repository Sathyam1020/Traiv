import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "./db.js";
import { toE164 } from "./features/auth/service.js";
import { clientApp } from "./features/client/routes.js";
import { listStudios } from "./features/studio/service.js";
import type { ClientStatus } from "./middleware/client-authorize.js";
import { Agent, signUpOverHttp, startApi, type TestServer } from "./test-support/http.js";
import { resetPhones } from "./test-support/reset.js";

/**
 * Client authorization at the HTTP boundary — ADR 0014.
 *
 * The rule this file exists to hold: being staff of a studio is not being a client of it,
 * and neither relationship may stand in for the other. Everything else here is the status
 * table, asserted one row at a time.
 *
 * Numbers are in a reserved 794xxxx range so they cannot collide with the other suites.
 */
const COACH_A = "8300000001";
const COACH_B = "8300000002";
const PERSON = "8300000003";
const OUTSIDER = "8300000004";
const ALL = [COACH_A, COACH_B, PERSON, OUTSIDER];

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

/** Two studios, and one person who is a client of the first. */
async function scenario(status: ClientStatus = "active") {
  const coachA = await signUpOverHttp(api.url, COACH_A, "Rahul Deshmukh");
  const coachB = await signUpOverHttp(api.url, COACH_B, "Meera Iyer");
  const person = await signUpOverHttp(api.url, PERSON, "Priya Nair");

  const [studioA] = await listStudios(coachA.userId);
  const [studioB] = await listStudios(coachB.userId);
  if (!studioA || !studioB) throw new Error("setup: expected both studios");

  const [ownerA] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(eq(schema.memberships.studioId, studioA.id))
    .limit(1);
  if (!ownerA) throw new Error("setup: studio A has no owner membership");

  const clientId = newId();
  await db.insert(schema.clients).values({
    id: clientId,
    studioId: studioA.id,
    coachId: ownerA.id,
    userId: person.userId,
    name: "Priya Nair",
    status,
    joinedVia: "join_code",
  });

  return { coachA, coachB, person, studioA, studioB, clientId };
}

const me = (studioId: string) => `/c/${studioId}/me`;
/** Coach routes name their studio in the path — there is no implicit tenant. */
const joinCode = (studioId: string) => `/studios/${studioId}/join-code`;

describe("client authorization at the HTTP boundary", () => {
  it("refuses an anonymous caller with 401, not 403", async () => {
    const { studioA } = await scenario();
    expect((await new Agent(api.url).get(me(studioA.id))).status).toBe(401);
  });

  it("refuses someone who is no one's client", async () => {
    const { studioA } = await scenario();
    const outsider = await signUpOverHttp(api.url, OUTSIDER, "Nobody");
    expect((await outsider.agent.get(me(studioA.id))).status).toBe(403);
  });

  it("admits an active client, and tells them whose studio it is", async () => {
    const { person, studioA, clientId } = await scenario("active");
    const res = await person.agent.get(me(studioA.id));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("active");
    expect(res.body.clientId).toBe(clientId);
    expect((res.body.studio as { name: string }).name).toBe("Rahul Deshmukh");
  });

  it("admits a paused client so the app can say why it is read-only", async () => {
    const { person, studioA } = await scenario("paused");
    const res = await person.agent.get(me(studioA.id));
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("paused");
  });

  it("admits a waiting client so they can see they are queued", async () => {
    const { person, studioA } = await scenario("waiting");
    const res = await person.agent.get(me(studioA.id));
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("waiting");
  });

  it("admits a frozen client so they can be told they are frozen", async () => {
    // ADR 0013: a frozen client is shown their state rather than silently dropped.
    const { person, studioA } = await scenario("frozen");
    const res = await person.agent.get(me(studioA.id));
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("frozen");
  });

  it("refuses an archived client", async () => {
    const { person, studioA } = await scenario("archived");
    expect((await person.agent.get(me(studioA.id))).status).toBe(403);
  });

  it("refuses a deleted relationship", async () => {
    const { person, studioA, clientId } = await scenario("active");
    expect((await person.agent.get(me(studioA.id))).status).toBe(200);

    await db
      .update(schema.clients)
      .set({ deletedAt: new Date() })
      .where(eq(schema.clients.id, clientId));

    expect((await person.agent.get(me(studioA.id))).status).toBe(403);
  });

  it("cannot be used to tell an archived client from a stranger", async () => {
    // Archived, deleted and never-a-client must be indistinguishable, or the endpoint
    // reveals whether a coaching relationship ever existed.
    const { person, studioA, clientId } = await scenario("archived");
    const archived = await person.agent.get(me(studioA.id));

    const outsider = await signUpOverHttp(api.url, OUTSIDER, "Nobody");
    const stranger = await outsider.agent.get(me(studioA.id));

    await db
      .update(schema.clients)
      .set({ deletedAt: new Date(), status: "active" })
      .where(eq(schema.clients.id, clientId));
    const deleted = await person.agent.get(me(studioA.id));

    expect(archived.status).toBe(stranger.status);
    expect(archived.body).toEqual(stranger.body);
    expect(deleted.body).toEqual(stranger.body);
  });

  it("a client of one studio cannot read another", async () => {
    const { person, studioB } = await scenario("active");
    expect((await person.agent.get(me(studioB.id))).status).toBe(403);
  });

  it("an arbitrary studio id crosses no boundary", async () => {
    const { person } = await scenario("active");
    expect((await person.agent.get(me(newId()))).status).toBe(403);
  });

  it("being staff of a studio is not being a client of it", async () => {
    // The coach owns studio A outright and still has no client relationship there.
    const { coachA, studioA } = await scenario("active");
    expect((await coachA.agent.get(me(studioA.id))).status).toBe(403);
  });

  it("a client is not staff: being a client of A grants nothing inside A", async () => {
    const { coachA, person, studioA } = await scenario("active");
    expect((await person.agent.get(me(studioA.id))).status).toBe(200);

    // Switching into A is refused outright.
    expect((await person.agent.post(`/studios/${studioA.id}/activate`)).status).toBe(403);

    // Signup gives every account its own studio, so this answers 200 — for *their*
    // studio. The point is that it is never A's, which their client relationship would
    // grant if the two models leaked into each other.
    const [own] = await listStudios(person.userId);
    if (!own) throw new Error("signup should have created their own studio");
    const theirs = await person.agent.get(joinCode(own.id));
    const asCoach = await coachA.agent.get(joinCode(studioA.id));
    expect(theirs.status).toBe(200);
    expect(theirs.body.joinCode).not.toBe(asCoach.body.joinCode);
    expect(theirs.body.name).not.toBe("Rahul Deshmukh");
  });

  it("one session can be staff in A and a client in B at once", async () => {
    const coachA = await signUpOverHttp(api.url, COACH_A, "Rahul Deshmukh");
    const coachB = await signUpOverHttp(api.url, COACH_B, "Meera Iyer");

    const [studioA] = await listStudios(coachA.userId);
    const [studioB] = await listStudios(coachB.userId);
    if (!studioA || !studioB) throw new Error("setup: expected both studios");

    const [ownerB] = await db
      .select({ id: schema.memberships.id })
      .from(schema.memberships)
      .where(eq(schema.memberships.studioId, studioB.id))
      .limit(1);
    if (!ownerB) throw new Error("setup: studio B has no owner membership");

    // Coach A is also a client of coach B — a trainer who has a dietitian.
    await db.insert(schema.clients).values({
      id: newId(),
      studioId: studioB.id,
      coachId: ownerB.id,
      userId: coachA.userId,
      name: "Rahul Deshmukh",
      status: "active",
      joinedVia: "join_code",
    });

    // Staff in A.
    expect((await coachA.agent.get(joinCode(studioA.id))).status).toBe(200);
    // Client in B.
    expect((await coachA.agent.get(me(studioB.id))).status).toBe(200);
    // And neither leaks into the other.
    expect((await coachA.agent.get(me(studioA.id))).status).toBe(403);
    expect((await coachA.agent.post(`/studios/${studioB.id}/activate`)).status).toBe(403);
  });

  it("the session's active studio cannot stand in for the URL", async () => {
    // Coach A's session carries studio A. A client route must still resolve from the
    // path, so their own studio must not quietly satisfy a client lookup.
    const { coachA, studioA } = await scenario("active");
    const session = await coachA.agent.get("/studios");
    expect((session.body as { activeStudioId: string }).activeStudioId).toBe(studioA.id);

    expect((await coachA.agent.get(me(studioA.id))).status).toBe(403);
  });

  it("GET /c lists only the studios this user is a client of", async () => {
    const { person, studioA, studioB, clientId } = await scenario("active");

    const res = await person.agent.get("/c");
    expect(res.status).toBe(200);

    const coaches = res.body.coaches as Array<{ clientId: string; studio: { id: string } }>;
    expect(coaches).toHaveLength(1);
    expect(coaches[0]?.clientId).toBe(clientId);
    expect(coaches[0]?.studio.id).toBe(studioA.id);
    expect(coaches.map((c) => c.studio.id)).not.toContain(studioB.id);
  });

  it("GET /c is empty, not forbidden, for someone with no coach", async () => {
    await scenario();
    const outsider = await signUpOverHttp(api.url, OUTSIDER, "Nobody");

    const res = await outsider.agent.get("/c");
    // Having no coach is a normal state, not a denial — a 403 here would make the client
    // app treat "you haven't joined anyone yet" as an error.
    expect(res.status).toBe(200);
    expect(res.body.coaches).toEqual([]);
  });

  it("GET /c never lists a studio the next request would refuse", async () => {
    const { person, studioA, clientId } = await scenario("archived");
    expect((await person.agent.get("/c")).body.coaches).toEqual([]);
    // and the gate agrees
    expect((await person.agent.get(me(studioA.id))).status).toBe(403);

    await db
      .update(schema.clients)
      .set({ status: "frozen" })
      .where(eq(schema.clients.id, clientId));
    const frozen = (await person.agent.get("/c")).body.coaches as Array<{ status: string }>;
    expect(frozen).toHaveLength(1);
    expect(frozen[0]?.status).toBe("frozen");
    expect((await person.agent.get(me(studioA.id))).status).toBe(200);
  });

  it("GET /c requires a session", async () => {
    expect((await new Agent(api.url).get("/c")).status).toBe(401);
  });

  it("every client route goes through the chokepoint", () => {
    const layers = (clientApp as unknown as { stack: unknown[] }).stack as Array<{
      route?: { path: string; stack: Array<{ handle: { name?: string } }> };
    }>;
    const routes = layers.filter((l) => l.route);
    expect(routes.length).toBeGreaterThan(0);

    for (const layer of routes) {
      const route = layer.route;
      if (!route) continue;
      const names = route.stack.map((h) => h.handle?.name);

      // "/" is the one route that must not be gated: it answers which studios there are
      // to ask about, which is the question that comes before "may I act in this one".
      // It is scoped to the caller's own relationships and returns an empty list rather
      // than a 403, so it grants nothing. Every other route is gated.
      if (route.path === "/") {
        expect(names).not.toContain("requireClientHandler");
        continue;
      }
      expect(names, `${route.path} is missing requireClient`).toContain("requireClientHandler");
    }
  });
});
