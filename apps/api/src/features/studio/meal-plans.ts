import { newId, schema } from "@traiv/db";
import {
  optionConflicts,
  optionNutrition,
  scaleOption,
  slotTargets,
  type PlanDocument,
  type PlanOption,
  type PlanIngredient,
  type PlanSettings,
} from "@traiv/nutrition/meal-plans";
import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db.js";
import { AppError, badRequest, notFound } from "../../errors.js";
import { getRecipe, getIngredient, listRecipes, libraryQuery } from "./nutrition.js";

const pct = z.number().min(0).max(100);
const slotPct = pct.int();
const tags = z.array(z.string().min(1).max(80)).max(30);
export const planSettingsSchema = z
  .object({
    name: z.string().trim().min(1).max(40),
    description: z.string().max(4096).default(""),
    coverImageUrl: z
      .string()
      .url()
      .max(2000)
      .regex(/^https?:\/\//u)
      .nullable()
      .default(null),
    calorieTarget: z.number().int().min(100).max(20000),
    recipesPerMeal: z.number().int().min(1).max(20),
    proteinPct: pct,
    carbsPct: pct,
    fatPct: pct,
    dietaryPreferences: tags,
    allergensToAvoid: tags,
    recipeSourceSetting: z.enum(["all", "mine"]),
    recipeMatching: z.enum(["scale", "best_match"]),
  })
  .refine(
    (v) => Math.abs(v.proteinPct + v.carbsPct + v.fatPct - 100) < 0.011,
    "Macro percentages must total 100%.",
  );
const nutrients = z.object({
  kcal: z.number().nonnegative(),
  proteinG: z.number().nonnegative(),
  carbsG: z.number().nonnegative(),
  fatG: z.number().nonnegative(),
  micronutrients: z.record(z.string(), z.number().nonnegative()),
});
const optionSchema = z.object({
  id: z.string().uuid(),
  recipeId: z.string().min(1).max(64),
  name: z.string(),
  imageUrl: z.string().nullable(),
  personal: z.boolean(),
  mealTypes: tags,
  dietaryTags: tags,
  allergenTags: tags,
  steps: z.array(z.string().trim().min(1).max(4096)).max(100),
  locked: z.boolean(),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string(),
        name: z.string(),
        quantity: z.number().positive().max(100000),
        originalQuantity: z.number().positive(),
        unit: z.string(),
        defaultUnit: z.string().nullable(),
        gramsPerUnit: z.number().positive().nullable(),
        preparationNote: z.string().nullable(),
        minimumUnitAmount: z.enum(["whole", "halves", "quarters", "all"]),
        nutrients,
      }),
    )
    .max(100),
});
export const planDocumentSchema = z
  .object({
    settings: planSettingsSchema,
    slots: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z.string().trim().min(1).max(80),
          percentage: slotPct,
          enabled: z.boolean(),
          options: z.array(optionSchema).max(30),
        }),
      )
      .min(1)
      .max(12),
  })
  .superRefine((v, ctx) => {
    if (
      v.slots.filter((s) => s.enabled).reduce((n, s) => n + s.percentage, 0) !== 100 ||
      v.slots.some((s) => (!s.enabled && s.percentage !== 0) || (s.enabled && s.percentage === 0))
    )
      ctx.addIssue({
        code: "custom",
        message: "Enabled meal percentages must total 100%; disabled meals must be 0%.",
      });
    if (
      new Set(v.slots.map((s) => s.id)).size !== v.slots.length ||
      new Set(v.slots.map((s) => s.name.toLowerCase())).size !== v.slots.length
    )
      ctx.addIssue({ code: "custom", message: "Meal names and IDs must be unique." });
    const ids = v.slots.flatMap((s) => s.options.map((o) => o.id));
    if (
      new Set(ids).size !== ids.length ||
      v.slots.some((s) => new Set(s.options.map((o) => o.recipeId)).size !== s.options.length)
    )
      ctx.addIssue({ code: "custom", message: "A recipe may only appear once in each meal." });
  });
export const planWriteSchema = z.object({
  document: planDocumentSchema,
  expectedUpdatedAt: z.iso.datetime().optional(),
  rebalance: z.boolean().default(false),
});
export const presetSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1).max(40),
    proteinPct: pct,
    carbsPct: pct,
    fatPct: pct,
  })
  .refine(
    (v) => Math.abs(v.proteinPct + v.carbsPct + v.fatPct - 100) < 0.011,
    "Macro percentages must total 100%.",
  );
const visible = (studioId: string, id?: string) =>
  and(
    eq(schema.mealPlanTemplates.studioId, studioId),
    id ? undefined : isNull(schema.mealPlanTemplates.clientId),
    isNull(schema.mealPlanTemplates.archivedAt),
    id ? eq(schema.mealPlanTemplates.id, id) : undefined,
  );
function decode(row: typeof schema.mealPlanTemplates.$inferSelect) {
  const document = planDocumentSchema.parse(row.draftDocument);
  const published = row.publishedDocument ? planDocumentSchema.parse(row.publishedDocument) : null;
  return {
    id: row.id,
    clientId: row.clientId,
    updatedAt: row.updatedAt.toISOString(),
    status: row.status,
    document,
    published,
    hasChanges: Boolean(published && JSON.stringify(document) !== JSON.stringify(published)),
  };
}
export async function getMealPlan(studioId: string, id: string) {
  const [row] = await db.select().from(schema.mealPlanTemplates).where(visible(studioId, id));
  if (!row) throw notFound("Meal plan not found.");
  if (row.clientId) await requirePlanClient(studioId, row.clientId);
  return decode(row);
}
export async function listMealPlans(studioId: string, search: string, page: number) {
  const t = schema.mealPlanTemplates;
  const where = and(
    visible(studioId),
    search ? ilike(t.name, `%${search.replace(/[\\%_]/gu, "\\$&")}%`) : undefined,
  );
  const [rows, count] = await Promise.all([
    db
      .select()
      .from(t)
      .where(where)
      .orderBy(desc(t.updatedAt), desc(t.id))
      .limit(25)
      .offset((page - 1) * 25),
    db.select({ total: sql<number>`count(*)::int` }).from(t).where(where),
  ]);
  return {
    items: rows.map((row) => {
      const p = decode(row);
      return {
        id: p.id,
        ...p.document.settings,
        status: p.status,
        hasChanges: p.hasChanges,
        updatedAt: p.updatedAt,
      };
    }),
    total: count[0]?.total ?? 0,
    page,
  };
}
type Recipe = Awaited<ReturnType<typeof getRecipe>>;
function snapshot(recipe: Recipe, id = newId()): PlanOption {
  return {
    id,
    recipeId: recipe.id,
    name: recipe.name,
    imageUrl: recipe.imageUrl,
    personal: Boolean(recipe.studioId),
    mealTypes: recipe.mealTypes,
    dietaryTags: recipe.dietaryTags,
    allergenTags: recipe.allergenTags,
    steps: recipe.steps,
    locked: false,
    ingredients: recipe.ingredients.map((l) => ({
      ingredientId: l.ingredientId,
      name: l.ingredient.name,
      quantity: l.quantity / recipe.servings,
      originalQuantity: l.quantity / recipe.servings,
      unit: l.unit,
      defaultUnit: l.ingredient.defaultUnit,
      gramsPerUnit: l.ingredient.gramsPerUnit,
      preparationNote: l.preparationNote,
      minimumUnitAmount: z.enum(["whole", "halves", "quarters", "all"]).parse(l.minimumUnitAmount),
      nutrients: {
        kcal: l.ingredient.kcal,
        proteinG: l.ingredient.proteinG,
        carbsG: l.ingredient.carbsG,
        fatG: l.ingredient.fatG,
        micronutrients: l.ingredient.micronutrients,
      },
    })),
  };
}
async function catalog(studioId: string, settings: PlanSettings) {
  const all: PlanOption[] = [];
  for (let page = 1; ; page++) {
    const result = await listRecipes(
      studioId,
      libraryQuery.parse({
        page,
        perPage: 100,
        ...(settings.recipeSourceSetting === "mine" ? { type: "Personal" } : {}),
      }),
    );
    all.push(...result.items.map((r) => snapshot(r)));
    if (page * 100 >= result.total) break;
  }
  return all.filter(
    (o) => !optionConflicts(o, settings).length && optionNutrition(o, true).kcal > 0,
  );
}
const mealTypes = new Set([
  "breakfast",
  "morning snack",
  "lunch",
  "afternoon snack",
  "dinner",
  "evening snack",
]);
function rank(option: PlanOption, settings: PlanSettings, percentage: number) {
  const n = optionNutrition(option, true),
    target = slotTargets(settings, percentage);
  const factor = settings.recipeMatching === "scale" ? target.kcal / Math.max(1, n.kcal) : 1;
  const difference = ["kcal", "proteinG", "carbsG", "fatG"].reduce((sum, key) => {
    const k = key as "kcal" | "proteinG" | "carbsG" | "fatG";
    return sum + Math.abs(n[k] * factor - target[k]) / Math.max(1, target[k]);
  }, 0);
  const favored = settings.dietaryPreferences.filter((t) =>
    option.dietaryTags.some((tag) => tag.toLowerCase() === t.toLowerCase()),
  ).length;
  return difference - favored * 0.35;
}
async function reconcile(
  studioId: string,
  input: PlanDocument,
  old: PlanDocument | null,
  rebalance: boolean,
): Promise<PlanDocument> {
  const known = new Map(old?.slots.flatMap((s) => s.options.map((o) => [o.id, o] as const)) ?? []);
  const candidates = rebalance ? await catalog(studioId, input.settings) : [];
  const slots = [];
  for (const slot of input.slots) {
    let options: PlanOption[] = [];
    for (const submitted of slot.options) {
      const previous = known.get(submitted.id);
      const base =
        previous?.recipeId === submitted.recipeId
          ? previous
          : snapshot(await getRecipe(studioId, submitted.recipeId), submitted.id);
      const ingredientLines: PlanIngredient[] = [];
      const addedAllergens: string[] = [];
      for (const incoming of submitted.ingredients) {
        let line = base.ingredients.find((l) => l.ingredientId === incoming.ingredientId);
        if (!line) {
          const ingredient = await getIngredient(studioId, incoming.ingredientId);
          addedAllergens.push(...ingredient.allergenTags);
          line = {
            ingredientId: ingredient.id,
            name: ingredient.name,
            quantity: incoming.quantity,
            originalQuantity: incoming.quantity,
            unit: incoming.unit,
            defaultUnit: ingredient.defaultUnit,
            gramsPerUnit: ingredient.gramsPerUnit,
            preparationNote: null,
            minimumUnitAmount: "all",
            nutrients: {
              kcal: ingredient.kcal,
              proteinG: ingredient.proteinG,
              carbsG: ingredient.carbsG,
              fatG: ingredient.fatG,
              micronutrients: z
                .record(z.string(), z.number())
                .parse(ingredient.micronutrients ?? {}),
            },
          };
        }
        if (incoming.unit !== "grams" && (incoming.unit !== line.defaultUnit || !line.gramsPerUnit))
          throw badRequest(
            "invalid_plan_unit",
            "Choose grams or the ingredient’s supported serving unit.",
          );
        const previousFactor = line.unit === "grams" ? 1 : line.gramsPerUnit;
        const factor = incoming.unit === "grams" ? 1 : line.gramsPerUnit;
        if (!previousFactor || !factor)
          throw badRequest("invalid_plan_unit", "This ingredient has no serving conversion.");
        ingredientLines.push({
          ...line,
          unit: incoming.unit,
          originalQuantity: (line.originalQuantity * previousFactor) / factor,
          quantity: incoming.quantity,
        });
      }
      if (!ingredientLines.length)
        throw badRequest("empty_plan_recipe", "Each recipe needs at least one ingredient.");
      options.push({
        ...base,
        locked: submitted.locked,
        steps: submitted.steps,
        ingredients: ingredientLines,
        allergenTags: [...new Set([...base.allergenTags, ...addedAllergens])],
      });
    }
    if (rebalance && slot.enabled) {
      options = options.filter((o) => o.locked || !optionConflicts(o, input.settings).length);
      const locked = options.filter((o) => o.locked),
        unlocked = options.filter((o) => !o.locked);
      const keep = new Set(
        unlocked
          .slice(0, Math.max(0, input.settings.recipesPerMeal - locked.length))
          .map((o) => o.id),
      );
      options = options.filter((o) => o.locked || keep.has(o.id));
      const eligible = candidates
        .filter(
          (o) =>
            !options.some((current) => current.recipeId === o.recipeId) &&
            (!mealTypes.has(slot.name.toLowerCase()) ||
              o.mealTypes.some((m) => m.toLowerCase() === slot.name.toLowerCase())),
        )
        .sort(
          (a, b) =>
            rank(a, input.settings, slot.percentage) - rank(b, input.settings, slot.percentage) ||
            a.recipeId.localeCompare(b.recipeId),
        );
      for (const candidate of eligible.slice(
        0,
        Math.max(0, input.settings.recipesPerMeal - options.length),
      ))
        options.push({ ...candidate, id: newId() });
      options = options.map((o) => scaleOption(o, input.settings, slot.percentage));
    }
    slots.push({ ...slot, options });
  }
  return { ...input, slots };
}
async function persist(
  studioId: string,
  membershipId: string,
  id: string,
  document: PlanDocument,
  expected?: string,
  create = false,
  clientId: string | null = null,
) {
  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(schema.mealPlanTemplates)
      .where(eq(schema.mealPlanTemplates.id, id))
      .for("update");
    if (existing) {
      if (
        existing.studioId !== studioId ||
        existing.archivedAt ||
        (create && existing.clientId !== clientId)
      )
        throw notFound("Meal plan not found.");
      if (create) return;
      if (!expected || existing.updatedAt.toISOString() !== expected)
        throw new AppError(
          409,
          "stale_meal_plan",
          "This meal plan changed in another tab. Reopen it before saving.",
        );
    } else if (!create) throw notFound("Meal plan not found.");
    const values = {
      ...document.settings,
      draftDocument: document,
      updatedAt: new Date(Math.max(Date.now(), (existing?.updatedAt.getTime() ?? 0) + 1)),
    };
    if (existing)
      await tx
        .update(schema.mealPlanTemplates)
        .set(values)
        .where(eq(schema.mealPlanTemplates.id, id));
    else {
      const inserted = await tx
        .insert(schema.mealPlanTemplates)
        .values({
          ...values,
          id,
          studioId,
          clientId,
          createdBy: membershipId,
          status: "draft",
          source: "coach",
        })
        .onConflictDoNothing()
        .returning({ id: schema.mealPlanTemplates.id });
      if (!inserted.length) return;
    }
    await tx.delete(schema.mealPlanSlots).where(eq(schema.mealPlanSlots.templateId, id));
    if (document.slots.length)
      await tx.insert(schema.mealPlanSlots).values(
        document.slots.map((slot, position) => ({
          id: slot.id,
          templateId: id,
          name: slot.name,
          position,
          percentage: slot.percentage,
          enabled: slot.enabled ? 1 : 0,
        })),
      );
    const lines = document.slots.flatMap((slot) =>
      slot.options.map((o, position) => ({
        id: o.id,
        slotId: slot.id,
        recipeId: o.recipeId,
        position,
        scaleFactor: Math.max(
          0.1,
          Math.min(10, optionNutrition(o).kcal / Math.max(1, optionNutrition(o, true).kcal)),
        ),
        ...optionNutrition(o),
      })),
    );
    if (lines.length) await tx.insert(schema.mealPlanRecipes).values(lines);
  });
  return getMealPlan(studioId, id);
}
export async function createMealPlan(
  studioId: string,
  membershipId: string,
  id: string,
  input: PlanDocument,
) {
  const [prior] = await db
    .select()
    .from(schema.mealPlanTemplates)
    .where(eq(schema.mealPlanTemplates.id, id));
  if (prior) {
    if (prior.studioId !== studioId || prior.clientId || prior.archivedAt)
      throw notFound("Meal plan not found.");
    return getMealPlan(studioId, id);
  }
  // Creation accepts configuration only; candidate snapshots are always server-authored.
  const document = await reconcile(
    studioId,
    { ...input, slots: input.slots.map((s) => ({ ...s, options: [] })) },
    null,
    true,
  );
  return persist(studioId, membershipId, id, document, undefined, true);
}
export async function updateMealPlan(
  studioId: string,
  membershipId: string,
  id: string,
  input: z.infer<typeof planWriteSchema>,
) {
  const old = await getMealPlan(studioId, id);
  if (old.updatedAt !== input.expectedUpdatedAt)
    throw new AppError(
      409,
      "stale_meal_plan",
      "This meal plan changed in another tab. Reopen it before saving.",
    );
  const document = await reconcile(studioId, input.document, old.document, input.rebalance);
  return persist(studioId, membershipId, id, document, input.expectedUpdatedAt);
}
export async function publishMealPlan(studioId: string, id: string, expected: string) {
  await db.transaction(async (tx) => {
    const [row] = await tx
      .select()
      .from(schema.mealPlanTemplates)
      .where(visible(studioId, id))
      .for("update");
    if (!row) throw notFound("Meal plan not found.");
    if (row.updatedAt.toISOString() !== expected)
      throw new AppError(
        409,
        "stale_meal_plan",
        "This meal plan changed. Reopen it before publishing.",
      );
    const { document } = decode(row);
    if (
      document.slots.some(
        (s) =>
          s.enabled &&
          (!s.options.length ||
            s.options.some((o) => optionConflicts(o, document.settings).length)),
      )
    )
      throw badRequest(
        "incomplete_meal_plan",
        "Every enabled meal needs a recipe, and allergen/source conflicts must be resolved before publishing.",
      );
    await tx
      .update(schema.mealPlanTemplates)
      .set({
        publishedDocument: document,
        status: "active",
        updatedAt: new Date(Math.max(Date.now(), row.updatedAt.getTime() + 1)),
      })
      .where(eq(schema.mealPlanTemplates.id, id));
  });
  return getMealPlan(studioId, id);
}
export async function discardMealPlan(
  studioId: string,
  membershipId: string,
  id: string,
  expected: string,
) {
  const old = await getMealPlan(studioId, id);
  if (!old.published)
    throw badRequest("no_published_plan", "This draft has no published version to restore.");
  return persist(studioId, membershipId, id, old.published, expected);
}
export async function duplicateMealPlan(
  studioId: string,
  membershipId: string,
  id: string,
  copyId: string,
) {
  const original = await getMealPlan(studioId, id);
  const document = {
    ...original.document,
    settings: {
      ...original.document.settings,
      name: `${original.document.settings.name.slice(0, 33)} (copy)`,
    },
    slots: original.document.slots.map((s) => ({
      ...s,
      id: newId(),
      options: s.options.map((o) => ({ ...o, id: newId() })),
    })),
  };
  return persist(studioId, membershipId, copyId, document, undefined, true, original.clientId);
}
export async function archiveMealPlan(studioId: string, id: string, expected: string) {
  const rows = await db
    .update(schema.mealPlanTemplates)
    .set({ archivedAt: new Date() })
    .where(and(visible(studioId, id), eq(schema.mealPlanTemplates.updatedAt, new Date(expected))))
    .returning({ id: schema.mealPlanTemplates.id });
  if (!rows.length)
    throw new AppError(
      409,
      "stale_meal_plan",
      "Meal plan changed or was archived. Refresh the list.",
    );
}
export async function mealPlanPresets(studioId: string) {
  return db
    .select()
    .from(schema.mealPlanPresets)
    .where(eq(schema.mealPlanPresets.studioId, studioId));
}
export async function saveMealPlanPreset(studioId: string, input: z.infer<typeof presetSchema>) {
  await db
    .insert(schema.mealPlanPresets)
    .values({ ...input, studioId })
    .onConflictDoUpdate({
      target: [schema.mealPlanPresets.studioId, schema.mealPlanPresets.name],
      set: { proteinPct: input.proteinPct, carbsPct: input.carbsPct, fatPct: input.fatPct },
    });
  return mealPlanPresets(studioId);
}
export async function mealPlanRecipeOption(studioId: string, recipeId: string) {
  return snapshot(await getRecipe(studioId, recipeId));
}

async function requirePlanClient(studioId: string, clientId: string) {
  const [client] = await db
    .select()
    .from(schema.clients)
    .where(
      and(
        eq(schema.clients.id, clientId),
        eq(schema.clients.studioId, studioId),
        isNull(schema.clients.deletedAt),
      ),
    );
  if (!client) throw notFound("Client not found.");
  return client;
}
export async function clientMealPlans(studioId: string, clientId: string) {
  await requirePlanClient(studioId, clientId);
  const rows = await db
    .select()
    .from(schema.mealPlanTemplates)
    .where(
      and(
        eq(schema.mealPlanTemplates.studioId, studioId),
        eq(schema.mealPlanTemplates.clientId, clientId),
        isNull(schema.mealPlanTemplates.archivedAt),
      ),
    )
    .orderBy(desc(schema.mealPlanTemplates.updatedAt));
  return rows.map(decode);
}
export async function liveMealPlanTemplates(studioId: string, search: string, page: number) {
  const t = schema.mealPlanTemplates;
  const where = and(
    visible(studioId),
    eq(t.status, "active"),
    search ? ilike(t.name, `%${search.replace(/[\\%_]/gu, "\\$&")}%`) : undefined,
  );
  const [rows, count] = await Promise.all([
    db
      .select()
      .from(t)
      .where(where)
      .orderBy(desc(t.updatedAt), desc(t.id))
      .limit(25)
      .offset((page - 1) * 25),
    db.select({ total: sql<number>`count(*)::int` }).from(t).where(where),
  ]);
  return {
    items: rows
      .filter((r) => r.publishedDocument)
      .map((r) => ({ id: r.id, ...planDocumentSchema.parse(r.publishedDocument).settings })),
    total: count[0]?.total ?? 0,
    page,
  };
}
export const clientPlanCreateSchema = z
  .object({
    id: z.string().uuid(),
    document: planDocumentSchema.optional(),
    templateId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(40).optional(),
    targets: z
      .object({
        calorieTarget: z.number().int().min(100).max(20000),
        proteinPct: pct,
        carbsPct: pct,
        fatPct: pct,
      })
      .optional(),
  })
  .refine(
    (v) => Boolean(v.document) !== Boolean(v.templateId),
    "Choose a template or create a new plan.",
  );
export async function createClientMealPlan(
  studioId: string,
  clientId: string,
  membershipId: string,
  input: z.infer<typeof clientPlanCreateSchema>,
) {
  await requirePlanClient(studioId, clientId);
  const [prior] = await db
    .select()
    .from(schema.mealPlanTemplates)
    .where(eq(schema.mealPlanTemplates.id, input.id));
  if (prior) {
    if (prior.studioId !== studioId || prior.clientId !== clientId || prior.archivedAt)
      throw notFound("Meal plan not found.");
    return getMealPlan(studioId, input.id);
  }
  let document: PlanDocument;
  if (input.templateId) {
    const source = await getMealPlan(studioId, input.templateId);
    if (source.clientId || !source.published || source.status !== "active")
      throw badRequest("unpublished_template", "Choose a published studio template.");
    document = planDocumentSchema.parse({
      ...source.published,
      settings: {
        ...source.published.settings,
        ...input.targets,
        name: input.name ?? source.published.settings.name,
      },
      slots: source.published.slots.map((slot) => ({
        ...slot,
        id: newId(),
        options: slot.options.map((option) => ({ ...option, id: newId() })),
      })),
    });
    if (input.targets)
      document = {
        ...document,
        slots: document.slots.map((slot) => ({
          ...slot,
          options: slot.options.map((option) =>
            scaleOption(option, document.settings, slot.percentage),
          ),
        })),
      };
  } else {
    if (!input.document) throw badRequest("missing_configuration", "Configure the meal plan.");
    document = await reconcile(
      studioId,
      { ...input.document, slots: input.document.slots.map((slot) => ({ ...slot, options: [] })) },
      null,
      true,
    );
  }
  return persist(studioId, membershipId, input.id, document, undefined, true, clientId);
}
