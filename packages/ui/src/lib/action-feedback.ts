"use client";

import { toast } from "../components/sonner";

export type ActionFeedback = { success?: string; error: string };
const recent = new Map<string, number>();

/** Suppress repeated action notices without turning field edits into a toast stream. */
export function notifyAction(message: string, variant: "success" | "error") {
  const key = `${variant}:${message}`;
  const now = Date.now();
  if (now - (recent.get(key) ?? 0) < 1500) return;
  if (recent.size > 100) recent.clear();
  recent.set(key, now);
  toast(message, { variant });
}

/** Only explicitly tagged mutations emit notifications. Reads/auth/autosaves stay quiet. */
export function mutationFeedback(
  meta: Record<string, unknown> | undefined,
  outcome: "success" | "error",
) {
  const feedback = meta?.feedback;
  if (!feedback || typeof feedback !== "object") return;
  const message =
    outcome === "success" && "success" in feedback
      ? feedback.success
      : outcome === "error" && "error" in feedback
        ? feedback.error
        : undefined;
  if (typeof message === "string" && message) notifyAction(message, outcome);
}

/** For explicit actions that do not use React Query mutations. Rethrow for inline recovery. */
export async function withActionFeedback<T>(
  action: () => Promise<T>,
  feedback: ActionFeedback,
): Promise<T> {
  try {
    const result = await action();
    if (feedback.success) notifyAction(feedback.success, "success");
    return result;
  } catch (error) {
    notifyAction(feedback.error, "error");
    throw error;
  }
}
