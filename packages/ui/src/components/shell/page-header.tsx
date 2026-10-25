"use client";

import { useSidebar } from "@traiv/ui/components/shell/sidebar-context";
import { Loader, PanelLeft } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The top of a screen inside the panel: the title, and the views of it, on one row.
 *
 * The tabs sit beside the title rather than under it. A second row costs 40px of every
 * screen to say what the first row already said, and the counts are what the coach came
 * for — "how many are waiting" answered before they decide to look.
 *
 * The counts belong in the tab, not in the page. A coach opening the roster wants to
 * know how many are waiting before they decide to look, and a tab that carries its own
 * number answers that without a click.
 */
export function PageHeader({
  title,
  tabs,
  children,
}: {
  /** Optional: a screen whose rail entry already names it does not need saying twice. */
  title?: string;
  tabs?: readonly { href: string; label: string; count?: number }[];
  /** The right-hand side of the row — a button, a menu. */
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-line border-b px-4 pt-4 sm:px-6">
      <SidebarToggle />
      {title ? <h1 className="text-heading font-medium">{title}</h1> : null}

      {tabs?.length ? (
        <nav className="-mb-px flex flex-1 gap-5 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab key={tab.href} {...tab} />
          ))}
        </nav>
      ) : (
        <span className="flex-1" />
      )}

      {children ? <div className="pb-3">{children}</div> : null}
    </header>
  );
}

/**
 * Narrows the rail to icons, and widens it back. Only rendered from `lg` up, where
 * there is a rail — below it navigation is the floating bar and there is nothing to
 * collapse.
 */
export function SidebarToggle() {
  const sidebar = useSidebar();
  if (!sidebar) return null;

  return (
    <button
      type="button"
      onClick={sidebar.toggle}
      aria-label={sidebar.collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
      aria-pressed={sidebar.collapsed}
      className="-ml-1.5 hidden size-8 cursor-pointer items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus lg:flex"
    >
      <PanelLeft className="size-4" />
    </button>
  );
}

function Tab({ href, label, count }: { href: string; label: string; count?: number }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = `${pathname}${params.size ? `?${params}` : ""}`;
  const active = current === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-label font-medium transition-colors",
        active ? "border-signal text-fg" : "border-transparent text-fg-muted hover:text-fg",
      )}
    >
      {count !== undefined ? (
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-caption font-medium tabular-nums",
            active ? "bg-signal-subtle text-signal-text" : "bg-sunken text-fg-muted",
          )}
        >
          {count}
        </span>
      ) : null}
      {label}
    </Link>
  );
}

/**
 * The row of counted filters under the tabs.
 *
 * Every chip shows its count, including the zeroes. A filter that hides itself when
 * empty is a filter the coach cannot trust — "no missing check-ins" is the answer they
 * came for, and a missing chip does not give it to them.
 *
 * The selected chip is a quiet grey fill, not the brand. These are a view switch, and
 * the only solid dark thing on the screen has to be the one action worth pressing —
 * "Add client". Two black controls competing is what makes a toolbar read as flat.
 * A count that is zero also drops to the subtle tone, so a row of eight chips tells you
 * where to look before you have read a word of it.
 */
export function FilterChips({
  chips,
  pending,
}: {
  chips: readonly { label: string; count: number; href: string; active?: boolean }[];
  /**
   * The list behind these is still loading.
   *
   * A skeleton is the wrong answer: the rows are still on screen and still true, and
   * replacing them with grey bars every time a chip is pressed is more disruptive than
   * the wait. So the chip the coach just pressed says it is working, and the table
   * behind it dims — the old rows stay readable, and it is obvious they are the old ones.
   */
  pending?: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
      {chips.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          aria-current={chip.active ? "true" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-body-sm transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus",
            chip.active
              ? "border-transparent bg-selected font-medium text-fg"
              : "border-line text-fg-muted hover:bg-hover hover:text-fg",
          )}
        >
          {chip.active && pending ? (
            <Loader className="size-3.5 min-w-5 animate-spin text-fg-muted" />
          ) : (
            <span
              className={cn(
                "flex min-w-5 items-center justify-center rounded-full px-1 py-0.5 text-caption font-medium tabular-nums",
                chip.count === 0
                  ? "text-fg-subtle"
                  : chip.active
                    ? "bg-surface text-fg"
                    : "bg-sunken text-fg",
              )}
            >
              {chip.count}
            </span>
          )}
          {chip.label}
        </Link>
      ))}
    </div>
  );
}

/** Search on the left, controls and the primary action on the right. */
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
      {children}
    </div>
  );
}

/**
 * The table and its footer as one bordered card, inset from the panel.
 *
 * The table used to run edge to edge with a hairline above it, which left the rows
 * floating in the panel with nothing holding them — the empty space under the last row
 * belonged to the page rather than to the table. A card gives that space an owner, and
 * the footer sits inside it because "viewing 5 of 5" is a fact about the table, not
 * about the screen.
 */
export function TableCard({ children, pending }: { children: ReactNode; pending?: boolean }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-6">
      <div
        aria-busy={pending || undefined}
        className="flex min-h-[22rem] flex-1 flex-col overflow-hidden rounded-surface border border-line bg-surface shadow-inset"
      >
        {/* Always rendered, so the rows never shift down by two pixels when it appears. */}
        <div
          aria-hidden="true"
          className={cn(
            "h-0.5 shrink-0 transition-colors",
            pending ? "animate-pulse bg-fg-subtle" : "bg-transparent",
          )}
        />
        {children}
      </div>
    </div>
  );
}

/** The strip at the bottom of a `TableCard`: what you are looking at, and how to page. */
export function TableFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sunken/50 px-4 py-2.5 text-body-sm text-fg-muted">
      {children}
    </div>
  );
}
