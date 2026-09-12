"use client";

import { LogOut } from "lucide-react";
import { Avatar } from "@/components/common/avatar";
import { StudioSwitcher } from "@/components/layout/studio-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLogout, useSession } from "@/lib/query";
import { press } from "./section";

export function TodayHeader() {
  const { data } = useSession();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-label font-semibold tracking-[-0.015em] lg:hidden">Traiv</span>
          <StudioSwitcher />
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className={`flex items-center gap-2 rounded-control px-2 py-1 ${press}`}
            aria-label="Sign out"
          >
            <Avatar name={data?.user.name || "Coach"} size={26} />
            <LogOut className="size-3.5 text-fg-subtle" />
          </button>
        </div>
      </div>
    </header>
  );
}
