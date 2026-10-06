"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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
