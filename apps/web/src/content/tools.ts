import {
  BookOpen,
  Calculator,
  FileText,
  IndianRupee,
  type LucideIcon,
  TrendingUp,
} from "lucide-react";

export type Tool = {
  href: string;
  name: string;
  blurb: string;
  icon: LucideIcon;
};

/**
 * The second dropdown.
 *
 * Named "Tools" rather than "Learn" — what is behind it is mostly things that calculate
 * something, and a label should say what happens when you click it.
 */
export const TOOLS: readonly Tool[] = [
  {
    href: "/tools/calorie-calculator",
    name: "Macro calculator",
    blurb: "Calories and macros for Indian food, free, no signup",
    icon: Calculator,
  },
  {
    href: "/tools/income-calculator",
    name: "Income calculator",
    blurb: "What you would earn at your rate and client count",
    icon: IndianRupee,
  },
  {
    href: "/tools/pricing-calculator",
    name: "What to charge",
    blurb: "A defensible number for your own coaching",
    icon: TrendingUp,
  },
  {
    href: "/guides",
    name: "Guides",
    blurb: "Running and growing a coaching business in India",
    icon: BookOpen,
  },
  {
    href: "/guides/templates",
    name: "Templates",
    blurb: "Check-in forms, onboarding messages, scripts",
    icon: FileText,
  },
];
