"use client";
import { Capacitor } from "@capacitor/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { http } from "@/lib/api/client";
import { syncHealth } from "@/lib/health";
import { startInstallPromptCapture } from "@/lib/pwa/install-prompt";
import { registerServiceWorker } from "@/lib/pwa/sw-update";
export function PlatformServices({ studioId }: { studioId: string }) {
  const qc = useQueryClient();
  useEffect(() => {
    // Neither applies inside the native wrapper — it's already installed, and has no
    // browser tab to swap a worker under.
    if (Capacitor.isNativePlatform()) return;
    registerServiceWorker();
    startInstallPromptCapture();
  }, []);
  useEffect(() => {
    let inFlight = false;
    const sync = async () => {
      if (!Capacitor.isNativePlatform() || inFlight || document.visibilityState !== "visible")
        return;
      inFlight = true;
      try {
        const { data } = await http.get<{ enabled: boolean }>(`/c/${studioId}/health`);
        if (data.enabled) {
          await syncHealth(studioId);
          void qc.invalidateQueries({ queryKey: ["client", "today", studioId] });
          window.dispatchEvent(new Event("traiv:steps-updated"));
        }
      } catch {
        /* Integration screen surfaces errors on an explicit sync. */
      } finally {
        inFlight = false;
      }
    };
    void sync();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [studioId, qc]);
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let remove: (() => void) | undefined;
    void import("@capacitor/push-notifications").then(async ({ PushNotifications }) => {
      const handle = await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (event) => {
          const url = event.notification.data?.url;
          if (typeof url === "string" && url.startsWith("/") && !url.startsWith("//"))
            window.location.assign(url);
        },
      );
      remove = () => void handle.remove();
    });
    return () => remove?.();
  }, []);
  return null;
}
