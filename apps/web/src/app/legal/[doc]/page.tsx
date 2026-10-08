import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { LEGAL, legalBySlug } from "@/content/legal";

type Params = { params: Promise<{ doc: string }> };

export function generateStaticParams() {
  return LEGAL.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const d = legalBySlug((await params).doc);
  if (!d) return {};
  return {
    title: d.title,
    description: d.summary,
    alternates: { canonical: `/legal/${d.slug}` },
    // A draft policy has no business ranking for anything.
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: Params) {
  const { doc } = await params;
  const d = legalBySlug(doc);
  if (!d) notFound();

  return (
    <>
      <PageHero title={d.title} lede={d.summary} width="prose">
        <p className="text-caption text-fg-subtle">Last updated {d.updated}</p>
      </PageHero>

      <Section>
        <Container width="prose">
          {/* Not in force, and saying so is the only honest way to publish a draft. */}
          <aside className="rounded-surface border border-line-strong bg-sunken p-5">
            <h2 className="text-body font-semibold">This is a draft, and it is not in force</h2>
            <p className="mt-2 text-body-sm leading-relaxed text-fg-muted">
              Signing up is not open, so nobody has agreed to anything yet. This document is
              published because you should be able to read our terms before you are asked to accept
              them — not because it binds anybody today. It has not been through a lawyer, and the
              company and contact details are still blank. Both will be filled in, and the date
              above will change, before the first payment is taken.
            </p>
          </aside>

          <article className="mt-12 flex flex-col gap-11">
            {d.sections.map((s) => (
              <section key={s.heading} className="flex flex-col gap-3.5">
                <h2 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]">
                  {s.heading}
                </h2>
                {s.paras.map((p) => (
                  <p key={p.slice(0, 40)} className="text-body-sm leading-[1.8] text-fg-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </article>

          <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
            {LEGAL.filter((o) => o.slug !== doc).map((o) => (
              <Link
                key={o.slug}
                href={`/legal/${o.slug}`}
                className="inline-flex min-h-11 items-center text-body-sm text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-fg"
              >
                {o.title}
              </Link>
            ))}
          </nav>
        </Container>
      </Section>

      <CtaBand source="legal-doc-close" />
    </>
  );
}
