import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: true,
    // Scenario tests share one real database, so they run serially. Parallel runs would
    // have them tripping over each other's rows.
    sequence: { concurrent: false },
    fileParallelism: false,
    // The test database is remote: ~300ms per query. A scenario doing thirty sequential
    // statements legitimately takes ten seconds, so the ceiling is generous on purpose.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
