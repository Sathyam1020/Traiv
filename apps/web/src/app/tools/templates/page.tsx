import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { Container, Section, SectionHeading } from "@/components/layout";
import { Breadcrumbs } from "@/components/seo-schema";
import { CHECK_IN_FORM, INTAKE_QUESTIONS, MESSAGE_TEMPLATES } from "@/content/templates";
import { pageMetadata } from "@/lib/seo";
import { DemoLink, ToolTrialLink } from "../_components/links";

export const metadata: Metadata = pageMetadata({
  title: "Templates for coaches",
  description:
    "Six client messages you can send as they are, a six-question weekly check-in, and the seven things to ask before you write anybody a plan. Free, no signup.",
  alternates: { canonical: "/tools/templates" },
});

export default function TemplatesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Free tools", path: "/tools" },
          { name: "Templates for coaches", path: "/tools/templates" },
        ]}
      />
      <header className="border-b border-line">
        <Container width="wide" className="pt-6 pb-10 sm:pt-10 sm:pb-14">
          <p className="text-caption font-medium text-fg-muted">Free tool · Coaching business</p>
          <h1 className="mt-3 max-w-[44rem] font-display text-display font-medium text-balance">
            Messages you can send tonight
          </h1>
          <p className="mt-5 max-w-[42rem] text-body leading-relaxed text-fg-muted">
            Written to be used, not adapted. Square brackets are the only thing you have to change —
            everything else is sendable as it stands.
          </p>
        </Container>
      </header>
      <Section>
        <Container>
          <SectionHeading
            title="Six client messages"
            lede="The ones that are hard to write at nine at night: the client who has gone quiet, the price rise, the referral ask."
          />

          <div className="mt-10 flex flex-col gap-5">
            {MESSAGE_TEMPLATES.map((t) => (
              <article key={t.title} className="rounded-surface border border-line bg-surface">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="text-body font-semibold">{t.title}</h3>
                    <p className="text-caption text-fg-muted">{t.when}</p>
                  </div>
                  <CopyButton text={t.body} label={t.title} />
                </header>
                <div className="px-5 py-5 sm:px-6">
                  <p className="whitespace-pre-line text-body-sm leading-[1.75] text-fg-muted">
                    {t.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="sunken">
        <Container>
          <SectionHeading
            title="The weekly check-in"
            lede="Six questions, which is about the limit of what somebody will answer every week for six months. The temptation is always to ask twelve; the coach who does gets four answers."
          />
          <ol className="mt-10 flex flex-col">
            {CHECK_IN_FORM.map((f, i) => (
              <li
                key={f.q}
                className="grid gap-2 border-t border-line py-6 sm:grid-cols-[2.5rem_minmax(0,24rem)_minmax(0,1fr)] sm:gap-8"
              >
                <span className="font-display text-body font-semibold tabular-nums text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-body font-medium">{f.q}</h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{f.why}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-caption text-fg-muted">
            Inside Traiv these are the default check-in, and the weight goes onto the trend rather
            than into a message you have to find again.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHeading
            title="Before you write anybody a plan"
            lede="Seven questions. The second one is the most useful answer in the whole form, and almost nobody asks it."
          />
          <ol className="mt-10 flex flex-col">
            {INTAKE_QUESTIONS.map((f, i) => (
              <li
                key={f.q}
                className="grid gap-2 border-t border-line py-6 sm:grid-cols-[2.5rem_minmax(0,24rem)_minmax(0,1fr)] sm:gap-8"
              >
                <span className="font-display text-body font-semibold tabular-nums text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-body font-medium">{f.q}</h3>
                <p className="text-body-sm leading-relaxed text-fg-muted">{f.why}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <section className="border-t border-line bg-surface">
        <Container className="flex flex-col items-start gap-5 py-16 sm:py-24">
          <h2 className="max-w-[40rem] font-display text-display font-medium text-balance">
            Stop retyping these every week
          </h2>
          <p className="max-w-[38rem] text-body leading-relaxed text-fg-muted">
            Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins
            and the client app, under your name.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ToolTrialLink
              slug="templates"
              group="business"
              placement="band"
              className="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
            >
              Start your 14-day free trial
            </ToolTrialLink>
            <DemoLink
              slug="templates"
              group="business"
              placement="band"
              className="inline-flex min-h-11 items-center gap-1.5 text-body-sm font-medium underline underline-offset-4"
            />
          </div>
          <small className="text-caption text-fg-muted">14 days free. Cancel any time.</small>
        </Container>
      </section>{" "}
    </>
  );
}
