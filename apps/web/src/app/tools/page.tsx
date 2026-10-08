import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { Reveal } from "@/components/reveal";
import { TOOLS } from "@/content/tools";

export const metadata: Metadata = {
  title: "Free tools for coaches",
  description:
    "A macro calculator that shows its working, an income calculator, a rate calculator, guides and templates. Free, no signup, no email gate.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <PageHero
        title="Free, and free of a signup form"
        lede="Nothing here asks for an email address. They are useful whether or not you ever pay us anything, which is the only kind of free tool worth making."
      />

      <Section>
        <Container>
          <ul className="grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-2">
            {TOOLS.map((t, i) => (
              <Reveal as="li" key={t.href} delay={i * 50} className="bg-surface">
                <Link
                  href={t.href}
                  className="flex h-full flex-col gap-2.5 p-7 transition-colors hover:bg-hover"
                >
                  <t.icon className="size-4 text-fg-subtle" />
                  <h2 className="flex items-center gap-2 font-display text-[1.125rem] font-semibold tracking-[-0.02em]">
                    {t.name}
                    <ArrowRight className="size-4 text-fg-subtle" />
                  </h2>
                  <p className="text-body-sm leading-relaxed text-fg-muted">{t.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand source="tools-close" />
    </>
  );
}
