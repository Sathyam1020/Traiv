import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { IncomeCalculator } from "@/components/income-calculator";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";

export const metadata: Metadata = {
  title: "Coaching income calculator",
  description:
    "What your coaching business earns at your rate and client count, and what each platform takes out of it. Free, no signup.",
  alternates: { canonical: "/tools/income-calculator" },
};

export default function IncomeCalculatorPage() {
  return (
    <>
      <PageHero
        title="What you earn, and what the software takes"
        lede="Move the two sliders. The table underneath is what each platform costs at that client count — the number that stops being a rounding error somewhere around your twentieth client."
        width="wide"
      />

      <Section>
        <Container width="wide">
          <IncomeCalculator />
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <SectionHeading title="The part per-client pricing hides" />
          <div className="mt-6 flex flex-col gap-4 text-body-sm leading-relaxed text-fg-muted">
            <p>
              Per-client pricing is comfortable at the start. Five clients on a €69 plan is fine.
              The problem is that it charges you precisely when you are growing, and growing is the
              only time a coach has no spare attention for a billing page.
            </p>
            <p>
              Signing ten more clients should feel like a good month. On a per-client plan it is
              also a bill going up, which is the one moment software should be invisible.
            </p>
            <p>
              Ours is ₹999 at every point on that slider. That is not generosity — it is the
              simplest promise we can make that a coach can check in ten seconds.
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand
        source="tools-income-calculator-close"
        secondary={{ href: "/tools/pricing-calculator", label: "What should I charge?" }}
      />
    </>
  );
}
