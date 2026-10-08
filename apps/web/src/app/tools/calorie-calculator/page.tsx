import type { Metadata } from "next";
import { CalorieCalculator } from "@/components/calorie-calculator";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";

export const metadata: Metadata = {
  title: "Calorie and macro calculator",
  description:
    "Work out calories and macros with Mifflin-St Jeor, with the working shown. Free, no signup, and it is the same calculation Traiv uses for a real client.",
  alternates: { canonical: "/tools/calorie-calculator" },
};

export default function CalorieCalculatorPage() {
  return (
    <>
      <PageHero
        title="Calories and macros, with the working shown"
        lede="Mifflin-St Jeor, the same equation a dietitian uses, with the floors that stop anybody being told to eat too little. It prints its own arithmetic so you can check it by hand."
        width="wide"
      />

      <Section>
        <Container width="wide">
          <CalorieCalculator />
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <SectionHeading title="Why this one shows its working" />
          <div className="mt-6 flex flex-col gap-4 text-body-sm leading-relaxed text-fg-muted">
            <p>
              Every other calculator of this kind gives you a number from nowhere. When a client
              asks why 1,740 and not 1,900, there is nothing to say except that a website said so —
              and a target a coach cannot defend is one the client abandons in week three.
            </p>
            <p>
              So this one prints the resting rate, the activity factor, the goal adjustment and
              which floor caught the result. It is reproducible on paper, which is the standard
              anything that tells a person what to eat should be held to.
            </p>
            <p>
              It is also the function the product runs. Not a copy of the arithmetic on a marketing
              page that drifts out of step six months later — the same code, imported.
            </p>
          </div>

          <h2 className="mt-12 font-display text-[1.375rem] font-semibold tracking-[-0.02em]">
            What it will not do
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body-sm leading-relaxed text-fg-muted">
            <p>
              It will not set a deficit for somebody pregnant, and it will not take anybody below
              their resting rate or below 1,200 kcal. Where a condition is in the picture —
              diabetes, blood pressure, thyroid — it says so and stops short of advice, because that
              number belongs with whoever manages the condition.
            </p>
            <p>
              This is a calculator, not a clinician. It estimates energy needs from a formula; it
              does not know anything about the person in front of you.
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand
        source="tools-calorie-calculator-close"
        title="Build the meal plan this number implies"
        note="Free for one client, forever. Meals in katoris and rotis, not grams."
        secondary={{ href: "/features/nutrition", label: "How nutrition works" }}
      />
    </>
  );
}
