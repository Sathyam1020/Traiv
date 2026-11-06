import { Check, Plus } from "@traiv/ui/icons";
import Link from "next/link";
import { rupees, TIERS } from "@/content/site";
import { TrialLink } from "./trial-link";
export function PricingCards() {
  return (
    <div className="pricing-cards">
      {TIERS.map((t) => (
        <article className={`price-card ${t.hero ? "price-featured" : ""}`} key={t.name}>
          <div className="price-label">
            <h3>{t.name}</h3>
            <span>{t.limit}</span>
          </div>
          <p>{t.summary}</p>
          <div className="price-number">
            {rupees(t.monthly)}
            <span>/month</span>
          </div>
          <ul>
            {t.features.map((f) => (
              <li key={f}>
                <Check aria-hidden="true" size={17} />
                {f}
              </li>
            ))}
          </ul>
          <TrialLink location="pricing" plan={t.name.toLowerCase()} />
          <small>14 days free</small>
          {t.name === "Gym" ? (
            <Link className="quiet-link" href="/gyms">
              Explore Traiv for gyms
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
export const HOME_FAQ = [
  [
    "What is Traiv?",
    "Traiv is fitness coaching software for personal trainers and gyms. Trainers create workout and diet plans, review client check-ins and share resources; clients follow their plans and log progress from their phone.",
  ],
  [
    "Do my clients need to download an app?",
    "Traiv works in the browser on Android and iPhone. Clients can add it to their home screen. There is no app store download.",
  ],
  [
    "Can I add my own name and logo?",
    "Yes. Add your name and logo for clients to see in the app. Clients still use Traiv; this does not create a separate app store listing.",
  ],
  [
    "How do I collect fees from clients?",
    "Collect client fees through Razorpay in Traiv. Payment processing charges and settlement terms are determined by your payment provider.",
  ],
  [
    "Can I bring my existing workout and diet plans?",
    "You can recreate your plans using Traiv's workout and diet plan builders, then reuse templates and duplicate plans. There is no automatic Excel or WhatsApp import.",
  ],
  [
    "Can a gym with multiple trainers use Traiv?",
    "Yes. The gym subscription is ₹2,499 per month for gyms with 3+ trainers. The individual trainer subscription is ₹999 per month.",
  ],
  [
    "What happens after the 14-day trial?",
    "The trial gives you 14 days to explore Traiv. You can then choose the Trainer subscription at ₹999/month or the Gym subscription at ₹2,499/month.",
  ],
  [
    "Can I share documents with clients?",
    "Yes. Upload resources to your vault and assign them to clients. Clients can open their shared resources in Traiv.",
  ],
  [
    "Can I export my plans?",
    "Workout templates and diet plans can be downloaded as PDFs. This is a plan export, rather than a complete account-data export.",
  ],
] as const;
export function MarketingFaq() {
  return (
    <section className="marketing-section faq-section" id="questions">
      <div className="traiv-content-wrap faq-layout">
        <div>
          <span className="section-note">A few things you might be wondering</span>
          <h2>
            Before you
            <br />
            get started.
          </h2>
        </div>
        <div>
          {HOME_FAQ.map(([q, a]) => (
            <details className="marketing-faq" key={q}>
              <summary>
                {q}
                <Plus aria-hidden="true" size={19} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ClosingCta() {
  return (
    <section className="marketing-close">
      <div className="traiv-content-wrap">
        <span className="section-note">Your next client. Your next chapter.</span>
        <h2>
          Give your coaching
          <br />a place to grow.
        </h2>
        <p>
          Workout plans, diet plans, check-ins and fees.
          <br />
          Together in Traiv.
        </p>
        <TrialLink location="closing" />
        <small>14 days free</small>
      </div>
    </section>
  );
}
