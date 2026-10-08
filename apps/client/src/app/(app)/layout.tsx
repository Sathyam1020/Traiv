"use client";

import { Logo, Wordmark } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountButton } from "@/components/layout/account-button";
import { navItems } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCoaches, useIntake, useSession } from "@/lib/query";

/**
 * The frame for every signed-in client screen.
 *
 * It also owns the two gates that used to sit on the home page, because they apply to
 * every screen behind it and not just that one: you must be signed in, and you must have
 * finished onboarding. Leaving them on a single page meant `/you` would have been a hole
 * straight past both.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  const coaches = useCoaches(signedIn);
  // Any one of their coaches will do to ask through — the answers belong to the person,
  // and the studio in the path is what authorises the read, not what scopes it.
  const studioId = coaches.data?.[0]?.studio.id ?? null;
  const intake = useIntake(studioId);

  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  // Onboarding is not optional, so neither is passing through it.
  useEffect(() => {
    if (studioId && intake.data && !intake.data.intake?.completedAt) {
      router.replace(`/intake/${studioId}`);
    }
  }, [studioId, intake.data, router]);

  return (
    <AppShell
      nav={navItems}
      sidebarBrand={
        <div className="flex items-center justify-between px-2 py-2 pb-4">
          <Wordmark size={24} />
          <ThemeToggle />
        </div>
      }
      sidebarAccount={<AccountButton />}
      header={
        <MobileHeader
          left={<Logo size={26} className="shrink-0" />}
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
  );
}
