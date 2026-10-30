"use client";

import type { NavGroup } from "@traiv/ui/components/shell/app-shell";
import { useNavOverride } from "@traiv/ui/components/shell/nav-override-context";
import { RAIL_TILE, RailProvider, RailTip } from "@traiv/ui/components/shell/rail";
import { SolidSidebarIcon } from "@traiv/ui/components/shell/solid-sidebar-icon";
import { ChevronDown } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

/**
 * Navigation from `lg` up: a dark rail, flush to the window.
 *
 * It sits on the shell's own dark ground rather than floating as its own card, so the
 * only edge on screen is the one around the content. Two surfaces with two borders is
 * the version that reads as chrome.
 *
 * Collapsed, it narrows to icons rather than sliding away. Hiding it entirely buys
 * 15.5rem of table nobody asked for and costs every destination in the app — the coach
 * has to reopen the rail to go anywhere. Narrowed, the whole product is still one click
 * away and the names come back on hover.
 *
 * Everything here is on `contrast-fg` with an opacity — never `fg`, which follows the
 * theme and would turn this rail into unreadable grey-on-black in dark mode. The rail
 * is dark in both themes by design; that is what `bg-contrast` means.
 */
export function Sidebar({
  nav,
  brand,
  footer,
  account,
  collapsed = false,
}: {
  nav: readonly NavGroup[];
  brand: ReactNode;
  footer?: ReactNode;
  account: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col gap-5 overflow-hidden px-3 py-4 text-contrast-fg lg:flex",
        // Width, not transform. A rail that slides out leaves nothing behind; one that
        // narrows keeps its place in the layout, and the panel's padding animates with
        // it so the content moves once rather than twice.
        "transition-[width] duration-300 ease-out-soft motion-reduce:transition-none",
        collapsed ? "w-16" : "w-[15.5rem]",
      )}
    >
      <RailProvider collapsed={collapsed}>
        {brand}

        <div
          className={cn(
            "flex flex-1 flex-col overflow-y-auto overflow-x-hidden",
            // Collapsed there are no headings to separate the groups, so the space
            // between them has to do that job on its own — but less of it, because
            // there is no text to space out any more.
            collapsed ? "gap-4" : "gap-5",
          )}
        >
          {nav.map((group, i) => (
            <Group key={group.label ?? `group-${i}`} group={group} collapsed={collapsed} />
          ))}
        </div>

        {footer ? (
          // Centred only when there is nothing to left-align to. Expanded, a footer link
          // shrink-wrapping to its own text puts "Settings" in the middle of the rail
          // while every nav item above it starts at the same left edge.
          <div className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>{footer}</div>
        ) : null}
        <div className="border-t border-contrast-fg/10 pt-3">{account}</div>
      </RailProvider>
    </aside>
  );
}

function Group({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const [open, setOpen] = useState(true);

  // A group with no name is a plain run of links — there is nothing to collapse and no
  // heading to put a control on. Collapsed, every group is that, because a heading with
  // no room for its text is a heading that says nothing.
  if (!group.label || collapsed) {
    return (
      <nav className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
        {group.items.map((item) => (
          <Item key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-control px-2.5 py-1 text-caption font-medium text-contrast-fg/45 transition-colors hover:text-contrast-fg/70"
      >
        {group.label}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", !open && "-rotate-90")}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out-soft motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        {/* `inert` while closed — the row is already clipped to zero height, but
            without it a closed group's links would still pick up keyboard focus. */}
        <nav className="flex flex-col gap-0.5 overflow-hidden" inert={!open}>
          {group.items.map((item) => (
            <Item key={item.href} {...item} collapsed={collapsed} />
          ))}
        </nav>
      </div>
    </div>
  );
}

function Item({
  href,
  label,
  icon: Icon,
  collapsed,
}: NavGroup["items"][number] & { collapsed: boolean }) {
  const pathname = usePathname();
  // A screen can borrow another item's highlight when its own route does not say which
  // section it belongs to — see `useActiveNav`.
  const current = useNavOverride() ?? pathname;
  // `startsWith` so a detail page keeps its parent lit — /clients/abc is still Clients.
  const active = current === href || current.startsWith(`${href}/`);

  const link = (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        // `whitespace-nowrap` with the rail clipping: on the way open the label is at
        // full length before the rail is, and without this it wraps to two lines and
        // the row jumps height for the length of the animation.
        "flex items-center whitespace-nowrap rounded-control text-label font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contrast-fg/40",
        collapsed ? RAIL_TILE : "gap-2.5 px-2.5 py-2",
        active
          ? "bg-contrast-fg/8 text-contrast-fg"
          : "text-contrast-fg/60 hover:bg-contrast-fg/8 hover:text-contrast-fg",
      )}
    >
      {/* The selected icon is the signal colour — the one place violet appears in the
          rail, which is what makes "you are here" readable at a glance. */}
      <SolidSidebarIcon icon={Icon} className={cn("size-4 shrink-0", active && "text-signal")} />
      {collapsed ? <span className="sr-only">{label}</span> : label}
    </Link>
  );

  return collapsed ? <RailTip label={label}>{link}</RailTip> : link;
}
