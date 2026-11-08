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

/**
 * The server's own field-level reason, duck-typed rather than imported — this package
 * has no business knowing either app's concrete `ApiError` class, only the shape a 400
 * with field details takes on the wire. "Height must be between 90 and 250 cm" beats
 * "Couldn't save that" every time one is actually available.
 */
function specificReason(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const { status, details } = error as { status?: unknown; details?: unknown };
  if (status !== 400 || !Array.isArray(details) || !details.length) return null;
  const message = (details[0] as { message?: unknown } | undefined)?.message;
  return typeof message === "string" && message ? message : null;
}

/** Only explicitly tagged mutations emit notifications. Reads/auth/autosaves stay quiet. */
export function mutationFeedback(
  meta: Record<string, unknown> | undefined,
  outcome: "success" | "error",
  error?: unknown,
) {
  const feedback = meta?.feedback;
  if (!feedback || typeof feedback !== "object") return;
  const message =
    outcome === "success" && "success" in feedback
      ? feedback.success
      : outcome === "error" && "error" in feedback
        ? (specificReason(error) ?? feedback.error)
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
