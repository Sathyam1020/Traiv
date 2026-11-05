"use client";
import { useQuery } from "@tanstack/react-query";
import type { VaultResource } from "@traiv/ui/lib/vault";
import { http } from "@/lib/api/client";
export function useVault(studioId: string | null) {
  return useQuery({
    queryKey: ["client-vault", studioId],
    queryFn: async () => (await http.get<VaultResource[]>(`/c/${studioId}/vault`)).data,
    enabled: Boolean(studioId),
    refetchInterval: 30_000,
  });
}
