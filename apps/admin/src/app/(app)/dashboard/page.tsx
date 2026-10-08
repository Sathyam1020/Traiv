"use client";

import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { isApiError } from "@/lib/api";
import { useSession, useStats } from "@/lib/query";

/**
 * Platform totals.
 *
 * Counts only. The API returns no names and no numbers, and this screen is the reason
 * it stays that way — an admin surface that reads personal data is a much larger thing
 * to secure than one that reads integers.
 */
export default function DashboardPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const stats = useStats(signedIn);

  if (session.isPending || !signedIn) return <Loading />;

  // 403 is the answer for every account that is not the one named by ADMIN_PHONE, and it
  // is the expected case rather than a fault — so it gets its own screen, not an error.
  const forbidden = stats.isError && isApiError(stats.error) && stats.error.status === 403;

  return (
    <Page className="gap-7">
      {forbidden ? (
        <section className="flex flex-col gap-2 rounded-surface border border-line bg-surface p-5">
          <h1 className="text-heading font-semibold tracking-[-0.02em]">Not an admin account</h1>
          <p className="text-body-sm text-fg-muted">
            You're signed in as {session.data?.user.name || "someone else"}. Admin access is a
            single phone number set in the server's environment, and nothing in the app can grant
            it.
          </p>
        </section>
      ) : stats.isError ? (
        <section className="flex flex-col items-start gap-3 rounded-surface border border-line bg-surface p-5">
          <p className="text-body-sm text-fg-muted">
            Couldn't load the numbers. Check your connection and try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => void stats.refetch()}>
            Try again
          </Button>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Trainers" value={stats.data?.trainers} pending={stats.isPending} />
            <Stat label="Clients" value={stats.data?.clients} pending={stats.isPending} />
            <Stat label="Studios" value={stats.data?.studios} pending={stats.isPending} />
            <Stat label="Endorsers" value={stats.data?.endorsers} pending={stats.isPending} />
            <Stat label="Referrals" value={stats.data?.referrals} pending={stats.isPending} />
          </section>

          <p className="max-w-[70ch] text-caption leading-relaxed text-fg-subtle">
            A trainer is counted once however many studios they work in. A client is counted per
            coaching relationship, not per person, because that is what a roster and a seat limit
            count — somebody coached by two studios is two.
          </p>
        </>
      )}
    </Page>
  );
}

function Stat({
  label,
  value,
  pending,
}: {
  label: string;
  value: number | undefined;
  pending: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-surface border border-line bg-surface p-4">
      <span className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
        {label}
      </span>
      {pending ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <span className="text-hero-sm font-semibold tabular-nums tracking-[-0.03em]">
          {value ?? 0}
        </span>
      )}
    </div>
  );
}

function Loading() {
  return (
    <Page className="gap-7">
      <Skeleton className="size-7 rounded-control" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 5 }, (_, i) => i).map((i) => (
          <Skeleton key={i} className="h-[5.5rem] w-full rounded-surface" />
        ))}
      </div>
    </Page>
  );
}
