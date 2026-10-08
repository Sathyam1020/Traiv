"use client";

import { Skeleton } from "@traiv/ui/components/skeleton";
import type { Intake } from "@/lib/api";
import { AvailabilityStep } from "./steps/availability-step";
import { BodyStep } from "./steps/body-step";
import { GoalStep } from "./steps/goal-step";
import { HealthStep } from "./steps/health-step";
import { NutritionStep } from "./steps/nutrition-step";
import { TrainingStep } from "./steps/training-step";
import { type IntakeFlow as Flow, useIntakeFlow } from "./use-intake-flow";

/**
 * The six questions, in order, resumed where the client left off.
 *
 * Steps are remounted rather than kept alive, so each one reads its starting values from
 * what the server has. That is what makes going back show the answer you gave rather than
 * an empty field.
 */
export function IntakeFlow({
  studioId,
  coachName,
  onDone,
}: {
  studioId: string;
  coachName: string;
  onDone: () => void;
}) {
  const flow = useIntakeFlow(studioId);

  if (flow.loading) return <Loading />;
  if (flow.step === "done") return <Finished flow={flow} coachName={coachName} onDone={onDone} />;

  switch (flow.step) {
    case 1:
      return <GoalStep flow={flow} />;
    case 2:
      return <BodyStep flow={flow} />;
    case 3:
      return <TrainingStep flow={flow} />;
    case 4:
      return <NutritionStep flow={flow} />;
    case 5:
      return <HealthStep flow={flow} />;
    default:
      return <AvailabilityStep flow={flow} />;
  }
}

const GOAL_WORDS: Record<string, string> = {
  lose_fat: "losing fat",
  build_muscle: "building muscle",
  get_stronger: "getting stronger",
  maintain: "holding your weight",
  improve_fitness: "getting fitter",
  general_health: "general health",
};

const DIET_WORDS: Record<string, string> = {
  vegetarian: "vegetarian",
  eggetarian: "vegetarian with eggs",
  non_vegetarian: "non-vegetarian",
  vegan: "vegan",
  jain: "Jain",
};

/**
 * The end of onboarding, and deliberately not an empty home screen.
 *
 * Their own answers are read back for one reason: the complaint every coached client has
 * is that the plan could have been sent to anyone. Showing that we heard the specific
 * things they said is the cheapest possible answer to it.
 *
 * No calorie number here. A number with no food around it invites somebody to act on it
 * before their coach has seen it; it arrives with the diet plan.
 */
function Finished({
  flow,
  coachName,
  onDone,
}: {
  flow: Flow;
  coachName: string;
  onDone: () => void;
}) {
  const i = flow.intake;
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">You're all set</h1>
        <p className="text-body-sm leading-relaxed text-fg-muted">
          {coachName} is putting your plan together from what you've told us. Your workouts and diet
          turn up here when they're ready.
        </p>
      </header>

      {i ? <Summary intake={i} weightKg={flow.weightKg} /> : null}

      <button
        type="button"
        onClick={onDone}
        className="h-11 w-full cursor-pointer rounded-control bg-primary text-body-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go to Today
      </button>
    </div>
  );
}

function Summary({ intake, weightKg }: { intake: Intake; weightKg: number | null }) {
  const lines = [
    intake.goal ? `You're here for ${GOAL_WORDS[intake.goal]}.` : null,
    intake.daysPerWeek
      ? `${intake.daysPerWeek} days a week${intake.sessionMinutes ? `, ${intake.sessionMinutes} minutes a session` : ""}.`
      : null,
    intake.diet ? `Food is ${DIET_WORDS[intake.diet]}.` : null,
    weightKg ? `Starting at ${weightKg} kg.` : null,
  ].filter(Boolean) as string[];

  if (!lines.length) return null;

  return (
    <section className="flex flex-col gap-2 rounded-surface border border-line bg-surface p-5">
      <span className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
        What we've got
      </span>
      <ul className="flex flex-col gap-1.5">
        {lines.map((l) => (
          <li key={l} className="text-body-sm text-fg-muted">
            {l}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-1 w-full rounded-control" />
      <Skeleton className="h-7 w-3/4" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, n) => n).map((n) => (
          <Skeleton key={n} className="h-14 w-full rounded-surface" />
        ))}
      </div>
    </div>
  );
}
