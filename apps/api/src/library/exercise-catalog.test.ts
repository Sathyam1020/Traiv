import {
  type CatalogRow,
  completeFilterOptions,
  type ExerciseFacets,
  matchesExercise,
  mergeExercisePages,
  normalizeFilters,
} from "@traiv/exercises";
import { afterEach, describe, expect, it, vi } from "vitest";

const facets: ExerciseFacets = {
  source: "exerciseapi",
  muscles: ["back", "chest", "core", "quadriceps"],
  equipments: ["barbell", "dumbbell"],
  categories: ["strength", "mobility"],
  muscleAliases: { "pectoralis major": ["chest"], "erector spinae": ["back"] },
};
const exercise = (id: string, changes: Partial<CatalogRow> = {}): CatalogRow => ({
  id,
  name: "Bench Press",
  muscle: "Chest",
  equipment: "barbell",
  category: "strength",
  shared: true,
  ...changes,
});
describe("catalog filters and merge", () => {
  it("keeps Chest and all equipment/types independent of the currently loaded leg exercises", () => {
    const options = completeFilterOptions(
      facets,
      [exercise("own-leg", { muscle: "Quadriceps", shared: false })],
      {},
    );
    expect(options.muscles).toContain("chest");
    expect(options.equipments).toEqual(["barbell", "dumbbell"]);
    expect(options.categories).toEqual(["mobility", "strength"]);
  });
  it("normalizes case, aliases and whitespace into the same filter/cache identity", () => {
    expect(
      normalizeFilters({
        q: "  CHEST   Press ",
        muscle: " Abdominals ",
        equipment: " BARBELL ",
        category: "Physical Therapy",
      }),
    ).toEqual({
      q: "chest press",
      muscle: "core",
      equipment: "barbell",
      category: "physical_therapy",
    });
    expect(normalizeFilters({ q: "   " }).q).toBeUndefined();
  });
  it("uses taxonomy aliases for studio anatomy labels, and ANDs active filters", () => {
    const row = exercise("own", { muscle: "pectoralis major", shared: false });
    expect(
      matchesExercise(row, { muscle: "Chest", equipment: "barbell", q: "bench press" }, facets),
    ).toBe(true);
    expect(matchesExercise(row, { muscle: "Chest", equipment: "dumbbell" }, facets)).toBe(false);
  });
  it("deduplicates equipment/category spelling variants without losing studio matches", () => {
    const row = exercise("own", { equipment: "dumbbells", category: "Strength" });
    const options = completeFilterOptions(facets, [row], {});
    expect(options.equipments.filter((value) => value.startsWith("dumbbell"))).toEqual([
      "dumbbell",
    ]);
    expect(options.categories.filter((value) => value.toLowerCase() === "strength")).toEqual([
      "strength",
    ]);
    expect(matchesExercise(row, { equipment: "dumbbell", category: "strength" })).toBe(true);
  });
  it("preserves keyword matches whose exercise names do not contain the search term", () => {
    const rows = [exercise("exa:Bench_Press"), exercise("exa:Dips", { name: "Dips" })];
    expect(mergeExercisePages([{ exercises: rows }], [], { q: "chest" }, facets)).toHaveLength(2);
  });
  it("does not lose a provider keyword match when only its media was customized", () => {
    const row = exercise("exa:Bench_Press");
    expect(
      mergeExercisePages(
        [{ exercises: [row] }],
        [{ ...row, shared: false }],
        { q: "chest" },
        facets,
      ),
    ).toHaveLength(1);
  });
  it("removes mismatching renamed/reclassified studio overrides and never leaks stale owned rows", () => {
    const row = exercise("exa:Bench_Press");
    const edited = { ...row, name: "Studio Shoulder Press", muscle: "Shoulders", shared: false };
    expect(
      mergeExercisePages(
        [{ exercises: [row, exercise("deleted-own", { shared: false })] }],
        [edited],
        { muscle: "chest" },
        facets,
      ),
    ).toEqual([]);
  });
  it("deduplicates repeated IDs across pages while applying the current studio override", () => {
    const a = exercise("exa:A"),
      b = exercise("exa:B");
    const edited = { ...a, name: "Studio Bench Press", shared: false };
    const merged = mergeExercisePages(
      [{ exercises: [a] }, { exercises: [a, b] }],
      [edited],
      {},
      facets,
    );
    expect(merged.map((row) => row.id)).toEqual(["exa:A", "exa:B"]);
    expect(merged[0]?.name).toBe("Studio Bench Press");
  });
  it("keeps selected and studio-only facet values available without deriving options from pages", () => {
    const options = completeFilterOptions(
      facets,
      [exercise("own", { muscle: "Lats", equipment: "home_basics" })],
      { category: "custom" },
    );
    expect(options.muscles.filter((m) => m === "back")).toHaveLength(1);
    expect(options.equipments).toContain("home_basics");
    expect(options.categories).toContain("custom");
  });
});

vi.mock("../env.js", () => ({
  env: { EXERCISE_CATALOG: "exerciseapi", EXERCISEAPI_KEY: "test-only" },
}));
vi.mock("../db.js", () => ({ db: {} }));
const remote = (i: number) => ({
  id: `Chest_Press_${i}`,
  name: `Chest Press ${i}`,
  primaryMuscles: ["pectoralis major"],
  equipment: "barbell",
  level: "beginner",
  mechanic: "compound",
  category: "strength",
  videos: [],
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});
describe("provider pagination and reference data (no database/network)", () => {
  it("passes combined filters and derives continuation from the returned page", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        data: Array.from({ length: 20 }, (_, i) => remote(i)),
        total: null,
        offset: 0,
        limit: 20,
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const { providerExercises } = await import("./exercise-api.js");
    const page = await providerExercises({
      q: " CHEST  PRESS ",
      muscle: "Chest",
      equipment: "barbell",
      category: "strength",
    });
    const url = fetcher.mock.calls[0]?.[0] as URL;
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      q: "chest press",
      muscle: "chest",
      equipment: "barbell",
      category: "strength",
      limit: "20",
      offset: "0",
    });
    expect(page).toMatchObject({ hasMore: true, nextOffset: 20, total: null, limitReached: false });
  });
  it("stops at the free browse boundary without pretending all catalog results were loaded", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        data: Array.from({ length: 20 }, (_, i) => remote(i)),
        total: 2200,
        offset: 480,
        limit: 20,
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const { providerExercises } = await import("./exercise-api.js");
    expect(await providerExercises({ offset: 480 })).toMatchObject({
      hasMore: false,
      nextOffset: null,
      limitReached: true,
      total: 2200,
    });
    await providerExercises({ offset: 500 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("never offers another empty page for an exhausted keyword search", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ data: [], total: null, limit: 20, offset: 20 })),
    );
    const { providerExercises } = await import("./exercise-api.js");
    expect(await providerExercises({ q: "unknown", offset: 20 })).toMatchObject({
      hasMore: false,
      nextOffset: null,
    });
  });
  it("classifies malformed upstream pagination as a provider error, not a bad user search", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(Response.json({ data: [remote(0)], total: null, limit: 20, offset: 0 })),
    );
    const { providerExercises } = await import("./exercise-api.js");
    await expect(providerExercises({ offset: 20 })).rejects.toMatchObject({
      status: 502,
      code: "exercise_provider_invalid",
    });
  });
  it("loads complete filter vocabularies from all three reference endpoints", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: URL) =>
        Response.json(
          url.pathname.endsWith("muscles")
            ? {
                data: [
                  { displayGroup: "chest", muscles: ["pectoralis major"] },
                  { displayGroup: "quadriceps", muscles: ["rectus femoris"] },
                ],
              }
            : url.pathname.endsWith("equipment")
              ? { data: ["barbell", "dumbbell"] }
              : { data: [{ category: "strength" }, { category: "mobility" }] },
        ),
      ),
    );
    const { providerExerciseFacets } = await import("./exercise-api.js");
    expect(await providerExerciseFacets()).toMatchObject({
      muscles: ["chest", "quadriceps"],
      equipments: ["barbell", "dumbbell"],
      categories: ["strength", "mobility"],
      muscleAliases: { "pectoralis major": ["chest"] },
    });
  });
});
