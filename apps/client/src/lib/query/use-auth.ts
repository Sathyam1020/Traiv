"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { unregisterPush } from "@/lib/push";
import { queryKeys } from "./keys";
import { idbPersister } from "./persist";

export function useAuthConfig() {
  return useQuery({
    queryKey: queryKeys.auth.config,
    queryFn: authApi.config,
    staleTime: Number.POSITIVE_INFINITY, // fixed for the life of the deployment
  });
}

/**
 * `retry: false` matters here: a signed-out visitor is the normal case on this app, and
 * 401 is an answer rather than a failure to retry.
 */
export function useSession() {
  return useQuery({ queryKey: queryKeys.auth.session, queryFn: authApi.me, retry: false });
}

export function useRequestCode() {
  return useMutation({ mutationFn: authApi.challenge });
}

export function useDirectSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.direct,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.session }),
  });
}

export function useVerifyCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.session }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await unregisterPush().catch(() => {});
      return authApi.logout();
    },
    // The persisted IndexedDB copy is wiped directly rather than left to the throttled
    // auto-persist of the now-empty cache: a shared device signing in as a different
    // client before that throttle fires must not see this client's data flash first.
    onSuccess: () => {
      qc.clear();
      void idbPersister.removeClient();
    },
  });
}

/** Both refuse to answer in production — the API will not even boot with the bypass on. */
export function useDevUsers() {
  return useQuery({
    queryKey: ["auth", "dev-users"],
    queryFn: authApi.devUsers,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useDevLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.devLogin,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.session }),
  });
}
