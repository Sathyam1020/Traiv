import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { GUIDES, guideBySlug } from "@/content/guides";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", title: g.title, description: g.summary },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();

  const others = GUIDES.filter((x) => x.slug !== slug);

  return (
    <>
      <PageHero title={g.title} lede={g.summary} width="prose">
        <p className="text-caption text-fg-subtle">{g.minutes} minute read</p>
      </PageHero>

      <Section>
        <Container width="prose">
          <article className="flex flex-col gap-12">
            {g.sections.map((s) => (
              <section key={s.heading} className="flex flex-col gap-4">
                <h2 className="font-display text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
                  {s.heading}
                </h2>
                {s.paras.map((p) => (
                  <p key={p.slice(0, 40)} className="text-body leading-[1.75] text-fg-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">
            Read next
          </h2>
          <ul className="mt-6 flex flex-col">
            {others.map((o) => (
              <li key={o.slug} className="border-t border-line">
                <Link href={`/guides/${o.slug}`} className="flex flex-col gap-1.5 py-5">
                  <span className="text-body font-semibold underline decoration-line-strong underline-offset-4">
                    {o.title}
                  </span>
                  <span className="text-body-sm leading-relaxed text-fg-muted">{o.summary}</span>
                </Link>
              </li>
            ))}
            <li className="border-t border-line">
              <Link href="/guides/templates" className="flex flex-col gap-1.5 py-5">
                <span className="text-body font-semibold underline decoration-line-strong underline-offset-4">
                  Templates
                </span>
                <span className="text-body-sm leading-relaxed text-fg-muted">
                  Messages, a check-in form and an intake list you can use as they are.
                </span>
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <CtaBand source="guides-slug-close" />
    </>
  );
}
