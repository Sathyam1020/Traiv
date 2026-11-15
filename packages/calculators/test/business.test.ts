import assert from "node:assert/strict";
import test from "node:test";
import { coachingIncome, coachingRate } from "@traiv/calculators/business";

const close = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

test("in-person defaults: 50 × 25 sessions × 48 weeks, 20% gym split, 300/month costs", () => {
  const r = coachingIncome({
    model: "in-person",
    sessionRate: 50,
    sessionsPerWeek: 25,
    gymSplitPct: 20,
    weeksPerYear: 48,
    monthlyCosts: 300,
  });
  assert.equal(r.annualGross, 60000);
  assert.equal(r.monthlyGross, 5000);
  assert.equal(r.annualTake, 60000 * 0.8 - 3600);
  assert.equal(r.hoursPerWeek, 25);
  assert.ok(close(r.hourly, 44400 / (25 * 48)));
});

test("online defaults: 150 × 30 clients, monthly billing ignores weeks off", () => {
  const r = coachingIncome({
    model: "online",
    pricePerClient: 150,
    clients: 30,
    hoursPerClient: 0.75,
    weeksPerYear: 48,
    monthlyCosts: 300,
  });
  assert.equal(r.monthlyGross, 4500);
  assert.equal(r.monthlyTake, 4200);
  assert.ok(close(r.hoursPerWeek, 22.5, 1e-9));
});

test("a gym split above 100% cannot make income negative beyond the costs", () => {
  const r = coachingIncome({
    model: "in-person",
    sessionRate: 50,
    sessionsPerWeek: 10,
    gymSplitPct: 150,
    weeksPerYear: 48,
    monthlyCosts: 0,
  });
  assert.equal(r.annualTake, 0);
});

test("rate: 6,000 pay + 800 costs over 33 slots at 6% churn", () => {
  const r = coachingRate({
    targetMonthlyIncome: 6000,
    monthlyCosts: 800,
    hoursPerClient: 0.75,
    hoursAvailable: 25,
    churnPct: 6,
  });
  assert.ok(r);
  assert.equal(r.capacity, 33);
  assert.ok(close(r.price, 6800 / (33 * 0.94), 1e-6));
  assert.ok(r.priceAtHalfChurn < r.price);
  assert.equal(r.breakevenClients, Math.ceil(800 / r.price));
});

test("rate: not enough hours for a single client returns nothing, not a divide-by-zero", () => {
  assert.equal(
    coachingRate({
      targetMonthlyIncome: 6000,
      monthlyCosts: 800,
      hoursPerClient: 5,
      hoursAvailable: 2,
      churnPct: 6,
    }),
    null,
  );
});
