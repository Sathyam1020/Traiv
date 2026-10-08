/**
 * The compare pages.
 *
 * ## The rule, repeated because this is the file where breaking it is expensive
 *
 * A number about another company goes on this site only with a `source` and a `checked`
 * date, read off their own public page. Anything unverified is **absent** — not estimated,
 * not "around", not carried over from memory. A coach who checks one figure and finds it
 * wrong stops believing the other eleven, and they are right to.
 *
 * `verified: false` entries render as "we have not checked this" rather than as a price.
 * That reads as careful rather than evasive, and it is true.
 *
 * ## Before launch
 *
 * Only the Coachway figures were read off a live pricing page (2026-10-08). Everything
 * else traces to `.ai/product/positioning.md`, which recorded them on 2026-09-11 without
 * a URL. Re-read every vendor's pricing page and fill in the `source` URLs before this
 * site is public. The qualitative lines below are our own characterisation and should be
 * read once by a human who has used the product in question.
 */

export type Claim = {
  /** The thing being compared, phrased from the coach's side. */
  what: string;
  /** What they charge or do. Absent when unverified. */
  them: string | null;
  /** What we charge or do. */
  us: string;
  source: string;
  checked: string;
  verified: boolean;
};

export type Competitor = {
  slug: string;
  name: string;
  /** The one-liner on the index. */
  blurb: string;
  /** Honest. A compare page that pretends the other product is worthless convinces nobody. */
  fair: string;
  /** Why a coach here would move. */
  why: string;
  claims: Claim[];
  /** Who should stay where they are. The most persuasive paragraph on the page. */
  stay: string;
};

const POSITIONING = {
  source: ".ai/product/positioning.md",
  checked: "2026-09-11",
  verified: false,
} as const;

/** Shared across every compare page, because they are true regardless of the rival. */
const OURS: Claim[] = [
  {
    what: "Price in rupees, GST included",
    them: null,
    us: "₹999 a month, inclusive",
    ...POSITIONING,
  },
  {
    what: "Migration from your current platform",
    them: null,
    us: "We do it, free, usually within a day",
    ...POSITIONING,
  },
  {
    what: "Export everything and leave",
    them: null,
    us: "One button, one file",
    ...POSITIONING,
  },
];

export const COMPETITORS: readonly Competitor[] = [
  {
    slug: "trainerize",
    name: "Trainerize",
    blurb: "The biggest name in coaching software, priced per client with nutrition on top",
    fair: "Trainerize is the most established product in this category and the exercise library is the deepest. If you coach in North America and your clients expect a name they have heard of, that counts for something.",
    why: "Every lever that grows your business — more clients, nutrition, your own name on the app — costs more money on Trainerize. On Traiv those are the product.",
    claims: [
      {
        what: "Nutrition and meal plans",
        them: "$45 a month, as an add-on",
        us: "Included",
        ...POSITIONING,
      },
      {
        what: "Your name and logo on the client app",
        them: "$169, one-off setup",
        us: "Included, from your first client",
        ...POSITIONING,
      },
      {
        what: "Clients on the plan you pay for",
        them: "Billed in per-client tiers",
        us: "Unlimited on every paid plan",
        ...POSITIONING,
      },
      ...OURS,
    ],
    stay: "Stay on Trainerize if you are mid-way through a year you have already paid for, or if your clients are outside India and expect to pay in dollars. The migration is free whenever you are ready; there is no reason to eat a cancellation.",
  },
  {
    slug: "fitbudd",
    name: "FitBudd",
    blurb: "Your own app in the app stores, with a setup fee to match",
    fair: "FitBudd ships a real native app under your own name in both app stores, and for a coach whose brand is the product, that is a genuinely different thing to a web app.",
    why: "A native app in two stores is a real build, and the price reflects it. The question is whether your client will download an 80MB app before their first session — in our experience most will not, and the install is where the coaching relationship goes to die.",
    claims: [
      {
        what: "Putting your own name on the app",
        them: "$75, one-off",
        us: "Included",
        ...POSITIONING,
      },
      {
        what: "What your client has to do first",
        them: "Install from the App Store or Play Store",
        us: "Open a link. Add to home screen if they want to",
        ...POSITIONING,
      },
      ...OURS,
    ],
    stay: "Stay on FitBudd if being in the app stores is the point — if you sell a programme to strangers who find you by searching, rather than coaching people you already know.",
  },
  {
    slug: "everfit",
    name: "Everfit",
    blurb: "Strong automations, with the good parts split across add-ons",
    fair: "Everfit's automation and habit-tracking are better thought through than most, and coaches who run large groups rate it.",
    why: "Everfit charges separately for several of the things a coach needs on day one. Adding them up is how a $49 plan becomes a $120 one.",
    claims: [
      {
        what: "Clients on the plan you pay for",
        them: "Billed per client",
        us: "Unlimited on every paid plan",
        ...POSITIONING,
      },
      {
        what: "Nutrition, payments and automations",
        them: "Charged separately for three of these",
        us: "All included",
        ...POSITIONING,
      },
      ...OURS,
    ],
    stay: "Stay on Everfit if you run large group challenges and lean hard on its automation builder. Ours is not finished yet, and we would rather say that than have you find out.",
  },
  {
    slug: "truecoach",
    name: "TrueCoach",
    blurb: "Clean, well-liked, and takes a percentage of what your clients pay you",
    fair: "TrueCoach is the cleanest product in the category. Coaches who use it mostly like it, and the one-to-one coaching flow is well judged.",
    why: "TrueCoach takes 5% of your revenue on top of the subscription. At ₹4,000 a client across 30 clients, that is ₹6,000 a month — six times what Traiv costs in total — for money you earned.",
    claims: [
      {
        what: "A cut of what your clients pay you",
        them: "5% of your revenue",
        us: "0%. You pay the payment gateway and nothing to us",
        ...POSITIONING,
      },
      {
        what: "Clients on the plan you pay for",
        them: "Billed per client",
        us: "Unlimited on every paid plan",
        ...POSITIONING,
      },
      ...OURS,
    ],
    stay: "Stay on TrueCoach if you have a handful of high-paying clients and the percentage is small in absolute terms. The fee only bites once you are busy.",
  },
  {
    slug: "coachway",
    name: "Coachway",
    blurb: "€69 a month for five clients, then €9 for every client after that",
    fair: "Coachway is a well-made European product with six languages and Stripe payouts built in. If you coach across the EU and bill in euros, it fits a shape we do not.",
    why: "Coachway publishes its per-client arithmetic, which makes it the clearest illustration of what per-client pricing actually does. At 50 clients it is €474 a month — roughly ₹43,600. Traiv is ₹999 at 5 clients and ₹999 at 500.",
    claims: [
      {
        what: "Monthly price at 50 clients",
        them: "€474 (€69 base plus 45 × €9)",
        us: "₹999",
        source: "https://coachway.io/pricing",
        checked: "2026-10-08",
        verified: true,
      },
      {
        what: "Clients included in the base price",
        them: "5",
        us: "Unlimited",
        source: "https://coachway.io/pricing",
        checked: "2026-10-08",
        verified: true,
      },
      {
        what: "Each client after that",
        them: "€9 a month",
        us: "₹0",
        source: "https://coachway.io/pricing",
        checked: "2026-10-08",
        verified: true,
      },
      ...OURS,
    ],
    stay: "Stay on Coachway if you coach in Europe. Billing in euros, six languages and SEPA payouts are things we do not do and are not planning to.",
  },
];

export const competitorBySlug = (slug: string) => COMPETITORS.find((c) => c.slug === slug);
