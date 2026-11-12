"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { ArrowLeft } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminState, Empty } from "@/components/common/admin-state";
import type { StudioDrilldown } from "@/lib/api";
import { useStudio } from "@/lib/query";

const INPUT_LABEL: Record<string, string> = {
  loggedInWithin7Days: "Logged in within 7 days",
  activeClientEngaged: "≥1 active client with recent engagement",
  coreFeatureUsed14d: "Used a core feature in 14 days",
  onboardingCompletionRate: "Client onboarding completion rate",
  noDropInActiveClients30d: "No drop in active clients vs. 30 days ago",
};

/**
 * The health-score explanation, roster snapshot, and recent activity for one studio —
 * `admin-dashboard-spec.md` §8's drilldown-as-route (not a modal, so it's bookmarkable).
 */
export default function StudioDrilldownPage() {
  const params = useParams<{ id: string }>();
  const studio = useStudio(params.id ?? null);

  return (
    <Page className="gap-7">
      <Link
        href="/analytics/studios"
        className="flex items-center gap-1.5 text-body-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Studios
      </Link>

      <AdminState
        pending={studio.isPending}
        error={studio.error}
        onRetry={() => void studio.refetch()}
        skeleton={<Skeleton className="h-96 rounded-surface" />}
      >
        {studio.data ? <Dashboard data={studio.data} /> : null}
      </AdminState>
    </Page>
  );
}

function Dashboard({ data }: { data: StudioDrilldown }) {
  const explanation = data.healthScoreExplanation as Record<
    string,
    { pass?: boolean; rate?: number | null; weight: number; note?: string | null }
  > | null;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">{data.studio.name}</h1>
        <p className="text-body-sm text-fg-muted capitalize">{data.studio.tier} plan</p>
      </header>

      <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
        <div className="flex items-baseline justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-subheading font-semibold">Health score</h2>
            <p className="text-caption text-fg-subtle">{data.scoreLabel}</p>
          </div>
          <span className="text-hero-sm font-medium tabular-nums">
            {data.healthScore === null ? "—" : data.healthScore}
          </span>
        </div>

        {explanation ? (
          <div className="flex flex-col gap-3">
            {Object.entries(explanation).map(([key, input]) => (
              <div key={key} className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm">
                  {INPUT_LABEL[key] ?? key}
                  <span className="ml-1.5 text-caption text-fg-subtle">({input.weight} pts)</span>
                </span>
                <span className="text-body-sm font-medium tabular-nums">
                  {input.rate !== undefined && input.rate !== null
                    ? `${Math.round(input.rate * 100)}%`
                    : input.pass
                      ? "Pass"
                      : "Fail"}
                  {input.note ? (
                    <span className="ml-1.5 text-caption text-fg-subtle">({input.note})</span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-5">
          <h2 className="text-subheading font-semibold">Roster ({data.roster.length})</h2>
          {data.roster.length === 0 ? (
            <Empty>No clients yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.roster.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-3 text-body-sm">
                  <span>{c.name}</span>
                  <span className="text-caption capitalize text-fg-subtle">{c.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-5">
          <h2 className="text-subheading font-semibold">Recent activity</h2>
          {data.recentActivity.length === 0 ? (
            <Empty>Nothing recorded yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.recentActivity.map((a, i) => (
                <li
                  key={`${a.name}-${a.receivedAt}-${i}`}
                  className="flex items-baseline justify-between gap-3 text-body-sm"
                >
                  <span>{a.name}</span>
                  <span className="text-caption text-fg-subtle">
                    {new Date(a.receivedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
