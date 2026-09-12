"use client";

import { Moon, Sun } from "lucide-react";
import { useUiStore } from "@/lib/stores";

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className="flex size-7 cursor-pointer items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-hover hover:text-fg"
    >
      {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
