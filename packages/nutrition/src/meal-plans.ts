import { gramsForUnit, recipeNutrition, type RecipeNutrients } from "@traiv/nutrition/recipes";

export type PlanSettings = {
  name: string;
  description: string;
  coverImageUrl: string | null;
  calorieTarget: number;
  recipesPerMeal: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  dietaryPreferences: string[];
  allergensToAvoid: string[];
  recipeSourceSetting: "all" | "mine";
  recipeMatching: "scale" | "best_match";
};
export type PlanIngredient = {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  originalQuantity: number;
  defaultUnit: string | null;
  gramsPerUnit: number | null;
  preparationNote: string | null;
  minimumUnitAmount: "whole" | "halves" | "quarters" | "all";
  nutrients: RecipeNutrients;
};
export type PlanOption = {
  id: string;
  recipeId: string;
  name: string;
  imageUrl: string | null;
  personal: boolean;
  mealTypes: string[];
  dietaryTags: string[];
  allergenTags: string[];
  steps: string[];
  ingredients: PlanIngredient[];
  locked: boolean;
};
export type PlanSlot = {
  id: string;
  name: string;
  percentage: number;
  enabled: boolean;
  options: PlanOption[];
};
export type PlanDocument = { settings: PlanSettings; slots: PlanSlot[] };
export type MealPlan = {
  clientId: string | null;
  id: string;
  updatedAt: string;
  status: "draft" | "active";
  hasChanges: boolean;
  document: PlanDocument;
  published: PlanDocument | null;
};
export function optionNutrition(option: PlanOption, original = false): RecipeNutrients {
  return recipeNutrition(
    option.ingredients.map((line) => ({
      grams: gramsForUnit(line, original ? line.originalQuantity : line.quantity, line.unit) ?? 0,
      ingredient: line.nutrients,
    })),
    1,
  );
}
export function slotTargets(settings: PlanSettings, percentage: number) {
  const kcal = (settings.calorieTarget * percentage) / 100;
  return {
    kcal,
    proteinG: (kcal * settings.proteinPct) / 400,
    carbsG: (kcal * settings.carbsPct) / 400,
    fatG: (kcal * settings.fatPct) / 900,
  };
}
function roundedQuantity(line: PlanIngredient, grams: number) {
  const gramsPerUnit = line.unit === "grams" ? 1 : (line.gramsPerUnit ?? 1);
  const step = { whole: 1, halves: 0.5, quarters: 0.25, all: 0 }[line.minimumUnitAmount];
  const servingGrams = line.gramsPerUnit;
  if (step && servingGrams && servingGrams > 0) {
    const portions = Math.max(step, Math.round(grams / servingGrams / step) * step);
    return Math.round(((portions * servingGrams) / gramsPerUnit) * 1000) / 1000;
  }
  return Math.max(0.001, Math.round((grams / gramsPerUnit) * 1000) / 1000);
}
/** Bounded coordinate descent: fit actual ingredient composition, not just a calorie multiplier. */
export function scaleOption(
  option: PlanOption,
  settings: PlanSettings,
  percentage: number,
): PlanOption {
  if (option.locked) return option;
  if (settings.recipeMatching === "best_match")
    return {
      ...option,
      ingredients: option.ingredients.map((line) => ({ ...line, quantity: line.originalQuantity })),
    };
  const target = slotTargets(settings, percentage);
  const wanted = [target.kcal, target.proteinG, target.carbsG, target.fatG];
  const base = optionNutrition(option, true);
  const factor = Math.max(0.1, Math.min(10, target.kcal / Math.max(1, base.kcal)));
  const original = option.ingredients.map(
    (line) => gramsForUnit(line, line.originalQuantity, line.unit) ?? 0,
  );
  const grams = original.map((n) => n * factor);
  const columns = option.ingredients.map((line) =>
    [line.nutrients.kcal, line.nutrients.proteinG, line.nutrients.carbsG, line.nutrients.fatG].map(
      (n, k) => n / 100 / Math.max(1, wanted[k] ?? 1),
    ),
  );
  for (let pass = 0; pass < 60; pass++) {
    for (let i = 0; i < grams.length; i++) {
      const column = columns[i];
      const baseGrams = original[i];
      const current = grams[i];
      if (!column || !baseGrams || current === undefined) continue;
      const totals = [0, 0, 0, 0];
      for (let j = 0; j < grams.length; j++)
        for (let k = 0; k < 4; k++)
          totals[k] = (totals[k] ?? 0) + (columns[j]?.[k] ?? 0) * (grams[j] ?? 0);
      const penalty = 0.002 / Math.max(1, (baseGrams * factor) ** 2);
      const denominator = column.reduce((sum, n) => sum + n * n, penalty);
      const derivative = column.reduce(
        (sum, n, k) =>
          sum + n * ((totals[k] ?? 0) - (wanted[k] ?? 0) / Math.max(1, wanted[k] ?? 1)),
        penalty * (current - baseGrams * factor),
      );
      if (denominator > 0)
        grams[i] = Math.max(
          baseGrams * factor * 0.25,
          Math.min(baseGrams * factor * 4, current - derivative / denominator),
        );
    }
  }
  return {
    ...option,
    ingredients: option.ingredients.map((line, i) => ({
      ...line,
      quantity: roundedQuantity(line, grams[i] ?? 0),
    })),
  };
}
export function optionConflicts(
  option: Pick<PlanOption, "personal" | "allergenTags">,
  settings: PlanSettings,
): string[] {
  const normal = (s: string) =>
    s
      .toLowerCase()
      .replace(/^contains\s+/u, "")
      .replace(/[^a-z]/gu, "");
  const avoid = new Set(settings.allergensToAvoid.map(normal));
  const conflicts = option.allergenTags
    .filter((tag) => avoid.has(normal(tag)))
    .map((tag) => `Contains ${tag.replace(/^contains\s+/iu, "")}`);
  if (settings.recipeSourceSetting === "mine" && !option.personal)
    conflicts.push("Outside Personal recipe library");
  return conflicts;
}
export function planWarnings(document: PlanDocument): string[] {
  return document.slots
    .filter((slot) => slot.enabled)
    .flatMap((slot) => [
      ...(slot.options.length < document.settings.recipesPerMeal
        ? [
            `${slot.name}: ${slot.options.length} of ${document.settings.recipesPerMeal} recipe options available.`,
          ]
        : []),
      ...slot.options.flatMap((option) =>
        optionConflicts(option, document.settings).map(
          (message) => `${slot.name} · ${option.name}: ${message}`,
        ),
      ),
    ]);
}
export function planRange(document: PlanDocument) {
  let low = 0,
    high = 0;
  for (const slot of document.slots.filter((s) => s.enabled)) {
    const values = slot.options.map((option) => optionNutrition(option).kcal);
    low += values.length ? Math.min(...values) : 0;
    high += values.length ? Math.max(...values) : 0;
  }
  return { low, high };
}

/** Local drafts are untrusted input too; reject incomplete/old document shapes. */
export function readPlanDocument(value: unknown): PlanDocument | null {
  const record = (v: unknown): v is Record<string, unknown> =>
    Boolean(v) && typeof v === "object" && !Array.isArray(v);
  const number = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
  const strings = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string");
  const nullable = (v: unknown) => v === null || typeof v === "string";
  const nutrient = (v: unknown) =>
    record(v) &&
    [v.kcal, v.proteinG, v.carbsG, v.fatG].every(number) &&
    record(v.micronutrients) &&
    Object.values(v.micronutrients).every(number);
  const ingredient = (v: unknown) =>
    record(v) &&
    [v.ingredientId, v.name, v.unit].every((x) => typeof x === "string") &&
    [v.quantity, v.originalQuantity].every(number) &&
    nullable(v.defaultUnit) &&
    (v.gramsPerUnit === null || number(v.gramsPerUnit)) &&
    nullable(v.preparationNote) &&
    ["whole", "halves", "quarters", "all"].includes(String(v.minimumUnitAmount)) &&
    nutrient(v.nutrients);
  const option = (v: unknown) =>
    record(v) &&
    [v.id, v.recipeId, v.name].every((x) => typeof x === "string") &&
    nullable(v.imageUrl) &&
    typeof v.personal === "boolean" &&
    typeof v.locked === "boolean" &&
    [v.mealTypes, v.dietaryTags, v.allergenTags, v.steps].every(strings) &&
    Array.isArray(v.ingredients) &&
    v.ingredients.every(ingredient);
  function valid(v: unknown): v is PlanDocument {
    if (!record(v) || !record(v.settings) || !Array.isArray(v.slots)) return false;
    const s = v.settings;
    return (
      typeof s.name === "string" &&
      typeof s.description === "string" &&
      nullable(s.coverImageUrl) &&
      [s.calorieTarget, s.recipesPerMeal, s.proteinPct, s.carbsPct, s.fatPct].every(number) &&
      [s.dietaryPreferences, s.allergensToAvoid].every(strings) &&
      ["all", "mine"].includes(String(s.recipeSourceSetting)) &&
      ["scale", "best_match"].includes(String(s.recipeMatching)) &&
      v.slots.every(
        (slot) =>
          record(slot) &&
          typeof slot.id === "string" &&
          typeof slot.name === "string" &&
          number(slot.percentage) &&
          typeof slot.enabled === "boolean" &&
          Array.isArray(slot.options) &&
          slot.options.every(option),
      )
    );
  }
  return valid(value) ? value : null;
}
