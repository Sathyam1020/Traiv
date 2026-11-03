import { describe, expect, it } from "vitest";
import { isFutureStepDate, stepsDate, stepsPeriod, stepsWrite } from "./steps-validation.js";

describe("step dates and totals", () => {
  it("rejects invalid dates, reversed and excessive ranges", () => {
    expect(stepsDate.safeParse("2026-02-30").success).toBe(false);
    expect(stepsDate.safeParse("2028-02-29").success).toBe(true);
    expect(stepsPeriod.safeParse({ start: "2026-01-10", end: "2026-01-01" }).success).toBe(false);
    expect(stepsPeriod.safeParse({ start: "2024-01-01", end: "2026-01-01" }).success).toBe(false);
  });
  it("uses the device timezone around midnight", () => {
    const now = new Date("2026-11-02T20:00:00Z");
    expect(isFutureStepDate("2026-11-03", "Asia/Kolkata", now)).toBe(false);
    expect(isFutureStepDate("2026-11-03", "America/New_York", now)).toBe(true);
  });
  it("requires whole counts and valid timezones", () => {
    for (const count of [-1, 1.5, 200001])
      expect(stepsWrite.safeParse({ date: "2026-01-01", count }).success).toBe(false);
    expect(
      stepsWrite.safeParse({ date: "2026-01-01", count: 0, timeZone: "invalid" }).success,
    ).toBe(false);
    expect(stepsWrite.safeParse({ date: "2026-01-01", count: 0 }).success).toBe(true);
  });
});
