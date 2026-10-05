import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "vitest/config";

// The same root .env the app reads, so one file configures both.
config({ path: resolve(import.meta.dirname, "../../.env") });

/**
 * Tests run against `TEST_DATABASE_URL` when it is set, and fall back to the real
 * `DATABASE_URL` when it is not.
 *
 * The fallback is loud on purpose. These tests delete rows — teardown removes users,
 * studios and their children — so running them against the shared development database
 * is something you should know you are doing, and it costs ~300ms per query from here
 * because that database is in us-east-2.
 */
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const isLocal = Boolean(
  testDatabaseUrl && /@(127\.0\.0\.1|localhost|\[::1\])[:/]/.test(testDatabaseUrl),
);

if (!testDatabaseUrl) {
  console.warn(
    "\n  TEST_DATABASE_URL is not set — running against DATABASE_URL, which is remote and" +
      "\n  which these tests delete rows from. See .env.example to point them at a local" +
      "\n  Postgres instead.\n",
  );
}

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: true,
    ...(testDatabaseUrl ? { env: { DATABASE_URL: testDatabaseUrl } } : {}),
    // Scenario tests share one real database, so they run serially. Parallel runs would
    // have them tripping over each other's rows.
    sequence: { concurrent: false },
    fileParallelism: false,
    // A local database answers in microseconds; a remote one costs ~300ms per query, and
    // a scenario doing thirty statements legitimately takes ten seconds.
    testTimeout: isLocal ? 20_000 : 60_000,
    hookTimeout: isLocal ? 20_000 : 60_000,
  },
});
