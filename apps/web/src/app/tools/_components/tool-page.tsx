import { ArrowRight } from "@traiv/ui/icons";
import type { ComponentType } from "react";
import { Container, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/seo-schema";
import { SITE, TOOL_AUTHOR } from "@/content/site";
import { PITCHES } from "@/content/tools/pitches";
import { GROUP_LABEL, isLinkable, relatedFor } from "@/content/tools/registry";
import type { LiveTool } from "@/content/tools/types";
import { DemoLink, FeatureLink, RelatedLink, ToolTrialLink } from "./links";
import { PromptBlock } from "./prompt-block";
import { ToolProvider } from "./tool-context";
import { ToolSchema } from "./tool-schema";

/**
 * One free-tool page, in the researched section order (plan §3):
 * hero → tool + result → short answer → method sections → prompt → for coaches → pitch
 * → FAQ → disclaimer → keep going → more tools → AI research links → closing band.
 *
 * Which optional sections appear (prompt, AI links, demo, sources) comes from the
 * registry, so each page matches its own researched counterpart rather than one template.
 */
export function ToolPage({
  tool,
  Widget,
  updated,
}: {
  tool: LiveTool;
  Widget: ComponentType;
  updated: string;
}) {
  const { copy, sections } = tool;
  const pitch = PITCHES[copy.pitch.key];
  const related = relatedFor(tool);
  // Links to tools that haven't shipped yet are held back, and appear once they're live.
  const next = copy.next.filter((n) => isLinkable(n.href));
  const keepGoing = copy.keepGoing.filter((k) => isLinkable(k.href));

  return (
    <ToolProvider value={{ slug: tool.slug, group: tool.group, kind: tool.kind }}>
      <Breadcrumbs
        items={[
          { name: "Free tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ]}
      />
      <ToolSchema tool={tool} updated={updated} />

      {/* Hero band in the dark theme tokens, with the tool card overlapping its lower edge. */}
      <header className="dark bg-canvas text-fg">
        <Container width="wide" className="pt-6 pb-24 sm:pt-10 sm:pb-32">
          <p className="text-caption font-medium text-fg-subtle">{copy.eyebrow}</p>
          <h1 className="mt-3 max-w-[44rem] font-display text-display font-medium text-balance">
            {copy.h1}
          </h1>
          <div className="mt-5 max-w-[42rem] text-body leading-relaxed text-fg-muted">
            {copy.intro}
          </div>
          {TOOL_AUTHOR || copy.method || (sections.sources && copy.sources) ? (
            <div className="mt-6 flex max-w-[42rem] flex-col gap-3 text-caption text-fg-subtle">
              {TOOL_AUTHOR || copy.method ? (
                <p>
                  {TOOL_AUTHOR ? (
                    <>
                      By{" "}
                      <a className="underline underline-offset-4" href={TOOL_AUTHOR.url}>
                        {TOOL_AUTHOR.name}
                      </a>
                      {TOOL_AUTHOR.credential ? `, ${TOOL_AUTHOR.credential}` : ""}
                      {" · "}
                    </>
                  ) : null}
                  Updated{" "}
                  {new Date(updated).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {copy.method ? ` · ${copy.method}` : ""}
                </p>
              ) : null}
              {sections.sources && copy.sources ? (
                <div>
                  <p className="font-medium text-fg-muted">Sources</p>
                  <ul className="mt-1 flex flex-col gap-1">
                    {copy.sources.map((s) => (
                      <li key={s.label}>
                        {s.href ? (
                          <a
                            className="inline-flex min-h-11 items-center underline underline-offset-4"
                            href={s.href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {s.label}
                          </a>
                        ) : (
                          s.label
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </Container>
      </header>

      <div className="relative -mt-16 pb-16 sm:-mt-24 sm:pb-24">
        <Container width="wide">
          <Widget />
          <div className="mt-4 rounded-surface border border-line bg-surface p-5 sm:p-6">
            {next.length > 0 ? (
              <>
                <p className="text-caption font-medium text-fg-subtle">Next</p>
                <ul className="mt-3 mb-4 flex flex-col gap-2">
                  {next.map((n) => (
                    <li key={n.href}>
                      <RelatedLink
                        from={tool.slug}
                        to={n.href.replace("/tools/", "")}
                        className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-line px-4 py-2.5 text-body-sm transition-colors hover:bg-hover"
                      >
                        {n.label}
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
                      </RelatedLink>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="text-body-sm text-fg-muted">
              {copy.nextPitch}{" "}
              <ToolTrialLink
                slug={tool.slug}
                group={tool.group}
                placement="next"
                className="font-medium text-fg underline underline-offset-4"
              >
                Try Traiv free for 14 days
              </ToolTrialLink>
            </p>
          </div>
        </Container>
      </div>

      <Section tone="sunken">
        <Container width="prose">
          <section id="short-answer" aria-labelledby="short-answer-heading">
            <p className="text-caption font-medium text-fg-subtle">Short answer</p>
            <h2
              id="short-answer-heading"
              className="mt-2 font-display text-heading font-medium text-balance"
            >
              {copy.shortAnswer.question}
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-body leading-relaxed">
              {copy.shortAnswer.answer}
            </div>
          </section>
        </Container>
      </Section>

      <Section>
        <Container width="prose" className="flex flex-col gap-16">
          {copy.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-heading font-medium text-balance">{s.heading}</h2>
              <div className="tool-prose mt-5 flex flex-col gap-4 text-body leading-relaxed text-fg-muted">
                {s.body}
              </div>
            </section>
          ))}

          {sections.prompt && copy.prompt ? <PromptBlock prompt={copy.prompt} /> : null}

          <section>
            <h2 className="font-display text-heading font-medium text-balance">
              {copy.forCoaches.heading}
            </h2>
            <div className="tool-prose mt-5 flex flex-col gap-4 text-body leading-relaxed text-fg-muted">
              {copy.forCoaches.body}
            </div>
          </section>
        </Container>
      </Section>

      <Section tone="sunken">
        <Container width="prose">
          <h2 className="font-display text-heading font-medium text-balance">
            {copy.pitch.heading}
          </h2>
          <div className="mt-5 flex flex-col gap-4 text-body leading-relaxed text-fg-muted">
            {copy.pitch.body}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ToolTrialLink
              slug={tool.slug}
              group={tool.group}
              placement="pitch"
              className="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
            >
              Start your 14-day free trial
            </ToolTrialLink>
            <FeatureLink
              slug={tool.slug}
              group={tool.group}
              href={pitch.href}
              className="inline-flex min-h-11 items-center gap-1.5 text-body-sm font-medium underline underline-offset-4"
            >
              {pitch.label}
            </FeatureLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="wide">
          <h2 className="font-display text-heading font-medium">Frequently asked questions</h2>
          <div className="mt-8 flex flex-col">
            {copy.faq.map((f) => (
              <div
                key={f.q}
                className="grid gap-2 border-t border-line py-6 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:gap-10"
              >
                <h3 className="text-body font-semibold">{f.q}</h3>
                <p className="max-w-[42rem] text-body-sm leading-relaxed text-fg-muted">{f.a}</p>
              </div>
            ))}
          </div>

          {copy.disclaimer ? (
            <aside className="mt-10 rounded-surface border border-line bg-sunken p-5 text-caption leading-relaxed text-fg-muted">
              {copy.disclaimer}
            </aside>
          ) : null}

          {keepGoing.length > 0 ? (
            <nav aria-label="Keep going" className="mt-12">
              <h2 className="text-body font-semibold">Keep going</h2>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
                {keepGoing.map((k) => (
                  <li key={k.href}>
                    <a
                      className="inline-flex min-h-11 items-center underline underline-offset-4"
                      href={k.href}
                    >
                      {k.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="sunken">
          <Container width="wide">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-heading font-medium">More free calculators</h2>
              <a
                href="/tools"
                className="inline-flex min-h-11 items-center gap-1.5 text-body-sm font-medium underline underline-offset-4"
              >
                See all free tools <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-surface border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="bg-surface">
                  <RelatedLink
                    from={tool.slug}
                    to={r.slug}
                    className="flex h-full flex-col gap-2 p-6 transition-colors hover:bg-hover"
                  >
                    <span className="text-caption text-fg-subtle">{GROUP_LABEL[r.group]}</span>
                    <span className="font-display text-subheading font-semibold">{r.name}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-body-sm font-medium">
                      Open calculator <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </RelatedLink>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {sections.aiLinks ? <AiResearchLinks slug={tool.slug} name={tool.name} /> : null}

      <section className="border-t border-line bg-surface">
        <Container className="flex flex-col items-start gap-5 py-16 sm:py-24">
          <h2 className="max-w-[40rem] font-display text-display font-medium text-balance">
            {copy.close.heading}
          </h2>
          <p className="max-w-[38rem] text-body leading-relaxed text-fg-muted">{copy.close.body}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ToolTrialLink
              slug={tool.slug}
              group={tool.group}
              placement="band"
              className="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
            >
              Start your 14-day free trial
            </ToolTrialLink>
            {sections.demo ? (
              <DemoLink
                slug={tool.slug}
                group={tool.group}
                placement="band"
                className="inline-flex min-h-11 items-center gap-1.5 text-body-sm font-medium underline underline-offset-4"
              />
            ) : null}
          </div>
          <small className="text-caption text-fg-subtle">14 days free. Cancel any time.</small>
        </Container>
      </section>
    </ToolProvider>
  );
}

/**
 * "Researching with AI?": opens the page's own URL as a question in an assistant.
 * Only on the tools where the research found it (plan §3).
 */
function AiResearchLinks({ slug, name }: { slug: string; name: string }) {
  const url = `${SITE.url}/tools/${slug}`;
  const q = encodeURIComponent(
    `Explain the ${name.toLowerCase()} on ${url} and how a coach should use it.`,
  );
  const targets = [
    { label: "ChatGPT", href: `https://chatgpt.com/?q=${q}` },
    { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${q}` },
    { label: "Claude", href: `https://claude.ai/new?q=${q}` },
  ];
  return (
    <Section>
      <Container width="prose">
        <h2 className="text-body font-semibold">Researching with AI?</h2>
        <p className="mt-2 text-body-sm text-fg-muted">
          Ask an assistant about this page directly.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {targets.map((t) => (
            <li key={t.label}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-control border border-line px-4 text-body-sm font-medium transition-colors hover:bg-hover"
              >
                Ask {t.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
