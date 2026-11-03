"use client";

import { Button } from "@traiv/ui/components/button";
import { CircleAlert, RefreshCw } from "@traiv/ui/icons";

/** Shared client recovery state; never renders raw transport/server messages. */
export function QueryError({
  title,
  onRetry,
  busy = false,
}: {
  title: string;
  onRetry: () => void;
  busy?: boolean;
}) {
  return (
    <section role="alert" className="client-state flex flex-col items-start gap-3">
      <CircleAlert aria-hidden="true" className="size-5 text-danger" />
      <h2 className="text-body font-medium">{title}</h2>
      <p className="text-body-sm leading-relaxed text-fg-muted">
        Check your connection and try again. Your saved progress is safe.
      </p>
      <Button variant="outline" onClick={onRetry} disabled={busy} aria-busy={busy}>
        <RefreshCw aria-hidden="true" className="size-4" />
        {busy ? "Retrying…" : "Try again"}
      </Button>
    </section>
  );
}
