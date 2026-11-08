"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CircleAlert, RefreshCw } from "../icons";
import { Button } from "./button";

/**
 * The shared body for every route-level `error.tsx` boundary.
 *
 * This is the last-resort catch for something that actually threw — a bug, not a failed
 * API call. Normal "couldn't load this" states already have their own per-screen handling
 * (TanStack Query's `isError`); this exists for everything that handling can't catch,
 * which until now meant a blank screen or the framework's raw error overlay.
 */
export function RouteError({
  error,
  reset,
  title = "Something went wrong on this screen",
  message = "The rest of the app is unaffected, and nothing you've already saved was lost.",
  backHref,
  backLabel,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center"
    >
      <CircleAlert aria-hidden="true" className="size-6 text-danger" />
      <h2 className="text-body font-medium">{title}</h2>
      <p className="max-w-sm text-body-sm leading-relaxed text-fg-muted">{message}</p>
      <div className="mt-1 flex items-center gap-2">
        <Button variant="outline" onClick={reset}>
          <RefreshCw aria-hidden="true" className="size-4" />
          Try again
        </Button>
        {backHref && backLabel ? (
          <Button asChild variant="ghost">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
