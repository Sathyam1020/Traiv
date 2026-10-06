"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
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
