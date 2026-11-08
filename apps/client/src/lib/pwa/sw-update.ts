"use client";

import { toast } from "@traiv/ui/components/sonner";
import { isWorkoutActive, onWorkoutInactive } from "./active-workout-guard";

/**
 * Registers the service worker and handles updates safely.
 *
 * The worker itself (`worker-source.ts`) never calls `skipWaiting()` on its own — a new
 * version installs and sits in `waiting` until this module explicitly tells it to take
 * over, and only after the person has actually asked for it (or, if a workout is active,
 * only once it ends). "Never interrupt an active workout or discard pending mutations"
 * means the update has to wait on the one thing that actually matters, not on a timer.
 */
export function registerServiceWorker(): void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("/sw.js", { updateViaCache: "none" })
    .then((registration) => {
      // A version was already waiting from an earlier visit to this tab.
      if (registration.waiting) promptUpdate(registration);

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          // A controller already existing is what makes this an update rather than the
          // very first install, which needs no prompt — there's nothing running yet to
          // protect.
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            promptUpdate(registration);
          }
        });
      });
    })
    .catch(() => {});

  // The new worker taking control is the only moment it's safe to reload — skipWaiting()
  // is asynchronous, and reloading any earlier risks serving a half-activated version.
  // This only ever fires as a result of applyUpdate() below, since nothing else in this
  // app calls skipWaiting.
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

function promptUpdate(registration: ServiceWorkerRegistration): void {
  if (isWorkoutActive()) {
    // Don't even show the prompt yet — surfacing "Refresh" during a workout just invites
    // a tap that would discard whatever hasn't synced. Show it the moment the guard
    // clears instead.
    const stop = onWorkoutInactive(() => {
      stop();
      promptUpdate(registration);
    });
    return;
  }

  toast("An update is ready", {
    description: "Refresh to get the latest version.",
    duration: 20_000,
    action: {
      label: "Refresh",
      onClick: () => registration.waiting?.postMessage({ type: "SKIP_WAITING" }),
    },
  });
}
