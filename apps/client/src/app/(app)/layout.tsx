"use client";

import { Logo } from "@traiv/ui/components/logo";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { MobileHeader } from "@traiv/ui/components/shell/mobile-header";
import { RailBrand } from "@traiv/ui/components/shell/rail";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StatusGate } from "@/components/common/status-gate";
import { AccountButton } from "@/components/layout/account-button";
import { navFor } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useActiveStudio, useIntake, useSession, useToday } from "@/lib/query";

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

  // Blocked only when nothing is running. With two coaches and one paused, the app works
  // and the paused one carries its state on its own card.
  const { studioId, stalled } = useActiveStudio();
  const blocked = stalled !== null;
  const intake = useIntake(studioId);

  /**
   * The nav's source of truth, fetched here because the tab bar is on every screen.
   *
   * Held back until onboarding is finished: a client being redirected into the intake
   * form has no use for a request that decides which tabs to show them afterwards, and
   * on a slow connection it would compete with the form they are waiting for. React
   * Query dedupes it with the Today page's own call.
   */
  const onboarded = Boolean(intake.data?.intake?.completedAt);
  const today = useToday(onboarded ? studioId : null);

  useEffect(() => {
    if (!session.isPending && !signedIn) router.replace("/");
  }, [session.isPending, signedIn, router]);

  // Onboarding is not optional, so neither is passing through it. A client whose
  // coaching is paused or over is not sent through it at all — asking somebody to fill
  // in an intake form for a relationship that is not running is absurd, and the gate
  // below is what they see instead.
  useEffect(() => {
    if (!blocked && studioId && intake.data && !intake.data.intake?.completedAt) {
      router.replace(`/intake/${studioId}`);
    }
  }, [blocked, studioId, intake.data, router]);

  if (blocked) {
    return <StatusGate status={stalled?.status} coachName={stalled?.studio.name} />;
  }

  return (
    <AppShell
      nav={navFor(today.data?.reveal)}
      sidebarBrand={
        <RailBrand name={session.data?.user.name || "You"} sub="Traiv">
          <ThemeToggle tone="rail" />
        </RailBrand>
      }
      sidebarAccount={<AccountButton tone="rail" />}
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
