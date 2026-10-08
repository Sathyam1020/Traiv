"use client";

import { API_BASE } from "@/lib/api";

/**
 * The tracker.
 *
 * Nothing is stored on the device — no cookie, no localStorage, no identifier of any
 * kind. The server works out who a visitor is for one day from a rotating salted hash
 * and forgets them overnight (see `apps/api/src/features/marketing/visitor.ts`). That
 * is why this file never asks for consent: there is nothing to consent to.
 *
 * Events are queued and flushed, rather than one request per click, because a click on
 * a link is immediately followed by a navigation that cancels any in-flight `fetch`.
 * `sendBeacon` is the only thing a browser guarantees to finish during unload, so the
 * flush prefers it and falls back to a keepalive fetch where it is unavailable.
 */

type EventName = "pageview" | "click" | "submit" | "scroll" | "exit";

type Payload = {
  name: EventName;
  path: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  props?: Record<string, string | number | boolean>;
  durationMs?: number;
};

const MAX_BATCH = 20;
let queue: Payload[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;

function campaign() {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const pick = (k: string) => q.get(k) ?? undefined;
  return {
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
  };
}

function flush(duringUnload = false) {
  if (typeof window === "undefined" || queue.length === 0) return;

  const events = queue.slice(0, MAX_BATCH);
  queue = queue.slice(MAX_BATCH);
  const body = JSON.stringify({ events });
  const url = `${API_BASE}/m/collect`;

  // A Blob with the right type, because `sendBeacon` with a bare string sends
  // text/plain and express.json() then ignores the body entirely — a silent no-op that
  // looks exactly like working code.
  const sent =
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));

  if (!sent) {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: duringUnload,
    }).catch(() => {
      // Analytics must never be the reason a page logs an error at somebody.
    });
  }

  if (queue.length > 0) flush(duringUnload);
}

function schedule() {
  if (timer) return;
  // Batched over a second. Long enough to collect a scroll burst, short enough that a
  // visitor who leaves immediately is still counted.
  timer = setTimeout(() => {
    timer = undefined;
    flush();
  }, 1000);
}

export function track(name: EventName, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  queue.push({
    name,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    ...campaign(),
    ...(props ? { props } : {}),
  });
  schedule();
}

export function trackPageview() {
  if (typeof window === "undefined") return;
  queue.push({
    name: "pageview",
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    ...campaign(),
  });
  // Pageviews go immediately. Holding one for a second loses every visitor who bounces
  // inside that second, and those are exactly the ones worth knowing about.
  flush();
}

export function trackExit(path: string, durationMs: number, depth: number) {
  if (typeof window === "undefined") return;
  queue.push({
    name: "exit",
    path,
    durationMs: Math.min(durationMs, 86_400_000),
    props: { depth },
    ...campaign(),
  });
  flush(true);
}
