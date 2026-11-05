"use client";
import { ChevronRight, Clock, Dumbbell, Star } from "@traiv/ui/icons";
import Link from "next/link";
import { type Activity, useActivityList } from "@/lib/query/use-activity";
export function ActivityCard({
  activity,
  from = "history",
}: {
  activity: Activity;
  from?: "history" | "home";
}) {
  const date = new Date(activity.completedAt);
  const today = new Date().toDateString() === date.toDateString();
  const label = `${today ? "Today" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  return (
    <Link
      href={`/activity/${encodeURIComponent(activity.id)}?from=${from}`}
      className="client-tappable flex items-center gap-3 rounded-[24px] border border-line bg-surface p-3"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-line bg-panel">
        <Dumbbell className="size-6 text-fg-subtle" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{activity.name}</span>
        <span className="mt-0.5 block text-xs text-fg-subtle">{label}</span>
        <span className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-fg-muted">
          {activity.totalWeightLiftedKg != null && activity.totalWeightLiftedKg > 0 && (
            <span className="flex items-center gap-1">
              <Dumbbell className="size-3" />
              {activity.totalWeightLiftedKg >= 1000
                ? `${(activity.totalWeightLiftedKg / 1000).toFixed(1)}k`
                : Math.round(activity.totalWeightLiftedKg)}{" "}
              kg
            </span>
          )}
          {activity.quality != null && (
            <span className="flex items-center gap-1">
              <Star className="size-3" />
              {activity.quality}/5
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {Math.floor((activity.totalSeconds ?? 0) / 60)}m
          </span>
          {activity.kind === "health" && <span>Health sync</span>}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-fg-subtle" />
    </Link>
  );
}
export function RecentActivity({ studioId }: { studioId: string }) {
  const query = useActivityList(studioId, 1, 3);
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">Recent activity</h2>
        <Link
          href="/activity"
          className="flex items-center gap-1 text-sm font-medium text-signal-text"
        >
          Show all
          <ChevronRight className="size-4" />
        </Link>
      </div>
      {query.isPending ? (
        <p className="text-sm text-fg-muted">Loading activity…</p>
      ) : query.isError ? (
        <p role="alert" className="text-sm text-fg-muted">
          Couldn't load activity.{" "}
          <button type="button" className="underline" onClick={() => void query.refetch()}>
            Retry
          </button>
        </p>
      ) : query.data.activities.length ? (
        <div className="space-y-2">
          {query.data.activities.slice(0, 3).map((a) => (
            <ActivityCard key={a.id} activity={a} from="home" />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-surface p-4 text-sm text-fg-muted">
          Workouts you finish will appear here.
        </p>
      )}
    </section>
  );
}
