import { personalPlanInput, savePersonalPlan } from "./personal-food-plans.js";
import { newId, schema } from "@traiv/db";
import { energyTarget } from "@traiv/nutrition";
import { and, asc, desc, eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { badRequest } from "../../errors.js";
import { requireClient, requireClientAuth } from "../../middleware/client-authorize.js";
import {
  allow,
  catalog,
  clientRecipeInput,
  copyEntries,
  daySchema,
  diary,
  entryPatch,
  log,
  logSchema,
  nutritionSchema,
  resolveItem,
  saveFood,
  saveRecipe,
  slotSchema,
} from "./food.js";
import {
  addRecipeShopping,
  barcode,
  ownedImage,
  shopping,
  shoppingInput,
  reserveLabelScan,
} from "./food-tools.js";

export const foodRouter = Router({ mergeParams: true });
const idParam = z.object({ id: z.string().min(1).max(150) });
foodRouter.get("/days/:date", requireClient(), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  res.json(await diary(clientId, daySchema.parse(req.params.date)));
});
foodRouter.get("/search", requireClient(), async (req, res) => {
  const a = requireClientAuth(req);
  const q = z
    .object({
      q: z.string().trim().max(120).default(""),
      mode: z.enum(["all", "recent", "favorites", "recipes", "mine"]).default("all"),
    })
    .parse(req.query);
  res.json(await catalog(a.clientId, a.studioId, q.q, q.mode));
});
foodRouter.get("/items/:kind/:id", requireClient(), async (req, res) => {
  const a = requireClientAuth(req);
  const { kind, id } = z
    .object({ kind: z.enum(["food", "recipe", "plan", "personal"]), id: z.string().max(64) })
    .parse(req.params);
  const { planId } = z.object({ planId: z.string().max(64).optional() }).parse(req.query);
  res.json(await resolveItem(a.clientId, a.studioId, kind, id, planId));
});
foodRouter.post("/entries", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await log(a.clientId, a.studioId, logSchema.parse(req.body));
  res.status(201).json({ saved: true });
});
foodRouter.patch("/entries/:id", requireClient({ write: true }), async (req, res) => {
  const { updateEntry } = await import("./food.js");
  await updateEntry(
    requireClientAuth(req).clientId,
    idParam.parse(req.params).id,
    entryPatch.parse(req.body),
  );
  res.json({ saved: true });
});
foodRouter.delete("/entries/:id", requireClient({ write: true }), async (req, res) => {
  await db
    .delete(schema.foodLogEntries)
    .where(
      and(
        eq(schema.foodLogEntries.clientId, requireClientAuth(req).clientId),
        eq(schema.foodLogEntries.id, idParam.parse(req.params).id),
      ),
    );
  res.status(204).end();
});
foodRouter.post("/copy", requireClient({ write: true }), async (req, res) => {
  const v = z
    .object({
      ids: z.array(z.string().max(150)).min(1).max(100),
      date: daySchema,
      slot: z.union([slotSchema, z.literal("original")]),
      operationId: z.string().uuid(),
    })
    .parse(req.body);
  await copyEntries(requireClientAuth(req).clientId, v.ids, v.date, v.slot, v.operationId);
  res.json({ saved: true });
});
foodRouter.get("/favorites", requireClient(), async (req, res) => {
  res.json(
    await db
      .select()
      .from(schema.foodFavorites)
      .where(eq(schema.foodFavorites.clientId, requireClientAuth(req).clientId)),
  );
});
foodRouter.put("/favorites", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req),
    v = z
      .object({ kind: z.enum(["food", "recipe"]), id: z.string().max(64), favorite: z.boolean() })
      .parse(req.body);
  await resolveItem(a.clientId, a.studioId, v.kind, v.id);
  if (v.favorite)
    await db
      .insert(schema.foodFavorites)
      .values({ id: newId(), clientId: a.clientId, kind: v.kind, resourceId: v.id })
      .onConflictDoNothing();
  else
    await db
      .delete(schema.foodFavorites)
      .where(
        and(
          eq(schema.foodFavorites.clientId, a.clientId),
          eq(schema.foodFavorites.kind, v.kind),
          eq(schema.foodFavorites.resourceId, v.id),
        ),
      );
  res.json({ saved: true });
});
foodRouter.post("/foods", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await allow(
    a.clientId,
    z.object({ barcode: z.string().optional() }).parse(req.body).barcode ? "barcode" : "search",
  );
  res.status(201).json(await saveFood(a.clientId, a.studioId, req.body));
});
foodRouter.put("/foods/:id", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await allow(a.clientId, "search");
  res.json(await saveFood(a.clientId, a.studioId, req.body, idParam.parse(req.params).id));
});
foodRouter.delete("/foods/:id", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await allow(a.clientId, "search");
  await db
    .update(schema.ingredients)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(schema.ingredients.id, idParam.parse(req.params).id),
        eq(schema.ingredients.clientId, a.clientId),
      ),
    );
  res.status(204).end();
});
foodRouter.post("/recipes", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await allow(a.clientId, "search");
  res.status(201).json(await saveRecipe(a.clientId, a.studioId, clientRecipeInput.parse(req.body)));
});
foodRouter.put("/recipes/:id", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await allow(a.clientId, "search");
  const v = clientRecipeInput.parse(req.body);
  if (v.id !== idParam.parse(req.params).id)
    throw badRequest("wrong_id", "Recipe identifiers don't match.");
  res.json(await saveRecipe(a.clientId, a.studioId, v, true));
});
foodRouter.delete("/recipes/:id", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req);
  await allow(a.clientId, "search");
  await db
    .update(schema.recipes)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(schema.recipes.id, idParam.parse(req.params).id),
        eq(schema.recipes.clientId, a.clientId),
      ),
    );
  res.status(204).end();
});
foodRouter.get("/barcode/:id", requireClient(), async (req, res) => {
  const a = requireClientAuth(req);
  const code = z
    .string()
    .regex(/^\d{8,14}$/)
    .parse(req.params.id);
  res.json(await barcode(a.clientId, a.studioId, code));
});
foodRouter.post("/reports", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req),
    v = z
      .object({
        id: z.string().uuid(),
        ingredientId: z.string().max(64),
        note: z.string().trim().min(1).max(2000),
      })
      .parse(req.body);
  await resolveItem(a.clientId, a.studioId, "food", v.ingredientId);
  await db
    .insert(schema.foodReports)
    .values({ ...v, clientId: a.clientId })
    .onConflictDoNothing();
  res.status(201).json({ saved: true });
});
foodRouter.get("/photos", requireClient(), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "photoLog");
  res.json(
    await db
      .select()
      .from(schema.foodPhotoMessages)
      .where(eq(schema.foodPhotoMessages.clientId, clientId))
      .orderBy(desc(schema.foodPhotoMessages.createdAt))
      .limit(100),
  );
});
foodRouter.post("/photos", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "photoLog");
  const v = z
    .object({
      id: z.string().uuid(),
      imageUrl: z.string().url(),
      note: z.string().max(2000).nullable(),
    })
    .parse(req.body);
  ownedImage(clientId, v.imageUrl);
  await db
    .insert(schema.foodPhotoMessages)
    .values({ ...v, clientId, author: "client" })
    .onConflictDoNothing();
  res.status(201).json({ saved: true });
});
foodRouter.get("/shopping", requireClient(), async (req, res) =>
  res.json(await shopping(requireClientAuth(req).clientId)),
);
foodRouter.put("/shopping", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req),
    v = shoppingInput.parse(req.body);
  const values = { ...v, clientId, checked: v.checked ? 1 : 0 };
  await db
    .insert(schema.foodShoppingItems)
    .values(values)
    .onConflictDoUpdate({
      target: schema.foodShoppingItems.id,
      set: {
        name: v.name,
        amount: v.amount,
        unit: v.unit,
        category: v.category,
        note: v.note,
        checked: values.checked,
        ...(v.unit !== "grams" ? { ingredientId: null, contributions: [] } : {}),
      },
      setWhere: eq(schema.foodShoppingItems.clientId, clientId),
    });
  res.json({ saved: true });
});
foodRouter.delete("/shopping/:id", requireClient({ write: true }), async (req, res) => {
  await db
    .delete(schema.foodShoppingItems)
    .where(
      and(
        eq(schema.foodShoppingItems.clientId, requireClientAuth(req).clientId),
        eq(schema.foodShoppingItems.id, idParam.parse(req.params).id),
      ),
    );
  res.status(204).end();
});
foodRouter.post("/shopping/recipe", requireClient({ write: true }), async (req, res) => {
  const a = requireClientAuth(req),
    v = z
      .object({
        kind: z.enum(["recipe", "plan", "personal"]),
        id: z.string().max(64),
        planId: z.string().max(64).optional(),
        servings: z.number().positive().max(50),
        operationId: z.string().uuid(),
      })
      .parse(req.body);
  await addRecipeShopping(
    a.clientId,
    a.studioId,
    v.kind,
    v.id,
    v.servings,
    v.operationId,
    v.planId,
  );
  res.json({ saved: true });
});
const goalDay = z.union([daySchema, z.literal("default"), z.string().regex(/^weekday:[0-6]$/)]);
foodRouter.get("/goals", requireClient(), async (req, res) =>
  res.json(
    await db
      .select()
      .from(schema.foodGoals)
      .where(eq(schema.foodGoals.clientId, requireClientAuth(req).clientId)),
  ),
);
foodRouter.put("/goals", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "calculator");
  const v = nutritionSchema.extend({ day: goalDay }).parse(req.body);
  await db
    .insert(schema.foodGoals)
    .values({ ...v, id: newId(), clientId })
    .onConflictDoUpdate({ target: [schema.foodGoals.clientId, schema.foodGoals.day], set: v });
  res.json({ saved: true });
});
foodRouter.delete("/goals/:id", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "calculator");
  await db
    .delete(schema.foodGoals)
    .where(
      and(
        eq(schema.foodGoals.clientId, clientId),
        eq(schema.foodGoals.id, idParam.parse(req.params).id),
      ),
    );
  res.status(204).end();
});
foodRouter.post("/calculate", requireClient(), async (req, res) => {
  await allow(requireClientAuth(req).clientId, "calculator");
  const v = z
    .object({
      sex: z.enum(["male", "female", "undisclosed"]),
      age: z.number().int().min(10).max(100),
      heightCm: z.number().min(100).max(250),
      weightKg: z.number().min(25).max(400),
      goal: z.enum([
        "lose_fat",
        "build_muscle",
        "get_stronger",
        "maintain",
        "improve_fitness",
        "general_health",
      ]),
      activity: z.enum(["sedentary", "light", "moderate", "very", "extra"]),
      diet: z.enum(["vegetarian", "non_vegetarian", "eggetarian", "vegan", "jain"]),
      health: z.array(
        z.enum([
          "knee",
          "lower_back",
          "shoulder",
          "diabetes",
          "blood_pressure",
          "thyroid",
          "pcos",
          "pregnancy",
        ]),
      ),
    })
    .parse(req.body);
  const [intake] = await db
    .select({
      healthFlags: schema.userIntakes.healthFlags,
      targetWeightKg: schema.userIntakes.targetWeightKg,
    })
    .from(schema.userIntakes)
    .innerJoin(schema.clients, eq(schema.clients.userId, schema.userIntakes.userId))
    .where(eq(schema.clients.id, requireClientAuth(req).clientId))
    .limit(1);
  const healthSchema = z.enum([
    "knee",
    "lower_back",
    "shoulder",
    "diabetes",
    "blood_pressure",
    "thyroid",
    "pcos",
    "pregnancy",
  ]);
  const storedFlags = (intake?.healthFlags ?? []).flatMap((flag) => {
    const parsed = healthSchema.safeParse(flag);
    return parsed.success ? [parsed.data] : [];
  });
  const result = energyTarget({
    ...v,
    health: [...new Set([...v.health, ...storedFlags])],
    targetWeightKg: intake?.targetWeightKg ?? undefined,
  });
  res.json(result.review.length ? { review: result.review, basis: result.basis } : { ...result });
});
foodRouter.get("/personal-plans", requireClient(), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "personalPlans");
  res.json(
    await db
      .select()
      .from(schema.foodPersonalPlans)
      .where(eq(schema.foodPersonalPlans.clientId, clientId))
      .orderBy(asc(schema.foodPersonalPlans.createdAt)),
  );
});
foodRouter.put("/personal-plans", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "personalPlans");
  const v = personalPlanInput.parse(req.body);
  await savePersonalPlan(clientId, requireClientAuth(req).studioId, v);
  res.json({ saved: true });
});
foodRouter.delete("/personal-plans/:id", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "personalPlans");
  await db
    .delete(schema.foodPersonalPlans)
    .where(
      and(
        eq(schema.foodPersonalPlans.id, idParam.parse(req.params).id),
        eq(schema.foodPersonalPlans.clientId, clientId),
      ),
    );
  res.status(204).end();
});
foodRouter.post("/label-scan", requireClient({ write: true }), async (req, res) => {
  const { clientId } = requireClientAuth(req);
  await allow(clientId, "barcode");
  const { imageUrl } = z.object({ imageUrl: z.string().url().max(2000) }).parse(req.body);
  ownedImage(clientId, imageUrl, "food-label");
  const { scanFoodLabel } = await import("../../integrations/food-label.js");
  await reserveLabelScan(clientId);
  res.json(await scanFoodLabel(imageUrl));
});
