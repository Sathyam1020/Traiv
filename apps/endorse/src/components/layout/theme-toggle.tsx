"use client";

import { ThemeToggle as Toggle } from "@traiv/ui/components/theme-toggle";
import { useUiStore } from "@/lib/stores";

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  return <Toggle theme={theme} onToggle={toggleTheme} />;
}
