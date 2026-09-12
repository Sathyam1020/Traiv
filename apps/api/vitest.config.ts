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
    testTimeout: 20_000,
  },
});
