export type RecipeNutrients = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  micronutrients: Record<string, number>;
};
export function gramsForUnit(
  ingredient: { defaultUnit: string | null; gramsPerUnit: number | null },
  quantity: number,
  unit: string,
): number | null {
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  if (unit === "grams") return quantity;
  if (
    unit === ingredient.defaultUnit &&
    ingredient.gramsPerUnit !== null &&
    ingredient.gramsPerUnit > 0
  )
    return quantity * ingredient.gramsPerUnit;
  return null;
}
/** Only round once, after summing all ingredient lines. The editor and API use the
 * same computation so a save cannot make the displayed serving nutrition jump. */
export function recipeNutrition(
  lines: { grams: number; ingredient: RecipeNutrients }[],
  servings: number,
): RecipeNutrients {
  if (!Number.isFinite(servings) || servings <= 0)
    throw new RangeError("Servings must be positive");
  const result: RecipeNutrients = { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, micronutrients: {} };
  for (const { grams, ingredient } of lines) {
    if (!Number.isFinite(grams) || grams < 0)
      throw new RangeError("Ingredient grams must be nonnegative");
    const scale = grams / 100 / servings;
    for (const key of ["kcal", "proteinG", "carbsG", "fatG"] as const)
      result[key] += ingredient[key] * scale;
    for (const [key, value] of Object.entries(ingredient.micronutrients))
      result.micronutrients[key] = (result.micronutrients[key] ?? 0) + value * scale;
  }
  result.kcal = Math.round(result.kcal);
  for (const key of ["proteinG", "carbsG", "fatG"] as const)
    result[key] = Math.round(result[key] * 10) / 10;
  result.micronutrients = Object.fromEntries(
    Object.entries(result.micronutrients).map(([key, value]) => [key, Math.round(value * 10) / 10]),
  );
  return result;
}
