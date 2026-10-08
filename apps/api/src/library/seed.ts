import { newId, schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { SEED_EXERCISES } from "./exercises.js";
import { SEED_FOODS } from "./foods.js";

/**
 * The shared libraries a generated plan picks from.
 *
 * Idempotent, keyed on name, so re-running corrects rows rather than duplicating them —
 * which matters because these get edited as the numbers are checked, and a seed that
 * inserts a second "Dal tadka" every run would quietly double the model's menu.
 *
 * Image URLs are never touched here. They are earned once by a real generation and cost
 * money; a reseed must not throw them away.
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

  let foodsAdded = 0;
  let foodsUpdated = 0;

  for (const f of SEED_FOODS) {
    const row = {
      name: f.name,
      homeMeasure: f.homeMeasure,
      grams: f.grams,
      kcal: f.kcal,
      proteinG: f.p,
      carbsG: f.c,
      fatG: f.f,
      tags: f.tags,
      slots: f.slots,
    };

    const [existing] = await db
      .select({ id: schema.foods.id })
      .from(schema.foods)
      .where(eq(schema.foods.name, f.name))
      .limit(1);

    if (existing) {
      // Deliberately not imageUrl or imageStatus — see above.
      await db.update(schema.foods).set(row).where(eq(schema.foods.id, existing.id));
      foodsUpdated += 1;
    } else {
      await db.insert(schema.foods).values({ id: newId(), ...row });
      foodsAdded += 1;
    }
  }

  return { exercisesAdded, exercisesUpdated, foodsAdded, foodsUpdated };
}

// Run directly: `tsx src/library/seed.ts`
if (process.argv[1]?.endsWith("seed.ts")) {
  const r = await seedLibrary();
  console.warn(
    `exercises: +${r.exercisesAdded} new, ${r.exercisesUpdated} updated · ` +
      `foods: +${r.foodsAdded} new, ${r.foodsUpdated} updated`,
  );
  process.exit(0);
}
