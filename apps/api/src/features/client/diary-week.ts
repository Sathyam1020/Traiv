type Nutrition = { kcal: number; proteinG: number; carbsG: number; fatG: number };
/** Inclusive, calendar-day grouping. Empty dates stay present, and targets resolve per date. */
export function diaryWeek<Entry extends Nutrition & { date: string }, Target>(
  center: string,
  entries: Entry[],
  targetFor: (date: string) => Target,
) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(`${center}T12:00:00Z`);
    day.setUTCDate(day.getUTCDate() + index - 3);
    const date = day.toISOString().slice(0, 10);
    const dayEntries = entries.filter((entry) => entry.date === date);
    return {
      date,
      entries: dayEntries,
      target: targetFor(date),
      total: dayEntries.reduce(
        (sum, entry) => ({
          kcal: sum.kcal + entry.kcal,
          proteinG: sum.proteinG + entry.proteinG,
          carbsG: sum.carbsG + entry.carbsG,
          fatG: sum.fatG + entry.fatG,
        }),
        { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
      ),
    };
  });
}
