"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Textarea } from "@traiv/ui/components/textarea";
import { useState } from "react";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

const TAGS = [
  { value: "vegan", label: "Vegan", hint: "No animal products" },
  { value: "vegetarian", label: "Vegetarian", hint: "No meat or fish" },
  { value: "pescetarian", label: "Pescetarian", hint: "Fish but no meat" },
  { value: "peanut_allergy", label: "Peanut Allergy", hint: "Avoid peanuts and peanut products" },
  { value: "nut_allergy", label: "Nut Allergy", hint: "Avoid nuts and nut products" },
  { value: "gluten_intolerance", label: "Gluten Intolerance", hint: "Gluten-free diet" },
  { value: "lactose_intolerance", label: "Lactose Intolerance", hint: "Lactose-free diet" },
  { value: "dairy_allergy", label: "Dairy Allergy", hint: "No dairy at all, also lactose-free" },
  { value: "sugar_sensitivity", label: "Sugar Sensitivity", hint: "Low sugar or sugar-free" },
] as const;

const MAX_NOTES = 1000;

/** Rounded border, no ring — see `personal-info-step.tsx` for why. */
const FOCUS = "focus:outline-none focus-visible:outline-none focus:border-brand";

/**
 * Pregnancy and PCOS sit beside the dietary tags here, matching the reference screen —
 * but they write into the existing `healthFlags` column, not the new `dietaryTags` one.
 * `@traiv/nutrition`'s review logic keys specifically on `healthFlags` containing
 * "pregnancy" to force a coach to check a target before it reaches the client; routing
 * these two into a different column would silently turn that safety check off.
 */
export function FoodPreferencesStep({ flow }: { flow: IntakeFlow }) {
  const [tags, setTags] = useState<string[]>(flow.intake?.dietaryTags ?? []);
  const [pregnancy, setPregnancy] = useState(
    flow.intake?.healthFlags?.includes("pregnancy") ?? false,
  );
  const [pcos, setPcos] = useState(flow.intake?.healthFlags?.includes("pcos") ?? false);
  const [notes, setNotes] = useState(flow.intake?.additionalNutritionNotes ?? "");

  const toggleTag = (v: string) =>
    setTags((t) => (t.includes(v) ? t.filter((x) => x !== v) : [...t, v]));

  return (
    <StepShell
      step={13}
      title="Food Preferences"
      blurb="Select all that apply to your dietary needs and restrictions"
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue
      onContinue={() => {
        const existingFlags = (flow.intake?.healthFlags ?? []).filter(
          (f) => f !== "pregnancy" && f !== "pcos",
        );
        const healthFlags = [
          ...existingFlags,
          ...(pregnancy ? ["pregnancy"] : []),
          ...(pcos ? ["pcos"] : []),
        ];
        flow.next(13, {
          ...(tags.length ? { dietaryTags: tags } : {}),
          healthFlags,
          ...(notes.trim() ? { additionalNutritionNotes: notes.trim().slice(0, MAX_NOTES) } : {}),
        });
      }}
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">
          Dietary Preferences &amp; Allergies
        </legend>
        <div className="flex flex-col gap-2">
          {TAGS.map((t) => (
            <ChoiceCard
              key={t.value}
              multi
              label={t.label}
              hint={t.hint}
              selected={tags.includes(t.value)}
              onClick={() => toggleTag(t.value)}
            />
          ))}
          <ChoiceCard
            multi
            label="Pregnancy"
            hint="Pregnancy-safe foods only"
            selected={pregnancy}
            onClick={() => setPregnancy((v) => !v)}
          />
          <ChoiceCard
            multi
            label="PCOS"
            hint="PCOS-friendly nutrition"
            selected={pcos}
            onClick={() => setPcos((v) => !v)}
          />
        </div>
      </fieldset>

      <div className="mt-2 flex flex-col gap-2">
        <label htmlFor="nutrition-notes" className="text-body-sm font-medium">
          Additional Nutrition Comments
        </label>
        <p className="text-caption text-fg-subtle">
          Share any additional dietary requirements, food preferences, or nutrition goals that would
          help us provide better recommendations
        </p>
        <Textarea
          id="nutrition-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
          placeholder="e.g., I prefer meal prep options, avoid spicy foods, need recipes for a family of 4…"
          className={FOCUS}
        />
      </div>
    </StepShell>
  );
}
