import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { newId, schema } from "@traiv/db";
import { config } from "dotenv";
import { and, asc, ilike, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { INDIAN_RECIPES, RECIPE_INGREDIENTS } from "./indian-recipes.js";
import { recipeInstructions } from "./recipe-methods.js";

config({ path: resolve(import.meta.dirname, "../../../../.env"), quiet: true });
if (process.argv.includes("--test")) {
  if (!process.env.TEST_DATABASE_URL) throw new Error("TEST_DATABASE_URL required");
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
const { db } = await import("../db.js");
const ref = z
  .object({
    dishes: z.array(
      z.object({
        title: z.string(),
        region: z.string(),
        mealTypes: z.array(z.string()),
        dietaryTags: z.array(z.string()),
      }),
    ),
  })
  .parse(
    JSON.parse(
      readFileSync(
        resolve(
          import.meta.dirname,
          "../../../../research/coachway/evidence/indian-dishes-reference.json",
        ),
        "utf-8",
      ),
    ),
  );
if (process.argv.includes("--inspect-ingredients")) {
  for (const pattern of [
    "%flour%whole%",
    "%chicken%breast%raw%",
    "%textur%",
    "%soya%",
    "%soy%protein%",
    "%gorgon%",
  ])
    console.warn(
      JSON.stringify({
        pattern,
        names: (
          await db
            .select({ name: schema.ingredients.name })
            .from(schema.ingredients)
            .where(ilike(schema.ingredients.name, pattern))
            .limit(40)
        ).map((r) => r.name),
      }),
    );
  process.exit(0);
}
// Two gaps in FDC/IFCT: use named, traceable composition records, never substitute
// lotus seeds for popped foxnuts or raw soybeans for defatted soy chunks.
const supplements = [
  {
    name: "Makhana, popped, plain",
    kcal: 358,
    proteinG: 8.7,
    carbsG: 79.8,
    fatG: 0.5,
    dataSource: "niftem-pmfme-makhana-table-1.1",
    category: "Nuts and seeds",
    country: "India",
    dietaryTags: ["Vegan", "Vegetarian"],
    micronutrients: { sodiumMg: 71, potassiumMg: 42, calciumMg: 18.5, ironMg: 1.4 },
  },
  {
    name: "Soya chunks, dry (Nutrela label)",
    kcal: 354,
    proteinG: 53.19,
    carbsG: 33.5,
    fatG: 0.82,
    dataSource: "nutrela-label-zepto-2026-10-30",
    category: "Vegan and Vegetarian",
    country: "India",
    dietaryTags: ["Vegan", "Vegetarian"],
    allergenTags: ["Soy"],
    micronutrients: { sugarG: 7.18, saturatedFatG: 0.19, sodiumMg: 8 },
  },
];
for (const row of supplements) {
  const [found] = await db
    .select({ id: schema.ingredients.id })
    .from(schema.ingredients)
    .where(
      and(
        isNull(schema.ingredients.studioId),
        sql`lower(${schema.ingredients.name}) = lower(${row.name})`,
      ),
    )
    .limit(1);
  if (!found) await db.insert(schema.ingredients).values({ ...row, id: newId() });
}
const ingredients = new Map<string, typeof schema.ingredients.$inferSelect>();
const missing: string[] = [];
for (const [key, names] of Object.entries(RECIPE_INGREDIENTS)) {
  let match: typeof schema.ingredients.$inferSelect | undefined;
  for (const name of names) {
    const [row] = await db
      .select()
      .from(schema.ingredients)
      .where(
        and(
          isNull(schema.ingredients.studioId),
          isNull(schema.ingredients.deletedAt),
          sql`lower(${schema.ingredients.name}) = lower(${name})`,
        ),
      )
      .orderBy(asc(schema.ingredients.id))
      .limit(1);
    if (row) {
      match = row;
      break;
    }
  }
  if (!match) {
    missing.push(key);
    const hints = await db
      .select({ name: schema.ingredients.name })
      .from(schema.ingredients)
      .where(ilike(schema.ingredients.name, `%${names[0]?.split(",")[0]?.split(" ")[0] ?? key}%`))
      .limit(12);
    console.warn(
      `Missing ${key}: ${names.join(" / ")}. Candidates: ${hints.map((r) => r.name).join(" | ")}`,
    );
  } else ingredients.set(key, match);
}
if (missing.length)
  throw new Error(
    `Resolve ${missing.length} ingredient mappings before seeding recipes. No recipes written.`,
  );
if (process.argv.includes("--check-ingredients")) {
  console.warn(`${ingredients.size} ingredient mappings verified.`);
  process.exit(0);
}
let added = 0;
let existing = 0;
for (const recipe of INDIAN_RECIPES) {
  const meta = ref.dishes.find((d) => d.title === recipe.name);
  if (!meta) throw new Error(`Missing Indian dish reference: ${recipe.name}`);
  const seedKey = `indian:${recipe.name.toLowerCase().replace(/[^a-z0-9]+/gu, "-")}`;
  const steps = recipeInstructions(recipe.method);
  const allergens = new Set<string>();
  for (const line of recipe.ingredients) {
    if (["paneer", "yogurt", "milk", "cream", "butter", "ghee"].includes(line.key))
      allergens.add("Dairy");
    if (["flour", "whiteFlour", "bread", "pav", "semolina", "vermicelli"].includes(line.key))
      allergens.add("Gluten");
    if (["egg", "eggWhite"].includes(line.key)) allergens.add("Eggs");
    if (["cashew", "almonds"].includes(line.key)) allergens.add("Nuts");
    if (line.key === "peanuts") allergens.add("Contains Peanuts");
    if (["fish", "hilsa"].includes(line.key)) allergens.add("Fish");
    if (line.key === "prawn") allergens.add("Shellfish");
    if (line.key === "soy") allergens.add("Soy");
  }
  await db.transaction(async (tx) => {
    const id = newId();
    const rows = await tx
      .insert(schema.recipes)
      .values({
        id,
        seedKey,
        studioId: null,
        source: "system",
        name: recipe.name,
        servings: recipe.servings,
        description: `${meta.region} Indian recipe. Ingredient weights are for the whole batch, before cooking, unless an ingredient says cooked. Nutrition is calculated from these ingredients; preparation and yield can vary.`,
        mealTypes: meta.mealTypes,
        dietaryTags: meta.dietaryTags,
        allergenTags: [...allergens],
        difficulty: "medium",
        prepMinutes: recipe.prepMinutes,
        cookMinutes: recipe.cookMinutes,
      })
      .onConflictDoNothing({ target: schema.recipes.seedKey })
      .returning({ id: schema.recipes.id });
    if (!rows.length) {
      existing++;
      return;
    }
    await tx.insert(schema.recipeIngredients).values(
      recipe.ingredients.map((line, position) => {
        const ingredient = ingredients.get(line.key);
        if (!ingredient) throw new Error(`Missing mapping ${line.key}`);
        return {
          id: newId(),
          recipeId: id,
          ingredientId: ingredient.id,
          position,
          quantity: line.grams,
          unit: "grams",
        };
      }),
    );
    await tx
      .insert(schema.recipeSteps)
      .values(steps.map((text, position) => ({ id: newId(), recipeId: id, position, text })));
    added++;
  });
}
console.warn(
  `Indian recipes: ${added} added, ${existing} already present. ${INDIAN_RECIPES.length} authored recipes in one shared library.`,
);
process.exit(0);
