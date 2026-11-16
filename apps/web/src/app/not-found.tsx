import Link from "next/link";
import { Container } from "@/components/layout";
import { FOOTER } from "@/content/site";

const LINK =
  "flex items-center text-body-sm text-fg-muted transition-colors hover:text-fg pointer-coarse:min-h-11";

/**
 * The page that is not there.
 *
 * It lists where to go instead rather than apologising, because somebody who lands here
 * followed a link that was wrong and the useful thing is the right link.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-20">
      <h1 className="font-display text-display font-medium">That page is not here</h1>
      <p className="mt-4 max-w-[34rem] text-body leading-relaxed text-fg-muted">
        Either we moved it or the link was wrong. Everything the site has is below.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {FOOTER.map((group) => (
          <div key={group.heading} className="flex flex-col gap-3">
            <h2 className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
              {group.heading}
            </h2>
            <ul className="flex flex-col gap-2 pointer-coarse:gap-0">
              {group.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
