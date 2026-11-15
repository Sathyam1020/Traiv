import assert from "node:assert/strict";
import test from "node:test";
import { expenditure, resolveBody } from "@traiv/calculators/energy";
import { bulkPlan, DEFICIT_RATE, deficitPlan, surplusPlan } from "@traiv/calculators/goals";
import {
  BODY_TYPE_SHARES,
  ketoMacros,
  macrosFor,
  macrosFromShares,
} from "@traiv/calculators/macros";

const TODAY = new Date("2026-11-15T00:00:00Z");
const close = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

test("macro split: protein per kg first, fat 25%, carbohydrate fills the rest", () => {
  // 80 kg, 2,500 kcal, maintain: protein 144 g (576 kcal), fat 69.4 g (625), carbs 324.75 g.
  const m = macrosFor(2500, 80, "maintain");
  assert.ok(close(m.protein.grams, 144));
  assert.ok(close(m.fat.grams, (2500 * 0.25) / 9));
  assert.ok(close(m.carbs.grams, (2500 - 576 - 625) / 4));
  assert.ok(close(m.protein.kcal + m.carbs.kcal + m.fat.kcal, 2500, 0.01));
  assert.equal(m.squeezed, false);
});

test("a cut gets more protein per kg than maintenance", () => {
  assert.ok(
    macrosFor(2000, 80, "cut").protein.grams > macrosFor(2000, 80, "maintain").protein.grams,
  );
});

test("a calorie target too small for the floors is flagged, never negative carbs", () => {
  const m = macrosFor(900, 120, "cut");
  assert.equal(m.squeezed, true);
  assert.ok(m.carbs.grams >= 0);
  assert.ok(close(m.fat.grams, 0.6 * 120));
});

test("body-type shares add to 100% and reproduce themselves", () => {
  for (const shares of Object.values(BODY_TYPE_SHARES)) {
    assert.ok(close(shares.protein + shares.carbs + shares.fat, 1, 1e-9));
    const m = macrosFromShares(2400, shares);
    assert.ok(close(m.protein.share, shares.protein, 1e-9));
    assert.ok(close(m.fat.share, shares.fat, 1e-9));
  }
});

test("keto: carbs fixed, protein from lean mass when body fat is given, fat fills the rest", () => {
  const withBf = ketoMacros(2200, 80, 30, 25); // lean 60 kg -> 108 g protein
  assert.equal(withBf.carbs.grams, 30);
  assert.ok(close(withBf.protein.grams, 108));
  assert.equal(withBf.proteinBasis, "lean");
  assert.ok(close(withBf.fat.grams, (2200 - 108 * 4 - 120) / 9));
  const noBf = ketoMacros(2200, 80, 30, null);
  assert.ok(close(noBf.protein.grams, 128));
  assert.equal(noBf.proteinBasis, "total");
});

test("deficit: steady (0.5 kg/week) is a 550 kcal daily gap, with a goal date", () => {
  const body = resolveBody({ units: "metric", sex: "male", age: 30, heightCm: 178, weight: 85 });
  assert.ok(body.ok);
  const e = expenditure(body.value, "moderate");
  const p = deficitPlan({
    tdee: e.tdee,
    bmr: e.bmr,
    sex: "male",
    weeklyLossKg: DEFICIT_RATE.steady.kg,
    currentKg: 85,
    goalKg: 80,
    today: TODAY,
  });
  assert.ok(close(p.dailyDeficit, 550));
  assert.ok(p.weeksToGoal !== null && close(p.weeksToGoal, 10, 0.01));
  assert.equal(p.goalDate?.toISOString().slice(0, 10), "2027-01-24");
});

test("deficit never goes under the 1,200 / 1,500 floor, and says so", () => {
  const p = deficitPlan({
    tdee: 1700,
    bmr: 1300,
    sex: "female",
    weeklyLossKg: 1,
    currentKg: 60,
    goalKg: null,
    today: TODAY,
  });
  assert.equal(p.target, 1200);
  assert.equal(p.floored, "minimum");
  assert.ok(p.belowBmr);
  assert.ok(p.dailyDeficit < 1100);
});

test("a goal weight above current gives no loss timeline", () => {
  const p = deficitPlan({
    tdee: 2500,
    bmr: 1700,
    sex: "male",
    weeklyLossKg: 0.5,
    currentKg: 80,
    goalKg: 85,
    today: TODAY,
  });
  assert.equal(p.weeksToGoal, null);
  assert.equal(p.goalDate, null);
});

test("surplus: standard is +375 kcal with a 1.6 to 2.2 g/kg protein range", () => {
  const s = surplusPlan({ tdee: 2600, size: "standard", currentKg: 70, goalKg: 75, today: TODAY });
  assert.equal(s.target, 2975);
  assert.ok(close(s.proteinLowG, 112) && close(s.proteinHighG, 154));
  // 375 × 7 / 7700 = 0.341 kg/week -> 5 kg in ~14.7 weeks
  assert.ok(s.weeksToGoal !== null && close(s.weeksToGoal, 14.67, 0.01));
});

test("bulk: moderate is +15% of maintenance, macros add back up to the total", () => {
  const b = bulkPlan(2500, 77, "moderate");
  assert.equal(b.surplus, 375);
  assert.equal(b.total, 2875);
  assert.ok(close(b.proteinG * 4 + b.fatG * 9 + b.carbsG * 4, 2875, 0.01));
  assert.ok(close(b.weeklyGainKg, (375 * 7) / 7700, 1e-9));
});
