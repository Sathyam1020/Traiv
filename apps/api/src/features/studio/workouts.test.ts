import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetPhones } from "../../test-support/reset.js";
import { toE164 } from "../auth/service.js";
import { listStudios } from "./service.js";

/**
 * The coach's workout library and a client's programmes, over HTTP, against the real
 * database — rebuilt against the real trainer app (`app.coachway.io`), not inferred from
 * the mobile bundle. See ADR 0024.
 *
 * What this protects, all specific to this model:
 *
 *  - **Editing orphaning logged history.** `set_log.exercise_set_id` is
 *    `on delete set null`; a save that deletes and re-inserts the tree detaches every
 *    logged set from the exercise it belongs to.
 *  - **A client seeing a draft.** Verified in the real app: "even if the template is
 *    assigned to a client in draft stage the client doesn't see it, only after
 *    publishing." The read path is exercised in `check-ins.test.ts` (Today's reveal);
 *    this file covers the write side that produces the row.
 *  - **Duplicate-to-client editing the source**, or another client's copy.
 *  - **Reading or writing another studio's template or exercise.**
 *
 * Numbers are in a reserved 850xxxx range so they cannot collide with the other suites.
 */
const COACH = "8500000001";
const CLIENT_A = "8500000002";
const CLIENT_B = "8500000003";
const OTHER_COACH = "8500000004";
const ALL = [COACH, CLIENT_A, CLIENT_B, OTHER_COACH];

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

async function scenario() {
  const coach = await signUpOverHttp(api.url, COACH, "Rahul Deshmukh");
  const other = await signUpOverHttp(api.url, OTHER_COACH, "Someone Else");
  const a = await signUpOverHttp(api.url, CLIENT_A, "Priya Nair");
  const b = await signUpOverHttp(api.url, CLIENT_B, "Arjun Rao");

  const [studio] = await listStudios(coach.userId);
  const [otherStudio] = await listStudios(other.userId);
  if (!studio || !otherStudio) throw new Error("setup: expected studios");

  const [owner] = await db
    .select({ id: schema.memberships.id })
    .from(schema.memberships)
    .where(eq(schema.memberships.studioId, studio.id))
    .limit(1);
  if (!owner) throw new Error("setup: no owner membership");

  async function client(userId: string, name: string, studioId: string, coachId: string) {
    const id = newId();
    await db.insert(schema.clients).values({
      id,
      studioId,
      coachId,
      userId,
      name,
      status: "active",
      joinedVia: "join_code",
    });
    return id;
  }

  const [exercise] = await db.select({ id: schema.exercises.id }).from(schema.exercises).limit(1);
  if (!exercise) throw new Error("setup: library empty — run seed:exercises");

  return {
    coach,
    other,
    studio,
    otherStudio,
    clientA: await client(a.userId, "Priya Nair", studio.id, owner.id),
    outsider: await client(b.userId, "Outsider", otherStudio.id, owner.id),
    exercise: exercise.id,
  };
}

type Template = {
  id: string;
  status: string;
  clientId: string | null;
  source: string;
  sessions: {
    id: string;
    name: string;
    exercises: { id: string; exerciseId: string; sets: { id: string }[] }[];
  }[];
};

const body = (res: { body: unknown }) => (res.body as { template: Template }).template;

function draft(exerciseId: string, name = "Upper push") {
  return {
    name,
    sessions: [
      {
        name: "Workout A",
        exercises: [
          {
            exerciseId,
            fields: ["weight", "reps", "rest"],
            sets: [
              { reps: 10, weightKg: 40, restSeconds: 90 },
              { reps: 8, repsMax: 10, weightKg: 60 },
            ],
          },
        ],
      },
    ],
  };
}

describe("authoring a template", () => {
  it("stores sessions, exercises and sets, and reads them back whole", async () => {
    const s = await scenario();
    const created = await s.coach.agent.post(
      `/studios/${s.studio.id}/workout-templates`,
      draft(s.exercise),
    );
    expect(created.status).toBe(201);

    const t = body(created);
    expect(t.status).toBe("draft");
    expect(t.clientId).toBeNull();
    expect(t.sessions).toHaveLength(1);
    expect(t.sessions[0]?.exercises[0]?.sets).toHaveLength(2);
  });

  it("keeps the ids of rows the builder sent back, so logged history stays attached", async () => {
    const s = await scenario();
    const path = `/studios/${s.studio.id}/workout-templates`;
    const t = body(await s.coach.agent.post(path, draft(s.exercise)));

    const session = t.sessions[0];
    const exercise = session?.exercises[0];
    const setIds = exercise?.sets.map((x) => x.id) ?? [];

    const updated = body(
      await s.coach.agent.patch(`${path}/${t.id}`, {
        name: "Upper push A",
        sessions: [
          {
            id: session?.id,
            name: "Workout A",
            exercises: [
              {
                id: exercise?.id,
                exerciseId: s.exercise,
                sets: [{ id: setIds[0], reps: 12, weightKg: 40 }],
              },
            ],
          },
        ],
      }),
    );

    expect(updated.sessions[0]?.id).toBe(session?.id);
    expect(updated.sessions[0]?.exercises[0]?.id).toBe(exercise?.id);
    expect(updated.sessions[0]?.exercises[0]?.sets.map((x) => x.id)).toEqual([setIds[0]]);
  });

  it("refuses another studio's template with 404, not 403", async () => {
    const s = await scenario();
    const t = body(
      await s.coach.agent.post(`/studios/${s.studio.id}/workout-templates`, draft(s.exercise)),
    );
    const res = await s.other.agent.get(`/studios/${s.otherStudio.id}/workout-templates/${t.id}`);
    expect(res.status).toBe(404);
  });
});

describe("a client's own programmes", () => {
  it("duplicate-from-template produces a draft copy scoped to that client", async () => {
    const s = await scenario();
    const libraryPath = `/studios/${s.studio.id}/workout-templates`;
    const source = body(await s.coach.agent.post(libraryPath, draft(s.exercise, "Pull")));
    await s.coach.agent.patch(`${libraryPath}/${source.id}/status`, { status: "active" });

    const copy = body(
      await s.coach.agent.post(
        `/studios/${s.studio.id}/clients/${s.clientA}/workouts/from-template`,
        {
          templateId: source.id,
          name: "Pull",
        },
      ),
    );

    expect(copy.id).not.toBe(source.id);
    expect(copy.clientId).toBe(s.clientA);
    // A fresh copy starts as a draft — the client must not see it until the coach has
    // had the chance to adjust it for them.
    expect(copy.status).toBe("draft");
    expect(copy.sessions[0]?.exercises[0]?.sets).toHaveLength(2);
  });

  it("editing a client's copy never touches the source template", async () => {
    const s = await scenario();
    const libraryPath = `/studios/${s.studio.id}/workout-templates`;
    const source = body(await s.coach.agent.post(libraryPath, draft(s.exercise)));
    await s.coach.agent.patch(`${libraryPath}/${source.id}/status`, { status: "active" });

    const copy = body(
      await s.coach.agent.post(
        `/studios/${s.studio.id}/clients/${s.clientA}/workouts/from-template`,
        {
          templateId: source.id,
        },
      ),
    );

    await s.coach.agent.patch(`${libraryPath}/${copy.id}`, {
      name: "Changed just for this client",
      sessions: [],
    });

    const unchanged = body(await s.coach.agent.get(`${libraryPath}/${source.id}`));
    expect(unchanged.sessions[0]?.exercises).toHaveLength(1);
  });

  it("refuses to duplicate onto a client who isn't on this studio's roster", async () => {
    const s = await scenario();
    const libraryPath = `/studios/${s.studio.id}/workout-templates`;
    const source = body(await s.coach.agent.post(libraryPath, draft(s.exercise)));
    await s.coach.agent.patch(`${libraryPath}/${source.id}/status`, { status: "active" });

    // `getClient` refuses the foreign id before the duplicate logic ever runs — 404,
    // not 403, for the same reason as everywhere else: a coach has no business learning
    // whether an id belongs to somebody else's roster.
    const res = await s.coach.agent.post(
      `/studios/${s.studio.id}/clients/${s.outsider}/workouts/from-template`,
      { templateId: source.id },
    );
    expect(res.status).toBe(404);
  });
});

describe("exercises", () => {
  it("lists the shared library, which seed:exercises populates", async () => {
    const s = await scenario();
    const res = await s.coach.agent.get(`/studios/${s.studio.id}/exercises?q=squat`);
    const rows = (res.body as { exercises: { name: string }[] }).exercises;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => /squat/i.test(r.name))).toBe(true);
  });

  it("refuses to edit the shared library through a studio-scoped route", async () => {
    const s = await scenario();
    const [shared] = await db.select({ id: schema.exercises.id }).from(schema.exercises).limit(1);

    const res = await s.coach.agent.patch(`/studios/${s.studio.id}/exercises/${shared?.id}`, {
      name: "Renamed",
      muscle: "Quads",
      equipment: "full_gym",
      pattern: "squat",
    });
    // Editing "Barbell Squat" for every studio on the platform is not a coach's call.
    expect(res.status).toBe(404);
  });
});

describe("duplicate and save-as-template", () => {
  it("clones within the library as a new draft, independent of the source", async () => {
    const s = await scenario();
    const path = `/studios/${s.studio.id}/workout-templates`;
    const t = body(await s.coach.agent.post(path, draft(s.exercise)));
    await s.coach.agent.patch(`${path}/${t.id}/status`, { status: "active" });

    const copy = body(await s.coach.agent.post(`${path}/${t.id}/duplicate`, {}));
    expect(copy.id).not.toBe(t.id);
    expect(copy.status).toBe("draft");
    expect(copy.clientId).toBeNull();

    // Editing the clone must not reach the source.
    await s.coach.agent.patch(`${path}/${copy.id}`, { name: "Changed", sessions: [] });
    const original = body(await s.coach.agent.get(`${path}/${t.id}`));
    expect(original.sessions[0]?.exercises).toHaveLength(1);
  });

  it("turns a client's programme into a reusable template without touching their copy", async () => {
    const s = await scenario();
    const libraryPath = `/studios/${s.studio.id}/workout-templates`;
    const source = body(await s.coach.agent.post(libraryPath, draft(s.exercise)));
    await s.coach.agent.patch(`${libraryPath}/${source.id}/status`, { status: "active" });

    const clientProgram = body(
      await s.coach.agent.post(`/studios/${s.studio.id}/clients/${s.clientA}/workouts/from-template`, {
        templateId: source.id,
      }),
    );

    const saved = body(
      await s.coach.agent.post(
        `/studios/${s.studio.id}/clients/${s.clientA}/workouts/${clientProgram.id}/save-as-template`,
        {},
      ),
    );
    expect(saved.clientId).toBeNull();
    expect(saved.id).not.toBe(clientProgram.id);

    // The client's own copy is unaffected and still theirs.
    const stillTheirs = body(await s.coach.agent.get(`${libraryPath}/${clientProgram.id}`));
    expect(stillTheirs.clientId).toBe(s.clientA);
  });

  it("refuses to save-as-template a row that is already a studio template", async () => {
    const s = await scenario();
    const path = `/studios/${s.studio.id}/workout-templates`;
    const t = body(await s.coach.agent.post(path, draft(s.exercise)));

    const res = await s.coach.agent.post(
      `/studios/${s.studio.id}/clients/${s.clientA}/workouts/${t.id}/save-as-template`,
      {},
    );
    expect(res.status).toBe(400);
  });
});

describe("the saved-section library", () => {
  it("snapshots a session so editing the original leaves the copy alone", async () => {
    const s = await scenario();
    const path = `/studios/${s.studio.id}/workout-templates`;
    const t = body(await s.coach.agent.post(path, draft(s.exercise)));
    const sessionId = t.sessions[0]?.id as string;

    const saved = await s.coach.agent.post(
      `/studios/${s.studio.id}/workout-sessions/${sessionId}/save-for-reuse`,
      { name: "Warm-up A" },
    );
    expect(saved.status).toBe(201);

    await s.coach.agent.patch(`${path}/${t.id}`, { name: "Emptied", sessions: [] });

    const list = await s.coach.agent.get(`/studios/${s.studio.id}/workout-sections/saved`);
    const sections = (list.body as { sections: { name: string }[] }).sections;
    expect(sections).toHaveLength(1);
    expect(sections[0]?.name).toBe("Warm-up A");
  });
});
