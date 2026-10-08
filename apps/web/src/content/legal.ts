/**
 * Terms, privacy and refunds.
 *
 * ## Read this before editing
 *
 * These are **drafts**, written to be a complete and honest starting point rather than
 * filler — but they have not been reviewed by a lawyer, and three things in them are
 * placeholders that only the company can fill in:
 *
 * - `ENTITY` — the registered name and address of the company
 * - `GSTIN` — the GST registration number that has to appear on every invoice
 * - `CONTACT` — the address for notices, and the Grievance Officer the DPDP Act requires
 *
 * The notice at the top of each page says they are not yet in force, which is true:
 * signing up is not open, so nobody has agreed to anything. **Before the product takes a
 * single payment, these need a lawyer and those three values.** A payment gateway will
 * also ask for them, so this is not a problem that can be deferred past launch.
 *
 * Specific obligations these are drafted against, for whoever reviews them:
 * - Digital Personal Data Protection Act, 2023 — consent, purpose limitation, the right
 *   to erasure, a named Grievance Officer, breach notification.
 * - Consumer Protection (E-Commerce) Rules, 2020 — published refund policy, contact
 *   details, no misleading endorsements.
 * - CGST Act — tax invoice contents, which is why GSTIN is non-negotiable.
 */

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  /** Shown as "Last updated". Bump it whenever a clause changes. */
  updated: string;
  sections: { heading: string; paras: string[] }[];
};

const ENTITY = "[registered company name]";
const CONTACT = "[contact address]";

export const LEGAL: readonly LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of service",
    summary:
      "What you are agreeing to when you use Traiv, what we promise, and what happens if either of us wants to stop.",
    updated: "2026-10-08",
    sections: [
      {
        heading: "Who this agreement is between",
        paras: [
          `Traiv is operated by ${ENTITY} ("we", "us"). These terms apply between us and the coach who creates an account ("you").`,
          "Your clients are not party to this agreement. They use the product under your branding, at no cost, and the relationship between you and them is yours — including the coaching itself, what you charge for it, and any dispute about it.",
        ],
      },
      {
        heading: "What you are responsible for",
        paras: [
          "The coaching. Traiv is software: it calculates, stores, schedules and delivers. It does not decide whether a programme is appropriate for a particular person, and nothing it produces is medical advice.",
          "You are responsible for holding whatever qualification and insurance your practice requires, for screening your clients, and for referring anybody to a doctor when that is the right call. Where a calculated target is flagged for review, that review is yours.",
          "You are also responsible for having your clients' consent to put their personal data into the product, and for what you then do with it.",
        ],
      },
      {
        heading: "What we are responsible for",
        paras: [
          "Running the service, keeping your data and your clients' data secure, and not using it for anything except providing the service to you. We do not sell it, and we do not train models on your clients' personal data.",
          "We will give you at least 30 days' notice before a change that materially reduces what the service does, and we will not raise the price on an existing subscription. Whatever you signed up at is what you keep paying for as long as the subscription runs continuously.",
          "We do not promise the service is never unavailable. We do promise to tell you when it is.",
        ],
      },
      {
        heading: "Your data, and leaving",
        paras: [
          "Your content is yours. Clients, plans, logs, measurements, photos and messages belong to you and your clients, not to us.",
          "You can export all of it at any time, in one action, in a machine-readable file — including while your account is being cancelled. You can cancel from inside the product without contacting us.",
          "After cancellation we keep your data for 30 days so an accidental cancellation can be undone, then delete it. You can ask us to delete it immediately instead, and we will.",
        ],
      },
      {
        heading: "Acceptable use",
        paras: [
          "Do not use Traiv to send anything your clients have not agreed to receive, to impersonate somebody else, to resell access to coaches who are not on their own subscription, or to store data you have no right to hold.",
          "We can suspend an account that is doing any of those, and we will tell you why.",
        ],
      },
      {
        heading: "Liability",
        paras: [
          "Nothing in these terms limits liability that cannot be limited by law.",
          "Beyond that, our total liability to you for any claim is limited to what you paid us in the twelve months before the claim. We are not liable for lost revenue or lost clients, which is the normal position for software at this price and is stated plainly rather than buried.",
        ],
      },
      {
        heading: "Changes, and the law that applies",
        paras: [
          "We will post a changed version here with a new date, and tell you by email if the change affects your rights. Continuing to use the service after that is acceptance.",
          `This agreement is governed by the laws of India, and the courts of [jurisdiction] have exclusive jurisdiction. Notices to us go to ${CONTACT}.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary:
      "What we collect, why, how long we keep it, and what you and your clients can ask us to do with it.",
    updated: "2026-10-08",
    sections: [
      {
        heading: "The short version",
        paras: [
          "We collect what the product needs to work and nothing else. We do not sell personal data, we do not run advertising trackers, and we do not train models on your clients' health information.",
          "Two roles matter here, and they are different. For your account, we decide what is collected — we are the Data Fiduciary. For your clients' data, you decide: you chose to add them, you chose what to record, and we process it on your instructions.",
        ],
      },
      {
        heading: "What we collect about you, the coach",
        paras: [
          "Your name, phone number, email address and business name, because the account needs them. Payment records, because tax law requires us to keep them. Basic logs of what the application did, because that is how outages get fixed.",
          "We do not collect your contacts, your location, or anything from your device beyond what the browser sends with a request.",
        ],
      },
      {
        heading: "What your clients' data is used for",
        paras: [
          "Health and body information — weight, measurements, photos, conditions you record, what they ate and what they lifted — exists so the product can produce their plan and show their progress to you and to them.",
          "It is used for nothing else. It is not aggregated into a dataset we sell, it is not shown to other coaches, and it is not used to train a model. Where the product asks an AI service to compose a meal plan or a workout, it sends what that task needs and no identifying detail, and the calorie target itself is calculated by us rather than by a model.",
          "Your clients can see everything held about them from inside their own app, and can ask you or us to delete it.",
        ],
      },
      {
        heading: "Who else sees it",
        paras: [
          "A small number of services we cannot run without: hosting and the database, the payment gateway, the service that delivers messages, the service that stores images, and an AI provider for generating plan content. Each gets the minimum the job needs.",
          "Nobody on our team reads a client's data except to fix a specific problem you have reported, and support access to an account is logged.",
        ],
      },
      {
        heading: "How long we keep it",
        paras: [
          "While the account is active, and for 30 days after cancellation so a mistake can be undone. Then it is deleted.",
          "Payment and invoice records are kept for as long as tax law requires, which is longer. Those contain the transaction, not health information.",
        ],
      },
      {
        heading: "Your rights under the DPDP Act",
        paras: [
          "You can ask what we hold, ask for it to be corrected, ask for it to be erased, and withdraw consent — and we have to act on each within a reasonable time. Withdrawing consent for something the service depends on will end the service.",
          `Those requests, and any complaint, go to our Grievance Officer at ${CONTACT}. If you are not satisfied with the answer, you can escalate to the Data Protection Board of India.`,
          "If there is a breach affecting your data, we will tell you and the Board, with what happened and what to do about it.",
        ],
      },
      {
        heading: "Cookies, and what this website stores",
        paras: [
          "This marketing site sets no advertising or tracking cookies, and there is nothing to consent to.",
          "The product itself stores a session so you stay signed in, and keeps a local copy of what your client logged so that logging works in a gym with no signal. Neither is used to track anybody across other websites.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refunds and cancellation",
    summary:
      "How to cancel, what you get back, and the one case where we refund without being asked.",
    updated: "2026-10-08",
    sections: [
      {
        heading: "Cancelling",
        paras: [
          "One button in your settings, and it takes effect immediately. There is no email to send, no call to sit through, and no retention offer. That is a published promise, not a courtesy.",
          "You keep access until the end of the period you have paid for, and you can export everything at any point — including after cancelling.",
        ],
      },
      {
        heading: "Monthly plans",
        paras: [
          "Cancel any time and you are not charged again. We do not refund part of a month already started, because the month has been used.",
          "If you were charged after cancelling, that is our error and the full amount comes back.",
        ],
      },
      {
        heading: "Yearly plans",
        paras: [
          "Cancel within 14 days of paying and the whole amount comes back, no questions.",
          "After 14 days we refund the unused whole months, keeping the months you used at the monthly rate rather than the discounted yearly one. So a yearly subscriber who leaves after five months is charged five months at the monthly price and refunded the difference.",
        ],
      },
      {
        heading: "When we refund without being asked",
        paras: [
          "If the service is unavailable for more than 24 hours in a billing period because of something on our side, we refund that period. You do not have to notice, ask, or prove it.",
        ],
      },
      {
        heading: "The free plan",
        paras: [
          "There is nothing to cancel and nothing to refund. It has no card on it, no trial clock, and no expiry.",
        ],
      },
      {
        heading: "How to ask",
        paras: [
          `Message us from inside the product, or write to ${CONTACT}. We will answer within three working days, and a refund we have agreed reaches your account by the same route it was paid, usually within a week.`,
        ],
      },
    ],
  },
];

export const legalBySlug = (slug: string) => LEGAL.find((d) => d.slug === slug);
