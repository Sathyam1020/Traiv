"use client";

import { Skeleton } from "@traiv/ui/components/skeleton";
import { Check } from "@traiv/ui/icons";
import { useEffect, useRef } from "react";
import { playCompletionSound } from "@/components/check-in/completion-sound";
import { QueryError } from "@/components/common/query-state";
import { ActivityLevelStep } from "./steps/activity-level-step";
import { AnythingElseStep } from "./steps/anything-else-step";
import { BodyMeasurementStep } from "./steps/body-measurement-step";
import { CircumferenceStep } from "./steps/circumference-step";
import { EatingHabitsStep } from "./steps/eating-habits-step";
import { FoodPreferencesStep } from "./steps/food-preferences-step";
import { GoalWeightStep } from "./steps/goal-weight-step";
import { GoalsStep } from "./steps/goals-step";
import { IngredientExclusionStep } from "./steps/ingredient-exclusion-step";
import { PersonalInfoStep } from "./steps/personal-info-step";
import { ProfilePictureStep } from "./steps/profile-picture-step";
import { ProgressionPhotosStep } from "./steps/progression-photos-step";
import { SleepHoursStep } from "./steps/sleep-hours-step";
import { TypicalDayStep } from "./steps/typical-day-step";
import { WorkedWithCoachStep } from "./steps/worked-with-coach-step";
import { useIntakeFlow } from "./use-intake-flow";

/**
 * The fifteen questions, in order, resumed where the client left off.
 *
 * Steps are remounted rather than kept alive, so each one reads its starting values from
 * what the server has. That is what makes going back show the answer you gave rather than
 * an empty field.
 */
export function IntakeFlow({
  studioId,
  onDone,
}: {
  studioId: string;
  coachName: string;
  onDone: () => void;
}) {
  const flow = useIntakeFlow(studioId);

  if (flow.loadError)
    return (
      <div className="mx-auto w-full max-w-xl p-4">
        <QueryError
          title="Couldn't load your onboarding answers."
          busy={flow.retrying}
          onRetry={() => void flow.retry()}
        />
      </div>
    );
  if (flow.loading) return <Loading />;
  if (flow.step === "done") return <Finished onDone={onDone} />;

  switch (flow.step) {
    case 1:
      return <PersonalInfoStep flow={flow} studioId={studioId} />;
    case 2:
      return <ProfilePictureStep flow={flow} studioId={studioId} />;
    case 3:
      return <GoalsStep flow={flow} />;
    case 4:
      return <BodyMeasurementStep flow={flow} />;
    case 5:
      return <GoalWeightStep flow={flow} />;
    case 6:
      return <CircumferenceStep flow={flow} studioId={studioId} />;
    case 7:
      return <WorkedWithCoachStep flow={flow} />;
    case 8:
      return <TypicalDayStep flow={flow} />;
    case 9:
      return <SleepHoursStep flow={flow} studioId={studioId} />;
    case 10:
      return <ActivityLevelStep flow={flow} />;
    case 11:
      return <IngredientExclusionStep flow={flow} studioId={studioId} />;
    case 12:
      return <EatingHabitsStep flow={flow} />;
    case 13:
      return <FoodPreferencesStep flow={flow} />;
    case 14:
      return <ProgressionPhotosStep flow={flow} studioId={studioId} />;
    default:
      return <AnythingElseStep flow={flow} />;
  }
}

/**
 * The end of onboarding. The completion chime was unlocked on the "Done" tap
 * (`AnythingElseStep`); this is only where it actually plays, guarded by a ref so a
 * re-render from a later query update can never fire it twice.
 */
function Finished({ onDone }: { onDone: () => void }) {
  const played = useRef(false);
  useEffect(() => {
    if (!played.current) {
      played.current = true;
      playCompletionSound();
    }
  }, []);

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand text-brand-fg">
        <Check className="size-8" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading font-medium">You're all set</h1>
        <p className="text-body-sm text-fg-muted">
          Your onboarding has been submitted successfully.
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-6 h-11 w-full max-w-xs cursor-pointer rounded-control bg-primary text-body-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Continue
      </button>
    </div>
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
