import { Carbs, Fat, Protein } from "@traiv/ui/icons";
import type { Nutrients } from "@/lib/api/nutrition";
import { MICROS } from "./controls";
export function NutrientSummary({
  nutrition,
  servings,
}: {
  nutrition: Nutrients;
  servings?: number;
}) {
  const total = nutrition.proteinG * 4 + nutrition.carbsG * 4 + nutrition.fatG * 9;
  return (
    <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5">
      <div>
        <h2 className="flex items-center gap-2 font-semibold">
          <Carbs className="size-5" />
          Nutrients
        </h2>
        <p className="text-caption text-fg-subtle">
          Per serving
          {servings ? ` · ${servings} ${servings === 1 ? "serving" : "servings"} in recipe` : ""}
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-64">
        <svg
          viewBox="0 0 120 74"
          className="w-full"
          role="img"
          aria-label="Share of calories from protein, carbs and fat"
        >
          <title>Macro split per serving</title>
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            pathLength="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            className="text-line"
          />
          {(
            [
              ["proteinG", 4, "text-signal"],
              ["carbsG", 4, "text-fg-muted"],
              ["fatG", 9, "text-fg-subtle"],
            ] as const
          ).map(([key, multiplier, color], index) => {
            const values = [nutrition.proteinG * 4, nutrition.carbsG * 4, nutrition.fatG * 9];
            const width = total ? ((nutrition[key] * multiplier) / total) * 100 : 0;
            const offset = total
              ? (values.slice(0, index).reduce((a, b) => a + b, 0) / total) * 100
              : 0;
            return (
              <path
                key={key}
                d="M 10 60 A 50 50 0 0 1 110 60"
                pathLength="100"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={`${width} ${100 - width}`}
                strokeDashoffset={-offset}
                className={color}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <span className="text-heading font-medium tabular-nums">
            {nutrition.kcal}
            <span className="ml-1 text-caption text-fg-muted">kcal</span>
          </span>
          <span className="text-caption text-fg-subtle">per serving</span>
        </div>
      </div>
      {(
        [
          ["proteinG", "Protein", Protein],
          ["carbsG", "Carbs", Carbs],
          ["fatG", "Fat", Fat],
        ] as const
      ).map(([key, label, Icon]) => (
        <div key={key} className="flex items-center gap-3 text-body-sm">
          <span className="flex size-9 items-center justify-center rounded-control bg-sunken">
            <Icon className="size-5" />
          </span>
          <span className="flex-1 text-fg-muted">{label}</span>
          <span className="font-medium tabular-nums">{nutrition[key]} g</span>
        </div>
      ))}
      <details className="border-t border-line pt-4">
        <summary className="cursor-pointer py-2 text-body-sm font-medium text-fg-muted">
          Micronutrients
        </summary>
        <dl className="mt-3 flex flex-col gap-2">
          {Object.entries(nutrition.micronutrients).length ? (
            Object.entries(nutrition.micronutrients).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 text-caption">
                <dt>{MICROS[k] ?? k}</dt>
                <dd className="tabular-nums">{v}</dd>
              </div>
            ))
          ) : (
            <p className="text-caption text-fg-subtle">No micronutrient data available.</p>
          )}
        </dl>
      </details>
    </section>
  );
}
