export type MeasurementField = { code: string; name: string; unit: string; group: string };
export type MeasurementEvent = {
  id: string;
  takenAt: string;
  source: string;
  values: Record<string, number>;
};
export function pointsFor(entries: MeasurementEvent[], code: string) {
  return entries
    .flatMap((event) =>
      Number.isFinite(event.values[code]) ? [{ ...event, value: event.values[code]! }] : [],
    )
    .sort((a, b) => a.takenAt.localeCompare(b.takenAt));
}
export function monday(date: string) {
  const d = new Date(date.slice(0, 10) + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
export function weeklyPoints(entries: MeasurementEvent[], code: string) {
  const points = pointsFor(entries, code);
  const first = points[0]?.value;
  const groups = new Map<string, (typeof points)[number]>();
  for (const point of points) groups.set(monday(point.takenAt), point);
  return [...groups].map(([week, point]) => ({
    week,
    value: point.value,
    change: point.value - (first ?? point.value),
  }));
}
export function swapChart(charts: string[], index: number, code: string) {
  const next = [...charts],
    existing = next.indexOf(code);
  if (existing !== -1) next[existing] = next[index]!;
  next[index] = code;
  return next;
}
