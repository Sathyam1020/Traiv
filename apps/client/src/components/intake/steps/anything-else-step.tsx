"use client";

import { Textarea } from "@traiv/ui/components/textarea";
import { useState } from "react";
import { prepareCompletionSound } from "@/components/check-in/completion-sound";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const MAX = 2000;

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/** Last step — "Done" unlocks the same completion chime check-ins use. The sound has
 * to be unlocked from inside this click, not from the success screen's own effect: iOS
 * only permits `AudioContext` after a user gesture, and by the time the success screen
 * mounts the gesture has already ended. */
export function AnythingElseStep({ flow }: { flow: IntakeFlow }) {
  const [notes, setNotes] = useState(flow.intake?.otherNotes ?? "");

  return (
    <StepShell
      step={15}
      title="Do you have anything else you would like to share?"
      blurb="The more I know, the better I can help you"
      busy={flow.busy}
      error={flow.error}
      continueLabel="Done"
      onBack={flow.back}
      canContinue
      onContinue={() => {
        prepareCompletionSound();
        flow.next(15, notes.trim() ? { otherNotes: notes.trim().slice(0, MAX) } : {});
      }}
    >
      <Textarea
        rows={6}
        value={notes}
        onChange={(e) => setNotes(e.target.value.slice(0, MAX))}
        placeholder="Anything at all — past injuries, what hasn't worked before, a date you're training for…"
        className={FOCUS}
      />
      <p className="text-right text-caption text-fg-subtle">
        {MAX - notes.length} characters remaining
      </p>
    </StepShell>
  );
}
