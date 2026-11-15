"use client";

import { track } from "@/lib/analytics";

/**
 * Tool events (plan §4.2), sent through the existing tracker.
 *
 * The collector only accepts five event names, and `analytics_event.name` is documented
 * as one of them. Rather than widen the API and the table for marketing detail, a tool
 * event rides on `click` or `submit` with `props.event` saying which one it is (ADR 0036).
 */
type ToolEvent =
  | { event: "tool_calculate"; slug: string; group: string; kind: string }
  | { event: "tool_result_action"; slug: string; action: string }
  | { event: "tool_cta_click"; slug: string; group: string; placement: string; target: string }
  | { event: "tool_related_click"; from: string; to: string };

export function trackTool(e: ToolEvent) {
  track(e.event === "tool_calculate" ? "submit" : "click", e);
}

/**
 * One `tool_calculate` per settled result, not one per keystroke. ADR 0021 keeps raw rows,
 * so a slider dragged across its range must not become two hundred of them.
 */
const timers = new Map<string, ReturnType<typeof setTimeout>>();
export function trackCalculateSettled(slug: string, group: string, kind: string, delayMs = 1500) {
  const existing = timers.get(slug);
  if (existing) clearTimeout(existing);
  timers.set(
    slug,
    setTimeout(() => {
      timers.delete(slug);
      trackTool({ event: "tool_calculate", slug, group, kind });
    }, delayMs),
  );
}
