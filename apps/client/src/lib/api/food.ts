import { type ActionFeedback, withActionFeedback } from "@traiv/ui/lib/action-feedback";
import { http } from "./client";
export type Nutrients = { kcal: number; proteinG: number; carbsG: number; fatG: number };
export type FoodItem = Nutrients & {
  id: string;
  kind: "food" | "recipe" | "plan" | "manual" | "personal";
  name: string;
  imageUrl: string | null;
  description?: string | null;
  difficulty?: string | null;
  minutes?: number | null;
  brand?: string | null;
  category?: string | null;
  barcode?: string | null;
  servingLabel?: string;
  servingUnit?: string;
  per100?: Nutrients;
  per100Micronutrients?: Record<string, number>;
  servings?: number;
  updatedAt?: string;
  baseUnit?: "grams" | "ml";
  baseGrams: number | null;
  micronutrients: Record<string, number>;
  steps: string[];
  ingredients: {
    id: string;
    name: string;
    grams: number;
    nutrition?: Nutrients & { micronutrients?: Record<string, number> };
  }[];
  planId?: string;
  recipeId?: string;
  owned: boolean;
};
export type Entry = Nutrients & {
  id: string;
  date: string;
  slot: Slot;
  quantity: number;
  unit: "serving" | "grams" | "ml";
  revision: number;
  snapshot: FoodItem | null;
  manualName: string | null;
};
export const slots = ["breakfast", "lunch", "dinner", "snacks"] as const;
export type Slot = (typeof slots)[number];
export type Permissions = Record<
  "search" | "barcode" | "photoLog" | "calculator" | "personalPlans",
  boolean
>;
export type Diary = {
  date: string;
  loggedDays: string[];
  entries: Entry[];
  yesterdayEntries: Entry[];
  target: Nutrients | null;
  total: Nutrients;
  permissions: Permissions;
};
export type PublishedPlan = {
  id: string;
  document: {
    settings: {
      name: string;
      description: string;
      calorieTarget: number;
      proteinPct: number;
      carbsPct: number;
      fatPct: number;
      coverImageUrl: string | null;
    };
    slots: {
      id: string;
      name: string;
      options: {
        id: string;
        name: string;
        imageUrl: string | null;
        nutrition: Nutrients;
        minutes?: number | null;
      }[];
    }[];
  };
};
export type ShoppingItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  note: string | null;
  checked: number;
  contributions: { name: string; amount: number }[];
};
export type PhotoMessage = {
  id: string;
  author: string;
  imageUrl: string | null;
  note: string | null;
  createdAt: string;
};
// Notify only completed, user-visible writes. Scans, calculations, checkboxes and
// favorites have their own immediate visual feedback and must not create toast noise.
function foodFeedback(method: string, path: string): ActionFeedback | null {
  if (path === "/entries" && method === "post")
    return { success: "Food logged", error: "Couldn't log your food. Try again." };
  if (path.startsWith("/entries/") && method === "patch")
    return { success: "Food entry updated", error: "Couldn't update this food entry. Try again." };
  if (path.startsWith("/entries/") && method === "delete")
    return { error: "Couldn't remove this food entry. Try again." };
  if (path === "/copy")
    return { success: "Food copied", error: "Couldn't copy your food. Try again." };
  if (/^\/(foods|recipes)(\/[^/]+)?$/.test(path)) {
    const noun = path.startsWith("/recipes") ? "Recipe" : "Food";
    return {
      success: `${noun} ${method === "delete" ? "deleted" : method === "post" ? "created" : "saved"}`,
      error: `Couldn't ${method === "delete" ? "delete" : "save"} this ${noun.toLowerCase()}. Try again.`,
    };
  }
  if (path === "/shopping/recipe")
    return {
      success: "Ingredients added to shopping list",
      error: "Couldn't update your shopping list. Try again.",
    };
  if (path === "/reports")
    return { success: "Report sent", error: "Couldn't send your report. Try again." };
  if (path === "/photos")
    return { success: "Photo logged", error: "Couldn't log your photo. Try again." };
  if (path === "/goals" || path.startsWith("/goals/"))
    return {
      success: method === "delete" ? "Nutrition target removed" : "Nutrition targets saved",
      error: "Couldn't update your nutrition targets. Try again.",
    };
  if (path.startsWith("/personal-plans"))
    return {
      success: method === "delete" ? "Meal plan deleted" : "Meal plan saved",
      error: "Couldn't update your meal plan. Try again.",
    };
  return null;
}
export function foodApi(studioId: string) {
  const base = `/c/${studioId}/food`;
  function write<T>(method: string, path: string, action: () => Promise<T>): Promise<T> {
    const feedback = foodFeedback(method, path);
    return feedback ? withActionFeedback(action, feedback) : action();
  }
  return {
    get: async <T>(path: string) => (await http.get<T>(base + path)).data,
    post: <T = unknown>(path: string, value: unknown) =>
      write("post", path, async () => (await http.post<T>(base + path, value)).data),
    put: <T = unknown>(path: string, value: unknown) =>
      write("put", path, async () => (await http.put<T>(base + path, value)).data),
    patch: (path: string, value: unknown) =>
      write("patch", path, async () => (await http.patch(base + path, value)).data),
    delete: (path: string) =>
      write("delete", path, async () => {
        await http.delete(base + path);
      }),
  };
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function offsetDay(date: string, days: number) {
  const next = new Date(date + "T12:00:00");
  next.setDate(next.getDate() + days);
  return localDay(next);
}
export async function uploadFoodImage(
  studioId: string,
  file: File,
  kind: "food" | "food-label" | "photo-log",
) {
  if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)
    throw new Error("Choose an image smaller than 10 MB.");
  const { data: ticket } = await http.post<{ url: string; fields: Record<string, string> }>(
    `/c/${studioId}/uploads/sign`,
    { kind },
  );
  const form = new FormData();
  for (const [key, value] of Object.entries(ticket.fields)) form.append(key, value);
  form.append("file", file);
  const response = await fetch(ticket.url, { method: "POST", body: form });
  if (!response.ok) throw new Error("Photo upload failed. Try again.");
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("secure_url" in result) ||
    typeof result.secure_url !== "string"
  )
    throw new Error("Photo upload failed.");
  return result.secure_url;
}
