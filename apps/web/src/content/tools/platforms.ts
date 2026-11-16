/**
 * Coaching platform prices for the platform-cost, tool-stack and fit-finder tools.
 *
 * The same rule as `content/competitors.ts`: a price goes on the site only when it was read
 * off the vendor's own public page, with the URL and the date it was checked. Where the page
 * could not be read, hid its numbers behind a script, contradicted itself or asked for a
 * quote, `priceAt` returns null and the tools say "Check vendor price" instead of guessing.
 * Base subscriptions only: add-ons, taxes, payment fees and currency conversion are excluded.
 */

export const CHECKED = "2026-11-16";

export type Branding = "included" | "higher-tier" | "add-on" | "none" | "unknown";
export type PriceCurrency = "EUR" | "USD" | "INR";

export type Platform = {
  name: string;
  currency: PriceCurrency;
  /** Monthly base price at a client count, or null when the vendor doesn't publish one. */
  priceAt: (clients: number) => number | null;
  /** What that price covers at this client count. */
  covers: (clients: number) => string;
  branding: Branding;
  brandingNote: string;
  source: string;
  checked: string;
};

/** First tier whose limit covers the client count. */
const tiers = (rows: readonly (readonly [number, number, string])[]) => ({
  price: (n: number) => rows.find(([max]) => n <= max)?.[1] ?? null,
  covers: (n: number) => rows.find(([max]) => n <= max)?.[2] ?? "Above the largest published tier",
});

const hevy = tiers([
  [10, 25, "1–10 clients"],
  [25, 50, "11–25 clients"],
  [50, 90, "26–50 clients"],
  [100, 160, "51–100 clients"],
  [200, 250, "101–200 clients"],
  [300, 360, "201–300 clients"],
  [400, 460, "301–400 clients"],
  [500, 550, "401–500 clients"],
  [1000, 700, "501–1,000 clients"],
]);
const ptd = tiers([
  [3, 19.9, "Basic, up to 3 clients"],
  [25, 59.9, "Pro, up to 25 clients"],
  [50, 89.9, "Master, up to 50 clients"],
]);
const hubfit = tiers([
  [2, 0, "Free, up to 2 clients"],
  [50, 39, "Standard, up to 50 clients"],
  [100, 69, "Premium, up to 100 clients"],
  [200, 209, "Ultimate, up to 200 clients"],
  [300, 289, "Ultimate, up to 300 clients"],
  [400, 359, "Ultimate, up to 400 clients"],
  [500, 419, "Ultimate, up to 500 clients"],
]);
const everfit = tiers([
  [5, 0, "Starter (free), up to 5 clients"],
  [10, 29, "Pro, up to 10 clients"],
  [20, 49, "Pro, up to 20 clients"],
  [35, 75, "Pro, up to 35 clients"],
  [50, 95, "Pro, up to 50 clients"],
  [75, 120, "Pro, up to 75 clients"],
  [100, 140, "Pro, up to 100 clients"],
  [125, 160, "Pro, up to 125 clients"],
  [150, 180, "Pro, up to 150 clients"],
  [200, 220, "Pro, up to 200 clients"],
  [250, 255, "Pro, up to 250 clients"],
  [300, 290, "Pro, up to 300 clients"],
]);
const truecoach = tiers([
  [5, 26.34, "Starter, up to 5 active clients"],
  [20, 57.99, "Standard, up to 20 active clients"],
  [50, 136.99, "Pro, up to 50 active clients"],
]);
const practice = tiers([
  [3, 0, "Sprout (free), up to 3 clients"],
  [10, 35, "Starter, up to 10 clients"],
  [300, 69, "Professional, up to 300 clients"],
  [100000, 99, "Plus, unlimited clients"],
]);
const ca = tiers([
  [2, 20, "Starter, 2 clients"],
  [5, 40, "Level 1, 5 clients"],
  [10, 70, "Level 2, 10 clients"],
  [20, 120, "Level 3, 20 clients"],
  [35, 200, "Level 3.5, 35 clients"],
  [50, 250, "Level 4, 50 clients"],
  [75, 340, "Level 4.5, 75 clients"],
  [100, 400, "Level 5, 100 clients"],
  [150, 600, "Level 5.5, 150 clients"],
  [200, 800, "Level 6, 200 clients"],
]);

const kahunasRate = (n: number) =>
  n < 25 ? 5 : n < 50 ? 2.5 : n < 100 ? 2 : n < 200 ? 1.5 : n < 1000 ? 1 : 0.5;

const unpublished = (why: string) => ({ priceAt: () => null, covers: () => why });

export const PLATFORMS: Platform[] = [
  {
    name: "Traiv",
    currency: "INR",
    priceAt: () => 999,
    covers: () => "Trainer plan, one trainer",
    branding: "included",
    brandingNote: "Your name and logo in the client app on the Trainer plan.",
    source: "https://www.traiv.fit/pricing",
    checked: CHECKED,
  },
  {
    name: "Coachway",
    currency: "EUR",
    priceAt: (n) => 69 + Math.max(0, n - 5) * 9,
    covers: (n) => (n <= 5 ? "Up to 5 clients" : `5 clients plus ${n - 5} extra at EUR 9 each`),
    branding: "none",
    brandingNote: "The vendor states it does not sell custom branding or a white-label app.",
    source: "https://coachway.io/pricing/",
    checked: CHECKED,
  },
  {
    name: "Trainero",
    currency: "USD",
    priceAt: () => 30,
    covers: () => "Premium, unlimited clients, up to 200 plans (US page)",
    branding: "higher-tier",
    brandingNote: "Own-brand client app on the White Label plan, which is priced by sales.",
    source: "https://trainero.com/en-us/pricing",
    checked: CHECKED,
  },
  {
    name: "HubFit",
    currency: "USD",
    priceAt: hubfit.price,
    covers: hubfit.covers,
    branding: "higher-tier",
    brandingNote: "Custom branding from Premium (USD 69 a month).",
    source: "https://hubfit.com/pricing",
    checked: CHECKED,
  },
  {
    name: "Hevy Coach",
    currency: "USD",
    priceAt: hevy.price,
    covers: hevy.covers,
    branding: "none",
    brandingNote: "Clients are coached through the standard Hevy app; no branded app is listed.",
    source: "https://hevycoach.com/pricing",
    checked: CHECKED,
  },
  {
    name: "PT Distinction",
    currency: "USD",
    priceAt: ptd.price,
    covers: ptd.covers,
    branding: "higher-tier",
    brandingNote: "Custom-branded iOS and Android apps on Pro and Master, not Basic.",
    source: "https://www.ptdistinction.com/pricing",
    checked: CHECKED,
  },
  {
    name: "Kahunas",
    currency: "USD",
    priceAt: (n) => (n < 3 ? null : Math.round(kahunasRate(n) * n * 100) / 100),
    covers: (n) =>
      n < 3 ? "Plans start at 3 seats" : `${n} seats at USD ${kahunasRate(n).toFixed(2)} each`,
    branding: "higher-tier",
    brandingNote: "White label from the 200-seat band.",
    source: "https://kahunas.io/pricing",
    checked: CHECKED,
  },
  {
    name: "Practice Better",
    currency: "USD",
    priceAt: practice.price,
    covers: practice.covers,
    branding: "higher-tier",
    brandingNote:
      "Portal branding and a personalised URL on Plus; the page doesn't say whether the mobile app can be branded.",
    source: "https://practicebetter.io/pricing",
    checked: CHECKED,
  },
  {
    name: "Everfit",
    currency: "USD",
    priceAt: everfit.price,
    covers: everfit.covers,
    branding: "higher-tier",
    brandingNote: "Custom branding on Pro and above; a white-label app on Enterprise.",
    source: "https://everfit.io/pricing/",
    checked: CHECKED,
  },
  {
    name: "FitBudd",
    currency: "USD",
    priceAt: (n) => 79 + Math.max(0, n - 20) * 2,
    covers: (n) =>
      n <= 20 ? "Pro, 20 clients included" : `Pro, 20 clients plus ${n - 20} at USD 2 each`,
    branding: "higher-tier",
    brandingNote:
      "App theming on Pro; a fully white-labelled app on Super Pro (USD 149 a month plus USD 75 setup).",
    source: "https://www.fitbudd.com/pricing",
    checked: CHECKED,
  },
  {
    name: "TrueCoach",
    currency: "USD",
    priceAt: truecoach.price,
    covers: truecoach.covers,
    branding: "higher-tier",
    brandingNote: "Custom-branded app on Standard and Pro, not Starter.",
    source: "https://truecoach.co/pricing/",
    checked: CHECKED,
  },
  {
    name: "CoachAccountable",
    currency: "USD",
    priceAt: ca.price,
    covers: ca.covers,
    branding: "unknown",
    brandingNote: "The page mentions customising branding but doesn't describe a native app.",
    source: "https://www.coachaccountable.com/pricing",
    checked: CHECKED,
  },
  {
    name: "Trainerize",
    currency: "USD",
    ...unpublished(
      "The page shows conflicting figures for the same plans, so no price is quoted here.",
    ),
    branding: "add-on",
    brandingNote:
      "Custom branded app as a USD 169 one-time add-on on Pro; included on Studio Plus.",
    source: "https://www.trainerize.com/pricing/",
    checked: CHECKED,
  },
  {
    name: "FitSW",
    currency: "USD",
    ...unpublished(
      "The price for each client count is calculated by a script on the page, so it couldn't be read reliably.",
    ),
    branding: "unknown",
    brandingNote: "Custom branding options are on a separate page without prices.",
    source: "https://www.fitsw.com/pricing/",
    checked: CHECKED,
  },
  {
    name: "My PT Hub",
    currency: "EUR",
    ...unpublished("The pricing page couldn't be read when checked."),
    branding: "unknown",
    brandingNote: "Not checked; see the vendor page.",
    source: "https://www.mypthub.net/pricing",
    checked: CHECKED,
  },
  {
    name: "Paperbell",
    currency: "USD",
    ...unpublished("The pricing page couldn't be read when checked."),
    branding: "unknown",
    brandingNote: "Not checked; see the vendor page.",
    source: "https://paperbell.com/pricing",
    checked: CHECKED,
  },
  {
    name: "Exercise.com",
    currency: "USD",
    ...unpublished("Quote-based; no public monthly price."),
    branding: "unknown",
    brandingNote:
      "Custom-branded apps are listed as a feature; the package that includes them isn't stated.",
    source: "https://www.exercise.com/platform/pricing/",
    checked: CHECKED,
  },
  {
    name: "Virtuagym",
    currency: "EUR",
    ...unpublished("Pricing is given on request after a demo."),
    branding: "unknown",
    brandingNote: "The pricing page doesn't mention a branded app.",
    source: "https://business.virtuagym.com/our-prices/",
    checked: CHECKED,
  },
];

export const BRANDING_LABEL: Record<Branding, string> = {
  included: "Included",
  "higher-tier": "Higher tier",
  "add-on": "Paid add-on",
  none: "Not offered",
  unknown: "Not stated",
};

/* ---------------------------------------------------------- tool stack */

export type StackTool = { key: string; label: string; price: number; note: string; source: string };

/** List prices read off each vendor page on CHECKED, as shown (USD). Edit to match your invoices. */
export const STACK_TOOLS: StackTool[] = [
  {
    key: "workout",
    label: "Workout builder",
    price: 57.99,
    note: "TrueCoach Standard, up to 20 active clients",
    source: "https://truecoach.co/pricing/",
  },
  {
    key: "meal",
    label: "Meal planning",
    price: 30,
    note: "That Clean Life Starter, billed monthly",
    source: "https://www.thatcleanlife.com/pricing/",
  },
  {
    key: "forms",
    label: "Check-in forms",
    price: 39,
    note: "Typeform Basic, billed monthly",
    source: "https://www.typeform.com/pricing/",
  },
  {
    key: "scheduling",
    label: "Scheduling",
    price: 10,
    note: "Calendly Standard, per seat as listed",
    source: "https://calendly.com/pricing",
  },
  {
    key: "storage",
    label: "File storage",
    price: 9.99,
    note: "Dropbox Plus, 2 TB, billed monthly",
    source: "https://www.dropbox.com/plans",
  },
  {
    key: "community",
    label: "Community platform",
    price: 89,
    note: "Circle Professional, as listed (annual billing basis)",
    source: "https://circle.so/pricing",
  },
  {
    key: "payments",
    label: "Payment processing",
    price: 0,
    note: "Usually a fee on each payment rather than a subscription",
    source: "",
  },
];

/**
 * USD→INR rate used once to turn the USD list prices above into rupee starting points for
 * the default comparison with Traiv (priced in INR). x-rates.com, 16 Nov 2026 07:42 UTC.
 * The currency switch itself never converts anything the coach types.
 */
export const USD_INR = {
  rate: 93.97,
  source: "https://www.x-rates.com/calculator/?from=USD&to=INR&amount=1",
  checked: CHECKED,
};
export const inrDefault = (usd: number) => Math.round(usd * USD_INR.rate);

/** Platforms with a published price at any client count, for the stack comparison. */
export const COMPARABLE = PLATFORMS.filter((p) => p.priceAt(15) !== null || p.name === "Traiv");
