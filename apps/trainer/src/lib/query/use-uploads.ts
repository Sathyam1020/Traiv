"use client";

import { useQuery } from "@tanstack/react-query";
import { uploadApi } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * Whether media uploads can work at all.
 *
 * Asked once and cached for the session: Cloudinary is either configured on the server
 * or it is not, and that does not change while somebody fills in a form. The New
 * Recipe/New Ingredient panels read this to hide the upload button rather than offering
 * one that 503s.
 */
export function useUploadsConfigured(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.uploads.configured(studioId ?? ""),
    queryFn: () => uploadApi.configured(studioId as string),
    enabled: Boolean(studioId),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
