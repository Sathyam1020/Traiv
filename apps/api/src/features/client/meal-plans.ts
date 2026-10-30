import { optionNutrition } from "@traiv/nutrition/meal-plans";
import { schema } from "@traiv/db";
import { and, desc, eq, isNull, isNotNull } from "drizzle-orm";
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
  return rows.map((row) => {
    const document = planDocumentSchema.parse(row.publishedDocument);
    return {
      id: row.id,
      document: {
        ...document,
        slots: document.slots
          .filter((s) => s.enabled)
          .map((slot) => ({
            ...slot,
            options: slot.options.map((option) => ({
              ...option,
              nutrition: optionNutrition(option),
            })),
          })),
      },
    };
  });
}
