"use client";
import { Logo } from "@traiv/ui/components/logo";

import { LogOut } from "lucide-react";
import { Avatar } from "@/components/common/avatar";
import { StudioSwitcher } from "@/components/layout/studio-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLogout, useSession } from "@/lib/query";

/** Only below lg — above it, all of this lives in the sidebar. */
export function MobileHeader() {
  const { data } = useSession();
  const logout = useLogout();

  return (
    <header className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <Logo size={26} className="shrink-0" />
        <StudioSwitcher />
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex cursor-pointer items-center gap-1.5 rounded-control px-1.5 py-1 transition-colors hover:bg-hover"
          aria-label="Sign out"
        >
          <Avatar name={data?.user.name || "Coach"} size={26} />
          <LogOut className="size-3.5 text-fg-subtle" />
        </button>
      </div>
    </header>
  );
}
