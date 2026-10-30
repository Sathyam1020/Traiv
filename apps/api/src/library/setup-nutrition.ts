import { resolve } from "node:path";
import { createDb } from "@traiv/db";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";

config({ path: resolve(import.meta.dirname, "../../../../.env"), quiet: true });
const test = process.argv.includes("--test");
const url = test ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;
if (!url) throw new Error(test ? "TEST_DATABASE_URL is required" : "DATABASE_URL is required");
process.env.DATABASE_URL = url;
const db = createDb(url);
await migrate(db, {
  migrationsFolder: resolve(import.meta.dirname, "../../../../packages/db/drizzle"),
});
console.warn(`Nutrition migrations applied (${test ? "test" : "development"}).`);
if (process.argv.includes("--inspect")) {
  console.warn(
    (
      await db.execute(
        sql`select current_database() as db, conname, pg_get_constraintdef(oid) as def from pg_constraint where conrelid in ('recipe'::regclass, 'recipe_ingredient'::regclass)`,
      )
    ).rows,
  );
  console.warn(
    (
      await db.execute(
        sql`select * from drizzle.__drizzle_migrations order by created_at desc limit 4`,
      )
    ).rows,
  );
  process.exit(0);
}
if (!process.argv.includes("--migrate-only")) {
  const { seedFdcIngredients } = await import("./fdc-ingredients.js");
  const { seedIfctIngredients } = await import("./ifct-ingredients.js");
  console.warn("FDC", await seedFdcIngredients());
  console.warn("IFCT", await seedIfctIngredients());
}
process.exit(0);
