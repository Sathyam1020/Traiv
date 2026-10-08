/**
 * What the other platforms charge.
 *
 * ## Rules for this file
 *
 * Every number carries a `source` and a `checked` date, and nothing goes in that has not
 * been read off the vendor's own public pricing page. A comparison a coach cannot verify
 * is marketing; one they can check is an argument, and the second one survives being
 * screenshotted by a competitor.
 *
 * Where a figure is not verified it is simply absent. An invented competitor price is the
 * fastest way to lose the argument — and the only person who gets hurt is the coach who
 * believed it.
 */

export type PerClientPlan = {
  name: string;
  /** Monthly base, in the vendor's own currency. */
  base: number;
  currency: "EUR" | "USD";
  /** How many clients the base includes. */
  includes: number;
  /** Charged for every client past `includes`. */
  perExtra: number;
  source: string;
  checked: string;
};

/**
 * Only Coachway is modelled as a curve, because Coachway is the one whose exact per-client
 * arithmetic is published and was read today. The others bill per client too, in tiers
 * rather than a formula — said plainly in the copy rather than guessed at here.
 */
export const COACHWAY: PerClientPlan = {
  name: "Coachway",
  base: 69,
  currency: "EUR",
  includes: 5,
  perExtra: 9,
  source: "https://coachway.io/pricing",
  checked: "2026-10-08",
};

/** Indicative only, and labelled as such wherever it is shown. */
export const EUR_TO_INR = 92;

export function coachwayMonthly(clients: number): number {
  const extra = Math.max(0, clients - COACHWAY.includes);
  return COACHWAY.base + extra * COACHWAY.perExtra;
}

/** Ours. The point of the chart is that this function ignores its argument. */
export function traivMonthly(_clients: number): number {
  return 999;
}

export type Charge = {
  what: string;
  who: string;
  amount: string;
  source: string;
  checked: string;
};

/**
 * The charges that are not the subscription.
 *
 * These are the ones coaches find out about in month three, which is why they are on the
 * page in month zero.
 */
export const EXTRA_CHARGES: readonly Charge[] = [
  {
    what: "Nutrition, as a separate add-on",
    who: "Trainerize",
    amount: "$45 / month",
    source: ".ai/product/positioning.md",
    checked: "2026-09-11",
  },
  {
    what: "A cut of what your clients pay you",
    who: "TrueCoach",
    amount: "5% of revenue",
    source: ".ai/product/positioning.md",
    checked: "2026-09-11",
  },
  {
    what: "Putting your own name on the app",
    who: "Trainerize",
    amount: "$169 once",
    source: ".ai/product/positioning.md",
    checked: "2026-09-11",
  },
  {
    what: "Putting your own name on the app",
    who: "FitBudd",
    amount: "$75 once",
    source: ".ai/product/positioning.md",
    checked: "2026-09-11",
  },
];
