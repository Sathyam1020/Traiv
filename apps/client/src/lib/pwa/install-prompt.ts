"use client";

import { useSyncExternalStore } from "react";

/**
 * Captures the browser's installability signal once, globally, and exposes it to
 * whatever wants an "Install" button — Settings, not a popup.
 *
 * A toast timed around Chrome's own `beforeinstallprompt` heuristics (real engagement
 * across multiple separate visits, not just clicking around once) turned out to be
 * untestable and easy to miss. A button that's simply always there in Settings, and
 * reflects whatever the browser actually allows right now, is both simpler and more
 * honest about what this can and can't control — there's no way to make Chrome fire the
 * event sooner from here, only to react correctly once it does.
 */
type BeforeInstallPromptEvent = Event & {
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
};

export type InstallState = "unavailable" | "available" | "ios-manual" | "installed";

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
let started = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own pre-standard flag — not covered by the media query above.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Called once, from `PlatformServices` — wiring the listeners is global and happens
 * exactly once, independent of how many components later render an install button. */
export function startInstallPromptCapture(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  // Always prevented, not only when something will use it — the browser's own
  // mini-infobar must never show up alongside a button this page already offers.
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    notify();
  });
}

function getInstallState(): InstallState {
  if (typeof window === "undefined") return "unavailable";
  if (installed || isStandalone()) return "installed";
  if (deferred) return "available";
  if (isIOS()) return "ios-manual";
  return "unavailable";
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** Server-rendered as "unavailable" (nothing is installable before the browser has
 * said so), then reconciles to the real state on the client. */
export function useInstallState(): InstallState {
  return useSyncExternalStore(subscribe, getInstallState, () => "unavailable");
}

/**
 * Only does something when the state is "available" — the caller is expected to check
 * that first. Returns "unavailable" rather than throwing when called anyway, so a stale
 * render racing a state change degrades to a no-op instead of an error.
 */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferred) return "unavailable";
  const event = deferred;
  deferred = null;
  notify();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
}
