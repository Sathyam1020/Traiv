"use client";

import { Calendar } from "@traiv/ui/components/calendar";
import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import { CalendarDays } from "@traiv/ui/icons";
import { useEffect, useState } from "react";
import type { Sex } from "@/lib/api";
import { useSettings } from "@/lib/query/use-settings";
import { FieldsSkeleton } from "../fields-skeleton";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const SEXES: readonly { value: Sex; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const CM_PER_INCH = 2.54;

/** Rounded border, no ring — the global `:focus-visible` outline (2px, sharp on some
 * native widgets) reads as a heavy box at this field density; this is the lighter,
 * intentional alternative asked for across the whole flow. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/**
 * First screen, so it also carries the name — the one thing every other step assumes
 * a coach already has. Birth date goes through the same `Calendar`/`Popover` pattern
 * `measurements.tsx` and `food-header.tsx` already use, not a native `<input
 * type="date">` — only the year is ever sent to the server: nobody needs a client's
 * exact birthday to work out a calorie target, and `userIntakes.birthYear` is
 * deliberately year-only. See the schema's own comment.
 */
export function PersonalInfoStep({ flow, studioId }: { flow: IntakeFlow; studioId: string }) {
  const settings = useSettings(studioId);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  // `settings` is its own fetch, separate from `flow.intake` — it has not necessarily
  // resolved by the time this step first renders, so the name has to be filled in once
  // it arrives rather than only at `useState`'s initial render.
  useEffect(() => {
    if (prefilled || !settings.data) return;
    const names = settings.data.user.name.trim().split(/\s+/u).filter(Boolean);
    setFirstName(names[0] ?? "");
    setLastName(names.slice(1).join(" "));
    setPrefilled(true);
  }, [settings.data, prefilled]);

  // Only the year is ever saved (`userIntakes.birthYear`), so a returning visit to this
  // step can only reconstruct Jan 1 of that year — good enough to prove something was
  // already answered, which is the one thing that actually matters here: without this,
  // the field always starts empty, and picking a date again (even by habit, e.g. landing
  // on today) silently overwrites a correct birth year with the wrong one.
  const [dob, setDob] = useState<Date | undefined>(
    flow.intake?.birthYear ? new Date(flow.intake.birthYear, 0, 1) : undefined,
  );
  const [dobOpen, setDobOpen] = useState(false);
  const [sex, setSex] = useState<Sex | null>(flow.intake?.sex ?? null);

  // Height is always kept in cm — the unit toggle only changes what the field shows
  // and accepts, never what gets saved.
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const startCm = flow.intake?.heightCm ?? null;
  const [heightCmInput, setHeightCmInput] = useState(startCm ? String(Math.round(startCm)) : "");
  const [heightInInput, setHeightInInput] = useState(
    startCm ? String(Math.round((startCm / CM_PER_INCH) * 10) / 10) : "",
  );

  const heightCm =
    heightUnit === "cm"
      ? Number(heightCmInput)
      : Math.round(Number(heightInInput) * CM_PER_INCH * 10) / 10;
  const validHeight = heightCm >= 90 && heightCm <= 250;

  return (
    <StepShell
      step={1}
      title="Personal Information"
      blurb="Tell us a bit about who you are."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={
        !settings.isPending &&
        firstName.trim() !== "" &&
        dob !== undefined &&
        sex !== null &&
        validHeight
      }
      onContinue={() =>
        flow.next(1, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ...(dob ? { birthYear: dob.getFullYear() } : {}),
          ...(sex ? { sex } : {}),
          ...(validHeight ? { heightCm } : {}),
        })
      }
    >
      {settings.isPending ? (
        <FieldsSkeleton rows={4} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Priya"
                inputClassName={FOCUS}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Kulkarni"
                inputClassName={FOCUS}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dob-trigger">Birth date</Label>
            <Popover open={dobOpen} onOpenChange={setDobOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id="dob-trigger"
                  className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-control border border-line-strong bg-surface px-3.5 text-body-sm transition-colors hover:bg-hover ${FOCUS}`}
                >
                  <span className={dob ? "text-fg" : "text-fg-subtle"}>
                    {dob
                      ? dob.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select your birth date"}
                  </span>
                  <CalendarDays className="size-4 text-fg-subtle" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-1">
                <Calendar
                  mode="single"
                  selected={dob}
                  defaultMonth={dob ?? new Date(new Date().getFullYear() - 25, 0)}
                  disabled={{ after: new Date() }}
                  onSelect={(selected) => {
                    if (selected) {
                      setDob(selected);
                      setDobOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-body-sm font-medium">Gender at birth</legend>
            <div className="grid grid-cols-2 gap-2">
              {SEXES.map((s) => (
                <ChoiceCard
                  key={s.value}
                  label={s.label}
                  selected={sex === s.value}
                  onClick={() => setSex(s.value)}
                />
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="height">Height</Label>
              <button
                type="button"
                onClick={() => setHeightUnit((u) => (u === "cm" ? "in" : "cm"))}
                className="cursor-pointer text-caption text-fg-muted underline-offset-2 transition-colors hover:text-fg hover:underline"
              >
                {heightUnit === "cm" ? "Use inches" : "Use centimetres"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="height"
                inputMode="decimal"
                value={heightUnit === "cm" ? heightCmInput : heightInInput}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d.]/g, "").slice(0, 5);
                  if (heightUnit === "cm") setHeightCmInput(v);
                  else setHeightInInput(v);
                }}
                placeholder={heightUnit === "cm" ? "175" : "69"}
                className="tabular-nums"
                inputClassName={FOCUS}
              />
              <span className="text-body-sm text-fg-muted">{heightUnit}</span>
            </div>
          </div>
        </>
      )}
    </StepShell>
  );
}
