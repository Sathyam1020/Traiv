"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExerciseWrite, TemplateInput } from "@/lib/api";
import { workoutApi } from "@/lib/api";
import { queryKeys } from "./keys";

/* -------------------------------------------------------------------------- */
/* The studio's template library                                               */
/* -------------------------------------------------------------------------- */

export function useTemplates(studioId: string | null, status?: "draft" | "active") {
  return useQuery({
    queryKey: queryKeys.workouts.list(studioId ?? "", status),
    queryFn: () => workoutApi.templates.list(studioId as string, status),
    enabled: Boolean(studioId),
  });
}

export function useTemplate(studioId: string | null, templateId: string | null) {
  return useQuery({
    queryKey: queryKeys.workouts.one(studioId ?? "", templateId ?? ""),
    queryFn: () => workoutApi.templates.get(studioId as string, templateId as string),
    enabled: Boolean(studioId && templateId),
    retry: false,
  });
}

export function useCreateTemplate(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateInput) => workoutApi.templates.create(studioId, input),
    onSuccess: (t) => {
      qc.setQueryData(queryKeys.workouts.one(studioId, t.id), t);
      qc.invalidateQueries({ queryKey: ["workouts", studioId] });
    },
  });
}

export function useSaveTemplate(studioId: string, templateId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateInput) => workoutApi.templates.update(studioId, templateId, input),
    onSuccess: (t) => {
      qc.setQueryData(queryKeys.workouts.one(studioId, templateId), t);
      qc.invalidateQueries({ queryKey: ["workouts", studioId] });
    },
  });
}

/** Publish, unpublish and archive all touch the same list, so they share one invalidation. */
export function useTemplateActions(studioId: string, templateId: string) {
  const qc = useQueryClient();
  const settle = (t: { id: string }) => {
    qc.setQueryData(queryKeys.workouts.one(studioId, t.id), t);
    qc.invalidateQueries({ queryKey: ["workouts", studioId] });
  };

  return {
    setStatus: useMutation({
      mutationFn: (status: "draft" | "active") =>
        workoutApi.templates.setStatus(studioId, templateId, status),
      onSuccess: settle,
    }),
    archive: useMutation({
      mutationFn: () => workoutApi.templates.archive(studioId, templateId),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts", studioId] }),
    }),
    duplicate: useMutation({
      mutationFn: () => workoutApi.templates.duplicate(studioId, templateId),
      onSuccess: (t) => {
        qc.setQueryData(queryKeys.workouts.one(studioId, t.id), t);
        qc.invalidateQueries({ queryKey: ["workouts", studioId] });
      },
    }),
  };
}

/* -------------------------------------------------------------------------- */
/* A client's own programmes                                                   */
/* -------------------------------------------------------------------------- */

export function useClientPrograms(studioId: string | null, clientId: string | null) {
  return useQuery({
    queryKey: queryKeys.workouts.client(studioId ?? "", clientId ?? ""),
    queryFn: () => workoutApi.client.list(studioId as string, clientId as string),
    enabled: Boolean(studioId && clientId),
  });
}

export function useCreateClientProgram(studioId: string, clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateInput) => workoutApi.client.create(studioId, clientId, input),
    onSuccess: (t) => {
      qc.setQueryData(queryKeys.workouts.one(studioId, t.id), t);
      qc.invalidateQueries({ queryKey: queryKeys.workouts.client(studioId, clientId) });
    },
  });
}

export function useSaveAsTemplate(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, templateId }: { clientId: string; templateId: string }) =>
      workoutApi.client.saveAsTemplate(studioId, clientId, templateId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts", studioId] }),
  });
}

export function useDuplicateFromTemplate(studioId: string, clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      templateId: string;
      name?: string;
      description?: string | null;
      imageUrl?: string | null;
    }) => workoutApi.client.fromTemplate(studioId, clientId, args.templateId, args),
    onSuccess: (t) => {
      qc.setQueryData(queryKeys.workouts.one(studioId, t.id), t);
      qc.invalidateQueries({ queryKey: queryKeys.workouts.client(studioId, clientId) });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Exercises                                                                   */
/* -------------------------------------------------------------------------- */

export function useExercises(
  studioId: string | null,
  opts: { q?: string; muscle?: string; equipment?: string; category?: string },
) {
  return useQuery({
    queryKey: queryKeys.workouts.exercises(studioId ?? "", opts),
    queryFn: () => workoutApi.exercises.list(studioId as string, opts),
    enabled: Boolean(studioId),
  });
}

export function useExercise(studioId: string | null, exerciseId: string | null) {
  return useQuery({
    queryKey: ["exercise", studioId, exerciseId],
    queryFn: () => workoutApi.exercises.get(studioId as string, exerciseId as string),
    enabled: Boolean(studioId && exerciseId),
  });
}

export function useExerciseActions(studioId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["exercises", studioId] });

  return {
    create: useMutation({
      mutationFn: (input: ExerciseWrite) => workoutApi.exercises.create(studioId, input),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: ExerciseWrite }) =>
        workoutApi.exercises.update(studioId, id, input),
      onSuccess: invalidate,
    }),
    delete: useMutation({
      mutationFn: (id: string) => workoutApi.exercises.delete(studioId, id),
      onSuccess: invalidate,
    }),
  };
}

/* -------------------------------------------------------------------------- */
/* Saved sections                                                              */
/* -------------------------------------------------------------------------- */

export function useSavedSections(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.workouts.savedSections(studioId ?? ""),
    queryFn: () => workoutApi.savedSections.list(studioId as string),
    enabled: Boolean(studioId),
  });
}

export function useSaveSectionForReuse(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, name }: { sessionId: string; name?: string }) =>
      workoutApi.savedSections.save(studioId, sessionId, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.workouts.savedSections(studioId) }),
  });
}
