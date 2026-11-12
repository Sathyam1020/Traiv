"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { useState } from "react";
import { AdminState, Stat } from "@/components/common/admin-state";
import type { EngagementReport } from "@/lib/api";
import { useEngagement, useSession } from "@/lib/query";

/** "How often do people come back and do something?" — `admin-dashboard-spec.md` §5. */
export default function EngagementPage() {
  const [days, setDays] = useState(30);
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useEngagement(days, signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Engagement</h1>
          <p className="text-body-sm text-fg-muted">
            How often people come back and actually do something, not just open the app.
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

function Dashboard({ data }: { data: EngagementReport }) {
  const pct = (v: number | null) => (v === null ? "—" : `${Math.round(v * 100)}%`);

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="Sessions / user / week"
          value={data.sessionsPerUserPerWeek.toFixed(1)}
          note="session_started events — a proxy until analytics_session is populated"
        />
        <Stat label="Check-ins on time" value={pct(data.checkInOnTimeRate)} />
        <Stat
          label="Workout completion"
          value={pct(data.workoutCompletionRate)}
          note="completed ÷ started"
        />
      </section>

      <p className="max-w-[75ch] text-caption leading-relaxed text-fg-subtle">
        "Sessions / user / week" counts <code>session_started</code> events, not real materialized
        sessions — <code>analytics_session</code> exists in the schema but nothing populates it yet
        (flagged in <code>docs/analytics/risks-and-open-questions.md</code>). It overcounts someone
        who force-quits and reopens the app within one real sitting.
      </p>
    </div>
  );
}
