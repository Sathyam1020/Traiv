import type { PlanInput } from "@traiv/nutrition";
import { ACTIVITY_FACTOR, bmi, bmr, energyTarget, reviewReasons, tdee } from "@traiv/nutrition";
import { describe, expect, it } from "vitest";

/**
 * The calorie calculator.
 *
 * Every number below is worked out by hand in the comment next to it. That is the whole
 * standard for this file: if a coach asks why their client is eating 1,420 calories, the
 * answer has to be arithmetic anyone can check, not "the system decided".
 *
 * The safety rails get the most attention, because the failure they prevent is a real
 * person under-eating on our instruction.
 */

const base: PlanInput = {
  sex: "male",
  age: 30,
  heightCm: 180,
  weightKg: 80,
  goal: "maintain",
  activity: "moderate",
  diet: "non_vegetarian",
  health: [],
};

const plan = (over: Partial<PlanInput> = {}): PlanInput => ({ ...base, ...over });

describe("BMR", () => {
  it("matches Mifflin-St Jeor for a man", () => {
    // 10(80) + 6.25(180) - 5(30) + 5 = 800 + 1125 - 150 + 5
    expect(bmr(base)).toBe(1780);
  });

  it("matches Mifflin-St Jeor for a woman", () => {
    // 10(55) + 6.25(160) - 5(28) - 161 = 550 + 1000 - 140 - 161
    expect(bmr({ sex: "female", age: 28, heightCm: 160, weightKg: 55 })).toBe(1249);
  });

  it("takes the midpoint when sex is not disclosed", () => {
    const body = { age: 30, heightCm: 180, weightKg: 80 };
    const male = bmr({ ...body, sex: "male" });
    const female = bmr({ ...body, sex: "female" });
    expect(bmr({ ...body, sex: "undisclosed" })).toBe((male + female) / 2);
  });

  it("multiplies by activity to reach maintenance", () => {
    expect(tdee(base, "moderate")).toBeCloseTo(1780 * ACTIVITY_FACTOR.moderate, 6);
  });
});

describe("BMI", () => {
  it("is derived, not asked", () => {
    // 45 / 1.5² = 20
    expect(bmi(150, 45)).toBeCloseTo(20, 6);
  });
});

describe("a normal fat-loss target", () => {
  const t = energyTarget(plan({ goal: "lose_fat" }));

  it("takes 20% off maintenance", () => {
    // BMR 1780 × 1.55 = 2759 maintenance. 20% off = 2207.2, rounded to 2210.
    expect(t.basis.tdee).toBe(2759);
    expect(t.kcal).toBe(2210);
    expect(t.basis.boundBy).toBe("none");
  });

  it("raises protein to protect lean mass", () => {
    expect(t.basis.proteinGPerKg).toBe(2.0);
    expect(t.protein).toBe(160); // 80 kg × 2.0
  });

  it("needs nobody's approval", () => {
    expect(t.review).toEqual([]);
  });
});

describe("the three floors", () => {
  it("caps the deficit at 750 kcal however big the person is", () => {
    // 190 cm, 120 kg, very active: BMR 2242.5 × 1.725 = 3868.3. 20% would be 773.7.
    const t = energyTarget(
      plan({ goal: "lose_fat", heightCm: 190, weightKg: 120, activity: "very" }),
    );
    expect(t.basis.boundBy).toBe("deficit_cap");
    expect(t.basis.tdee - t.kcal).toBeLessThanOrEqual(750);
  });

  it("never drops a target below resting metabolic rate", () => {
    // Sedentary is the trap: maintenance is only BMR × 1.2, so a 20% cut lands at 0.96 ×
    // BMR — under what the body burns lying still.
    const t = energyTarget(
      plan({ sex: "female", goal: "lose_fat", heightCm: 165, weightKg: 70, activity: "sedentary" }),
    );
    expect(t.basis.boundBy).toBe("bmr_floor");
    expect(t.kcal).toBeGreaterThanOrEqual(t.basis.bmr);
  });

  it("says so when no safe deficit exists at all", () => {
    // 63, 150 cm, 46 kg, sedentary: maintenance is 1,106 — under the 1,200 floor. The
    // floor is right to hold, but the answer is then at or above maintenance, which is
    // not a deficit and must not be handed over as if it were one.
    const t = energyTarget(
      plan({
        sex: "female",
        age: 63,
        goal: "lose_fat",
        heightCm: 150,
        weightKg: 46,
        activity: "sedentary",
      }),
    );
    expect(t.kcal).toBeGreaterThanOrEqual(t.basis.tdee);
    expect(t.review).toContain("deficit_not_possible");
  });

  it("does not raise it when a real deficit was produced", () => {
    expect(energyTarget(plan({ goal: "lose_fat" })).review).not.toContain("deficit_not_possible");
  });

  it("holds the guideline minimum for a small woman", () => {
    // 60, 150 cm, 45 kg, sedentary: BMR 926.5, maintenance 1111.8. Every percentage lands
    // under 1,200, so the floor is the only thing standing between her and 890 kcal.
    const t = energyTarget(
      plan({
        sex: "female",
        age: 60,
        goal: "lose_fat",
        heightCm: 150,
        weightKg: 45,
        activity: "sedentary",
      }),
    );
    expect(t.basis.boundBy).toBe("absolute_floor");
    expect(t.kcal).toBe(1200);
  });

  it("holds 1,500 for a man", () => {
    const t = energyTarget(
      plan({ age: 65, goal: "lose_fat", heightCm: 158, weightKg: 52, activity: "sedentary" }),
    );
    expect(t.kcal).toBeGreaterThanOrEqual(1500);
  });

  it("applies no floor when the goal is not a deficit", () => {
    expect(energyTarget(plan({ goal: "build_muscle" })).basis.boundBy).toBe("none");
    expect(energyTarget(plan({ goal: "maintain" })).basis.boundBy).toBe("none");
  });
});

describe("pregnancy", () => {
  it("never produces a deficit, whatever the client picked", () => {
    const t = energyTarget(
      plan({ sex: "female", goal: "lose_fat", health: ["pregnancy"], weightKg: 68, heightCm: 165 }),
    );
    expect(t.basis.goalAdjustmentPct).toBe(0);
    expect(t.kcal).toBeGreaterThanOrEqual(t.basis.tdee);
    expect(t.review).toContain("pregnancy");
  });

  it("still lets a surplus through", () => {
    const t = energyTarget(plan({ sex: "female", goal: "build_muscle", health: ["pregnancy"] }));
    expect(t.basis.goalAdjustmentPct).toBe(0.1);
  });
});

describe("what a coach has to see first", () => {
  it("flags conditions where the right number needs clinical context", () => {
    expect(reviewReasons(plan({ health: ["diabetes"] }))).toContain("medical_condition");
    expect(reviewReasons(plan({ health: ["blood_pressure"] }))).toContain("medical_condition");
    expect(reviewReasons(plan({ health: ["thyroid"] }))).toContain("medical_condition");
  });

  it("does not flag an injury, which changes exercises rather than calories", () => {
    expect(reviewReasons(plan({ health: ["knee", "lower_back", "shoulder"] }))).toEqual([]);
  });

  it("does not flag PCOS, which would bury the queue in noise", () => {
    // Common enough here that flagging it teaches coaches to clear the queue unread, which
    // is worse than not having a queue.
    expect(reviewReasons(plan({ sex: "female", health: ["pcos"] }))).toEqual([]);
  });

  it("flags someone already underweight", () => {
    // 50 kg at 175 cm is BMI 16.3.
    expect(reviewReasons(plan({ heightCm: 175, weightKg: 50 }))).toContain("underweight");
  });

  it("flags a goal weight that would make them underweight", () => {
    const r = reviewReasons(plan({ heightCm: 175, weightKg: 75, targetWeightKg: 52 }));
    expect(r).toContain("target_underweight");
    expect(r).not.toContain("underweight");
  });

  it("flags ages the equation was never fitted on", () => {
    expect(reviewReasons(plan({ age: 16 }))).toContain("age_out_of_range");
    expect(reviewReasons(plan({ age: 74 }))).toContain("age_out_of_range");
    expect(reviewReasons(plan({ age: 18 }))).not.toContain("age_out_of_range");
  });

  it("flags an averaged BMR rather than passing it off as calculated", () => {
    expect(reviewReasons(plan({ sex: "undisclosed" }))).toContain("sex_undisclosed");
  });

  it("flags diets where the protein target is hard to actually hit", () => {
    expect(reviewReasons(plan({ diet: "vegan" }))).toContain("protein_hard_on_diet");
    expect(reviewReasons(plan({ diet: "jain" }))).toContain("protein_hard_on_diet");
    expect(reviewReasons(plan({ diet: "vegetarian" }))).not.toContain("protein_hard_on_diet");
  });
});

describe("macros", () => {
  it("add back up to the calorie target", () => {
    for (const goal of ["lose_fat", "build_muscle", "maintain"] as const) {
      const t = energyTarget(plan({ goal }));
      const fromMacros = t.protein * 4 + t.carbs * 4 + t.fat * 9;
      expect(Math.abs(fromMacros - t.kcal), goal).toBeLessThanOrEqual(12); // rounding only
    }
  });

  it("never goes negative on carbs, even where the fat floor overruns the budget", () => {
    // A very heavy person pinned to a floored target is where this breaks if protein and
    // fat are both treated as fixed.
    const t = energyTarget(
      plan({
        sex: "female",
        goal: "lose_fat",
        heightCm: 150,
        weightKg: 150,
        activity: "sedentary",
      }),
    );
    expect(t.carbs).toBeGreaterThanOrEqual(0);
    expect(t.fat).toBeGreaterThanOrEqual(0);
    expect(t.protein * 4 + t.fat * 9).toBeLessThanOrEqual(t.kcal + 12);
  });

  it("keeps protein off the ceiling for a heavy client", () => {
    const t = energyTarget(plan({ goal: "lose_fat", weightKg: 140, heightCm: 170 }));
    expect(t.protein * 4).toBeLessThanOrEqual(t.kcal * 0.35 + 4);
  });
});

describe("the derivation travels with the number", () => {
  it("records enough to reproduce the target by hand", () => {
    const t = energyTarget(plan({ goal: "lose_fat" }));
    expect(t.basis.formula).toBe("mifflin-st-jeor@1");
    expect(t.basis.bmr).toBe(1780);
    expect(t.basis.activityFactor).toBe(1.55);
    expect(t.basis.goalAdjustmentPct).toBe(-0.2);
    expect(t.basis.unboundedKcal).toBe(Math.round(t.basis.tdee * 0.8));
    expect(t.basis.bmi).toBe(24.7); // 80 / 1.8²
  });

  it("is a pure function — same input, same output", () => {
    const a = energyTarget(plan({ goal: "lose_fat" }));
    const b = energyTarget(plan({ goal: "lose_fat" }));
    expect(a).toEqual(b);
  });
});
