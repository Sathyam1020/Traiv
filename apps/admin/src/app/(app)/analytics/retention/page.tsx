"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { cn } from "@traiv/ui/lib/cn";
import { useState } from "react";
import { AdminState, Empty } from "@/components/common/admin-state";
import { ExportCsvButton } from "@/components/common/export-csv-button";
import type { RetentionCohort, RetentionReport } from "@/lib/api";
import { toCsv } from "@/lib/csv";
import { useRetention, useSession } from "@/lib/query";

const MIN_COHORT_SIZE = 5;

const FILTERS: { value: RetentionReport["cohortFilter"]; label: string }[] = [
  { value: "all", label: "All trainers" },
  { value: "narrow", label: "Narrow activation" },
  { value: "broad", label: "Broad activation" },
  { value: "client", label: "Client activation" },
];

/**
 * "Do people stick around?" — `admin-dashboard-spec.md` §6. The filter toggle *is*
 * `metric-definitions.md`'s validation tool: comparing this heatmap's shape across the
 * three candidate trainer-activation definitions is how one of them eventually gets
 * promoted to "the" activation metric — not decided here.
 */
export default function RetentionPage() {
  const [filter, setFilter] = useState<RetentionReport["cohortFilter"]>("all");
  const weeks = 8;
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useRetention(weeks, filter, signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Retention</h1>
          <p className="text-body-sm text-fg-muted">
            % of each signup-week cohort with a weekly-active client N weeks later.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-body-sm font-medium transition-colors",
                filter === f.value
                  ? "border-fg bg-fg text-bg"
                  : "border-line text-fg-muted hover:text-fg",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <AdminState
        pending={report.isPending || session.isPending}
        error={report.error}
        onRetry={() => void report.refetch()}
        skeleton={<Skeleton className="h-64 rounded-surface" />}
      >
        {report.data ? <Heatmap data={report.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Heatmap({ data }: { data: RetentionReport }) {
  if (data.cohorts.length === 0) {
    return <Empty>No studios match this cohort filter yet.</Empty>;
  }

  const shade = (v: number | null) => {
    if (v === null) return "bg-sunken";
    const pct = Math.round(v * 100);
    if (pct >= 60) return "bg-fg text-bg";
    if (pct >= 35) return "bg-fg/60 text-bg";
    if (pct >= 15) return "bg-fg/30";
    return "bg-fg/10";
  };

  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
      <div className="flex items-center justify-end">
        <ExportCsvButton
          filename="retention-cohorts.csv"
          getCsv={() =>
            toCsv(
              ["cohort_week", "size", ...Array.from({ length: data.weeks }, (_, w) => `w${w}`)],
              data.cohorts.map((c) => [
                c.week,
                c.size,
                // A cohort small enough to re-identify a single studio's outcome is
                // masked in full, not just its size — the retention % alone would
                // still reveal exactly who stayed.
                ...c.retention.map((v) => {
                  if (c.size < MIN_COHORT_SIZE) return "suppressed" as const;
                  return v === null ? "" : Math.round(v * 100);
                }),
              ]),
            )
          }
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-separate border-spacing-1 text-body-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-fg-subtle">Cohort</th>
              <th className="text-left font-medium text-fg-subtle">Size</th>
              {Array.from({ length: data.weeks }, (_, w) => (
                <th key={w} className="px-1 text-center font-medium text-fg-subtle">
                  W{w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.cohorts.map((c: RetentionCohort) => (
              <tr key={c.week}>
                <td className="whitespace-nowrap pr-2 tabular-nums text-fg-muted">{c.week}</td>
                <td className="pr-2 tabular-nums text-fg-muted">{c.size}</td>
                {c.retention.map((v, w) => (
                  <td
                    key={w}
                    className={cn("rounded-surface px-2 py-1.5 text-center tabular-nums", shade(v))}
                  >
                    {v === null ? "—" : `${Math.round(v * 100)}%`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
