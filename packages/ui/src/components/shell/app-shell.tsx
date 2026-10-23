"use client";

import { MobileBar } from "@traiv/ui/components/shell/mobile-bar";
import { Sidebar } from "@traiv/ui/components/shell/sidebar";
import { SidebarProvider, useSidebar } from "@traiv/ui/components/shell/sidebar-context";
import { cn } from "@traiv/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
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
  icon: LucideIcon;
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
 * The ground is dark and the content sits on it as an inset light panel, rather than the
 * page being light with a light sidebar beside it. The difference is not decoration: it
 * puts a hard edge around the thing you are working on, so a dense table reads as a
 * document on a desk instead of running into the chrome. The rail is `bg-contrast`,
 * which is dark in both themes by design — pair it only with `text-contrast-fg`.
 *
 * Below `lg` the panel takes the whole window and navigation moves to the floating bar;
 * a 240px rail on a phone is not navigation, it is a wall.
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
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Shell
        nav={nav}
        sidebarBrand={sidebarBrand}
        sidebarFooter={sidebarFooter}
        sidebarAccount={sidebarAccount}
        header={header}
      >
        {children}
      </Shell>
    </SidebarProvider>
  );
}

function Shell({
  nav,
  sidebarBrand,
  sidebarFooter,
  sidebarAccount,
  header,
  children,
}: {
  nav: readonly NavGroup[];
  sidebarBrand: ReactNode;
  sidebarFooter?: ReactNode;
  sidebarAccount: ReactNode;
  header: ReactNode;
  children: ReactNode;
}) {
  const sidebar = useSidebar();
  const collapsed = sidebar?.collapsed ?? false;
  // The floating bar cannot show groups, and does not need to: it carries the three or
  // four destinations that matter on a phone, in the order the groups declare them.
  const flat = nav.flatMap((group) => group.items);

  return (
    <div className="min-h-dvh bg-contrast">
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
          "transition-[padding] duration-300 ease-out-soft motion-reduce:transition-none",
          "lg:py-3 lg:pr-3",
          collapsed ? "lg:pl-16" : "lg:pl-[15.5rem]",
        )}
      >
        <main className="flex min-h-dvh flex-col bg-canvas lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-panel lg:border lg:border-line/60">
          {header}
          {children}
        </main>
      </div>

      <MobileBar nav={flat} />
    </div>
  );
}
