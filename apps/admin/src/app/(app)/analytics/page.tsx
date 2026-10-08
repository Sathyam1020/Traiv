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
import type { Analytics } from "@/lib/api";
import { useAnalytics, useSession } from "@/lib/query";

/**
 * The marketing site's numbers, from our own tables.
 *
 * Everything here is computed from `analytics_event`, which holds no identifier for
 * anybody — the visitor column is a daily salted hash the server throws away overnight.
 * That is what "unique visitors" means on this page: unique *per day*, exactly, and not
 * comparable across days as the same people.
 */
export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const analytics = useAnalytics(days, signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-semibold tracking-[-0.03em]">Marketing</h1>
          <p className="text-body-sm text-fg-muted">
            traiv.in, measured by us. No third party, no cookie, no banner.
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
        pending={analytics.isPending || session.isPending}
        error={analytics.error}
        onRetry={() => void analytics.refetch()}
        skeleton={
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[5.5rem] rounded-surface" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-surface" />
          </div>
        }
      >
        {analytics.data ? <Dashboard data={analytics.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Dashboard({ data }: { data: Analytics }) {
  const { totals, funnel, waitlist } = data;
  const conversion = funnel.saw > 0 ? (funnel.submitted / funnel.saw) * 100 : 0;

  return (
    <div className="flex flex-col gap-7">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Visitors"
          value={totals.visitors ?? 0}
          note={`in the last ${data.days} days`}
        />
        <Stat label="Pageviews" value={totals.pageviews ?? 0} />
        <Stat
          label="Average visit"
          value={formatDuration(totals.avg_ms ?? 0)}
          note="time on page"
        />
        <Stat
          label="Launch list"
          value={waitlist.total ?? 0}
          note={`${waitlist.recent ?? 0} joined in this window`}
        />
      </section>

      <Panel
        title="Visitors a day"
        note="Unique per day. The same person tomorrow is a new one — see the note at the bottom."
      >
        <Series rows={data.series} />
      </Panel>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="From seeing it to joining the list"
          note="Every step is distinct people, not events."
        >
          <div className="flex flex-col gap-3">
            <Step label="Opened a page" value={funnel.saw ?? 0} of={funnel.saw ?? 0} />
            <Step label="Pressed a button" value={funnel.clicked ?? 0} of={funnel.saw ?? 0} />
            <Step label="Left their details" value={funnel.submitted ?? 0} of={funnel.saw ?? 0} />
            <p className="text-caption text-fg-subtle tabular-nums">
              {conversion.toFixed(1)}% of visitors joined the list. {waitlist.consented ?? 0} of{" "}
              {waitlist.total ?? 0} agreed to be written to.
            </p>
          </div>
        </Panel>

        <Panel title="What people press" note="Labelled by the button and where it sits.">
          {data.clicks.length === 0 ? (
            <Empty>Nothing clicked yet in this window.</Empty>
          ) : (
            <Rows
              head={["Button", "Where", "Clicks"]}
              rows={data.clicks.map((c) => [c.label, c.place || "—", c.clicks])}
            />
          )}
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="Pages">
          {data.paths.length === 0 ? (
            <Empty>No pageviews yet.</Empty>
          ) : (
            <Rows
              head={["Path", "Visitors", "Views"]}
              rows={data.paths.map((p) => [p.path, p.visitors, p.views])}
            />
          )}
        </Panel>

        <Panel title="Where they came from">
          {data.referrers.length === 0 ? (
            <Empty>No referrers yet.</Empty>
          ) : (
            <Rows
              head={["Source", "Visitors"]}
              rows={data.referrers.map((r) => [r.source, r.visitors])}
            />
          )}
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Panel title="Device">
          <Split rows={data.devices} />
        </Panel>
        <Panel title="Browser">
          <Split rows={data.browsers} />
        </Panel>
        <Panel title="Campaigns" note="Only visits that arrived with a utm_source.">
          {data.campaigns.length === 0 ? (
            <Empty>No tagged links yet.</Empty>
          ) : (
            <Rows
              head={["Source", "Campaign", "Visitors"]}
              rows={data.campaigns.map((c) => [
                c.utm_source,
                [c.utm_medium, c.utm_campaign].filter(Boolean).join(" · ") || "—",
                c.visitors,
              ])}
            />
          )}
        </Panel>
      </section>

      <p className="max-w-[80ch] text-caption leading-relaxed text-fg-subtle">
        A visitor is identified by a hash of a daily rotating salt, their IP and their browser — and
        the IP is never stored, the salt is deleted the next day. So daily uniques are exact and
        "returning visitors" is a question these numbers cannot answer. That is the trade: nothing
        is stored on anybody's device, so the site needs no consent banner.
      </p>
    </div>
  );
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">{title}</h2>
        {note ? <p className="text-caption text-fg-subtle">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

/**
 * The daily chart, drawn by hand.
 *
 * Twelve to ninety points and two series. A charting library is 50kB and a configuration
 * language to draw what is twenty lines of SVG, and this one can use the app's own
 * tokens rather than being themed twice.
 */
function Series({ rows }: { rows: Analytics["series"] }) {
  if (rows.length === 0) return <Empty>No visits recorded yet in this window.</Empty>;

  const w = 720;
  const h = 180;
  const peak = Math.max(...rows.map((r) => r.pageviews), 1);
  const step = rows.length > 1 ? w / (rows.length - 1) : 0;
  const x = (i: number) => (rows.length > 1 ? i * step : w / 2);
  const y = (v: number) => h - (v / peak) * (h - 12);

  const line = (key: "pageviews" | "visitors") =>
    rows.map((r, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(r[key])}`).join(" ");

  const first = rows[0];
  const last = rows[rows.length - 1];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-44 w-full min-w-[22rem]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Visitors and pageviews per day, peaking at ${peak}`}
        >
          <path d={`${line("pageviews")} L ${w} ${h} L 0 ${h} Z`} className="fill-sunken" />
          <path
            d={line("pageviews")}
            fill="none"
            className="stroke-fg-subtle"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d={line("visitors")}
            fill="none"
            className="stroke-fg"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-caption text-fg-subtle">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-fg" /> Visitors
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-fg-subtle" /> Pageviews
          </span>
          <span>Peak {peak} a day</span>
        </div>
        <span className="text-caption tabular-nums text-fg-subtle">
          {first?.day} — {last?.day}
        </span>
      </div>
    </div>
  );
}

function Step({ label, value, of }: { label: string; value: number; of: number }) {
  const pct = of > 0 ? Math.round((value / of) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body-sm">{label}</span>
        <span className="text-body-sm font-medium tabular-nums">
          {value}
          <span className="ml-1.5 text-caption text-fg-subtle">{pct}%</span>
        </span>
      </div>
      <span className="h-2 w-full overflow-hidden rounded-full bg-sunken">
        <span className="block h-full rounded-full bg-fg" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

function Split({ rows }: { rows: { label: string; visitors: number }[] }) {
  const total = rows.reduce((n, r) => n + r.visitors, 0);
  if (total === 0) return <Empty>Nothing recorded yet.</Empty>;

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => {
        const pct = Math.round((r.visitors / total) * 100);
        return (
          <div key={r.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-body-sm capitalize">{r.label}</span>
              <span className="shrink-0 text-caption tabular-nums text-fg-muted">
                {r.visitors} · {pct}%
              </span>
            </div>
            <span className="h-1.5 w-full overflow-hidden rounded-full bg-sunken">
              <span className="block h-full rounded-full bg-fg" style={{ width: `${pct}%` }} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Rows({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {head.map((h, i) => (
              <TableHead key={h} className={i > 0 ? "text-right" : ""}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={String(row[0])}>
              {row.map((cell, i) => (
                <TableCell
                  key={`${row[0]}-${head[i]}`}
                  className={i > 0 ? "text-right tabular-nums" : "max-w-[18rem] truncate"}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function formatDuration(ms: number): string {
  if (!ms) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}
