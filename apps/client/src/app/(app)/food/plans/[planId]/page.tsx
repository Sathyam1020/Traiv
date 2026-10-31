"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@traiv/ui/components/tabs";
import { ArrowLeft, Protein, Carbs, Fat, Clock, Salad } from "@traiv/ui/icons";
import { http } from "@/lib/api/client";
import { localDay, slots, type PublishedPlan } from "@/lib/api/food";
import { useActiveStudio } from "@/lib/query";
import { ErrorText } from "../../_components/common";

export default function ClientMealPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const { studioId } = useActiveStudio();
  const studio = studioId ?? "";
  const [date, setDate] = useState(localDay);
  const [activeMeal, setActiveMeal] = useState("");
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("date");
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) setDate(value);
  }, []);
  const query = useQuery({
    queryKey: ["published-mealplans", studio],
    queryFn: async () => (await http.get<PublishedPlan[]>(`/c/${studio}/mealplans`)).data,
    enabled: Boolean(studio),
    refetchOnMount: "always",
  });
  const plan = query.data?.find((value) => value.id === planId);
  const back = `/food?date=${date}`;

  if (!plan)
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 p-5">
        <Button asChild variant="ghost">
          <Link href={back}>
            <ArrowLeft className="size-4" />
            Food
          </Link>
        </Button>
        {query.isPending ? (
          <p className="text-fg-muted">Loading meal plan…</p>
        ) : query.isError ? (
          <>
            <ErrorText error={query.error} />
            <Button onClick={() => query.refetch()}>Try again</Button>
          </>
        ) : (
          <p className="text-fg-muted">This meal plan is no longer available.</p>
        )}
      </div>
    );

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
    <div
      className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(145deg, var(--signal), color-mix(in srgb, var(--signal) 45%, var(--contrast)) 70%, var(--contrast))",
      }}
    >
      <header className="shrink-0 px-4 pt-5 pb-8 text-white sm:px-6">
        <Link
          href={back}
          aria-label="Back to food"
          className="flex size-10 items-center justify-center rounded-control bg-white/15 transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="mt-12 text-heading font-semibold leading-tight">{settings.name}</h1>
        <div className="mt-3 flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-contrast/50 px-3 py-1.5 text-caption font-medium tabular-nums">
          <span>{settings.calorieTarget.toLocaleString()} kcal</span>
          {macros.map(({ name, Icon, grams, color }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5"
              aria-label={`${name}: ${Math.round(grams)} grams`}
            >
              <span aria-hidden="true" className="text-white/50">
                ·
              </span>
              <Icon className={`size-3.5 ${color}`} />
              <span>{Math.round(grams)}g</span>
            </span>
          ))}
        </div>
      </header>
      {plan.document.slots.length ? (
        <Tabs
          value={activeMeal || plan.document.slots[0]?.id}
          onValueChange={setActiveMeal}
          className="min-h-0 flex-1 gap-0 overflow-hidden rounded-t-3xl bg-panel"
        >
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-line-strong"
          />
          <div className="shrink-0 overflow-x-auto border-b border-line px-4 pt-3 sm:px-6">
            <TabsList
              variant="line"
              className="justify-start p-0 group-data-[orientation=horizontal]/tabs:h-12"
            >
              {plan.document.slots.map((meal) => (
                <TabsTrigger
                  key={meal.id}
                  value={meal.id}
                  style={
                    (activeMeal || plan.document.slots[0]?.id) === meal.id
                      ? { color: "var(--signal)", borderBottomColor: "var(--signal)" }
                      : undefined
                  }
                  className="shrink-0 rounded-none border-0 border-b-2 border-transparent px-3 font-medium after:hidden data-[state=active]:border-signal data-[state=active]:text-signal-text"
                >
                  {meal.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {plan.document.slots.map((meal) => (
            <TabsContent
              key={meal.id}
              value={meal.id}
              className="min-h-0 overflow-y-auto overscroll-contain px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6"
            >
              <div className="grid grid-cols-2 items-stretch gap-3">
                {meal.options.map((option) => (
                  <Link
                    key={option.id}
                    href={`/food/plans/${planId}/recipes/${option.id}?date=${date}&meal=${slots.find((value) => meal.name.toLowerCase().includes(value)) ?? "snacks"}`}
                    className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-line bg-surface p-1.5 text-left transition-colors hover:border-line-strong disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-line-focus"
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-sunken">
                      {option.imageUrl ? (
                        <img src={option.imageUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Salad className="size-8 text-fg-subtle" />
                        </div>
                      )}
                      {option.minutes !== null &&
                      option.minutes !== undefined &&
                      option.minutes > 0 ? (
                        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-contrast/70 px-2 py-1 text-caption font-medium text-white">
                          <Clock className="size-3.5" />
                          {option.minutes} min
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col px-1.5 pt-2 pb-2">
                      <h2 className="line-clamp-2 text-body-sm font-semibold leading-snug">
                        {option.name}
                      </h2>
                      <p className="mt-1.5 text-caption tabular-nums text-fg-muted">
                        {option.nutrition.kcal} kcal · {Math.round(option.nutrition.proteinG)}g
                        protein
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {!meal.options.length ? (
                <p className="py-8 text-body-sm text-fg-muted">No recipes in this meal yet.</p>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex-1 rounded-t-3xl bg-panel p-6 text-body-sm text-fg-muted">
          No meals in this plan yet.
        </div>
      )}
    </div>
  );
}
