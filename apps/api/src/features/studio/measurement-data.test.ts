import { describe, expect, it } from "vitest";
import { measurementPeriod, measurementWrite, withCircumference } from "./measurement-data.js";
import {
  pointsFor,
  swapChart,
  weeklyPoints,
} from "../../../../trainer/src/app/(app)/clients/_components/development/measurement-model.js";

describe("measurements", () => {
  it("accepts the date-range query sent by Body progress", () => {
    expect(measurementPeriod.parse({ from: "2026-10-04", to: "2026-11-02" })).toEqual({
      from: "2026-10-04",
      to: "2026-11-02",
    });
  });
  it("rejects empty, unknown, invalid and out-of-range values", () => {
    const base = { id: "6d9c1796-5fbc-4f5e-80af-32f414fa2f81", date: "2026-11-02" };
    for (const values of [{}, { unknown: 5 }, { weight: 0 }, { mood: 6 }, { waist: -1 }])
      expect(measurementWrite.safeParse({ ...base, values }).success).toBe(false);
    expect(measurementWrite.safeParse({ ...base, values: { weight: 74, mood: 4 } }).success).toBe(
      true,
    );
    expect(measurementPeriod.safeParse({ from: "2026-11-02", to: "2026-10-02" }).success).toBe(
      false,
    );
  });
  it("does not turn missing circumference measurements into a false drop", () => {
    const events = withCircumference([
      { id: "a", takenAt: "2026-10-26", source: "check_in", values: { waist: 70 } },
      {
        id: "b",
        takenAt: "2026-11-02",
        source: "coach",
        values: { waist: 70, hips: 90, chest: 100, thigh: 50, arm: 30, forearm: 25 },
      },
    ]);
    expect(events[0]?.values.total_circumference).toBeUndefined();
    expect(events[1]?.values.total_circumference).toBe(365);
  });
  it("keeps missing values out of trends and uses the last weekly reading", () => {
    const events = [
      { id: "a", takenAt: "2026-10-26T12:00:00Z", source: "coach", values: { weight: 70 } },
      { id: "b", takenAt: "2026-10-27T12:00:00Z", source: "coach", values: { weight: 72 } },
      { id: "c", takenAt: "2026-11-02T12:00:00Z", source: "coach", values: { weight: 74 } },
    ];
    expect(pointsFor(events, "waist")).toEqual([]);
    expect(weeklyPoints(events, "weight").map((p) => p.change)).toEqual([2, 4]);
    expect(swapChart(["weight", "mood", "waist"], 0, "waist")).toEqual(["waist", "mood", "weight"]);
  });
});
