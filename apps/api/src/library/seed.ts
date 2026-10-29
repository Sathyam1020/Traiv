import { newId, schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { SEED_EXERCISES } from "./exercises.js";

/**
 * The shared exercise library a workout template picks from.
 *
 * Idempotent, keyed on name, so re-running corrects rows rather than duplicating them.
 *
 * Nutrition's own libraries (ingredients) seed separately — `seed:fdc-ingredients` and
 * `seed:ifct-ingredients` — because they're each a much larger, independent import, not
 * a handful of hand-written rows reviewed alongside exercises. See
 * `.ai/features/nutrition/spec.md`.
 *
 *     pnpm --filter @traiv/api seed:library
 */
export async function seedLibrary() {
  let exercisesAdded = 0;
  let exercisesUpdated = 0;

  for (const e of SEED_EXERCISES) {
    const [existing] = await db
      .select({ id: schema.exercises.id })
      .from(schema.exercises)
      .where(and(eq(schema.exercises.name, e.name), isNull(schema.exercises.studioId)))
      .limit(1);

    if (existing) {
      await db
        .update(schema.exercises)
        .set({ pattern: e.pattern, muscle: e.muscle, equipment: e.equipment, cues: e.cues })
        .where(eq(schema.exercises.id, existing.id));
      exercisesUpdated += 1;
    } else {
      await db.insert(schema.exercises).values({ id: newId(), ...e });
      exercisesAdded += 1;
    }
  }

  return { exercisesAdded, exercisesUpdated };
}

// Run directly: `tsx src/library/seed.ts`
if (process.argv[1]?.endsWith("seed.ts")) {
  const r = await seedLibrary();
  console.warn(`exercises: +${r.exercisesAdded} new, ${r.exercisesUpdated} updated`);
  process.exit(0);
}
