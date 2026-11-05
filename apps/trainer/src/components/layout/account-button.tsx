"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { useRailCollapsed } from "@traiv/ui/components/shell/rail";
import { ChevronsUpDown, LogOut, User } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import { useLogout, useSession } from "@/lib/query";
import { ProfileSheet } from "./profile-sheet";

export function AccountButton({
  compact = false,
  tone = "surface",
}: {
  compact?: boolean;
  tone?: "surface" | "rail";
}) {
  const { data } = useSession();
  const studioId = useActiveStudioId();
  const logout = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);
  const railCollapsed = useRailCollapsed();
  const name = data?.user.name || "Coach";
  const role =
    data?.studios.find((studio) => studio.id === studioId)?.role === "owner"
      ? "Administrator"
      : "Coach";
  const small = compact || railCollapsed;
  const button = (
    <button
      type="button"
      aria-label={`Account menu for ${name}`}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-control transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        railCollapsed
          ? "mx-auto size-10 justify-center"
          : compact
            ? "p-1"
            : "w-full px-2.5 py-2.5 text-left",
        tone === "rail"
          ? "text-contrast-fg hover:bg-contrast-fg/8 data-[popup-open]:bg-contrast-fg/15 focus-visible:outline-contrast-fg/40"
          : "hover:bg-hover focus-visible:outline-line-focus",
      )}
    >
      <Avatar name={name} src={data?.user.avatarUrl} size={small ? 32 : 40} />
      {!small ? (
        <>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-body-sm font-semibold">{name}</span>
            <span
              className={cn(
                "text-caption",
                tone === "rail" ? "text-contrast-fg/60" : "text-fg-muted",
              )}
            >
              {role}
            </span>
          </span>
          <ChevronsUpDown
            className={cn(
              "size-4 shrink-0",
              tone === "rail" ? "text-contrast-fg/60" : "text-fg-subtle",
            )}
          />
        </>
      ) : null}
    </button>
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
        <DropdownMenuContent
          side={tone === "rail" ? "right" : "bottom"}
          align="end"
          sideOffset={12}
          className="w-56 p-1"
        >
          <DropdownMenuItem onSelect={() => setProfileOpen(true)} className="gap-3 px-3 py-3">
            <User className="size-4" />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={logout.isPending}
            onSelect={() => logout.mutate()}
            className="gap-3 px-3 py-3"
          >
            <LogOut className="size-4" />
            {logout.isPending ? "Logging out…" : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
