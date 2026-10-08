"use client";

import { Logo, Wordmark } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountButton } from "@/components/layout/account-button";
import { navItems } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSession } from "@/lib/query";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  return (
    <AppShell
      nav={navItems}
      sidebarBrand={
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Wordmark size={24} />
            <span className="text-caption font-medium text-fg-subtle">Admin</span>
          </div>
          <ThemeToggle />
        </div>
      }
      sidebarAccount={<AccountButton />}
      header={
        <MobileHeader
          left={
            <>
              <Logo size={26} className="shrink-0" />
              <span className="text-body-sm font-medium text-fg-muted">Admin</span>
            </>
          }
          right={
            <>
              <ThemeToggle />
              <AccountButton />
            </>
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
