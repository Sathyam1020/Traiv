"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveStudioId } from "@/lib/active-studio";
import { joinApi } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * All three are keyed and scoped by the studio this tab is showing, not by the session's
 * active studio — two tabs on different studios must not share a cache entry or write to
 * each other's studio.
 */
export function useJoinCode() {
  const studioId = useActiveStudioId();
  return useQuery({
    queryKey: queryKeys.join.code(studioId ?? ""),
    queryFn: () => joinApi.get(studioId as string),
    enabled: Boolean(studioId),
  });
}

export function useRotateJoinCode() {
  const qc = useQueryClient();
  const studioId = useActiveStudioId();
  return useMutation({
    mutationFn: () => joinApi.rotate(studioId as string),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.join.code(studioId ?? "") }),
  });
}

export function useSetJoinEnabled() {
  const qc = useQueryClient();
  const studioId = useActiveStudioId();
  return useMutation({
    mutationFn: (enabled: boolean) => joinApi.setEnabled(studioId as string, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.join.code(studioId ?? "") }),
  });
}
