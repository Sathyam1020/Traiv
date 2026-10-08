import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { DISCIPLINES } from "@/content/disciplines";

export const metadata: Metadata = {
  title: "For coaches",
  description:
    "What Traiv does for personal trainers, dietitians, nutrition coaches, yoga instructors and physiotherapists — and what it does not do.",
  alternates: { canonical: "/coaches" },
};

export default function CoachesPage() {
  return (
    <>
      <PageHero
        title="Built for one coach with too many clients"
        lede="Not for gyms with a software budget and not for a team of twenty. For the person who coaches, sells, writes the plans and chases the payments — which is most of this industry and almost none of what software is built for."
      />

      <Section>
        <Container>
          <SectionHeading
            title="Five answers, because you want five different things"
            lede="A dietitian and a physiotherapist want almost opposite things from this product. Find yours."
          />

          <div className="mt-12 flex flex-col">
            {DISCIPLINES.map((d) => (
              <article
                key={d.name}
                className="grid gap-5 border-t border-line py-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,16rem)] lg:gap-12"
              >
                <div className="flex flex-col gap-2">
                  <d.icon className="size-5 text-fg-subtle" />
                  <h3 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]">
                    {d.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-body leading-relaxed">{d.problem}</p>
                  <p className="text-body-sm leading-relaxed text-fg-muted">{d.fit}</p>
                </div>

                <ul className="flex flex-col gap-2 border-line lg:border-l lg:pl-8">
                  {d.uses.map((u) => (
                    <li key={u} className="text-body-sm leading-relaxed text-fg-muted">
                      {u}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <SectionHeading
            title="Who this is not for"
            lede="Saying so is cheaper for both of us than you finding out in week two."
          />
          <ul className="mt-8 flex flex-col">
            {[
              {
                t: "A gym selling memberships",
                b: "Traiv coaches individuals. It has no door access, no class bookings and no membership billing, and none of those are planned.",
              },
              {
                t: "A team of twenty coaches",
                b: "Studio handles five seats. Past that you want something with a reporting layer and an admin hierarchy, and that is not what we are building.",
              },
              {
                t: "Coaching outside India, mostly",
                b: "The product works anywhere and phone numbers are handled for every country. But the food library is Indian, the prices are in rupees and the invoices carry GST. If your clients pay in dollars, something else fits you better.",
              },
            ].map((item) => (
              <li key={item.t} className="flex flex-col gap-1.5 border-t border-line py-6">
                <h3 className="text-body font-semibold">{item.t}</h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{item.b}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        source="coaches-close"
        secondary={{ href: "/features", label: "See what it does" }}
      />
    </>
  );
}
