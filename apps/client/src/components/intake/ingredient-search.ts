import { http } from "@/lib/api/client";

export type IngredientSuggestion = { id: string; name: string };

/** Thin wrapper over `GET /c/:studioId/ingredients/search` — read-only, name-only,
 * reusing the same ranked catalog search the coach's recipe builder already has. */
export async function searchIngredients(
  studioId: string,
  q: string,
): Promise<IngredientSuggestion[]> {
  if (!q.trim()) return [];
  const res = await http.get<{ items: IngredientSuggestion[] }>(
    `/c/${studioId}/ingredients/search`,
    { params: { q } },
  );
  return res.data.items;
}
