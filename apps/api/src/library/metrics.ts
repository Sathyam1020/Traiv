import { newId, schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";

/**
 * The shared metric library every studio starts with.
 *
 * The weekly wizard groups these stable metric codes into ten steps. Legacy metrics
 * remain available so historical answers and studio customizations stay readable.
 * Weight also appends to body_metric when submitted.
 *
 * Idempotent on `code`, so re-running corrects a row rather than duplicating it.
 *
 *     pnpm --filter @traiv/api seed:metrics
 */
const SEED = [
  {
    code: "weight",
    name: "Weight",
    type: "number",
    unit: "kg",
    unitCategory: "mass",
    position: 10,
  },
  {
    code: "photo_front",
    name: "Front photo",
    type: "image",
    unit: null,
    unitCategory: null,
    position: 20,
  },
  {
    code: "photo_side",
    name: "Side photo",
    type: "image",
    unit: null,
    unitCategory: null,
    position: 21,
  },
  {
    code: "photo_back",
    name: "Back photo",
    type: "image",
    unit: null,
    unitCategory: null,
    position: 22,
  },
  {
    code: "waist",
    name: "Waist",
    type: "number",
    unit: "cm",
    unitCategory: "length",
    position: 25,
  },
  {
    code: "hips",
    name: "Hips",
    type: "number",
    unit: "cm",
    unitCategory: "length",
    position: 26,
  },
  { code: "energy", name: "Energy", type: "rating", unit: "1-5", unitCategory: null, position: 30 },
  {
    code: "sleep_hours",
    name: "Sleep",
    type: "number",
    unit: "hours",
    unitCategory: "duration",
    position: 31,
  },
  {
    code: "soreness",
    name: "Soreness",
    type: "rating",
    unit: "1-5",
    unitCategory: null,
    position: 32,
  },
  {
    code: "notes",
    name: "Anything else",
    type: "text",
    unit: null,
    unitCategory: null,
    position: 90,
  },
  ...["arm", "chest", "forearm", "thigh"].map((code, i) => ({
    code,
    name: code.charAt(0).toUpperCase() + code.slice(1),
    type: "number" as const,
    unit: "cm",
    unitCategory: "length",
    position: 23 + i,
  })),
  ...[
    { code: "mood", name: "Mood" },
    { code: "nutrition", name: "Nutrition" },
    { code: "progress", name: "Progress" },
    { code: "sleep_quality", name: "Sleep quality" },
  ].map((m, i) => ({
    ...m,
    type: "rating" as const,
    unit: "1-5",
    unitCategory: null,
    position: 40 + i,
  })),
  {
    code: "biggest_win",
    name: "What was your biggest win last week?",
    type: "text",
    unit: null,
    unitCategory: null,
    position: 50,
  },
  {
    code: "training_feel",
    name: "How did your training feel?",
    type: "text",
    unit: null,
    unitCategory: null,
    position: 51,
  },
] as const;

export async function seedMetrics() {
  let added = 0;
  let updated = 0;

  for (const m of SEED) {
    const [existing] = await db
      .select({ id: schema.metrics.id })
      .from(schema.metrics)
      .where(and(eq(schema.metrics.code, m.code), isNull(schema.metrics.studioId)))
      .limit(1);

    if (existing) {
      await db
        .update(schema.metrics)
        .set({
          name: m.name,
          type: m.type,
          unit: m.unit,
          unitCategory: m.unitCategory,
          position: m.position,
        })
        .where(eq(schema.metrics.id, existing.id));
      updated++;
      continue;
    }

    await db.insert(schema.metrics).values({ id: newId(), studioId: null, ...m });
    added++;
  }

  console.warn(`  metrics: ${added} added, ${updated} updated`);
  return { added, updated };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedMetrics().then(() => process.exit(0));
}
