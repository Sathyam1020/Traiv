"use client";

import type { QueryClient } from "@tanstack/react-query";
import { toast } from "@traiv/ui/components/sonner";

/**
 * Registers the service worker and handles updates safely — same shape as the client
 * app's own (apps/client/src/lib/pwa/sw-update.ts), but the "is this a bad moment"
 * check differs: Trainer has no single long-running session the way an active workout
 * is, so instead of a bespoke guard, this reads TanStack Query's own in-flight-mutation
 * count. Proportional to what Trainer actually has to protect — a save in progress,
 * not a whole session's worth of state.
 */
export function registerServiceWorker(qc: QueryClient): void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("/sw.js", { updateViaCache: "none" })
    .then((registration) => {
      if (registration.waiting) promptUpdate(registration, qc);

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            promptUpdate(registration, qc);
          }
        });
      });
    })
    .catch(() => {});

  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

function promptUpdate(registration: ServiceWorkerRegistration, qc: QueryClient): void {
  toast("An update is ready", {
    description: "Refresh to get the latest version.",
    duration: 20_000,
    action: {
      label: "Refresh",
      onClick: () => applyUpdate(registration, qc),
    },
  });
}

/** Waits out an in-flight save rather than reloading through it — up to 10s, then
 * proceeds regardless so one stuck mutation can't defer an update forever. */
function applyUpdate(registration: ServiceWorkerRegistration, qc: QueryClient, attempt = 0): void {
  if (qc.isMutating() > 0 && attempt < 10) {
    setTimeout(() => applyUpdate(registration, qc, attempt + 1), 1000);
    return;
  }
  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
}
