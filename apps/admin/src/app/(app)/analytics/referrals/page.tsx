"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { useState } from "react";
import { AdminState, Stat } from "@/components/common/admin-state";
import type { ReferralsReport } from "@/lib/api";
import { useReferrals, useSession } from "@/lib/query";

/**
 * "Is the endorser program working?" — `admin-dashboard-spec.md` §10. Deliberately its
 * own page, never summed with Acquisition's marketing-channel numbers
 * (`attribution-design.md`'s "separate channel, not blended").
 */
export default function ReferralsPage() {
  const [days, setDays] = useState(30);
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useReferrals(days, signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Referrals</h1>
          <p className="text-body-sm text-fg-muted">
            The endorser program — separate from Acquisition's marketing channels.
          </p>
        </div>
        <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <TabsList>
            <TabsTrigger value="7">7 days</TabsTrigger>
            <TabsTrigger value="30">30 days</TabsTrigger>
            <TabsTrigger value="90">90 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <AdminState
        pending={report.isPending || session.isPending}
        error={report.error}
        onRetry={() => void report.refetch()}
        skeleton={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[5.5rem] rounded-surface" />
            ))}
          </div>
        }
      >
        {report.data ? <Dashboard data={report.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Dashboard({ data }: { data: ReferralsReport }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Stat label="Codes created" value={data.codesCreated} note={`in ${data.days} days`} />
      <Stat label="Referrals attributed" value={data.referralsAttributed} />
      <Stat
        label="Still-active conversion"
        value={
          data.activeConversionRate === null
            ? "—"
            : `${Math.round(data.activeConversionRate * 100)}%`
        }
        note="attributed studios still active"
      />
    </section>
  );
}
