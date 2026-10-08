import { Check, Quote } from "lucide-react";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { HeroDashboard } from "@/components/hero-dashboard";
import { NotifyMe } from "@/components/notify-me";
import { PriceWall } from "@/components/price-wall";
import { Reveal } from "@/components/reveal";
import { EXTRA_CHARGES } from "@/content/comparison";
import { GENERAL_FAQ } from "@/content/faq";
import { PROMISES, rupees, TIERS } from "@/content/site";
import { TESTIMONIALS } from "@/content/testimonials";

/**
 * The landing page.
 *
 * Ordered by what a coach has to believe, not by what we most want to say. They have to
 * recognise their own Sunday before a feature list means anything, and they have to see
 * what per-client pricing does to them before ₹999 reads as cheap rather than suspicious.
 *
 * Every line here is written from `.ai/product/positioning.md` and run against
 * `.ai/design/voice.md` — which bans most of what makes marketing copy read as generated.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Sunday />
      <PriceWall />
      <Promises />
      <Included />
      <Testimonials />
      <Pricing />
      <Faq />
      <Close />
    </>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-line">
      <div className="mx-auto w-full max-w-[76rem] px-5 pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          <div className="min-w-0 max-w-[34rem]">
            <Reveal>
              <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
                Coach fifty people like you coach ten
              </h1>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-fg-muted sm:text-[1.125rem]">
                Plans, check-ins and payments in one place, under your own name. Unlimited clients
                for {rupees(999)} a month — the price does not move when you grow.
              </p>
            </Reveal>

            <Reveal delay={160} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <NotifyMe source="hero" />
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-control border border-line-strong bg-surface px-6 text-body-sm font-medium transition-colors hover:bg-hover"
              >
                See pricing
              </Link>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-5 text-caption text-fg-subtle">
                Free for one client, forever. No card, and one click to leave.
              </p>
            </Reveal>
          </div>

          <Reveal
            direction="right"
            delay={120}
            // The mock bleeds off the right edge — but not on the narrowest phones, where
            // the few pixels it gains cost it its own right-hand edge.
            className="relative min-w-0 mr-0 min-[400px]:-mr-5 sm:-mr-8 lg:mr-0"
          >
            <HeroDashboard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Their week, in their words. Straight from `personas.md`. */
const SUNDAY = [
  {
    when: "Sunday",
    what: "Gone. Duplicating last week's spreadsheet tabs into this week's.",
  },
  {
    when: "Every evening",
    what: "WhatsApp. No line between nine at night and work.",
  },
  {
    when: "Some month",
    what: "Someone quietly stops training. You find out when they cancel.",
  },
  {
    when: "The 3rd",
    what: "Asking for money from people you also have to motivate.",
  },
];

function Sunday() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              You already know how Sunday goes
            </h2>
            <p className="text-body leading-relaxed text-fg-muted">
              None of this is a software problem until you have about fifteen clients. Then it is
              only a software problem.
            </p>
          </div>

          {/* A list, not cards — three identical card grids in a row is the tell. */}
          <dl className="flex flex-col">
            {SUNDAY.map((row, i) => (
              <Reveal
                key={row.when}
                delay={i * 70}
                className="flex flex-col gap-1 border-t border-line py-6 sm:flex-row sm:gap-8"
              >
                <dt className="shrink-0 text-body-sm font-medium text-fg-subtle sm:w-32">
                  {row.when}
                </dt>
                <dd className="text-body leading-relaxed">{row.what}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Promises() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <div className="max-w-[46rem]">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            Six things we have decided never to do
          </h2>
          <p className="mt-4 text-body leading-relaxed text-fg-muted">
            Each one is something a platform you have used does. Every line is checkable against
            their own pricing page, which is the only reason it is worth writing.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 60} className="flex gap-4">
              <Check className="mt-1 size-4 shrink-0 text-fg" />
              <div className="flex min-w-0 flex-col gap-1.5">
                <h3 className="text-body font-semibold">{p.title}</h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{p.body}</p>
                <p className="text-caption text-fg-subtle">{p.against}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 overflow-x-auto rounded-surface border border-line">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">
              Charges on other platforms that are not the subscription
            </caption>
            <thead>
              <tr className="border-b border-line bg-sunken">
                <th className="px-5 py-3 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  What you are charged for
                </th>
                <th className="px-5 py-3 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  Where
                </th>
                <th className="px-5 py-3 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  How much
                </th>
                <th className="px-5 py-3 text-right text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
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
      </div>
    </section>
  );
}

const INCLUDED = [
  {
    title: "Today, not a dashboard",
    body: "Your home screen opens on the people who need you — who has not trained in nine days, whose check-in is waiting. Not a grid of numbers you have to interpret.",
  },
  {
    title: "Plans that take a minute",
    body: "Build eight weeks once, with progression already in it. Edit any day. Send it, and it is on their phone before you have put yours down.",
  },
  {
    title: "Food they will actually eat",
    body: "Calories worked out from their body, then meals built around roti, dal and curd — in katoris, not grams. Vegetarian, Jain, egg, vegan.",
  },
  {
    title: "Check-ins that come back",
    body: "Weight, photos and how the week went, on a schedule you set. The numbers chart themselves so you read a month in one glance.",
  },
  {
    title: "Your name on it",
    body: "Your client opens an app with your name and your colours. Not ours. From day one, with no setup fee.",
  },
  {
    title: "Money, without the chase",
    body: "Payment links and GST invoices. What they pay you is yours — we take nothing on top of the gateway.",
  },
];

function Included() {
  return (
    <section className="border-y border-line bg-sunken py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <h2 className="max-w-[46rem] font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          What you get, in the order you will use it
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((f, i) => (
            <Reveal key={f.title} delay={i * 50} className="flex flex-col gap-2 bg-surface p-7">
              <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.01em]">
                {f.title}
              </h3>
              <p className="text-body-sm leading-relaxed text-fg-muted">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <h2 className="max-w-[40rem] font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          Coaches who stopped losing their Sundays
        </h2>

        {/* Masonry, so a short quote does not leave a tall hole beside a long one. */}
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              as="figure"
              key={t.name}
              delay={i * 60}
              className="break-inside-avoid rounded-surface border border-line bg-surface p-6"
            >
              <Quote className="size-4 text-fg-subtle" />
              <blockquote className="mt-3 text-body-sm leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sunken text-caption font-semibold text-fg-muted">
                  {t.initials}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-body-sm font-medium">{t.name}</span>
                  <span className="text-caption text-fg-subtle">
                    {t.role} · {t.city} · {t.clients} clients
                  </span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="border-y border-line bg-sunken py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <div className="max-w-[46rem]">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            Three prices, and none of them count your clients
          </h2>
          <p className="mt-4 text-body leading-relaxed text-fg-muted">
            Prices include GST — what you see is what is charged. A year up front is two months
            free.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal
              as="article"
              key={tier.name}
              delay={i * 80}
              className={`flex flex-col gap-5 rounded-surface border bg-surface p-6 transition-shadow duration-300 hover:shadow-[0_18px_50px_-24px_rgb(0_0_0/0.3)] ${
                tier.hero ? "border-fg" : "border-line"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-body font-semibold">{tier.name}</h3>
                  {tier.hero ? (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-caption font-medium text-brand-fg">
                      Most coaches
                    </span>
                  ) : null}
                </div>
                <p className="text-caption text-fg-muted">{tier.limit}</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[2rem] font-semibold tabular-nums tracking-[-0.03em]">
                  {tier.monthly === 0 ? "Free" : rupees(tier.monthly)}
                </span>
                {tier.monthly > 0 ? (
                  <span className="text-caption text-fg-subtle">/ month</span>
                ) : null}
              </div>

              <p className="text-body-sm leading-relaxed text-fg-muted">{tier.summary}</p>

              <ul className="flex flex-1 flex-col gap-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-body-sm text-fg-muted">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" />
                    {f}
                  </li>
                ))}
              </ul>

              <NotifyMe
                label={tier.cta}
                source={`home-pricing-${tier.name.toLowerCase()}`}
                variant={tier.hero ? "primary" : "outline"}
                showArrow={false}
                className="h-11 w-full px-4"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-8">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          Questions coaches actually ask
        </h2>
        <div className="mt-10">
          <FaqList items={GENERAL_FAQ} />
        </div>
        <Link
          href="/pricing"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-body-sm font-medium underline decoration-line-strong underline-offset-4 hover:text-fg"
        >
          More questions about the price
        </Link>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="border-t border-line bg-sunken py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col items-start gap-6 px-5 sm:px-8">
        <h2 className="max-w-[32rem] font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          Take your next Sunday back
        </h2>
        <NotifyMe source="home-close" />
        <p className="text-caption text-fg-subtle">One client free forever. No card to start.</p>
      </div>
    </section>
  );
}
