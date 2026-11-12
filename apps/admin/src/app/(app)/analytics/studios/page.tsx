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
import Link from "next/link";
import { AdminState, Empty } from "@/components/common/admin-state";
import { ExportCsvButton } from "@/components/common/export-csv-button";
import type { StudiosReport } from "@/lib/api";
import { toCsv } from "@/lib/csv";
import { useSession, useStudios } from "@/lib/query";

/** "Which accounts need attention?" — `admin-dashboard-spec.md` §8. */
export default function StudiosPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useStudios(signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Studios</h1>
          <p className="text-body-sm text-fg-muted">
            Sorted by health score — a rule-based triage score, not a predictive model.
          </p>
        </div>
        {report.data?.studios.length ? (
          <ExportCsvButton
            filename="studios.csv"
            getCsv={() =>
              toCsv(
                ["studio", "tier", "health_score", "active_clients", "last_login_at"],
                (report.data?.studios ?? []).map((s) => [
                  s.name,
                  s.tier,
                  s.healthScore,
                  s.activeClientCount,
                  s.lastLoginAt,
                ]),
              )
            }
          />
        ) : null}
      </header>

      <AdminState
        pending={report.isPending || session.isPending}
        error={report.error}
        onRetry={() => void report.refetch()}
        skeleton={<Skeleton className="h-96 rounded-surface" />}
      >
        {report.data ? <StudiosTable data={report.data} /> : null}
      </AdminState>
    </Page>
  );
}

function StudiosTable({ data }: { data: StudiosReport }) {
  if (data.studios.length === 0) return <Empty>No studios yet.</Empty>;

  return (
    <div className="overflow-x-auto rounded-surface border border-line bg-surface">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Studio</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Health score</TableHead>
            <TableHead className="text-right">Active clients</TableHead>
            <TableHead className="text-right">Last login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.studios.map((s) => (
            <TableRow key={s.studioId}>
              <TableCell className="font-medium">
                <Link href={`/analytics/studios/${s.studioId}`} className="hover:underline">
                  {s.name}
                </Link>
              </TableCell>
              <TableCell className="capitalize text-fg-muted">{s.tier}</TableCell>
              <TableCell className="text-right tabular-nums">
                {s.healthScore === null ? "—" : s.healthScore}
              </TableCell>
              <TableCell className="text-right tabular-nums">{s.activeClientCount}</TableCell>
              <TableCell className="text-right text-fg-muted">
                {s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleDateString() : "never"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
