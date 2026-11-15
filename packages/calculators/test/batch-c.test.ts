import assert from "node:assert/strict";
import test from "node:test";
import { caloriesBurned, stepsToCalories, sweatRate } from "@traiv/calculators/activity";
import { cyclePhase, fastingWindow, isEating } from "@traiv/calculators/schedule";
import {
  cutLength,
  goalWeightDate,
  rateSafety,
  weightLossPhases,
} from "@traiv/calculators/timeline";

const close = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
const TODAY = new Date("2026-11-15T00:00:00Z");

test("goal date: 10 kg at 0.5 kg a week is 20 weeks, about a 550 kcal daily deficit", () => {
  const g = goalWeightDate(90, 80, 0.5, TODAY);
  assert.equal(g.direction, "lose");
  assert.equal(g.weeks, 20);
  assert.ok(close(g.dailyDelta, 550));
  assert.equal(g.date.toISOString().slice(0, 10), "2027-04-04");
});

test("goal date works for gaining, and same weight means no timeline", () => {
  assert.equal(goalWeightDate(70, 75, 0.25, TODAY).direction, "gain");
  assert.equal(goalWeightDate(70, 70, 0.25, TODAY).weeks, 0);
});

test("rate safety is a share of body weight", () => {
  assert.equal(rateSafety(0.25, 80), "gentle");
  assert.equal(rateSafety(0.5, 80), "recommended");
  assert.equal(rateSafety(1, 80), "fast");
  assert.equal(rateSafety(1, 55), "extreme");
});

test("phases: each phase recalculates, so the target falls but the pace is restored", () => {
  const r = weightLossPhases({
    sex: "male",
    age: 35,
    heightCm: 180,
    startKg: 100,
    goalKg: 85,
    activity: "moderate",
    dailyDeficit: 500,
    today: TODAY,
  });
  assert.ok(r.reached);
  assert.ok(r.phases.length >= 2);
  const [a, b] = r.phases;
  assert.ok(a && b);
  // Lower weight, lower maintenance, lower target from one phase to the next.
  assert.ok(b.target < a.target);
  // Never faster than the planned 500 kcal/day (0.45 kg a week) within any phase.
  for (const p of r.phases) assert.ok((p.startKg - p.endKg) / p.weeks <= (500 * 7) / 7700 + 1e-9);
  // Two maintenance weeks between phases are counted in the total.
  const dietWeeks = r.phases.reduce((n, p) => n + p.weeks, 0);
  assert.equal(r.totalWeeks, dietWeeks + 2 * (r.phases.length - 1));
});

test("phases never set a target under the floor", () => {
  const r = weightLossPhases({
    sex: "female",
    age: 40,
    heightCm: 158,
    startKg: 60,
    goalKg: 54,
    activity: "sedentary",
    dailyDeficit: 750,
    today: TODAY,
  });
  for (const p of r.phases) assert.ok(p.target >= 1200);
});

test("cut length: 90 kg at 20% to 12% keeps lean mass, 1% a week", () => {
  const c = cutLength(90, 20, 12, 0.01, "male");
  assert.ok(close(c.targetKg, 72 / 0.88, 1e-6));
  assert.ok(close(c.fatToLose, 90 - 72 / 0.88, 1e-6));
  assert.ok(close(c.weeks, Math.log(c.targetKg / 90) / Math.log(0.99), 1e-9));
  assert.equal(cutLength(60, 20, 12, 0.01, "female").belowFloor, true);
});

test("calories burned: brisk walking 30 min at 77 kg ≈ 174 kcal (MET 4.3)", () => {
  const r = caloriesBurned("walking", 77.11, 30);
  assert.ok(close(r.total, ((4.3 * 3.5 * 77.11) / 200) * 30));
});

test("steps: 10,000 at 170 cm, average pace gives about 7 km", () => {
  const s = stepsToCalories(10000, 77, 170.18, "average");
  assert.ok(close(s.km, 7.05, 0.05));
  assert.ok(s.total > 0 && close(s.per1000 * 10, s.total, 1e-6));
});

test("sweat rate: 80 → 78.6 kg with 0.6 L drunk over 60 min is 2.0 L/h", () => {
  const r = sweatRate(80, 78.6, 0.6, 60);
  assert.ok(close(r.perHour, 2.0, 1e-9));
  assert.ok(close(r.pctLost, 1.75, 1e-9));
  assert.equal(r.status, "ok");
  assert.equal(sweatRate(70, 68.5, 0, 60).status, "high");
});

test("fasting: 16:8 anchored on an 8 pm last meal eats noon to 8 pm", () => {
  const w = fastingWindow("16:8", "last", 20 * 60);
  assert.ok(w);
  assert.equal(w.eatStart, 12 * 60);
  assert.equal(w.eatEnd, 20 * 60);
  assert.ok(isEating(w, 13 * 60));
  assert.ok(!isEating(w, 22 * 60));
  const late = fastingWindow("20:4", "first", 22 * 60);
  assert.ok(late && isEating(late, 60) && !isEating(late, 3 * 60));
  assert.equal(fastingWindow("5:2", "last", 0), null);
});

test("cycle: day 1 on the first day, ovulation 14 days before the next period", () => {
  const start = new Date("2026-11-01T00:00:00Z");
  assert.equal(cyclePhase(start, 28, start)?.phase, "menstrual");
  const d14 = cyclePhase(start, 28, new Date("2026-11-14T00:00:00Z"));
  assert.equal(d14?.day, 14);
  assert.equal(d14?.phase, "ovulation");
  assert.equal(cyclePhase(start, 28, new Date("2026-11-22T00:00:00Z"))?.phase, "luteal");
  assert.equal(cyclePhase(start, 28, new Date("2026-10-01T00:00:00Z")), null);
  assert.equal(cyclePhase(start, 28, new Date("2026-12-03T00:00:00Z"))?.overdue, true);
});
