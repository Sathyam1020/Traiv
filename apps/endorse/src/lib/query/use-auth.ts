"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useAuthConfig() {
  return useQuery({
    queryKey: queryKeys.auth.config,
    queryFn: authApi.config,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/** `retry: false` because 401 is an answer here, not a failure worth retrying. */
export function useSession() {
  return useQuery({ queryKey: queryKeys.auth.session, queryFn: authApi.me, retry: false });
}

export function useRequestCode() {
  return useMutation({ mutationFn: authApi.challenge });
}

function invalidateSession(qc: ReturnType<typeof useQueryClient>) {
  return () => qc.invalidateQueries({ queryKey: queryKeys.auth.session });
}

export function useVerifyCode() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: authApi.verify, onSuccess: invalidateSession(qc) });
}

export function useDirectSignIn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: authApi.direct, onSuccess: invalidateSession(qc) });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: authApi.logout, onSettled: () => qc.clear() });
}

/** Both refuse to answer in production — the API will not boot with the bypass on. */
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
  return useMutation({ mutationFn: authApi.devLogin, onSuccess: invalidateSession(qc) });
}
