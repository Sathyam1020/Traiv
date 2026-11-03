"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Logo } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { RailBrand, RailLink } from "@traiv/ui/components/shell/rail";
import { Settings } from "@traiv/ui/icons";
import { useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AccountButton } from "@/components/layout/account-button";
import { navItems } from "@/components/layout/nav-items";
import { StudioSwitcher } from "@/components/layout/studio-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useActiveStudioId } from "@/lib/active-studio";
import { http } from "@/lib/api/client";
import { useSession } from "@/lib/query";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const studioId = useActiveStudioId();
  const qc = useQueryClient();
  useEffect(() => {
    const update = () => {
      void qc.invalidateQueries({ queryKey: ["inbox"] });
      void qc.invalidateQueries({ queryKey: ["inbox-badge"] });
      void qc.invalidateQueries({ queryKey: ["inbox-count"] });
    };
    window.addEventListener("traiv:chat-read", update);
    return () => window.removeEventListener("traiv:chat-read", update);
  }, [qc]);
  const unread = useQuery({
    queryKey: ["inbox-badge", studioId],
    queryFn: async () =>
      (await http.get<{ unread: number }[]>(`/studios/${studioId}/inbox`)).data.reduce(
        (s, c) => s + c.unread,
        0,
      ),
    enabled: Boolean(studioId),
    refetchInterval: 10000,
  });
  const name = data?.user.name || "Coach";

  return (
    <AuthGuard>
      <AppShell
        nav={navItems.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.href === "/inbox" ? { ...item, badge: unread.data ?? 0 } : item,
          ),
        }))}
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
