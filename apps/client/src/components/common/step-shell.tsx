"use client";

import { Button } from "@traiv/ui/components/button";
import { ArrowLeft } from "@traiv/ui/icons";
import type { ReactNode } from "react";

/**
 * The frame every question sits in, for any flow that asks a sequence of them.
 *
 * One shell rather than one per step, so Continue and the back arrow are in the same
 * place on every screen. On a phone that is the difference between answering six
 * questions and re-reading six layouts.
 *
 * Onboarding and check-ins both run through this, which is also how Coachway does it —
 * their client app has a single `StepsScreen` driving both flows, discriminated by a
 * `flowType`. Two wizards would be two places for the progress bar, the back behaviour
 * and the save-on-leave to drift apart.
 */
export type StepShellProps = {
  step: number;
  total: number;
  title: string;
  blurb?: string;
  children: ReactNode;
  onContinue: () => void;
  onBack: () => void;
  busy: boolean;
  error: string | null;
  /** False until this step has what the flow needs from it. */
  canContinue: boolean;
  continueLabel?: string;
  /** Rendered under Continue — a skip, or a "continue later". Omitted by onboarding. */
  secondary?: ReactNode;
};

export function StepShell({
  step,
  total,
  title,
  blurb,
  children,
  onContinue,
  onBack,
  busy,
  error,
  canContinue,
  continueLabel,
  secondary,
}: StepShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="-ml-1 cursor-pointer rounded-control p-1 text-fg-subtle transition-colors hover:text-fg"
            >
              <ArrowLeft className="size-4" />
            </button>
          ) : null}
          <span className="text-caption tabular-nums text-fg-subtle">
            {step} of {total}
          </span>
        </div>

        {/* A bar rather than a spinner: it says how much is left, which is the thing
            somebody deciding whether to carry on actually wants to know. */}
        <div className="h-1 w-full overflow-hidden rounded-control bg-sunken">
          <div
            className="h-full rounded-control bg-brand transition-[width] duration-300"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-heading font-medium">{title}</h1>
        {blurb ? <p className="text-body-sm text-fg-muted">{blurb}</p> : null}
      </header>

      <div className="flex flex-col gap-3">{children}</div>

      {error ? <p className="text-caption text-danger">{error}</p> : null}

      <div className="flex flex-col gap-2">
        <Button className="h-11 w-full" disabled={busy || !canContinue} onClick={onContinue}>
          {busy ? "Saving…" : (continueLabel ?? "Continue")}
        </Button>
        {secondary}
      </div>
    </div>
  );
}
