"use client";

import { useQueryClient } from "@tanstack/react-query";
import { workoutApi } from "@/lib/api";
import { queryKeys } from "./keys";

/** Read-only, intent-driven prefetch; no workout is started or mutated here. */
export function useWorkoutPrefetch(studioId: string | null) {
  const qc = useQueryClient();
  return {
    program(templateId: string) {
      if (!studioId) return;
      void qc.prefetchQuery({
        queryKey: queryKeys.client.workout(studioId, templateId),
        queryFn: () => workoutApi.get(studioId, templateId),
        staleTime: 60_000,
        retry: false,
      });
    },
    session(templateId: string, sessionId: string) {
      if (!studioId) return;
      void qc.prefetchQuery({
        queryKey: queryKeys.client.workoutSession(studioId, templateId, sessionId),
        queryFn: () => workoutApi.getSession(studioId, templateId, sessionId),
        staleTime: 60_000,
        retry: false,
      });
    },
    exercise(exerciseId: string) {
      if (!studioId) return;
      void qc.prefetchQuery({
        queryKey: queryKeys.client.exercise(studioId, exerciseId),
        queryFn: () => workoutApi.getExercise(studioId, exerciseId),
        staleTime: 60_000,
        retry: false,
      });
    },
  };
}
