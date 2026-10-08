import { http } from "./client";
import type {
  ClientMe,
  Coach,
  IntakePatch,
  IntakeState,
  JoinOutcome,
  JoinPreview,
  NutritionTarget,
} from "./types";

export const joinApi = {
  /** Public. Called before any form, so nobody signs up only to be refused after. */
  preview: async (code: string) => (await http.get<JoinPreview>(`/join/${code}`)).data,

  /** Needs a session. Attaches the signed-in user to the studio behind the code. */
  attach: async (code: string) => (await http.post<JoinOutcome>(`/join/${code}`)).data,
};

export const clientApi = {
  coaches: async () => (await http.get<{ coaches: Coach[] }>("/c")).data.coaches,

  me: async (studioId: string) => (await http.get<ClientMe>(`/c/${studioId}/me`)).data,

  intake: async (studioId: string) => (await http.get<IntakeState>(`/c/${studioId}/intake`)).data,

  /** Saves one step. The server answers with the whole state, so nothing drifts. */
  saveStep: async (studioId: string, step: number, patch: IntakePatch) =>
    (await http.patch<IntakeState>(`/c/${studioId}/intake`, { step, ...patch })).data,

  completeIntake: async (studioId: string) =>
    (
      await http.post<{ target: NutritionTarget | null; awaitingReview: boolean }>(
        `/c/${studioId}/intake/complete`,
      )
    ).data,
};
