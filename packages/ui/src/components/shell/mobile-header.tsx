import type { ReactNode } from "react";

/**
 * The header below `lg`, holding what the sidebar holds above it.
 *
 * Hidden at `lg` exactly, where the sidebar takes over — one breakpoint, so the two can
 * never both be visible or both be missing.
 *
 * `min-h-14` with the inset added as extra top padding, not `h-14` with the inset
 * absorbed into it — a notch or the Dynamic Island must push the bar's content down,
 * not squeeze it. In a regular browser tab the inset is 0 and this is exactly `h-14`;
 * installed standalone on a phone with no browser chrome of its own to clear the status
 * bar, it is the only thing that does.
 */
export function MobileHeader({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <header className="flex min-h-14 items-center justify-between gap-3 border-b border-line px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">{left}</div>
      <div className="flex items-center gap-1">{right}</div>
    </header>
  );
}
