import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { PriceWall } from "@/components/price-wall";
import { PricingTable } from "@/components/pricing-table";
import { EXTRA_CHARGES } from "@/content/comparison";
import { PRICING_FAQ } from "@/content/faq";
import { PROMISES } from "@/content/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free for one client. ₹999 a month for unlimited clients, GST included. ₹2,499 for five coach seats. No per-client fee, no add-ons, no cut of your revenue.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="Three prices, and none of them count your clients"
        lede="Prices include GST, so what you read is what leaves your account. Everything in the product is in the price — nutrition, payments, your own branding — and we take nothing on top of what your clients pay you."
      />

      <Section>
        <Container>
          <PricingTable />
        </Container>
      </Section>

      <PriceWall />

      <Section>
        <Container>
          <SectionHeading
            title="What is not in the price, anywhere else"
            lede="These are the charges coaches discover in month three. They are on this page in month zero."
          />

          <div className="mt-10 overflow-x-auto rounded-surface border border-line">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">
                Charges on other platforms that are not the subscription
              </caption>
              <thead>
                <tr className="border-b border-line bg-sunken">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    What you are charged for
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    Where
                  </th>
                  <th className="px-5 py-3.5 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    How much
                  </th>
                  <th className="px-5 py-3.5 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    On Traiv
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXTRA_CHARGES.map((c) => (
                  <tr key={`${c.who}-${c.what}`} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 text-body-sm">{c.what}</td>
                    <td className="px-5 py-4 text-body-sm text-fg-muted">{c.who}</td>
                    <td className="px-5 py-4 text-right text-body-sm tabular-nums text-fg-muted">
                      {c.amount}
                    </td>
                    <td className="px-5 py-4 text-right text-body-sm font-medium">Included</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-caption text-fg-subtle">
            Recorded 2026-09-11. Vendors change their pricing; if a row here is out of date, tell us
            and we will re-read their page.
          </p>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <SectionHeading title="Six things the price will never include" />
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

      <Section>
        <Container>
          <SectionHeading title="Questions about the money" />
          <div className="mt-10">
            <FaqList items={PRICING_FAQ} />
          </div>
        </Container>
      </Section>

      <CtaBand
        source="pricing-close"
        secondary={{ href: "/compare", label: "Compare platforms" }}
      />
    </>
  );
}
