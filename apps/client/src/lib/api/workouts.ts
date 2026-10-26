import { http } from "./client";
import type {
  ExerciseDetail,
  ProgramDetail,
  SessionDetail,
  SetLog,
  TrainingSession,
  WorkoutListItem,
} from "./types";

/**
 * The client's own workouts — ADR 0024. Every programme here is already this client's
 * own copy; there is no "studio library" to read from this side.
 */
export const workoutApi = {
  list: async (studioId: string) =>
    (await http.get<{ templates: WorkoutListItem[] }>(`/c/${studioId}/workouts`)).data.templates,

  get: async (studioId: string, templateId: string) =>
    (await http.get<ProgramDetail>(`/c/${studioId}/workouts/${templateId}`)).data,

  getSession: async (studioId: string, templateId: string, sessionId: string) =>
    (await http.get<SessionDetail>(`/c/${studioId}/workouts/${templateId}/sessions/${sessionId}`))
      .data,

  /** Idempotent: starting an already-open session hands back the same one. */
  startSession: async (studioId: string, templateId: string, sessionId: string) =>
    (
      await http.post<{ session: { id: string; startedAt: string; sets: SetLog[] } }>(
        `/c/${studioId}/workouts/${templateId}/sessions/${sessionId}/start`,
        {},
      )
    ).data.session,

  logSet: async (
    studioId: string,
    trainingSessionId: string,
    input: {
      sessionExerciseId: string;
      setNumber: number;
      reps: number | null;
      loadKg: number | null;
      completed: boolean;
    },
  ) =>
    (
      await http.put<{ sets: SetLog[] }>(
        `/c/${studioId}/training-sessions/${trainingSessionId}/sets`,
        input,
      )
    ).data.sets,

  /** Swiped away. Only removes a set that was actually logged server-side. */
  deleteSet: async (
    studioId: string,
    trainingSessionId: string,
    sessionExerciseId: string,
    setNumber: number,
  ) =>
    (
      await http.delete<{ sets: SetLog[] }>(
        `/c/${studioId}/training-sessions/${trainingSessionId}/sets/${sessionExerciseId}/${setNumber}`,
      )
    ).data.sets,

  /** "Cancel Workout" — discards the session entirely, not a pause. */
  cancelSession: async (studioId: string, trainingSessionId: string) => {
    await http.delete(`/c/${studioId}/training-sessions/${trainingSessionId}`);
  },

  finish: async (
    studioId: string,
    trainingSessionId: string,
    input: {
      quality?: number | null;
      intensity?: number | null;
      note?: string | null;
      totalSeconds?: number;
    },
  ) =>
    (
      await http.post<{ session: TrainingSession }>(
        `/c/${studioId}/training-sessions/${trainingSessionId}/finish`,
        input,
      )
    ).data.session,

  getExercise: async (studioId: string, exerciseId: string) =>
    (await http.get<ExerciseDetail>(`/c/${studioId}/exercises/${exerciseId}`)).data,
};
