"use client";

import { MobileBar } from "@traiv/ui/components/shell/mobile-bar";
import { NavOverrideProvider } from "@traiv/ui/components/shell/nav-override-context";
import { Sidebar } from "@traiv/ui/components/shell/sidebar";
import { SidebarProvider, useSidebar } from "@traiv/ui/components/shell/sidebar-context";
import type { Icon } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import type { ReactNode } from "react";

/**
 * One destination in an app's navigation.
 *
 * Apps own their own array. The shell renders whatever it is handed, which makes adding
 * a tab a one-line change on the day the screen behind it exists — rather than shipping
 * empty tabs and waiting, which `.ai/product/competitor-client-apps.md` found is how
 * every competitor's client app ends up feeling hollow.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  badge?: number;
};

/**
 * A labelled run of destinations.
 *
 * The coach app has four subjects — clients, training, nutrition, forms — and a flat
 * list of fourteen links makes the reader scan all fourteen to find one. A group with
 * no `label` renders as a plain run, which is what an app with three screens wants.
 */
export type NavGroup = {
  label?: string;
  items: readonly NavItem[];
};

/**
 * The frame for an app with real navigation: trainer and client.
 *
 * The ground is the darkest surface and the content sits on it as an inset lit panel —
 * Featurebase's product frame (ADR 0022) — rather than the page and the sidebar being
 * one continuous sheet. The difference is not decoration: it
 * puts a hard edge around the thing you are working on, so a dense table reads as a
 * document on a desk instead of running into the chrome. The rail is `bg-contrast`,
 * which is dark in both themes by design — pair it only with `text-contrast-fg`.
 *
 * Below `lg` the panel takes the whole window and navigation moves to the floating bar;
 * a 240px rail on a phone is not navigation, it is a wall.
 *
 * Nothing outside the panel scrolls. The root is `h-dvh overflow-hidden`, the panel
 * fills it, and a single box inside the panel carries the scrollbar. The alternative —
 * letting the window scroll — drags the panel's rounded corners and its header off the
 * top of the screen, so the frame the design is built around only exists until you
 * touch the wheel.
 *
 * The layout rendering this has to be a client component. `NavItem.icon` is a component
 * reference, and functions cannot cross the server→client boundary — a server layout
 * passing `nav` in fails at prerender with "Functions cannot be passed directly to
 * Client Components", which reads like a bug in the shell and is not.
 */
export function AppShell({
  nav,
  sidebarBrand,
  sidebarFooter,
  sidebarAccount,
  header,
  mobileGlass = false,
  reserveMobileBarSpace = true,
  children,
}: {
  nav: readonly NavGroup[];
  /** Top of the rail — who you are signed in as, and anything you switch between. */
  sidebarBrand: ReactNode;
  /** Above the account block: the links that are always last, like help and settings. */
  sidebarFooter?: ReactNode;
  /** The bottom of the rail — the account, and the way out. */
  sidebarAccount: ReactNode;
  /** Shown below `lg` only; above it everything lives in the rail. */
  header: ReactNode;
  mobileGlass?: boolean;
  /** Disable when a screen owns its scrolling and bottom navigation clearance. */
  reserveMobileBarSpace?: boolean;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <NavOverrideProvider>
        <Shell
          nav={nav}
          sidebarBrand={sidebarBrand}
          sidebarFooter={sidebarFooter}
          sidebarAccount={sidebarAccount}
          header={header}
          mobileGlass={mobileGlass}
          reserveMobileBarSpace={reserveMobileBarSpace}
        >
          {children}
        </Shell>
      </NavOverrideProvider>
    </SidebarProvider>
  );
}

function Shell({
  nav,
  sidebarBrand,
  sidebarFooter,
  sidebarAccount,
  header,
  mobileGlass = false,
  reserveMobileBarSpace = true,
  children,
}: {
  nav: readonly NavGroup[];
  sidebarBrand: ReactNode;
  sidebarFooter?: ReactNode;
  sidebarAccount: ReactNode;
  header: ReactNode;
  mobileGlass?: boolean;
  /** Disable when a screen owns its scrolling and bottom navigation clearance. */
  reserveMobileBarSpace?: boolean;
  children: ReactNode;
}) {
  const sidebar = useSidebar();
  const collapsed = sidebar?.collapsed ?? false;
  // The floating bar cannot show groups, and does not need to: it carries the three or
  // four destinations that matter on a phone, in the order the groups declare them.
  const flat = nav.flatMap((group) => group.items);

  return (
    // `fixed inset-0` rather than `h-dvh`: the shell IS the viewport. Taking it out of
    // flow leaves the document with no in-flow content at all, so the window cannot
    // scroll even by a pixel — `h-dvh` left the page draggable on mobile, which shows
    // up as the whole panel sliding and a strip of nothing underneath it.
    <div className="fixed inset-0 overflow-hidden bg-contrast">
      <Sidebar
        nav={nav}
        brand={sidebarBrand}
        footer={sidebarFooter}
        account={sidebarAccount}
        collapsed={collapsed}
      />

      {/* The panel. Inset by a hair on the dark ground at `lg`, flush below it, where
          the extra 8px is worth more as content than as frame.

          The inset is padding on this wrapper, never a margin on the panel: a top margin
          with nothing above it to stop it collapses straight out through both parents and
          lands on the body, which paints a strip of the wrong colour across the top of
          the window. Padding cannot collapse, so there is nothing to get wrong.

          `pl` is the rail's width exactly — 15.5rem open, 4rem collapsed — and NOT the
          width plus a gap. The rail already pays 0.75rem of its own right padding, so
          adding the gap here charges for it twice: the links stopped 0.75rem short of
          the rail's edge and the panel started 0.75rem past it, leaving 1.5rem between
          the navigation and the content against 0.75rem on the other three sides. The
          gutter has to come from one side or the other, and the rail's own padding is
          the side that also keeps the links off the window edge.

          It animates over the same 300ms as the rail itself, so the panel edge tracks
          the rail rather than chasing it. */}
      <div
        className={cn(
          "h-full transition-[padding] duration-300 ease-out-soft motion-reduce:transition-none",
          "lg:py-3 lg:pr-3",
          collapsed ? "lg:pl-16" : "lg:pl-[15.5rem]",
        )}
      >
        {/* The panel is the frame, and it does not move.
            `overflow-hidden` is what makes the rounded corners actually clip, so a
            child's background can no longer paint square over the curve — and it is
            only safe because the scrolling happens on the element below, not here. */}
        <main className="flex h-full flex-col overflow-hidden bg-panel lg:rounded-panel lg:border lg:border-line lg:shadow-float">
          {header}

          {/* The one thing that scrolls.
              `min-h-0` is load-bearing: a flex child's default `min-height: auto`
              refuses to shrink below its content, so without it this box grows to fit
              the page, nothing ever overflows, and the whole panel scrolls away
              instead — which is the bug this layout exists to fix. */}
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-y-auto",
              // Reserve the glass bar's height, bottom offset, and home-indicator inset
              // in the shared scroll area, including screens with their own scrollers.
              mobileGlass &&
                reserveMobileBarSpace &&
                "pb-[calc(5.5rem+env(safe-area-inset-bottom))] scroll-pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0 lg:scroll-pb-0",
            )}
          >
            {children}
          </div>
        </main>
      </div>

      <MobileBar nav={flat} glass={mobileGlass} />
    </div>
  );
}
