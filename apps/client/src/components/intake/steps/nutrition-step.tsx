"use client";

import { ChoiceCard } from "@traiv/ui/components/choice-card";
import { Label } from "@traiv/ui/components/label";
import { Textarea } from "@traiv/ui/components/textarea";
import { useState } from "react";
import type { DietType } from "@/lib/api";
import { Chips } from "../chips";
import { StepShell } from "../step-shell";
import type { IntakeFlow } from "../use-intake-flow";

/**
 * Every option says what it rules out, because the words do not travel.
 *
 * "Vegetarian" includes eggs in most of the world and excludes them here. "Non-vegetarian"
 * in India means someone who eats everything, not someone who eats only meat — and a
 * person reading these five labels while deciding has no way to know which reading we
 * meant. The hints are the answer, not decoration.
 *
 * Eggetarian and Jain are not padding either. Put eggs in front of someone who doesn't eat
 * them, or onion in a Jain plan, and they abandon it in week one without saying why.
 */
const DIETS: readonly { value: DietType; label: string; hint: string }[] = [
  { value: "vegetarian", label: "Vegetarian", hint: "No meat, fish or eggs" },
  { value: "eggetarian", label: "Vegetarian, but eggs are fine", hint: "No meat or fish" },
  { value: "non_vegetarian", label: "Non-vegetarian", hint: "You eat everything" },
  { value: "vegan", label: "Vegan", hint: "No meat, fish, eggs, dairy or honey" },
  { value: "jain", label: "Jain", hint: "No root vegetables, onion or garlic" },
];

const MEALS = [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }));

export function NutritionStep({ flow }: { flow: IntakeFlow }) {
  const [diet, setDiet] = useState<DietType | null>(flow.intake?.diet ?? null);
  const [allergies, setAllergies] = useState(flow.intake?.allergies ?? "");
  const [dislikes, setDislikes] = useState(flow.intake?.dislikes ?? "");
  const [meals, setMeals] = useState<number | null>(flow.intake?.mealsPerDay ?? null);

  return (
    <StepShell
      step={4}
      title="How you eat"
      blurb="Enough to build a diet around food you'll actually eat."
      busy={flow.busy}
      error={flow.error}
      onBack={flow.back}
      canContinue={diet !== null && meals !== null}
      onContinue={() =>
        flow.next(4, {
          ...(diet ? { diet } : {}),
          ...(allergies.trim() ? { allergies: allergies.trim().slice(0, 500) } : {}),
          ...(dislikes.trim() ? { dislikes: dislikes.trim().slice(0, 500) } : {}),
          ...(meals ? { mealsPerDay: meals } : {}),
        })
      }
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-medium">What you eat</legend>
        <div className="flex flex-col gap-2">
          {DIETS.map((d) => (
            <ChoiceCard
              key={d.value}
              label={d.label}
              hint={d.hint}
              selected={diet === d.value}
              onClick={() => setDiet(d.value)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-2 flex flex-col gap-2">
        <Label htmlFor="allergies">
          Allergies or anything that doesn't agree with you{" "}
          <span className="font-normal text-fg-subtle">(optional)</span>
        </Label>
        <Textarea
          id="allergies"
          rows={2}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Lactose, peanuts…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dislikes">
          Food you'd rather not see <span className="font-normal text-fg-subtle">(optional)</span>
        </Label>
        <Textarea
          id="dislikes"
          rows={2}
          value={dislikes}
          onChange={(e) => setDislikes(e.target.value)}
          placeholder="Mushrooms, paneer…"
        />
      </div>

      <div className="mt-2">
        {/* Descriptive, not prescriptive. What goes in each meal is the coach's job — this
            is only here so the plan lands on a day the client actually has. Someone doing
            16:8, or on a nine-hour shift, cannot eat five times however good the plan is. */}
        <Chips
          label="How many times you usually eat in a day"
          hint="Your coach decides what goes in each one. This is so the plan fits your day."
          options={MEALS}
          value={meals}
          onChange={setMeals}
        />
      </div>
    </StepShell>
  );
}
