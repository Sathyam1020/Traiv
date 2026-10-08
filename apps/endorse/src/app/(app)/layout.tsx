"use client";

import { Wordmark } from "@traiv/ui/components/logo";
import { TopBar } from "@traiv/ui/components/shell/top-bar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountButton } from "@/components/layout/account-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSession } from "@/lib/query";

/** One screen, so a header rather than a sidebar holding a single link. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  return (
    <div className="min-h-dvh bg-canvas">
      <TopBar
        brand={<Wordmark size={24} />}
        account={
          <>
            <ThemeToggle />
            <AccountButton />
          </>
        }
      />
      <main className="px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
