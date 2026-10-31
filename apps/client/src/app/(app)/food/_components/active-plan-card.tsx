import { Protein, Carbs, Fat } from "@traiv/ui/icons";
import type { PublishedPlan } from "@/lib/api/food";

export function ActivePlanCard({ plan, onOpen }: { plan: PublishedPlan; onOpen: () => void }) {
  const settings = plan.document.settings;
  const macros = [
    {
      name: "Protein",
      Icon: Protein,
      grams: (settings.calorieTarget * settings.proteinPct) / 400,
      color: "text-macro-protein",
    },
    {
      name: "Carbs",
      Icon: Carbs,
      grams: (settings.calorieTarget * settings.carbsPct) / 400,
      color: "text-macro-carbs",
    },
    {
      name: "Fat",
      Icon: Fat,
      grams: (settings.calorieTarget * settings.fatPct) / 900,
      color: "text-macro-fat",
    },
  ];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${settings.name}`}
      className="flex min-h-44 w-full flex-col justify-between rounded-3xl border border-line/20 p-4 text-left text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus sm:p-5"
      style={{
        backgroundImage:
          "linear-gradient(145deg, var(--signal), color-mix(in srgb, var(--signal) 45%, var(--contrast)) 55%, var(--contrast))",
      }}
    >
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-contrast/40 px-3 py-1 text-caption font-medium">
        <span className="size-1.5 rounded-full bg-signal-text" />
        Active
      </span>
      <span className="mt-10 flex items-end justify-between gap-3">
        <span className="min-w-0 flex-1">
          <span className="mb-3 block text-body font-semibold leading-snug sm:text-subheading">
            {settings.name}
          </span>
          <span className="flex flex-wrap gap-1.5">
            {macros.map(({ name, Icon, grams, color }) => (
              <span
                key={name}
                aria-label={`${name}: ${Math.round(grams)} grams`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-contrast/60 px-2 py-1 text-caption font-medium tabular-nums"
              >
                <Icon className={`size-3.5 ${color}`} />
                {Math.round(grams)}g
              </span>
            ))}
          </span>
        </span>
        <span className="shrink-0 pb-0.5 text-right">
          <span className="block text-heading font-semibold tabular-nums">
            {settings.calorieTarget.toLocaleString()}
          </span>
          <span className="mt-1 block text-caption uppercase text-white/75">Kcal</span>
        </span>
      </span>
    </button>
  );
}
