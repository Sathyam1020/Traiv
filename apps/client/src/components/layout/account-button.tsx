"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout, useSession } from "@/lib/query";

/** `compact` is the mobile header, where there is no room for a name. Same control. */
export function AccountButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();
  const name = data?.user.name || "You";

  return (
    <button
      type="button"
      onClick={() => logout.mutate(undefined, { onSettled: () => router.replace("/") })}
      disabled={logout.isPending}
      aria-label="Sign out"
      className={`flex cursor-pointer items-center gap-2.5 rounded-control transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus ${
        compact ? "gap-1.5 px-1.5 py-1" : "w-full px-2 py-2 text-left"
      }`}
    >
      <Avatar name={name} size={26} />
      {!compact && <span className="min-w-0 flex-1 truncate text-body-sm">{name}</span>}
      <LogOut className="size-3.5 shrink-0 text-fg-subtle" />
    </button>
  );
}
