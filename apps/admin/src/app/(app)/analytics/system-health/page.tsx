"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { AdminState, Empty, Stat } from "@/components/common/admin-state";
import { ExportCsvButton } from "@/components/common/export-csv-button";
import type { SystemHealthReport } from "@/lib/api";
import { toCsv } from "@/lib/csv";
import { useSession, useSystemHealth } from "@/lib/query";

/** "Is anything actually broken right now?" — `admin-dashboard-spec.md` §11. */
export default function SystemHealthPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useSystemHealth(signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">System health</h1>
        <p className="text-body-sm text-fg-muted">
          Last 24 hours — refreshes every minute. Kept separate from every product page: this reads{" "}
          <code>operational_event</code>, never <code>product_event</code>.
        </p>
      </header>

      <AdminState
        pending={report.isPending || session.isPending}
        error={report.error}
        onRetry={() => void report.refetch()}
        skeleton={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[5.5rem] rounded-surface" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-surface" />
          </div>
        }
      >
        {report.data ? <Dashboard data={report.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Dashboard({ data }: { data: SystemHealthReport }) {
  const totalRequests = data.byRoute.reduce((n, r) => n + r.total, 0);
  const totalFailed = data.byRoute.reduce((n, r) => n + r.failed, 0);
  const errorRate = totalRequests > 0 ? (totalFailed / totalRequests) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Error rate"
          value={`${errorRate.toFixed(2)}%`}
          note={`${totalFailed} failed`}
        />
        <Stat
          label="p50 latency"
          value={data.latencyMs.p50 === null ? "—" : `${data.latencyMs.p50}ms`}
        />
        <Stat
          label="p95 latency"
          value={data.latencyMs.p95 === null ? "—" : `${data.latencyMs.p95}ms`}
        />
        <Stat label="Job failures" value={data.jobFailures} />
      </section>

      <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-subheading font-semibold">By route</h2>
          {data.byRoute.length > 0 ? (
            <ExportCsvButton
              filename="system-health-by-route.csv"
              getCsv={() =>
                toCsv(
                  ["route", "requests", "failed"],
                  data.byRoute.map((r) => [r.route, r.total, r.failed]),
                )
              }
            />
          ) : null}
        </div>
        {data.byRoute.length === 0 ? (
          <Empty>No requests recorded in the last 24 hours.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byRoute.map((r) => (
                  <TableRow key={r.route}>
                    <TableCell className="font-medium">{r.route}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.total}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.failed > 0 ? <span className="text-danger">{r.failed}</span> : r.failed}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
