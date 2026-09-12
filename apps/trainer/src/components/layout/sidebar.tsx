"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/common/avatar";
import { navItems } from "@/components/layout/nav-items";
import { StudioSwitcher } from "@/components/layout/studio-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLogout, useSession } from "@/lib/query";

/**
 * Desktop navigation. Floats with a margin rather than meeting the window edges, so the
 * page reads as a surface sitting on the canvas rather than a frame around it.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const logout = useLogout();

  return (
    <aside className="fixed inset-y-4 left-4 z-30 hidden w-60 flex-col rounded-panel border border-line bg-surface p-3 shadow-sm lg:flex">
      <div className="flex items-center justify-between px-2 py-2">
        <span className="text-subheading font-semibold tracking-[-0.02em]">Traiv</span>
        <ThemeToggle />
      </div>

      <div className="px-2 pb-3">
        <StudioSwitcher />
      </div>

      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-control px-2.5 py-2 text-body-sm transition-colors ${
                active
                  ? "bg-active font-medium text-fg"
                  : "text-fg-muted hover:bg-hover hover:text-fg"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line pt-3">
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-control px-2 py-2 text-left transition-colors hover:bg-hover"
        >
          <Avatar name={data?.user.name || "Coach"} size={26} />
          <span className="min-w-0 flex-1 truncate text-body-sm">
            {data?.user.name || "Your account"}
          </span>
          <LogOut className="size-3.5 shrink-0 text-fg-subtle" />
        </button>
      </div>
    </aside>
  );
}
