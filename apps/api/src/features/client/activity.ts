import { createHash } from "node:crypto";
import { schema } from "@traiv/db";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { AppError, badRequest, notFound } from "../../errors.js";
import { applyExerciseCustomizations } from "../../library/exercise-customizations.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
export const clientActivity: Router = Router({ mergeParams: true });
const identity = z.string().min(1).max(500);
async function setsFor(id: string, executor: Pick<typeof db, "select"> = db) {
  return executor
    .select({
      id: schema.setLogs.id,
      exerciseId: schema.exercises.id,
      sessionExerciseId: schema.setLogs.sessionExerciseId,
      setNumber: schema.setLogs.setNumber,
      completed: schema.setLogs.completed,
      reps: schema.setLogs.reps,
      loadKg: schema.setLogs.loadKg,
      seconds: schema.setLogs.seconds,
      distanceM: schema.setLogs.distanceM,
      calories: schema.setLogs.calories,
      restSeconds: schema.setLogs.restSeconds,
      loggedAt: schema.setLogs.loggedAt,
      name: schema.exercises.name,
      imageUrl: schema.exercises.imageUrl,
      fields: schema.sessionExercises.fields,
      repsMin: schema.exerciseSets.reps,
      repsMax: schema.exerciseSets.repsMax,
    })
    .from(schema.setLogs)
    .leftJoin(
      schema.sessionExercises,
      eq(schema.sessionExercises.id, schema.setLogs.sessionExerciseId),
    )
    .leftJoin(schema.exercises, eq(schema.exercises.id, schema.sessionExercises.exerciseId))
    .leftJoin(schema.exerciseSets, eq(schema.exerciseSets.id, schema.setLogs.exerciseSetId))
    .where(eq(schema.setLogs.sessionId, id))
    .orderBy(
      asc(schema.sessionExercises.position),
      asc(schema.setLogs.setNumber),
      asc(schema.setLogs.id),
    );
}
function version(session: unknown, sets: unknown) {
  return createHash("sha256").update(JSON.stringify({ session, sets })).digest("hex");
}
async function detail(clientId: string, id: string) {
  if (id.startsWith("health:")) {
    const [row] = await db
      .select()
      .from(schema.healthWorkouts)
      .where(
        and(
          eq(schema.healthWorkouts.clientId, clientId),
          eq(schema.healthWorkouts.externalId, id.slice(7)),
        ),
      );
    if (!row) throw notFound();
    return {
      id,
      kind: "health" as const,
      name: row.type,
      programName: row.source ?? "Health workout",
      completedAt: row.endedAt,
      totalSeconds: row.duration,
      quality: null,
      intensity: null,
      note: null,
      sets: [],
      version: null,
      editable: false,
    };
  }
  const [session] = await db
    .select()
    .from(schema.sessions_)
    .where(
      and(
        eq(schema.sessions_.id, z.string().uuid().parse(id)),
        eq(schema.sessions_.clientId, clientId),
        isNotNull(schema.sessions_.completedAt),
      ),
    );
  if (!session) throw notFound("Activity not found.");
  const [names] = session.workoutSessionId
    ? await db
        .select({ name: schema.workoutSessions.name, programName: schema.workoutTemplates.name })
        .from(schema.workoutSessions)
        .innerJoin(
          schema.workoutTemplates,
          eq(schema.workoutTemplates.id, schema.workoutSessions.templateId),
        )
        .where(eq(schema.workoutSessions.id, session.workoutSessionId))
    : [];
  const sets = await setsFor(id);
  const [client] = await db
    .select({ studioId: schema.clients.studioId })
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId));
  const displaySets = client
    ? await applyExerciseCustomizations(client.studioId, sets, (s) => s.exerciseId ?? "")
    : sets;
  return {
    ...session,
    kind: "workout" as const,
    name: names?.name ?? "Workout",
    programName: names?.programName ?? "Workout history",
    sets: displaySets,
    version: version(session, sets),
    editable: true,
  };
}
clientActivity.get("/", requireClient(), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  const { page, limit } = z
    .object({
      page: z.coerce.number().int().min(1).max(10000).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(25),
    })
    .parse(req.query);
  const take = page * limit + 1;
  const [workouts, health] = await Promise.all([
    db
      .select({
        id: schema.sessions_.id,
        name: schema.workoutSessions.name,
        programName: schema.workoutTemplates.name,
        completedAt: schema.sessions_.completedAt,
        date: schema.sessions_.date,
        quality: schema.sessions_.quality,
        intensity: schema.sessions_.intensity,
        totalSeconds: schema.sessions_.totalSeconds,
        totalWeightLiftedKg: schema.sessions_.totalWeightLiftedKg,
        exerciseCount: sql<number>`(select count(distinct coalesce(session_exercise_id,id))::int from set_log where session_id=${schema.sessions_.id})`,
      })
      .from(schema.sessions_)
      .leftJoin(
        schema.workoutSessions,
        eq(schema.workoutSessions.id, schema.sessions_.workoutSessionId),
      )
      .leftJoin(
        schema.workoutTemplates,
        eq(schema.workoutTemplates.id, schema.workoutSessions.templateId),
      )
      .where(and(eq(schema.sessions_.clientId, clientId), isNotNull(schema.sessions_.completedAt)))
      .orderBy(desc(schema.sessions_.completedAt), desc(schema.sessions_.id))
      .limit(take),
    db
      .select()
      .from(schema.healthWorkouts)
      .where(eq(schema.healthWorkouts.clientId, clientId))
      .orderBy(desc(schema.healthWorkouts.endedAt), desc(schema.healthWorkouts.externalId))
      .limit(take),
  ]);
  const rows = [
    ...workouts.map((w) => ({ ...w, name: w.name ?? "Workout", kind: "workout" as const })),
    ...health.map((w) => ({
      id: `health:${w.externalId}`,
      name: w.type,
      programName: w.source,
      kind: "health" as const,
      completedAt: w.endedAt,
      date: w.startedAt.toISOString().slice(0, 10),
      quality: null,
      intensity: null,
      totalSeconds: w.duration,
      totalWeightLiftedKg: null,
      exerciseCount: 0,
    })),
  ].sort(
    (a, b) =>
      new Date(b.completedAt ?? b.date).getTime() - new Date(a.completedAt ?? a.date).getTime() ||
      b.id.localeCompare(a.id),
  );
  res.json({
    activities: rows.slice((page - 1) * limit, page * limit),
    hasMore: rows.length > page * limit,
  });
});
clientActivity.get("/:activityId", requireClient(), async (req, res) =>
  res.json(await detail(requireClientAuth(req).clientId, identity.parse(req.params.activityId))),
);
const value = z.number().finite().min(0).max(100000).nullable();
const input = z.object({
  version: z.string().length(64),
  quality: z.number().int().min(1).max(5).nullable(),
  intensity: z.number().int().min(1).max(5).nullable(),
  note: z.string().max(4000).nullable(),
  sets: z
    .array(
      z.object({
        id: z.string().uuid(),
        completed: z.boolean(),
        reps: z.number().int().min(0).max(1000).nullable(),
        loadKg: z.number().min(0).max(1000).nullable(),
        seconds: value.refine((v) => v === null || Number.isInteger(v)),
        distanceM: value,
        calories: value.refine((v) => v === null || Number.isInteger(v)),
        restSeconds: value.refine((v) => v === null || Number.isInteger(v)),
      }),
    )
    .max(500),
});
clientActivity.put("/:activityId", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  const id = z.string().uuid().parse(req.params.activityId),
    v = input.parse(req.body);
  await db.transaction(async (tx) => {
    const [session] = await tx
      .select()
      .from(schema.sessions_)
      .where(
        and(
          eq(schema.sessions_.id, z.string().uuid().parse(id)),
          eq(schema.sessions_.clientId, clientId),
          isNotNull(schema.sessions_.completedAt),
        ),
      )
      .for("update");
    if (!session) throw notFound();
    const sets = await setsFor(id, tx);
    if (version(session, sets) !== v.version)
      throw new AppError(
        409,
        "activity_changed",
        "This activity changed. Reload it before saving.",
      );
    if (
      v.sets.length !== sets.length ||
      new Set(v.sets.map((s) => s.id)).size !== sets.length ||
      v.sets.some((s) => !sets.some((original) => original.id === s.id))
    )
      throw badRequest("invalid_sets", "Only this activity’s recorded sets can be edited.");
    for (const set of v.sets) {
      const { id: setId, ...values } = set;
      await tx
        .update(schema.setLogs)
        .set({ ...values, loggedAt: new Date() })
        .where(and(eq(schema.setLogs.id, setId), eq(schema.setLogs.sessionId, id)));
    }
    const completed = v.sets.filter((s) => s.completed),
      sum = (key: "reps" | "seconds" | "distanceM" | "calories") =>
        completed.reduce((n, s) => n + (s[key] ?? 0), 0);
    await tx
      .update(schema.sessions_)
      .set({
        quality: v.quality,
        intensity: v.intensity,
        note: v.note,
        totalSets: v.sets.length,
        totalCompletedSets: completed.length,
        totalReps: sum("reps"),
        totalWeightLiftedKg: completed.reduce((n, s) => n + (s.reps ?? 0) * (s.loadKg ?? 0), 0),
        totalDistanceM: sum("distanceM"),
        totalCalories: sum("calories"),
      })
      .where(eq(schema.sessions_.id, id));
  });
  res.json(await detail(clientId, id));
});
