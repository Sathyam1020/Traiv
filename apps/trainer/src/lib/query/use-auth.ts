"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useAuthConfig() {
  return useQuery({
    queryKey: queryKeys.auth.config,
    queryFn: authApi.config,
    staleTime: Number.POSITIVE_INFINITY, // fixed for the life of the deployment
  });
}

export function useSession(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: authApi.me,
    enabled: options?.enabled ?? true,
    retry: false,
  });
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

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.auth.session }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear everything — none of it belongs to the next person to sign in.
      qc.clear();
      router.push("/signin");
    },
  });
}

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
