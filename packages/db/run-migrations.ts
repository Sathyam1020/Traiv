/**
 * Apply pending migrations and say what went wrong when one fails.
 *
 * `drizzle-kit migrate` exits 1 with no message when a statement errors, which makes a
 * failed migration indistinguishable from a bad connection string. This uses the same
 * journal and the same files, and prints the error.
 *
 *     TARGET=<url> tsx run-migrations.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const url = process.env.TARGET;
if (!url) throw new Error("TARGET is required");

const pool = new Pool({ connectionString: url });
const db = drizzle(pool);

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("migrations applied");
} catch (e) {
  const err = e as Error & { cause?: unknown };
  console.error("MIGRATION FAILED:", err.message);
  const cause = err.cause as { message?: string; detail?: string; hint?: string } | undefined;
  if (cause) console.error("  cause:", cause.message, cause.detail ?? "", cause.hint ?? "");
  process.exitCode = 1;
} finally {
  await pool.end();
}
