import { newId, schema } from "@traiv/db";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetPhones } from "../../test-support/reset.js";
import { toE164 } from "../auth/service.js";
import { listStudios } from "./service.js";

const PHONES = ["8600000001", "8600000002"];
let api: TestServer;
const systemIds: string[] = [];
const systemIngredientIds: string[] = [];
beforeAll(async () => {
  api = await startApi();
});
beforeEach(async () => {
  await resetPhones(PHONES.map(toE164));
});
afterAll(async () => {
  await api.close();
  await resetPhones(PHONES.map(toE164));
  for (const id of systemIds) await db.delete(schema.recipes).where(eq(schema.recipes.id, id));
  for (const id of systemIngredientIds)
    await db.delete(schema.ingredients).where(eq(schema.ingredients.id, id));
});
async function setup() {
  const a = await signUpOverHttp(api.url, PHONES[0] ?? "", "Nutrition Coach");
  const b = await signUpOverHttp(api.url, PHONES[1] ?? "", "Other Coach");
  const [sa] = await listStudios(a.userId);
  const [sb] = await listStudios(b.userId);
  if (!sa || !sb) throw new Error("Missing studio");
  return {
    a: a.agent,
    b: b.agent,
    userId: a.userId,
    root: `/studios/${sa.id}`,
    otherRoot: `/studios/${sb.id}`,
    studioId: sa.id,
  };
}
const ingredient = (name = "Test oats") => ({
  id: newId(),
  name,
  kcal: 400,
  proteinG: 20,
  carbsG: 60,
  fatG: 8,
  micronutrients: { fiberG: 10 },
  defaultUnit: "cup",
  gramsPerUnit: 50,
  category: "Cereal",
  country: "India",
  dietaryTags: ["Vegan"],
  allergenTags: [],
});
const recipe = (ingredientId: string) => ({
  id: newId(),
  name: "Test chilla",
  servings: 2,
  mealTypes: ["Breakfast"],
  ingredients: [{ ingredientId, quantity: 2, unit: "cup" }],
  steps: ["Mix.", "Cook."],
});
type RecipeReply = {
  id: string;
  updatedAt: string;
  name: string;
  servings: number;
  ingredients: { ingredientId: string; quantity: number; unit: string }[];
  steps: string[];
  mealTypes: string[];
  nutrition: {
    kcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    micronutrients: { fiberG: number };
  };
};
describe("Ingredients and recipes across actors and retries", () => {
  it("saves edited System data as private versions and preserves preparation settings on reopen and duplicate", async () => {
    const { a, b, root, otherRoot } = await setup();
    const sourceIngredient = ingredient("Editable source oats");
    systemIngredientIds.push(sourceIngredient.id);
    await db.insert(schema.ingredients).values({ ...sourceIngredient, dataSource: "test" });
    const personalIngredient = {
      ...sourceIngredient,
      id: newId(),
      nutrientType: "protein",
      proteinG: 22,
    };
    expect((await a.post(`${root}/ingredients`, personalIngredient)).status).toBe(201);
    expect((await a.get(`${root}/ingredients/${personalIngredient.id}`)).body.nutrientType).toBe(
      "protein",
    );
    expect((await b.get(`${otherRoot}/ingredients/${sourceIngredient.id}`)).body.proteinG).toBe(20);
    expect((await b.get(`${otherRoot}/ingredients/${personalIngredient.id}`)).status).toBe(404);
    const sourceId = newId();
    systemIds.push(sourceId);
    await db.insert(schema.recipes).values({
      id: sourceId,
      source: "system",
      name: "Editable source bowl",
      mealTypes: ["Breakfast"],
      servings: 1,
    });
    const copyId = newId();
    const edited = {
      ...recipe(sourceIngredient.id),
      id: copyId,
      name: "Editable source bowl",
      ingredients: [
        {
          ingredientId: sourceIngredient.id,
          quantity: 2,
          unit: "cup",
          preparationNote: "Soak overnight",
          minimumUnitAmount: "quarters",
        },
      ],
    };
    expect((await a.post(`${root}/recipes`, edited)).status).toBe(201);
    expect((await a.post(`${root}/recipes`, edited)).body.id).toBe(copyId);
    const reopened = await a.get(`${root}/recipes/${copyId}`);
    expect(reopened.body.ingredients).toMatchObject([
      { preparationNote: "Soak overnight", minimumUnitAmount: "quarters" },
    ]);
    const duplicate = await a.post(`${root}/recipes/${copyId}/duplicate`, { id: newId() });
    expect(duplicate.status).toBe(201);
    expect(duplicate.body.ingredients).toMatchObject([
      { preparationNote: "Soak overnight", minimumUnitAmount: "quarters" },
    ]);
    expect((await b.get(`${otherRoot}/recipes/${copyId}`)).status).toBe(404);
    expect((await b.get(`${otherRoot}/recipes/${sourceId}`)).body.ingredients).toEqual([]);
    expect(
      (
        await a.patch(`${root}/recipes/${copyId}`, {
          ...edited,
          expectedUpdatedAt: reopened.body.updatedAt,
          ingredients: [{ ...edited.ingredients[0], minimumUnitAmount: "invalid" }],
        })
      ).status,
    ).toBe(400);
  });
  it("ranks direct ingredient matches before incidental mentions across pages and studios", async () => {
    const { a, b, root, otherRoot } = await setup();
    for (const name of [
      "Amaranth without salt",
      "Applesauce with salt",
      "Salted butter",
      "Salt, table",
      "Salt",
    ])
      await a.post(`${root}/ingredients`, ingredient(name));
    await b.post(`${otherRoot}/ingredients`, ingredient("Salt, private"));
    const search = `${root}/ingredients?search=%20SALT%20&type=Personal&perPage=2`;
    const first = await a.get(search);
    expect(first.status).toBe(200);
    expect(first.body.total).toBe(5);
    expect(first.body.items).toMatchObject([{ name: "Salt" }, { name: "Salt, table" }]);
    expect((await a.get(search)).body.items).toMatchObject([
      { name: "Salt" },
      { name: "Salt, table" },
    ]);
    expect((await a.get(`${search}&page=2`)).body.items).toMatchObject([
      { name: "Applesauce with salt" },
      { name: "Amaranth without salt" },
    ]);
    expect((await b.get(`${otherRoot}/ingredients?search=salt&type=Personal`)).body.total).toBe(1);
    await a.post(`${root}/ingredients`, ingredient("Salt (fine)"));
    expect((await a.get(`${root}/ingredients?search=Salt%20(fine)&type=Personal`)).body.total).toBe(
      1,
    );
    expect((await a.get(`${root}/ingredients?search=salt%25&type=Personal`)).body.total).toBe(0);
  });
  it("retries creation without duplicates, filters and paginates private ingredients", async () => {
    const { a, b, root, otherRoot } = await setup();
    const input = ingredient();
    expect((await a.post(`${root}/ingredients`, input)).status).toBe(201);
    expect((await a.post(`${root}/ingredients`, input)).body.id).toBe(input.id);
    await a.post(`${root}/ingredients`, ingredient("Test rice"));
    const filtered = await a.get(
      `${root}/ingredients?search=Test&type=Personal&tags=Vegan&country=India&category=Cereal&perPage=1&page=2`,
    );
    expect(filtered.status).toBe(200);
    expect(filtered.body.total).toBe(2);
    expect(filtered.body.items).toHaveLength(1);
    expect((await b.get(`${otherRoot}/ingredients/${input.id}`)).status).toBe(404);
    expect(
      (await b.patch(`${otherRoot}/ingredients/${input.id}`, { ...input, name: "Stolen" })).status,
    ).toBe(404);
    expect((await b.get(`${otherRoot}/ingredients?type=Personal&search=Test`)).body.total).toBe(0);
  });
  it("computes serving nutrition and micronutrients from weighed ingredients, survives reopen and repeated edits", async () => {
    const { a, root } = await setup();
    const i = ingredient();
    await a.post(`${root}/ingredients`, i);
    const input = recipe(i.id);
    const created = await a.post(`${root}/recipes`, input);
    expect(created.status).toBe(201);
    const r = created.body as unknown as RecipeReply;
    expect(r.nutrition).toEqual({
      kcal: 200,
      proteinG: 10,
      carbsG: 30,
      fatG: 4,
      micronutrients: { fiberG: 5 },
    });
    expect((await a.post(`${root}/recipes`, input)).body.id).toBe(r.id);
    const reopen = await a.get(`${root}/recipes/${r.id}`);
    expect(reopen.body.steps).toEqual(input.steps);
    const edited = await a.patch(`${root}/recipes/${r.id}`, {
      ...input,
      servings: 4,
      expectedUpdatedAt: r.updatedAt,
    });
    expect(edited.status).toBe(200);
    expect((edited.body as unknown as RecipeReply).nutrition.kcal).toBe(100);
    const second = await a.patch(`${root}/recipes/${r.id}`, {
      ...input,
      servings: 1,
      expectedUpdatedAt: edited.body.updatedAt,
    });
    expect(second.status).toBe(200);
    expect((second.body as unknown as RecipeReply).nutrition.kcal).toBe(400);
    expect(
      (await a.get(`${root}/recipes?search=chilla&mealType=Breakfast&type=Personal`)).body.total,
    ).toBe(1);
  });
  it("rejects another actor's ingredient and rolls back every part of the recipe edit", async () => {
    const { a, b, root, otherRoot } = await setup();
    const own = ingredient();
    const foreign = ingredient("Foreign");
    await a.post(`${root}/ingredients`, own);
    await b.post(`${otherRoot}/ingredients`, foreign);
    const input = recipe(own.id);
    const r = (await a.post(`${root}/recipes`, input)).body;
    const bad = await a.patch(`${root}/recipes/${r.id}`, {
      ...input,
      name: "Bad edit",
      expectedUpdatedAt: r.updatedAt,
      ingredients: [{ ingredientId: foreign.id, quantity: 100, unit: "grams" }],
    });
    expect(bad.status).toBe(400);
    const after = await a.get(`${root}/recipes/${r.id}`);
    expect(after.body.name).toBe(input.name);
    expect(after.body.steps).toEqual(input.steps);
    expect((await b.get(`${otherRoot}/recipes/${r.id}`)).status).toBe(404);
    expect(
      (await b.patch(`${otherRoot}/recipes/${r.id}`, { ...input, expectedUpdatedAt: r.updatedAt }))
        .status,
    ).toBe(403);
    expect((await b.delete(`${otherRoot}/recipes/${r.id}`)).status).toBe(403);
  });
  it("rejects stale saves from a second tab rather than losing a first tab's edits", async () => {
    const { a, root } = await setup();
    const i = ingredient();
    await a.post(`${root}/ingredients`, i);
    const input = recipe(i.id);
    const r = (await a.post(`${root}/recipes`, input)).body;
    const results = await Promise.all([
      a.patch(`${root}/recipes/${r.id}`, {
        ...input,
        name: "First",
        expectedUpdatedAt: r.updatedAt,
      }),
      a.patch(`${root}/recipes/${r.id}`, {
        ...input,
        name: "Second",
        expectedUpdatedAt: r.updatedAt,
      }),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
  });
  it("System recipes are read-only and duplicate into independent Personal recipes, even on retry", async () => {
    const { a, b, root, otherRoot } = await setup();
    const id = newId();
    systemIds.push(id);
    await db
      .insert(schema.recipes)
      .values({ id, source: "system", name: "System dal", mealTypes: ["Lunch"], servings: 2 });
    expect(
      (
        await a.patch(`${root}/recipes/${id}`, {
          ...recipe(newId()),
          expectedUpdatedAt: new Date().toISOString(),
        })
      ).status,
    ).toBe(403);
    expect((await a.delete(`${root}/recipes/${id}`)).status).toBe(403);
    const copyId = newId();
    const copied = await a.post(`${root}/recipes/${id}/duplicate`, { id: copyId });
    expect(copied.status).toBe(201);
    expect((await a.post(`${root}/recipes/${id}/duplicate`, { id: copyId })).body.id).toBe(copyId);
    const edit = await a.patch(`${root}/recipes/${copyId}`, {
      ...copied.body,
      name: "My dal",
      expectedUpdatedAt: copied.body.updatedAt,
    });
    expect(edit.status).toBe(200);
    expect((await b.get(`${otherRoot}/recipes/${id}`)).body.name).toBe("System dal");
    expect((await b.get(`${otherRoot}/recipes/${copyId}`)).status).toBe(404);
  });
  it("deleted ingredients remain readable in existing recipes but cannot be added; invalid units and servings never save", async () => {
    const { a, root } = await setup();
    const i = ingredient();
    await a.post(`${root}/ingredients`, i);
    const input = recipe(i.id);
    const r = (await a.post(`${root}/recipes`, input)).body;
    expect((await a.post(`${root}/recipes`, { ...input, id: newId(), servings: 0 })).status).toBe(
      400,
    );
    expect(
      (
        await a.post(`${root}/recipes`, {
          ...input,
          id: newId(),
          ingredients: [{ ingredientId: i.id, quantity: 1, unit: "bowl" }],
        })
      ).status,
    ).toBe(400);
    expect((await a.patch(`${root}/ingredients/${i.id}`, { ...i, gramsPerUnit: 90 })).status).toBe(
      400,
    );
    expect((await a.delete(`${root}/ingredients/${i.id}`)).status).toBe(200);
    expect((await a.get(`${root}/recipes/${r.id}`)).status).toBe(200);
    expect((await a.post(`${root}/recipes`, { ...input, id: newId() })).status).toBe(400);
    expect((await a.delete(`${root}/recipes/${r.id}`)).status).toBe(200);
    expect((await a.get(`${root}/recipes/${r.id}`)).status).toBe(404);
    expect(
      (await a.patch(`${root}/recipes/${r.id}`, { ...input, expectedUpdatedAt: r.updatedAt }))
        .status,
    ).toBe(403);
    expect((await a.delete(`${root}/recipes/${r.id}`)).status).toBe(200);
  });
  it("expired sessions cannot create nutrition data", async () => {
    const { a, root, userId } = await setup();
    await db
      .update(schema.sessions)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(schema.sessions.userId, userId));
    expect((await a.post(`${root}/ingredients`, ingredient())).status).toBe(401);
    expect((await a.post(`${root}/recipes`, recipe(newId()))).status).toBe(401);
  });
});
