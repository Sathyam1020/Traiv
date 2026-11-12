"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { useState } from "react";
import { AdminState, Empty } from "@/components/common/admin-state";
import { ExportCsvButton } from "@/components/common/export-csv-button";
import type { ProductUsageReport } from "@/lib/api";
import { suppressible, toCsv } from "@/lib/csv";
import { useProductUsage, useSession } from "@/lib/query";

const FEATURE_LABEL: Record<string, string> = {
  workouts: "Workouts",
  nutrition: "Nutrition",
  check_ins: "Check-ins",
};

/** "What features actually get used?" — `admin-dashboard-spec.md` §4. */
export default function ProductUsagePage() {
  const [days, setDays] = useState(30);
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useProductUsage(days, signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Product usage</h1>
          <p className="text-body-sm text-fg-muted">
            Of the studios active in this window, the share that used each feature at least once —
            by plan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList>
              <TabsTrigger value="7">7 days</TabsTrigger>
              <TabsTrigger value="30">30 days</TabsTrigger>
              <TabsTrigger value="90">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
          {report.data?.features.some((f) => f.byTier.length > 0) ? (
            <ExportCsvButton
              filename={`product-usage-${days}d.csv`}
              getCsv={() =>
                toCsv(
                  ["feature", "tier", "adopted", "total", "rate"],
                  (report.data?.features ?? []).flatMap((f) =>
                    f.byTier.map((row) => [
                      f.feature,
                      row.tier,
                      suppressible(row.adopted),
                      row.total,
                      row.rate === null ? "" : Math.round(row.rate * 100),
                    ]),
                  ),
                )
              }
            />
          ) : null}
        </div>
      </header>

      <AdminState
        pending={report.isPending || session.isPending}
        error={report.error}
        onRetry={() => void report.refetch()}
        skeleton={
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-surface" />
            ))}
          </div>
        }
      >
        {report.data ? <Dashboard data={report.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Dashboard({ data }: { data: ProductUsageReport }) {
  if (data.features.every((f) => f.byTier.length === 0)) {
    return <Empty>No feature activity recorded in this window yet.</Empty>;
  }

  return (
    <div className="flex flex-col gap-5">
      {data.features.map((f) => (
        <section
          key={f.feature}
          className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5"
        >
          <h2 className="text-subheading font-semibold">{FEATURE_LABEL[f.feature] ?? f.feature}</h2>
          {f.byTier.length === 0 ? (
            <Empty>No {FEATURE_LABEL[f.feature]?.toLowerCase() ?? f.feature} activity yet.</Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {f.byTier.map((row) => (
                <div key={row.tier} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-body-sm capitalize">{row.tier}</span>
                    <span className="text-body-sm font-medium tabular-nums">
                      {row.adopted} / {row.total}
                      <span className="ml-1.5 text-caption text-fg-subtle">
                        {row.rate === null ? "—" : `${Math.round(row.rate * 100)}%`}
                      </span>
                    </span>
                  </div>
                  <span className="h-2 w-full overflow-hidden rounded-full bg-sunken">
                    <span
                      className="block h-full rounded-full bg-fg"
                      style={{ width: `${row.rate === null ? 0 : Math.round(row.rate * 100)}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
