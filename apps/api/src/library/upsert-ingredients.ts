import { schema } from "@traiv/db";
import { and, isNull, sql } from "drizzle-orm";
import { db } from "../db.js";
/** Bulk imports must be retry-safe across two simultaneous seed processes too. The
 * partial unique index is the authority; read-before-insert is insufficient. */
export async function upsertSystemIngredients(input: (typeof schema.ingredients.$inferInsert)[]) {
  const rows = [...new Map(input.map((r) => [`${r.dataSource ?? ""}:${r.name}`, r])).values()];
  const names = new Set(
    (
      await db
        .select({ name: schema.ingredients.name, dataSource: schema.ingredients.dataSource })
        .from(schema.ingredients)
        .where(and(isNull(schema.ingredients.studioId), isNull(schema.ingredients.deletedAt)))
    ).map((r) => `${r.dataSource ?? ""}:${r.name}`),
  );
  const added = rows.filter((r) => !names.has(`${r.dataSource ?? ""}:${r.name}`)).length;
  for (let i = 0; i < rows.length; i += 200) {
    await db
      .insert(schema.ingredients)
      .values(rows.slice(i, i + 200))
      .onConflictDoUpdate({
        target: [schema.ingredients.name, schema.ingredients.dataSource],
        targetWhere: sql`"studio_id" is null and "deleted_at" is null`,
        set: {
          dataSource: sql`excluded.data_source`,
          category: sql`excluded.category`,
          nutrientType: sql`excluded.nutrient_type`,
          country: sql`excluded.country`,
          dietaryTags: sql`excluded.dietary_tags`,
          kcal: sql`excluded.kcal`,
          proteinG: sql`excluded.protein_g`,
          carbsG: sql`excluded.carbs_g`,
          fatG: sql`excluded.fat_g`,
          micronutrients: sql`excluded.micronutrients`,
        },
      });
  }
  return { added, updated: rows.length - added };
}
