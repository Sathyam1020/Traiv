import { z } from "zod";

const nutrient = z.object({
  code: z.string(),
  name: z.string(),
  unit: z.string(),
  amountPer100g: z.number().finite().nonnegative(),
});
const sourceIngredient = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.string().nullable(),
  unit: z.string().nullable(),
  unitGrams: z.number().nullable(),
  countryCode: z.string().nullable(),
  type: z.string().nullable().optional(),
  nutrients: z.array(nutrient).default([]),
});
const tag = z.object({ tag: z.string() });
const details = z.object({
  ingredients: z.array(sourceIngredient),
  recipes: z.array(
    z.object({
      id: z.string(),
      steps: z.array(z.object({ stepNumber: z.number(), text: z.string() })),
      tags: z.array(tag),
    }),
  ),
});
const sourceRecipes = z.array(
  z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().nullable(),
    servings: z.number().int().positive(),
    prepTime: z.number().nonnegative(),
    cookTime: z.number().nonnegative(),
    difficulty: z.string(),
    imageUrl: z.string().url().nullable(),
    thumbnailUrl: z.string().url().nullable(),
    videoUrl: z.string().url().nullable(),
    ingredients: z
      .array(
        z.object({
          ingredient: z.string(),
          amountInGrams: z.number().finite().positive(),
          proteinPer100g: z.number().finite().nonnegative(),
          carbsPer100g: z.number().finite().nonnegative(),
          fatPer100g: z.number().finite().nonnegative(),
          kcalPer100g: z.number().int().min(0).max(2000),
        }),
      )
      .min(1),
    mealTypes: z.array(z.object({ mealType: z.object({ name: z.string() }) })),
    macros: z.object({
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      calories: z.number(),
    }),
  }),
);
const MICRO_KEYS: Record<string, string> = {
  fiber: "fiberG",
  sugar_total: "sugarG",
  sodium: "sodiumMg",
  saturated_fat: "saturatedFatG",
  cholesterol: "cholesterolMg",
  iron: "ironMg",
  calcium: "calciumMg",
  potassium: "potassiumMg",
  vitamin_d: "vitaminDUg",
  vitamin_c: "vitaminCMg",
};
const TAGS: Record<string, string> = {
  "high-protein": "High Protein",
  "low-carbs": "Low Carbs",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  pescetarian: "Pescetarian",
  "diabetic-friendly": "Diabetic Friendly",
  pregnancy: "Pregnancy",
  pcos: "PCOS",
  halal: "Halal",
  kosher: "Kosher",
  "has-peanuts": "Contains Peanuts",
  "has-gluten": "Gluten",
  "has-fish": "Fish",
  "has-shellfish": "Shellfish",
  "has-eggs": "Eggs",
  "has-soy": "Soy",
  "has-nuts": "Nuts",
  "has-sesame": "Sesame",
  "has-lactose": "Lactose",
  "has-dairy": "Dairy",
  "has-sugar": "Sugar",
  "contains-peanuts": "Contains Peanuts",
  "contains-gluten": "Gluten",
  "contains-fish": "Fish",
  "contains-shellfish": "Shellfish",
  "contains-eggs": "Eggs",
  "contains-soy": "Soy",
  "contains-nuts": "Nuts",
  "contains-sesame": "Sesame",
  "contains-lactose": "Lactose",
  "contains-dairy": "Dairy",
  "contains-sugar": "Sugar",
};
const ALLERGEN_TAGS = new Set([
  "Contains Peanuts",
  "Gluten",
  "Fish",
  "Shellfish",
  "Eggs",
  "Soy",
  "Nuts",
  "Sesame",
  "Lactose",
  "Dairy",
  "Sugar",
]);
/** Join the supplied list export with the authenticated detail export. Fail before
 * writing anything if a name, instruction record or nutrition profile is unresolved. */
export function prepareCoachwayImport(list: unknown, detailExport: unknown) {
  const recipes = sourceRecipes.parse(list);
  const detail = details.parse(detailExport);
  const named = new Map(detail.ingredients.map((i) => [i.id, i]));
  const recipeDetails = new Map(detail.recipes.map((r) => [r.id, r]));
  if (new Set(recipes.map((r) => r.id)).size !== recipes.length)
    throw new Error("Duplicate source recipe IDs");
  const ingredients = new Map<
    string,
    {
      sourceId: string;
      name: string;
      dataSource: string;
      category: string | null;
      country: string;
      nutrientType: string | null;
      defaultUnit: string | null;
      gramsPerUnit: number | null;
      kcal: number;
      proteinG: number;
      carbsG: number;
      fatG: number;
      micronutrients: Record<string, number>;
    }
  >();
  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  const prepared = recipes.map((r) => {
    const extra = recipeDetails.get(r.id);
    if (!extra) throw new Error(`Missing detail for source recipe ${r.id}`);
    const totals = { protein: 0, carbs: 0, fat: 0, calories: 0 };
    const lines = r.ingredients.map((line) => {
      const source = named.get(line.ingredient);
      if (!source) throw new Error(`Missing name for source ingredient ${line.ingredient}`);
      const macros = {
        kcal: line.kcalPer100g,
        proteinG: line.proteinPer100g,
        carbsG: line.carbsPer100g,
        fatG: line.fatPer100g,
      };
      const previous = ingredients.get(source.id);
      if (
        previous &&
        (previous.kcal !== macros.kcal ||
          previous.proteinG !== macros.proteinG ||
          previous.carbsG !== macros.carbsG ||
          previous.fatG !== macros.fatG)
      )
        throw new Error(`Conflicting snapshot profiles for ingredient ${source.id}`);
      const serving =
        source.unit && source.unit !== "grams" && source.unitGrams && source.unitGrams > 0;
      const country =
        source.countryCode && /^[a-z]{2}$/iu.test(source.countryCode)
          ? (displayNames.of(source.countryCode.toUpperCase()) ?? "Global")
          : "Global";
      ingredients.set(source.id, {
        sourceId: source.id,
        name: source.name,
        dataSource: `coachway:${source.id}`,
        category: source.category?.replace(/_/gu, " ") ?? null,
        country,
        nutrientType:
          source.type === "carb"
            ? "carbs"
            : ["protein", "fat", "condiment", "spice"].includes(source.type ?? "")
              ? (source.type ?? null)
              : null,
        defaultUnit: serving ? source.unit : null,
        gramsPerUnit: serving ? source.unitGrams : null,
        ...macros,
        micronutrients: Object.fromEntries(
          source.nutrients.map((n) => [
            MICRO_KEYS[n.code] ?? `${n.name} (${n.unit})`,
            n.amountPer100g,
          ]),
        ),
      });
      totals.protein += (macros.proteinG * line.amountInGrams) / 100;
      totals.carbs += (macros.carbsG * line.amountInGrams) / 100;
      totals.fat += (macros.fatG * line.amountInGrams) / 100;
      totals.calories += (macros.kcal * line.amountInGrams) / 100;
      return { sourceIngredientId: source.id, quantity: line.amountInGrams, unit: "grams" };
    });
    for (const key of ["protein", "carbs", "fat", "calories"] as const)
      if (Math.abs(totals[key] - r.macros[key]) > 0.1)
        throw new Error(`Source totals do not match ingredient snapshots: ${r.id}`);
    const tags = extra.tags.map((t) => TAGS[t.tag] ?? t.tag.replace(/-/gu, " "));
    return {
      sourceId: r.id,
      seedKey: `coachway:${r.id}`,
      name: r.title,
      description: r.description,
      servings: r.servings,
      imageUrl: r.imageUrl ?? r.thumbnailUrl,
      videoUrl: r.videoUrl,
      mealTypes: [...new Set(r.mealTypes.map((m) => m.mealType.name))],
      dietaryTags: tags.filter((t) => !ALLERGEN_TAGS.has(t)),
      allergenTags: tags.filter((t) => ALLERGEN_TAGS.has(t)),
      difficulty: r.difficulty,
      prepMinutes: r.prepTime,
      cookMinutes: r.cookTime,
      ingredients: lines,
      steps: [...extra.steps]
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((s) => s.text)
        .filter((s) => s.trim().length > 0),
      sourceMacros: r.macros,
    };
  });
  return { ingredients: [...ingredients.values()], recipes: prepared };
}
