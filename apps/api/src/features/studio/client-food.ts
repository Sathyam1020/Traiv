import { photoMessage } from "../messaging/service.js";
import { schema } from "@traiv/db";
import { and, desc, eq, isNull } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../../db.js";
import { notFound } from "../../errors.js";
import { requireStudio, requireStudioAuth } from "../../middleware/authorize.js";
import { permissions, daySchema, diary } from "../client/food.js";
export const clientFoodRouter: Router = Router({ mergeParams: true });
async function scope(studioId: string, clientId: string) {
  const [row] = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(
      and(
        eq(schema.clients.id, clientId),
        eq(schema.clients.studioId, studioId),
        isNull(schema.clients.deletedAt),
      ),
    );
  if (!row) throw notFound();
  return clientId;
}
clientFoodRouter.get("/", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = await scope(studioId, z.string().uuid().parse(req.params.clientId));
  const [settings, photos, reports] = await Promise.all([
    permissions(clientId),
    db
      .select()
      .from(schema.foodPhotoMessages)
      .where(eq(schema.foodPhotoMessages.clientId, clientId))
      .orderBy(desc(schema.foodPhotoMessages.createdAt))
      .limit(100),
    db
      .select({
        id: schema.foodReports.id,
        note: schema.foodReports.note,
        ingredientId: schema.foodReports.ingredientId,
        name: schema.ingredients.name,
        createdAt: schema.foodReports.createdAt,
      })
      .from(schema.foodReports)
      .innerJoin(schema.ingredients, eq(schema.ingredients.id, schema.foodReports.ingredientId))
      .where(eq(schema.foodReports.clientId, clientId))
      .orderBy(desc(schema.foodReports.createdAt))
      .limit(50),
  ]);
  res.json({ permissions: settings, photos, reports });
});
clientFoodRouter.put("/permissions", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = await scope(studioId, z.string().uuid().parse(req.params.clientId));
  const v = z
    .object({
      search: z.boolean(),
      barcode: z.boolean(),
      photoLog: z.boolean(),
      calculator: z.boolean(),
      personalPlans: z.boolean(),
    })
    .parse(req.body);
  const values = {
    search: v.search ? 1 : 0,
    barcode: v.barcode ? 1 : 0,
    photoLog: v.photoLog ? 1 : 0,
    calculator: v.calculator ? 1 : 0,
    personalPlans: v.personalPlans ? 1 : 0,
  };
  await db
    .insert(schema.nutritionPermissions)
    .values({ clientId, ...values })
    .onConflictDoUpdate({ target: schema.nutritionPermissions.clientId, set: values });
  res.json(v);
});
clientFoodRouter.post("/photos", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = await scope(studioId, z.string().uuid().parse(req.params.clientId));
  const v = z
    .object({ id: z.string().uuid(), note: z.string().trim().min(1).max(2000) })
    .parse(req.body);
  await db.transaction((tx) => photoMessage(tx, { ...v, clientId, author: "coach" }));
  res.status(201).json({ saved: true });
});
clientFoodRouter.get("/days/:date", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = await scope(studioId, z.string().uuid().parse(req.params.clientId));
  res.json(await diary(clientId, daySchema.parse(req.params.date)));
});

// One diary read supplies all seven days and their per-day targets.
clientFoodRouter.get("/week", requireStudio({ param: "id" }), async (req, res) => {
  const { studioId } = requireStudioAuth(req);
  const clientId = await scope(studioId, z.string().uuid().parse(req.params.clientId));
  const from = daySchema.parse(req.query.from);
  const center = new Date(`${from}T12:00:00Z`);
  center.setUTCDate(center.getUTCDate() + 3);
  const result = await diary(clientId, center.toISOString().slice(0, 10), true);
  res.json({ days: result.days });
});
