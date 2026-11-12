import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetEmails } from "../../test-support/reset.js";
import { listStudios } from "../studio/service.js";

/**
 * The client's own workouts, over HTTP, against the real database. ADR 0024.
 *
 * What this protects:
 *
 *  - **A draft copy reaching the client.** Verified in the real trainer app: a template
 *    duplicated onto a client stays invisible until published, even though the row
 *    already exists and is already theirs.
 *  - **Two sessions for one workout.** Starting twice must hand back the one already
 *    open, not create a second with the first three sets sitting in a row nobody opens.
 *  - **A double-tapped set becoming two.** The upsert key is (session, exercise, set
 *    number); the route must actually use `onConflictDoUpdate`.
 *  - **`activated_at` moving on a second workout.** It means *first* logged session.
 *  - **Reading another client's programme or session.**
 *
 * Addresses are in a reserved namespace so they cannot collide with the other suites.
 */
const COACH = "client-workouts-coach@example.com";
const PERSON = "client-workouts-person@example.com";
const OTHER = "client-workouts-other@example.com";
const ALL = [COACH, PERSON, OTHER];

let api: TestServer;

beforeAll(async () => {
  api = await startApi();
});

afterAll(async () => {
  await api.close();
  await resetEmails(ALL);
});

beforeEach(async () => {
  await resetEmails(ALL);
});

async function scenario() {
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

  const [exercise] = await db.select({ id: schema.exercises.id }).from(schema.exercises).limit(1);
  if (!exercise) throw new Error("setup: library empty — run seed:exercises");

  // Bound here because narrowing above does not survive into the closure below.
  const studioId = studio.id;
  const coachId = owner.id;
  const libraryExerciseId = exercise.id;

  async function client(userId: string, name: string) {
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

  const mine = await client(person.userId, "Priya Nair");
  const theirs = await client(other.userId, "Arjun Rao");

  /** One published programme for `mine`: one session, one exercise, three sets. */
  async function publishedProgram() {
    const templateId = newId();
    const sessionId = newId();
    const sessionExerciseId = newId();

    await db.insert(schema.workoutTemplates).values({
      id: templateId,
      studioId,
      clientId: mine,
      name: "Lower body",
      status: "active",
      source: "coach",
    });
    await db
      .insert(schema.workoutSessions)
      .values({ id: sessionId, templateId, name: "A", position: 0 });
    await db.insert(schema.sessionExercises).values({
      id: sessionExerciseId,
      sessionId,
      exerciseId: libraryExerciseId,
      position: 0,
      fields: ["weight", "reps", "rest"],
    });
    for (let i = 0; i < 3; i++) {
      await db.insert(schema.exerciseSets).values({
        id: newId(),
        sessionExerciseId,
        position: i,
        reps: 10,
        weightKg: 40,
      });
    }

    return { templateId, sessionId, sessionExerciseId };
  }

  return { coach, person, other, studio, mine, theirs, publishedProgram };
}

const workoutsPath = (s: string) => `/c/${s}/workouts`;

type ProgramList = { templates: { id: string }[] };
type StartBody = { session: { id: string; sets: unknown[] } };
type SetsBody = { sets: { setNumber: number; reps: number | null; loadKg: number | null }[] };

describe("visibility", () => {
  it("a draft copy is invisible even though it already belongs to this client", async () => {
    const s = await scenario();
    await db.insert(schema.workoutTemplates).values({
      id: newId(),
      studioId: s.studio.id,
      clientId: s.mine,
      name: "Pull",
      status: "draft",
      source: "coach",
    });

    const res = await s.person.agent.get(workoutsPath(s.studio.id));
    expect((res.body as ProgramList).templates).toHaveLength(0);
  });

  it("answers 404, not 403, for another client's programme in the same studio", async () => {
    const s = await scenario();
    const { templateId } = await s.publishedProgram();

    const res = await s.other.agent.get(`${workoutsPath(s.studio.id)}/${templateId}`);
    expect(res.status).toBe(404);
  });

  it("a draft copy 404s when opened directly, not only absent from the list", async () => {
    const s = await scenario();
    const templateId = newId();
    await db.insert(schema.workoutTemplates).values({
      id: templateId,
      studioId: s.studio.id,
      clientId: s.mine,
      name: "Pull",
      status: "draft",
      source: "coach",
    });

    // Not reachable even if the client already has the id — from a stale link, or by
    // guessing. The list is one surface; the detail route is its own gate.
    const res = await s.person.agent.get(`${workoutsPath(s.studio.id)}/${templateId}`);
    expect(res.status).toBe(404);
  });
});

describe("starting a session", () => {
  it("hands back the same training session when started twice", async () => {
    const s = await scenario();
    const { templateId, sessionId } = await s.publishedProgram();
    const start = (sid: string) =>
      s.person.agent.post(`${workoutsPath(s.studio.id)}/${templateId}/sessions/${sid}/start`, {});

    const a = (await start(sessionId)).body as StartBody;
    const b = (await start(sessionId)).body as StartBody;
    expect(a.session.id).toBe(b.session.id);

    const rows = await db
      .select({ id: schema.sessions_.id })
      .from(schema.sessions_)
      .where(eq(schema.sessions_.clientId, s.mine));
    expect(rows).toHaveLength(1);
  });

  it("refuses to start another client's session", async () => {
    const s = await scenario();
    const { templateId, sessionId } = await s.publishedProgram();
    const res = await s.other.agent.post(
      `${workoutsPath(s.studio.id)}/${templateId}/sessions/${sessionId}/start`,
      {},
    );
    expect(res.status).toBe(404);
  });
});

describe("logging a set", () => {
  async function started(s: Awaited<ReturnType<typeof scenario>>) {
    const program = await s.publishedProgram();
    const res = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const trainingSessionId = (res.body as StartBody).session.id;
    return { ...program, trainingSessionId };
  }

  it("upserts on (session, exercise, set number) rather than duplicating", async () => {
    const s = await scenario();
    const t = await started(s);
    const path = `/c/${s.studio.id}/training-sessions/${t.trainingSessionId}/sets`;

    await s.person.agent.put(path, {
      sessionExerciseId: t.sessionExerciseId,
      setNumber: 1,
      reps: 10,
      loadKg: 40,
    });
    const again = await s.person.agent.put(path, {
      sessionExerciseId: t.sessionExerciseId,
      setNumber: 1,
      reps: 8,
      loadKg: 42.5,
    });

    const sets = (again.body as SetsBody).sets;
    expect(sets).toHaveLength(1);
    expect(sets[0]).toMatchObject({ setNumber: 1, reps: 8, loadKg: 42.5 });
  });

  it("refuses to log into another client's training session", async () => {
    const s = await scenario();
    const t = await started(s);
    const res = await s.other.agent.put(
      `/c/${s.studio.id}/training-sessions/${t.trainingSessionId}/sets`,
      {
        sessionExerciseId: t.sessionExerciseId,
        setNumber: 1,
        reps: 10,
        loadKg: 40,
      },
    );
    expect(res.status).toBe(404);
  });
}, 15_000);

describe("finishing", () => {
  it("sets activated_at on the first workout and never moves it again", async () => {
    const s = await scenario();
    const program1 = await s.publishedProgram();

    const before = await db
      .select({ activatedAt: schema.clients.activatedAt })
      .from(schema.clients)
      .where(eq(schema.clients.id, s.mine));
    expect(before[0]?.activatedAt).toBeNull();

    const start1 = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program1.templateId}/sessions/${program1.sessionId}/start`,
      {},
    );
    const first = (start1.body as StartBody).session.id;
    await s.person.agent.post(`/c/${s.studio.id}/training-sessions/${first}/finish`, {});

    const [after] = await db
      .select({ activatedAt: schema.clients.activatedAt })
      .from(schema.clients)
      .where(eq(schema.clients.id, s.mine));
    const stamped = after?.activatedAt;
    expect(stamped).not.toBeNull();

    const program2 = await s.publishedProgram();
    const start2 = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program2.templateId}/sessions/${program2.sessionId}/start`,
      {},
    );
    const second = (start2.body as StartBody).session.id;
    await s.person.agent.post(`/c/${s.studio.id}/training-sessions/${second}/finish`, {});

    const [later] = await db
      .select({ activatedAt: schema.clients.activatedAt })
      .from(schema.clients)
      .where(eq(schema.clients.id, s.mine));
    expect(later?.activatedAt).toEqual(stamped);
  });

  it("freezes total weight lifted from the logged sets", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;

    await s.person.agent.put(`/c/${s.studio.id}/training-sessions/${sessionId}/sets`, {
      sessionExerciseId: program.sessionExerciseId,
      setNumber: 1,
      reps: 10,
      loadKg: 40,
    });
    await s.person.agent.put(`/c/${s.studio.id}/training-sessions/${sessionId}/sets`, {
      sessionExerciseId: program.sessionExerciseId,
      setNumber: 2,
      reps: 8,
      loadKg: 42.5,
    });

    const finish = await s.person.agent.post(
      `/c/${s.studio.id}/training-sessions/${sessionId}/finish`,
      {
        quality: 4,
        intensity: 3,
      },
    );
    const session = (finish.body as { session: { totalWeightLiftedKg: number } }).session;
    expect(session.totalWeightLiftedKg).toBe(10 * 40 + 8 * 42.5);
  });

  it("shows what was lifted last time on the next occurrence of that session", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;

    await s.person.agent.put(`/c/${s.studio.id}/training-sessions/${sessionId}/sets`, {
      sessionExerciseId: program.sessionExerciseId,
      setNumber: 1,
      reps: 9,
      loadKg: 55,
    });
    await s.person.agent.post(`/c/${s.studio.id}/training-sessions/${sessionId}/finish`, {});

    const res = await s.person.agent.get(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}`,
    );
    const exercises = (res.body as { exercises: { lastTime: { reps: number | null }[] }[] })
      .exercises;
    expect(exercises[0]?.lastTime).toEqual([{ setNumber: 1, reps: 9, loadKg: 55 }]);
  });

  it("persists the elapsed seconds sent on finish", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;

    const finish = await s.person.agent.post(
      `/c/${s.studio.id}/training-sessions/${sessionId}/finish`,
      { totalSeconds: 136 },
    );
    const session = (finish.body as { session: { totalSeconds: number | null } }).session;
    expect(session.totalSeconds).toBe(136);
  });
});

describe("the programme list", () => {
  it("counts sessions and exercises, and names each session", async () => {
    const s = await scenario();
    await s.publishedProgram();

    const res = await s.person.agent.get(workoutsPath(s.studio.id));
    const templates = (
      res.body as {
        templates: { sessions: number; exercises: number; sessionNames: string[] }[];
      }
    ).templates;
    expect(templates).toHaveLength(1);
    expect(templates[0]).toMatchObject({ sessions: 1, exercises: 1, sessionNames: ["A"] });
  });
});

describe("deleting a logged set", () => {
  async function started(s: Awaited<ReturnType<typeof scenario>>) {
    const program = await s.publishedProgram();
    const res = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const trainingSessionId = (res.body as StartBody).session.id;
    return { ...program, trainingSessionId };
  }

  it("removes exactly the one set logged, leaving the others", async () => {
    const s = await scenario();
    const t = await started(s);
    const path = `/c/${s.studio.id}/training-sessions/${t.trainingSessionId}/sets`;

    await s.person.agent.put(path, {
      sessionExerciseId: t.sessionExerciseId,
      setNumber: 1,
      reps: 10,
      loadKg: 40,
    });
    await s.person.agent.put(path, {
      sessionExerciseId: t.sessionExerciseId,
      setNumber: 2,
      reps: 8,
      loadKg: 42.5,
    });

    const del = await s.person.agent.delete(`${path}/${t.sessionExerciseId}/1`);
    const remaining = (del.body as SetsBody).sets;
    expect(remaining.map((r) => r.setNumber)).toEqual([2]);
  });

  it("refuses to delete a set from another client's session", async () => {
    const s = await scenario();
    const t = await started(s);
    const path = `/c/${s.studio.id}/training-sessions/${t.trainingSessionId}/sets`;
    await s.person.agent.put(path, {
      sessionExerciseId: t.sessionExerciseId,
      setNumber: 1,
      reps: 10,
      loadKg: 40,
    });

    const res = await s.other.agent.delete(`${path}/${t.sessionExerciseId}/1`);
    expect(res.status).toBe(404);
  });
}, 15_000);

describe("cancelling a session", () => {
  it("discards the session and its logged sets", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;
    await s.person.agent.put(`/c/${s.studio.id}/training-sessions/${sessionId}/sets`, {
      sessionExerciseId: program.sessionExerciseId,
      setNumber: 1,
      reps: 10,
      loadKg: 40,
    });

    const cancel = await s.person.agent.delete(`/c/${s.studio.id}/training-sessions/${sessionId}`);
    expect(cancel.status).toBe(204);

    const rows = await db
      .select({ id: schema.sessions_.id })
      .from(schema.sessions_)
      .where(eq(schema.sessions_.id, sessionId));
    expect(rows).toHaveLength(0);
  });

  it("refuses to cancel a session that's already finished", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;
    await s.person.agent.post(`/c/${s.studio.id}/training-sessions/${sessionId}/finish`, {});

    const cancel = await s.person.agent.delete(`/c/${s.studio.id}/training-sessions/${sessionId}`);
    expect(cancel.status).toBe(400);
  });

  it("refuses to cancel another client's session", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;

    const cancel = await s.other.agent.delete(`/c/${s.studio.id}/training-sessions/${sessionId}`);
    expect(cancel.status).toBe(404);
  });
});

describe("an exercise's own detail", () => {
  it("has no history or stats before any workout is finished", async () => {
    const s = await scenario();
    await s.publishedProgram();
    const [exercise] = await db.select({ id: schema.exercises.id }).from(schema.exercises).limit(1);
    if (!exercise) throw new Error("setup: library empty");

    const detail = await s.person.agent.get(`/c/${s.studio.id}/exercises/${exercise.id}`);
    const body = detail.body as { history: unknown[]; stats: { maxWeightKg: number | null } };
    expect(body.history).toHaveLength(0);
    expect(body.stats.maxWeightKg).toBeNull();
  });

  it("aggregates max weight, max reps and total volume across finished sessions only", async () => {
    const s = await scenario();
    const program = await s.publishedProgram();
    const start = await s.person.agent.post(
      `${workoutsPath(s.studio.id)}/${program.templateId}/sessions/${program.sessionId}/start`,
      {},
    );
    const sessionId = (start.body as StartBody).session.id;
    await s.person.agent.put(`/c/${s.studio.id}/training-sessions/${sessionId}/sets`, {
      sessionExerciseId: program.sessionExerciseId,
      setNumber: 1,
      reps: 10,
      loadKg: 50,
    });
    await s.person.agent.put(`/c/${s.studio.id}/training-sessions/${sessionId}/sets`, {
      sessionExerciseId: program.sessionExerciseId,
      setNumber: 2,
      reps: 6,
      loadKg: 60,
    });
    // Not finished: must not count toward stats or history yet.
    const [exercise] = await db.select({ id: schema.exercises.id }).from(schema.exercises).limit(1);
    if (!exercise) throw new Error("setup: library empty");
    const before = await s.person.agent.get(`/c/${s.studio.id}/exercises/${exercise.id}`);
    expect((before.body as { history: unknown[] }).history).toHaveLength(0);

    await s.person.agent.post(`/c/${s.studio.id}/training-sessions/${sessionId}/finish`, {});

    const after = await s.person.agent.get(`/c/${s.studio.id}/exercises/${exercise.id}`);
    const body = after.body as {
      history: { date: string; sets: { reps: number; loadKg: number }[] }[];
      stats: { maxWeightKg: number; maxReps: number; totalVolumeKg: number };
    };
    expect(body.history).toHaveLength(1);
    expect(body.stats).toMatchObject({
      maxWeightKg: 60,
      maxReps: 10,
      totalVolumeKg: 10 * 50 + 6 * 60,
    });
  });
});
