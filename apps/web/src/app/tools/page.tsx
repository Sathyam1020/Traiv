import { ArrowRight } from "@traiv/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Breadcrumbs, JsonLd } from "@/components/seo-schema";
import { SITE } from "@/content/site";
import { GROUP_LABEL, GROUP_ORDER, LIVE_TOOLS, STANDING_LEGACY } from "@/content/tools/registry";
import type { ToolGroup } from "@/content/tools/types";
import { pageMetadata } from "@/lib/seo";
import { DemoLink, ToolTrialLink } from "./_components/links";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Free Fitness and Coaching Calculators for Coaches | Traiv" },
  description:
    "Free calculators for coaches and their clients: TDEE, recipe macros, income, pricing and more. No signup, nothing stored, working shown.",
  alternates: { canonical: "/tools" },
});

type Card = { href: string; name: string; group: ToolGroup; blurb?: string };

/**
 * The hub, grouped as the research groups it (plan §3). Lists live tools and the
 * standing legacy tools only, so every card opens a working page.
 */
export default function ToolsPage() {
  const cards: Card[] = [
    ...LIVE_TOOLS.map((t) => ({
      href: `/tools/${t.slug}`,
      name: t.name,
      group: t.group,
      blurb: t.copy.description,
    })),
    ...STANDING_LEGACY.map((t) => ({
      href: `/tools/${t.slug}`,
      name: t.name,
      group: t.group,
      blurb: t.blurb,
    })),
  ];
  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: cards.filter((c) => c.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <Breadcrumbs items={[{ name: "Free tools", path: "/tools" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Free calculators for coaches",
          url: `${SITE.url}/tools`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: cards.length,
            itemListElement: cards.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              url: `${SITE.url}${c.href}`,
            })),
          },
        }}
      />

      <header className="border-b border-line">
        <Container width="wide" className="pt-6 pb-12 sm:pt-10 sm:pb-16">
          <p className="text-caption font-medium text-fg-muted">Free tools · No signup</p>
          <h1 className="mt-3 max-w-[44rem] font-display text-display font-medium text-balance">
            Free calculators for coaches
          </h1>
          <p className="mt-5 max-w-[42rem] text-body leading-relaxed text-fg-muted">
            Calories, recipes, training numbers and the money side of coaching. Each one shows its
            working, stores nothing you type, and needs no email address.
          </p>
          <nav aria-label="Tool groups" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <li key={g.group}>
                  <a
                    href={`#${g.group}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-body-sm transition-colors hover:bg-hover"
                  >
                    {GROUP_LABEL[g.group]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>

      {groups.map((g, i) => (
        <Section key={g.group} tone={i % 2 === 1 ? "sunken" : "canvas"}>
          <Container width="wide">
            <h2 id={g.group} className="scroll-mt-28 font-display text-heading font-medium">
              {GROUP_LABEL[g.group]}
            </h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c) => (
                <li key={c.href} className="bg-surface">
                  <Link
                    href={c.href}
                    className="flex h-full flex-col gap-2 p-6 transition-colors hover:bg-hover"
                  >
                    <span className="font-display text-subheading font-semibold">{c.name}</span>
                    {c.blurb ? (
                      <span className="text-body-sm leading-relaxed text-fg-muted">{c.blurb}</span>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-body-sm font-medium">
                      Open <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      <section className="border-t border-line bg-surface">
        <Container className="flex flex-col items-start gap-5 py-16 sm:py-24">
          <h2 className="max-w-[40rem] font-display text-display font-medium text-balance">
            The numbers here, kept for every client
          </h2>
          <p className="max-w-[38rem] text-body leading-relaxed text-fg-muted">
            Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins
            and the client app, under your name.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ToolTrialLink
              slug="hub"
              group="hub"
              placement="hub"
              className="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
            >
              Start your 14-day free trial
            </ToolTrialLink>
            <DemoLink
              slug="hub"
              group="hub"
              placement="hub"
              className="inline-flex min-h-11 items-center gap-1.5 text-body-sm font-medium underline underline-offset-4"
            />
          </div>
          <small className="text-caption text-fg-muted">14 days free. Cancel any time.</small>
        </Container>
      </section>
    </>
  );
}
