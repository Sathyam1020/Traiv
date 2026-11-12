"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, type FunnelInput, productAnalyticsApi } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * `retry: false` because 403 is the answer for everyone who is not the admin, and
 * retrying it just delays telling them.
 */
export function useStats(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: adminApi.stats,
    enabled,
    retry: false,
  });
}

/** Rolls up once an hour server-side — no reason for a tab to poll faster than that. */
export function useProductOverview(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.productOverview,
    queryFn: productAnalyticsApi.overview,
    enabled,
    retry: false,
    staleTime: 60_000,
  });
}

export function useAcquisition(days: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.acquisition(days),
    queryFn: () => productAnalyticsApi.acquisition(days),
    enabled,
    retry: false,
  });
}

export function useProductUsage(days: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.productUsage(days),
    queryFn: () => productAnalyticsApi.productUsage(days),
    enabled,
    retry: false,
  });
}

export function useEngagement(days: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.engagement(days),
    queryFn: () => productAnalyticsApi.engagement(days),
    enabled,
    retry: false,
  });
}

export function useFunnelList(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.funnels,
    queryFn: productAnalyticsApi.funnels,
    enabled,
    retry: false,
  });
}

export function useFunnel(id: string | null, days: number) {
  return useQuery({
    queryKey: queryKeys.admin.funnel(id ?? "", days),
    queryFn: () => productAnalyticsApi.funnel(id as string, days),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useRetention(
  weeks: number,
  cohortFilter: "all" | "narrow" | "broad" | "client",
  enabled: boolean,
) {
  return useQuery({
    queryKey: queryKeys.admin.retention(weeks, cohortFilter),
    queryFn: () => productAnalyticsApi.retention(weeks, cohortFilter),
    enabled,
    retry: false,
  });
}

export function useStudios(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.studios,
    queryFn: productAnalyticsApi.studios,
    enabled,
    retry: false,
  });
}

export function useStudio(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.studio(id ?? ""),
    queryFn: () => productAnalyticsApi.studio(id as string),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useSystemHealth(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.systemHealth,
    queryFn: productAnalyticsApi.systemHealth,
    enabled,
    retry: false,
    refetchInterval: 60_000,
  });
}

export function useDataQuality(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.dataQuality,
    queryFn: productAnalyticsApi.dataQuality,
    enabled,
    retry: false,
  });
}

/** The funnel builder's step picker — the server-side event catalog, never a second
 *  hardcoded list in the frontend. */
export function useEventNames(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.eventNames,
    queryFn: productAnalyticsApi.eventNames,
    enabled,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY, // the catalog only changes on a deploy
  });
}

export function useSaveFunnel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string | null; input: FunnelInput }) =>
      id ? productAnalyticsApi.updateFunnel(id, input) : productAnalyticsApi.createFunnel(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.admin.funnels }),
  });
}

export function useDeleteFunnel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productAnalyticsApi.deleteFunnel(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.admin.funnels }),
  });
}

export function useReferrals(days: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.referrals(days),
    queryFn: () => productAnalyticsApi.referrals(days),
    enabled,
    retry: false,
  });
}
