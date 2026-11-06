import type { Metadata } from "next";
import { ClosingCta } from "@/components/marketing-sections";
import { ProductScene } from "@/components/product-scenes";
export const metadata: Metadata = {
  title: "About Traiv",
  description:
    "Traiv connects workout plans, diet plans, client check-ins and payments for personal trainers and gyms.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <>
      <section className="subpage-hero traiv-content-wrap">
        <span className="section-note">About Traiv</span>
        <h1>
          Built around
          <br />
          the work of coaching.
        </h1>
        <p className="page-lede">
          A plan in one file. Updates in another conversation. Progress somewhere else. Traiv brings
          the coaching back together.
        </p>
      </section>
      <section className="marketing-section">
        <div className="traiv-content-wrap workflow-row">
          <div className="workflow-copy">
            <h2>
              One routine.
              <br />
              Both sides.
            </h2>
            <p>
              Trainers build plans and review progress. Clients follow those plans and log their
              week. Traiv gives each side a place to do their part.
            </p>
            <p>
              Made for personal trainers and gyms, with ₹ pricing and your name and logo in
              the app.
            </p>
          </div>
          <ProductScene />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
