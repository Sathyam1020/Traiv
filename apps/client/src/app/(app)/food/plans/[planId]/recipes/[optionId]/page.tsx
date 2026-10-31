"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Minus, Star, ShoppingBasket, Salad } from "@traiv/ui/icons";
import { Button } from "@traiv/ui/components/button";
import { foodApi, localDay, slots, type FoodItem, type Slot } from "@/lib/api/food";
import { useActiveStudio } from "@/lib/query";
import { Logger } from "../../../../_components/logger";
import { ErrorText, Macros } from "../../../../_components/common";

export default function PlanRecipePage() {
  const { planId, optionId } = useParams<{ planId: string; optionId: string }>();
  const { studioId } = useActiveStudio();
  const studio = studioId ?? "";
  const api = foodApi(studio);
  const qc = useQueryClient();
  const [date, setDate] = useState(localDay);
  const [slot, setSlot] = useState<Slot>("breakfast");
  const [portions, setPortions] = useState(1);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [shopping, setShopping] = useState(false);
  const shoppingIds = useRef(new Map<number, string>());
  const [addedPortions, setAddedPortions] = useState<number | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const day = params.get("date");
    if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) setDate(day);
    const meal = params.get("meal");
    setSlot(slots.find((s) => s === meal) ?? "breakfast");
  }, []);
  const query = useQuery({
    queryKey: ["plan-recipe", studio, planId, optionId],
    queryFn: () =>
      api.get<FoodItem>(`/items/plan/${optionId}?planId=${encodeURIComponent(planId)}`),
    enabled: Boolean(studio),
  });
  const favorites = useQuery({
    queryKey: ["food-favorites", studio],
    queryFn: () => api.get<{ kind: string; resourceId: string }[]>("/favorites"),
    enabled: Boolean(studio),
  });
  const item = query.data;
  const favorite =
    favorites.data?.some((f) => f.kind === "recipe" && f.resourceId === item?.recipeId) ?? false;
  const back = `/food/plans/${planId}?date=${date}`;
  async function toggleFavorite() {
    if (!item?.recipeId) return;
    try {
      await api.put("/favorites", { kind: "recipe", id: item.recipeId, favorite: !favorite });
      await favorites.refetch();
    } catch (cause) {
      setError(cause);
    }
  }
  async function addShopping() {
    if (!item || shopping) return;
    setShopping(true);
    try {
      const operationId = shoppingIds.current.get(portions) ?? crypto.randomUUID();
      shoppingIds.current.set(portions, operationId);
      await api.post("/shopping/recipe", {
        kind: "plan",
        id: item.id,
        planId,
        servings: portions,
        operationId,
      });
      setAddedPortions(portions);
      void qc.invalidateQueries({ queryKey: ["food-shopping", studio] });
    } catch (cause) {
      setError(cause);
    } finally {
      setShopping(false);
    }
  }
  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(12rem+env(safe-area-inset-bottom))]">
        <div className="relative h-64 bg-sunken sm:h-80">
          {item?.imageUrl ? (
            <img src={item.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <Salad className="absolute top-1/2 left-1/2 size-12 -translate-1/2 text-fg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/40" />
          <div className="absolute inset-x-4 top-5 flex justify-between text-white">
            <Link
              href={back}
              aria-label="Back to meal plan"
              className="flex size-11 items-center justify-center rounded-2xl bg-black/35"
            >
              <ArrowLeft className="size-6" />
            </Link>
            <div className="flex gap-2">
              <button
                aria-label="Log this meal"
                onClick={() => setLogging(true)}
                disabled={!item}
                className="flex size-11 items-center justify-center rounded-2xl bg-black/35"
              >
                <Plus className="size-6" />
              </button>
              <button
                aria-label={favorite ? "Remove favorite" : "Favorite recipe"}
                aria-pressed={favorite}
                onClick={toggleFavorite}
                disabled={!item?.recipeId}
                className="flex size-11 items-center justify-center rounded-2xl bg-black/35"
              >
                <Star className={`size-6 ${favorite ? "fill-current text-signal-text" : ""}`} />
              </button>
            </div>
          </div>
        </div>
        <article className="relative -mt-5 space-y-5 rounded-t-3xl bg-panel px-4 pt-4 sm:px-6">
          <div aria-hidden className="mx-auto h-1 w-9 rounded-full bg-line-strong" />
          <ErrorText error={query.error ?? error} />
          {!item ? (
            <p className="py-8 text-fg-muted">
              {query.isPending ? "Loading recipe…" : "Recipe unavailable."}
            </p>
          ) : (
            <>
              <p className="text-body-sm capitalize text-fg-muted">
                {slot}
                {item.difficulty ? ` · ${item.difficulty}` : ""}
                {item.minutes ? ` · ${item.minutes} min` : ""}
              </p>
              <h1 className="text-heading font-semibold leading-tight">{item.name}</h1>
              {item.description ? (
                <p className="text-body-sm text-fg-muted">{item.description}</p>
              ) : null}
              <div className="grid grid-cols-4 gap-2 rounded-3xl border border-line bg-surface px-3 py-5 text-center">
                <div>
                  <strong className="block text-heading">{Math.round(item.kcal * portions)}</strong>
                  <span className="text-[10px] text-fg-muted">
                    KCAL / {portions === 1 ? "SERVING" : "TOTAL"}
                  </span>
                </div>
                {[
                  { name: "Protein", value: item.proteinG, color: "text-macro-protein" },
                  { name: "Carbs", value: item.carbsG, color: "text-macro-carbs" },
                  { name: "Fat", value: item.fatG, color: "text-macro-fat" },
                ].map((m) => (
                  <div key={m.name} className="self-center">
                    <strong className="block text-body font-semibold">
                      {Math.round(m.value * portions)}g
                    </strong>
                    <span className={`text-caption ${m.color}`}>{m.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Decrease portions"
                  disabled={portions <= 0.25}
                  onClick={() => setPortions((p) => Math.max(0.25, p - 0.25))}
                >
                  <Minus className="size-5" />
                </Button>
                <span>
                  <strong className="mr-2 text-heading">{portions}</strong>
                  <span className="text-fg-muted">{portions === 1 ? "portion" : "portions"}</span>
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Increase portions"
                  onClick={() => setPortions((p) => p + 0.25)}
                >
                  <Plus className="size-5" />
                </Button>
              </div>
              <section>
                <h2 className="mb-3 text-body font-semibold">Ingredients</h2>
                <div className="space-y-2">
                  {item.ingredients.map((ingredient, index) => {
                    const factor = (ingredient.grams * portions) / 100;
                    return (
                      <div
                        key={`${ingredient.id}:${index}`}
                        className="rounded-2xl border border-line bg-surface p-3"
                      >
                        <div className="flex justify-between gap-3 text-body-sm font-semibold">
                          <span>{ingredient.name}</span>
                          <span className="shrink-0">
                            {Math.round(ingredient.grams * portions * 10) / 10} g
                          </span>
                        </div>
                        {ingredient.nutrition ? (
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <Macros
                              value={{
                                kcal: ingredient.nutrition.kcal * factor,
                                proteinG: ingredient.nutrition.proteinG * factor,
                                carbsG: ingredient.nutrition.carbsG * factor,
                                fatG: ingredient.nutrition.fatG * factor,
                              }}
                            />
                            <span className="text-caption text-fg-muted">
                              {Math.round(ingredient.nutrition.kcal * factor)} kcal
                            </span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
              <section>
                <h2 className="mb-3 text-body font-semibold">Instructions</h2>
                <ol className="space-y-2">
                  {item.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-2xl border border-line bg-surface p-3 text-body-sm"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-sunken text-fg-muted">
                        {index + 1}
                      </span>
                      <span className="self-center">{step}</span>
                    </li>
                  ))}
                </ol>
                {!item.steps.length ? (
                  <p className="text-body-sm text-fg-muted">No instructions provided.</p>
                ) : null}
              </section>
            </>
          )}
        </article>
      </div>
      {item ? (
        <div className="absolute inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] flex gap-3 lg:bottom-5">
          <Button
            variant="outline"
            aria-label="Add ingredients to shopping list"
            disabled={shopping || addedPortions === portions}
            onClick={addShopping}
            className="size-14 shrink-0 rounded-full bg-surface text-signal-text"
          >
            <ShoppingBasket className="size-6" />
          </Button>
          <Button
            onClick={() => setLogging(true)}
            className="h-14 flex-1 rounded-full bg-signal text-signal-fg hover:bg-signal/90"
          >
            <Plus className="size-5" />
            Log this meal
          </Button>
        </div>
      ) : null}
      {addedPortions === portions ? (
        <span role="status" className="sr-only">
          Added to shopping list
        </span>
      ) : null}
      {logging && item ? (
        <Logger
          studio={studio}
          item={item}
          date={date}
          slot={slot}
          initialQuantity={portions}
          onClose={() => setLogging(false)}
          onSaved={() => {
            void qc.invalidateQueries({ queryKey: ["food-diary", studio] });
          }}
        />
      ) : null}
    </div>
  );
}
