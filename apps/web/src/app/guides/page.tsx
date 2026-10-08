import { ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guides for coaches",
  description:
    "Getting your first ten clients, why clients quit in week three, and how to price online coaching in India. Written for coaches, free to read.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <PageHero
        title="Running a coaching business, written down"
        lede="Three guides and a pack of messages you can send as they are. No signup, no email gate, and nothing in here is an advert for the product."
      />

      <Section>
        <Container>
          <ul className="flex flex-col">
            {GUIDES.map((g) => (
              <li key={g.slug} className="border-t border-line">
                <Link
                  href={`/guides/${g.slug}`}
                  className="group grid gap-3 py-8 transition-colors sm:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] sm:gap-10"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                      {g.title}
                    </h2>
                    <p className="text-caption text-fg-subtle">{g.minutes} minute read</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <p className="text-body-sm leading-relaxed text-fg-muted">{g.summary}</p>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                  </div>
                </Link>
              </li>
            ))}

            <li className="border-t border-line">
              <Link
                href="/guides/templates"
                className="group grid gap-3 py-8 sm:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] sm:gap-10"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="flex items-center gap-2 font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                    <FileText className="size-4 text-fg-subtle" />
                    Templates
                  </h2>
                  <p className="text-caption text-fg-subtle">Copy and paste</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="text-body-sm leading-relaxed text-fg-muted">
                    Six client messages, a six-question check-in form, and the seven things to ask
                    before you write anybody a plan.
                  </p>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                </div>
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <CtaBand
        source="guides-close"
        secondary={{ href: "/tools/calorie-calculator", label: "Try the calculator" }}
      />
    </>
  );
}
