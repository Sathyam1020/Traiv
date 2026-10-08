import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

/**
 * The shapes every page past the landing page is built from.
 *
 * Twenty routes written freehand drift within a week — one page at `max-w-[72rem]`, the
 * next at `72ch`, headings two steps apart for no reason. These four components are the
 * measure, so a new page is content and nothing else.
 */

/** The page's measure. `wide` is for anything with a chart or a table in it. */
export function Container({
  children,
  width = "default",
  className = "",
}: {
  children: ReactNode;
  width?: "default" | "wide" | "prose";
  className?: string;
}) {
  const max =
    width === "wide" ? "max-w-[76rem]" : width === "prose" ? "max-w-[46rem]" : "max-w-[72rem]";
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
 * No eyebrow label above the heading. The nav already says where you are, and a small
 * uppercase word over every headline is one of the clearest marks of a generated page.
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
          <h1 className="max-w-[40rem] font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance">
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
      <h2 className="font-display text-[clamp(1.625rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-body leading-relaxed text-fg-muted">{lede}</p> : null}
      {children}
    </Reveal>
  );
}
