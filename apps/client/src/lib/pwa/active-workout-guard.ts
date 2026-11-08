/**
 * Is it safe right now to apply a waiting service-worker update?
 *
 * A plain module-level singleton, not a store — there is exactly one browser tab's
 * notion of "is a workout active" at a time, which is a different shape to the
 * per-render-tree UI stores elsewhere in this app. The active workout page marks itself
 * active on mount and clears it on unmount (including the unmount that happens when it
 * navigates to the finish screen); `sw-update.ts` checks this before ever applying an
 * update on its own, and listens for it to clear if an update was deferred.
 */

let active = false;
const listeners = new Set<() => void>();

export function markWorkoutActive(): void {
  active = true;
}

export function markWorkoutInactive(): void {
  active = false;
  for (const listener of listeners) listener();
}

export function isWorkoutActive(): boolean {
  return active;
}

/** Fires once, the next time `markWorkoutInactive` runs — not a general event bus. */
export function onWorkoutInactive(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
