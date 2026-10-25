/**
 * Check-in dates are plain `YYYY-MM-DD` strings, never instants — a check-in is due on a
 * *day*, and a day is not a moment. Parsing one as local time is how "due Monday" renders
 * as Sunday for half of India's evening, so these are pinned to UTC on the way in and out.
 */

const parse = (day: string) => new Date(`${day}T00:00:00Z`);

export const longDate = (day: string) =>
  parse(day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

export const shortDate = (day: string) =>
  parse(day).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

export const today = (): string => new Date().toISOString().slice(0, 10);

/**
 * "Today", "Tomorrow", "Yesterday", then a date.
 *
 * Worth the branches: "due today" is read in a glance where "due Mon 27 Oct" needs the
 * reader to work out what today is first.
 */
export function relativeDay(day: string): string {
  const diff = Math.round((parse(day).getTime() - parse(today()).getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return longDate(day);
}

/** Whole days from `day` until today, negative when `day` is in the future. */
export const daysAgo = (day: string): number =>
  Math.round((parse(today()).getTime() - parse(day).getTime()) / 86_400_000);
