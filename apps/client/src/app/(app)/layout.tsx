"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@traiv/ui/components/shell/app-shell";
import { RailBrand } from "@traiv/ui/components/shell/rail";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { StatusGate } from "@/components/common/status-gate";
import { AccountButton } from "@/components/layout/account-button";
import { BrandTheme } from "@/components/layout/brand-theme";
import { navFor } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Today } from "@/lib/api";
import { API_BASE, http } from "@/lib/api/client";
import { useActiveStudio, useIntake, useSession, useToday } from "@/lib/query";

const REVEAL_CACHE_KEY = "traiv.reveal-cache";

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
  const pathname = usePathname();
  const session = useSession();
  const signedIn = Boolean(session.data?.user);

  // A workout in progress, and the screen right after it, are the one place Coachway
  // drops every bit of app chrome — no tab bar, no header, nothing to tap by accident
  // while a set is mid-rep.
  const immersive = pathname?.startsWith("/check-in/") || /^\/workouts\/[^/]+\/[^/]+\/(active|finish)(\/|$)/.test(pathname ?? "");

  // Blocked only when nothing is running. With two coaches and one paused, the app works
  // and the paused one carries its state on its own card.
  const { studioId, stalled, coaches } = useActiveStudio();
  // The coach whose studio the app is currently showing — their colour is the one that
  // applies. With two coaches, the running one wins, same as everything else here.
  const qc = useQueryClient();
  const unreadKey = ["client-chat-unread", session.data?.user.id, studioId];
  const chatUnread = useQuery({
    queryKey: unreadKey,
    queryFn: async () =>
      (await http.get<{ unread: number }>(`/c/${studioId}/chat/unread`, { timeout: 15000 })).data
        .unread,
    enabled: Boolean(signedIn && studioId),
    retry: false,
    refetchInterval: 15000,
  });
  useEffect(() => {
    if (!studioId || !signedIn) return;
    const events = new EventSource(`${API_BASE}/c/${studioId}/chat/events`, {
      withCredentials: true,
    });
    const update = () => {
      void qc.invalidateQueries({
        queryKey: ["client-chat-unread", session.data?.user.id, studioId],
      });
    };
    events.addEventListener("change", update);
    window.addEventListener("traiv:chat-read", update);
    return () => {
      events.close();
      window.removeEventListener("traiv:chat-read", update);
    };
  }, [studioId, signedIn, qc, session.data?.user.id]);
  const brand = coaches.find((c) => c.studio.id === studioId)?.studio.color;
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

  /**
   * The nav popping a tab in a second or two after the rest of the screen is more
   * jarring than being wrong for a frame — a tab somebody just tapped moving under
   * their thumb. `useLayoutEffect`, not `useEffect`: it still only runs on the client
   * (the server has no `window` either way — see `sidebar-context.tsx`), but it runs
   * *before* the browser paints rather than after, which is the difference between the
   * cached nav applying invisibly and applying as a visible pop a frame later.
   */
  const [cachedReveal, setCachedReveal] = useState<Today["reveal"] | undefined>(undefined);
  useLayoutEffect(() => {
    try {
      const raw = window.localStorage.getItem(REVEAL_CACHE_KEY);
      if (raw) setCachedReveal(JSON.parse(raw));
    } catch {
      // Private windows and blocked site data both throw. Worst case, the tab pops in
      // once more.
    }
  }, []);
  useEffect(() => {
    if (!today.data?.reveal) return;
    try {
      window.localStorage.setItem(REVEAL_CACHE_KEY, JSON.stringify(today.data.reveal));
    } catch {
      // As above.
    }
  }, [today.data?.reveal]);
  const reveal = today.data?.reveal ?? cachedReveal;

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

  if (immersive) {
    return (
      <>
        <BrandTheme color={brand} />
        <div className="fixed inset-0 flex flex-col overflow-y-auto bg-panel">{children}</div>
      </>
    );
  }

  return (
    <>
      <BrandTheme color={brand} />
      <AppShell
        nav={navFor(reveal).map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.href === "/chat" ? { ...item, badge: chatUnread.data ?? 0 } : item,
          ),
        }))}
        mobileGlass
        sidebarBrand={
          <RailBrand name={session.data?.user.name || "You"} sub="Traiv">
            <ThemeToggle tone="rail" />
          </RailBrand>
        }
        sidebarAccount={<AccountButton tone="rail" />}
        // No top header bar at all, on any screen — Coachway's own mobile app has no
        // equivalent of this anywhere, and it was flagged as pure clutter. Below `lg`
        // the bottom tab bar is the only chrome; above it the rail already carries
        // everything this bar used to (account, theme).
        header={null}
      >
        {children}
      </AppShell>
    </>
  );
}
