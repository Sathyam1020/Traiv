"use client";

import { Logo, Wordmark } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AccountButton } from "@/components/layout/account-button";
import { navItems } from "@/components/layout/nav-items";
import { StudioSwitcher } from "@/components/layout/studio-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell
        nav={navItems}
        sidebarBrand={
          <>
            <div className="flex items-center justify-between px-2 py-2">
              <Wordmark size={24} />
              <ThemeToggle />
            </div>
            <div className="px-2 pb-3">
              <StudioSwitcher />
            </div>
          </>
        }
        sidebarAccount={<AccountButton />}
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
