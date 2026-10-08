import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { COMPETITORS, competitorBySlug } from "@/content/competitors";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = competitorBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `Traiv vs ${c.name}`,
    description: `${c.blurb}. What each platform charges, what is included, and who should stay where they are.`,
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default async function ComparisonPage({ params }: Params) {
  const c = competitorBySlug((await params).slug);
  if (!c) notFound();

  return (
    <>
      <PageHero title={`Traiv vs ${c.name}`} lede={c.why} />

      <Section>
        <Container>
          <SectionHeading
            title="Line by line"
            lede="Where a figure has not been read off their own page today, the row says so rather than showing a number."
          />

          <div className="mt-10 overflow-x-auto rounded-surface border border-line">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">Traiv compared with {c.name}</caption>
              <thead>
                <tr className="border-b border-line bg-sunken">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    What you are comparing
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    {c.name}
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    Traiv
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.claims.map((claim) => (
                  <tr key={claim.what} className="border-b border-line align-top last:border-0">
                    <td className="px-5 py-4 text-body-sm font-medium">{claim.what}</td>
                    <td className="px-5 py-4 text-body-sm text-fg-muted">
                      {claim.them ?? <span className="text-fg-subtle">—</span>}
                      {claim.them && !claim.verified ? (
                        <span className="mt-1 block text-caption text-fg-subtle">
                          Recorded {claim.checked}, not re-checked since
                        </span>
                      ) : null}
                      {claim.them && claim.verified ? (
                        <span className="mt-1 block text-caption text-fg-subtle">
                          Read off their pricing page on {claim.checked}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-body-sm font-medium">{claim.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 max-w-[46rem] text-caption text-fg-subtle">
            {c.name} can change their prices the day after we read them, and sometimes do. If a row
            here is wrong, tell us and we will re-read their page.
          </p>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">
                What {c.name} is good at
              </h2>
              <p className="text-body-sm leading-relaxed text-fg-muted">{c.fair}</p>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">
                When you should not switch
              </h2>
              <p className="text-body-sm leading-relaxed text-fg-muted">{c.stay}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="prose">
          <SectionHeading
            title="Moving is free and we do it"
            lede="Send us your export, or your login if you would rather. Clients, plans and history come across, usually within a day, and your clients keep their history."
          />
          <p className="mt-6 text-body-sm leading-relaxed text-fg-muted">
            Comparing something else?{" "}
            {COMPETITORS.filter((other) => other.slug !== c.slug).map((other, i, arr) => (
              <span key={other.slug}>
                <Link
                  href={`/compare/${other.slug}`}
                  className="underline decoration-line-strong underline-offset-2 hover:text-fg"
                >
                  {other.name}
                </Link>
                {i < arr.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </Container>
      </Section>

      <CtaBand
        source="compare-slug-close"
        title={`Move off ${c.name} this week`}
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
