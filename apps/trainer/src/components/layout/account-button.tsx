"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { RailTip, useRailCollapsed } from "@traiv/ui/components/shell/rail";
import { cn } from "@traiv/ui/lib/cn";
import { LogOut } from "lucide-react";
import { useLogout, useSession } from "@/lib/query";

/**
 * Who is signed in, and the way out.
 *
 * `compact` is the mobile header, where there is no room for a name — the same control,
 * not a second one, so signing out behaves identically at every width.
 */
export function AccountButton({
  compact = false,
  tone = "surface",
}: {
  compact?: boolean;
  /** `rail` is the dark sidebar — `contrast-fg`, never `fg`. */
  tone?: "surface" | "rail";
}) {
  const { data } = useSession();
  const logout = useLogout();
  const name = data?.user.name || "Coach";
  const railCollapsed = useRailCollapsed();

  // Collapsed the rail already carries this person's avatar at the top, so a second
  // one at the bottom says nothing. The icon says what the row does instead, and the
  // tooltip says it in words.
  const button = (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      aria-label="Sign out"
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-control transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        railCollapsed
          ? "mx-auto size-10 justify-center"
          : compact
            ? "gap-1.5 px-1.5 py-1"
            : "w-full px-2.5 py-2 text-left",
        tone === "rail"
          ? "text-contrast-fg hover:bg-contrast-fg/8 focus-visible:outline-contrast-fg/40"
          : "hover:bg-hover focus-visible:outline-line-focus",
      )}
    >
      {railCollapsed ? null : <Avatar name={name} size={26} />}
      {!compact && !railCollapsed && (
        <span className="min-w-0 flex-1 truncate text-body-sm">{name}</span>
      )}
      <LogOut
        className={cn(
          "shrink-0",
          railCollapsed ? "size-4" : "size-3.5",
          tone === "rail" ? "text-contrast-fg/50" : "text-fg-subtle",
        )}
      />
    </button>
  );

  return railCollapsed ? <RailTip label="Sign out">{button}</RailTip> : button;
}
