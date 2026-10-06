"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endorseApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useEndorser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.endorser.me,
    queryFn: endorseApi.me,
    enabled,
    retry: false,
  });
}

export function useJoinProgramme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endorseApi.join,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.endorser.me }),
  });
}

/** Only asked for once you are an endorser; the API refuses otherwise. */
export function useReferrals(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.endorser.referrals,
    queryFn: endorseApi.referrals,
    enabled,
    retry: false,
  });
}
