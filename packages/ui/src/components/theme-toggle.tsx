"use client";

import { SolidSidebarIcon } from "@traiv/ui/components/shell/solid-sidebar-icon";
import { Moon, Sun } from "@traiv/ui/icons";

/**
 * Takes the value rather than reading a store, because each app owns its own — the theme
 * is a class on the root element driven by a per-app zustand store, which is why
 * `next-themes` was removed when sonner arrived with it (ADR notes in dependencies.md).
 */
export function ThemeToggle({
  tone = "surface",
  theme,
  onToggle,
}: {
  /** `rail` is the dark sidebar, where the foreground is `contrast-fg`, never `fg`. */
  tone?: "surface" | "rail";
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className={
        tone === "rail"
          ? "flex size-8 cursor-pointer items-center justify-center rounded-control text-contrast-fg/60 transition-colors hover:bg-contrast-fg/8 hover:text-contrast-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contrast-fg/40"
          : "flex size-7 cursor-pointer items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
      }
    >
      {tone === "rail" ? (
        <SolidSidebarIcon icon={theme === "dark" ? Moon : Sun} className="size-4" />
      ) : theme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </button>
  );
}
