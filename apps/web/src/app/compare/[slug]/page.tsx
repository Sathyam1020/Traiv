import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { Breadcrumbs } from "@/components/seo-schema";
import { COMPETITORS, comparisonIsIndexable, competitorBySlug } from "@/content/competitors";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = competitorBySlug((await params).slug);
  if (!c) return {};
  return pageMetadata({
    title: `Traiv vs ${c.name}`,
    robots: { index: comparisonIsIndexable(c), follow: true },
    description: `Compare ${c.name} and Traiv: coaching workflows, plan details and considerations before switching.`,
    alternates: { canonical: `/compare/${c.slug}` },
  });
}

export default async function ComparisonPage({ params }: Params) {
  const c = competitorBySlug((await params).slug);
  if (!c) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Compare", path: "/compare" },
          { name: c.name, path: `/compare/${c.slug}` },
        ]}
      />
      <PageHero
        title={`Traiv vs ${c.name}`}
        lede={
          comparisonIsIndexable(c)
            ? c.why
            : "Review coaching workflows, client experience and switching considerations. Verify current terms with each provider."
        }
      >
        {!comparisonIsIndexable(c) ? (
          <p className="text-body-sm text-fg-muted">
            This comparison is awaiting a complete evidence review. Check each provider’s current
            product and pricing information before deciding.
          </p>
        ) : null}
      </PageHero>

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
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-muted">
                    What you are comparing
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-muted">
                    {c.name}
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-muted">
                    Traiv
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.claims.map((claim) => (
                  <tr key={claim.what} className="border-b border-line align-top last:border-0">
                    <td className="px-5 py-4 text-body-sm font-medium">{claim.what}</td>
                    <td className="px-5 py-4 text-body-sm text-fg-muted">
                      {claim.verified
                        ? (claim.them ?? <span className="text-fg-subtle">—</span>)
                        : "Not verified — check the provider"}
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
              <h2 className="font-display text-lead font-medium">What {c.name} is good at</h2>
              <p className="text-body-sm leading-relaxed text-fg-muted">
                {comparisonIsIndexable(c)
                  ? c.fair
                  : `Review ${c.name}’s current product documentation against the workflows you and your clients need.`}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-lead font-medium">When you should not switch</h2>
              <p className="text-body-sm leading-relaxed text-fg-muted">
                {comparisonIsIndexable(c)
                  ? c.stay
                  : "Keep your current platform if it meets your needs. Check contract terms, data exports and how you would recreate your plans before switching."}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="prose">
          <SectionHeading
            title="Bring your coaching plans"
            lede="Recreate existing plans in Traiv’s builders and save templates for reuse. Automatic imports are not available. Workout templates and diet plans can be downloaded as PDFs."
          />
          {/* Chips rather than links in a sentence. Four comma-separated links inside a
              line of prose are 17px tall and sit a thumb-width apart, which is fine with
              a mouse and unusable on a phone. */}
          <div className="mt-8 flex flex-col gap-3">
            <p className="text-body-sm text-fg-muted">Comparing something else?</p>
            <ul className="flex flex-wrap gap-2">
              {COMPETITORS.filter((other) => other.slug !== c.slug).map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/compare/${other.slug}`}
                    className="inline-flex min-h-11 items-center rounded-control border border-line-strong bg-surface px-4 text-body-sm font-medium transition-colors hover:bg-hover"
                  >
                    {other.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
