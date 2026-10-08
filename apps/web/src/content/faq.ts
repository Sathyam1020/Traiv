export type Question = { q: string; a: string };

/**
 * The objections, answered plainly.
 *
 * Shared by the landing page and the pricing page rather than written twice, because the
 * answer to "do you take a cut" drifting between two pages is exactly the kind of thing
 * that reads as a company not knowing its own terms.
 */
export const GENERAL_FAQ: readonly Question[] = [
  {
    q: "Do my clients need to download anything?",
    a: "No. It opens in their browser and installs to their home screen if they want it there. No app store, no 80MB download on a 4G connection.",
  },
  {
    q: "I am already on Trainerize. Is moving painful?",
    a: "We will do it for you — clients, plans and history — at no cost. It usually takes a day.",
  },
  {
    q: "Do you take a cut of what my clients pay me?",
    a: "No. You pay the payment gateway's fee and nothing to us.",
  },
  {
    q: "What happens to my data if I leave?",
    a: "One button, one file, everything in it. Cancelling is also one button — no email, no call.",
  },
  {
    q: "Will the price go up?",
    a: "For new coaches, yes, eventually. Not for you. Whatever you sign up at is what you keep paying, permanently, and we will say so in writing.",
  },
];

export const PRICING_FAQ: readonly Question[] = [
  {
    q: "What happens when I go past one client on the free plan?",
    a: "We tell you, and adding the second one asks you to move to Pro. We never bill you a surprise, and nothing you have already built goes away.",
  },
  {
    q: "Is ₹999 really unlimited clients?",
    a: "Yes, and it is the whole reason this product exists. The price is the same at 5 clients and at 500. If we ever change that, it will not be for anyone who signed up before we did.",
  },
  {
    q: "Is GST included?",
    a: "Yes. ₹999 is what leaves your account. Your invoice shows the GST split and carries a GSTIN you can claim against.",
  },
  {
    q: "What does the annual plan save me?",
    a: "Two months. ₹9,990 instead of ₹11,988 on Pro, ₹24,990 instead of ₹29,988 on Studio.",
  },
  {
    q: "Can I pay by UPI?",
    a: "Yes, and by card or netbanking. Annual plans can be paid by bank transfer if you would rather.",
  },
  {
    q: "What is the difference between Pro and Studio?",
    a: "Seats. Pro is one coach with unlimited clients. Studio is up to five coaches sharing one roster, with per-coach permissions — for a gym or a team coaching under one name.",
  },
  {
    q: "Do I need a card to start?",
    a: "No. The free plan has no card and no trial clock on it.",
  },
  ...GENERAL_FAQ,
];
