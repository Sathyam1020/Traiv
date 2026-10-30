import { newId, schema } from "@traiv/db";
import { inArray, isNull, sql } from "drizzle-orm";
import { db } from "../db.js";
import type { prepareCoachwayImport } from "./coachway-import.js";
import { upsertSystemIngredients } from "./upsert-ingredients.js";

/** Shared by the CLI and real-database import scenarios. Source IDs, not titles,
 * identify recipes: identically named source variants must remain independent. */
export async function storeCoachwayImport(source: ReturnType<typeof prepareCoachwayImport>) {
  await upsertSystemIngredients(
    source.ingredients.map(({ sourceId: _sourceId, ...ingredient }) => ({
      ...ingredient,
      id: newId(),
    })),
  );
  const stored = await db
    .select({ id: schema.ingredients.id, dataSource: schema.ingredients.dataSource })
    .from(schema.ingredients)
    .where(
      inArray(
        schema.ingredients.dataSource,
        source.ingredients.map((i) => i.dataSource),
      ),
    );
  const ids = new Map(stored.map((i) => [i.dataSource, i.id]));
  let added = 0;
  for (let offset = 0; offset < source.recipes.length; offset += 100) {
    const batch = source.recipes.slice(offset, offset + 100).map((r) => ({ ...r, id: newId() }));
    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(schema.recipes)
        .values(
          batch.map(
            ({
              ingredients: _ingredients,
              steps: _steps,
              sourceId: _sourceId,
              sourceMacros: _sourceMacros,
              ...r
            }) => ({ ...r, source: "system" as const, studioId: null }),
          ),
        )
        .onConflictDoUpdate({
          target: schema.recipes.seedKey,
          set: {
            name: sql`excluded.name`,
            description: sql`excluded.description`,
            dietaryTags: sql`excluded.dietary_tags`,
            allergenTags: sql`excluded.allergen_tags`,
            mealTypes: sql`excluded.meal_types`,
            imageUrl: sql`excluded.image_url`,
            videoUrl: sql`excluded.video_url`,
            prepMinutes: sql`excluded.prep_minutes`,
            cookMinutes: sql`excluded.cook_minutes`,
            difficulty: sql`excluded.difficulty`,
          },
        })
        .returning({ id: schema.recipes.id });
      const accepted = new Set(inserted.map((r) => r.id));
      const fresh = batch.filter((r) => accepted.has(r.id));
      added += fresh.length;
      const lines = fresh.flatMap((r) =>
        r.ingredients.map((line, position) => {
          const ingredientId = ids.get(`coachway:${line.sourceIngredientId}`);
          if (!ingredientId)
            throw new Error(`Unresolved source ingredient ${line.sourceIngredientId}`);
          return {
            id: newId(),
            recipeId: r.id,
            ingredientId,
            position,
            quantity: line.quantity,
            unit: line.unit,
          };
        }),
      );
      const steps = fresh.flatMap((r) =>
        r.steps.map((text, position) => ({ id: newId(), recipeId: r.id, position, text })),
      );
      if (lines.length) await tx.insert(schema.recipeIngredients).values(lines);
      if (steps.length) await tx.insert(schema.recipeSteps).values(steps);
    });
  }
  const count = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(schema.recipes)
    .where(isNull(schema.recipes.deletedAt));
  return { added, existing: source.recipes.length - added, total: count[0]?.total ?? 0 };
}
