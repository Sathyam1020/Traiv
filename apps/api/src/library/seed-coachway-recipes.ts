import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import { prepareCoachwayImport } from "./coachway-import.js";

config({ path: resolve(import.meta.dirname, "../../../../.env"), quiet: true });
if (process.argv.includes("--test")) {
  if (!process.env.TEST_DATABASE_URL) throw new Error("TEST_DATABASE_URL required");
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
const evidence = resolve(import.meta.dirname, "../../../../research/coachway/evidence");
const source = prepareCoachwayImport(
  JSON.parse(readFileSync(resolve(evidence, "recipes-api-full.json"), "utf-8")),
  JSON.parse(readFileSync(resolve(evidence, "recipes-api-details.json"), "utf-8")),
);
console.warn(
  `Validated ${source.recipes.length} recipes and ${source.ingredients.length} named ingredient profiles. Batch totals match source snapshots.`,
);
const { storeCoachwayImport } = await import("./store-coachway-import.js");
const result = await storeCoachwayImport(source);
console.warn(
  `Coachway recipes: ${result.added} added, ${result.existing} already present. Active recipes in database: ${result.total}.`,
);
process.exit(0);
