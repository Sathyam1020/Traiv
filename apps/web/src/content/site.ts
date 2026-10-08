/**
 * Everything the site says about itself, in one place.
 *
 * Prices live here and nowhere else. A tier that reads ₹999 on the landing page and ₹1,099
 * on the pricing page is the kind of mistake nobody catches until a coach does, in public.
 *
 * Figures come from `.ai/product/positioning.md`, which is the decided source. If a number
 * here disagrees with that file, that file wins.
 */

export const SITE = {
  name: "Traiv",
  tagline: "Coaching software for independent coaches",
  description:
    "Plans, check-ins and payments for independent coaches in India. Unlimited clients at ₹999 a month — never per client.",
  url: "https://traiv.in",
  /** The product apps, for links out of the marketing site. */
  app: {
    signup: "https://app.traiv.in/signup",
    signin: "https://app.traiv.in/signin",
    affiliate: "https://refer.traiv.in",
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

/**
 * GST-inclusive, because an Indian buyer expects the price on the page to be the price
 * charged. ₹999 inclusive nets ₹846.
 *
 * Annual is two months free. Worth pushing: this category churns 5–13% a month, and a year
 * up front is worth far more than the 17% given up.
 */
export const TIERS: readonly Tier[] = [
  {
    name: "Free",
    monthly: 0,
    annual: null,
    limit: "1 client",
    summary: "Run one person properly, for as long as you like. No card.",
    features: [
      "1 client, forever",
      "Plan builder and client app",
      "Check-ins and progress",
      "Your branding on the client app",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    monthly: 999,
    annual: 9990,
    limit: "Unlimited clients",
    summary: "The whole thing. However many people you coach.",
    features: [
      "Unlimited clients — the price does not move",
      "Nutrition and meal plans",
      "WhatsApp delivery",
      "Check-in forms and automations",
      "Payment links and GST invoices",
      "0% platform fee on your revenue",
    ],
    cta: "Start free trial",
    hero: true,
  },
  {
    name: "Studio",
    monthly: 2499,
    annual: 24990,
    limit: "5 coach seats",
    summary: "For a gym or a team coaching under one name.",
    features: [
      "5 coach seats",
      "Everything in Pro",
      "Shared client roster",
      "Group programmes",
      "Per-coach permissions",
    ],
    cta: "Talk to us",
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
    title: "Unlimited clients",
    body: "The price is the price at 5 clients and at 500. We will never charge you for growing.",
    against: "TrueCoach, Everfit and Trainerize all bill per client.",
  },
  {
    title: "No add-ons",
    body: "Nutrition, payments, automations and branding are in the price.",
    against: "Trainerize charges $45 a month for nutrition.",
  },
  {
    title: "0% platform fee",
    body: "What your clients pay you is yours. We take the gateway cost and nothing else.",
    against: "TrueCoach takes 5% of your revenue.",
  },
  {
    title: "No setup fee for branding",
    body: "Your name on your client's app, from the first day, at no extra cost.",
    against: "Trainerize charges $169. FitBudd charges $75.",
  },
  {
    title: "One-click cancel",
    body: "A button in your settings. No email, no call, no retention offer.",
    against: "Eight of the ten platforms we checked make you ask.",
  },
  {
    title: "One-click export",
    body: "Leave any time, take everything. Your clients, plans and history, in a file.",
    against: "Most platforms will give you a CSV if you ask twice.",
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
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
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
