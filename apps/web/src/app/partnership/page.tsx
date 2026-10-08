import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { NotifyMe } from "@/components/notify-me";

export const metadata: Metadata = {
  title: "Partnership",
  description:
    "For certification academies, gyms and studios whose coaches need software. What we offer, what we ask, and who it suits.",
  alternates: { canonical: "/partnership" },
};

const PARTNERS = [
  {
    who: "Certification academies",
    what: "You graduate batches of coaches every few months, and most of them start with no tooling at all — a spreadsheet and WhatsApp, which caps them at about fifteen clients before they have found out whether they are any good at this.",
    offer: [
      "Traiv free for your students for their first six months",
      "A session in your curriculum on running the business side",
      "Recurring commission on anybody who stays past it",
      "Your name on the onboarding your graduates see",
    ],
  },
  {
    who: "Gyms and studios",
    what: "Your trainers coach their own clients outside your floor hours, and that income is a reason good trainers stay. Right now they are doing it on paper.",
    offer: [
      "Studio seats for your coaching team, under your gym's name",
      "Your branding on the app every member sees",
      "One roster, per-coach permissions",
      "Nothing to install for members",
    ],
  },
  {
    who: "Creators and communities",
    what: "You have an audience of coaches and nothing honest to sell them. Most fitness software affiliate programmes pay a one-off bounty and are embarrassing to recommend twice.",
    offer: [
      "40% of what they pay for twelve months, then 15% for as long as they stay",
      "Cash bonuses at 5, 15 and 40 active referrals",
      "A plan you can recommend without checking the price per client first",
    ],
  },
];

export default function PartnershipPage() {
  return (
    <>
      <PageHero
        title="Partner with us"
        lede="Three kinds of partnership, and all of them are the same bet: a coach with working software coaches more people, and keeps doing it for longer."
      >
        <NotifyMe intent="partnership" source="partnership-hero" label="Talk to us" />
      </PageHero>

      <Section>
        <Container>
          <div className="flex flex-col">
            {PARTNERS.map((p) => (
              <article
                key={p.who}
                className="grid gap-5 border-t border-line py-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,18rem)] lg:gap-12"
              >
                <h2 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]">
                  {p.who}
                </h2>
                <p className="text-body leading-relaxed text-fg-muted">{p.what}</p>
                <ul className="flex flex-col gap-2 border-line lg:border-l lg:pl-8">
                  {p.offer.map((o) => (
                    <li key={o} className="text-body-sm leading-relaxed">
                      {o}
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
            title="What we ask for"
            lede="Short, because a partnership that needs a long list of obligations is one neither side wants."
          />
          <ul className="mt-8 flex flex-col">
            {[
              {
                t: "An introduction, not a sale",
                b: "You put us in front of your coaches. We do the convincing, and if the product is not right for them we say so.",
              },
              {
                t: "Honest feedback, in writing",
                b: "What your coaches actually complained about. It is worth more to us than the revenue at this stage.",
              },
              {
                t: "Permission to say we work together",
                b: "Your name on this page, once there is something to point at. Not before.",
              },
            ].map((item) => (
              <li key={item.t} className="flex flex-col gap-1.5 border-t border-line py-6">
                <h3 className="text-body font-semibold">{item.t}</h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{item.b}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-body-sm leading-relaxed text-fg-muted">
            We have no partners to name yet. When we do, they will be named here with what they
            actually got out of it — not a wall of logos.
          </p>
        </Container>
      </Section>

      <CtaBand
        source="partnership-close"
        title="Start with the product"
        secondary={{ href: "/affiliate", label: "The referral programme" }}
      />
    </>
  );
}
