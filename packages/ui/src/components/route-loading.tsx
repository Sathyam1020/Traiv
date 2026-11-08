import { Loader } from "../icons";

/**
 * The shared body for every route-level `loading.tsx`.
 *
 * Every page in these apps fetches through TanStack Query, not a slow server component,
 * so this covers the route-transition/code-split-chunk moment — not "waiting for data,"
 * which each page already shows its own skeleton for via `isPending`. Keep it that way;
 * this file is not a replacement for per-screen loading states, just the gap before them.
 */
export function RouteLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <Loader aria-hidden="true" className="size-5 animate-spin text-fg-muted" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
