export type Question = { q: string; a: string };
export const GENERAL_FAQ: readonly Question[] = [
  {
    q: "Do clients need an app store download?",
    a: "No. Traiv opens in the browser on Android and iPhone. Clients can add it to their home screen.",
  },
  {
    q: "Can I bring existing plans?",
    a: "Recreate your plans in the builders and save templates for reuse. There is no automatic import from Excel or WhatsApp.",
  },
  {
    q: "Can clients see my name and logo?",
    a: "Yes. Your name and logo appear within Traiv. This does not create a separate app store listing.",
  },
];
export const PRICING_FAQ: readonly Question[] = [
  {
    q: "How much does Traiv cost?",
    a: "₹999/month for one trainer, or ₹2,499/month for gyms with 3+ trainers.",
  },
  { q: "Can I try it first?", a: "Yes. Start your 14-day free trial." },
];
