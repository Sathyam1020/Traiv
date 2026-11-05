"use client";

import {
  CATALOG_CACHE_VERSION,
  completeFilterOptions,
  mergeExercisePages,
  normalizeFilters,
} from "@traiv/exercises";


import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearExerciseCatalogCache, deviceCached } from "@traiv/ui/lib/device-cache";
import { useEffect, useState } from "react";
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
    meta: {
      feedback: {
        error: "Couldn't create the template. Try again.",
        success: "Workout template created",
      },
    },
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
    meta: {
      feedback: { error: "Couldn't save the workout. Try again.", success: "Workout saved" },
    },
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
      meta: {
        feedback: {
          success: "Workout status updated",
          error: "Couldn't complete this action. Try again.",
        },
      },
      mutationFn: (status: "draft" | "active") =>
        workoutApi.templates.setStatus(studioId, templateId, status),
      onSuccess: settle,
    }),
    archive: useMutation({
      meta: {
        feedback: {
          success: "Workout archived",
          error: "Couldn't complete this action. Try again.",
        },
      },
      mutationFn: () => workoutApi.templates.archive(studioId, templateId),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts", studioId] }),
    }),
    duplicate: useMutation({
      meta: {
        feedback: {
          success: "Workout duplicated",
          error: "Couldn't complete this action. Try again.",
        },
      },
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
    meta: {
      feedback: {
        error: "Couldn't add the workout plan. Try again.",
        success: "Workout plan added to client",
      },
    },
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
    meta: {
      feedback: { error: "Couldn't save this template. Try again.", success: "Saved to templates" },
    },
    mutationFn: ({ clientId, templateId }: { clientId: string; templateId: string }) =>
      workoutApi.client.saveAsTemplate(studioId, clientId, templateId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts", studioId] }),
  });
}

export function useDuplicateFromTemplate(studioId: string, clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    meta: {
      feedback: {
        error: "Couldn't copy the workout plan. Try again.",
        success: "Workout plan copied",
      },
    },
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
  const normalized = normalizeFilters(opts);
  const [term, setTerm] = useState(normalized.q);
  useEffect(() => {
    const timer = setTimeout(() => setTerm(normalized.q), 300);
    return () => clearTimeout(timer);
  }, [normalized.q]);
  const filters = { ...normalized, q: term };
  const debouncing = normalized.q !== term;
  const references = useQuery({
    queryKey: ["exercise-filters", studioId, CATALOG_CACHE_VERSION],
    queryFn: ({ signal }) =>
      deviceCached(`filters:${studioId}:${CATALOG_CACHE_VERSION}`, () =>
        workoutApi.exercises.filters(studioId as string, signal),
      ),
    enabled: Boolean(studioId),
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
  const query = useInfiniteQuery({
    queryKey: queryKeys.workouts.exercises(studioId ?? "", {
      ...filters,
      version: CATALOG_CACHE_VERSION,
    }),
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      deviceCached(
        `catalog:${studioId}:${CATALOG_CACHE_VERSION}:${JSON.stringify({ ...filters, offset: pageParam })}`,
        () =>
          workoutApi.exercises.list(studioId as string, { ...filters, offset: pageParam }, signal),
        (page) => !page.providerError,
      ),
    getNextPageParam: (page) =>
      page.hasMore && page.nextOffset !== null ? page.nextOffset : undefined,
    enabled: Boolean(studioId) && !debouncing,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
  const studioEdits = useQuery({
    queryKey: ["exercise-studio-data", studioId],
    queryFn: () => workoutApi.exercises.local(studioId as string),
    enabled: Boolean(studioId),
    staleTime: 0,
    refetchInterval: 15000,
    retry: false,
  });
  const pages = query.data?.pages ?? [];
  const edits =
    studioEdits.data ?? pages.flatMap((page) => page.exercises.filter((row) => !row.shared));
  const data =
    query.data && !debouncing
      ? mergeExercisePages(pages, edits, filters, references.data)
      : undefined;
  const options = completeFilterOptions(references.data, edits, normalized);
  return {
    ...query,
    data,
    isPending: query.isPending || debouncing,
    isError: query.isError && !debouncing,
    isSearching: debouncing || query.isFetching,
    hasNextPage: !debouncing && query.hasNextPage,
    filterKey: JSON.stringify({ studioId, ...normalized }),
    filterOptions: options,
    filtersReady: Boolean(references.data),
    filterError: references.isError ? "Couldn't load the full filter options." : null,
    retryFilters: references.refetch,
    limitReached: !debouncing && Boolean(pages.at(-1)?.limitReached),
    providerTotal: pages[0]?.total ?? null,
    providerError: pages.find((page) => page.providerError)?.providerError,
    studioError: studioEdits.isError ? "Couldn't refresh studio exercises." : null,
    retryStudio: studioEdits.refetch,
    async fetchNextPage() {
      const result = await query.fetchNextPage();
      return {
        ...result,
        visibleCount: result.data
          ? mergeExercisePages(result.data.pages, edits, filters, references.data).length
          : 0,
      };
    },
  };
}

export function useExercise(studioId: string | null, exerciseId: string | null) {
  return useQuery({
    queryKey: ["exercise", studioId, exerciseId],
    queryFn: async () => {
      const local = await workoutApi.exercises.local(studioId as string);
      const edited = local.find((e) => e.id === exerciseId);
      if (edited) return edited;
      return exerciseId?.startsWith("exa:")
        ? deviceCached(`detail:${studioId}:${exerciseId}`, () =>
            workoutApi.exercises.get(studioId as string, exerciseId),
          )
        : workoutApi.exercises.get(studioId as string, exerciseId as string);
    },
    staleTime: 0,
    retry: false,
    enabled: Boolean(studioId && exerciseId),
  });
}

export function useExerciseActions(studioId: string) {
  const qc = useQueryClient();
  const invalidate = () => {
    clearExerciseCatalogCache(studioId);
    return Promise.all([
      qc.invalidateQueries({ queryKey: ["exercises", studioId] }),
      qc.invalidateQueries({ queryKey: ["exercise-studio-data", studioId] }),
      qc.invalidateQueries({ queryKey: ["exercise", studioId] }),
      qc.invalidateQueries({ queryKey: ["workout", studioId] }),
      qc.invalidateQueries({ queryKey: ["client-workouts", studioId] }),
    ]);
  };

  return {
    create: useMutation({
      meta: {
        feedback: {
          success: "Exercise created",
          error: "Couldn't complete this action. Try again.",
        },
      },
      mutationFn: (input: ExerciseWrite) => workoutApi.exercises.create(studioId, input),
      onSuccess: invalidate,
    }),
    update: useMutation({
      meta: {
        feedback: {
          success: "Exercise updated",
          error: "Couldn't complete this action. Try again.",
        },
      },
      mutationFn: ({ id, input }: { id: string; input: ExerciseWrite }) =>
        workoutApi.exercises.update(studioId, id, input),
      onSuccess: invalidate,
    }),
    delete: useMutation({
      meta: {
        feedback: {
          success: "Exercise deleted",
          error: "Couldn't complete this action. Try again.",
        },
      },
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
    meta: {
      feedback: { error: "Couldn't save this section. Try again.", success: "Section saved" },
    },
    mutationFn: ({ sessionId, name }: { sessionId: string; name?: string }) =>
      workoutApi.savedSections.save(studioId, sessionId, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.workouts.savedSections(studioId) }),
  });
}
