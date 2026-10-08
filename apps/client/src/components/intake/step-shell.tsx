"use client";

import { Button } from "@traiv/ui/components/button";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LAST_STEP } from "./use-intake-flow";

/**
 * The frame every question sits in.
 *
 * One shell rather than six, so Continue and the back arrow are in the same place on every
 * screen. On a phone that is the difference between answering six questions and re-reading
 * six layouts.
 *
 * There is no skip. Onboarding is the only thing standing between a coach and a plan they
 * can actually write, and a client who skipped every screen arrives as a name and a phone
 * number — which is exactly the state this feature exists to end. Fields that genuinely
 * don't change a plan (a goal weight, a list of dislikes) stay optional inside their step.
 */
export function StepShell({
  step,
  title,
  blurb,
  children,
  onContinue,
  onBack,
  busy,
  error,
  canContinue,
  continueLabel,
}: {
  step: number;
  title: string;
  blurb?: string;
  children: ReactNode;
  onContinue: () => void;
  onBack: () => void;
  busy: boolean;
  error: string | null;
  /** False until this step has what the plan needs from it. */
  canContinue: boolean;
  continueLabel?: string;
}) {
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
            {step} of {LAST_STEP}
          </span>
        </div>

        {/* A bar rather than a spinner: it says how much is left, which is the thing
            somebody deciding whether to carry on actually wants to know. */}
        <div className="h-1 w-full overflow-hidden rounded-control bg-sunken">
          <div
            className="h-full rounded-control bg-brand transition-[width] duration-300"
            style={{ width: `${(step / LAST_STEP) * 100}%` }}
          />
        </div>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">{title}</h1>
        {blurb ? <p className="text-body-sm text-fg-muted">{blurb}</p> : null}
      </header>

      <div className="flex flex-col gap-3">{children}</div>

      {error ? <p className="text-caption text-danger">{error}</p> : null}

      <Button className="h-11 w-full" disabled={busy || !canContinue} onClick={onContinue}>
        {busy ? "Saving…" : (continueLabel ?? "Continue")}
      </Button>
    </div>
  );
}
