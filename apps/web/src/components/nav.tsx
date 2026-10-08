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
import { useEffect, useState } from "react";
import { NotifyMe } from "@/components/notify-me";
import { NAV_FEATURES } from "@/content/features";
import { NAV } from "@/content/site";
import { TOOLS } from "@/content/tools";

/**
 * The marketing header — a floating capsule, not a full-width bar.
 *
 * The bar version meets both window edges and reads as chrome. The capsule sits *on* the
 * page with the content visible past it, which is the thing worth copying from the
 * references: the header looks like part of the design rather than a strip bolted above.
 *
 * The dropdowns are Radix `NavigationMenu` rather than hand-rolled hover state. The
 * hand-rolled version closed the moment the pointer crossed the gap between the trigger
 * and the panel — the classic bug in this pattern, and not one a close-delay actually
 * fixes, because the delay still has to guess. Radix tracks pointer *direction* and keeps
 * the menu open while you are moving toward it, which is the behaviour people expect and
 * is not worth reimplementing.
 */
export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // At the top of the page the capsule is part of the hero and wants no edge; over
  // content it needs one or the text scrolls into it. A single boolean rather than a
  // value tied to scroll position, which would repaint on every frame of every scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[76rem] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Traiv home"
          className="flex shrink-0 items-center gap-2.5 rounded-full py-2 pr-5 pl-2.5 transition-opacity hover:opacity-80"
        >
          <Logo size={28} />
          <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
            Traiv
          </span>
        </Link>

        <NavigationMenu
          viewport={false}
          className={`nav-capsule hidden max-w-none rounded-full p-1.5 backdrop-blur-xl lg:flex ${
            scrolled ? "bg-surface/85 shadow-sm ring-1 ring-line" : "bg-surface/55"
          }`}
        >
          <NavigationMenuList className="gap-0.5">
            <NavigationMenuItem>
              {/*
                With viewport={false} a panel is positioned against the menu root — the
                capsule — not against its own trigger. The capsule is right-aligned on
                the page, so the panels are too; anchored left, a 44rem menu opened from
                the leftmost item runs off the right edge of a 1100px window.
              */}
              <NavigationMenuTrigger className="h-auto rounded-full bg-transparent px-3.5 py-2 text-body-sm font-normal text-fg-muted hover:bg-hover hover:text-fg focus:bg-hover data-[state=open]:bg-hover data-[state=open]:text-fg">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:right-0 md:left-auto rounded-panel border border-line bg-surface p-3 shadow-lg">
                <ul className="grid w-[min(44rem,calc(100vw-4rem))] gap-1 sm:grid-cols-2">
                  {NAV_FEATURES.map((f) => (
                    <li key={f.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/features/${f.slug}`}
                          className="flex-row items-start gap-3 rounded-control p-3"
                        >
                          <f.icon className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-body-sm font-medium">{f.name}</span>
                            <span className="text-caption text-fg-muted">{f.blurb}</span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                <NavigationMenuLink asChild>
                  <Link
                    href="/features"
                    className="mt-2 flex-row items-center justify-center gap-2 rounded-control bg-sunken px-4 py-3 text-body-sm font-medium"
                  >
                    Browse all features
                    <ArrowRight className="size-4" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-auto rounded-full bg-transparent px-3.5 py-2 text-body-sm font-normal text-fg-muted hover:bg-hover hover:text-fg focus:bg-hover data-[state=open]:bg-hover data-[state=open]:text-fg">
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:right-0 md:left-auto rounded-panel border border-line bg-surface p-3 shadow-lg">
                <ul className="grid w-[min(26rem,calc(100vw-4rem))] gap-1">
                  {TOOLS.map((t) => (
                    <li key={t.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={t.href}
                          className="flex-row items-start gap-3 rounded-control p-3"
                        >
                          <t.icon className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-body-sm font-medium">{t.name}</span>
                            <span className="text-caption text-fg-muted">{t.blurb}</span>
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
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="rounded-full px-3.5 py-2 text-body-sm text-fg-muted hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <li aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

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
              className={`nav-capsule cursor-pointer rounded-full p-2.5 text-fg backdrop-blur-xl ${
                scrolled ? "bg-surface/85 shadow-sm ring-1 ring-line" : "bg-surface/55"
              }`}
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
              className="block rounded-control px-2 py-2.5 text-body-sm text-fg-muted transition-colors hover:bg-hover hover:text-fg"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
