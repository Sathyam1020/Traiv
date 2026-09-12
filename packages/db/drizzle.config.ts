import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// .env lives at the repo root, not in this package.
config({ path: "../../.env" });

// `generate` only reads the schema and never connects, so it must work without a database.
// `migrate` and `push` do connect, and will fail loudly if this is still the placeholder.
const url = process.env.DATABASE_URL ?? "postgresql://localhost:5432/traiv_unset";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
