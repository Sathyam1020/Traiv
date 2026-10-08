"use client";

import type { NavItem } from "@traiv/ui/components/shell/app-shell";
import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Navigation from `lg` up.
 *
 * Floats with a margin rather than meeting the window edges, so the page reads as a
 * surface sitting on the canvas rather than a frame around it.
 */
export function Sidebar({
  nav,
  brand,
  account,
}: {
  nav: readonly NavItem[];
  brand: ReactNode;
  account: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-4 left-4 z-30 hidden w-60 flex-col rounded-panel border border-line bg-surface p-3 shadow-sm lg:flex">
      {brand}

      <nav className="flex flex-col gap-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-control px-2.5 py-2 text-body-sm transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus",
                active
                  ? "bg-active font-medium text-fg"
                  : "text-fg-muted hover:bg-hover hover:text-fg",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line pt-3">{account}</div>
    </aside>
  );
}
