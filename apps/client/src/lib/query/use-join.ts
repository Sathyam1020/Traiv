"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IntakePatch } from "@/lib/api";
import { clientApi, joinApi } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * Public, and deliberately fetched before any form is shown — nobody should sign up and
 * only then be told the link is dead. `retry: false` because an invalid code is an
 * answer, not a flake.
 */
export function useJoinPreview(code: string | null) {
  return useQuery({
    queryKey: queryKeys.join.preview(code ?? ""),
    queryFn: () => joinApi.preview(code as string),
    enabled: Boolean(code),
    retry: false,
    staleTime: 60_000,
  });
}

export function useAttach() {
  return useMutation({ mutationFn: (code: string) => joinApi.attach(code) });
}

export function useClientMe(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.me(studioId ?? ""),
    queryFn: () => clientApi.me(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
  });
}

/**
 * The client's coaches. `retry: false` because 401 is an answer — a signed-out visitor is
 * the normal case on this app, not a failure worth retrying.
 */
export function useCoaches(enabled = true) {
  return useQuery({
    queryKey: queryKeys.client.coaches,
    queryFn: clientApi.coaches,
    enabled,
    retry: false,
  });
}

/**
 * The client's own answers.
 *
 * `retry: false` for the same reason as the rest of this file — a 403 from a paused
 * relationship is an answer, not a flake worth asking three more times.
 */
export function useIntake(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.client.intake(studioId ?? ""),
    queryFn: () => clientApi.intake(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
  });
}

export function useSaveStep(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ step, patch }: { step: number; patch: IntakePatch }) =>
      clientApi.saveStep(studioId, step, patch),
    // The server returns the whole state, so write it straight into the cache rather than
    // refetching — one round trip per step is enough on a basement-gym connection.
    onSuccess: (state) => qc.setQueryData(queryKeys.client.intake(studioId), state),
  });
}

export function useCompleteIntake(studioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clientApi.completeIntake(studioId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.client.intake(studioId) }),
  });
}
