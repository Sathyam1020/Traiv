import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { newId, schema } from "@traiv/db";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { parseCsvRecords } from "./csv.js";

/**
 * The shared ingredient library's generic layer — USDA FoodData Central.
 *
 * CC0 / public domain, bulk CSV download (`fdc.nal.usda.gov/download-datasets`), no
 * live-API dependency for the seed itself. Two of FDC's datasets: **SR Legacy**
 * (~7,800 foods, the long-standing reference set — raw ingredients, home-cooked dishes,
 * and a wide "Fast Foods"/"Restaurant Foods" slice) and **Foundation Foods**
 * (lab-analysed, smaller, the most rigorously measured entries). See
 * `.ai/features/nutrition/spec.md` and ADR 0025.
 *
 * The downloads are ZIPs of relational CSVs (`food.csv` + `food_nutrient.csv` +
 * `nutrient.csv` + `food_category.csv`), not one flat file — `unzip` is shelled out to
 * rather than adding a zip-parsing dependency for a script that never ships (see
 * `csv.ts`'s own note). `unzip` is standard on macOS and virtually every Linux base
 * image; if it's ever missing in CI, that's the one thing to install, not a library to
 * add here.
 *
 * Idempotent on name, same as every other seed in this directory.
 *
 *     pnpm --filter @traiv/api seed:fdc-ingredients
 */

const SOURCES = [
  {
    url: "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip",
    dataType: "sr_legacy_food",
    dataSource: "fdc",
  },
  {
    url: "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_csv_2025-04-24.zip",
    dataType: "foundation_food",
    dataSource: "fdc",
  },
];

// Stable USDA nutrient ids (`nutrient.csv`'s `nutrient_nbr` maps 1:1 to these across
// releases) — hardcoded rather than resolved by name each run, since the four this
// schema requires (protein/fat/carbs/kcal) are load-bearing and must not silently
// resolve to nothing if a future export renames a column.
const PROTEIN = "1003";
const FAT = "1004";
const CARBS = "1005";
const ENERGY_KCAL = "1008";
const FIBER = "1079";
const SUGAR = "1063";
const SODIUM = "1093";
const SAT_FAT = "1258";
const CHOLESTEROL = "1253";
const IRON = "1089";
const CALCIUM = "1087";
const POTASSIUM = "1092";
const VITAMIN_D = "1114";
const VITAMIN_C = "1162";

const MICRONUTRIENT_IDS: Record<string, string> = {
  [FIBER]: "fiberG",
  [SUGAR]: "sugarG",
  [SODIUM]: "sodiumMg",
  [SAT_FAT]: "saturatedFatG",
  [CHOLESTEROL]: "cholesterolMg",
  [IRON]: "ironMg",
  [CALCIUM]: "calciumMg",
  [POTASSIUM]: "potassiumMg",
  [VITAMIN_D]: "vitaminDUg",
  [VITAMIN_C]: "vitaminCMg",
};

type IngredientRow = typeof schema.ingredients.$inferInsert;

async function downloadAndExtract(url: string): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), "fdc-"));
  const zipPath = join(dir, "source.zip");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`FDC download failed (${res.status}): ${url}`);
  writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));

  execFileSync("unzip", ["-o", "-q", zipPath, "-d", dir]);
  return dir;
}

function findCsv(dir: string, name: string): string {
  const out = execFileSync("find", [dir, "-name", name]).toString().trim().split("\n")[0];
  if (!out) throw new Error(`${name} not found under ${dir}`);
  return readFileSync(out, "utf-8");
}

async function importFdcSource(source: (typeof SOURCES)[number]) {
  const dir = await downloadAndExtract(source.url);

  const categories = new Map(
    parseCsvRecords(findCsv(dir, "food_category.csv")).map((r) => [r.id, r.description]),
  );

  const foods = parseCsvRecords(findCsv(dir, "food.csv")).filter(
    (r) => r.data_type === source.dataType,
  );

  // One pass over the (large) long-format nutrient file, keeping only the ids this
  // schema uses — a food can carry a hundred-plus nutrient rows, most of which nothing
  // here reads.
  const wanted = new Set([PROTEIN, FAT, CARBS, ENERGY_KCAL, ...Object.keys(MICRONUTRIENT_IDS)]);
  const byFood = new Map<string, Map<string, number>>();
  for (const r of parseCsvRecords(findCsv(dir, "food_nutrient.csv"))) {
    const nutrientId = r.nutrient_id ?? "";
    if (!wanted.has(nutrientId)) continue;
    const amount = Number.parseFloat(r.amount ?? "");
    if (!Number.isFinite(amount)) continue;
    const fdcId = r.fdc_id ?? "";
    const existing = byFood.get(fdcId) ?? new Map<string, number>();
    existing.set(nutrientId, amount);
    byFood.set(fdcId, existing);
  }

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const f of foods) {
    const n = byFood.get(f.fdc_id ?? "");
    const kcal = n?.get(ENERGY_KCAL);
    const protein = n?.get(PROTEIN);
    const fat = n?.get(FAT);
    const carbs = n?.get(CARBS);

    // The four macros are what this schema requires `not null` — a food missing any of
    // them is incompletely analysed, and a zero stand-in would silently lie.
    if (kcal === undefined || protein === undefined || fat === undefined || carbs === undefined) {
      skipped += 1;
      continue;
    }

    const micronutrients: Record<string, number> = {};
    for (const [id, key] of Object.entries(MICRONUTRIENT_IDS)) {
      const v = n?.get(id);
      if (v !== undefined) micronutrients[key] = v;
    }

    const row: IngredientRow = {
      id: newId(),
      name: f.description ?? "",
      dataSource: source.dataSource,
      category: categories.get(f.food_category_id ?? "") ?? null,
      country: "Global",
      kcal: Math.round(kcal),
      proteinG: protein,
      fatG: fat,
      carbsG: carbs,
      micronutrients: Object.keys(micronutrients).length > 0 ? micronutrients : null,
    };

    const [existing] = await db
      .select({ id: schema.ingredients.id })
      .from(schema.ingredients)
      .where(and(eq(schema.ingredients.name, row.name), isNull(schema.ingredients.studioId)))
      .limit(1);

    if (existing) {
      const { id: _id, ...patch } = row;
      await db.update(schema.ingredients).set(patch).where(eq(schema.ingredients.id, existing.id));
      updated += 1;
    } else {
      await db.insert(schema.ingredients).values(row);
      added += 1;
    }
  }

  return { added, updated, skipped, total: foods.length };
}

export async function seedFdcIngredients() {
  const results = [];
  for (const source of SOURCES) {
    results.push({ dataType: source.dataType, ...(await importFdcSource(source)) });
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = await seedFdcIngredients();
  for (const r of results) {
    console.warn(
      `  ${r.dataType}: +${r.added} new, ${r.updated} updated, ${r.skipped} skipped (of ${r.total})`,
    );
  }
  process.exit(0);
}
