import assert from "node:assert/strict";
import test from "node:test";
import { buildPlan, exerciseSwap } from "@traiv/calculators/programs";

test("plan: 4 days is an upper/lower split with 4 sessions", () => {
  const p = buildPlan(4, "muscle", "intermediate");
  assert.equal(p.plan.length, 4);
  assert.match(p.splitName, /Upper/);
  assert.ok(p.weeklySets > 0);
});

test("plan: beginners get fewer exercises and sets than advanced lifters", () => {
  const b = buildPlan(3, "strength", "beginner");
  const a = buildPlan(3, "strength", "advanced");
  assert.ok(b.weeklySets < a.weeklySets);
  assert.ok((b.plan[0]?.exercises.length ?? 0) < (a.plan[0]?.exercises.length ?? 0));
});

test("plan: fitness and fat loss add a finisher, strength does not", () => {
  assert.ok(buildPlan(3, "fatloss", "intermediate").plan[0]?.finisher);
  assert.equal(buildPlan(3, "strength", "intermediate").plan[0]?.finisher, undefined);
});

test("swap: 'cannot load' always refers and suggests nothing to load", () => {
  const r = exerciseSwap({
    area: "knee",
    severity: "cannot",
    exercise: "Back squat",
    goal: "general",
    equipment: "gym",
  });
  assert.equal(r.refer, true);
  assert.equal(r.swaps.length, 0);
});

test("swap: shoulder twinge on bench puts a shoulder-friendly press first", () => {
  const r = exerciseSwap({
    area: "shoulder",
    severity: "twinge",
    exercise: "Barbell bench",
    goal: "hypertrophy",
    equipment: "gym",
  });
  assert.equal(r.refer, false);
  assert.ok(r.swaps.length > 0);
  assert.ok(r.swaps[0]?.easesOn.includes("shoulder"));
});

test("swap: bodyweight-only users only get bodyweight options when any exist", () => {
  const r = exerciseSwap({
    area: "lowerback",
    severity: "painful",
    exercise: "Back squat",
    goal: "general",
    equipment: "bodyweight",
  });
  assert.equal(r.refer, true);
  for (const s of r.swaps) assert.ok(s.kit.includes("bodyweight"));
});

test("painful loading does not prescribe exercises or a recovery schedule", () => {
  const r = exerciseSwap({
    area: "shoulder",
    severity: "painful",
    exercise: "Barbell bench",
    goal: "hypertrophy",
    equipment: "gym",
  });
  assert.equal(r.refer, true);
  assert.deepEqual(r.swaps, []);
  assert.deepEqual(r.ramp, []);
  assert.equal(r.dose, null);
});

test("an unavailable equipment match does not fall back to gym equipment", () => {
  const r = exerciseSwap({
    area: "elbow",
    severity: "twinge",
    exercise: "Bicep curl",
    goal: "general",
    equipment: "bodyweight",
  });
  assert.deepEqual(r.swaps, []);
  assert.equal(r.dose, null);
  assert.match(r.message, /No alternative/);
});
