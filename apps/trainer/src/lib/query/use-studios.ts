"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studiosApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useStudios() {
  return useQuery({ queryKey: queryKeys.studios.list, queryFn: studiosApi.list });
}

export function useRenameStudio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => studiosApi.rename(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.studios.list }),
  });
}

export function useSwitchStudio() {
  return useMutation({
    mutationFn: studiosApi.activate,
    // Every query on the page is studio-scoped, so a reload is both correct and simpler
    // than invalidating each one and hoping nothing was missed.
    onSuccess: () => window.location.reload(),
  });
}
