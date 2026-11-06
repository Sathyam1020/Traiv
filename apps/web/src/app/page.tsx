import { ArrowUpRight, Play } from "@traiv/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { CustomerStories } from "@/components/customer-stories";
import { ClosingCta, MarketingFaq, PricingCards } from "@/components/marketing-sections";
import { ProductScene } from "@/components/product-scenes";
import { TrialLink } from "@/components/trial-link";
export const metadata: Metadata = {
  title: "Coaching app for personal trainers and gyms",
  description:
    "Build workout and diet plans, review check-ins and collect client fees in Traiv. Your name and logo in the app. From ₹999/month. Start your 14-day free trial.",
  alternates: { canonical: "/" },
};
export default function HomePage() {
  return (
    <>
      <section className="marketing-hero">
        <div className="traiv-content-wrap hero-layout">
          <div className="hero-copy">
            <span className="hero-context">
              <span />
              For personal trainers
            </span>
            <h1>
              More coaching.
              <br />
              Less chasing.
            </h1>
            <p>
              Workout plans, diet plans, check-ins and payments. One place for your coaching, with
              your name and logo in the app.
            </p>
            <div className="hero-actions">
              <TrialLink location="hero" />
              <a className="secondary-link" href="#how-it-works">
                <span className="play-outline" aria-hidden="true">
                  <Play aria-hidden="true" size={13} />
                </span>
                See how it works
              </a>
            </div>
            <small>14 days free</small>
            <div className="hero-footnote">
              Coaching with a team? <Link href="/gyms">Meet Traiv for gyms</Link>
            </div>
          </div>
          <div className="hero-product">
            <div className="hero-trainer">
              <ProductScene />
            </div>
            <div className="hero-phone">
              <ProductScene kind="phone" />
            </div>
            <div className="hero-product-label">
              <span />
              One client. Both sides of the story.
            </div>
          </div>
        </div>
      </section>
      <section className="replaces-strip">
        <div className="traiv-content-wrap">
          <p>
            Fewer places to check.
            <br />
            <strong>More time for your clients.</strong>
          </p>
          <div>
            <span>Excel sheets</span>
            <span>WhatsApp follow-ups</span>
            <span>PDF diet charts</span>
            <span>Payment reminders</span>
          </div>
        </div>
      </section>
      <section className="marketing-section workflow-section" id="how-it-works">
        <div className="traiv-content-wrap">
          <div className="section-intro">
            <span className="section-note">Your coaching, connected</span>
            <h2>
              One client.
              <br />
              One clear routine.
            </h2>
            <p>Build their plan. Follow their progress. Know what to do next.</p>
          </div>
          <div className="workflow-row">
            <div className="workflow-copy">
              <span className="step-number">01 / Build the plan</span>
              <h3>
                Your approach.
                <br />
                Their next week.
              </h3>
              <p>
                Create a workout and diet plan around your client. Reuse your templates and
                personalise the details.
              </p>
              <Link href="/features/plan-builder">
                Explore plan building <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
            <ProductScene kind="build" />
          </div>
          <div className="workflow-row workflow-reverse">
            <div className="workflow-copy">
              <span className="step-number">02 / Your client follows it</span>
              <h3>
                A plan they can
                <br />
                take anywhere.
              </h3>
              <p>
                Clients see their plans, log workouts and food, and send check-ins from their phone.
                Their next step is right there.
              </p>
              <Link href="/features/client-app">
                See the client experience <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
            <ProductScene kind="phone" />
          </div>
          <div className="workflow-row">
            <div className="workflow-copy">
              <span className="step-number">03 / Review their week</span>
              <h3>
                See the week.
                <br />
                Coach the person.
              </h3>
              <p>
                Read check-in answers alongside ratings and progress. Review what changed, then
                adjust their plan.
              </p>
              <Link href="/features/check-ins">
                Explore check-ins <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
            <ProductScene />
          </div>
        </div>
      </section>
      <section className="marketing-section payment-section">
        <div className="traiv-content-wrap workflow-row">
          <div className="workflow-copy">
            <span className="section-note">Client payments</span>
            <h2>
              Your coaching.
              <br />
              Your fees.
              <br />
              In one place.
            </h2>
            <p>
              Collect client fees through Razorpay in Traiv. Keep payments alongside the coaching
              they pay for.
            </p>
            <TrialLink location="payments" />
          </div>
          <ProductScene kind="payments" />
        </div>
      </section>
      <section className="marketing-section">
        <div className="traiv-content-wrap workflow-row workflow-reverse brand-section">
          <div className="workflow-copy">
            <span className="section-note">A familiar place for your clients</span>
            <h2>
              Your name.
              <br />
              Your logo.
              <br />
              Still Traiv.
            </h2>
            <p>
              Put your name and logo in the app your clients use. Traiv works on Android and iPhone,
              straight from the browser or their home screen.
            </p>
            <span className="browser-note">No app store download.</span>
            <p className="supporting-line">
              Chat, shared resources and PDF plan exports are here too.{" "}
              <Link href="/features">See all features</Link>
            </p>
          </div>
          <ProductScene kind="brand" />
        </div>
      </section>
      <section className="marketing-section getting-started">
        <div className="traiv-content-wrap">
          <div className="section-intro">
            <span className="section-note">From signup to the first session</span>
            <h2>Start with one client.</h2>
            <p>You don't need to move your whole coaching practice at once.</p>
          </div>
          <ol className="getting-started-steps">
            {[
              ["Create your account", "Start your 14-day trial and add your coaching name."],
              [
                "Build their first plan",
                "Create a workout and diet plan, or start from a template.",
              ],
              ["Invite your client", "Share your invite so they can join Traiv on their phone."],
              [
                "Follow their progress",
                "Your client logs their first workout or food. You can review it in Traiv.",
              ],
            ].map(([title, body], i) => (
              <li key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="migration-note">
            Already have plans in Excel or PDFs? Recreate them in the builders and save them as
            templates to reuse. Automatic imports are not available.
          </p>
        </div>
      </section>
      <CustomerStories />
      <section className="marketing-section" id="pricing">
        <div className="traiv-content-wrap">
          <div className="section-intro">
            <span className="section-note">Room for your coaching to grow</span>
            <h2>
              One trainer.
              <br />
              Or your whole gym.
            </h2>
            <p>Choose the subscription that fits your coaching.</p>
          </div>
          <PricingCards />
        </div>
      </section>
      <MarketingFaq />
      <ClosingCta />
    </>
  );
}
