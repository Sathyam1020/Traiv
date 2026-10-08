import type { ReactNode } from "react";

/**
 * The header for an app with one screen.
 *
 * Endorse and admin have a single destination each. A sidebar holding one link is
 * furniture, not navigation — it would take 240px of every screen to tell somebody they
 * are where they already are.
 *
 * It spans the window rather than floating, because there is no fixed sidebar for it to
 * sit beside and a floating header with nothing under it reads as an orphan.
 */
export function TopBar({ brand, account }: { brand: ReactNode; account: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">{brand}</div>
        <div className="flex items-center gap-1">{account}</div>
      </div>
    </header>
  );
}
