import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { PROMISES } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Traiv exists, what stage it is at, and the six things about it that will never change.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Software for the coach, paid for by the coach"
        lede="Traiv is built for independent coaches in India, and it is early. This page says what that means rather than implying a company larger than the one that exists."
        width="prose"
      />

      <Section>
        <Container width="prose">
          <div className="flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
                Why this instead of the ten things that exist
              </h2>
              <p className="text-body leading-[1.75] text-fg-muted">
                Every coaching platform in this category charges per client. It is a sensible way to
                run a software business and a terrible thing to do to a coach, because it takes more
                money precisely when they are growing — the one time a coach has no attention left
                for a billing page.
              </p>
              <p className="text-body leading-[1.75] text-fg-muted">
                A coach with fifty clients in Pune on a per-client plan can be paying ₹40,000 a
                month for software out of revenue earned in rupees. The alternative most of them
                pick is a spreadsheet, WhatsApp and a Sunday evening — which works until about
                fifteen clients and then quietly caps the business.
              </p>
              <p className="text-body leading-[1.75] text-fg-muted">
                So: one price, unlimited clients, in rupees, with GST on the invoice. That is the
                entire idea. Everything else is execution.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
                The thing we are actually judged on
              </h2>
              <p className="text-body leading-[1.75] text-fg-muted">
                Not signups. Weekly active clients divided by total clients — what share of the
                people our coaches coach actually opened the app this week.
              </p>
              <p className="text-body leading-[1.75] text-fg-muted">
                Coaches buy software because of coach-facing features and cancel it because their
                clients stopped using it. So when there are two ways to build something, the one
                that gets a client to open their phone wins, even when the other one would look
                better in a demo.
              </p>
              <p className="text-body leading-[1.75] text-fg-muted">
                It is why the client app has no app store download, why logging works without
                signal, and why plans go out over WhatsApp as well — the client who never installs
                anything is the normal case, not the edge case.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
                Where it actually is
              </h2>
              <p className="text-body leading-[1.75] text-fg-muted">
                Early, and genuinely so. The plan builder, the client app, nutrition, check-ins and
                branding are built. WhatsApp delivery, payments, automations and the progress
                reports are not — they are listed as being built on{" "}
                <Link
                  href="/features"
                  className="underline decoration-line-strong underline-offset-2 hover:text-fg"
                >
                  the features page
                </Link>{" "}
                and marked as such on their own pages.
              </p>
              <p className="text-body leading-[1.75] text-fg-muted">
                Signing up is not open yet. The first coaches get the product free in exchange for a
                weekly call and permission to publish their numbers, which is also how the
                testimonials on this site will eventually be real ones.
              </p>
            </section>
          </div>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <SectionHeading
            title="The six things that will not change"
            lede="Every line is checkable against somebody's published pricing page, which is the only reason it is worth writing down."
          />
          <ul className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map((p) => (
              <li key={p.title} className="flex flex-col gap-1.5 border-t border-line pt-5">
                <h3 className="text-body font-semibold">{p.title}</h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{p.body}</p>
                <p className="text-caption text-fg-subtle">{p.against}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand source="about-close" secondary={{ href: "/coaches", label: "Is it for you?" }} />
    </>
  );
}
