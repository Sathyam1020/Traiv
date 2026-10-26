"use client";

import { Button } from "@traiv/ui/components/button";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import { useCheckIns, useClient, useClientOverview, useTags } from "@/lib/query";
import { ClientHeader, ClientHeaderSkeleton } from "../_components/client-header";
import { Overview, OverviewSkeleton } from "../_components/overview/overview";
import { ClientWorkouts } from "../_components/workouts/client-workouts";

/**
 * One client.
 *
 * Overview and Workouts are real; `ClientHeader` owns the tab row itself, including the
 * five tabs with no screen behind them yet — they stay disabled with a "Not built yet"
 * tooltip rather than being left off the bar, so the real app's shape stays visible.
 * This page only has to say which of the *ready* tabs is open.
 */
export default function ClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const searchParams = useSearchParams();
  const studioId = useActiveStudioId();
  const client = useClient(studioId, clientId);
  const overview = useClientOverview(studioId, clientId);
  const checkIns = useCheckIns(studioId, clientId);
  const tags = useTags(studioId);
  const [tab, setTab] = useState<"Overview" | "Workouts">(
    searchParams.get("tab") === "workouts" ? "Workouts" : "Overview",
  );

  if (client.isPending) {
    return (
      <div className="flex flex-1 flex-col">
        <ClientHeaderSkeleton />
      </div>
    );
  }

  if (client.isError || !client.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <p className="text-body text-fg-muted">
          We couldn&apos;t find that client. They may have been removed.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/clients">Back to the roster</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <ClientHeader
        studioId={studioId}
        client={client.data}
        tags={tags.data ?? []}
        activeTab={tab}
        // Only Overview and Workouts have a screen behind them; the rest stay disabled
        // in the header itself, so this can never actually be asked to switch to one.
        onTabChange={(t) => {
          if (t === "Overview" || t === "Workouts") setTab(t);
        }}
      />

      {tab === "Workouts" ? (
        <ClientWorkouts studioId={studioId} clientId={clientId} />
      ) : overview.isPending ? (
        <OverviewSkeleton />
      ) : overview.data ? (
        <Overview data={overview.data} checkIns={checkIns.data} />
      ) : (
        <p className="px-6 py-16 text-center text-body-sm text-fg-muted">
          We couldn&apos;t load this client&apos;s overview. Reload to try again.
        </p>
      )}
    </div>
  );
}
