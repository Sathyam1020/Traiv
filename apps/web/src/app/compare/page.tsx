import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { PriceWall } from "@/components/price-wall";
import { Reveal } from "@/components/reveal";
import { COMPETITORS } from "@/content/competitors";

export const metadata: Metadata = {
  title: "Compare Traiv to other coaching platforms",
  description:
    "Traiv against Trainerize, FitBudd, Everfit, TrueCoach and Coachway. Every competitor figure carries the page it came from and the date it was read.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <>
      <PageHero
        title="What the other platforms charge, with the receipts"
        lede="Five products a coach here actually shortlists. Every number on these pages carries the page it was read off and the day somebody read it — and where we have not checked, it says so instead of guessing."
      />

      <Section>
        <Container>
          <SectionHeading title="Pick the one you are on" />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-2">
            {COMPETITORS.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 50} className="bg-surface">
                <Link
                  href={`/compare/${c.slug}`}
                  className="flex h-full flex-col gap-2 p-7 transition-colors hover:bg-hover"
                >
                  <h3 className="flex items-center gap-2 font-display text-[1.125rem] font-semibold tracking-[-0.02em]">
                    Traiv vs {c.name}
                    <ArrowRight className="size-4 text-fg-subtle" />
                  </h3>
                  <p className="text-body-sm leading-relaxed text-fg-muted">{c.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <PriceWall />

      <Section tone="sunken">
        <Container width="prose">
          <SectionHeading
            title="Why these pages are dull on purpose"
            lede="A comparison page usually exists to make the other product look stupid. That is easy to write and nobody believes it."
          />
          <div className="mt-6 flex flex-col gap-4 text-body-sm leading-relaxed text-fg-muted">
            <p>
              So each page opens with what the other product is genuinely good at, and closes with
              who should stay where they are. Both are honest, and both are there because a coach
              who can see us being fair about a rival has a reason to trust the rest.
            </p>
            <p>
              If a figure here is out of date, it is out of date — tell us and we will re-read their
              page and change ours. That is more interesting to us than winning a table.
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand source="compare-close" secondary={{ href: "/pricing", label: "See pricing" }} />
    </>
  );
}
