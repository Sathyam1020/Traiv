import { newId, schema } from "@traiv/db";
import { gramsForUnit, recipeNutrition } from "@traiv/nutrition/recipes";
import { and, asc, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db.js";
import { AppError, badRequest, forbidden, notFound } from "../../errors.js";
import { isUniqueViolation } from "../../lib/db-errors.js";

const nullableText = z.string().trim().max(200).nullable().default(null);
const media = z
  .string()
  .url()
  .max(2000)
  .refine((s) => /^https?:\/\//u.test(s), "Use an http or https URL")
  .nullable()
  .default(null);
const tags = z.array(z.string().trim().min(1).max(80)).max(30).default([]);
export const ingredientInput = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(255),
    category: nullableText,
    country: nullableText,
    dietaryTags: tags,
    allergenTags: tags,
    nutrientType: z
      .enum(["protein", "carbs", "fat", "mixed", "condiment", "spice"])
      .nullable()
      .default(null),
    defaultUnit: nullableText,
    gramsPerUnit: z.number().positive().max(100000).nullable().default(null),
    kcal: z.number().int().min(0).max(2000),
    proteinG: z.number().min(0).max(100),
    carbsG: z.number().min(0).max(100),
    fatG: z.number().min(0).max(100),
    micronutrients: z.record(z.string().max(80), z.number().finite().nonnegative()).default({}),
    imageUrl: media,
  })
  .refine((v) => Boolean(v.defaultUnit) === (v.gramsPerUnit !== null), {
    message: "Set both a serving unit and its gram weight, or leave both empty.",
  });
/** Keep field errors useful in the library without changing other features' error contract. */
export function parseNutritionInput<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success)
    throw badRequest(
      "invalid_nutrition",
      result.error.issues.map((i) => `${i.path.join(".") || "Recipe"}: ${i.message}`).join(" "),
    );
  return result.data;
}
export type IngredientInput = z.infer<typeof ingredientInput>;
export const recipeInput = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(255),
    servings: z.number().int().min(1).max(50),
    description: z.string().max(2048).nullable().default(null),
    imageUrl: media,
    videoUrl: media,
    videoLinkUrl: media,
    mealTypes: tags.refine((v) => v.length > 0, "Choose a meal type"),
    dietaryTags: tags,
    allergenTags: tags,
    difficulty: z.enum(["none", "easy", "medium", "hard"]).default("none"),
    prepMinutes: z.number().int().min(0).max(1440).nullable().default(null),
    cookMinutes: z.number().int().min(0).max(1440).nullable().default(null),
    ingredients: z
      .array(
        z.object({
          ingredientId: z.string().min(1).max(64),
          preparationNote: z.string().max(1000).nullable().default(null),
          minimumUnitAmount: z.enum(["whole", "halves", "quarters", "all"]).default("all"),
          quantity: z.number().positive().max(100000),
          unit: z.string().min(1).max(80),
        }),
      )
      .max(100),
    steps: z.array(z.string().trim().min(1).max(4000)).max(100),
    expectedUpdatedAt: z.iso.datetime().optional(),
  })
  .refine((v) => !(v.videoUrl && v.videoLinkUrl), {
    message: "Choose an uploaded video or a video link.",
  });
export type RecipeInput = z.infer<typeof recipeInput>;
export const libraryQuery = z.object({
  search: z.string().trim().max(120).default(""),
  category: z.string().max(200).optional(),
  country: z.string().max(200).optional(),
  tags: z.string().max(1000).optional(),
  mealType: z.string().max(300).optional(),
  type: z.enum(["Personal", "System"]).optional(),
  sort: z.enum(["name", "name-desc", "newest"]).default("name"),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
});
export type LibraryQuery = z.infer<typeof libraryQuery>;
const visibleIngredient = (studioId: string) =>
  and(
    isNull(schema.ingredients.deletedAt),
    isNull(schema.ingredients.clientId),
    eq(schema.ingredients.baseUnit, "grams"),
    or(isNull(schema.ingredients.studioId), eq(schema.ingredients.studioId, studioId)),
  );
const visibleRecipe = (studioId: string) =>
  and(
    isNull(schema.recipes.deletedAt),
    isNull(schema.recipes.clientId),
    or(isNull(schema.recipes.studioId), eq(schema.recipes.studioId, studioId)),
  );
const literalSearch = (s: string) => `%${s.replace(/[\\%_]/gu, "\\$&")}%`;

export async function listIngredients(studioId: string, q: LibraryQuery) {
  const t = schema.ingredients;
  const term = q.search.trim();
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  // Rank before pagination: alphabetical substring matching buries salt beneath
  // hundreds of foods described as "with salt" or "without salt".
  const relevance = term
    ? sql`case
        when lower(${t.name}) = lower(${term}) then 0
        when ${t.name} ~* ${`^${escaped}([^[:alnum:]]|$)`} then 1
        when ${t.name} ~* ${`(^|[^[:alnum:]])${escaped}([^[:alnum:]]|$)`} then 2
        when ${t.name} ilike ${literalSearch(term).slice(1)} then 3
        else 4 end`
    : undefined;
  const where = and(
    visibleIngredient(studioId),
    term ? ilike(t.name, literalSearch(term)) : undefined,
    q.category ? eq(t.category, q.category) : undefined,
    q.country ? eq(t.country, q.country) : undefined,
    q.type === "System"
      ? isNull(t.studioId)
      : q.type === "Personal"
        ? eq(t.studioId, studioId)
        : undefined,
    q.tags
      ? sql`(${t.dietaryTags} || ${t.allergenTags}) @> ${sql.param(q.tags.split(","))}::text[]`
      : undefined,
  );
  const [items, count, facets] = await Promise.all([
    db
      .select()
      .from(t)
      .where(where)
      .orderBy(
        ...(relevance ? [asc(relevance), asc(sql`length(${t.name})`)] : []),
        q.sort === "newest"
          ? desc(t.createdAt)
          : q.sort === "name-desc"
            ? desc(t.name)
            : asc(t.name),
        asc(t.id),
      )
      .limit(q.perPage)
      .offset((q.page - 1) * q.perPage),
    db.select({ total: sql<number>`count(*)::int` }).from(t).where(where),
    db
      .selectDistinct({ category: t.category, country: t.country })
      .from(t)
      .where(visibleIngredient(studioId)),
  ]);
  return {
    items: items.map((i) => ({ ...i, micronutrients: nutrientRecord(i.micronutrients) })),
    total: count[0]?.total ?? 0,
    page: q.page,
    perPage: q.perPage,
    categories: [
      ...new Set(facets.map((f) => f.category).filter((v): v is string => Boolean(v))),
    ].sort(),
    countries: [
      ...new Set(facets.map((f) => f.country).filter((v): v is string => Boolean(v))),
    ].sort((a, b) => (a === "India" ? -1 : b === "India" ? 1 : a.localeCompare(b))),
  };
}
export async function getIngredient(studioId: string, id: string) {
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(and(visibleIngredient(studioId), eq(schema.ingredients.id, id)));
  if (!row) throw notFound("Ingredient not found.");
  return { ...row, micronutrients: nutrientRecord(row.micronutrients) };
}
export async function createIngredient(studioId: string, input: IngredientInput) {
  const { id = newId(), ...values } = input;
  // The browser retains this ID across retries; a lost response must not create a second row.
  await db
    .insert(schema.ingredients)
    .values({ ...values, id, studioId, dataSource: "coach" })
    .onConflictDoNothing();
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(and(visibleIngredient(studioId), eq(schema.ingredients.id, id)));
  if (!row)
    throw new AppError(
      409,
      "ingredient_name_taken",
      "You already have an ingredient with that name. Edit it or choose another name.",
    );
  if (row.studioId !== studioId) throw forbidden();
  return row;
}
export async function updateIngredient(studioId: string, id: string, input: IngredientInput) {
  const { id: _id, ...values } = input;
  try {
    await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(schema.ingredients)
        .where(and(visibleIngredient(studioId), eq(schema.ingredients.id, id)))
        .for("update");
      if (!row) throw notFound("Ingredient not found.");
      if (row.studioId !== studioId)
        throw forbidden("System ingredients are read-only. Create a Personal ingredient instead.");
      if (row.defaultUnit !== input.defaultUnit || row.gramsPerUnit !== input.gramsPerUnit) {
        const [used] = await tx
          .select({ id: schema.recipeIngredients.id })
          .from(schema.recipeIngredients)
          .where(
            and(
              eq(schema.recipeIngredients.ingredientId, id),
              sql`${schema.recipeIngredients.unit} <> 'grams'`,
            ),
          )
          .limit(1);
        if (used)
          throw badRequest(
            "conversion_in_use",
            "This serving conversion is used in a recipe. Change that recipe to grams before editing the conversion.",
          );
      }
      await tx
        .update(schema.ingredients)
        .set(values)
        .where(and(eq(schema.ingredients.id, id), eq(schema.ingredients.studioId, studioId)));
    });
  } catch (err) {
    if (isUniqueViolation(err))
      throw new AppError(
        409,
        "ingredient_name_taken",
        "You already have an ingredient with that name. Choose another name.",
      );
    throw err;
  }
  return getIngredient(studioId, id);
}
export async function deleteIngredient(studioId: string, id: string) {
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(and(eq(schema.ingredients.id, id), eq(schema.ingredients.studioId, studioId)));
  if (!row) throw forbidden("Only your Personal ingredients can be deleted.");
  await db
    .update(schema.ingredients)
    .set({ deletedAt: new Date() })
    .where(eq(schema.ingredients.id, id));
}

export function ingredientGrams(
  ingredient: { defaultUnit: string | null; gramsPerUnit: number | null },
  quantity: number,
  unit: string,
) {
  const grams = gramsForUnit(ingredient, quantity, unit);
  if (grams !== null) return grams;
  throw badRequest(
    "missing_conversion",
    "This ingredient has no gram conversion for that unit. Use grams or edit its serving size.",
  );
}
function nutrientRecord(value: unknown): Record<string, number> {
  return z.record(z.string(), z.number()).safeParse(value).data ?? {};
}
export async function hydrateRecipes(rows: (typeof schema.recipes.$inferSelect)[]) {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const [lines, steps] = await Promise.all([
    db
      .select({ line: schema.recipeIngredients, ingredient: schema.ingredients })
      .from(schema.recipeIngredients)
      .innerJoin(
        schema.ingredients,
        eq(schema.ingredients.id, schema.recipeIngredients.ingredientId),
      )
      .where(inArray(schema.recipeIngredients.recipeId, ids))
      .orderBy(asc(schema.recipeIngredients.position)),
    db
      .select()
      .from(schema.recipeSteps)
      .where(inArray(schema.recipeSteps.recipeId, ids))
      .orderBy(asc(schema.recipeSteps.position)),
  ]);
  return rows.map((row) => {
    const ingredients = lines
      .filter((l) => l.line.recipeId === row.id)
      .map(({ line, ingredient }) => ({
        ...line,
        ingredient: { ...ingredient, micronutrients: nutrientRecord(ingredient.micronutrients) },
        grams: ingredientGrams(ingredient, line.quantity, line.unit),
      }));
    const nutrition = recipeNutrition(
      ingredients.map((l) => ({
        grams: l.grams,
        ingredient: {
          ...l.ingredient,
          micronutrients: nutrientRecord(l.ingredient.micronutrients),
        },
      })),
      row.servings,
    );
    return {
      ...row,
      ingredients,
      steps: steps.filter((s) => s.recipeId === row.id).map((s) => s.text),
      nutrition,
    };
  });
}
export async function listRecipes(studioId: string, q: LibraryQuery) {
  const t = schema.recipes;
  const where = and(
    visibleRecipe(studioId),
    q.search ? ilike(t.name, literalSearch(q.search)) : undefined,
    q.type === "System"
      ? isNull(t.studioId)
      : q.type === "Personal"
        ? eq(t.studioId, studioId)
        : undefined,
    q.tags
      ? sql`(${t.dietaryTags} || ${t.allergenTags}) @> ${sql.param(q.tags.split(","))}::text[]`
      : undefined,
    q.mealType ? sql`${t.mealTypes} && ${sql.param(q.mealType.split(","))}::text[]` : undefined,
  );
  const [rows, count] = await Promise.all([
    db
      .select()
      .from(t)
      .where(where)
      .orderBy(
        q.sort === "newest"
          ? desc(t.createdAt)
          : q.sort === "name-desc"
            ? desc(t.name)
            : asc(t.name),
        asc(t.id),
      )
      .limit(q.perPage)
      .offset((q.page - 1) * q.perPage),
    db.select({ total: sql<number>`count(*)::int` }).from(t).where(where),
  ]);
  return {
    items: await hydrateRecipes(rows),
    total: count[0]?.total ?? 0,
    page: q.page,
    perPage: q.perPage,
  };
}
export async function getRecipe(studioId: string, id: string) {
  const rows = await db
    .select()
    .from(schema.recipes)
    .where(and(visibleRecipe(studioId), eq(schema.recipes.id, id)));
  const [recipe] = await hydrateRecipes(rows);
  if (!recipe) throw notFound("Recipe not found.");
  return recipe;
}
export async function saveRecipe(
  studioId: string,
  membershipId: string,
  input: RecipeInput,
  existingId?: string,
) {
  const { ingredients, steps, expectedUpdatedAt, id: requestedId, ...values } = input;
  const id = existingId ?? requestedId ?? newId();
  await db.transaction(async (tx) => {
    if (!existingId) {
      const inserted = await tx
        .insert(schema.recipes)
        .values({ ...values, id, studioId, source: "coach", createdBy: membershipId })
        .onConflictDoNothing()
        .returning({ id: schema.recipes.id });
      if (!inserted.length) {
        const [prior] = await tx.select().from(schema.recipes).where(eq(schema.recipes.id, id));
        if (!prior || prior.studioId !== studioId || prior.deletedAt) throw forbidden();
        return;
      }
    } else {
      const [prior] = await tx
        .select()
        .from(schema.recipes)
        .where(
          and(
            eq(schema.recipes.id, id),
            eq(schema.recipes.studioId, studioId),
            isNull(schema.recipes.deletedAt),
            isNull(schema.recipes.clientId),
          ),
        )
        .for("update");
      if (!prior) throw forbidden("Only your Personal recipes can be edited.");
      if (!expectedUpdatedAt || prior.updatedAt.toISOString() !== expectedUpdatedAt)
        throw new AppError(
          409,
          "stale_recipe",
          "This recipe changed in another tab. Reload it before saving again.",
        );
    }
    const ingredientIds = [...new Set(ingredients.map((l) => l.ingredientId))];
    const available = ingredientIds.length
      ? await tx
          .select()
          .from(schema.ingredients)
          .where(and(visibleIngredient(studioId), inArray(schema.ingredients.id, ingredientIds)))
          .for("share")
      : [];
    if (available.length !== ingredientIds.length)
      throw badRequest(
        "ingredient_unavailable",
        "An ingredient was removed or belongs to another studio. Choose an available ingredient.",
      );
    for (const line of ingredients) {
      const ingredient = available.find((r) => r.id === line.ingredientId);
      if (!ingredient)
        throw badRequest("ingredient_unavailable", "Choose an available ingredient.");
      ingredientGrams(ingredient, line.quantity, line.unit);
    }
    if (existingId) {
      await tx
        .update(schema.recipes)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(schema.recipes.id, id));
      await tx.delete(schema.recipeIngredients).where(eq(schema.recipeIngredients.recipeId, id));
      await tx.delete(schema.recipeSteps).where(eq(schema.recipeSteps.recipeId, id));
    }
    if (ingredients.length)
      await tx
        .insert(schema.recipeIngredients)
        .values(ingredients.map((l, position) => ({ ...l, id: newId(), recipeId: id, position })));
    if (steps.length)
      await tx
        .insert(schema.recipeSteps)
        .values(steps.map((text, position) => ({ id: newId(), recipeId: id, position, text })));
  });
  return getRecipe(studioId, id);
}
export async function duplicateRecipe(
  studioId: string,
  membershipId: string,
  id: string,
  copyId: string,
) {
  const original = await getRecipe(studioId, id);
  return saveRecipe(
    studioId,
    membershipId,
    recipeInput.parse({
      ...original,
      id: copyId,
      name: `${original.name.slice(0, 248)} (copy)`,
      difficulty: original.difficulty ?? "none",
      ingredients: original.ingredients.map((l) => ({
        ingredientId: l.ingredientId,
        quantity: l.quantity,
        unit: l.unit,
        preparationNote: l.preparationNote,
        minimumUnitAmount: l.minimumUnitAmount,
      })),
    }),
  );
}
export async function deleteRecipe(studioId: string, id: string) {
  const [row] = await db
    .select()
    .from(schema.recipes)
    .where(
      and(
        eq(schema.recipes.id, id),
        eq(schema.recipes.studioId, studioId),
        isNull(schema.recipes.clientId),
      ),
    );
  if (!row) throw forbidden("Only your Personal recipes can be deleted.");
  await db.update(schema.recipes).set({ deletedAt: new Date() }).where(eq(schema.recipes.id, id));
}
