"use client";

import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import type { ReactNode } from "react";
import { isApiError } from "@/lib/api";

/**
 * The three states every admin screen has before it has data.
 *
 * Written once because there are four screens now and each had been about to grow its
 * own copy — and the one that matters is the middle one: 403 is the correct answer for
 * every account that is not the one named by `ADMIN_PHONE`, so it is an expected state
 * with its own explanation, not an error.
 */
export function AdminState({
  pending,
  error,
  onRetry,
  skeleton,
  children,
}: {
  pending: boolean;
  error: unknown;
  onRetry: () => void;
  skeleton?: ReactNode;
  children: ReactNode;
}) {
  if (error && isApiError(error) && error.status === 403) {
    return (
      <section className="flex flex-col gap-2 rounded-surface border border-line bg-surface p-5">
        <h2 className="text-heading font-semibold tracking-[-0.02em]">Not an admin account</h2>
        <p className="max-w-[60ch] text-body-sm text-fg-muted">
          Admin access is a single phone number set in the server's environment, and nothing in the
          app can grant it.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-surface border border-line bg-surface p-5">
        <p className="text-body-sm text-fg-muted">
          {isApiError(error) ? error.message : "Could not load this. Try again."}
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </section>
    );
  }

  if (pending) {
    return <>{skeleton ?? <Skeleton className="h-64 w-full rounded-surface" />}</>;
  }

  return <>{children}</>;
}

export function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-surface border border-line bg-surface p-4">
      <span className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
        {label}
      </span>
      <span className="text-hero-sm font-semibold tabular-nums tracking-[-0.03em]">{value}</span>
      {note ? <span className="text-caption text-fg-subtle">{note}</span> : null}
    </div>
  );
}

/**
 * A table with no rows yet.
 *
 * Says which table and why it is empty, because "No data" on four different screens is
 * four chances to wonder whether something is broken.
 */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-surface border border-dashed border-line-strong p-8">
      <p className="text-body-sm text-fg-muted">{children}</p>
    </div>
  );
}
