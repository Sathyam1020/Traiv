import Link from "next/link";
import { Container } from "@/components/layout";
import { NotifyMe } from "@/components/notify-me";
import { Reveal } from "@/components/reveal";

/**
 * The bottom of every page.
 *
 * One headline, the real action, and the two facts that remove the reason to hesitate.
 * The same band everywhere on purpose — a coach who has read three pages should not have
 * to work out where the button is on the fourth.
 */
export function CtaBand({
  source,
  title = "Take your next Sunday back",
  note = "Free for one client, forever. No card, and one click to leave.",
  secondary,
}: {
  /** Which band this is, so analytics can tell the pricing one from the hero one. */
  source: string;
  title?: string;
  note?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="border-t border-line bg-sunken py-16 sm:py-24">
      <Container>
        <Reveal className="flex flex-col items-start gap-6">
          <h2 className="max-w-[32rem] font-display text-[clamp(1.625rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
            {title}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <NotifyMe source={source} />
            {secondary ? (
              <Link
                href={secondary.href}
                className="inline-flex h-12 items-center justify-center rounded-control border border-line-strong bg-surface px-6 text-body-sm font-medium transition-colors hover:bg-hover"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
          <p className="text-caption text-fg-subtle">{note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
