import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { Reveal } from "@/components/reveal";
import { FEATURES } from "@/content/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything Traiv does, by the screen you will be looking at — Today, the plan builder, nutrition, check-ins, the client app, payments and branding.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  const shipped = FEATURES.filter((f) => !f.status);
  const building = FEATURES.filter((f) => f.status === "building");

  return (
    <>
      <PageHero
        title="Everything it does, by the screen you will be in"
        lede="Not a feature matrix. These are the screens you will spend your week in, and what each one is for. The ones still being built say so."
      />

      <Section>
        <Container>
          <Grid items={shipped} />
        </Container>
      </Section>

      {building.length > 0 ? (
        <Section tone="sunken">
          <Container>
            <div className="max-w-[46rem]">
              <h2 className="font-display text-[clamp(1.625rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                Being built now
              </h2>
              <p className="mt-4 text-body leading-relaxed text-fg-muted">
                On the roadmap, not in the product. They are listed because a coach deciding today
                deserves to know what is not there yet — and because the order gets set by whoever
                asks loudest.
              </p>
            </div>
            <div className="mt-10">
              <Grid items={building} />
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand source="features-close" secondary={{ href: "/pricing", label: "See pricing" }} />
    </>
  );
}

function Grid({ items }: { items: typeof FEATURES }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <Reveal as="li" key={f.slug} delay={i * 45} className="bg-surface">
          <Link
            href={`/features/${f.slug}`}
            className="flex h-full flex-col gap-2.5 p-7 transition-colors hover:bg-hover"
          >
            <f.icon className="size-4 text-fg-subtle" />
            <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.01em]">
              {f.name}
            </h3>
            <p className="text-body-sm leading-relaxed text-fg-muted">{f.blurb}</p>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
