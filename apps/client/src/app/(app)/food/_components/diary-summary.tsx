import type { Nutrients } from "@/lib/api/food";

export function DiarySummary({ total, target }: { total: Nutrients; target: Nutrients | null }) {
  return (
    <section
      aria-label="Daily nutrition summary"
      className="rounded-3xl border border-line bg-surface px-4 py-5 sm:px-5"
    >
      <div className="pb-5 text-center">
        <p className="text-body-sm text-fg-muted">Calories</p>
        <p className="mt-2 text-display font-semibold tabular-nums">
          {total.kcal.toLocaleString()}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-line pt-4">
        {(
          [
            { key: "proteinG", name: "Protein", color: "text-macro-protein" },
            { key: "carbsG", name: "Carbs", color: "text-macro-carbs" },
            { key: "fatG", name: "Fat", color: "text-macro-fat" },
          ] as const
        ).map(({ key, name, color }) => {
          const goal = target?.[key] ?? 0;
          const progress = goal > 0 ? Math.min(100, Math.max(0, (total[key] / goal) * 100)) : 0;
          return (
            <div key={key} className="flex min-w-0 items-center justify-center gap-2">
              <svg
                viewBox="0 0 40 40"
                className="size-8 shrink-0 -rotate-90"
                role="img"
                aria-label={
                  goal > 0
                    ? `${name}: ${total[key]} of ${goal} grams, ${Math.round(progress)}% of daily target`
                    : `${name}: ${total[key]} grams, no daily target set`
                }
              >
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  className="stroke-line"
                  strokeWidth="5"
                />
                {progress > 0 ? (
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    className={`${color} transition-[stroke-dasharray] duration-300 motion-reduce:transition-none`}
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray={`${progress} 100`}
                  />
                ) : null}
              </svg>
              <div className="min-w-0 text-left">
                <p className="text-body-sm font-semibold">{name}</p>
                <p className="text-caption tabular-nums text-fg-muted">
                  {Math.round(total[key] * 10) / 10}g
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
