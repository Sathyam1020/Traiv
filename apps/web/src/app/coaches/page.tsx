import type { Metadata } from "next";
import { ClosingCta } from "@/components/marketing-sections";
import { ProductScene } from "@/components/product-scenes";
import { TrialLink } from "@/components/trial-link";
export const metadata: Metadata = {
  title: "For personal trainers",
  description:
    "Build workout and diet plans, review client check-ins and collect coaching fees in Traiv. ₹999/month for one trainer.",
  alternates: { canonical: "/coaches" },
};
export default function CoachesPage() {
  return (
    <>
      <section className="subpage-hero marketing-container">
        <span className="section-note">For personal trainers</span>
        <h1>
          Your coaching method.
          <br />A connected workspace.
        </h1>
        <p className="page-lede">
          Build the plan, follow your client's week and keep the conversation in context. ₹999 per
          month for one trainer.
        </p>
        <TrialLink location="coaches" />
      </section>
      <section className="marketing-section">
        <div className="marketing-container workflow-row">
          <div className="workflow-copy">
            <h2>
              Start with
              <br />
              your next client.
            </h2>
            <p>
              Create a workout and diet plan around their routine. Clients open Traiv on their
              phone, log their progress and send check-ins for you to review.
            </p>
            <p>
              Add your name and logo in the app, so your coaching feels familiar from the first
              visit.
            </p>
          </div>
          <ProductScene kind="phone" />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
