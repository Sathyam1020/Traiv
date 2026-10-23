"use client";

import { Logo } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { RailBrand } from "@traiv/ui/components/shell/rail";
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
        <RailBrand name={session.data?.user.name || "Admin"} sub="Traiv admin">
          <ThemeToggle tone="rail" />
        </RailBrand>
      }
      sidebarAccount={<AccountButton tone="rail" />}
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
