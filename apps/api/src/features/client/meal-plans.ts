import { optionNutrition } from "@traiv/nutrition/meal-plans";
import { schema } from "@traiv/db";
import { and, desc, eq, isNull, isNotNull, inArray } from "drizzle-orm";
import { db } from "../../db.js";
import { planDocumentSchema } from "../studio/meal-plans.js";

/** Client authorization supplies the client ID; only the published snapshot crosses this boundary. */
export async function publishedMealPlans(clientId: string) {
  const rows = await db
    .select()
    .from(schema.mealPlanTemplates)
    .where(
      and(
        eq(schema.mealPlanTemplates.clientId, clientId),
        eq(schema.mealPlanTemplates.status, "active"),
        isNull(schema.mealPlanTemplates.archivedAt),
        isNotNull(schema.mealPlanTemplates.publishedDocument),
      ),
    )
    .orderBy(desc(schema.mealPlanTemplates.updatedAt));
  const documents = rows.map((row) => ({
    id: row.id,
    document: planDocumentSchema.parse(row.publishedDocument),
  }));
  const ids = [
    ...new Set(
      documents.flatMap(({ document }) =>
        document.slots.flatMap((slot) => slot.options.map((option) => option.recipeId)),
      ),
    ),
  ];
  const times = ids.length
    ? await db
        .select({
          id: schema.recipes.id,
          prep: schema.recipes.prepMinutes,
          cook: schema.recipes.cookMinutes,
        })
        .from(schema.recipes)
        .where(inArray(schema.recipes.id, ids))
    : [];
  const minutes = new Map(
    times.map((row) => [
      row.id,
      row.prep === null && row.cook === null ? null : (row.prep ?? 0) + (row.cook ?? 0),
    ]),
  );
  return documents.map(({ id, document }) => {
    return {
      id,
      document: {
        ...document,
        slots: document.slots
          .filter((s) => s.enabled)
          .map((slot) => ({
            ...slot,
            options: slot.options.map((option) => ({
              ...option,
              nutrition: optionNutrition(option),
              minutes: minutes.get(option.recipeId) ?? null,
            })),
          })),
      },
    };
  });
}
