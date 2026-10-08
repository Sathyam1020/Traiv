"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketingApi, type PostInput } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * Everything the admin reads and writes about the marketing site.
 *
 * `retry: false` throughout, for the same reason as the stats query: 403 is the correct
 * answer for every account that is not the one named by `ADMIN_PHONE`, and retrying it
 * three times only delays telling the person.
 */

export function useAnalytics(days: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.analytics(days),
    queryFn: () => marketingApi.analytics(days),
    enabled,
    retry: false,
    // Visitor numbers do not need to be live. Thirty seconds stops a tab-switch
    // refetching a nine-aggregate query every time.
    staleTime: 30_000,
  });
}

export function useWaitlist(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.waitlist,
    queryFn: marketingApi.waitlist,
    enabled,
    retry: false,
  });
}

export function usePosts(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.posts,
    queryFn: marketingApi.posts,
    enabled,
    retry: false,
  });
}

export function usePost(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.post(id ?? ""),
    queryFn: () => marketingApi.post(id as string),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useSavePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string | null; input: PostInput }) =>
      id ? marketingApi.updatePost(id, input) : marketingApi.createPost(input),
    onSuccess: (post) => {
      // Both the list and the single post, because the editor stays open after a save
      // and would otherwise show the version it sent rather than the one stored.
      void qc.invalidateQueries({ queryKey: queryKeys.admin.posts });
      void qc.invalidateQueries({ queryKey: queryKeys.admin.post(post.id) });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketingApi.deletePost(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.admin.posts }),
  });
}
