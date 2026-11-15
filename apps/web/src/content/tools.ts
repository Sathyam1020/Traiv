import {
  BookOpen,
  Calculator,
  FileText,
  type Icon,
  IndianRupee,
  TrendingUp,
} from "@traiv/ui/icons";

export type Tool = {
  href: string;
  name: string;
  blurb: string;
  icon: Icon;
};

/**
 * The second dropdown.
 *
 * Named "Tools" rather than "Learn" — what is behind it is mostly things that calculate
 * something, and a label should say what happens when you click it.
 */
export const TOOLS: readonly Tool[] = [
  {
    href: "/tools",
    name: "All free tools",
    blurb: "Every calculator, grouped by what it works out",
    icon: Calculator,
  },
  {
    href: "/tools/tdee-calculator",
    name: "TDEE calculator",
    blurb: "Maintenance, cut and bulk calories",
    icon: Calculator,
  },
  {
    href: "/tools/recipe-macro-calculator",
    name: "Recipe macro calculator",
    blurb: "Macros per serving from your own labels",
    icon: Calculator,
  },
  {
    href: "/tools/macro-calculator",
    name: "Macro calculator",
    blurb: "Daily calories and protein, carbs and fat in grams",
    icon: Calculator,
  },
  {
    href: "/tools/personal-trainer-income-calculator",
    name: "Income calculator",
    blurb: "What you would earn at your rate and client count",
    icon: IndianRupee,
  },
  {
    href: "/tools/coaching-rate-calculator",
    name: "What to charge",
    blurb: "A defensible number for your own coaching",
    icon: TrendingUp,
  },
  {
    href: "/tools/templates",
    name: "Templates",
    blurb: "Check-in forms, onboarding messages, scripts",
    icon: FileText,
  },
  {
    href: "/blog",
    name: "Writing",
    blurb: "Running and growing a coaching business in India",
    icon: BookOpen,
  },
];
