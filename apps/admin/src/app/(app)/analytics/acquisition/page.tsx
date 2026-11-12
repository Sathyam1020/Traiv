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
import { Tabs, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { useState } from "react";
import { AdminState, Empty, Stat } from "@/components/common/admin-state";
import { ExportCsvButton } from "@/components/common/export-csv-button";
import type { AcquisitionReport } from "@/lib/api";
import { suppressible, toCsv } from "@/lib/csv";
import { useAcquisition, useSession } from "@/lib/query";

/**
 * "Where are new trainers actually coming from?" — `admin-dashboard-spec.md` §2.
 *
 * Referral is its own bucket, never blended into the UTM channel breakdown — a studio
 * can in principle have both, and adding the two percentages together would double
 * count it (`attribution-design.md`).
 */
export default function AcquisitionPage() {
  const [days, setDays] = useState(30);
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const report = useAcquisition(days, signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Acquisition</h1>
          <p className="text-body-sm text-fg-muted">
            First-touch only — a returning anonymous visitor isn't tracked across sessions. See{" "}
            <code>attribution-design.md</code>.
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
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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

function Dashboard({ data }: { data: AcquisitionReport }) {
  const marketing = data.totalNewTrainers - data.referred;

  return (
    <div className="flex flex-col gap-7">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="New trainers" value={data.totalNewTrainers} note={`in ${data.days} days`} />
        <Stat
          label="Via referral"
          value={data.referred}
          note={
            data.totalNewTrainers > 0
              ? `${Math.round((data.referred / data.totalNewTrainers) * 100)}% of new trainers`
              : undefined
          }
        />
        <Stat label="Via marketing / direct" value={Math.max(marketing, 0)} />
      </section>

      <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-subheading font-semibold">Channel</h2>
            <p className="text-caption text-fg-subtle">
              By the signup visit's own <code>utm_source</code> — "(direct)" means none.
            </p>
          </div>
          {data.channels.length > 0 ? (
            <ExportCsvButton
              filename={`acquisition-channels-${data.days}d.csv`}
              getCsv={() =>
                toCsv(
                  ["source", "medium", "campaign", "signups"],
                  data.channels.map((c) => [
                    c.source,
                    c.medium,
                    c.campaign,
                    suppressible(c.signups),
                  ]),
                )
              }
            />
          ) : null}
        </div>

        {data.channels.length === 0 ? (
          <Empty>No signups in this window yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Signups</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.channels.map((c) => (
                  <TableRow key={`${c.source}-${c.medium}-${c.campaign}`}>
                    <TableCell className="font-medium">{c.source}</TableCell>
                    <TableCell className="text-fg-muted">{c.medium || "—"}</TableCell>
                    <TableCell className="text-fg-muted">{c.campaign || "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.signups}</TableCell>
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
