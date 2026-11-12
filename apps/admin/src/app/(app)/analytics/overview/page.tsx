"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { AdminState, Empty, Stat } from "@/components/common/admin-state";
import type { ProductOverview } from "@/lib/api";
import { useProductOverview, useSession } from "@/lib/query";

/**
 * "Is the business healthy, right now, at a glance?" — `admin-dashboard-spec.md` §1.
 *
 * Everything here reads `daily_metric_rollup`, computed nightly(-ish — hourly checks,
 * daily-grained data) by `features/analytics/rollup.ts`. Trainer and client numbers are
 * shown side by side and never blended, per the spec: a studio owner opening the app is
 * not the same signal as their client doing a check-in.
 */
export default function OverviewPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const overview = useProductOverview(signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">Overview</h1>
        <p className="text-body-sm text-fg-muted">
          Weekly-active-clients ÷ total clients is the number this product is judged on.
        </p>
      </header>

      <AdminState
        pending={overview.isPending || session.isPending}
        error={overview.error}
        onRetry={() => void overview.refetch()}
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
        {overview.data ? <Dashboard data={overview.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Dashboard({ data }: { data: ProductOverview }) {
  const { totals, latest, signups, weeklyActiveClientsRatio, freshness } = data;

  if (!freshness.lastRolledUpDay) {
    return (
      <Empty>
        No data yet — rollups run roughly hourly. Check back after the first one, or see
        `implementation-roadmap.md` Phase 1.
      </Empty>
    );
  }

  const signupDelta = signups.lastWeek > 0 ? (signups.thisWeek / signups.lastWeek - 1) * 100 : null;

  return (
    <div className="flex flex-col gap-7">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Trainers" value={totals.trainers} note="live staff memberships" />
        <Stat label="Clients" value={totals.clients} note="active or paused" />
        <Stat
          label="Weekly active clients"
          value={
            weeklyActiveClientsRatio === null
              ? "—"
              : `${(weeklyActiveClientsRatio * 100).toFixed(0)}%`
          }
          note={`${latest.wauClient} of ${totals.clients} clients`}
        />
        <Stat
          label="Signups this week"
          value={signups.thisWeek}
          note={
            signupDelta === null
              ? `${signups.lastWeek} last week`
              : `${signupDelta >= 0 ? "+" : ""}${signupDelta.toFixed(0)}% vs last week`
          }
        />
      </section>

      <Panel
        title="DAU / WAU / MAU"
        note="Trainer and client, side by side — never blended into one number."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-body-sm">
            <thead>
              <tr className="text-left text-caption uppercase tracking-[0.07em] text-fg-subtle">
                <th className="py-2 font-semibold">Window</th>
                <th className="py-2 text-right font-semibold">Trainer</th>
                <th className="py-2 text-right font-semibold">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <ActivityRow label="Daily" trainer={latest.dauTrainer} client={latest.dauClient} />
              <ActivityRow label="Weekly" trainer={latest.wauTrainer} client={latest.wauClient} />
              <ActivityRow label="Monthly" trainer={latest.mauTrainer} client={latest.mauClient} />
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Weekly active, last 30 days"
        note="Trainer (subtle) vs client (bold) — the trend behind the ratio above."
      >
        <Trend
          series={data.series.wau_trainer}
          compare={data.series.wau_client}
          label="trainer"
          compareLabel="client"
        />
      </Panel>

      <p className="text-caption text-fg-subtle">
        Updated as of {freshness.lastRolledUpDay}
        {freshness.updatedAt
          ? ` (rollup ran ${new Date(freshness.updatedAt).toLocaleString()})`
          : ""}
        .
      </p>
    </div>
  );
}

function ActivityRow({
  label,
  trainer,
  client,
}: {
  label: string;
  trainer: number;
  client: number;
}) {
  return (
    <tr>
      <td className="py-2.5">{label}</td>
      <td className="py-2.5 text-right tabular-nums">{trainer}</td>
      <td className="py-2.5 text-right tabular-nums">{client}</td>
    </tr>
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

/** Two lines, drawn by hand — same reasoning as the marketing page's own chart: this is
 *  twenty lines of SVG against the app's own tokens, not a 50kB library and its config. */
function Trend({
  series,
  compare,
  label,
  compareLabel,
}: {
  series: { day: string; value: number }[];
  compare: { day: string; value: number }[];
  label: string;
  compareLabel: string;
}) {
  if (series.length === 0 && compare.length === 0) {
    return <Empty>No activity recorded yet in this window.</Empty>;
  }

  const w = 720;
  const h = 180;
  const peak = Math.max(...series.map((r) => r.value), ...compare.map((r) => r.value), 1);
  const points = (rows: { value: number }[]) => {
    const step = rows.length > 1 ? w / (rows.length - 1) : 0;
    return rows
      .map((r, i) => {
        const x = rows.length > 1 ? i * step : w / 2;
        const y = h - (r.value / peak) * (h - 12);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const first = series[0] ?? compare[0];
  const last = series[series.length - 1] ?? compare[compare.length - 1];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-44 w-full min-w-[22rem]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Weekly active ${label} and ${compareLabel} per day, peaking at ${peak}`}
        >
          <path
            d={points(series)}
            fill="none"
            className="stroke-fg-subtle"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d={points(compare)}
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
            <span className="h-0.5 w-4 rounded bg-fg" /> {compareLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-fg-subtle" /> {label}
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
