import { describe, expect, it } from "vitest";
import { diaryWeek } from "./diary-week.js";
describe("weekly food diary", () => {
  it("includes Monday and Sunday across a month boundary and retains empty dates", () => {
    const days = diaryWeek("2026-10-29", [], () => null);
    expect(days.map((d) => d.date)).toEqual([
      "2026-10-26",
      "2026-10-27",
      "2026-10-28",
      "2026-10-29",
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
    ]);
    expect(
      days.every((d) => d.entries.length === 0 && d.total.kcal === 0 && d.target === null),
    ).toBe(true);
  });
  it("totals only the day's snapshots and resolves distinct daily targets", () => {
    const entry = (date: string, kcal: number) => ({
      date,
      kcal,
      proteinG: 3.5,
      carbsG: 7,
      fatG: 2,
    });
    const days = diaryWeek(
      "2026-10-29",
      [
        entry("2026-10-26", 100),
        entry("2026-10-26", 200),
        entry("2026-11-01", 400),
        entry("2026-11-02", 900),
      ],
      (date) => (date.endsWith("01") ? { kcal: 1800 } : { kcal: 2000 }),
    );
    expect(days[0]?.total).toEqual({ kcal: 300, proteinG: 7, carbsG: 14, fatG: 4 });
    expect(days[6]?.total.kcal).toBe(400);
    expect(days[6]?.target.kcal).toBe(1800);
    expect(days.reduce((n, d) => n + d.total.kcal, 0)).toBe(700);
  });
});
