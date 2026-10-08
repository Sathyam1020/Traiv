"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Label } from "@traiv/ui/components/label";
import { Textarea } from "@traiv/ui/components/textarea";
import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const FLAGS = [
  { value: "knee", label: "Knees" },
  { value: "lower_back", label: "Lower back" },
  { value: "shoulder", label: "Shoulders" },
  { value: "diabetes", label: "Diabetes" },
  { value: "blood_pressure", label: "Blood pressure" },
  { value: "thyroid", label: "Thyroid" },
  { value: "pcos", label: "PCOS" },
  { value: "pregnancy", label: "Pregnant or recently gave birth" },
] as const;

/**
 * A note to a coach, not a medical form.
 *
 * The wording matters as much as the fields. Seven clinical yes/no questions at signup is
 * the screen people close the tab on, and it would also be the screen that makes Traiv
 * look like it is assessing them. Nothing here is interpreted by software: what they tick
 * goes to their coach, in their own words, and if it needs judgement their coach is the one
 * who applies it.
 */
export function HealthStep({ flow }: { flow: IntakeFlow }) {
  const [flags, setFlags] = useState<string[]>(flow.intake?.healthFlags ?? []);
  const [note, setNote] = useState(flow.intake?.healthNote ?? "");
  const [none, setNone] = useState(
    (flow.intake?.healthFlags?.length ?? 0) === 0 && Boolean(flow.intake?.lastStep),
  );

  const toggle = (v: string) => {
    setNone(false);
    setFlags((f) => (f.includes(v) ? f.filter((x) => x !== v) : [...f, v]));
  };

  return (
    <StepShell
      step={5}
      title="Anything your coach should know?"
      blurb="So your plan works around it. This goes to your coach, not to a computer that decides something about you."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={none || flags.length > 0}
      onContinue={() =>
        flow.next(5, {
          healthFlags: none ? [] : flags,
          ...(note.trim() ? { healthNote: note.trim().slice(0, 1000) } : {}),
        })
      }
    >
      {FLAGS.map((f) => (
        <ChoiceCard
          key={f.value}
          multi
          label={f.label}
          selected={!none && flags.includes(f.value)}
          onClick={() => toggle(f.value)}
        />
      ))}

      <ChoiceCard
        multi
        label="None of these"
        selected={none}
        onClick={() => {
          setNone(true);
          setFlags([]);
        }}
      />

      <div className="mt-2 flex flex-col gap-2">
        <Label htmlFor="health-note">
          Anything else <span className="font-normal text-fg-subtle">(optional)</span>
        </Label>
        <Textarea
          id="health-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Old ankle injury, shift work, anything you'd tell them in person"
        />
      </div>
    </StepShell>
  );
}
