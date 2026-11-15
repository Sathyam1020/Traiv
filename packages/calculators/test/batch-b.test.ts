import assert from "node:assert/strict";
import test from "node:test";
import {
  calorieCycling,
  caloriesPerMeal,
  carbCycling,
  creatineDose,
  fiberTarget,
  proteinPerMeal,
  proteinTarget,
  refeedDay,
  reverseDiet,
  waterIntake,
} from "@traiv/calculators/intake";

const close = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

test("protein: 80 kg building muscle, regular training, is 1.8 g/kg = 144 g", () => {
  const p = proteinTarget(80, "build", "active");
  assert.ok(close(p.grams, 144));
  assert.ok(p.low < p.grams && p.grams < p.high);
});

test("protein never leaves 1.2 to 2.4 g/kg whatever the combination", () => {
  for (const g of ["maintain", "build", "lose"] as const)
    for (const a of ["light", "active", "very"] as const) {
      const p = proteinTarget(70, g, a);
      assert.ok(p.gPerKg >= 1.2 && p.gPerKg <= 2.4);
    }
});

test("protein per meal: 80 kg building, 4 meals is 36 g a meal against a 32 g threshold", () => {
  const r = proteinPerMeal(80, "build", 4);
  assert.ok(close(r.perMeal, 36));
  assert.ok(close(r.threshold, 32));
  assert.equal(r.status, "ok");
  assert.equal(proteinPerMeal(50, "maintain", 6).status, "low");
});

test("calories per meal always add back up to the target", () => {
  for (const style of ["even", "front", "post"] as const) {
    const meals = caloriesPerMeal(2200, 4, style, 3);
    assert.ok(
      close(
        meals.reduce((a, b) => a + b, 0),
        2200,
        1e-6,
      ),
    );
  }
  const front = caloriesPerMeal(2200, 4, "front");
  assert.ok((front[0] ?? 0) > (front[3] ?? 0));
  const post = caloriesPerMeal(2000, 4, "post", 2);
  assert.ok((post[1] ?? 0) > (post[0] ?? 0));
});

test("fibre: 14 g per 1,000 kcal, and the IOM fixed amounts by age and sex", () => {
  assert.equal(fiberTarget(35, "female", 2000).headline, 28);
  assert.equal(fiberTarget(35, "female", null).headline, 25);
  assert.equal(fiberTarget(60, "male", null).fixed, 30);
  assert.equal(fiberTarget(30, "male", null).fixed, 38);
});

test("water: 170 lb and 45 minutes is about 3.1 L", () => {
  const w = waterIntake(170 * 0.45359237, 45);
  assert.ok(close(w.flOz, 85 + 18, 0.6));
  assert.ok(close(w.liters, 3.05, 0.05));
});

test("creatine: 80 kg loading is 24 g/day for 7 days, maintenance 3 to 10 g", () => {
  const c = creatineDose(80, true);
  assert.equal(c.loading, 24);
  assert.equal(c.loadingDays, 7);
  assert.ok(c.maintenance >= 3 && c.maintenance <= 10);
  assert.equal(creatineDose(50, false).maintenance, 3);
  assert.equal(creatineDose(50, false).loading, null);
});

test("calorie cycling keeps the weekly total equal to eating the average every day", () => {
  const c = calorieCycling(2400, 4, "moderate");
  assert.ok(close(c.weekCycled, c.weekFlat, 1e-6));
  assert.ok(c.train.calories > c.rest.calories);
  assert.equal(c.train.protein, c.rest.protein);
});

test("carb cycling: same protein and fat every day, weekly total unchanged", () => {
  const c = carbCycling(2080, 80, 4, "moderate");
  assert.ok(close(c.weekCycled, c.weekFlat, 1e-6));
  assert.ok(close(c.low.carbs, c.avgCarbs * 0.5, 1e-6));
  assert.equal(c.high.protein, c.low.protein);
});

test("refeed: calories back to maintenance, protein grams unchanged, carbs carry the jump", () => {
  const r = refeedDay(2600, 500, 8, 0.3);
  assert.ok(close(r.refeed.calories, 2600, 1e-9));
  assert.equal(r.refeed.protein, r.cut.protein);
  assert.ok(r.carbSwing > 0);
  assert.equal(r.frequency, "weekly");
  assert.equal(refeedDay(2600, 500, 2, 0.3).frequency, "not-yet");
});

test("reverse diet: 1,500 to 2,100 at 75 a week is 8 weeks and never overshoots", () => {
  const r = reverseDiet(1500, 2100, 75, 72);
  assert.equal(r.weeks, 8);
  assert.equal(r.schedule.at(-1)?.calories, 2100);
  assert.equal(reverseDiet(2200, 2100, 75, 72).weeks, 0);
});
