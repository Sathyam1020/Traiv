import { Carbs, Fat, Protein } from "@traiv/ui/icons";
import type { Nutrients } from "@/lib/api/nutrition";

/** Percentages are energy shares (4/4/9), not the proportions of macro grams. */
export function MacroBars({
  nutrition,
  compact = false,
}: {
  nutrition: Nutrients;
  compact?: boolean;
}) {
  const total = nutrition.proteinG * 4 + nutrition.carbsG * 4 + nutrition.fatG * 9;
  const macros = [
    { key: "proteinG", label: "Protein", energy: 4, Icon: Protein },
    { key: "carbsG", label: "Carbs", energy: 4, Icon: Carbs },
    { key: "fatG", label: "Fat", energy: 9, Icon: Fat },
  ] as const;
  return (
    <div className={compact ? "grid grid-cols-1 gap-2 sm:grid-cols-3" : "flex flex-col gap-1"}>
      {macros.map(({ key, label, energy, Icon }) => {
        const percent = total ? Math.round(((nutrition[key] * energy) / total) * 100) : 0;
        return (
          <div
            key={key}
            className="relative isolate overflow-hidden rounded-control bg-sunken"
            title={`${nutrition[key]} g · ${percent}% of macro calories`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 -z-10 bg-line"
              style={{ width: `${percent}%` }}
            />
            <div className="flex min-h-7 items-center justify-between gap-2 px-2 py-1 text-caption text-fg-muted">
              <span className="flex min-w-0 items-center gap-1.5">
                <Icon className="size-4 shrink-0 text-fg" />
                <span>{label}</span>
              </span>
              <span className="shrink-0 font-medium tabular-nums">{percent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
