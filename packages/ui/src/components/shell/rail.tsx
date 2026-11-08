"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { SolidSidebarIcon } from "@traiv/ui/components/shell/solid-sidebar-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@traiv/ui/components/tooltip";
import type { Icon } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { createContext, type ReactNode, useContext } from "react";

/**
 * The pieces that sit on the dark rail.
 *
 * Every row here uses `px-2.5`, the same inset as a nav item, so the avatar, the group
 * headings, the links and the account all start on one vertical line. Three different
 * values is what "something looks off" turns out to be nine times in ten. Collapsed,
 * the same rows become 40px squares on that same centre line.
 *
 * Presentational only — every app has its own session hooks, so the data comes in as
 * props. What they share is the one rule that is easy to get wrong here: on
 * `bg-contrast` the foreground is `contrast-fg`, never `fg`. `fg` follows the theme, so
 * a control styled with it is black-on-black the moment somebody switches to dark mode.
 */

type Rail = { collapsed: boolean };

const RailContext = createContext<Rail | null>(null);

/**
 * Scoped to the rail itself, not to the shell.
 *
 * The shell's `useSidebar` is readable from anywhere inside the app — including the page
 * body, where a `RailButton` would then believe it was collapsed and try to open a
 * tooltip with no `TooltipProvider` above it, which throws. This context only exists
 * inside the `<aside>`, so everything outside it renders expanded, which is correct.
 *
 * The tooltip provider lives here too, for the same reason: one place that is by
 * construction an ancestor of every control that can need a tip.
 */
export function RailProvider({ collapsed, children }: { collapsed: boolean; children: ReactNode }) {
  return (
    <RailContext.Provider value={{ collapsed }}>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </RailContext.Provider>
  );
}

/** False outside the rail, so these components render in full anywhere else. */
export function useRailCollapsed(): boolean {
  return useContext(RailContext)?.collapsed ?? false;
}

/**
 * The label a collapsed control has lost, given back on hover.
 *
 * An icon rail without these is a row of guesses. 200ms of delay so running the pointer
 * down the rail on the way somewhere else does not fire six of them.
 */
export function RailTip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/** A 40px square on the rail's centre line — what every row becomes when collapsed. */
export const RAIL_TILE = "size-10 justify-center";

/** Top of the rail: who you are working as, and anything you switch between. */
export function RailBrand({
  name,
  sub,
  children,
}: {
  name: string;
  /** The line under the name — a studio name, or a control that switches between them. */
  sub?: ReactNode;
  /** The right-hand side — notifications, a studio switcher. */
  children?: ReactNode;
}) {
  const collapsed = useRailCollapsed();

  // Collapsed, the right-hand slot moves underneath rather than disappearing. It holds
  // the theme toggle, and a control that exists at one rail width and not the other is
  // a control a coach stops trusting is there.
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1">
        <RailTip label={name}>
          <span className="flex size-10 items-center justify-center">
            <Avatar name={name} size={30} />
          </span>
        </RailTip>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 px-2.5 py-1">
      <Avatar name={name} size={30} />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-label font-semibold text-contrast-fg">{name}</span>
        {sub ? <span className="flex min-w-0 text-caption text-contrast-fg/50">{sub}</span> : null}
      </span>
      {children}
    </div>
  );
}

/** A link in the rail's footer — help, settings. Same shape as a nav item, no group. */
export function RailLink({ href, label, icon: Icon }: { href: string; label: string; icon: Icon }) {
  const collapsed = useRailCollapsed();

  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center whitespace-nowrap rounded-control text-label font-medium text-contrast-fg/85 transition-colors hover:bg-contrast-fg/8 hover:text-contrast-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contrast-fg/40",
        collapsed ? RAIL_TILE : "gap-2.5 px-2.5 py-2",
      )}
    >
      <SolidSidebarIcon icon={Icon} className="size-4 shrink-0" />
      {collapsed ? <span className="sr-only">{label}</span> : label}
    </Link>
  );

  return collapsed ? <RailTip label={label}>{link}</RailTip> : link;
}

/** A button on the rail — the theme toggle, notifications. */
export function RailButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const collapsed = useRailCollapsed();

  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-control text-contrast-fg/60 transition-colors hover:bg-contrast-fg/8 hover:text-contrast-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contrast-fg/40",
        className,
      )}
    >
      {children}
    </button>
  );

  return collapsed ? <RailTip label={label}>{button}</RailTip> : button;
}
