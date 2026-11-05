"use client";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api/client";
export type NotificationPreferences = {
  chat: boolean;
  checkIns: boolean;
  content: boolean;
  community: boolean;
  messageEmail: boolean;
  campaignEmail: boolean;
};
export type ClientSettings = {
  user: {
    name: string;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    emailVerifiedAt: string | null;
    phoneVerifiedAt: string | null;
  };
  settings: {
    birthDate: string | null;
    timeZone: string;
    language: string;
    units: "metric" | "us" | "uk";
    heightCm: number | null;
    notifications: NotificationPreferences;
  };
  contactVerificationEnabled: boolean;
  emailDeliveryEnabled: boolean;
};
export function useSettings(studioId: string | null) {
  return useQuery({
    queryKey: ["client-settings", studioId],
    queryFn: async () => (await http.get<ClientSettings>(`/c/${studioId}/settings`)).data,
    enabled: Boolean(studioId),
  });
}
