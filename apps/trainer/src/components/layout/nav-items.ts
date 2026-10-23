import type { NavGroup } from "@traiv/ui/components/shell/app-shell";
import { Home, Users } from "lucide-react";

/**
 * The coach's rail, grouped by subject.
 *
 * One group and one link today, because one screen exists. The groups are here rather
 * than a flat array because the shape the app is growing into is four subjects —
 * clients, training, nutrition, forms — and a flat list of fourteen links makes you read
 * all fourteen to find one.
 *
 * Nothing goes in until the screen behind it does. ADR 0020: shipping the full set and
 * leaving most of it empty is how every competitor's app ends up feeling hollow.
 * Settings lives in the rail's footer, not here — it is where you go last.
 */
export const navItems: readonly NavGroup[] = [
  {
    label: "Coaching",
    items: [
      { href: "/dashboard", label: "Today", icon: Home },
      { href: "/clients", label: "Clients", icon: Users },
    ],
  },
];
