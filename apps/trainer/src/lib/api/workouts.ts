import { http } from "./client";
import type {
  ClientProgramSummary,
  Exercise,
  ExerciseWrite,
  SavedSection,
  TemplateInput,
  TemplateSummary,
  WorkoutTemplate,
} from "./types";

/**
 * Workouts — the coach's library, and a client's own copies. ADR 0024.
 *
 * Every path carries the studio id (ADR 0014). A template belongs to the studio until
 * `clientId` is set, at which point it is one client's own programme — a copy, not a
 * shared row, which is why there is no assign/unassign here.
 */
export const workoutApi = {
  templates: {
    list: async (studioId: string, status?: "draft" | "active") =>
      (
        await http.get<{ templates: TemplateSummary[] }>(`/studios/${studioId}/workout-templates`, {
          params: status ? { status } : undefined,
        })
      ).data.templates,

    get: async (studioId: string, templateId: string) =>
      (
        await http.get<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/workout-templates/${templateId}`,
        )
      ).data.template,

    create: async (studioId: string, input: TemplateInput) =>
      (
        await http.post<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/workout-templates`,
          input,
        )
      ).data.template,

    update: async (studioId: string, templateId: string, input: TemplateInput) =>
      (
        await http.patch<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/workout-templates/${templateId}`,
          input,
        )
      ).data.template,

    archive: async (studioId: string, templateId: string) => {
      await http.delete(`/studios/${studioId}/workout-templates/${templateId}`);
    },

    setStatus: async (studioId: string, templateId: string, status: "draft" | "active") =>
      (
        await http.patch<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/workout-templates/${templateId}/status`,
          { status },
        )
      ).data.template,

    duplicate: async (studioId: string, templateId: string) =>
      (
        await http.post<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/workout-templates/${templateId}/duplicate`,
          {},
        )
      ).data.template,
  },

  client: {
    list: async (studioId: string, clientId: string) =>
      (
        await http.get<{ templates: ClientProgramSummary[] }>(
          `/studios/${studioId}/clients/${clientId}/workouts`,
        )
      ).data.templates,

    /** "Create new program" — written for this client directly. */
    create: async (studioId: string, clientId: string, input: TemplateInput) =>
      (
        await http.post<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/clients/${clientId}/workouts`,
          input,
        )
      ).data.template,

    /** The reverse of duplicate-from-template: a client's own programme becomes a
     *  reusable studio template, their copy left untouched. */
    saveAsTemplate: async (studioId: string, clientId: string, templateId: string) =>
      (
        await http.post<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/clients/${clientId}/workouts/${templateId}/save-as-template`,
          {},
        )
      ).data.template,

    /** "Duplicate from Template" → "Customize Template" → "Select Template". */
    fromTemplate: async (
      studioId: string,
      clientId: string,
      templateId: string,
      overrides: { name?: string; description?: string | null; imageUrl?: string | null } = {},
    ) =>
      (
        await http.post<{ template: WorkoutTemplate }>(
          `/studios/${studioId}/clients/${clientId}/workouts/from-template`,
          { templateId, ...overrides },
        )
      ).data.template,
  },

  exercises: {
    list: async (
      studioId: string,
      opts: { q?: string; muscle?: string; equipment?: string; category?: string } = {},
    ) =>
      (
        await http.get<{ exercises: Exercise[] }>(`/studios/${studioId}/exercises`, {
          params: opts,
        })
      ).data.exercises,

    get: async (studioId: string, exerciseId: string) =>
      (await http.get<{ exercise: Exercise }>(`/studios/${studioId}/exercises/${exerciseId}`)).data
        .exercise,

    create: async (studioId: string, input: ExerciseWrite) =>
      (await http.post<{ exercise: Exercise }>(`/studios/${studioId}/exercises`, input)).data
        .exercise,

    update: async (studioId: string, exerciseId: string, input: ExerciseWrite) =>
      (
        await http.patch<{ exercise: Exercise }>(
          `/studios/${studioId}/exercises/${exerciseId}`,
          input,
        )
      ).data.exercise,

    delete: async (studioId: string, exerciseId: string) => {
      await http.delete(`/studios/${studioId}/exercises/${exerciseId}`);
    },
  },

  savedSections: {
    list: async (studioId: string) =>
      (await http.get<{ sections: SavedSection[] }>(`/studios/${studioId}/workout-sections/saved`))
        .data.sections,

    save: async (studioId: string, sessionId: string, name?: string) =>
      (
        await http.post<{ section: SavedSection }>(
          `/studios/${studioId}/workout-sessions/${sessionId}/save-for-reuse`,
          { name },
        )
      ).data.section,

    delete: async (studioId: string, savedId: string) => {
      await http.delete(`/studios/${studioId}/workout-sections/saved/${savedId}`);
    },
  },
};
