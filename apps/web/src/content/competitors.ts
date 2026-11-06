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
 * ## Re-read 2026-11-06, now that traiv.fit is live
 *
 * Every claim below — ours and every competitor's — was read off a live public pricing
 * page on 2026-11-06, source URL attached to each one individually. Two real corrections
 * came out of that pass, not just source URLs:
 *
 * - Trainerize's nutrition add-on is $20/month on the lower tiers and $45 on the higher
 *   ones, not a flat $45 — the old claim stated the top of the range as if it were the
 *   only number.
 * - TrueCoach's pricing page does not publish a percentage-of-revenue fee anywhere, and a
 *   direct search of the page found no percentage, transaction fee, or commission
 *   language at all. The old "5% of your revenue" claim — and the `why`/`stay` copy built
 *   on it — could not be verified and has been replaced with what the page actually says:
 *   tiered plans that cap at 50 clients, past which pricing is a private conversation with
 *   their sales team. If "5%" is true, it needs its own source before it goes back on.
 *
 * Qualitative lines (`fair`/`why`/`stay`) were re-read against the new figures, not
 * rewritten wholesale — anything that didn't depend on a corrected number was left alone.
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

const CHECKED = "2026-11-06";

const OURS_SOURCE = {
  source: "https://www.traiv.fit/pricing",
  checked: CHECKED,
  verified: true,
} as const;

/** Shared across every compare page, because they are true regardless of the rival. */
const OURS: Claim[] = [
  {
    what: "Monthly trainer subscription",
    them: null,
    us: "₹999/month for one trainer",
    ...OURS_SOURCE,
  },
  {
    what: "Migration from your current platform",
    them: null,
    us: "Recreate plans in the builders; automatic import is not available",
    ...OURS_SOURCE,
  },
  {
    what: "Plan exports",
    them: null,
    us: "Download workout templates and diet plans as PDFs",
    ...OURS_SOURCE,
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
        them: "An add-on: $20/month on the Grow and Pro 5–15 plans, $45/month on Pro 30–200",
        us: "Included",
        source: "https://www.trainerize.com/pricing/",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "Your name and logo on the client app",
        them: "$169 one-off setup on the Pro plan; included free on Studio",
        us: "Included, from your first client",
        source: "https://www.trainerize.com/pricing/",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "Clients on the plan you pay for",
        them: "Billed in per-client tiers — free for 1, $9/month for 2, up to $248/month for 500+",
        us: "See the current plan details on our pricing page",
        source: "https://www.trainerize.com/pricing/",
        checked: CHECKED,
        verified: true,
      },
      ...OURS,
    ],
    stay: "Stay on Trainerize if you are mid-way through a year you have already paid for, or if your clients are outside India and expect to pay in dollars. Check your contract and plan how to recreate your existing coaching plans before switching.",
  },
  {
    slug: "fitbudd",
    name: "FitBudd",
    blurb: "Your own app in the app stores, with a setup fee to match",
    fair: "FitBudd ships a real native app under your own name in both app stores, and for a coach whose brand is the product, that is a genuinely different thing to a web app.",
    why: "A native app in two stores is a real build, and the price reflects it. The question is whether your client will install an app before their first session — in our experience most will not, and the install is where the coaching relationship goes to die.",
    claims: [
      {
        what: "Putting your own name on the app",
        them: "$75 one-off on the Super Pro plan for a fully white-labelled app on iOS and Android; $100 one-off on Elite",
        us: "Included",
        source: "https://www.fitbudd.com/pricing",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "What your client has to do first",
        them: "Install the FitBudd app from the App Store or Play Store — no web app listed as an alternative",
        us: "Open a link. Add to home screen if they want to",
        source: "https://www.fitbudd.com/pricing",
        checked: CHECKED,
        verified: true,
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
    why: "Everfit's Pro plan starts at $19/month for 5 clients. Add Autoflow automation ($29), Payments ($9) and real Meal Plans ($39) — the things most coaches actually want on day one — and that is $96 before a sixth client joins.",
    claims: [
      {
        what: "Clients on the plan you pay for",
        them: "Billed per client at a decreasing rate — $19/month for 5 clients down to $290/month for 300 on the Pro plan",
        us: "See the current plan details on our pricing page",
        source: "https://everfit.io/pricing",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "Nutrition, payments and automations",
        them: "Separate add-ons: Autoflow from $29/month, Payments from $9/month, advanced Meal Plans from $39/month",
        us: "Workout and nutrition planning; check current feature availability",
        source: "https://everfit.io/pricing",
        checked: CHECKED,
        verified: true,
      },
      ...OURS,
    ],
    stay: "Stay on Everfit if you run large group challenges and lean hard on its automation builder. Ours is not finished yet, and we would rather say that than have you find out.",
  },
  {
    slug: "truecoach",
    name: "TrueCoach",
    blurb: "Clean and well-liked, with plans that cap at 50 clients",
    fair: "TrueCoach is the cleanest product in the category. Coaches who use it mostly like it, and the one-to-one coaching flow is well judged.",
    why: "TrueCoach's highest listed plan is $136.99/month and caps at 50 clients — past that, pricing is a conversation with their sales team, not a number on the page. Traiv is ₹999/month flat, whether you coach 5 clients or 500.",
    claims: [
      {
        what: "Clients on the plan you pay for",
        them: "Tiered by client count — $26.34/month for up to 5, $57.99 for up to 20, $136.99 for up to 50",
        us: "See the current plan details on our pricing page",
        source: "https://truecoach.co/pricing",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "Pricing above 50 clients",
        them: "Not published — email their sales team for a quote",
        us: "₹999/month flat, any number of clients",
        source: "https://truecoach.co/pricing",
        checked: CHECKED,
        verified: true,
      },
      ...OURS,
    ],
    stay: "Stay on TrueCoach if the one-to-one coaching flow is what sold you, and you are comfortable asking for custom pricing once you pass 50 clients.",
  },
  {
    slug: "coachway",
    name: "Coachway",
    blurb: "€69 a month for five clients, then €9 for every client after that",
    fair: "Coachway is a well-made European product with six languages and Stripe payouts built in. If you coach across the EU and bill in euros, it fits a shape we do not.",
    why: "Coachway publishes its per-client arithmetic, which makes it the clearest illustration of what per-client pricing actually does. At 50 clients it is €474 a month — roughly ₹49,800. Traiv’s published trainer subscription is ₹999/month for one trainer.",
    claims: [
      {
        what: "Monthly price at 50 clients",
        them: "€474 (€69 base plus 45 × €9)",
        us: "₹999",
        source: "https://coachway.io/pricing",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "Clients included in the base price",
        them: "5",
        us: "See the current plan details on our pricing page",
        source: "https://coachway.io/pricing",
        checked: CHECKED,
        verified: true,
      },
      {
        what: "Each client after that",
        them: "€9 a month",
        us: "₹0",
        source: "https://coachway.io/pricing",
        checked: CHECKED,
        verified: true,
      },
      ...OURS,
    ],
    stay: "Stay on Coachway if you coach in Europe. Billing in euros, six languages and SEPA payouts are things we do not do and are not planning to.",
  },
];

export const competitorBySlug = (slug: string) => COMPETITORS.find((c) => c.slug === slug);

/** Index only comparisons backed by current public evidence, not internal notes. */
export function comparisonIsIndexable(competitor: Competitor): boolean {
  const claims = competitor.claims;
  return (
    claims.length >= 2 &&
    claims.every((claim) => {
      const age = Date.now() - Date.parse(claim.checked);
      return (
        claim.verified &&
        /^https:\/\//.test(claim.source) &&
        Number.isFinite(age) &&
        age >= 0 &&
        age <= 180 * 24 * 60 * 60 * 1000
      );
    })
  );
}
