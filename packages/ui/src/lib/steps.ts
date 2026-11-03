export type StepsData = {
  days: { date: string; count: number; updatedAt: string }[];
  goals: { effectiveOn: string; count: number }[];
  defaultGoal: number;
  profile?: { heightCm: number | null } | null;
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function weekDates(day: string, offset = 0) {
  const d = new Date(day + "T12:00:00");
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const next = new Date(d);
    next.setDate(d.getDate() + i);
    return localDay(next);
  });
}
export function goalFor(data: StepsData, date: string) {
  return (
    [...data.goals]
      .sort((a, b) => b.effectiveOn.localeCompare(a.effectiveOn))
      .find((g) => g.effectiveOn <= date)?.count ?? data.defaultGoal
  );
}
