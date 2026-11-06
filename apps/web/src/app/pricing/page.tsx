import type { Metadata } from "next";
import { ClosingCta, MarketingFaq, PricingCards } from "@/components/marketing-sections";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({
  title: "Pricing for trainers and gyms",
  description:
    "Traiv is ₹999/month for one trainer and ₹2,499/month for gyms with 3+ trainers. Start your 14-day free trial.",
  alternates: { canonical: "/pricing" },
});
export default function PricingPage() {
  return (
    <>
      <section className="subpage-hero traiv-content-wrap">
        <span className="section-note">Traiv pricing</span>
        <h1>
          Your coaching.
          <br />A plan that fits.
        </h1>
        <p className="page-lede">
          ₹999 per month for one trainer. ₹2,499 per month for gyms with 3+ trainers. Start with a
          14-day free trial.
        </p>
      </section>
      <section className="marketing-section" style={{ paddingTop: 20 }}>
        <div className="traiv-content-wrap">
          {/* The hero's own lede already states both prices, so this doesn't need to be
              visible — but PricingCards' own heading starts at h3, and without a real h2
              between the h1 above and that h3, the page skips a level. */}
          <h2 className="sr-only">Plans</h2>
          <PricingCards />
        </div>
      </section>
      <MarketingFaq />
      <ClosingCta />
    </>
  );
}
