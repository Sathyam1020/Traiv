"use client";

import { Textarea } from "@traiv/ui/components/textarea";
import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const MAX = 2000;

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

export function TypicalDayStep({ flow }: { flow: IntakeFlow }) {
  const [text, setText] = useState(flow.intake?.typicalDay ?? "");

  return (
    <StepShell
      step={8}
      title="What does a typical day look like for you?"
      blurb="Work, kids, schedule – helps me understand your life"
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue
      onContinue={() => flow.next(8, text.trim() ? { typicalDay: text.trim().slice(0, MAX) } : {})}
    >
      <Textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        placeholder="Office job 9 to 6, commute both ways, pick up my daughter from school at 7…"
        className={FOCUS}
      />
      <p className="text-right text-caption text-fg-subtle">
        {MAX - text.length} characters remaining
      </p>
    </StepShell>
  );
}
