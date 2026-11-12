"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { TriangleAlert } from "@traiv/ui/icons";
import { AdminState, Stat } from "@/components/common/admin-state";
import type { DataQualityReport } from "@/lib/api";
import { useDataQuality, useSession } from "@/lib/query";

/**
 * "Can I trust the numbers on the other pages?" — `admin-dashboard-spec.md` §12. The
 * one page that exists so a weird number elsewhere never has to be a guess between "a
 * real business signal" and "a pipeline bug."
 */
export default function DataQualityPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useDataQuality(signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">Data quality</h1>
        <p className="text-body-sm text-fg-muted">
          Known reconciliation checks against the pipeline that feeds every other page.
        </p>
      </header>

      <AdminState
        pending={report.isPending || session.isPending}
        error={report.error}
        onRetry={() => void report.refetch()}
        skeleton={
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
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

function Dashboard({ data }: { data: DataQualityReport }) {
  return (
    <div className="flex flex-col gap-5">
      {data.volumeAnomaly ? (
        <div className="flex items-start gap-3 rounded-surface border border-danger/30 bg-danger/10 p-4">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" />
          <p className="text-body-sm">
            Today's event volume ({data.eventsToday}) is less than half the trailing 7-day average (
            {data.trailingSevenDayAverage}). That's either a very quiet day or the pipeline stopped
            — worth a look.
          </p>
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Events today" value={data.eventsToday} note="product_event rows" />
        <Stat label="7-day average" value={data.trailingSevenDayAverage} />
        <Stat
          label="Rollup lag"
          value={data.rollupLagHours === null ? "—" : `${data.rollupLagHours}h`}
          note={data.lastRolledUpDay ? `last day: ${data.lastRolledUpDay}` : "never run"}
        />
        <Stat
          label="Ingestion failures"
          value={data.schemaValidationFailuresLast24h}
          note="last 24h, POST /analytics/events"
        />
      </section>
    </div>
  );
}
