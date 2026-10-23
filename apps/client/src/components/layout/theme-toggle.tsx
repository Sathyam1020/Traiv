"use client";

import { ThemeToggle as Toggle } from "@traiv/ui/components/theme-toggle";
import { useUiStore } from "@/lib/stores";

export function ThemeToggle({ tone }: { tone?: "surface" | "rail" }) {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  return <Toggle tone={tone} theme={theme} onToggle={toggleTheme} />;
}
