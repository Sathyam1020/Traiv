"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout, useSession } from "@/lib/query";

export function AccountButton() {
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();
  const name = data?.user.name || "Your account";

  return (
    <button
      type="button"
      onClick={() => logout.mutate(undefined, { onSettled: () => router.replace("/") })}
      disabled={logout.isPending}
      aria-label="Sign out"
      className="flex cursor-pointer items-center gap-1.5 rounded-control px-1.5 py-1 transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
    >
      <Avatar name={name} size={26} />
      <LogOut className="size-3.5 shrink-0 text-fg-subtle" />
    </button>
  );
}
