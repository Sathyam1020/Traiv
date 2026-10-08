import { ACTIVITY_FACTOR, absoluteFloor, bmi, bmr, tdee } from "@traiv/nutrition/bmr";
import { reviewReasons } from "@traiv/nutrition/flags";
import type { EnergyTarget, Goal, PlanInput } from "@traiv/nutrition/types";

/**
 * How far from maintenance each goal sits.
 *
 * Percentages rather than fixed calories, so a 95 kg man and a 48 kg woman get deficits
 * proportionate to what they actually burn instead of the same 500 kcal.
 */
const GOAL_ADJUSTMENT: Record<Goal, number> = {
  lose_fat: -0.2,
  build_muscle: 0.1,
  get_stronger: 0.05,
  maintain: 0,
  improve_fitness: 0,
  general_health: 0,
};

/** Past this, weight loss stops being mostly fat and starts costing muscle and bone. */
const MAX_DEFICIT_KCAL = 750;

/** Grams per kg of bodyweight. Raised in a deficit, where protein protects lean mass. */
const PROTEIN_MAINTENANCE = 1.6;
const PROTEIN_DEFICIT = 2.0;

/** Protein past this share of intake squeezes out everything else. */
const PROTEIN_KCAL_SHARE_CAP = 0.35;

const FAT_KCAL_SHARE = 0.25;
const FAT_G_PER_KG_FLOOR = 0.6;

/**
 * The daily energy and macro target for one client.
 *
 * Deterministic: same inputs, same number, every time, with the derivation attached. No
 * model is consulted here and none should be — an AI that can move somebody's calories is
 * an AI that can move them for no reason anyone can reconstruct afterwards.
 *
 * What comes out is a starting point, not a prescription. It is the first row of a series
 * that gets adjusted against real weight data once there is some.
 */
export function energyTarget(input: PlanInput): EnergyTarget {
  const { sex, weightKg, heightCm, activity, goal } = input;

  const restingRate = bmr(input);
  const maintenance = tdee(input, activity);
  const review = reviewReasons(input);

  // Pregnancy overrides the goal outright. Someone pregnant or newly postpartum who picks
  // "lose fat" gets maintenance and a coach, never an automatic deficit.
  const pregnant = input.health.includes("pregnancy");
  const adjustment = pregnant ? Math.max(0, GOAL_ADJUSTMENT[goal]) : GOAL_ADJUSTMENT[goal];

  const unbounded = maintenance * (1 + adjustment);

  let kcal = unbounded;
  let boundBy: EnergyTarget["basis"]["boundBy"] = "none";

  if (adjustment < 0) {
    // Three floors, each for a different reason. The highest one wins, and we record which
    // so a coach looking at a target that seems too high can see it was held up, not chosen.
    const capped = maintenance - MAX_DEFICIT_KCAL;
    const floor = absoluteFloor(sex);

    if (capped > kcal) {
      kcal = capped;
      boundBy = "deficit_cap";
    }
    if (restingRate > kcal) {
      kcal = restingRate;
      boundBy = "bmr_floor";
    }
    if (floor > kcal) {
      kcal = floor;
      boundBy = "absolute_floor";
    }
  }

  kcal = Math.round(kcal / 10) * 10;

  // Macros come off the rounded number so they add back up to it.
  const proteinGPerKg = adjustment < 0 ? PROTEIN_DEFICIT : PROTEIN_MAINTENANCE;
  const protein = Math.min(weightKg * proteinGPerKg, (kcal * PROTEIN_KCAL_SHARE_CAP) / 4);

  // A heavy person on a floored target can have a fat floor that overruns what is left.
  // Protein holds and fat gives way, because in a deficit protein is the one doing work.
  const fatBudget = kcal - protein * 4;
  const fat = Math.min(
    Math.max((kcal * FAT_KCAL_SHARE) / 9, weightKg * FAT_G_PER_KG_FLOOR),
    Math.max(0, fatBudget) / 9,
  );

  const carbs = Math.max(0, (kcal - protein * 4 - fat * 9) / 4);

  // A small, older, sedentary client can have a maintenance under the 1,200 floor. The
  // floor is right to hold, but the result is a fat-loss goal answered with a number at or
  // above maintenance — which is not a deficit and must not be presented as one. There is
  // no safe arithmetic answer here, so it goes to the coach.
  if (adjustment < 0 && kcal >= maintenance) review.push("deficit_not_possible");

  return {
    kcal,
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    review,
    basis: {
      formula: "mifflin-st-jeor@1",
      bmr: Math.round(restingRate),
      tdee: Math.round(maintenance),
      activityFactor: ACTIVITY_FACTOR[activity],
      goalAdjustmentPct: adjustment,
      unboundedKcal: Math.round(unbounded),
      boundBy,
      proteinGPerKg,
      bmi: Math.round(bmi(heightCm, weightKg) * 10) / 10,
    },
  };
}
