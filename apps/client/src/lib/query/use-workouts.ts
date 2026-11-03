"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type SessionDetail, workoutApi } from "@/lib/api";
import { queryKeys } from "./keys";

/** Same `retry: false` as every other client query — see `use-coaching.ts`. */

export function useWorkouts(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.workouts(studioId ?? ""),
    queryFn: () => workoutApi.list(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
  });
}

export function useWorkout(studioId: string | null, templateId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.workout(studioId ?? "", templateId ?? ""),
    queryFn: () => workoutApi.get(studioId as string, templateId as string),
    enabled: Boolean(studioId && templateId),
    retry: false,
  });
}

/**
 * One session: the exercises to show and, in `live`, the training session already in
 * progress if there is one — what lets the active screen resume instead of starting
 * over, and what lets the preview screen offer "Resume" instead of "Start".
 */
export function useWorkoutSession(
  studioId: string | null,
  templateId: string | null,
  sessionId: string | null,
) {
  return useQuery({
    queryKey: queryKeys.client.workoutSession(studioId ?? "", templateId ?? "", sessionId ?? ""),
    queryFn: () =>
      workoutApi.getSession(studioId as string, templateId as string, sessionId as string),
    enabled: Boolean(studioId && templateId && sessionId),
    retry: false,
  });
}

export function useStartSession(studioId: string, templateId: string, sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: { feedback: { error: "Couldn't start your workout. Try again." } },
    mutationFn: () => workoutApi.startSession(studioId, templateId, sessionId),
    onSuccess: (live) => {
      // The start response is authoritative; don't wait for an identical GET before navigation.
      qc.setQueryData<SessionDetail>(
        queryKeys.client.workoutSession(studioId, templateId, sessionId),
        (previous) => (previous ? { ...previous, live } : previous),
      );
    },
  });
}

/**
 * Logging and deleting a set don't invalidate anything — the active-session screen
 * applies the returned `sets` straight to its own local state, the same reason the
 * trainer builder applies a save response directly rather than refetching: a round
 * trip just to redraw what the response already said would be a visible flash.
 */
export function useLogSet(studioId: string, trainingSessionId: string) {
  return useMutation({
    mutationFn: (input: {
      sessionExerciseId: string;
      setNumber: number;
      reps: number | null;
      loadKg: number | null;
      completed: boolean;
    }) => workoutApi.logSet(studioId, trainingSessionId, input),
  });
}

export function useDeleteSet(studioId: string, trainingSessionId: string) {
  return useMutation({
    mutationFn: ({
      sessionExerciseId,
      setNumber,
    }: {
      sessionExerciseId: string;
      setNumber: number;
    }) => workoutApi.deleteSet(studioId, trainingSessionId, sessionExerciseId, setNumber),
  });
}

export function useCancelSession(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: {
      feedback: { error: "Couldn't cancel your workout. Try again.", success: "Workout cancelled" },
    },
    mutationFn: (trainingSessionId: string) =>
      workoutApi.cancelSession(studioId, trainingSessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.client.workouts(studioId) }),
  });
}

/**
 * Finish.
 *
 * Three caches go stale: the list (a freshly-completed session can change what a
 * program's "last trained" implies later), Today (first-ever finish flips
 * `client.activated_at` and adds a row to `recentSessions`), and this session's own
 * detail (so a resumed view, if any, reflects it's done).
 */
export function useFinishSession(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      trainingSessionId,
      ...input
    }: {
      trainingSessionId: string;
      quality?: number | null;
      intensity?: number | null;
      note?: string | null;
      totalSeconds?: number;
    }) => workoutApi.finish(studioId, trainingSessionId, input),
    onSuccess: (finished) => {
      // Remove the finished live session so Back cannot offer to resume it from cache.
      qc.setQueriesData<SessionDetail>(
        { queryKey: ["client", "workout-session", studioId] },
        (previous) => (previous?.live?.id === finished.id ? { ...previous, live: null } : previous),
      );
      void qc.invalidateQueries({ queryKey: queryKeys.client.workouts(studioId) });
      void qc.invalidateQueries({ queryKey: ["client", "workout", studioId] });
      void qc.invalidateQueries({ queryKey: queryKeys.client.today(studioId) });
    },
  });
}

export function useExercise(studioId: string | null, exerciseId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.exercise(studioId ?? "", exerciseId ?? ""),
    queryFn: () => workoutApi.getExercise(studioId as string, exerciseId as string),
    enabled: Boolean(studioId && exerciseId),
    retry: false,
  });
}
