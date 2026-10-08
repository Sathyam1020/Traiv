"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Takes the value rather than reading a store, because each app owns its own — the theme
 * is a class on the root element driven by a per-app zustand store, which is why
 * `next-themes` was removed when sonner arrived with it (ADR notes in dependencies.md).
 */
export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className="flex size-7 cursor-pointer items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
    >
      {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
