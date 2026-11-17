import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

/**
 * The shapes every page past the landing page is built from.
 *
 * Twenty routes written freehand drift within a week — one page at `max-w-[72rem]`, the
 * next at `72ch`, headings two steps apart for no reason. These four components are the
 * measure, so a new page is content and nothing else.
 */

/**
 * The page's measure. `wide` is for anything with a chart or a table in it. `tool` is the
 * free-tool page column: 64rem less the 2rem gutters is a 960px column, the width measured
 * on Coachway's tool pages, which the founder asked these pages to match.
 */
const MEASURE = {
  default: "max-w-[72rem]",
  wide: "max-w-[76rem]",
  prose: "max-w-[46rem]",
  tool: "max-w-[64rem]",
} as const;

export function Container({
  children,
  width = "default",
  className = "",
}: {
  children: ReactNode;
  width?: keyof typeof MEASURE;
  className?: string;
}) {
  const max = MEASURE[width];
  return <div className={`mx-auto w-full ${max} px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  tone = "canvas",
  className = "",
}: {
  children: ReactNode;
  /** `sunken` bands alternate the page so a long scroll has joints in it. */
  tone?: "canvas" | "sunken";
  className?: string;
}) {
  return (
    <section
      className={`py-16 sm:py-24 ${tone === "sunken" ? "border-y border-line bg-sunken" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Every page opens the same way: one h1, one paragraph, optional controls.
 *
 * Free-tool pages use their own header with a small label above the h1
 * ("Free tool · Nutrition"), matching the researched layout (ADR 0036).
 */
export function PageHero({
  title,
  lede,
  children,
  width = "default",
}: {
  title: string;
  lede?: string;
  children?: ReactNode;
  width?: "default" | "wide" | "prose";
}) {
  return (
    <section className="border-b border-line">
      <Container width={width} className="pt-10 pb-14 sm:pt-16 sm:pb-20">
        <Reveal>
          <h1 className="max-w-[40rem] font-display text-display font-medium text-balance">
            {title}
          </h1>
        </Reveal>
        {lede ? (
          <Reveal delay={70}>
            <p className="mt-5 max-w-[38rem] text-[1.0625rem] leading-relaxed text-fg-muted">
              {lede}
            </p>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal delay={140}>
            <div className="mt-9">{children}</div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}

export function SectionHeading({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="max-w-[46rem]">
      <h2 className="font-display text-heading font-medium text-balance">{title}</h2>
      {lede ? <p className="mt-4 text-body leading-relaxed text-fg-muted">{lede}</p> : null}
      {children}
    </Reveal>
  );
}
