"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { startInstallPromptCapture } from "@/lib/pwa/install-prompt";
import { registerServiceWorker } from "@/lib/pwa/sw-update";

/** Mounted once in the root layout — registers the service worker and starts
 * capturing the install prompt, nothing else yet. Trainer has no health sync or native
 * push to bootstrap the way the client app's own platform-services.tsx does; this stays
 * proportional to what actually exists. */
export function PlatformServices() {
  const qc = useQueryClient();
  useEffect(() => {
    registerServiceWorker(qc);
  }, [qc]);
  useEffect(() => {
    startInstallPromptCapture();
  }, []);
  return null;
}
