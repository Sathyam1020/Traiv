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
export function foodApi(studioId: string) {
  const base = `/c/${studioId}/food`;
  return {
    get: async <T>(path: string) => (await http.get<T>(base + path)).data,
    post: async <T = unknown>(path: string, value: unknown) =>
      (await http.post<T>(base + path, value)).data,
    put: async <T = unknown>(path: string, value: unknown) =>
      (await http.put<T>(base + path, value)).data,
    patch: async (path: string, value: unknown) => (await http.patch(base + path, value)).data,
    delete: async (path: string) => {
      await http.delete(base + path);
    },
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
