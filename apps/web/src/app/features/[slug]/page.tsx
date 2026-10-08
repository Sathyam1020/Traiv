import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { FEATURES, featureBySlug } from "@/content/features";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const f = featureBySlug((await params).slug);
  if (!f) return {};
  return {
    title: f.name,
    description: f.blurb,
    alternates: { canonical: `/features/${f.slug}` },
  };
}

export default async function FeaturePage({ params }: Params) {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) notFound();

  // The next three in the list, wrapping — so the last page links forward, not nowhere.
  const i = FEATURES.findIndex((x) => x.slug === slug);
  const rest = [...FEATURES.slice(i + 1), ...FEATURES.slice(0, i)].slice(0, 3);

  return (
    <>
      <PageHero title={f.headline} lede={f.body}>
        {f.status === "building" ? (
          <p className="inline-flex items-center rounded-full border border-line-strong bg-surface px-3 py-1.5 text-caption font-medium text-fg-muted">
            Being built — not in the product yet
          </p>
        ) : null}
      </PageHero>

      <Section>
        <Container>
          {/* Three numbered rows rather than three cards: the points are an argument in
              order, not a set of equivalent tiles. */}
          <ol className="flex flex-col">
            {f.points.map((p, n) => (
              <li
                key={p.title}
                className="grid gap-2 border-t border-line py-8 sm:grid-cols-[3rem_minmax(0,22rem)_minmax(0,1fr)] sm:gap-8"
              >
                <span className="font-display text-[1.125rem] font-semibold tabular-nums text-fg-subtle">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
                  {p.title}
                </h2>
                <p className="text-body-sm leading-relaxed text-fg-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">
            Next to this
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-3">
            {rest.map((other) => (
              <li key={other.slug} className="bg-surface">
                <Link
                  href={`/features/${other.slug}`}
                  className="flex h-full flex-col gap-2 p-6 transition-colors hover:bg-hover"
                >
                  <other.icon className="size-4 text-fg-subtle" />
                  <h3 className="flex items-center gap-2 text-body font-semibold">
                    {other.name}
                    <ArrowRight className="size-3.5 text-fg-subtle" />
                  </h3>
                  <p className="text-body-sm leading-relaxed text-fg-muted">{other.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/features"
            className="mt-6 inline-flex items-center gap-2 text-body-sm font-medium underline decoration-line-strong underline-offset-4 hover:text-fg"
          >
            All features
          </Link>
        </Container>
      </Section>

      <CtaBand
        source="features-slug-close"
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
