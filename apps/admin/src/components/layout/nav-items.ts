import type { NavItem } from "@traiv/ui/components/shell/app-shell";
import { BarChart3, FileText, LayoutGrid, Users } from "lucide-react";

/**
 * The admin app's four screens.
 *
 * It had one until the marketing site needed somewhere to be read and written from, and
 * a `TopBar` holding four links is a sidebar that has not admitted it yet.
 */
export const navItems: readonly NavItem[] = [
  { href: "/dashboard", label: "Platform", icon: LayoutGrid },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/waitlist", label: "Launch list", icon: Users },
  { href: "/posts", label: "Blog", icon: FileText },
];
