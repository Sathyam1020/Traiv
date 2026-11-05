"use client";
import { ChevronRight } from "@traiv/ui/icons";
import Link from "next/link";
import type { ProfileCheckIn } from "@/lib/query/use-profile-history";
export function checkInDate(row: { completedAt: string | null; dueOn: string }, long = false) {
  return new Date(row.completedAt ?? `${row.dueOn}T12:00:00`).toLocaleDateString("en-US", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
export function Delta({ value, previous }: { value: number; previous?: number | null }) {
  if (previous == null) return null;
  const change = Math.round((value - previous) * 10) / 10;
  return (
    <span className="ml-2 text-xs font-normal text-fg-subtle">
      {change > 0 ? "↑" : change < 0 ? "↓" : "→"}
      {Math.abs(change)}
    </span>
  );
}
export function HistoryCard({
  row,
  previous,
  compact = false,
}: {
  row: ProfileCheckIn;
  previous?: ProfileCheckIn;
  compact?: boolean;
}) {
  const photos = row.answers.filter((a) => a.imageUrl);
  const metrics = row.answers.filter((a) => a.numberValue != null).slice(0, 2);
  return (
    <Link
      href={compact ? "/you/check-ins" : `/you/check-ins/${row.id}`}
      className="client-tappable block rounded-[20px] bg-surface p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Weekly Check-In</h2>
          {!compact && <p className="mt-0.5 text-xs text-fg-subtle">{checkInDate(row)}</p>}
        </div>
        {compact ? (
          <span className="shrink-0 text-xs text-fg-subtle">{checkInDate(row)}</span>
        ) : (
          <ChevronRight className="mt-0.5 size-5 text-fg-subtle" />
        )}
      </div>
      {!compact && metrics.length > 0 && (
        <div className="mt-3 flex gap-7">
          {metrics.map((a) => (
            <div key={a.metricId}>
              <p className="text-xs text-fg-subtle">{a.name}</p>
              <p className="mt-0.5 text-sm font-semibold">
                {a.numberValue} {a.unit}
                <Delta
                  value={a.numberValue ?? 0}
                  previous={previous?.answers.find((p) => p.metricId === a.metricId)?.numberValue}
                />
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {photos.slice(0, 3).map((a) => (
          <img
            key={a.metricId}
            src={a.imageUrl ?? ""}
            alt={a.name}
            className="size-14 rounded-xl object-cover sm:size-16"
          />
        ))}
        {!photos.length && (
          <p className="py-2 text-xs text-fg-muted">
            View check-in {compact ? "history" : "details"}
          </p>
        )}
        {compact && <ChevronRight className="ml-auto size-5 text-fg-subtle" />}
      </div>
    </Link>
  );
}
