import { ArrowUpRight } from "@traiv/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta, PricingCards } from "@/components/marketing-sections";
import { ProductScene } from "@/components/product-scenes";
import { TrialLink } from "@/components/trial-link";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({
  title: "Coaching software for gyms",
  description:
    "Bring your gym's workout plans, diet plans, check-ins and client fees into Traiv. ₹2,499/month for gyms with 3+ trainers.",
  alternates: { canonical: "/gyms" },
});
export default function GymsPage() {
  return (
    <>
      <section className="subpage-hero traiv-content-wrap">
        <span className="section-note">Traiv for gyms</span>
        <h1>
          One gym.
          <br />
          Connected coaching.
        </h1>
        <p className="page-lede">
          Give your trainers a place for workout plans, diet plans and client progress, with your
          gym's name and logo in the app.
        </p>
        <TrialLink location="gyms-hero" plan="gym" />
        <p className="section-note" style={{ marginTop: 12 }}>
          14 days free
        </p>
      </section>
      <section className="marketing-section">
        <div className="traiv-content-wrap workflow-row">
          <div className="workflow-copy">
            <h2>
              The coaching stays
              <br />
              with the client.
            </h2>
            <p>
              Keep assigned plans, check-in answers and measurements together. Trainers can review
              the client's week before deciding what comes next.
            </p>
          </div>
          <ProductScene />
        </div>
      </section>
      <section className="marketing-section payment-section">
        <div className="traiv-content-wrap workflow-row workflow-reverse">
          <div className="workflow-copy">
            <h2>
              Your gym's name
              <br />
              on their phone.
            </h2>
            <p>
              Clients see your name and logo within Traiv. They can open it in the browser or add it
              to their home screen on Android and iPhone.
            </p>
          </div>
          <ProductScene kind="brand" />
        </div>
      </section>
      <section className="marketing-section">
        <div className="traiv-content-wrap">
          <div className="section-intro">
            <h2>For your training team.</h2>
            <p>₹2,499 per month for gyms with 3+ trainers.</p>
          </div>
          <PricingCards />
        </div>
      </section>
      <section className="marketing-section" id="contact">
        <div className="traiv-content-wrap section-intro">
          <h2>
            Let's talk about
            <br />
            your gym.
          </h2>
          <p>Want to walk through your coaching setup before starting?</p>
          <Link className="trial-link" style={{ marginTop: 24 }} href="/demo">
            Talk to us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
