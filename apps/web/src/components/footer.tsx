import { Wordmark } from "@traiv/ui/components/logo";
import Link from "next/link";
import { FOOTER, SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-sunken">
      <div className="mx-auto w-full max-w-[72rem] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="flex max-w-[22rem] flex-col gap-3">
            <Wordmark size={26} />
            <p className="text-body-sm leading-relaxed text-fg-muted">
              Coaching software for independent coaches in India. Built so your clients open the
              app, not so your dashboard looks busy.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                  {group.heading}
                </h2>
                {/* No gap on a phone: the rows themselves are 44px tall, which spaces
                    them, and a gap on top of that turns five links into a screenful. */}
                <ul className="flex flex-col gap-2 pointer-coarse:gap-0">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center text-body-sm text-fg-muted transition-colors hover:text-fg pointer-coarse:min-h-11"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-fg-subtle">
            © {new Date().getFullYear()} {SITE.name}. Prices include GST.
          </p>
          <p className="text-caption text-fg-subtle">Made in India, for coaches here.</p>
        </div>
      </div>
    </footer>
  );
}
