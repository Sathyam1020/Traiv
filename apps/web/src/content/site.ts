/** Public marketing facts confirmed by the founder. Prices are monthly INR. */

export const SITE = {
  name: "Traiv",
  tagline: "Coaching app for trainers and gyms",
  organizationDescription:
    "Traiv is a coaching platform for personal trainers and gyms. Coaches build workout and nutrition plans, review client check-ins, and manage payments in one place.",
  description:
    "Workout plans, diet plans, check-ins and client payments for personal trainers and gyms. Start your 14-day free trial.",
  /** Stable production identity; preview deployments must never become canonicals. */
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.traiv.fit").origin,
  /** The product apps, for links out of the marketing site. */
  app: {
    signup: "https://app.traiv.fit/signup",
    signin: "https://app.traiv.fit/signin",
    affiliate: "https://refer.traiv.fit",
  },
  /**
   * Demo booking (ADR 0036). Every "Book a demo" button reads this, and hides itself when
   * it is empty, so removing the link here removes every button rather than leaving them
   * pointing at nothing. `/demo` redirects here from `next.config.ts`.
   */
  demoUrl: "https://cal.com/sathyamsahu",
} as const;

/**
 * The named author on free-tool pages. Deliberately null for now (ADR 0036).
 *
 * When this is filled in, every tool page renders a byline under its intro and adds
 * `author` to its Article schema, with no other change needed. Agents: if the founder
 * supplies an author, set it here, and add a team page at `url` if one doesn't exist yet.
 */
export const TOOL_AUTHOR: { name: string; url: string; credential?: string } | null = null;

export type Tier = {
  name: string;
  monthly: number;
  annual: number | null;
  limit: string;
  summary: string;
  features: string[];
  cta: string;
  hero?: boolean;
};

export const TIERS: readonly Tier[] = [
  {
    name: "Trainer",
    monthly: 999,
    annual: null,
    limit: "1 trainer",
    summary: "For your personal coaching practice.",
    features: [
      "Workout and diet plans",
      "Check-ins and progress",
      "Client fee collection",
      "Your name and logo in the app",
    ],
    cta: "Start your 14-day free trial",
    hero: true,
  },
  {
    name: "Gym",
    monthly: 2499,
    annual: null,
    limit: "For gyms with 3+ trainers",
    summary: "One subscription for your gym's coaching.",
    features: [
      "Workout and diet plans",
      "Check-ins and progress",
      "Client fee collection",
      "Your gym's name and logo in the app",
    ],
    cta: "Start your 14-day free trial",
  },
];

/**
 * Promises, not features.
 *
 * Each one is a thing a competitor does that we have decided never to do — from
 * positioning.md's "What never changes". That list is the sharpest thing we own, because
 * every line is checkable against somebody's public pricing page.
 */
export const PROMISES = [
  {
    title: "Connected coaching",
    body: "Workout plans, diet plans and check-ins in one workspace.",
    against: "",
  },
  { title: "Your name and logo", body: "Your coaching identity inside Traiv.", against: "" },
  {
    title: "Built for your coaching",
    body: "Subscriptions priced in rupees for trainers and gyms.",
    against: "",
  },
] as const;

/** Flat links. Features and Tools are dropdowns and live in their own content files. */
export const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/coaches", label: "Coaches" },
  { href: "/about", label: "About" },
] as const;

export const FOOTER = [
  {
    heading: "Product",
    links: [
      { href: "/features/plan-builder", label: "Plan builder" },
      { href: "/features/nutrition", label: "Nutrition" },
      { href: "/features/check-ins", label: "Check-ins" },
      { href: "/features/client-app", label: "The client app" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { href: "/compare/trainerize", label: "vs Trainerize" },
      { href: "/compare/fitbudd", label: "vs FitBudd" },
      { href: "/compare/everfit", label: "vs Everfit" },
      { href: "/compare/truecoach", label: "vs TrueCoach" },
    ],
  },
  {
    heading: "Free tools",
    links: [
      { href: "/tools/macro-calculator", label: "Macro calculator" },
      { href: "/tools/personal-trainer-income-calculator", label: "Income calculator" },
      { href: "/tools/coaching-rate-calculator", label: "What to charge" },
      { href: "/tools/templates", label: "Templates" },
      { href: "/blog", label: "Writing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/coaches", label: "For coaches" },
      { href: "/partnership", label: "Partnership" },
      { href: "/affiliate", label: "Refer a coach" },
      ...(SITE.demoUrl ? [{ href: SITE.demoUrl, label: "Book a demo" }] : []),
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/refund", label: "Refunds" },
    ],
  },
] as const;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
