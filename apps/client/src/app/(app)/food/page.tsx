"use client";
import { useQuery } from "@tanstack/react-query";
import { Page } from "@traiv/ui/components/shell/page";
import { Button } from "@traiv/ui/components/button";
import { Carbs, Fat, Protein, Salad } from "@traiv/ui/icons";
import { http } from "@/lib/api/client";
import { useActiveStudio } from "@/lib/query";

type PublishedPlan = {
  id: string;
  document: {
    settings: { name: string; description: string; calorieTarget: number };
    slots: {
      id: string;
      name: string;
      options: {
        id: string;
        name: string;
        imageUrl: string | null;
        steps: string[];
        ingredients: {
          ingredientId: string;
          name: string;
          quantity: number;
          unit: string;
          preparationNote: string | null;
        }[];
        nutrition: { kcal: number; proteinG: number; carbsG: number; fatG: number };
      }[];
    }[];
  };
};
export default function FoodPage() {
  const { studioId } = useActiveStudio();
  const query = useQuery({
    queryKey: ["published-mealplans", studioId],
    queryFn: async () => (await http.get<PublishedPlan[]>(`/c/${studioId}/mealplans`)).data,
    enabled: Boolean(studioId),
  });
  return (
    <Page className="max-w-3xl gap-5 pb-24">
      <header>
        <h1 className="text-display font-medium">Food</h1>
        <p className="mt-2 text-body-sm text-fg-muted">Your coach’s published meal plans</p>
      </header>
      {query.isPending ? (
        <p className="text-body-sm text-fg-muted">Loading your meal plan…</p>
      ) : query.isError ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-body-sm text-danger">Couldn't load your meal plan.</p>
          <Button variant="outline" onClick={() => query.refetch()}>
            Try again
          </Button>
        </div>
      ) : !query.data.length ? (
        <div className="rounded-surface border border-line p-6">
          <Salad className="mb-3 size-8 text-fg-subtle" />
          <p className="text-body-sm text-fg-muted">
            Your coach hasn't published a meal plan for you yet.
          </p>
        </div>
      ) : (
        query.data.map((plan) => (
          <section key={plan.id} className="flex min-w-0 flex-col gap-5">
            <header className="rounded-surface border border-line bg-surface p-5">
              <h2 className="text-subheading font-semibold">{plan.document.settings.name}</h2>
              <p className="mt-2 text-body-sm text-fg-muted">
                Daily target: {plan.document.settings.calorieTarget.toLocaleString()} kcal. Choose
                one recipe for each meal.
              </p>
              {plan.document.settings.description ? (
                <p className="mt-3 whitespace-pre-wrap text-body-sm">
                  {plan.document.settings.description}
                </p>
              ) : null}
            </header>
            {plan.document.slots.map((slot) => (
              <section key={slot.id} className="flex flex-col gap-3">
                <h3 className="text-body font-semibold">{slot.name}</h3>
                {slot.options.map((option) => (
                  <details
                    key={option.id}
                    className="overflow-hidden rounded-surface border border-line bg-surface"
                  >
                    <summary className="flex cursor-pointer items-center gap-3 p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-focus">
                      {option.imageUrl ? (
                        <img
                          src={option.imageUrl}
                          alt=""
                          className="size-16 shrink-0 rounded-control object-cover"
                        />
                      ) : null}
                      <span className="min-w-0">
                        <span className="block text-body-sm font-semibold">{option.name}</span>
                        <span className="mt-1 block text-caption text-fg-muted">
                          {option.nutrition.kcal} kcal
                        </span>
                        <span className="mt-2 flex flex-wrap gap-3 text-caption">
                          <span className="flex items-center gap-1">
                            <Protein className="size-4 text-macro-protein" />
                            {option.nutrition.proteinG} g
                          </span>
                          <span className="flex items-center gap-1">
                            <Carbs className="size-4 text-macro-carbs" />
                            {option.nutrition.carbsG} g
                          </span>
                          <span className="flex items-center gap-1">
                            <Fat className="size-4 text-macro-fat" />
                            {option.nutrition.fatG} g
                          </span>
                        </span>
                      </span>
                    </summary>
                    <div className="flex flex-col gap-4 border-t border-line p-4">
                      <h4 className="text-body-sm font-semibold">Ingredients</h4>
                      <ul className="space-y-2 text-body-sm">
                        {option.ingredients.map((line, index) => (
                          <li
                            key={`${line.ingredientId}:${index}`}
                            className="flex justify-between gap-3"
                          >
                            <span>
                              {line.name}
                              {line.preparationNote ? ` — ${line.preparationNote}` : ""}
                            </span>
                            <span className="shrink-0 tabular-nums text-fg-muted">
                              {Math.round(line.quantity * 100) / 100} {line.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <details>
                        <summary className="cursor-pointer text-body-sm font-medium">
                          Show steps
                        </summary>
                        {option.steps.length ? (
                          <ol className="mt-3 list-inside list-decimal space-y-3 text-body-sm text-fg-muted">
                            {option.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-3 text-body-sm text-fg-muted">
                            No preparation steps provided.
                          </p>
                        )}
                      </details>
                    </div>
                  </details>
                ))}
              </section>
            ))}
          </section>
        ))
      )}
    </Page>
  );
}
