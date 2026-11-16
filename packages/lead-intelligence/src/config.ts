import { readFileSync } from "node:fs";
import { z } from "zod";
import { defaultWeights } from "./domain.ts";
export const configSchema = z.object({
  localities: z.array(z.string().min(1)).min(1),
  gymTerms: z.array(z.string().min(1)).min(1),
  coachTerms: z.array(z.string().min(1)).min(1),
  cities: z.array(z.string().min(1)).min(1),
  weights: z
    .record(z.string(), z.number().nonnegative())
    .refine(
      (v) =>
        Object.keys(defaultWeights).every((k) => k in v) &&
        Object.keys(v).length === 8 &&
        Object.values(v).reduce((a, b) => a + b, 0) === 100,
      "All eight weights must sum to 100",
    ),
});
export const config = configSchema.parse(
  JSON.parse(readFileSync(new URL("../config.json", import.meta.url), "utf8")),
);
export const env = z
  .object({
    LEADS_DB: z.string().default("data/leads.sqlite"),
    BRAVE_API_KEY: z.string().optional(),
    BRAVE_STORAGE_ALLOWED: z.enum(["true", "false"]).default("false"),
    GOOGLE_ACCESS_TOKEN: z.string().optional(),
    GOOGLE_SERVICE_ACCOUNT_FILE: z.string().optional(),
    GOOGLE_SPREADSHEET_ID: z.string().optional(),
  })
  .parse(process.env);
