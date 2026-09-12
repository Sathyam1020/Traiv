"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/layout/nav-items";

/**
 * Mobile navigation — a floating glass bar.
 *
 * This is the one place in the product where a translucent blurred surface is allowed.
 * `ui-principles.md` bans glassmorphism as decoration; here it is functional: the bar
 * sits over scrolling content and the blur is what keeps the labels legible while
 * letting the page show through. Nothing else gets this treatment.
 */
export function MobileBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
      <div className="flex items-center justify-around gap-1 rounded-panel border border-line bg-surface/70 p-1.5 shadow-lg backdrop-blur-xl backdrop-saturate-150">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-control px-3 py-2 text-caption transition-[background-color,transform] duration-150 active:scale-[0.96] ${
                active ? "bg-active font-medium text-fg" : "text-fg-muted"
              }`}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
