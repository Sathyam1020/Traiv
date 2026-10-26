import { newId, schema } from "@traiv/db";

type Pattern = (typeof schema.movementPattern.enumValues)[number];

import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";

/**
 * The shared exercise library, from `free-exercise-db`.
 *
 * 876 exercises with images, released under the Unlicense — public domain, so it can be
 * shipped without attribution obligations or a licence to track. It is also the right
 * *shape*: its fields map almost one for one onto the exercise editor Coachway shows a
 * coach, so a seeded exercise and a coach-written one carry the same information rather
 * than the seed being richer than the form.
 *
 *     primaryMuscles → muscle          mechanic → stimulus
 *     secondaryMuscles → secondary     level    → level
 *     equipment → equipment            category → category
 *
 * Location and injury risk are Coachway's own and are not in the dataset; they stay null
 * until a coach sets them.
 *
 * Idempotent on name, so re-running corrects rows rather than duplicating them.
 *
 *     pnpm --filter @traiv/api seed:exercises
 */

const SOURCE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const IMAGES = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

type Exercise = typeof schema.exercises.$inferInsert;

type SourceExercise = {
  name: string;
  force?: string | null;
  level?: string | null;
  mechanic?: string | null;
  equipment?: string | null;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  category?: string | null;
  images?: string[];
};

/**
 * Our `movement_pattern` enum is required and the dataset has no column for it.
 *
 * Derived from the primary muscle, which is the only honest mapping available — and
 * flagged here rather than hidden, because a squat pattern on a calf raise is wrong in a
 * way only a coach will notice.
 */
const PATTERN_BY_MUSCLE: Record<string, Pattern> = {
  quadriceps: "squat",
  glutes: "hinge",
  hamstrings: "hinge",
  "lower back": "hinge",
  chest: "push_horizontal",
  shoulders: "push_vertical",
  triceps: "push_horizontal",
  lats: "pull_vertical",
  "middle back": "pull_horizontal",
  traps: "pull_horizontal",
  biceps: "pull_horizontal",
  forearms: "carry",
  abdominals: "core",
  calves: "squat",
  adductors: "lunge",
  abductors: "lunge",
  neck: "mobility",
};

/** The dataset's equipment vocabulary, mapped onto the one intake offers. */
const EQUIPMENT: Record<string, Exercise["equipment"]> = {
  barbell: "full_gym",
  dumbbell: "dumbbells",
  "e-z curl bar": "full_gym",
  cable: "full_gym",
  machine: "full_gym",
  kettlebells: "full_gym",
  "body only": "bodyweight",
  bands: "bands",
  "medicine ball": "home_basics",
  "exercise ball": "home_basics",
  "foam roll": "home_basics",
  other: "home_basics",
};

/**
 * Which columns a set of this exercise starts with.
 *
 * Coachway's "Default fields … in this order". A cardio movement is asked for time and
 * distance; everything else is weight and reps. The coach can change it per exercise and
 * again per workout.
 */
function defaultFields(e: SourceExercise): string[] {
  if (e.category === "cardio") return ["duration", "distance"];
  if (e.category === "stretching") return ["duration"];
  if (e.equipment === "body only") return ["reps", "rest"];
  return ["weight", "reps", "rest"];
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function seedExercises() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`exercise-db fetch failed: ${res.status}`);
  const source = (await res.json()) as SourceExercise[];

  let added = 0;
  let updated = 0;

  for (const e of source) {
    const primary = e.primaryMuscles?.[0];
    const row = {
      name: e.name,
      pattern: (primary ? PATTERN_BY_MUSCLE[primary] : null) ?? "core",
      muscle: titleCase(primary ?? "full body"),
      equipment: (e.equipment ? EQUIPMENT[e.equipment] : null) ?? "full_gym",
      imageUrl: e.images?.[0] ? IMAGES + e.images[0] : null,
      description: e.instructions?.join("\n\n") || null,
      secondaryMuscles: (e.secondaryMuscles ?? []).map(titleCase),
      stimulus: e.mechanic ?? null,
      level: e.level ?? null,
      category: e.category ?? null,
      defaultFields: defaultFields(e),
    };

    const [existing] = await db
      .select({ id: schema.exercises.id })
      .from(schema.exercises)
      .where(and(eq(schema.exercises.name, e.name), isNull(schema.exercises.studioId)))
      .limit(1);

    if (existing) {
      await db.update(schema.exercises).set(row).where(eq(schema.exercises.id, existing.id));
      updated += 1;
    } else {
      await db.insert(schema.exercises).values({ id: newId(), ...row });
      added += 1;
    }
  }

  console.warn(`  exercises: +${added} new, ${updated} updated (free-exercise-db)`);
  return { added, updated };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedExercises().then(() => process.exit(0));
}
