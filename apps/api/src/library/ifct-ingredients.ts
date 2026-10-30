import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { newId, type schema } from "@traiv/db";
import { parseCsvRecords } from "./csv.js";
import { upsertSystemIngredients } from "./upsert-ingredients.js";

/**
 * The shared ingredient library's India layer — the Indian Food Composition Tables 2017
 * (NIN/ICMR), via the `@ifct2017/compositions` digitisation: 542 foods, each with full
 * macro + micronutrient values in one row. See `.ai/features/nutrition/spec.md` and ADR
 * 0025 for why this exists at all — none of Coachway's own country coverage includes
 * India, and generic USDA data (`fdc-ingredients.ts`) has almost no Indian dishes.
 *
 * **Pinned to `@ifct2017/compositions@2.0.8`, fetched directly from the npm registry
 * tarball — not the GitHub repo, and not through npm's own resolver.** That project
 * relicensed MIT → AGPL-3.0 on 2025-04-18; npm's immutable, already-published tarballs
 * are unaffected by a later relicense or a rewritten git history (confirmed: the
 * `nodef/ifct2017` repo's visible commit history no longer reaches back that far,
 * npm's published versions do). 2.0.8 was published 2022-09-17, under MIT — this
 * function asserts that against the downloaded package's own `package.json` before
 * doing anything else with it, and refuses to seed if that ever stops being true.
 *
 *     pnpm --filter @traiv/api seed:ifct-ingredients
 */

const PACKAGE_VERSION = "2.0.8";
const TARBALL_URL = `https://registry.npmjs.org/@ifct2017/compositions/-/compositions-${PACKAGE_VERSION}.tgz`;
const REQUIRED_LICENSE = "MIT";

// IFCT reports energy in kJ (`enerc`) — confirmed by mass balance against the same
// row's protein/fat/carb grams (4/4/9), not by column-name guesswork.
const KJ_PER_KCAL = 4.184;

const MICRONUTRIENT_COLUMNS: Record<string, string> = {
  fibtg: "fiberG",
  fsugar: "sugarG",
  na: "sodiumMg",
  fasat: "saturatedFatG",
  cholc: "cholesterolMg",
  fe: "ironMg",
  ca: "calciumMg",
  k: "potassiumMg",
  vitc: "vitaminCMg",
  vitd: "vitaminDUg",
};

/** Their diet-safety tags → this schema's dietary-tag vocabulary. `nonveg` alone (no
 *  other tag present) means no restriction, so it maps to nothing. */
const TAG_MAP: Record<string, string> = {
  veg: "Vegetarian",
  vegetarian: "Vegetarian",
  eggetarian: "Eggetarian",
  fishetarian: "Pescetarian",
};

type IngredientRow = typeof schema.ingredients.$inferInsert;

export async function seedIfctIngredients() {
  const dir = mkdtempSync(join(tmpdir(), "ifct-"));
  const tarballPath = join(dir, "compositions.tgz");

  const res = await fetch(TARBALL_URL);
  if (!res.ok) throw new Error(`IFCT download failed (${res.status}): ${TARBALL_URL}`);
  writeFileSync(tarballPath, Buffer.from(await res.arrayBuffer()));

  execFileSync("tar", ["-xzf", tarballPath, "-C", dir, "--strip-components=1"]);

  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8")) as {
    license?: string;
    version?: string;
  };

  if (pkg.license !== REQUIRED_LICENSE || pkg.version !== PACKAGE_VERSION) {
    throw new Error(
      `IFCT seed refused: expected @ifct2017/compositions@${PACKAGE_VERSION} under ` +
        `${REQUIRED_LICENSE}, got v${pkg.version} under ${pkg.license}. Do not relax this ` +
        `check without re-verifying the license at whatever version replaces it.`,
    );
  }

  const license = readFileSync(join(dir, "LICENSE"), "utf-8");
  if (
    !license.startsWith("MIT License") ||
    !license.includes("Permission is hereby granted, free of charge")
  ) {
    throw new Error(
      "IFCT seed refused: the pinned archive does not contain the expected MIT LICENSE text.",
    );
  }
  const csv = readFileSync(join(dir, "index.csv"), "utf-8");
  const rows = parseCsvRecords(csv);

  const prepared: IngredientRow[] = [];
  let skipped = 0;

  for (const r of rows) {
    const enercKj = Number.parseFloat(r.enerc ?? "");
    const protein = Number.parseFloat(r.protcnt ?? "");
    const fat = Number.parseFloat(r.fatce ?? "");
    const carbs = Number.parseFloat(r.choavldf ?? "");

    if (![enercKj, protein, fat, carbs].every(Number.isFinite)) {
      skipped += 1;
      continue;
    }

    const dietaryTags = [
      ...new Set(
        (r.tags ?? "")
          .split(/\s+/u)
          .map((t) => TAG_MAP[t])
          .filter((t): t is string => Boolean(t)),
      ),
    ];

    const micronutrients: Record<string, number> = {};
    for (const [col, key] of Object.entries(MICRONUTRIENT_COLUMNS)) {
      const v = Number.parseFloat(r[col] ?? "");
      if (Number.isFinite(v)) micronutrients[key] = v;
    }

    const row: IngredientRow = {
      id: newId(),
      name: r.name ?? "",
      dataSource: "ifct",
      category: r.grup || null,
      country: "India",
      dietaryTags,
      kcal: Math.round(enercKj / KJ_PER_KCAL),
      proteinG: protein,
      fatG: fat,
      carbsG: carbs,
      micronutrients: Object.keys(micronutrients).length > 0 ? micronutrients : null,
    };

    prepared.push(row);
  }

  return { ...(await upsertSystemIngredients(prepared)), skipped, total: rows.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await seedIfctIngredients();
  console.warn(
    `  ifct: +${r.added} new, ${r.updated} updated, ${r.skipped} skipped (of ${r.total})`,
  );
  process.exit(0);
}
