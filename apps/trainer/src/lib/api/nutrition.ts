import { http } from "./client";

export type Nutrients = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  micronutrients: Record<string, number>;
};
export type IngredientWrite = Nutrients & {
  id?: string;
  name: string;
  category: string | null;
  country: string | null;
  dietaryTags: string[];
  allergenTags: string[];
  nutrientType?: "protein" | "carbs" | "fat" | "mixed" | "condiment" | "spice" | null;
  defaultUnit: string | null;
  gramsPerUnit: number | null;
  imageUrl: string | null;
};
export type Ingredient = IngredientWrite & {
  id: string;
  studioId: string | null;
  deletedAt: string | null;
};
export type RecipeLine = {
  ingredientId: string;
  quantity: number;
  unit: string;
  preparationNote?: string | null;
  minimumUnitAmount?: "whole" | "halves" | "quarters" | "all";
};
export type RecipeWrite = {
  id?: string;
  name: string;
  servings: number;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  videoLinkUrl: string | null;
  mealTypes: string[];
  dietaryTags: string[];
  allergenTags: string[];
  difficulty: string;
  prepMinutes: number | null;
  cookMinutes: number | null;
  ingredients: RecipeLine[];
  steps: string[];
  expectedUpdatedAt?: string;
};
export type Recipe = Omit<RecipeWrite, "ingredients"> & {
  id: string;
  studioId: string | null;
  updatedAt: string;
  nutrition: Nutrients;
  ingredients: (RecipeLine & { ingredient: Ingredient; grams: number })[];
};
export type LibraryOptions = {
  search?: string;
  category?: string;
  country?: string;
  tags?: string;
  mealType?: string;
  type?: string;
  sort?: string;
  page?: number;
  perPage?: number;
};
export type LibraryPage<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  categories?: string[];
  countries?: string[];
};
const base = (studioId: string) => `/studios/${studioId}`;
export const nutritionApi = {
  ingredients: {
    list: async (s: string, params: LibraryOptions) =>
      (await http.get<LibraryPage<Ingredient>>(`${base(s)}/ingredients`, { params })).data,
    get: async (s: string, id: string) =>
      (await http.get<Ingredient>(`${base(s)}/ingredients/${id}`)).data,
    create: async (s: string, data: IngredientWrite) =>
      (await http.post<Ingredient>(`${base(s)}/ingredients`, data)).data,
    update: async (s: string, id: string, data: IngredientWrite) =>
      (await http.patch<Ingredient>(`${base(s)}/ingredients/${id}`, data)).data,
    delete: async (s: string, id: string) =>
      (await http.delete(`${base(s)}/ingredients/${id}`)).data,
  },
  recipes: {
    list: async (s: string, params: LibraryOptions) =>
      (await http.get<LibraryPage<Recipe>>(`${base(s)}/recipes`, { params })).data,
    get: async (s: string, id: string) => (await http.get<Recipe>(`${base(s)}/recipes/${id}`)).data,
    create: async (s: string, data: RecipeWrite) =>
      (await http.post<Recipe>(`${base(s)}/recipes`, data)).data,
    update: async (s: string, id: string, data: RecipeWrite) =>
      (await http.patch<Recipe>(`${base(s)}/recipes/${id}`, data)).data,
    duplicate: async (s: string, id: string, copyId: string) =>
      (await http.post<Recipe>(`${base(s)}/recipes/${id}/duplicate`, { id: copyId })).data,
    delete: async (s: string, id: string) => (await http.delete(`${base(s)}/recipes/${id}`)).data,
  },
};
