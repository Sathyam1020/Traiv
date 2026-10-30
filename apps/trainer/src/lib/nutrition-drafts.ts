import type { Ingredient, IngredientWrite, RecipeWrite } from "./api/nutrition";

const record = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const textOrNull = (v: unknown) => v === null || typeof v === "string";
function ingredient(v: unknown): v is IngredientWrite {
  return (
    record(v) &&
    typeof v.name === "string" &&
    (v.id === undefined || typeof v.id === "string") &&
    [v.category, v.country, v.defaultUnit, v.imageUrl].every(textOrNull) &&
    (v.gramsPerUnit === null || finite(v.gramsPerUnit)) &&
    [v.kcal, v.proteinG, v.carbsG, v.fatG].every(finite) &&
    strings(v.dietaryTags) &&
    strings(v.allergenTags) &&
    record(v.micronutrients) &&
    Object.values(v.micronutrients).every(finite)
  );
}
function recipe(v: unknown): v is RecipeWrite {
  return (
    record(v) &&
    typeof v.name === "string" &&
    typeof v.difficulty === "string" &&
    finite(v.servings) &&
    [v.description, v.imageUrl, v.videoUrl, v.videoLinkUrl].every(textOrNull) &&
    [v.prepMinutes, v.cookMinutes].every((x) => x === null || finite(x)) &&
    strings(v.mealTypes) &&
    strings(v.dietaryTags) &&
    strings(v.allergenTags) &&
    strings(v.steps) &&
    (v.expectedUpdatedAt === undefined || typeof v.expectedUpdatedAt === "string") &&
    Array.isArray(v.ingredients) &&
    v.ingredients.every(
      (x) =>
        record(x) &&
        typeof x.ingredientId === "string" &&
        finite(x.quantity) &&
        typeof x.unit === "string",
    )
  );
}
export function ingredientDraft(raw: string): IngredientWrite {
  const value: unknown = JSON.parse(raw);
  if (!ingredient(value)) throw new Error("Ingredient draft is incomplete");
  return value;
}
export function recipeDraft(raw: string): RecipeWrite {
  const value: unknown = JSON.parse(raw);
  if (!recipe(value)) throw new Error("Recipe draft is incomplete");
  return value;
}
export function editorDraft(raw: string): { value: RecipeWrite; known: Ingredient[] } {
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    !recipe(value.value) ||
    !Array.isArray(value.known) ||
    !value.known.every(
      (i): i is Ingredient =>
        ingredient(i) && typeof i.id === "string" && "studioId" in i && textOrNull(i.studioId),
    )
  )
    throw new Error("Recipe draft is incomplete");
  return { value: value.value, known: value.known };
}
export function clearNutritionDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Nutrition saved, but local draft storage could not be cleared", error);
  }
}
