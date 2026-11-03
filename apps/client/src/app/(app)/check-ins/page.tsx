"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { CircleCheck, Clock, X } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { QueryError } from "@/components/common/query-state";
import type { CheckInState, CheckInSummary } from "@/lib/api";
import { longDate, relativeDay } from "@/lib/dates";
import { useActiveStudio, useCheckIns } from "@/lib/query";

/**
 * Every check-in, newest first.
 *
 * One table decides how each state looks and what it is called, so a row, its icon and
 * its label can never disagree about what a colour means — the same device the coach's
 * trend grid uses, for the same reason.
 */
const STATES: Record<
  CheckInState,
  { label: string; tone: string; Icon: typeof Clock; actionable: boolean }
> = {
  completed: { label: "Completed", tone: "text-success", Icon: CircleCheck, actionable: true },
  overdue: { label: "Due now", tone: "text-warning", Icon: Clock, actionable: true },
  upcoming: { label: "Upcoming", tone: "text-fg-subtle", Icon: Clock, actionable: false },
  missed: { label: "Missed", tone: "text-danger", Icon: X, actionable: true },
};

export default function CheckInsPage() {
  const { studioId } = useActiveStudio();
  const list = useCheckIns(studioId);

  if (list.isPending) return <Loading />;

  if (list.isError && !list.data)
    return (
      <Page className="max-w-xl">
        <QueryError
          title="Couldn't load your check-ins."
          busy={list.isFetching}
          onRetry={() => void list.refetch()}
        />
      </Page>
    );
  const data = list.data;
  const done = data?.checkIns.filter((c) => c.state !== "upcoming") ?? [];
  const next = data?.checkIns.filter((c) => c.state === "upcoming").at(-1);

  return (
    <Page className="max-w-xl gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-medium">Check-ins</h1>
        <p className="text-body-sm text-fg-muted">
          {data?.completionRate === null
            ? "Nothing's been due yet."
            : `${data?.completionRate}% completed — ${data?.completed} of ${
                (data?.completed ?? 0) + (data?.missed ?? 0)
              }`}
        </p>
      </header>

      {next ? (
        <Link
          href={`/check-in/${next.id}`}
          className="flex items-center justify-between gap-3 rounded-surface border border-line bg-surface px-4 py-3 transition-colors hover:bg-hover"
        >
          <span className="flex min-w-0 flex-col">
            <span className="text-caption text-fg-subtle">Next</span>
            <span className="truncate text-body-sm font-medium">{relativeDay(next.dueOn)}</span>
          </span>
          <span className="shrink-0 text-caption text-fg-muted">Fill in early</span>
        </Link>
      ) : null}

      {done.length === 0 ? (
        <p className="rounded-surface border border-line border-dashed bg-surface p-4 text-body-sm leading-relaxed text-fg-muted">
          Your first check-in hasn't come round yet. When it does it'll be on your home screen, and
          it'll stay here afterwards.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {done.map((c) => (
            <Row key={c.id} checkIn={c} />
          ))}
        </ul>
      )}
    </Page>
  );
}

function Row({ checkIn }: { checkIn: CheckInSummary }) {
  const s = STATES[checkIn.state];

  return (
    <li>
      <Link
        href={`/check-in/${checkIn.id}`}
        className="flex items-center gap-3 rounded-surface border border-line bg-surface px-4 py-3 transition-colors hover:bg-hover"
      >
        <s.Icon aria-hidden="true" className={cn("size-4 shrink-0", s.tone)} />
        <span className="min-w-0 flex-1 truncate text-body-sm font-medium">
          {longDate(checkIn.dueOn)}
        </span>
        <span className={cn("shrink-0 text-caption", s.tone)}>{s.label}</span>
      </Link>
    </li>
  );
}

function Loading() {
  return (
    <Page className="max-w-xl gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, n) => n).map((n) => (
          <Skeleton key={n} className="h-12 w-full rounded-surface" />
        ))}
      </div>
    </Page>
  );
}
