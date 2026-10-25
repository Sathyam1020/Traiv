"use client";

import { Logo } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { RailBrand, RailLink } from "@traiv/ui/components/shell/rail";
import { Settings } from "@traiv/ui/icons";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AccountButton } from "@/components/layout/account-button";
import { navItems } from "@/components/layout/nav-items";
import { StudioSwitcher } from "@/components/layout/studio-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSession } from "@/lib/query";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const name = data?.user.name || "Coach";

  return (
    <AuthGuard>
      <AppShell
        nav={navItems}
        sidebarBrand={
          <RailBrand name={name} sub={<StudioSwitcher tone="rail" />}>
            <ThemeToggle tone="rail" />
          </RailBrand>
        }
        sidebarFooter={<RailLink href="/settings" label="Settings" icon={Settings} />}
        sidebarAccount={<AccountButton tone="rail" />}
        header={
          <MobileHeader
            left={
              <>
                <Logo size={26} className="shrink-0" />
                <StudioSwitcher />
              </>
            }
            right={
              <>
                <ThemeToggle />
                <AccountButton compact />
              </>
            }
          />
        }
      >
        {children}
      </AppShell>
    </AuthGuard>
  );
}
