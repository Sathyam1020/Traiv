import {
  customization,
  applyExerciseCustomizations,
} from "../../library/exercise-customizations.js";
import { enrichDemonstration } from "../../library/exercise-api.js";
import { activity } from "../messaging/service.js";
import { newId, schema } from "@traiv/db";
import { and, asc, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { badRequest, notFound } from "../../errors.js";

/**
 * The client's own workouts — their copies, verified against the real trainer and
 * client surface rather than inferred. ADR 0024.
 *
 * A client never reads a studio template directly. Every programme they can see is a
 * `workout_template` row with `clientId` set to them — the product of "Duplicate from
 * Template" or "Create new program" — and `status = 'active'`. A draft copy is invisible
 * even once it exists, which is the rule the trainer app states outright: "even if the
 * template is assigned to a client in draft stage the client doesn't see it, only after
 * publishing."
 */

const HISTORY_ROWS = 120;

/**
 * Every published programme this client has, newest first — with enough on each row
 * for the list screen to decide, without a second request, whether tapping it goes
 * straight into the one session ("Chest & Quads · 2 Exercises") or into a session
 * picker first ("N sessions", named).
 */
export async function listClientPrograms(clientId: string) {
  const rows = await db
    .select({
      id: schema.workoutTemplates.id,
      name: schema.workoutTemplates.name,
      description: schema.workoutTemplates.description,
      imageUrl: schema.workoutTemplates.imageUrl,
      source: schema.workoutTemplates.source,
      updatedAt: schema.workoutTemplates.updatedAt,
      // Qualified explicitly: an interpolated Drizzle column renders unqualified inside
      // `sql`, which silently resolves against the wrong table.
      sessions: sql<number>`(
        select count(*) from workout_session ws
        where ws.template_id = ${sql.raw('"workout_template"."id"')}
      )`,
      sessionNames: sql<string[]>`(
        select coalesce(array_agg(ws.name order by ws.position), '{}')
        from workout_session ws
        where ws.template_id = ${sql.raw('"workout_template"."id"')}
      )`,
      exercises: sql<number>`(
        select count(*) from session_exercise se
        join workout_session ws on ws.id = se.session_id
        where ws.template_id = ${sql.raw('"workout_template"."id"')}
      )`,
      muscleGroups: sql<string[]>`(
        select coalesce(array_agg(distinct ex.muscle order by ex.muscle), '{}')
        from session_exercise se
        join workout_session ws on ws.id = se.session_id
        join exercise ex on ex.id = se.exercise_id
        where ws.template_id = ${sql.raw('"workout_template"."id"')}
      )`,
    })
    .from(schema.workoutTemplates)
    .where(
      and(
        eq(schema.workoutTemplates.clientId, clientId),
        eq(schema.workoutTemplates.status, "active"),
        isNull(schema.workoutTemplates.archivedAt),
      ),
    )
    .orderBy(desc(schema.workoutTemplates.updatedAt));

  const ids = rows.map((r) => r.id);
  const sessions = ids.length
    ? await db
        .select({
          id: schema.workoutSessions.id,
          templateId: schema.workoutSessions.templateId,
          name: schema.workoutSessions.name,
          exercises: sql<number>`(select count(*)::int from session_exercise se where se.session_id = ${sql.raw('"workout_session"."id"')})`,
          muscleGroups: sql<
            string[]
          >`(select coalesce(array_agg(distinct ex.muscle order by ex.muscle), '{}') from session_exercise se join exercise ex on ex.id = se.exercise_id where se.session_id = ${sql.raw('"workout_session"."id"')})`,
        })
        .from(schema.workoutSessions)
        .where(inArray(schema.workoutSessions.templateId, ids))
        .orderBy(asc(schema.workoutSessions.position), asc(schema.workoutSessions.id))
    : [];

  return rows.map((r) => ({
    ...r,
    sessionItems: sessions
      .filter((session) => session.templateId === r.id)
      .map((session) => ({ ...session, exercises: Number(session.exercises) })),
    sessions: Number(r.sessions),
    exercises: Number(r.exercises),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

/** One programme's sessions, each with whether it has ever been trained. */
export async function getProgram(clientId: string, templateId: string) {
  const template = await assertOwnedPublished(clientId, templateId);

  const sessions = await db
    .select({
      id: schema.workoutSessions.id,
      name: schema.workoutSessions.name,
      position: schema.workoutSessions.position,
    })
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.templateId, templateId))
    .orderBy(asc(schema.workoutSessions.position));

  const sessionIds = sessions.map((s) => s.id);

  const [exerciseCounts, lastSessions] = await Promise.all([
    sessionIds.length
      ? db
          .select({ sessionId: schema.sessionExercises.sessionId })
          .from(schema.sessionExercises)
          .where(inArray(schema.sessionExercises.sessionId, sessionIds))
      : [],
    sessionIds.length
      ? db
          .select({
            workoutSessionId: schema.sessions_.workoutSessionId,
            completedAt: schema.sessions_.completedAt,
          })
          .from(schema.sessions_)
          .where(
            and(
              eq(schema.sessions_.clientId, clientId),
              inArray(schema.sessions_.workoutSessionId, sessionIds),
            ),
          )
          .orderBy(desc(schema.sessions_.startedAt))
      : [],
  ]);

  return {
    template: { id: template.id, name: template.name, description: template.description },
    sessions: sessions.map((s) => ({
      id: s.id,
      name: s.name,
      exercises: exerciseCounts.filter((e) => e.sessionId === s.id).length,
      lastCompletedAt:
        lastSessions
          .find((t) => t.workoutSessionId === s.id && t.completedAt)
          ?.completedAt?.toISOString() ?? null,
    })),
  };
}

/** One session: the exercises, their fields, prescribed sets, and last-time history. */
export async function getSession(clientId: string, templateId: string, sessionId: string) {
  await assertOwnedPublished(clientId, templateId);

  const [session] = await db
    .select({
      id: schema.workoutSessions.id,
      name: schema.workoutSessions.name,
      templateId: schema.workoutSessions.templateId,
    })
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.id, sessionId))
    .limit(1);

  if (!session || session.templateId !== templateId) throw notFound("No such workout.");

  const exerciseRows = await db
    .select({
      id: schema.sessionExercises.id,
      position: schema.sessionExercises.position,
      fields: schema.sessionExercises.fields,
      supersetGroup: schema.sessionExercises.supersetGroup,
      note: schema.sessionExercises.note,
      exerciseId: schema.exercises.id,
      name: schema.exercises.name,
      muscle: schema.exercises.muscle,
      equipment: schema.exercises.equipment,
      imageUrl: schema.exercises.imageUrl,
      videoUrl: schema.exercises.videoUrl,
    })
    .from(schema.sessionExercises)
    .innerJoin(schema.exercises, eq(schema.exercises.id, schema.sessionExercises.exerciseId))
    .where(eq(schema.sessionExercises.sessionId, sessionId))
    .orderBy(asc(schema.sessionExercises.position));

  const exerciseIds = exerciseRows.map((e) => e.id);
  const [sets, live, history] = await Promise.all([
    exerciseIds.length
      ? db
          .select()
          .from(schema.exerciseSets)
          .where(inArray(schema.exerciseSets.sessionExerciseId, exerciseIds))
          .orderBy(asc(schema.exerciseSets.position))
      : [],
    openSessionFor(clientId, sessionId),
    lastTimeFor(clientId, exerciseIds),
  ]);

  const [client] = await db
    .select({ studioId: schema.clients.studioId })
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId));
  const displayExercises = client
    ? await applyExerciseCustomizations(client.studioId, exerciseRows, (e) => e.exerciseId)
    : exerciseRows;
  return {
    session: { id: session.id, name: session.name },
    live,
    exercises: displayExercises.map((e) => ({
      ...e,
      sets: sets.filter((s) => s.sessionExerciseId === e.id),
      lastTime: history.get(e.id) ?? [],
    })),
  };
}

/** What this client logged last time they did this exercise — across any past session. */
async function lastTimeFor(clientId: string, sessionExerciseIds: string[]) {
  const out = new Map<
    string,
    { setNumber: number; reps: number | null; loadKg: number | null }[]
  >();
  if (sessionExerciseIds.length === 0) return out;

  const rows = await db
    .select({
      sessionExerciseId: schema.setLogs.sessionExerciseId,
      sessionId: schema.setLogs.sessionId,
      setNumber: schema.setLogs.setNumber,
      reps: schema.setLogs.reps,
      loadKg: schema.setLogs.loadKg,
      loggedAt: schema.setLogs.loggedAt,
    })
    .from(schema.setLogs)
    .innerJoin(schema.sessions_, eq(schema.sessions_.id, schema.setLogs.sessionId))
    .where(
      and(
        eq(schema.sessions_.clientId, clientId),
        inArray(schema.setLogs.sessionExerciseId, sessionExerciseIds),
      ),
    )
    .orderBy(desc(schema.setLogs.loggedAt))
    .limit(HISTORY_ROWS);

  const newestSession = new Map<string, string>();
  for (const r of rows) {
    if (!r.sessionExerciseId) continue;
    const seen = newestSession.get(r.sessionExerciseId);
    if (seen === undefined) newestSession.set(r.sessionExerciseId, r.sessionId);
    if ((seen ?? r.sessionId) !== r.sessionId) continue;
    const list = out.get(r.sessionExerciseId) ?? [];
    list.push({ setNumber: r.setNumber, reps: r.reps, loadKg: r.loadKg });
    out.set(r.sessionExerciseId, list);
  }
  for (const list of out.values()) list.sort((a, b) => a.setNumber - b.setNumber);
  return out;
}

async function openSessionFor(clientId: string, workoutSessionId: string) {
  const [s] = await db
    .select({
      id: schema.sessions_.id,
      startedAt: schema.sessions_.startedAt,
      completedAt: schema.sessions_.completedAt,
    })
    .from(schema.sessions_)
    .where(
      and(
        eq(schema.sessions_.clientId, clientId),
        eq(schema.sessions_.workoutSessionId, workoutSessionId),
      ),
    )
    .orderBy(desc(schema.sessions_.startedAt))
    .limit(1);

  if (!s || s.completedAt) return null;
  return { id: s.id, startedAt: s.startedAt.toISOString(), sets: await setsFor(s.id) };
}

async function setsFor(sessionId: string) {
  return db
    .select({
      sessionExerciseId: schema.setLogs.sessionExerciseId,
      setNumber: schema.setLogs.setNumber,
      reps: schema.setLogs.reps,
      loadKg: schema.setLogs.loadKg,
      completed: schema.setLogs.completed,
    })
    .from(schema.setLogs)
    .where(eq(schema.setLogs.sessionId, sessionId))
    .orderBy(asc(schema.setLogs.setNumber));
}

/** Start training this session, or hand back the one already open — never a second. */
export async function startSession(clientId: string, templateId: string, workoutSessionId: string) {
  await assertOwnedPublished(clientId, templateId);

  const [session] = await db
    .select({ id: schema.workoutSessions.id })
    .from(schema.workoutSessions)
    .where(
      and(
        eq(schema.workoutSessions.id, workoutSessionId),
        eq(schema.workoutSessions.templateId, templateId),
      ),
    )
    .limit(1);
  if (!session) throw notFound("No such workout.");

  const existing = await openSessionFor(clientId, workoutSessionId);
  if (existing) return existing;

  const id = newId();
  await db.insert(schema.sessions_).values({
    id,
    clientId,
    workoutSessionId,
    date: new Date().toISOString().slice(0, 10),
  });
  return { id, startedAt: new Date().toISOString(), sets: [] };
}

export async function logSet(
  clientId: string,
  trainingSessionId: string,
  input: {
    sessionExerciseId: string;
    setNumber: number;
    reps: number | null;
    loadKg: number | null;
    completed: boolean;
  },
) {
  await assertSession(clientId, trainingSessionId);

  await db
    .insert(schema.setLogs)
    .values({ id: newId(), sessionId: trainingSessionId, ...input })
    .onConflictDoUpdate({
      target: [
        schema.setLogs.sessionId,
        schema.setLogs.sessionExerciseId,
        schema.setLogs.setNumber,
      ],
      set: {
        reps: input.reps,
        loadKg: input.loadKg,
        completed: input.completed,
        loggedAt: new Date(),
      },
    });

  return setsFor(trainingSessionId);
}

/**
 * Swiped away. Whether this was the exercise's last *row* is a client-side question —
 * the client is the one holding the prescribed-but-never-logged rows this table has
 * never heard of — so this just removes the one log it does know about.
 */
export async function deleteSet(
  clientId: string,
  trainingSessionId: string,
  sessionExerciseId: string,
  setNumber: number,
) {
  await assertSession(clientId, trainingSessionId);

  await db
    .delete(schema.setLogs)
    .where(
      and(
        eq(schema.setLogs.sessionId, trainingSessionId),
        eq(schema.setLogs.sessionExerciseId, sessionExerciseId),
        eq(schema.setLogs.setNumber, setNumber),
      ),
    );

  return setsFor(trainingSessionId);
}

/** "Cancel Workout" in the Leave-Workout sheet — discards everything, not just a pause. */
export async function cancelSession(clientId: string, trainingSessionId: string) {
  const [row] = await db
    .select({ clientId: schema.sessions_.clientId, completedAt: schema.sessions_.completedAt })
    .from(schema.sessions_)
    .where(eq(schema.sessions_.id, trainingSessionId))
    .limit(1);
  if (!row || row.clientId !== clientId) throw notFound("No such session.");
  if (row.completedAt) throw badRequest("already_finished", "That workout is already done.");

  await db.delete(schema.sessions_).where(eq(schema.sessions_.id, trainingSessionId));
}

/**
 * Finish.
 *
 * Totals are computed here and frozen onto the row — not derived at read time — so an
 * exercise edited or removed from the library later cannot change what somebody lifted.
 * This is also where `client.activated_at` is set: "the activation metric, set on their
 * first logged workout, never before" (schema.ts), the number the product is judged on.
 */
export async function finishSession(
  clientId: string,
  trainingSessionId: string,
  input: {
    quality?: number | null;
    intensity?: number | null;
    note?: string | null;
    totalSeconds?: number | null;
  },
) {
  const [prior] = await db
    .select()
    .from(schema.sessions_)
    .where(
      and(eq(schema.sessions_.id, trainingSessionId), eq(schema.sessions_.clientId, clientId)),
    );
  if (!prior) throw notFound();
  if (prior.completedAt) return prior;
  await assertSession(clientId, trainingSessionId);

  const sets = await setsFor(trainingSessionId);
  const completed = sets.filter((s) => s.completed);

  return db.transaction(async (tx) => {
    await tx.execute(sql`select id from training_session where id=${trainingSessionId} for update`);
    const [locked] = await tx
      .select()
      .from(schema.sessions_)
      .where(eq(schema.sessions_.id, trainingSessionId));
    if (locked?.completedAt) return locked;
    await tx
      .update(schema.sessions_)
      .set({
        completedAt: new Date(),
        quality: input.quality ?? null,
        intensity: input.intensity ?? null,
        note: input.note ?? null,
        totalSeconds: input.totalSeconds ?? null,
        totalSets: sets.length,
        totalCompletedSets: completed.length,
        totalReps: sum(completed.map((s) => s.reps)),
        totalWeightLiftedKg: sum(
          completed.map((s) => (s.reps && s.loadKg ? s.reps * s.loadKg : null)),
        ),
      })
      .where(eq(schema.sessions_.id, trainingSessionId));

    await tx
      .update(schema.clients)
      .set({ activatedAt: new Date() })
      .where(and(eq(schema.clients.id, clientId), isNull(schema.clients.activatedAt)));

    const [row] = await tx
      .select()
      .from(schema.sessions_)
      .where(eq(schema.sessions_.id, trainingSessionId))
      .limit(1);
    await activity(tx, clientId, "workout", trainingSessionId);
    return row;
  });
}

const sum = (values: (number | null)[]): number | null => {
  const real = values.filter((v): v is number => v !== null);
  return real.length ? real.reduce((a, b) => a + b, 0) : null;
};

/**
 * One exercise's own detail screen: its info, every finished session that touched it
 * (grouped by date, for the History tab and — reusing the same rows — the Notes tab,
 * since a "note" is just that session's own `training_session.note`), and the
 * cross-session stats the Charts tab shows.
 *
 * Scoped by `exercise_id`, not by one `session_exercise` row: the same exercise recurs
 * across different templates and sessions over time, and "my history with Bench Press"
 * means all of it, not just the copy sitting in the workout open right now.
 */
export async function getExerciseDetail(clientId: string, exerciseId: string, includeMedia = true) {
  const [client] = await db
    .select({ studioId: schema.clients.studioId })
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId));
  if (!client) throw notFound("No such client.");
  const [exercise] = await db
    .select({
      id: schema.exercises.id,
      name: schema.exercises.name,
      muscle: schema.exercises.muscle,
      equipment: schema.exercises.equipment,
      imageUrl: schema.exercises.imageUrl,
      videoUrl: schema.exercises.videoUrl,
      description: schema.exercises.description,
      cues: schema.exercises.cues,
      studioId: schema.exercises.studioId,
    })
    .from(schema.exercises)
    .where(
      and(
        eq(schema.exercises.id, exerciseId),
        sql`(${schema.exercises.studioId} is null or ${schema.exercises.studioId} = ${client.studioId})`,
      ),
    )
    .limit(1);
  if (!exercise) throw notFound("No such exercise.");

  const rows = await db
    .select({
      sessionId: schema.setLogs.sessionId,
      setNumber: schema.setLogs.setNumber,
      reps: schema.setLogs.reps,
      loadKg: schema.setLogs.loadKg,
      date: schema.sessions_.date,
      note: schema.sessions_.note,
    })
    .from(schema.setLogs)
    .innerJoin(
      schema.sessionExercises,
      eq(schema.sessionExercises.id, schema.setLogs.sessionExerciseId),
    )
    .innerJoin(schema.sessions_, eq(schema.sessions_.id, schema.setLogs.sessionId))
    .where(
      and(
        eq(schema.sessionExercises.exerciseId, exerciseId),
        eq(schema.sessions_.clientId, clientId),
        isNotNull(schema.sessions_.completedAt),
        eq(schema.setLogs.completed, true),
      ),
    )
    .orderBy(desc(schema.sessions_.date), asc(schema.setLogs.setNumber));

  const byDate = new Map<string, { note: string | null; sets: typeof rows }>();
  for (const r of rows) {
    const entry = byDate.get(r.date) ?? { note: r.note, sets: [] };
    entry.sets.push(r);
    byDate.set(r.date, entry);
  }

  const history = [...byDate.entries()].map(([date, { note, sets }]) => ({
    date,
    note,
    sets: sets.map((s) => ({ setNumber: s.setNumber, reps: s.reps, loadKg: s.loadKg })),
  }));

  const loads = rows.map((r) => r.loadKg).filter((v): v is number => v !== null);
  const reps = rows.map((r) => r.reps).filter((v): v is number => v !== null);
  const volumeByDate = [...byDate.entries()]
    .map(([date, { sets }]) => ({
      date,
      volumeKg: sum(sets.map((s) => (s.reps && s.loadKg ? s.reps * s.loadKg : null))) ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const edited = client ? await customization(client.studioId, exerciseId) : undefined;
  const display = edited
    ? {
        ...exercise,
        ...edited.data,
        customized: true,
        mediaRevision: edited.updatedAt.toISOString(),
      }
    : { ...exercise, customized: Boolean(exercise.studioId) };
  return {
    exercise:
      edited || exercise.studioId || !includeMedia ? display : await enrichDemonstration(display),
    history,
    stats: {
      maxWeightKg: loads.length ? Math.max(...loads) : null,
      maxReps: reps.length ? Math.max(...reps) : null,
      totalVolumeKg: sum(rows.map((r) => (r.reps && r.loadKg ? r.reps * r.loadKg : null))),
      series: volumeByDate,
    },
  };
}

/** 404, not 403: a client has no business learning whether a template id exists at all. */
async function assertOwnedPublished(clientId: string, templateId: string) {
  const [row] = await db
    .select({
      id: schema.workoutTemplates.id,
      name: schema.workoutTemplates.name,
      description: schema.workoutTemplates.description,
      clientId: schema.workoutTemplates.clientId,
      status: schema.workoutTemplates.status,
    })
    .from(schema.workoutTemplates)
    .where(
      and(eq(schema.workoutTemplates.id, templateId), isNull(schema.workoutTemplates.archivedAt)),
    )
    .limit(1);

  if (!row || row.clientId !== clientId || row.status !== "active") {
    throw notFound("No such workout.");
  }
  return row;
}

async function assertSession(clientId: string, trainingSessionId: string): Promise<void> {
  const [row] = await db
    .select({ clientId: schema.sessions_.clientId })
    .from(schema.sessions_)
    .where(eq(schema.sessions_.id, trainingSessionId))
    .limit(1);
  if (!row || row.clientId !== clientId) throw notFound("No such session.");
}

export { badRequest };
