import { schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  optionNutrition,
  scaleOption,
  type PlanOption,
  type PlanSettings,
} from "@traiv/nutrition/meal-plans";
import { db } from "../../db.js";
import { allow, nutritionSchema, operationResourceId, resolveItem, type FoodItem } from "./food.js";
export const personalPlanInput = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1).max(80),
    targets: nutritionSchema.nullable(),
    meals: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(80),
          percentage: z.number().min(0).max(100),
          options: z
            .array(z.object({ id: z.string().max(64), recipeId: z.string().max(64).optional() }))
            .max(12)
            .default([]),
        }),
      )
      .min(1)
      .max(12),
  })
  .refine(
    (v) => Math.abs(v.meals.reduce((n, m) => n + m.percentage, 0) - 100) < 0.01,
    "Meal percentages must total 100",
  )
  .refine(
    (v) => v.meals.every((m) => !m.options.length || m.percentage > 0),
    "Give each meal with recipes a positive share of the day.",
  );
function fitted(
  item: FoodItem,
  targets: z.infer<typeof nutritionSchema> | null,
  percentage: number,
): FoodItem {
  if (!targets || !targets.kcal) return item;
  const protein = targets.proteinG * 4,
    carbs = targets.carbsG * 4,
    fat = targets.fatG * 9,
    total = protein + carbs + fat || 1;
  const settings: PlanSettings = {
    name: "Personal plan",
    description: "",
    coverImageUrl: null,
    calorieTarget: targets.kcal,
    recipesPerMeal: 4,
    proteinPct: (protein / total) * 100,
    carbsPct: (carbs / total) * 100,
    fatPct: (fat / total) * 100,
    dietaryPreferences: [],
    allergensToAvoid: [],
    recipeSourceSetting: "all",
    recipeMatching: "scale",
  };
  const option: PlanOption = {
    id: item.id,
    recipeId: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    personal: item.owned,
    mealTypes: [],
    dietaryTags: [],
    allergenTags: [],
    steps: item.steps,
    locked: false,
    ingredients: item.ingredients.map((l) => ({
      ingredientId: l.id,
      name: l.name,
      quantity: l.grams,
      originalQuantity: l.grams,
      unit: "grams",
      defaultUnit: null,
      gramsPerUnit: null,
      preparationNote: null,
      minimumUnitAmount: "all",
      nutrients: {
        kcal: l.nutrition?.kcal ?? 0,
        proteinG: l.nutrition?.proteinG ?? 0,
        carbsG: l.nutrition?.carbsG ?? 0,
        fatG: l.nutrition?.fatG ?? 0,
        micronutrients: l.nutrition?.micronutrients ?? {},
      },
    })),
  };
  const scaled = scaleOption(option, settings, percentage);
  return {
    ...item,
    ...optionNutrition(scaled),
    baseGrams: scaled.ingredients.reduce((n, l) => n + l.quantity, 0),
    ingredients: scaled.ingredients.map((l, index) => ({
      id: l.ingredientId,
      name: l.name,
      grams: l.quantity,
      nutrition: item.ingredients[index]?.nutrition,
    })),
  };
}
export async function savePersonalPlan(
  clientId: string,
  studioId: string,
  input: z.infer<typeof personalPlanInput>,
) {
  await allow(clientId, "personalPlans");
  const meals = await Promise.all(
    input.meals.map(async (meal, index) => ({
      ...meal,
      options: await Promise.all(
        meal.options.map(async (option) => {
          const recipe = await resolveItem(
            clientId,
            studioId,
            "recipe",
            option.recipeId ?? option.id,
          );
          return {
            ...fitted(recipe, input.targets, meal.percentage),
            id: operationResourceId(clientId, input.id, `${index}:${recipe.id}`),
            recipeId: recipe.id,
            kind: "personal" as const,
            planId: input.id,
          };
        }),
      ),
    })),
  );
  await db
    .insert(schema.foodPersonalPlans)
    .values({ ...input, meals, clientId })
    .onConflictDoUpdate({
      target: schema.foodPersonalPlans.id,
      set: { name: input.name, targets: input.targets, meals },
      setWhere: eq(schema.foodPersonalPlans.clientId, clientId),
    });
}
