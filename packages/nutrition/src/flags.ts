import { bmi } from "@traiv/nutrition/bmr";
import type { PlanInput, ReviewReason } from "@traiv/nutrition/types";

/** Below this, nobody gets put in a deficit by an equation. */
const UNDERWEIGHT_BMI = 18.5;

/**
 * Conditions where the right calorie number depends on things we did not ask and must not
 * infer — medication, bloods, how long ago, how well controlled.
 *
 * Reaching this list does not mean the person is unwell or that we have decided anything
 * about them. It means a human reads their note before a number reaches them.
 */
const NEEDS_CLINICAL_CONTEXT = ["diabetes", "blood_pressure", "thyroid"] as const;

/**
 * What stops a target going live on its own.
 *
 * Knee, back and shoulder are deliberately absent: they change which exercises a plan
 * contains, not how many calories it should hold, and they reach the coach through the
 * intake note either way.
 *
 * PCOS is also absent. It is extremely common in this market, it does not by itself make
 * a standard target unsafe, and flagging every client who has it would turn the review
 * queue into noise the coach learns to clear without reading.
 */
export function reviewReasons(input: PlanInput): ReviewReason[] {
  const reasons: ReviewReason[] = [];
  const health = new Set(input.health);

  if (health.has("pregnancy")) reasons.push("pregnancy");
  if (NEEDS_CLINICAL_CONTEXT.some((c) => health.has(c))) reasons.push("medical_condition");

  if (bmi(input.heightCm, input.weightKg) < UNDERWEIGHT_BMI) reasons.push("underweight");

  // Wanting to end up underweight is a conversation, not a calculation.
  if (
    input.targetWeightKg !== undefined &&
    bmi(input.heightCm, input.targetWeightKg) < UNDERWEIGHT_BMI
  ) {
    reasons.push("target_underweight");
  }

  // The equation was fitted on adults. Outside that range it is being used off-label, and
  // under-18s should not be handed an automated deficit at all.
  if (input.age < 18 || input.age > 70) reasons.push("age_out_of_range");

  if (input.sex === "undisclosed") reasons.push("sex_undisclosed");

  // 1.6-2.0 g/kg is reachable on a vegetarian diet with dairy. On vegan or Jain cooking it
  // usually is not without planning the coach should be doing, so say so instead of
  // issuing a number the client will quietly miss every day and feel bad about.
  if (input.diet === "vegan" || input.diet === "jain") reasons.push("protein_hard_on_diet");

  return reasons;
}
