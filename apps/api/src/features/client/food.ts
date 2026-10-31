import { createHash } from "node:crypto";
import { newId, schema } from "@traiv/db";
import { gramsForUnit } from "@traiv/nutrition/recipes";
import { and, asc, desc, eq, ilike, inArray, isNull, or, sql, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db.js";
import { AppError, badRequest, forbidden, notFound } from "../../errors.js";
import { hydrateRecipes, ingredientInput } from "../studio/nutrition.js";
import { publishedMealPlans } from "./meal-plans.js";

export const daySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
    "Choose a valid date",
  );
export const slotSchema = z.enum(["breakfast", "lunch", "dinner", "snacks"]);
export const nutritionSchema = z.object({
  kcal: z.number().int().min(0).max(20000),
  proteinG: z.number().min(0).max(2000),
  carbsG: z.number().min(0).max(2000),
  fatG: z.number().min(0).max(2000),
});
export type FoodNutrition = z.infer<typeof nutritionSchema>;
export type FoodItem = FoodNutrition & {
  id: string;
  kind: "food" | "recipe" | "plan" | "manual" | "personal";
  name: string;
  imageUrl: string | null;
  description?: string | null;
  difficulty?: string | null;
  minutes?: number | null;
  brand?: string | null;
  category?: string | null;
  barcode?: string | null;
  servingLabel?: string;
  servingUnit?: string;
  per100?: FoodNutrition;
  per100Micronutrients?: Record<string, number>;
  servings?: number;
  updatedAt?: string;
  baseUnit?: "grams" | "ml";
  baseGrams: number | null;
  micronutrients: Record<string, number>;
  steps: string[];
  ingredients: {
    id: string;
    name: string;
    grams: number;
    nutrition?: FoodNutrition & { micronutrients?: Record<string, number> };
  }[];
  planId?: string;
  recipeId?: string;
  owned: boolean;
};
const zero = (): FoodNutrition => ({ kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 });
export const permissionKeys = [
  "search",
  "barcode",
  "photoLog",
  "calculator",
  "personalPlans",
] as const;
export async function permissions(clientId: string) {
  const [row] = await db
    .select()
    .from(schema.nutritionPermissions)
    .where(eq(schema.nutritionPermissions.clientId, clientId));
  return Object.fromEntries(permissionKeys.map((k) => [k, row ? row[k] === 1 : true])) as Record<
    (typeof permissionKeys)[number],
    boolean
  >;
}
export async function allow(clientId: string, key: (typeof permissionKeys)[number]) {
  if (!(await permissions(clientId))[key])
    throw forbidden("Your coach has disabled this nutrition tool.");
}
const visibleFood = (clientId: string, studioId: string) =>
  and(
    isNull(schema.ingredients.deletedAt),
    or(
      eq(schema.ingredients.clientId, clientId),
      and(
        isNull(schema.ingredients.clientId),
        or(isNull(schema.ingredients.studioId), eq(schema.ingredients.studioId, studioId)),
      ),
    ),
  );
const visibleRecipe = (clientId: string, studioId: string) =>
  and(
    isNull(schema.recipes.deletedAt),
    or(
      eq(schema.recipes.clientId, clientId),
      and(
        isNull(schema.recipes.clientId),
        or(isNull(schema.recipes.studioId), eq(schema.recipes.studioId, studioId)),
      ),
    ),
  );
function micros(value: unknown) {
  return z.record(z.string(), z.number()).catch({}).parse(value);
}
function foodItem(row: typeof schema.ingredients.$inferSelect): FoodItem {
  const baseGrams = row.defaultUnit && row.gramsPerUnit ? row.gramsPerUnit : 100;
  const factor = (baseGrams ?? 100) / 100;
  return {
    id: row.id,
    kind: "food",
    barcode: row.barcode,
    brand: row.brand,
    category: row.category,
    name: row.name,
    imageUrl: row.imageUrl,
    kcal: row.kcal * factor,
    proteinG: row.proteinG * factor,
    carbsG: row.carbsG * factor,
    fatG: row.fatG * factor,
    micronutrients: Object.fromEntries(
      Object.entries(micros(row.micronutrients)).map(([k, v]) => [k, v * factor]),
    ),
    baseUnit: row.baseUnit === "ml" ? "ml" : "grams",
    baseGrams,
    servingUnit: row.defaultUnit ?? undefined,
    servingLabel:
      row.defaultUnit && row.gramsPerUnit
        ? `${row.defaultUnit} (${row.gramsPerUnit} ${row.baseUnit === "ml" ? "ml" : "g"})`
        : `100 ${row.baseUnit === "ml" ? "ml" : "g"}`,
    per100Micronutrients: micros(row.micronutrients),
    per100: { kcal: row.kcal, proteinG: row.proteinG, carbsG: row.carbsG, fatG: row.fatG },
    steps: [],
    ingredients: [],
    owned: Boolean(row.clientId),
  };
}

export async function recipes(
  clientId: string,
  studioId: string,
  search = "",
  mine = false,
  onlyIds?: string[],
) {
  const rows = await db
    .select()
    .from(schema.recipes)
    .where(
      and(
        visibleRecipe(clientId, studioId),
        onlyIds ? inArray(schema.recipes.id, onlyIds) : undefined,
        mine ? eq(schema.recipes.clientId, clientId) : undefined,
        search ? ilike(schema.recipes.name, `%${search.replace(/[\\%_]/g, "\\$&")}%`) : undefined,
      ),
    )
    .orderBy(asc(schema.recipes.name))
    .limit(60);
  return (await hydrateRecipes(rows)).map(
    (r): FoodItem => ({
      id: r.id,
      kind: "recipe",
      name: r.name,
      imageUrl: r.imageUrl,
      ...r.nutrition,
      servings: r.servings,
      updatedAt: r.updatedAt.toISOString(),
      baseGrams: r.ingredients.reduce((n, l) => n + l.grams, 0) / r.servings,
      steps: r.steps,
      ingredients: r.ingredients.map((l) => ({
        id: l.ingredientId,
        name: l.ingredient.name,
        grams: l.grams / r.servings,
        nutrition: {
          kcal: l.ingredient.kcal,
          proteinG: l.ingredient.proteinG,
          carbsG: l.ingredient.carbsG,
          fatG: l.ingredient.fatG,
          micronutrients: l.ingredient.micronutrients,
        },
      })),
      owned: r.clientId === clientId,
    }),
  );
}
export async function catalog(clientId: string, studioId: string, search: string, mode: string) {
  if (mode === "recipes") return recipes(clientId, studioId, search, true);
  if (mode === "recent") {
    const rows = await db
      .select()
      .from(schema.foodLogEntries)
      .where(eq(schema.foodLogEntries.clientId, clientId))
      .orderBy(desc(schema.foodLogEntries.loggedAt))
      .limit(50);
    const seen = new Set<string>();
    return rows.flatMap((r) => {
      const s = r.snapshot;
      if (
        !s ||
        seen.has(`${s.kind}:${s.id}`) ||
        !s.name.toLowerCase().includes(search.toLowerCase())
      )
        return [];
      seen.add(`${s.kind}:${s.id}`);
      return [s];
    });
  }
  await allow(clientId, "search");
  const favorites =
    mode === "favorites"
      ? await db
          .select()
          .from(schema.foodFavorites)
          .where(eq(schema.foodFavorites.clientId, clientId))
      : null;
  const rows = await db
    .select()
    .from(schema.ingredients)
    .where(
      and(
        visibleFood(clientId, studioId),
        favorites
          ? inArray(
              schema.ingredients.id,
              favorites.filter((f) => f.kind === "food").map((f) => f.resourceId),
            )
          : undefined,
        mode === "mine" ? eq(schema.ingredients.clientId, clientId) : undefined,
        search
          ? ilike(schema.ingredients.name, `%${search.replace(/[\\%_]/g, "\\$&")}%`)
          : undefined,
      ),
    )
    .orderBy(
      search
        ? sql`case when lower(${schema.ingredients.name}) = lower(${search}) then 0 when lower(${schema.ingredients.name}) like lower(${search + "%"}) then 1 else 2 end`
        : asc(schema.ingredients.name),
      asc(schema.ingredients.name),
    )
    .limit(60);
  const items: FoodItem[] = [
    ...rows.map(foodItem),
    ...(mode === "mine"
      ? []
      : await recipes(
          clientId,
          studioId,
          search,
          false,
          favorites?.filter((f) => f.kind === "recipe").map((f) => f.resourceId),
        )),
  ];

  return items;
}
export async function resolveItem(
  clientId: string,
  studioId: string,
  kind: string,
  id: string,
  planId?: string,
): Promise<FoodItem> {
  if (kind === "personal") {
    await allow(clientId, "personalPlans");
    const [plan] = await db
      .select()
      .from(schema.foodPersonalPlans)
      .where(
        and(
          eq(schema.foodPersonalPlans.clientId, clientId),
          eq(schema.foodPersonalPlans.id, planId ?? ""),
        ),
      );
    const option = plan?.meals.flatMap((m) => m.options ?? []).find((o) => o.id === id);
    if (!option) throw notFound("Personal recipe not found");
    return option;
  }
  if (kind === "plan") {
    const plans = await publishedMealPlans(clientId);
    const plan = plans.find((p) => p.id === planId);
    const option = plan?.document.slots.flatMap((s) => s.options).find((o) => o.id === id);
    if (!option) throw notFound("Published recipe not found");
    const [metadata] = option.recipeId
      ? await db
          .select({
            description: schema.recipes.description,
            difficulty: schema.recipes.difficulty,
            prepMinutes: schema.recipes.prepMinutes,
            cookMinutes: schema.recipes.cookMinutes,
          })
          .from(schema.recipes)
          .where(eq(schema.recipes.id, option.recipeId))
      : [];
    const ingredients = option.ingredients.map((l) => ({
      id: l.ingredientId,
      name: l.name,
      grams: gramsForUnit(l, l.quantity, l.unit) ?? 0,
      nutrition: l.nutrients,
    }));
    return {
      id,
      kind: "plan",
      recipeId: option.recipeId,
      planId,
      name: option.name,
      description: metadata?.description,
      difficulty: metadata?.difficulty,
      minutes:
        metadata && (metadata.prepMinutes !== null || metadata.cookMinutes !== null)
          ? (metadata.prepMinutes ?? 0) + (metadata.cookMinutes ?? 0)
          : null,
      imageUrl: option.imageUrl,
      ...option.nutrition,
      baseGrams: ingredients.reduce((n, l) => n + l.grams, 0),
      steps: option.steps,
      ingredients,
      owned: false,
    };
  }
  if (kind === "food") {
    const [row] = await db
      .select()
      .from(schema.ingredients)
      .where(and(visibleFood(clientId, studioId), eq(schema.ingredients.id, id)));
    if (row) return foodItem(row);
  }
  if (kind === "recipe") {
    const [row] = await db
      .select()
      .from(schema.recipes)
      .where(and(visibleRecipe(clientId, studioId), eq(schema.recipes.id, id)));
    if (row) {
      const [r] = await hydrateRecipes([row]);
      if (r)
        return {
          id,
          kind: "recipe",
          name: r.name,
          imageUrl: r.imageUrl,
          ...r.nutrition,
          servings: r.servings,
          updatedAt: r.updatedAt.toISOString(),
          baseGrams: r.ingredients.reduce((n, l) => n + l.grams, 0) / r.servings,
          steps: r.steps,
          ingredients: r.ingredients.map((l) => ({
            id: l.ingredientId,
            name: l.ingredient.name,
            grams: l.grams / r.servings,
            nutrition: {
              kcal: l.ingredient.kcal,
              proteinG: l.ingredient.proteinG,
              carbsG: l.ingredient.carbsG,
              fatG: l.ingredient.fatG,
              micronutrients: l.ingredient.micronutrients,
            },
          })),
          owned: r.clientId === clientId,
        };
    }
  }
  throw notFound("Food not found");
}
export async function diary(clientId: string, date: string) {
  const shift = (days: number) => {
    const d = new Date(`${date}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const [entries, goals, plans, intakeTargets, settingsPermissions] = await Promise.all([
    db
      .select()
      .from(schema.foodLogEntries)
      .where(
        and(
          eq(schema.foodLogEntries.clientId, clientId),
          gte(schema.foodLogEntries.date, shift(-3)),
          lte(schema.foodLogEntries.date, shift(3)),
        ),
      )
      .orderBy(asc(schema.foodLogEntries.loggedAt)),
    db.select().from(schema.foodGoals).where(eq(schema.foodGoals.clientId, clientId)),
    publishedMealPlans(clientId),
    db
      .select({
        kcal: schema.nutritionTargets.kcal,
        proteinG: schema.nutritionTargets.proteinG,
        carbsG: schema.nutritionTargets.carbsG,
        fatG: schema.nutritionTargets.fatG,
      })
      .from(schema.nutritionTargets)
      .innerJoin(schema.clients, eq(schema.clients.userId, schema.nutritionTargets.userId))
      .where(and(eq(schema.clients.id, clientId), eq(schema.nutritionTargets.status, "active")))
      .orderBy(desc(schema.nutritionTargets.effectiveFrom))
      .limit(1),
    permissions(clientId),
  ]);
  const selected = entries.filter((e) => e.date === date);
  const loggedDays = [...new Set(entries.map((e) => e.date))];
  const config = settingsPermissions.calculator
    ? (goals.find((g) => g.day === date) ??
      goals.find((g) => g.day === `weekday:${new Date(date + "T12:00:00").getDay()}`) ??
      goals.find((g) => g.day === "default"))
    : undefined;
  const settings = plans[0]?.document.settings;
  const target =
    config ??
    (settings
      ? {
          kcal: settings.calorieTarget,
          proteinG: (settings.calorieTarget * settings.proteinPct) / 400,
          carbsG: (settings.calorieTarget * settings.carbsPct) / 400,
          fatG: (settings.calorieTarget * settings.fatPct) / 900,
        }
      : (intakeTargets[0] ?? null));
  return {
    date,
    entries: selected,
    yesterdayEntries: entries.filter((entry) => entry.date === shift(-1)),
    loggedDays,
    target,
    total: selected.reduce(
      (sum, e) => ({
        kcal: sum.kcal + e.kcal,
        proteinG: sum.proteinG + e.proteinG,
        carbsG: sum.carbsG + e.carbsG,
        fatG: sum.fatG + e.fatG,
      }),
      zero(),
    ),
    permissions: settingsPermissions,
  };
}
export const logSchema = z.object({
  id: z.string().uuid(),
  date: daySchema,
  slot: slotSchema,
  kind: z.enum(["food", "recipe", "plan", "personal", "manual"]),
  resourceId: z.string().max(64).optional(),
  planId: z.string().max(64).optional(),
  quantity: z.number().positive().max(100000),
  mode: z.enum(["serving", "grams", "ml"]),
  name: z.string().trim().min(1).max(255).optional(),
  nutrition: nutritionSchema.optional(),
});
export async function log(clientId: string, studioId: string, input: z.infer<typeof logSchema>) {
  if (input.kind === "food") {
    const [source] = await db
      .select({ barcode: schema.ingredients.barcode })
      .from(schema.ingredients)
      .where(
        and(visibleFood(clientId, studioId), eq(schema.ingredients.id, input.resourceId ?? "")),
      );
    await allow(clientId, source?.barcode ? "barcode" : "search");
  }
  if (input.kind === "recipe") await allow(clientId, "search");
  const item =
    input.kind === "manual"
      ? {
          id: input.id,
          kind: "manual" as const,
          owned: true,
          steps: [],
          ingredients: [],
          name: input.name ?? "Quick add",
          imageUrl: null,
          ...nutritionSchema.parse(input.nutrition),
          micronutrients: {},
          baseGrams: null,
        }
      : await resolveItem(clientId, studioId, input.kind, input.resourceId ?? "", input.planId);
  if (input.mode === "grams" && !item.baseGrams)
    throw badRequest("no_weight", "This food has no known gram weight. Log servings instead.");
  if (input.mode === "ml" && !("baseUnit" in item && item.baseUnit === "ml"))
    throw badRequest("no_volume", "This food has no volume measurement.");
  const scale =
    input.mode === "grams"
      ? input.quantity / (item.baseGrams ?? 1)
      : input.mode === "ml"
        ? input.quantity / (item.baseGrams ?? 100)
        : input.quantity;
  nutritionSchema.parse({
    kcal: Math.round(item.kcal * scale),
    proteinG: item.proteinG * scale,
    carbsG: item.carbsG * scale,
    fatG: item.fatG * scale,
  });
  await db
    .insert(schema.foodLogEntries)
    .values({
      id: input.id,
      clientId,
      date: input.date,
      slot: input.slot,
      recipeId: input.kind === "recipe" ? input.resourceId : null,
      ingredientId: input.kind === "food" ? input.resourceId : null,
      manualName:
        input.kind === "manual" || input.kind === "plan" || input.kind === "personal"
          ? item.name
          : null,
      quantity: input.quantity,
      unit: input.mode,
      servings: scale,
      snapshot: item,
      kcal: Math.round(item.kcal * scale),
      proteinG: item.proteinG * scale,
      carbsG: item.carbsG * scale,
      fatG: item.fatG * scale,
    })
    .onConflictDoNothing({ target: schema.foodLogEntries.id });
}
export const entryPatch = z.object({
  revision: z.number().int().positive(),
  date: daySchema,
  slot: slotSchema,
  quantity: z.number().positive().max(100000),
});
export async function updateEntry(clientId: string, id: string, input: z.infer<typeof entryPatch>) {
  const t = schema.foodLogEntries;
  const [row] = await db
    .select()
    .from(t)
    .where(and(eq(t.clientId, clientId), eq(t.id, id)));
  if (!row?.snapshot) throw notFound();
  const s = row.snapshot;
  const scale =
    row.unit === "grams"
      ? input.quantity / (s.baseGrams ?? 100)
      : row.unit === "ml"
        ? input.quantity / (s.baseGrams ?? 100)
        : input.quantity;
  nutritionSchema.parse({
    kcal: Math.round(s.kcal * scale),
    proteinG: s.proteinG * scale,
    carbsG: s.carbsG * scale,
    fatG: s.fatG * scale,
  });
  const result = await db
    .update(t)
    .set({
      ...input,
      revision: input.revision + 1,
      servings: scale,
      kcal: Math.round(s.kcal * scale),
      proteinG: s.proteinG * scale,
      carbsG: s.carbsG * scale,
      fatG: s.fatG * scale,
    })
    .where(and(eq(t.clientId, clientId), eq(t.id, id), eq(t.revision, input.revision)))
    .returning({ id: t.id });
  if (!result.length) throw badRequest("stale_entry", "This entry changed. Refresh and try again.");
}
export async function copyEntries(
  clientId: string,
  ids: string[],
  date: string,
  slot: z.infer<typeof slotSchema> | "original",
  operationId: string,
) {
  const t = schema.foodLogEntries;
  const rows = await db
    .select()
    .from(t)
    .where(and(eq(t.clientId, clientId), inArray(t.id, ids)));
  await db.transaction(async (tx) => {
    for (const row of rows)
      await tx
        .insert(t)
        .values({
          ...row,
          id: operationResourceId(clientId, operationId, row.id),
          date,
          slot: slot === "original" ? row.slot : slot,
          revision: 1,
          loggedAt: new Date(),
        })
        .onConflictDoNothing({ target: t.id });
  });
}
export async function saveFood(clientId: string, studioId: string, value: unknown, id?: string) {
  const baseUnit = z
    .object({ baseUnit: z.enum(["grams", "ml"]).default("grams") })
    .parse(value).baseUnit;
  const { id: requestedId, ...parsed } = ingredientInput.parse(value);
  const { barcode, brand } = z
    .object({
      brand: z.string().trim().max(200).nullable().optional(),
      barcode: z
        .string()
        .regex(/^\d{8,14}$/)
        .optional(),
    })
    .parse(value);
  const input = { ...parsed, baseUnit, barcode, brand };
  if (id) {
    const [prior] = await db
      .select({ baseUnit: schema.ingredients.baseUnit })
      .from(schema.ingredients)
      .where(
        and(
          eq(schema.ingredients.id, id),
          eq(schema.ingredients.clientId, clientId),
          isNull(schema.ingredients.deletedAt),
        ),
      );
    if (!prior) throw notFound();
    if (prior.baseUnit !== baseUnit) {
      const [used] = await db
        .select({ id: schema.recipeIngredients.id })
        .from(schema.recipeIngredients)
        .where(eq(schema.recipeIngredients.ingredientId, id))
        .limit(1);
      if (used)
        throw badRequest(
          "food_in_recipe",
          "This food is used in a recipe. Create another food to change its gram/ml basis.",
        );
    }
    const rows = await db
      .update(schema.ingredients)
      .set(input)
      .where(
        and(
          eq(schema.ingredients.id, id),
          eq(schema.ingredients.clientId, clientId),
          isNull(schema.ingredients.deletedAt),
        ),
      )
      .returning();
    const row = rows[0];
    if (!row) throw notFound();
    return foodItem(row);
  }
  const foodId = requestedId ?? newId();
  await db
    .insert(schema.ingredients)
    .values({ ...input, id: foodId, clientId, studioId, dataSource: "client" })
    .onConflictDoNothing({ target: schema.ingredients.id });
  const [row] = await db
    .select()
    .from(schema.ingredients)
    .where(and(eq(schema.ingredients.id, foodId), eq(schema.ingredients.clientId, clientId)));
  if (!row) throw notFound();
  return foodItem(row);
}
export const clientRecipeInput = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  servings: z.number().int().min(1).max(50),
  imageUrl: z.string().url().nullable(),
  expectedUpdatedAt: z.iso.datetime().optional(),
  steps: z.array(z.string().min(1).max(4000)).max(100),
  ingredients: z
    .array(z.object({ id: z.string().max(64), grams: z.number().positive().max(100000) }))
    .min(1)
    .max(100),
});
export async function saveRecipe(
  clientId: string,
  studioId: string,
  input: z.infer<typeof clientRecipeInput>,
  existing = false,
) {
  await db.transaction(async (tx) => {
    if (existing) {
      const [owned] = await tx
        .select()
        .from(schema.recipes)
        .where(
          and(
            eq(schema.recipes.id, input.id),
            eq(schema.recipes.clientId, clientId),
            isNull(schema.recipes.deletedAt),
          ),
        )
        .for("update");
      if (!owned) throw notFound();
      if (input.expectedUpdatedAt !== owned.updatedAt.toISOString())
        throw new AppError(
          409,
          "stale_recipe",
          "This recipe changed. Close and reopen it before editing.",
        );
    }
    const ids = input.ingredients.map((i) => i.id);
    const foods = await tx
      .select()
      .from(schema.ingredients)
      .where(and(visibleFood(clientId, studioId), inArray(schema.ingredients.id, ids)));
    if (foods.some((f) => f.baseUnit !== "grams"))
      throw badRequest(
        "unknown_density",
        "Use an ingredient with nutrition per 100 grams in recipes.",
      );
    if (new Set(ids).size !== foods.length)
      throw badRequest("missing_food", "An ingredient is no longer available.");
    if (existing) {
      await tx
        .update(schema.recipes)
        .set({ name: input.name, servings: input.servings, imageUrl: input.imageUrl })
        .where(eq(schema.recipes.id, input.id));
      await tx
        .delete(schema.recipeIngredients)
        .where(eq(schema.recipeIngredients.recipeId, input.id));
      await tx.delete(schema.recipeSteps).where(eq(schema.recipeSteps.recipeId, input.id));
    } else {
      const added = await tx
        .insert(schema.recipes)
        .values({
          id: input.id,
          studioId,
          clientId,
          name: input.name,
          servings: input.servings,
          imageUrl: input.imageUrl,
          source: "client",
        })
        .onConflictDoNothing()
        .returning();
      if (!added.length) return;
    }
    await tx.insert(schema.recipeIngredients).values(
      input.ingredients.map((l, position) => ({
        id: newId(),
        recipeId: input.id,
        ingredientId: l.id,
        position,
        quantity: l.grams,
        unit: "grams",
      })),
    );
    if (input.steps.length)
      await tx.insert(schema.recipeSteps).values(
        input.steps.map((text, position) => ({
          id: newId(),
          recipeId: input.id,
          position,
          text,
        })),
      );
  });
  return resolveItem(clientId, studioId, "recipe", input.id);
}

/** Stable UUIDs make bulk retries safe without growing copied identifiers. */
export function operationResourceId(clientId: string, operationId: string, resourceId: string) {
  const hex = createHash("sha256").update(`${clientId}:${operationId}:${resourceId}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
