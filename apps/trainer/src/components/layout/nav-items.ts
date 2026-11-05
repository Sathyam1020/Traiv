import type { NavGroup } from "@traiv/ui/components/shell/app-shell";
import {
  BookOpen,
  FileText,
  ClipboardList,
  Dumbbell,
  Inbox,
  LayoutGrid,
  Salad,
  Users,
} from "@traiv/ui/icons";

/**
 * The coach's rail, grouped by subject.
 *
 * The groups are here rather than a flat array because the shape the app is growing
 * into is four subjects — clients, training, nutrition, forms — and a flat list of
 * fourteen links makes you read all fourteen to find one. **Workouts** is a labelled
 * group of its own, matching the real Coachway rail: "Workouts" as a section header
 * with Exercises and Templates beneath it, not a single flat link.
 *
 * Nothing goes in until the screen behind it does. ADR 0020: shipping the full set and
 * leaving most of it empty is how every competitor's app ends up feeling hollow.
 * Settings lives in the rail's footer, not here — it is where you go last.
 */
export const navItems: readonly NavGroup[] = [
  {
    label: "Coaching",
    items: [
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/inbox", label: "Inbox", icon: Inbox },
      { href: "/vault/resources", label: "Vault", icon: FileText },
    ],
  },
  {
    label: "Workouts",
    items: [
      { href: "/exercises", label: "Exercises", icon: Dumbbell },
      { href: "/templates", label: "Templates", icon: LayoutGrid },
    ],
  },
  {
    label: "Nutrition",
    items: [
      { href: "/nutrition/recipes", label: "Recipes", icon: BookOpen },
      { href: "/nutrition/ingredients", label: "Ingredients", icon: Salad },
      { href: "/nutrition/mealplans", label: "Mealplans", icon: ClipboardList },
    ],
  },
];
