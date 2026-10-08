import type { NavItem } from "@traiv/ui/components/shell/app-shell";
import { Home, Settings } from "lucide-react";

/** "Dashboard" is banned by voice.md — the coach's home is Today. */
export const navItems: readonly NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/settings", label: "Settings", icon: Settings },
];
