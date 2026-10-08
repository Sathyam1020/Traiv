import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { NotifyMe } from "@/components/notify-me";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Thirty minutes with the person who built it. We set up your first client live, and tell you if Traiv is the wrong fit.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <PageHero
        title="Thirty minutes, with the person who built it"
        lede="Not a sales call with a slide deck. We open the product, add one of your real clients, and build them a week of training while you watch — and if it is the wrong fit for how you coach, we will say so on the call."
      >
        <NotifyMe intent="demo" source="demo-hero" label="Book a demo" />
      </PageHero>

      <Section>
        <Container>
          <SectionHeading title="What happens on the call" />
          <ol className="mt-10 flex flex-col">
            {[
              {
                t: "You tell us how your week works",
                b: "How many clients, how you take payment, where the plans live now, which part of the week you hate. Ten minutes, and it decides the rest of the call.",
              },
              {
                t: "We set up your account while you watch",
                b: "Your name and colours on the client app, one real client added, and a week of training built for them. This is the part that tells you whether the product is any good.",
              },
              {
                t: "We send it to their phone",
                b: "With your permission. Your client gets a link, opens it, and you can both see what they see.",
              },
              {
                t: "We tell you what is missing",
                b: "If you need class bookings, or a team of twenty, or payouts in dollars, Traiv is the wrong product and the honest answer is cheaper for both of us than a month of you finding out.",
              },
            ].map((item, i) => (
              <li
                key={item.t}
                className="grid gap-2 border-t border-line py-8 sm:grid-cols-[3rem_minmax(0,22rem)_minmax(0,1fr)] sm:gap-8"
              >
                <span className="font-display text-[1.125rem] font-semibold tabular-nums text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
                  {item.t}
                </h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{item.b}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <SectionHeading
            title="You probably do not need one"
            lede="The free plan runs one client properly, forever, with no card. For most coaches that answers the question faster than a call with us would."
          />
          <p className="mt-6 text-body-sm leading-relaxed text-fg-muted">
            A demo is worth it if you are moving a roster off another platform, if you are a gym or
            an academy, or if you want to watch somebody build a plan before you trust the thing
            with a client. Otherwise, start free and message us when you get stuck.
          </p>
        </Container>
      </Section>

      <CtaBand source="demo-close" secondary={{ href: "/features", label: "See what it does" }} />
    </>
  );
}
