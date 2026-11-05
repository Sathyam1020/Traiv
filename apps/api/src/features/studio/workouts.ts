import { newId, schema } from "@traiv/db";
import { type ExerciseFacets, matchesExercise, normalizeFilters } from "@traiv/exercises";
import { and, asc, desc, eq, inArray, isNull, notInArray, sql } from "drizzle-orm";
import { db } from "../../db.js";
import { AppError, badRequest, notFound } from "../../errors.js";
import {
  type CatalogOptions,
  enrichDemonstration,
  exerciseApiEnabled,
  isProviderExercise,
  materializeProviderExercise,
  providerExercise,
  providerExerciseFacets,
  providerExercises,
} from "../../library/exercise-api.js";
import {
  applyExerciseCustomizations,
  customization,
  studioExerciseEdits,
} from "../../library/exercise-customizations.js";
import { notifyClient } from "../notifications/service.js";
import { verifyExerciseUploads } from "./uploads.js";

/**
 * The coach's workout templates, and the client-side copies made from them.
 *
 * **Template → Session → Exercise → Set.** Verified against the real trainer app —
 * their Templates list shows "1 session" per row, an empty template says "No session
 * added yet. Create a new session to get started, or copy from another template", and
 * an exercise cannot be added without one. See ADR 0024, which replaces the
 * section/item model the first cut of ADR 0023 inferred from the mobile bundle alone.
 *
 * **Assignment is a copy, not a join.** "Duplicate from Template" on a client's Workouts
 * tab opens "Customize Template" (name, description, image) and produces a new
 * `workout_template` row with `client_id` set and `source: 'coach'` shown to the client
 * as "By coach". Editing a client's copy never touches the studio template it came from,
 * or any other client's.
 */

/* -------------------------------------------------------------------------- */
/* Shapes                                                                      */
/* -------------------------------------------------------------------------- */

export type SetInput = {
  id?: string;
  reps?: number | null;
  repsMax?: number | null;
  weightKg?: number | null;
  seconds?: number | null;
  distanceM?: number | null;
  calories?: number | null;
  restSeconds?: number | null;
};

export type ExerciseInput = {
  id?: string;
  exerciseId: string;
  /** Which columns this exercise's sets show, in order. Copied from the library by default. */
  fields?: string[];
  supersetGroup?: number | null;
  note?: string | null;
  sets: SetInput[];
};

export type SessionInput = {
  id?: string;
  name: string;
  exercises: ExerciseInput[];
};

export type TemplateInput = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  defaultValues?: Record<string, number> | null;
  sessions: SessionInput[];
};

/* -------------------------------------------------------------------------- */
/* Reading                                                                     */
/* -------------------------------------------------------------------------- */

/** The studio's reusable library — client copies are excluded; see `listClientPrograms`. */
export async function listTemplates(studioId: string, opts: { status?: "draft" | "active" } = {}) {
  const rows = await db
    .select({
      id: schema.workoutTemplates.id,
      name: schema.workoutTemplates.name,
      description: schema.workoutTemplates.description,
      imageUrl: schema.workoutTemplates.imageUrl,
      status: schema.workoutTemplates.status,
      createdAt: schema.workoutTemplates.createdAt,
      // Written out qualified: a Drizzle column interpolated into `sql` renders
      // *unqualified*, which silently resolves against the wrong table.
      sessions: sql<number>`(
        select count(*) from workout_session ws
        where ws.template_id = ${sql.raw('"workout_template"."id"')}
      )`,
    })
    .from(schema.workoutTemplates)
    .where(
      and(
        eq(schema.workoutTemplates.studioId, studioId),
        isNull(schema.workoutTemplates.clientId),
        isNull(schema.workoutTemplates.archivedAt),
        ...(opts.status ? [eq(schema.workoutTemplates.status, opts.status)] : []),
      ),
    )
    .orderBy(desc(schema.workoutTemplates.createdAt));

  return rows.map((r) => ({
    ...r,
    sessions: Number(r.sessions),
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * One client's programmes — their copies, newest first, as the coach's Workouts tab on
 * that client shows: Name · Sessions · Muscle groups · Assigned · Status · Source.
 */
export async function listClientPrograms(studioId: string, clientId: string) {
  const rows = await db
    .select({
      id: schema.workoutTemplates.id,
      name: schema.workoutTemplates.name,
      status: schema.workoutTemplates.status,
      source: schema.workoutTemplates.source,
      createdAt: schema.workoutTemplates.createdAt,
      sessions: sql<number>`(
        select count(*) from workout_session ws
        where ws.template_id = ${sql.raw('"workout_template"."id"')}
      )`,
      // Distinct primary muscles across every exercise in the programme — the chips
      // the coach's table shows ("Chest", "Quads") rather than a per-exercise list.
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
        eq(schema.workoutTemplates.studioId, studioId),
        eq(schema.workoutTemplates.clientId, clientId),
        isNull(schema.workoutTemplates.archivedAt),
      ),
    )
    .orderBy(desc(schema.workoutTemplates.createdAt));

  return rows.map((r) => ({
    ...r,
    sessions: Number(r.sessions),
    createdAt: r.createdAt.toISOString(),
  }));
}

/** The full tree, assembled from flat reads rather than a join that fans out. */
export async function getTemplate(studioId: string, templateId: string) {
  const [template] = await db
    .select()
    .from(schema.workoutTemplates)
    .where(
      and(
        eq(schema.workoutTemplates.id, templateId),
        eq(schema.workoutTemplates.studioId, studioId),
        isNull(schema.workoutTemplates.archivedAt),
      ),
    )
    .limit(1);

  if (!template) throw notFound("No such workout.");

  const sessions = await db
    .select()
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.templateId, templateId))
    .orderBy(asc(schema.workoutSessions.position));

  const sessionIds = sessions.map((s) => s.id);

  const exerciseRows = sessionIds.length
    ? await db
        .select({
          id: schema.sessionExercises.id,
          sessionId: schema.sessionExercises.sessionId,
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
        .where(inArray(schema.sessionExercises.sessionId, sessionIds))
        .orderBy(asc(schema.sessionExercises.position))
    : [];

  const exerciseIds = exerciseRows.map((e) => e.id);
  const sets = exerciseIds.length
    ? await db
        .select()
        .from(schema.exerciseSets)
        .where(inArray(schema.exerciseSets.sessionExerciseId, exerciseIds))
        .orderBy(asc(schema.exerciseSets.position))
    : [];

  const displayExercises = await applyExerciseCustomizations(
    studioId,
    exerciseRows,
    (e) => e.exerciseId,
  );
  return {
    ...template,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
    archivedAt: template.archivedAt?.toISOString() ?? null,
    sessions: sessions.map((s) => ({
      ...s,
      exercises: displayExercises
        .filter((e) => e.sessionId === s.id)
        .map((e) => ({ ...e, sets: sets.filter((set) => set.sessionExerciseId === e.id) })),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* Writing                                                                     */
/* -------------------------------------------------------------------------- */

const MAX_SESSIONS = 20;
const MAX_EXERCISES = 40;
const MAX_SETS = 20;

export async function createTemplate(
  studioId: string,
  clientId: string | null,
  membershipId: string | null,
  input: TemplateInput,
) {
  const id = newId();
  await db.insert(schema.workoutTemplates).values({
    id,
    studioId,
    clientId,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    imageUrl: input.imageUrl || null,
    defaultValues: input.defaultValues ?? null,
    status: "draft",
    source: "coach",
    createdBy: membershipId,
  });
  await writeTree(id, input.sessions);
  return getTemplate(studioId, id);
}

/**
 * Replace the tree, preserving ids the builder sent back.
 *
 * `set_log.exercise_set_id` is `on delete set null` — deleting and re-inserting
 * everything would detach every logged set from its prescription. Rows the builder still
 * knows about keep their ids; only rows genuinely removed are deleted.
 */
export async function updateTemplate(studioId: string, templateId: string, input: TemplateInput) {
  await getTemplate(studioId, templateId);

  await db
    .update(schema.workoutTemplates)
    .set({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      imageUrl: input.imageUrl || null,
      defaultValues: input.defaultValues ?? null,
    })
    .where(eq(schema.workoutTemplates.id, templateId));

  await writeTree(templateId, input.sessions);
  return getTemplate(studioId, templateId);
}

async function writeTree(templateId: string, sessions: SessionInput[]) {
  if (sessions.length > MAX_SESSIONS) {
    throw badRequest("too_many_sessions", "That's too many sessions.");
  }

  // Resolve only newly selected provider references before the atomic tree write.
  for (const id of new Set(sessions.flatMap((s) => s.exercises.map((e) => e.exerciseId))))
    await materializeProviderExercise(id);
  await db.transaction(async (tx) => {
    // Free the positive ordering slots before inserting replacements or reordering
    // retained rows. Deletion happens last to preserve references from workout logs.
    // These temporary positions are never visible outside this transaction.
    await tx.execute(sql`select id from workout_template where id = ${templateId} for update`);
    await tx.execute(sql`
      update exercise_set set position = -position - 1
      where session_exercise_id in (
        select id from session_exercise where session_id in (
          select id from workout_session where template_id = ${templateId}
        )
      )
    `);
    await tx.execute(sql`
      update session_exercise set position = -position - 1
      where session_id in (select id from workout_session where template_id = ${templateId})
    `);
    await tx.update(schema.workoutSessions)
      .set({ position: sql`-${schema.workoutSessions.position} - 1` })
      .where(eq(schema.workoutSessions.templateId, templateId));
    const keptSessions: string[] = [];

    for (const [sIndex, session] of sessions.entries()) {
      if (session.exercises.length > MAX_EXERCISES) {
        throw badRequest("too_many_exercises", "That's too many exercises in one session.");
      }

      const sessionId = session.id ?? newId();
      keptSessions.push(sessionId);

      const sessionRow = { templateId, name: session.name.trim() || "Session", position: sIndex };
      if (session.id) {
        await tx
          .update(schema.workoutSessions)
          .set(sessionRow)
          .where(eq(schema.workoutSessions.id, sessionId));
      } else {
        await tx.insert(schema.workoutSessions).values({ id: sessionId, ...sessionRow });
      }

      const keptExercises: string[] = [];

      for (const [eIndex, exercise] of session.exercises.entries()) {
        if (exercise.sets.length > MAX_SETS)
          throw badRequest("too_many_sets", "That's too many sets.");

        const exerciseId = exercise.id ?? newId();
        keptExercises.push(exerciseId);

        const exerciseRow = {
          sessionId,
          exerciseId: exercise.exerciseId,
          position: eIndex,
          fields: exercise.fields ?? ["weight", "reps", "rest"],
          supersetGroup: exercise.supersetGroup ?? null,
          note: exercise.note?.trim() || null,
        };

        if (exercise.id) {
          await tx
            .update(schema.sessionExercises)
            .set(exerciseRow)
            .where(eq(schema.sessionExercises.id, exerciseId));
        } else {
          await tx.insert(schema.sessionExercises).values({ id: exerciseId, ...exerciseRow });
        }

        const keptSets: string[] = [];

        for (const [setIndex, set] of exercise.sets.entries()) {
          const setId = set.id ?? newId();
          keptSets.push(setId);

          const setRow = {
            sessionExerciseId: exerciseId,
            position: setIndex,
            reps: set.reps ?? null,
            repsMax: set.repsMax ?? null,
            weightKg: set.weightKg ?? null,
            seconds: set.seconds ?? null,
            distanceM: set.distanceM ?? null,
            calories: set.calories ?? null,
            restSeconds: set.restSeconds ?? null,
          };

          if (set.id) {
            await tx
              .update(schema.exerciseSets)
              .set(setRow)
              .where(eq(schema.exerciseSets.id, setId));
          } else {
            await tx.insert(schema.exerciseSets).values({ id: setId, ...setRow });
          }
        }

        await tx
          .delete(schema.exerciseSets)
          .where(
            keptSets.length
              ? and(
                  eq(schema.exerciseSets.sessionExerciseId, exerciseId),
                  notInArray(schema.exerciseSets.id, keptSets),
                )
              : eq(schema.exerciseSets.sessionExerciseId, exerciseId),
          );
      }

      await tx
        .delete(schema.sessionExercises)
        .where(
          keptExercises.length
            ? and(
                eq(schema.sessionExercises.sessionId, sessionId),
                notInArray(schema.sessionExercises.id, keptExercises),
              )
            : eq(schema.sessionExercises.sessionId, sessionId),
        );
    }

    await tx
      .delete(schema.workoutSessions)
      .where(
        keptSessions.length
          ? and(
              eq(schema.workoutSessions.templateId, templateId),
              notInArray(schema.workoutSessions.id, keptSessions),
            )
          : eq(schema.workoutSessions.templateId, templateId),
      );
  });
}

export async function archiveTemplate(studioId: string, templateId: string) {
  await getTemplate(studioId, templateId);
  await db
    .update(schema.workoutTemplates)
    .set({ archivedAt: new Date() })
    .where(eq(schema.workoutTemplates.id, templateId));
}

/**
 * Publish or unpublish. The client only ever sees `active` — the trainer app's own
 * confirmation reads "Clients assigned to this template will be able to see it."
 */
export async function setTemplateStatus(
  studioId: string,
  templateId: string,
  status: "draft" | "active",
) {
  await getTemplate(studioId, templateId);
  await db
    .update(schema.workoutTemplates)
    .set({ status })
    .where(eq(schema.workoutTemplates.id, templateId));
  if (status === "active") {
    const [published] = await db
      .select({ clientId: schema.workoutTemplates.clientId })
      .from(schema.workoutTemplates)
      .where(eq(schema.workoutTemplates.id, templateId));
    if (published?.clientId)
      void notifyClient(published.clientId, "content", `workout:${templateId}`, "/workouts").catch(
        () => console.warn("Workout push delivery failed"),
      );
  }
  return getTemplate(studioId, templateId);
}

/**
 * "Duplicate from Template" on a client's Workouts tab.
 *
 * Produces a *new* template row scoped to this client, carrying its own name and
 * description — their "Customize Template" step. The source stays `coach`, which is what
 * the client's list shows as "By coach". A fresh copy starts as a draft: the client must
 * not see it until the coach has had a chance to adjust it for them.
 */
/**
 * The session tree with every id dropped.
 *
 * Shared by every operation that copies a template: duplicating within the library,
 * duplicating onto a client, and turning a client's own programme back into a reusable
 * template. Reusing the source ids anywhere here would make the copy and the original
 * the same rows — editing one would silently edit the other.
 */
function cloneSessions(source: Awaited<ReturnType<typeof getTemplate>>): SessionInput[] {
  return source.sessions.map((s) => ({
    name: s.name,
    exercises: s.exercises.map((e) => ({
      exerciseId: e.exerciseId,
      fields: e.fields,
      supersetGroup: e.supersetGroup,
      note: e.note,
      sets: e.sets.map((set) => ({
        reps: set.reps,
        repsMax: set.repsMax,
        weightKg: set.weightKg,
        seconds: set.seconds,
        distanceM: set.distanceM,
        calories: set.calories,
        restSeconds: set.restSeconds,
      })),
    })),
  }));
}

export async function duplicateTemplateForClient(
  studioId: string,
  templateId: string,
  clientId: string,
  membershipId: string | null,
  overrides: { name?: string; description?: string | null; imageUrl?: string | null } = {},
) {
  const source = await getTemplate(studioId, templateId);

  const [client] = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(
      and(
        eq(schema.clients.id, clientId),
        eq(schema.clients.studioId, studioId),
        isNull(schema.clients.deletedAt),
      ),
    )
    .limit(1);
  if (!client) throw badRequest("unknown_client", "That client isn't on your roster.");

  return createTemplate(studioId, clientId, membershipId, {
    name: overrides.name ?? source.name,
    description: overrides.description ?? source.description,
    imageUrl: overrides.imageUrl ?? source.imageUrl,
    defaultValues: source.defaultValues as Record<string, number> | null,
    sessions: cloneSessions(source),
  });
}

/**
 * "Clone" on the Templates list — a copy within the studio's own library, not scoped to
 * any client. Starts as a draft: a clone is where a coach starts a variation, and
 * publishing it immediately would hand an unreviewed copy to anybody already assigned
 * the original's name.
 */
export async function duplicateTemplate(
  studioId: string,
  templateId: string,
  membershipId: string | null,
) {
  const source = await getTemplate(studioId, templateId);
  return createTemplate(studioId, null, membershipId, {
    name: `${source.name} (copy)`,
    description: source.description,
    imageUrl: source.imageUrl,
    defaultValues: source.defaultValues as Record<string, number> | null,
    sessions: cloneSessions(source),
  });
}

/**
 * "Save as template" on a client's own Workouts row — the reverse of duplicate-from-
 * template: a programme written for one client becomes a reusable studio template,
 * `client_id` null, so it can be duplicated onto anyone else. The client's own copy is
 * untouched; this creates a new row rather than repointing the existing one.
 */
export async function saveClientProgramAsTemplate(
  studioId: string,
  templateId: string,
  membershipId: string | null,
) {
  const source = await getTemplate(studioId, templateId);
  if (!source.clientId) {
    throw badRequest("not_a_client_program", "That's already a studio template.");
  }
  return createTemplate(studioId, null, membershipId, {
    name: source.name,
    description: source.description,
    imageUrl: source.imageUrl,
    defaultValues: source.defaultValues as Record<string, number> | null,
    sessions: cloneSessions(source),
  });
}

/* -------------------------------------------------------------------------- */
/* Exercises                                                                   */
/* -------------------------------------------------------------------------- */

export async function exerciseFacets(studioId: string): Promise<ExerciseFacets> {
  if (exerciseApiEnabled()) return providerExerciseFacets();
  const rows = await db
    .select({
      muscle: schema.exercises.muscle,
      equipment: schema.exercises.equipment,
      category: schema.exercises.category,
    })
    .from(schema.exercises)
    .where(
      and(
        sql`(${schema.exercises.studioId} is null or ${schema.exercises.studioId} = ${studioId})`,
        isNull(schema.exercises.deletedAt),
      ),
    );
  return {
    source: "legacy",
    muscles: [
      ...new Set(rows.map((row) => normalizeFilters({ muscle: row.muscle }).muscle ?? row.muscle)),
    ],
    equipments: [...new Set(rows.map((row) => row.equipment))],
    categories: [...new Set(rows.flatMap((row) => (row.category ? [row.category] : [])))],
    muscleAliases: {},
  };
}

export async function listExercises(studioId: string, opts: CatalogOptions = {}) {
  const filters = normalizeFilters(opts);
  const offset = opts.offset ?? 0;
  if (exerciseApiEnabled()) {
    try {
      return {
        ...(await providerExercises({ ...filters, offset })),
        catalog: "exerciseapi" as const,
      };
    } catch (error) {
      // Surface upstream failure explicitly while keeping owned exercises usable.
      const own = await studioExerciseEdits(studioId);
      if (!own.length || offset) throw error;
      return {
        exercises: [],
        hasMore: false,
        nextOffset: null,
        total: null,
        limitReached: false,
        catalog: "exerciseapi" as const,
        providerError:
          error instanceof AppError ? error.message : "Couldn't load the shared exercise library.",
      };
    }
  }
  const rows = await db
    .select()
    .from(schema.exercises)
    .where(
      and(
        sql`(${schema.exercises.studioId} is null or ${schema.exercises.studioId} = ${studioId})`,
        isNull(schema.exercises.deletedAt),
      ),
    )
    .orderBy(asc(schema.exercises.name));
  const display = await applyExerciseCustomizations(studioId, rows, (row) => row.id);
  const matching = display.filter((row) => matchesExercise(row, filters));
  const page = matching
    .slice(offset, offset + 20)
    .map((row) => ({ ...row, shared: row.studioId === null }));
  const hasMore = offset + page.length < matching.length;
  return {
    exercises: page,
    hasMore,
    nextOffset: hasMore ? offset + page.length : null,
    total: matching.length,
    limitReached: false,
    catalog: "legacy" as const,
  };
}

export async function getExercise(studioId: string, exerciseId: string) {
  const edited = await customization(studioId, exerciseId);
  if (edited)
    return {
      ...edited.data,
      defaultFields: edited.data.defaultFields ?? ["weight", "reps", "rest"],
      id: exerciseId,
      shared: false,
      studioId,
      customized: true,
      mediaRevision: edited.updatedAt.toISOString(),
      createdAt: edited.updatedAt,
      deletedAt: null,
    };
  if (exerciseApiEnabled() && isProviderExercise(exerciseId)) return providerExercise(exerciseId);
  const [row] = await db
    .select()
    .from(schema.exercises)
    .where(
      and(
        eq(schema.exercises.id, exerciseId),
        sql`(${schema.exercises.studioId} is null or ${schema.exercises.studioId} = ${studioId})`,
        isNull(schema.exercises.deletedAt),
      ),
    )
    .limit(1);
  if (!row) throw notFound("No such exercise.");
  return row.studioId === null ? enrichDemonstration(row) : row;
}

export type ExerciseWrite = {
  name: string;
  description?: string | null;
  muscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  pattern: (typeof schema.movementPattern.enumValues)[number];
  imageUrl?: string | null;
  videoUrl?: string | null;
  stimulus?: string | null;
  level?: string | null;
  category?: string | null;
  location?: string | null;
  injuryRisk?: string | null;
  defaultFields?: string[];
};

export async function createExercise(studioId: string, input: ExerciseWrite) {
  await verifyExerciseUploads(studioId, input);
  const [row] = await db
    .insert(schema.exercises)
    .values({ id: newId(), studioId, ...input })
    .returning();
  return row;
}

export async function updateExercise(studioId: string, exerciseId: string, input: ExerciseWrite) {
  await verifyExerciseUploads(studioId, input);
  const [existing] = await db
    .select({ id: schema.exercises.id })
    .from(schema.exercises)
    .where(and(eq(schema.exercises.id, exerciseId), eq(schema.exercises.studioId, studioId)))
    .limit(1);
  if (!existing) {
    // Authorize against the visible shared exercise, then write a studio-only customization.
    await getExercise(studioId, exerciseId);
    await db
      .insert(schema.exerciseCustomizations)
      .values({ studioId, exerciseId, data: input })
      .onConflictDoUpdate({
        target: [schema.exerciseCustomizations.studioId, schema.exerciseCustomizations.exerciseId],
        set: { data: input, updatedAt: new Date() },
      });
    return getExercise(studioId, exerciseId);
  }

  const [row] = await db
    .update(schema.exercises)
    .set(input)
    .where(eq(schema.exercises.id, exerciseId))
    .returning();
  return row;
}

export async function deleteExercise(studioId: string, exerciseId: string) {
  const deleted = await db
    .update(schema.exercises)
    .set({ deletedAt: new Date() })
    .where(and(eq(schema.exercises.id, exerciseId), eq(schema.exercises.studioId, studioId)))
    .returning({ id: schema.exercises.id });
  if (deleted.length === 0) throw notFound("No such exercise.");
}

/* -------------------------------------------------------------------------- */
/* Saved sections                                                              */
/* -------------------------------------------------------------------------- */

export function listSavedSections(studioId: string) {
  return db
    .select()
    .from(schema.savedSections)
    .where(eq(schema.savedSections.studioId, studioId))
    .orderBy(desc(schema.savedSections.createdAt));
}

export async function saveSectionForReuse(studioId: string, sessionId: string, name?: string) {
  const [session] = await db
    .select({ id: schema.workoutSessions.id, name: schema.workoutSessions.name })
    .from(schema.workoutSessions)
    .innerJoin(
      schema.workoutTemplates,
      eq(schema.workoutTemplates.id, schema.workoutSessions.templateId),
    )
    .where(
      and(eq(schema.workoutSessions.id, sessionId), eq(schema.workoutTemplates.studioId, studioId)),
    )
    .limit(1);
  if (!session) throw notFound("No such session.");

  const exerciseRows = await db
    .select({
      id: schema.sessionExercises.id,
      exerciseId: schema.sessionExercises.exerciseId,
      fields: schema.sessionExercises.fields,
      supersetGroup: schema.sessionExercises.supersetGroup,
      note: schema.sessionExercises.note,
    })
    .from(schema.sessionExercises)
    .where(eq(schema.sessionExercises.sessionId, sessionId))
    .orderBy(asc(schema.sessionExercises.position));

  const exerciseIds = exerciseRows.map((e) => e.id);
  const sets = exerciseIds.length
    ? await db
        .select()
        .from(schema.exerciseSets)
        .where(inArray(schema.exerciseSets.sessionExerciseId, exerciseIds))
        .orderBy(asc(schema.exerciseSets.position))
    : [];

  const payload: SessionInput = {
    name: session.name,
    exercises: exerciseRows.map((e) => ({
      exerciseId: e.exerciseId,
      fields: e.fields,
      supersetGroup: e.supersetGroup,
      note: e.note,
      sets: sets
        .filter((s) => s.sessionExerciseId === e.id)
        .map((s) => ({
          reps: s.reps,
          repsMax: s.repsMax,
          weightKg: s.weightKg,
          seconds: s.seconds,
          distanceM: s.distanceM,
          calories: s.calories,
          restSeconds: s.restSeconds,
        })),
    })),
  };

  const id = newId();
  await db
    .insert(schema.savedSections)
    .values({ id, studioId, name: (name ?? session.name).trim(), payload });
  return { id, name: name ?? session.name, payload };
}

export async function deleteSavedSection(studioId: string, id: string) {
  const deleted = await db
    .delete(schema.savedSections)
    .where(and(eq(schema.savedSections.id, id), eq(schema.savedSections.studioId, studioId)))
    .returning({ id: schema.savedSections.id });
  if (deleted.length === 0) throw notFound("No such saved section.");
}
