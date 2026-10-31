import { newId, schema } from "@traiv/db";
import { and, asc, eq, isNull, sql, gte, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db.js";
import { AppError, badRequest, notFound, tooManyRequests } from "../../errors.js";
import { env } from "../../env.js";
import { allow, resolveItem, operationResourceId } from "./food.js";

export function ownedImage(clientId: string, url: string, kind = "photo-log") {
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== "res.cloudinary.com" ||
    !parsed.pathname.startsWith(`/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`) ||
    !parsed.pathname.includes(`/traiv/${kind}/${clientId}/`)
  )
    throw badRequest("invalid_image", "Upload your image again before saving.");
  return url;
}
export async function barcode(clientId: string, studioId: string, code: string) {
  await allow(clientId, "barcode");
  const [cached] = await db
    .select()
    .from(schema.ingredients)
    .where(
      and(
        eq(schema.ingredients.barcode, code),
        or(
          eq(schema.ingredients.clientId, clientId),
          and(
            isNull(schema.ingredients.clientId),
            or(isNull(schema.ingredients.studioId), eq(schema.ingredients.studioId, studioId)),
          ),
        ),
        isNull(schema.ingredients.deletedAt),
      ),
    )
    .orderBy(sql`case when ${schema.ingredients.clientId} = ${clientId} then 0 else 1 end`)
    .limit(1);
  if (cached) return resolveItem(clientId, studioId, "food", cached.id);
  let response: Response;
  try {
    response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,nutriments,image_front_url,nutrition_data_per,product_quantity_unit,serving_quantity`,
      {
        headers: { "User-Agent": "Traiv/1.0 (nutrition barcode lookup)" },
        signal: AbortSignal.timeout(10000),
      },
    );
  } catch {
    throw new AppError(
      502,
      "barcode_unavailable",
      "Couldn't reach the food database. Try again or enter the food manually.",
    );
  }
  if (!response.ok)
    throw new AppError(
      502,
      "barcode_unavailable",
      "The food database is unavailable. Try again shortly.",
    );
  const parsed = z
    .object({
      status: z.number(),
      product: z
        .object({
          product_name: z.string().optional(),
          nutrition_data_per: z.string().optional(),
          product_quantity_unit: z.string().optional(),
          serving_quantity: z.coerce.number().positive().max(100000).optional().catch(undefined),
          image_front_url: z.string().optional(),
          nutriments: z.record(z.string(), z.unknown()).optional(),
        })
        .optional(),
    })
    .parse(await response.json());
  const p = parsed.product,
    n = p?.nutriments;
  if (parsed.status !== 1 || !p?.product_name || !n)
    throw notFound("Barcode not found. Create this food from its label.");
  const value = (key: string) =>
    z
      .preprocess(
        (v) => (typeof v === "string" && v.trim() ? Number(v) : v),
        z.number().finite().nonnegative(),
      )
      .safeParse(n[key]);
  const kcal = value("energy-kcal_100g"),
    protein = value("proteins_100g"),
    carbs = value("carbohydrates_100g"),
    fat = value("fat_100g");
  if (!kcal.success || !protein.success || !carbs.success || !fat.success)
    throw notFound("This product has incomplete nutrition. Enter the label manually.");
  const id = newId();
  await db
    .insert(schema.ingredients)
    .values({
      id,
      name: p.product_name,
      dataSource: "openfoodfacts",
      baseUnit:
        p.nutrition_data_per === "100ml" || p.product_quantity_unit === "ml" ? "ml" : "grams",
      barcode: code,
      defaultUnit:
        p.product_quantity_unit !== "ml" && p.nutrition_data_per !== "100ml" && p.serving_quantity
          ? "serving"
          : null,
      gramsPerUnit:
        p.product_quantity_unit !== "ml" && p.nutrition_data_per !== "100ml"
          ? (p.serving_quantity ?? null)
          : null,
      kcal: Math.round(kcal.data),
      proteinG: protein.data,
      carbsG: carbs.data,
      fatG: fat.data,
      imageUrl: p.image_front_url ?? null,
      micronutrients: Object.fromEntries(
        [
          ["Fiber (g)", "fiber_100g", 1],
          ["Sugar (g)", "sugars_100g", 1],
          ["Sodium (mg)", "sodium_100g", 1000],
          ["Saturated fat (g)", "saturated-fat_100g", 1],
        ].flatMap(([label, key, factor]) => {
          const v = value(String(key));
          return v.success ? [[String(label), v.data * Number(factor)]] : [];
        }),
      ),
    })
    .onConflictDoNothing();
  const [saved] = await db
    .select()
    .from(schema.ingredients)
    .where(
      and(
        eq(schema.ingredients.barcode, code),
        isNull(schema.ingredients.clientId),
        isNull(schema.ingredients.studioId),
      ),
    );
  if (!saved) throw notFound();
  return resolveItem(clientId, studioId, "food", saved.id);
}
export const shoppingInput = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  amount: z.number().positive().max(100000),
  unit: z.string().min(1).max(40),
  category: z.string().max(80).default("Other"),
  note: z.string().max(1000).nullable().default(null),
  checked: z.boolean().default(false),
});
export async function shopping(clientId: string) {
  return db
    .select()
    .from(schema.foodShoppingItems)
    .where(eq(schema.foodShoppingItems.clientId, clientId))
    .orderBy(asc(schema.foodShoppingItems.category), asc(schema.foodShoppingItems.name));
}
export async function addRecipeShopping(
  clientId: string,
  studioId: string,
  kind: string,
  id: string,
  servings: number,
  operationId: string,
  planId?: string,
) {
  const item = await resolveItem(clientId, studioId, kind, id, planId);
  if (!item.ingredients.length)
    throw badRequest("no_ingredients", "This recipe has no ingredients.");
  await db.transaction(async (tx) => {
    const fresh = await tx
      .insert(schema.foodOperations)
      .values({
        id: operationResourceId(clientId, operationId, "shopping"),
        clientId,
        kind: "shopping",
      })
      .onConflictDoNothing()
      .returning({ id: schema.foodOperations.id });
    if (!fresh.length) return;
    const ingredients = await tx
      .select({ id: schema.ingredients.id, category: schema.ingredients.category })
      .from(schema.ingredients)
      .where(
        inArray(
          schema.ingredients.id,
          item.ingredients.map((i) => i.id),
        ),
      );
    for (const [index, line] of item.ingredients.entries()) {
      const amount = line.grams * servings,
        contributions = [{ name: item.name, amount }];
      await tx
        .insert(schema.foodShoppingItems)
        .values({
          id: operationResourceId(clientId, operationId, String(index)),
          clientId,
          ingredientId: line.id,
          name: line.name,
          amount,
          unit: "grams",
          category: ingredients.find((i) => i.id === line.id)?.category ?? "Other",
          contributions,
        })
        .onConflictDoUpdate({
          target: [schema.foodShoppingItems.clientId, schema.foodShoppingItems.ingredientId],
          targetWhere: sql`${schema.foodShoppingItems.ingredientId} is not null`,
          set: {
            amount: sql`${schema.foodShoppingItems.amount} + ${amount}`,
            checked: 0,
            contributions: sql`${schema.foodShoppingItems.contributions} || ${JSON.stringify(contributions)}::jsonb`,
          },
        });
    }
  });
}
export async function reserveLabelScan(clientId: string) {
  await db.transaction(async (tx) => {
    await tx
      .select({ id: schema.clients.id })
      .from(schema.clients)
      .where(eq(schema.clients.id, clientId))
      .for("update");
    const [row] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.foodOperations)
      .where(
        and(
          eq(schema.foodOperations.clientId, clientId),
          eq(schema.foodOperations.kind, "label"),
          gte(schema.foodOperations.createdAt, new Date(Date.now() - 3600000)),
        ),
      );
    if ((row?.count ?? 0) >= 12)
      throw tooManyRequests(
        "You've scanned several labels. Try again in an hour, or enter the food manually.",
      );
    await tx.insert(schema.foodOperations).values({ id: newId(), clientId, kind: "label" });
  });
}
