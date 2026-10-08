"use client";

import { Logo } from "@traiv/ui/components/logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@traiv/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@traiv/ui/components/sheet";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NotifyMe } from "@/components/notify-me";
import { NAV_FEATURES } from "@/content/features";
import { NAV } from "@/content/site";
import { TOOLS } from "@/content/tools";

/**
 * The marketing header: a wordmark on the left, and one solid bar on the right holding
 * every link and the primary action.

 * The bar hugs its contents. shadcn's root carries `flex-1 max-w-max`, and the cap is
 * the half that matters — override it and flex-grow stretches the bar across the whole
 * window with the links marooned in the middle of it.
 *
 * The capsule is always there. An earlier version faded it in on scroll, which looked
 * clever for a second and then read as a header that had failed to load — on a white
 * hero there was nothing to see but floating words.
 *
 * ## Two things that are easy to get wrong here
 *
 * **Every item's className goes on `NavigationMenuLink`, never on the `Link` inside it.**
 * Radix's `asChild` merges className by *joining strings*, not through `cn` — so a
 * `rounded-full` written on the child lands next to the component's own `rounded-sm` and
 * the winner is decided by stylesheet order. That is why some items used to round fully
 * on hover and others did not. Passed to `NavigationMenuLink` it goes through `cn` and
 * resolves properly.
 *
 * **A panel opens under its own trigger, and is sized so it can.** An earlier version
 * pinned both panels to the right edge of the capsule, which put the Tools menu under
 * "Sign in" — correct by the CSS and nonsense to look at. They now use the default
 * anchoring, which means each panel's width has a budget: at the 1024px where this nav
 * first appears, the Features trigger sits around x=330, so anything past about 42rem
 * would leave the window. 38rem and 22rem both fit with room to spare.
 */

/** One shape for every item in the capsule, so hover looks the same wherever you are. */
const ITEM =
  "rounded-control px-3.5 py-2 text-body-sm font-normal text-fg-muted transition-colors hover:bg-hover hover:text-fg focus:bg-hover focus:text-fg";

const PANEL = "rounded-panel border border-line bg-surface p-2 shadow-lg";

/** One row in a panel. Tight, because five of these stacked should read as a list. */
const ROW = "flex-row items-start gap-3 rounded-control px-3 py-2.5";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[76rem] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Traiv home"
          className="flex shrink-0 items-center gap-2.5 py-2 transition-opacity hover:opacity-80"
        >
          <Logo size={28} />
          <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
            Traiv
          </span>
        </Link>

        <NavigationMenu
          viewport={false}
          className="hidden rounded-surface bg-surface/90 p-1.5 shadow-[0_6px_24px_-12px_rgb(0_0_0/0.25)] ring-1 ring-line backdrop-blur-xl lg:flex"
        >
          <NavigationMenuList className="gap-0.5">
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`h-auto bg-transparent ${ITEM}`}>
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent className={PANEL}>
                <ul className="grid w-[min(38rem,calc(100vw-4rem))] gap-0.5 sm:grid-cols-2">
                  {NAV_FEATURES.map((f) => (
                    <li key={f.slug}>
                      <NavigationMenuLink asChild className={ROW}>
                        <Link href={`/features/${f.slug}`}>
                          <f.icon className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-body-sm font-medium leading-snug">{f.name}</span>
                            <span className="text-caption leading-snug text-fg-muted">
                              {f.blurb}
                            </span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                <NavigationMenuLink
                  asChild
                  className="mt-1.5 flex-row items-center justify-center gap-2 rounded-control bg-sunken px-4 py-2.5 text-body-sm font-medium"
                >
                  <Link href="/features">
                    Browse all features
                    <ArrowRight className="size-4" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={`h-auto bg-transparent ${ITEM}`}>
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent className={PANEL}>
                <ul className="grid w-[min(22rem,calc(100vw-4rem))] gap-0.5">
                  {TOOLS.map((t) => (
                    <li key={t.href}>
                      <NavigationMenuLink asChild className={ROW}>
                        <Link href={t.href}>
                          <t.icon className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-body-sm font-medium leading-snug">{t.name}</span>
                            <span className="text-caption leading-snug text-fg-muted">
                              {t.blurb}
                            </span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {NAV.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild className={ITEM}>
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <li aria-hidden="true" className="mx-1.5 h-5 w-px bg-line" />

            <NavigationMenuItem>
              <NotifyMe intent="signin" source="nav" variant="quiet" label="Sign in" />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NotifyMe intent="signup" source="nav" variant="pill" label="Start free" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 lg:hidden">
          <NotifyMe intent="signup" source="nav-mobile" variant="pill" label="Start free" />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="flex size-11 cursor-pointer items-center justify-center rounded-control bg-surface/90 text-fg shadow-sm ring-1 ring-line backdrop-blur-xl"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,90vw)] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-display tracking-[-0.02em]">Traiv</SheetTitle>
                <SheetDescription className="text-caption">
                  Coaching software for independent coaches.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col px-4 pb-6">
                <MobileGroup
                  title="Features"
                  items={NAV_FEATURES.map((f) => ({
                    href: `/features/${f.slug}`,
                    label: f.name,
                  }))}
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileGroup
                  title="Tools"
                  items={TOOLS.map((t) => ({ href: t.href, label: t.name }))}
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileGroup
                  title="More"
                  items={[...NAV]}
                  onNavigate={() => setMobileOpen(false)}
                />
                <div className="pt-4">
                  <NotifyMe
                    intent="signin"
                    source="nav-sheet"
                    variant="outline"
                    label="Sign in"
                    className="w-full"
                    onOpen={() => setMobileOpen(false)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

function MobileGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: { href: string; label: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-line py-3 last:border-0">
      <p className="px-2 pb-1 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
        {title}
      </p>
      <ul>
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              onClick={onNavigate}
              className="flex items-center rounded-control px-2 py-2.5 text-body-sm text-fg-muted transition-colors hover:bg-hover hover:text-fg pointer-coarse:min-h-11 pointer-coarse:py-0"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
