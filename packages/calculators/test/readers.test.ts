import assert from "node:assert/strict";
import { test } from "node:test";
import { parseNumbers, parseSets, readBusinessHealth, readCheckin, readChurnRisk, readLift, readWeightTrend, scanRedFlags, trend } from "../src/readers.ts";

const base = { weightChangeKg: -0.4, weeks: 3, adherencePct: 85, trainingDone: 3, trainingPlanned: 4, sleepHours: 7, energy: 3, stress: 2, goal: "deficit" as const, note: "" };

test("parsing", () => {
  assert.deepEqual(parseNumbers("82.1, 81.4\n81.6 ; 81.5"), [82.1, 81.4, 81.6, 81.5]);
  assert.deepEqual(parseSets("100x5, 102.5 x 4, junk, 105*3"), [{ weight: 100, reps: 5 }, { weight: 102.5, reps: 4 }, { weight: 105, reps: 3 }]);
  const t = trend([1, 2, 3, 4]);
  assert.equal(t.slope, 1);
  assert.equal(t.resid, 0);
});

test("check-in reader priorities", () => {
  assert.equal(readCheckin(base).verdict, "push");
  assert.equal(readCheckin({ ...base, note: "felt dizzy and nearly fainted" }).verdict, "refer");
  assert.equal(readCheckin({ ...base, sleepHours: 5 }).verdict, "pullback");
  assert.equal(readCheckin({ ...base, adherencePct: 60 }).verdict, "behaviour");
  assert.equal(readCheckin({ ...base, trainingDone: 1 }).verdict, "behaviour");
  assert.equal(readCheckin({ ...base, weightChangeKg: 0.1 }).verdict, "recalculate");
  assert.equal(readCheckin({ ...base, weightChangeKg: 0.1, weeks: 1 }).verdict, "too-early");
  assert.equal(readCheckin({ ...base, weightChangeKg: -1.6 }).direction, "too-fast");
  assert.equal(readCheckin({ ...base, goal: "surplus", weightChangeKg: 0.25 }).verdict, "push");
});

test("red flags and exit intent", () => {
  assert.deepEqual(scanRedFlags("all good this week"), []);
  assert.ok(scanRedFlags("I've been bingeing at night").length === 1);
  assert.equal(readChurnRisk({ tenureWeeks: 12, lastCheckin: 0, replies: "yes", adherence: "steady", results: "ontrack", mood: "positive", payment: "current", note: "" }).level, "low");
  assert.equal(readChurnRisk({ tenureWeeks: 12, lastCheckin: 3, replies: "quiet", adherence: "steady", results: "ontrack", mood: "positive", payment: "current", note: "" }).level, "high");
  assert.equal(readChurnRisk({ tenureWeeks: 12, lastCheckin: 0, replies: "slow", adherence: "slipping", results: "stalled", mood: "positive", payment: "current", note: "" }).level, "watch");
  const exit = readChurnRisk({ tenureWeeks: 12, lastCheckin: 0, replies: "yes", adherence: "steady", results: "ontrack", mood: "positive", payment: "current", note: "money is tight right now" });
  assert.equal(exit.exit, true);
  assert.equal(exit.level, "high");
});

test("business health", () => {
  const mid = { admin: 1, tools: 1, onboarding: 1, checkins: 1, retention: 1, pricing: 1, experience: 1, capacity: 1 } as const;
  const r = readBusinessHealth(mid);
  assert.equal(r.total, 8);
  assert.equal(r.band, "leaky");
  assert.deepEqual(r.leaks, ["retention", "capacity", "admin"]);
  assert.deepEqual(readBusinessHealth({ ...mid, pricing: 0 }).leaks, ["pricing", "retention", "capacity"]);
});

test("lift reader", () => {
  assert.equal(readLift("100x5, 102.5x5, 105x5, 107.5x5", "intermediate")?.verdict, "progressing");
  assert.equal(readLift("100x5, 100x5, 100x5, 100x5", "intermediate")?.verdict, "stall");
  assert.equal(readLift("100x5, 102.5x4, 105x3, 107.5x2", "intermediate")?.verdict, "grinding");
  assert.equal(readLift("110x5, 105x5, 100x5, 95x5", "intermediate")?.verdict, "regressing");
  assert.equal(readLift("100x5, 105x5, 110x5, 115x5, 100x5", "novice")?.verdict, "wobble");
  assert.equal(readLift("100x5", "novice"), null);
});

test("weight trend reader", () => {
  const o = { daily: false, phase: "cut" as const, adherencePct: 85, waist: "flat" as const, strength: "flat" as const, cycle: false, event: false };
  assert.equal(readWeightTrend("82, 81.4, 80.9, 80.3, 79.8", o)?.verdict, "on-track");
  assert.equal(readWeightTrend("82, 81, 79.8, 78.7, 77.5", o)?.verdict, "too-fast");
  assert.equal(readWeightTrend("82.1, 82.0, 82.2, 82.1, 82.0, 82.1", o)?.verdict, "stall");
  assert.equal(readWeightTrend("82.1, 82.0, 82.2, 82.1, 82.0, 82.1", { ...o, waist: "down" })?.verdict, "recomp");
  assert.equal(readWeightTrend("82.1, 82.0, 82.2, 82.1, 82.0, 82.1", { ...o, cycle: true })?.verdict, "water");
  assert.equal(readWeightTrend("70, 70.2, 70.3, 70.5", { ...o, phase: "gain" })?.verdict, "on-track");
  assert.equal(readWeightTrend("82, 81", o), null);
  console.log("placeholder", JSON.stringify(readWeightTrend("82.1, 81.4, 81.6, 81.5, 81.3, 81.4", o)));
  console.log("lift placeholder", JSON.stringify(readLift("100x5, 100x5, 102.5x5, 102.5x4, 105x3", "intermediate")));
});
