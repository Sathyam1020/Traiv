import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { RateCalculator } from "@/components/rate-calculator";

export const metadata: Metadata = {
  title: "What should I charge for coaching?",
  description:
    "A defensible monthly rate, worked backwards from what you want to earn and the hours you have. Free, no signup.",
  alternates: { canonical: "/tools/pricing-calculator" },
};

export default function RateCalculatorPage() {
  return (
    <>
      <PageHero
        title="What to charge, worked backwards from your own week"
        lede="Not what the coach down the road charges. What your hours and your income actually require — which is the only version of this number you can hold a line on when somebody asks for a discount."
        width="wide"
      />

      <Section>
        <Container width="wide">
          <RateCalculator />
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <SectionHeading title="Three things this number is not" />
          <ol className="mt-8 flex flex-col">
            {[
              {
                t: "It is not a market rate",
                b: "It is your rate. Somebody charging ₹2,000 in the same city may have a gym salary behind them, or may be quietly going out of business. You cannot tell which from their Instagram.",
              },
              {
                t: "It is not a ceiling",
                b: "It is the floor at full capacity. Full capacity is rare, so the working number should sit above it — and the coach who is full and still at their floor has their answer about raising prices.",
              },
              {
                t: "It does not price the hours you are not counting",
                b: "Writing plans on Sunday, answering WhatsApp at nine at night, chasing payment on the 3rd. If those are in your week and not in your hours-per-client, the real number is higher than this one.",
              },
            ].map((item, i) => (
              <li
                key={item.t}
                className="grid gap-2 border-t border-line py-7 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="font-display text-[1.125rem] font-semibold tabular-nums text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-body font-semibold">{item.t}</h3>
                  <p className="text-body-sm leading-relaxed text-fg-muted">{item.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand
        source="tools-pricing-calculator-close"
        title="Spend fewer of those hours on admin"
        secondary={{ href: "/tools/income-calculator", label: "What will I earn?" }}
      />
    </>
  );
}
