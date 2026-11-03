import { z } from "zod";
import { stepsDate, stepsWrite } from "../client/steps-validation.js";
export const measurementFields = [
  { code: "weight", name: "Weight", unit: "kg", group: "Weight & body composition" },
  ...["waist", "hips", "chest", "thigh", "arm", "forearm"].map((code) => ({
    code,
    name: code === "hips" ? "Hip" : code[0]!.toUpperCase() + code.slice(1),
    unit: "cm",
    group: "Circumference",
  })),
  ...["energy", "mood", "nutrition", "progress", "sleep_quality"].map((code) => ({
    code,
    name: code === "sleep_quality" ? "Sleep" : code[0]!.toUpperCase() + code.slice(1),
    unit: "1–5",
    group: "Other measurements",
  })),
];
const shape = Object.fromEntries(
  measurementFields.map((f) => [
    f.code,
    (f.code === "weight"
      ? z.number().min(25).max(400)
      : f.unit === "cm"
        ? z.number().positive().max(500)
        : z.number().int().min(1).max(5)
    ).optional(),
  ]),
);
export const measurementWrite = z.object({
  id: z.string().uuid(),
  date: stepsDate,
  timeZone: stepsWrite.shape.timeZone,
  values: z
    .object(shape)
    .strict()
    .refine((v) => Object.values(v).some((n) => n !== undefined), "Enter at least one measurement"),
});
export const measurementPeriod = z
  .object({ from: stepsDate, to: stepsDate })
  .refine(
    (v) => v.from <= v.to && (Date.parse(v.to) - Date.parse(v.from)) / 86400000 <= 366,
    "Choose a date range of up to one year",
  );
export type MeasurementEvent = {
  id: string;
  takenAt: string;
  source: string;
  values: Record<string, number>;
};
/** Only complete circumference sets are summed; missing limbs must not look like weight loss. */
export function withCircumference(events: MeasurementEvent[]) {
  const parts = measurementFields.filter((f) => f.unit === "cm").map((f) => f.code);
  return events.map((e) => ({
    ...e,
    values: {
      ...e.values,
      ...(parts.every((key) => Number.isFinite(e.values[key]))
        ? { total_circumference: parts.reduce((sum, key) => sum + e.values[key]!, 0) }
        : {}),
    },
  }));
}
