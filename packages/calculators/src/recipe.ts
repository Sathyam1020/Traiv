/**
 * Recipe totals from ingredients the person types in: grams used, and protein, carbs and
 * fat per 100 g as printed on the label.
 *
 * Calories use the Atwater general factors (4/4/9 kcal per gram). Label calories are
 * not asked for, because they often include fibre and alcohol and rounding, and a total
 * that disagrees with its own macro split confuses a coach more than it informs them.
 */

export type Ingredient = {
  name: string;
  grams: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
};

export type RecipeView = "recipe" | "serving" | "per100";

export type Macro = { grams: number; kcal: number; share: number };

export type RecipeResult = {
  kcal: number;
  protein: Macro;
  carbs: Macro;
  fat: Macro;
  /** Ingredients with grams > 0 that counted toward the total. */
  ingredientCount: number;
  totalGrams: number;
  servings: number;
};

export const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;

const usable = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
/** Per-100 g figures above 100 are impossible; clamp rather than trust a typo. */
const per100 = (n: number) => Math.min(usable(n), 100);

export function recipeTotals(
  ingredients: readonly Ingredient[],
  servings: number,
  view: RecipeView,
): RecipeResult {
  let p = 0;
  let c = 0;
  let f = 0;
  let totalGrams = 0;
  let ingredientCount = 0;

  for (const ing of ingredients) {
    const g = usable(ing.grams);
    if (g === 0) continue;
    ingredientCount += 1;
    totalGrams += g;
    p += (g * per100(ing.proteinPer100)) / 100;
    c += (g * per100(ing.carbsPer100)) / 100;
    f += (g * per100(ing.fatPer100)) / 100;
  }

  const safeServings = Math.max(1, Math.round(usable(servings)) || 1);
  const divisor =
    view === "serving"
      ? safeServings
      : view === "per100"
        ? totalGrams > 0
          ? totalGrams / 100
          : 1
        : 1;

  const pg = p / divisor;
  const cg = c / divisor;
  const fg = f / divisor;
  const pk = pg * KCAL_PER_G.protein;
  const ck = cg * KCAL_PER_G.carbs;
  const fk = fg * KCAL_PER_G.fat;
  const kcal = pk + ck + fk;
  const share = (k: number) => (kcal > 0 ? k / kcal : 0);

  return {
    kcal,
    protein: { grams: pg, kcal: pk, share: share(pk) },
    carbs: { grams: cg, kcal: ck, share: share(ck) },
    fat: { grams: fg, kcal: fk, share: share(fk) },
    ingredientCount,
    totalGrams,
    servings: safeServings,
  };
}
