"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type IngredientWrite,
  type LibraryOptions,
  nutritionApi,
  type RecipeWrite,
} from "@/lib/api/nutrition";
export function useIngredients(studioId: string, opts: LibraryOptions) {
  return useQuery({
    queryKey: ["nutrition", studioId, "ingredients", opts],
    queryFn: () => nutritionApi.ingredients.list(studioId, opts),
    enabled: Boolean(studioId),
  });
}
export function useRecipes(studioId: string, opts: LibraryOptions) {
  return useQuery({
    queryKey: ["nutrition", studioId, "recipes", opts],
    queryFn: () => nutritionApi.recipes.list(studioId, opts),
    enabled: Boolean(studioId),
  });
}
export function useRecipe(studioId: string, id: string) {
  return useQuery({
    queryKey: ["nutrition", studioId, "recipe", id],
    queryFn: () => nutritionApi.recipes.get(studioId, id),
    enabled: Boolean(studioId && id),
  });
}
export function useNutritionActions(studioId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["nutrition", studioId] });
  return {
    saveIngredient: useMutation({
      mutationFn: ({ id, input }: { id?: string; input: IngredientWrite }) =>
        id
          ? nutritionApi.ingredients.update(studioId, id, input)
          : nutritionApi.ingredients.create(studioId, input),
      onSuccess: invalidate,
    }),
    deleteIngredient: useMutation({
      mutationFn: (id: string) => nutritionApi.ingredients.delete(studioId, id),
      onSuccess: invalidate,
    }),
    saveRecipe: useMutation({
      mutationFn: ({ id, input }: { id?: string; input: RecipeWrite }) =>
        id
          ? nutritionApi.recipes.update(studioId, id, input)
          : nutritionApi.recipes.create(studioId, input),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["nutrition", studioId, "recipes"] }),
    }),
    duplicateRecipe: useMutation({
      mutationFn: ({ id, copyId }: { id: string; copyId: string }) =>
        nutritionApi.recipes.duplicate(studioId, id, copyId),
      onSuccess: invalidate,
    }),
    deleteRecipe: useMutation({
      mutationFn: (id: string) => nutritionApi.recipes.delete(studioId, id),
      onSuccess: invalidate,
    }),
  };
}
