import type { ReactNode } from "react";

/**
 * The header below `lg`, holding what the sidebar holds above it.
 *
 * Hidden at `lg` exactly, where the sidebar takes over — one breakpoint, so the two can
 * never both be visible or both be missing.
 */
export function MobileHeader({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <header className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">{left}</div>
      <div className="flex items-center gap-1">{right}</div>
    </header>
  );
}
