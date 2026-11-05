/** Public marketing facts confirmed by the founder. Prices are monthly INR. */

export const SITE = {
  name: "Traiv",
  tagline: "Coaching app for trainers and gyms",
  description:
    "Workout plans, diet plans, check-ins and client payments for personal trainers and gyms. Start your 14-day free trial.",
  /**
   * Where this deployment actually lives.
   *
   * Everything canonical hangs off it — `metadataBase`, every page's canonical tag,
   * `sitemap.xml`, `robots.txt` and the JSON-LD. Hardcoding the production domain means
   * a preview deployment tells Google its pages live at traiv.fit, which is a slow,
   * quiet way to lose the real ones. Vercel sets `VERCEL_PROJECT_PRODUCTION_URL` on
   * every build, so the fallback is right without anybody configuring it.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://traiv.fit"),
  /** The product apps, for links out of the marketing site. */
  app: {
    signup: "https://app.traiv.fit/signup",
    signin: "https://app.traiv.fit/signin",
    affiliate: "https://refer.traiv.fit",
  },
} as const;

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
      { href: "/tools/calorie-calculator", label: "Macro calculator" },
      { href: "/tools/income-calculator", label: "Income calculator" },
      { href: "/tools/pricing-calculator", label: "What to charge" },
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
      { href: "/demo", label: "Book a demo" },
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
