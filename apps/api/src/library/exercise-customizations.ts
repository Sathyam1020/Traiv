import { schema } from "@traiv/db";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db.js";

export async function customization(studioId: string, exerciseId: string) {
  const [row] = await db
    .select()
    .from(schema.exerciseCustomizations)
    .where(
      and(
        eq(schema.exerciseCustomizations.studioId, studioId),
        eq(schema.exerciseCustomizations.exerciseId, exerciseId),
      ),
    );
  return row;
}
export async function applyExerciseCustomizations<T>(
  studioId: string,
  rows: T[],
  idFor: (row: T) => string,
): Promise<T[]> {
  if (!rows.length) return rows;
  const saved = await db
    .select()
    .from(schema.exerciseCustomizations)
    .where(
      and(
        eq(schema.exerciseCustomizations.studioId, studioId),
        inArray(schema.exerciseCustomizations.exerciseId, rows.map(idFor)),
      ),
    );
  const byId = new Map(saved.map((row) => [row.exerciseId, row]));
  return rows.map((row) => {
    const edited = byId.get(idFor(row));
    // Prescribed set fields/IDs belong to the workout and must not be replaced by defaults.
    return edited
      ? {
          ...row,
          name: edited.data.name,
          muscle: edited.data.muscle,
          equipment: edited.data.equipment,
          imageUrl: edited.data.imageUrl ?? null,
          videoUrl: edited.data.videoUrl ?? null,
          mediaRevision: edited.updatedAt.toISOString(),
        }
      : row;
  });
}

/** Fresh studio-owned data is separate from the per-device provider catalog cache. */
export async function studioExerciseEdits(studioId: string) {
  const [own, edits] = await Promise.all([
    db
      .select()
      .from(schema.exercises)
      .where(and(eq(schema.exercises.studioId, studioId), isNull(schema.exercises.deletedAt))),
    db
      .select()
      .from(schema.exerciseCustomizations)
      .where(eq(schema.exerciseCustomizations.studioId, studioId)),
  ]);
  return [
    ...own.map((e) => ({ ...e, shared: false })),
    ...edits.map((e) => ({
      ...e.data,
      id: e.exerciseId,
      studioId,
      shared: false,
      customized: true,
      defaultFields: e.data.defaultFields ?? ["weight", "reps", "rest"],
      imageUrl: e.data.imageUrl ?? null,
      videoUrl: e.data.videoUrl ?? null,
      mediaRevision: e.updatedAt.toISOString(),
    })),
  ];
}
