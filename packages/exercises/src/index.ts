/** Shared catalog semantics for API filtering and both trainer exercise pickers. */
export type CatalogFilters = { q?: string; muscle?: string; equipment?: string; category?: string };
export type ExerciseFacets = {
  muscles: string[];
  equipments: string[];
  categories: string[];
  muscleAliases: Record<string, string[]>;
  source: "exerciseapi" | "legacy";
};
export const CATALOG_CACHE_VERSION = "v3";
const key = (value: string) =>
  value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
const muscleNames: Record<string, string> = {
  abs: "core",
  abdominals: "core",
  lats: "back",
  traps: "back",
  "lower back": "back",
  "middle back": "back",
  "upper back": "back",
  quads: "quadriceps",
};
const equipmentNames: Record<string, string> = {
  dumbbells: "dumbbell",
  bands: "band",
  kettlebells: "kettlebell",
  bodyweight: "body only",
  "body weight": "body only",
};
export const canonicalEquipment = (value: string) =>
  equipmentNames[key(value)] ?? value.trim().toLowerCase().replace(/\s+/g, " ");
export const canonicalMuscle = (value: string) => muscleNames[key(value)] ?? key(value);
export function normalizeFilters(input: CatalogFilters): CatalogFilters {
  const q = input.q?.trim().replace(/\s+/g, " ").toLowerCase();
  return {
    q: q || undefined,
    muscle: input.muscle?.trim() ? canonicalMuscle(input.muscle) : undefined,
    equipment: input.equipment?.trim() ? canonicalEquipment(input.equipment) : undefined,
    category: input.category?.trim().toLowerCase().replace(/\s+/g, "_") || undefined,
  };
}
export function filterLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
export type CatalogRow = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  category?: string | null;
  shared: boolean;
};
function muscleValues(value: string, facets?: ExerciseFacets) {
  return facets?.muscleAliases[key(value)] ?? [canonicalMuscle(value)];
}
export function matchesExercise(
  row: Pick<CatalogRow, "name" | "muscle" | "equipment" | "category">,
  input: CatalogFilters,
  facets?: ExerciseFacets,
) {
  const filters = normalizeFilters(input);
  const words = key(filters.q ?? "")
    .split(" ")
    .filter(Boolean);
  return (
    words.every((word) => key(row.name).includes(word)) &&
    (!filters.muscle || muscleValues(row.muscle, facets).includes(filters.muscle)) &&
    (!filters.equipment || canonicalEquipment(row.equipment) === filters.equipment) &&
    (!filters.category || key(row.category ?? "") === key(filters.category))
  );
}
export function mergeExercisePages<T extends CatalogRow>(
  pages: { exercises: T[] }[],
  edits: T[],
  filters: CatalogFilters,
  facets?: ExerciseFacets,
): T[] {
  const rows = new Map<string, T>();
  const byId = new Map(edits.map((row) => [row.id, row]));
  for (const row of edits) if (matchesExercise(row, filters, facets)) rows.set(row.id, row);
  for (const page of pages)
    for (const row of page.exercises) {
      if (!row.shared && !row.id.startsWith("exa:")) continue;
      const edited = byId.get(row.id);
      // Preserve provider keyword/secondary-muscle matches when an edit only changes media.
      // Re-check only fields actually changed by the studio.
      const editedFilters = edited
        ? {
            ...filters,
            q: key(edited.name) === key(row.name) ? undefined : filters.q,
            muscle: key(edited.muscle) === key(row.muscle) ? undefined : filters.muscle,
            equipment: key(edited.equipment) === key(row.equipment) ? undefined : filters.equipment,
            category:
              key(edited.category ?? "") === key(row.category ?? "") ? undefined : filters.category,
          }
        : filters;
      if (!edited || matchesExercise(edited, editedFilters, facets))
        rows.set(row.id, edited ?? row);
    }
  return [...rows.values()];
}
export function completeFilterOptions(
  facets: ExerciseFacets | undefined,
  edits: CatalogRow[],
  selected: CatalogFilters,
) {
  const sort = (values: string[]) =>
    [...new Set(values.filter(Boolean))].sort((a, b) =>
      filterLabel(a).localeCompare(filterLabel(b)),
    );
  return {
    muscles: sort([
      ...(facets?.muscles ?? []),
      ...edits.flatMap((row) => muscleValues(row.muscle, facets)),
      ...(selected.muscle ? [canonicalMuscle(selected.muscle)] : []),
    ]),
    equipments: sort([
      ...(facets?.equipments ?? []).map(canonicalEquipment),
      ...edits.map((row) => canonicalEquipment(row.equipment)),
      ...(selected.equipment ? [canonicalEquipment(selected.equipment)] : []),
    ]),
    categories: sort([
      ...(facets?.categories ?? []).map(
        (value) => normalizeFilters({ category: value }).category ?? "",
      ),
      ...edits.flatMap((row) =>
        row.category ? [normalizeFilters({ category: row.category }).category ?? ""] : [],
      ),
      ...(selected.category
        ? [normalizeFilters({ category: selected.category }).category ?? ""]
        : []),
    ]),
  };
}
