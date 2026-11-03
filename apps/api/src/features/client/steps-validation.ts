import { z } from "zod";
export const stepsDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
    "Enter a valid calendar date",
  );
export const stepsPeriod = z
  .object({ start: stepsDate, end: stepsDate })
  .refine(
    (v) => v.start <= v.end && (Date.parse(v.end) - Date.parse(v.start)) / 86400000 <= 366,
    "Select a date range of up to one year",
  );
export const stepsWrite = z.object({
  date: stepsDate,
  count: z.number().int().min(0).max(200000),
  timeZone: z
    .string()
    .max(100)
    .default("UTC")
    .refine((v) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: v });
        return true;
      } catch {
        return false;
      }
    }, "Invalid timezone"),
});
export function isFutureStepDate(date: string, timeZone: string, now = new Date()) {
  return date > now.toLocaleDateString("en-CA", { timeZone });
}
