"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { joinApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useJoinCode() {
  return useQuery({ queryKey: queryKeys.join.code, queryFn: joinApi.get });
}

export function useRotateJoinCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: joinApi.rotate,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.join.code }),
  });
}

export function useSetJoinEnabled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: joinApi.setEnabled,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.join.code }),
  });
}
