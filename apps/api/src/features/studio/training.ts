import { applyExerciseCustomizations } from "../../library/exercise-customizations.js";
import { Router } from "express";
import { schema } from "@traiv/db";
import { and, asc, desc, eq, isNotNull, inArray } from "drizzle-orm";
import { db } from "../../db.js";
import { notFound } from "../../errors.js";
import { developmentClient } from "./development.js";
import { getExerciseDetail } from "../client/workouts.js";

export const trainingRouter: Router = Router({ mergeParams: true });
trainingRouter.get("/", async (req, res) => {
  const { id: studioId, clientId } = req.params as Record<string, string>;
  await developmentClient(studioId!, clientId!);
  const sessions = await db
    .select({
      session: schema.sessions_,
      name: schema.workoutSessions.name,
      programName: schema.workoutTemplates.name,
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
    .where(and(eq(schema.sessions_.clientId, clientId!), isNotNull(schema.sessions_.completedAt)))
    .orderBy(desc(schema.sessions_.completedAt));
  const ids = sessions.map((r) => r.session.id);
  const logs = ids.length
    ? await db
        .select({
          exercise: schema.exercises,
          log: schema.setLogs,
          prescription: {
            loadKg: schema.exerciseSets.weightKg,
            repsMin: schema.exerciseSets.reps,
            repsMax: schema.exerciseSets.repsMax,
          },
        })
        .from(schema.setLogs)
        .innerJoin(
          schema.sessionExercises,
          eq(schema.sessionExercises.id, schema.setLogs.sessionExerciseId),
        )
        .innerJoin(schema.exercises, eq(schema.exercises.id, schema.sessionExercises.exerciseId))
        .leftJoin(schema.exerciseSets, eq(schema.exerciseSets.id, schema.setLogs.exerciseSetId))
        .where(inArray(schema.setLogs.sessionId, ids))
        .orderBy(asc(schema.setLogs.setNumber))
    : [];
  const displayExercises = await applyExerciseCustomizations(
    studioId!,
    logs.map((l) => l.exercise),
    (e) => e.id,
  );
  const displayLogs = logs.map((log, i) => ({ ...log, exercise: displayExercises[i] }));
  res.json(
    sessions.map((r) => ({
      ...r.session,
      name: r.name ?? "Workout",
      programName: r.programName,
      exercises: displayLogs.filter((l) => l.log.sessionId === r.session.id),
    })),
  );
});
trainingRouter.get("/:sessionId/history", async (req, res) => {
  const { id: studioId, clientId, sessionId } = req.params as Record<string, string>;
  await developmentClient(studioId!, clientId!);
  const [session] = await db
    .select()
    .from(schema.sessions_)
    .where(and(eq(schema.sessions_.id, sessionId!), eq(schema.sessions_.clientId, clientId!)));
  if (!session) throw notFound();
  const rows = await db
    .select({ id: schema.sessionExercises.exerciseId })
    .from(schema.setLogs)
    .innerJoin(
      schema.sessionExercises,
      eq(schema.sessionExercises.id, schema.setLogs.sessionExerciseId),
    )
    .where(eq(schema.setLogs.sessionId, sessionId!));
  res.json(
    await Promise.all(
      [...new Set(rows.map((r) => r.id))].map(async (id) => ({
        id,
        ...(await getExerciseDetail(clientId!, id)),
      })),
    ),
  );
});
trainingRouter.delete("/:sessionId", async (req, res) => {
  const { id: studioId, clientId, sessionId } = req.params as Record<string, string>;
  await developmentClient(studioId!, clientId!);
  await db.transaction(async (tx) => {
    const removed = await tx
      .delete(schema.sessions_)
      .where(and(eq(schema.sessions_.id, sessionId!), eq(schema.sessions_.clientId, clientId!)))
      .returning();
    if (!removed.length) throw notFound();
    await tx
      .delete(schema.messages)
      .where(
        and(
          eq(schema.messages.clientId, clientId!),
          eq(schema.messages.kind, "workout"),
          eq(schema.messages.sourceId, sessionId!),
        ),
      );
  });
  res.json({ deleted: true });
});
