import type { MealPlan, PlanDocument, PlanOption, PlanSettings } from "@traiv/nutrition/meal-plans";
import { http } from "./client";
export type { MealPlan, PlanDocument, PlanOption, PlanSettings };
export type PlanSummary = PlanSettings & {
  id: string;
  updatedAt: string;
  status: "draft" | "active";
  hasChanges: boolean;
};
export type MacroPreset = {
  id: string;
  name: string;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
};
const base = (studio: string) => `/studios/${studio}`;
export const mealPlansApi = {
  clientPlans: async (studio: string, clientId: string) =>
    (await http.get<MealPlan[]>(`${base(studio)}/clients/${clientId}/mealplans`)).data,
  liveTemplates: async (studio: string, search: string, page: number) =>
    (
      await http.get<{ items: (PlanSettings & { id: string })[]; total: number; page: number }>(
        `${base(studio)}/mealplan-templates/live`,
        { params: { search, page } },
      )
    ).data,
  createClient: async (
    studio: string,
    clientId: string,
    input: {
      id: string;
      document?: PlanDocument;
      templateId?: string;
      name?: string;
      targets?: Pick<PlanSettings, "calorieTarget" | "proteinPct" | "carbsPct" | "fatPct">;
    },
  ) => (await http.post<MealPlan>(`${base(studio)}/clients/${clientId}/mealplans`, input)).data,
  list: async (studio: string, search: string, page: number) =>
    (
      await http.get<{ items: PlanSummary[]; total: number; page: number }>(
        `${base(studio)}/mealplans`,
        { params: { search, page } },
      )
    ).data,
  get: async (studio: string, id: string) =>
    (await http.get<MealPlan>(`${base(studio)}/mealplans/${id}`)).data,
  create: async (studio: string, id: string, document: PlanDocument) =>
    (await http.post<MealPlan>(`${base(studio)}/mealplans`, { id, document })).data,
  save: async (
    studio: string,
    id: string,
    document: PlanDocument,
    expectedUpdatedAt: string,
    rebalance = false,
  ) =>
    (
      await http.put<MealPlan>(`${base(studio)}/mealplans/${id}`, {
        document,
        expectedUpdatedAt,
        rebalance,
      })
    ).data,
  publish: async (studio: string, id: string, expectedUpdatedAt: string) =>
    (await http.post<MealPlan>(`${base(studio)}/mealplans/${id}/publish`, { expectedUpdatedAt }))
      .data,
  discard: async (studio: string, id: string, expectedUpdatedAt: string) =>
    (await http.post<MealPlan>(`${base(studio)}/mealplans/${id}/discard`, { expectedUpdatedAt }))
      .data,
  duplicate: async (studio: string, id: string, copyId: string) =>
    (await http.post<MealPlan>(`${base(studio)}/mealplans/${id}/duplicate`, { id: copyId })).data,
  archive: async (studio: string, id: string, expectedUpdatedAt: string) =>
    (await http.post(`${base(studio)}/mealplans/${id}/archive`, { expectedUpdatedAt })).data,
  presets: async (studio: string) =>
    (await http.get<MacroPreset[]>(`${base(studio)}/mealplan-presets`)).data,
  savePreset: async (studio: string, preset: MacroPreset) =>
    (await http.post<MacroPreset[]>(`${base(studio)}/mealplan-presets`, preset)).data,
  option: async (studio: string, recipeId: string) =>
    (await http.get<PlanOption>(`${base(studio)}/mealplan-recipes/${recipeId}`)).data,
};
