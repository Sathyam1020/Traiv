import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { Container, PageHero, Section, SectionHeading } from "@/components/layout";
import { NotifyMe } from "@/components/notify-me";
import { rupees } from "@/content/site";

export const metadata: Metadata = {
  title: "Refer a coach",
  description:
    "40% of what a coach pays for their first twelve months, then 15% for as long as they stay, plus cash bonuses at 5, 15 and 40 active referrals.",
  alternates: { canonical: "/affiliate" },
};

const MILESTONES = [
  { at: 5, bonus: 2000 },
  { at: 15, bonus: 6000 },
  { at: 40, bonus: 20000 },
];

const TERMS = [
  {
    q: "When do I get paid?",
    a: "After the coach you referred has paid for two months. That delay is there because a referral that cancels in week three was never a referral, and paying on signup rewards the wrong thing.",
  },
  {
    q: "What is the clawback?",
    a: "If a coach you referred cancels and asks for a refund within 60 days, the commission on that refund comes back. Nothing you have earned on a coach past 60 days is ever reversed.",
  },
  {
    q: "Can I refer myself?",
    a: "No. One account cannot be its own referrer — it is blocked in the database, not just in the terms.",
  },
  {
    q: "Why 40% and then 15%, rather than 40% forever?",
    a: "Because 40% forever does not work arithmetically on a ₹999 product, and a programme that cannot be paid is worse than a smaller one that can. We would rather publish the number that survives than the one that sounds better.",
  },
  {
    q: "What counts as an active referral?",
    a: "A coach who signed up through your link and is on a paid plan. Free-plan signups do not count towards the milestones, because they are not paying us anything either.",
  },
];

export default function AffiliatePage() {
  return (
    <>
      <PageHero
        title="40% for a year, then 15% for as long as they stay"
        lede="For coaches, creators and academies who talk to other coaches. Recurring, not a one-off bounty — if somebody you referred is still here in year three, you are still being paid for it."
      >
        <NotifyMe intent="affiliate" source="affiliate-hero" label="Join the programme" />
      </PageHero>

      <Section>
        <Container>
          <SectionHeading title="How it pays" />
          <dl className="mt-10 grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-3">
            {[
              {
                k: "First 12 months",
                v: "40%",
                note: "Of everything they pay. On Pro that is ₹400 a month, every month, for a year.",
              },
              {
                k: "Month 13 onwards",
                v: "15%",
                note: "For as long as they stay a customer. No cap and no end date.",
              },
              {
                k: "Cash bonuses",
                v: "Up to ₹20,000",
                note: "At 5, 15 and 40 active referrals, on top of the commission.",
              },
            ].map((s) => (
              <div key={s.k} className="flex flex-col gap-2 bg-surface p-6">
                <dt className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  {s.k}
                </dt>
                <dd className="font-display text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
                  {s.v}
                </dd>
                <p className="text-body-sm leading-relaxed text-fg-muted">{s.note}</p>
              </div>
            ))}
          </dl>

          <div className="mt-6 overflow-x-auto rounded-surface border border-line">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <caption className="sr-only">Milestone bonuses</caption>
              <thead>
                <tr className="border-b border-line bg-sunken">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    Active referrals
                  </th>
                  <th className="px-5 py-3.5 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    One-off bonus
                  </th>
                  <th className="px-5 py-3.5 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                    Plus commission, yearly
                  </th>
                </tr>
              </thead>
              <tbody>
                {MILESTONES.map((m) => (
                  <tr key={m.at} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 text-body-sm font-medium tabular-nums">{m.at}</td>
                    <td className="px-5 py-4 text-right text-body-sm tabular-nums">
                      {rupees(m.bonus)}
                    </td>
                    <td className="px-5 py-4 text-right text-body-sm tabular-nums text-fg-muted">
                      {rupees(Math.round(999 * 0.4 * 12 * m.at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-caption text-fg-subtle">
            The right-hand column is 40% of a year on Pro at that many referrals, before the bonus
            and before anybody renews into year two at 15%.
          </p>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container>
          <SectionHeading title="The terms, written plainly" />
          <div className="mt-10">
            <FaqList items={TERMS} />
          </div>
        </Container>
      </Section>

      <CtaBand
        source="affiliate-close"
        title="Know a coach losing their Sundays?"
        note="The referral programme opens with the product. Ask for a place and we will tell you when."
        secondary={{ href: "/partnership", label: "Partner with us instead" }}
      />
    </>
  );
}
