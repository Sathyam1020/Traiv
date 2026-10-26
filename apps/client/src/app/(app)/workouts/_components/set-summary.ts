import type { FieldName, PrescribedSet } from "@/lib/api";

/**
 * "3 sets · 8–10 reps · 60s rest" — the prescribed-set summary shown everywhere a
 * workout lists its exercises without expanding them. Reads from the first set, which
 * is what "sets 3 / weight 100 / rep range 8-10" means when every set is the same — the
 * common case a coach builds from.
 */
export function formatSetSummary(fields: FieldName[], sets: PrescribedSet[]) {
  const lead = sets[0];
  const parts = [`${sets.length} set${sets.length === 1 ? "" : "s"}`];

  if (fields.includes("rep_range") && lead) {
    parts.push(`${lead.reps ?? "—"}–${lead.repsMax ?? "—"} reps`);
  } else if (fields.includes("reps") && lead?.reps != null) {
    parts.push(`${lead.reps} reps`);
  }
  if (fields.includes("weight") && lead?.weightKg != null) parts.push(`${lead.weightKg} kg`);
  if (fields.includes("duration") && lead?.seconds != null) parts.push(`${lead.seconds}s`);
  if (fields.includes("distance") && lead?.distanceM != null) parts.push(`${lead.distanceM}m`);
  if (fields.includes("rest") && lead?.restSeconds != null) parts.push(`${lead.restSeconds}s rest`);

  return parts;
}
