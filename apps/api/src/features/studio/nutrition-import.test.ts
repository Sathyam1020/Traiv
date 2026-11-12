import { newId, schema } from "@traiv/db";
import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../../db.js";
import { prepareCoachwayImport } from "../../library/coachway-import.js";
import { storeCoachwayImport } from "../../library/store-coachway-import.js";
import { signUpOverHttp, startApi, type TestServer } from "../../test-support/http.js";
import { resetEmails } from "../../test-support/reset.js";
import { listStudios } from "./service.js";

const EMAILS = ["studio-nutrition-import-1@example.com", "studio-nutrition-import-2@example.com"];
let api: TestServer;
const sourceIngredientId = newId();
const sourceA = newId();
const sourceB = newId();
const name = `Import test ${newId()}`;
const row = {
  id: sourceA,
  title: name,
  description: "Weighed source recipe",
  servings: 2,
  prepTime: 5,
  cookTime: 10,
  difficulty: "easy",
  imageUrl: null,
  thumbnailUrl: null,
  videoUrl: null,
  ingredients: [
    {
      ingredient: sourceIngredientId,
      amountInGrams: 150,
      proteinPer100g: 10,
      carbsPer100g: 15,
      fatPer100g: 0,
      kcalPer100g: 100,
    },
  ],
  mealTypes: [{ mealType: { name: "Breakfast" } }],
  macros: { protein: 15, carbs: 22.5, fat: 0, calories: 150 },
};
const list = [row, { ...row, id: sourceB, servings: 1 }];
const detail = {
  ingredients: [
    {
      id: sourceIngredientId,
      name: "Import test ingredient",
      category: "cereal",
      unit: "cup",
      unitGrams: 50,
      countryCode: "NO",
      nutrients: [{ code: "fiber", name: "Dietary Fibre", unit: "g", amountPer100g: 4 }],
    },
  ],
  recipes: [sourceA, sourceB].map((id) => ({
    id,
    steps: [
      { stepNumber: 2, text: "Cook the mixture." },
      { stepNumber: 1, text: "Weigh the ingredients." },
    ],
    tags: [{ tag: "vegetarian" }, { tag: "has-gluten" }],
  })),
};
beforeAll(async () => {
  await resetEmails(EMAILS);
  api = await startApi();
});
afterAll(async () => {
  await api.close();
  await resetEmails(EMAILS);
  await db
    .delete(schema.recipes)
    .where(inArray(schema.recipes.seedKey, [`coachway:${sourceA}`, `coachway:${sourceB}`]));
  await db
    .delete(schema.ingredients)
    .where(eq(schema.ingredients.dataSource, `coachway:${sourceIngredientId}`));
});
describe("Source recipe import through the coaching API", () => {
  it("retries preserve both same-name source variants, real instructions, per-serving nutrition and independent Personal copies", async () => {
    const source = prepareCoachwayImport(list, detail);
    expect((await storeCoachwayImport(source)).added).toBe(2);
    expect((await storeCoachwayImport(source)).added).toBe(0);
    const [saved] = await db
      .select({ id: schema.recipes.id })
      .from(schema.recipes)
      .where(eq(schema.recipes.seedKey, `coachway:${sourceA}`));
    if (!saved) throw new Error("Source recipe missing");
    const a = await signUpOverHttp(api.url, EMAILS[0] ?? "", "Import coach");
    const b = await signUpOverHttp(api.url, EMAILS[1] ?? "", "Other import coach");
    const [sa] = await listStudios(a.userId);
    const [sb] = await listStudios(b.userId);
    if (!sa || !sb) throw new Error("Missing studio");
    const root = `/studios/${sa.id}`;
    const otherRoot = `/studios/${sb.id}`;
    const found = await a.agent.get(
      `${root}/recipes?search=${encodeURIComponent(name)}&type=System`,
    );
    expect(found.body.total).toBe(2);
    const recipe = await b.agent.get(`${otherRoot}/recipes/${saved.id}`);
    expect(recipe.status).toBe(200);
    expect(recipe.body.steps).toEqual(["Weigh the ingredients.", "Cook the mixture."]);
    expect(recipe.body.nutrition).toEqual({
      kcal: 75,
      proteinG: 7.5,
      carbsG: 11.3,
      fatG: 0,
      micronutrients: { fiberG: 3 },
    });
    expect(recipe.body.allergenTags).toEqual(["Gluten"]);
    expect(recipe.body.dietaryTags).toEqual(["Vegetarian"]);
    const copyId = newId();
    const copy = await a.agent.post(`${root}/recipes/${saved.id}/duplicate`, { id: copyId });
    expect(copy.status).toBe(201);
    expect(copy.body.nutrition).toEqual(recipe.body.nutrition);
    const changed = await a.agent.patch(`${root}/recipes/${copyId}`, {
      ...copy.body,
      servings: 1,
      expectedUpdatedAt: copy.body.updatedAt,
    });
    expect(changed.status).toBe(200);
    expect((changed.body.nutrition as { kcal: number }).kcal).toBe(150);
    expect((await b.agent.get(`${otherRoot}/recipes/${saved.id}`)).body.servings).toBe(2);
    expect((await b.agent.get(`${otherRoot}/recipes/${copyId}`)).status).toBe(404);
  });
  it("refuses incomplete names and inconsistent snapshot totals before an import can write", () => {
    expect(() => prepareCoachwayImport(list, { ...detail, ingredients: [] })).toThrow(
      "Missing name",
    );
    expect(() =>
      prepareCoachwayImport([{ ...row, macros: { ...row.macros, calories: 900 } }], detail),
    ).toThrow("Source totals do not match");
  });
});
