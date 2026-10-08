import type { NavItem } from "@traiv/ui/components/shell/app-shell";
import { Home, User } from "lucide-react";

/**
 * Two, because two screens exist.
 *
 * It grows to Today · Plan · Progress · Chat · You as features land — the research in
 * `.ai/product/competitor-client-apps.md` found that every competitor ships the full set
 * and leaves most of it empty, and that the one platform doing it well (Trainerize) hides
 * a tab until the coach has put something in it. Adding one here is a line.
 */
export const navItems: readonly NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/you", label: "You", icon: User },
];
