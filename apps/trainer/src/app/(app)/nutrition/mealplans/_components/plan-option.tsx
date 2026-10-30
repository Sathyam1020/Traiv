"use client";
import {
  optionConflicts,
  optionNutrition,
  type PlanOption,
  type PlanSettings,
  type PlanSlot,
  type PlanIngredient,
} from "@traiv/nutrition/meal-plans";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Carbs,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash,
  Flame,
  ChevronLeft,
  ChevronRight,
  Copy,
  Fat,
  Lock,
  Protein,
  Salad,
  X,
} from "@traiv/ui/icons";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { nutritionApi } from "@/lib/api/nutrition";
import { Pick, LibraryError, LibraryLoading, Pagination } from "../../_components/controls";
import { RecipeSteps } from "../../_components/recipe-steps";
import { useIngredients } from "@/lib/query/use-nutrition";
import { gramsForUnit, recipeNutrition } from "@traiv/nutrition/recipes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@traiv/ui/components/sheet";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NutrientSummary } from "../../_components/nutrients";
export function PlanOptionCard({
  option,
  selected,
  settings,
  open,
  remove,
}: {
  option: PlanOption;
  selected: boolean;
  settings: PlanSettings;
  open: () => void;
  remove: () => void;
}) {
  const n = optionNutrition(option),
    original = optionNutrition(option, true);
  const conflicts = optionConflicts(option, settings);
  const tags = [...option.dietaryTags, ...option.allergenTags];
  return (
    <article
      className={`relative min-w-0 overflow-hidden rounded-surface border bg-surface ${selected ? "border-line-focus" : "border-line"}`}
    >
      <button
        type="button"
        onClick={open}
        aria-expanded={selected}
        className="flex h-full w-full flex-col gap-3 p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-focus"
      >
        <div className="relative w-full">
          {option.imageUrl ? (
            <img
              src={option.imageUrl}
              alt=""
              loading="lazy"
              className="aspect-video w-full rounded-control object-cover"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-control bg-sunken">
              <Salad className="size-8 text-fg-subtle" />
            </div>
          )}
          <span className="absolute top-2 left-2 flex max-w-full flex-wrap gap-1 pr-10">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-control bg-panel px-2 py-1 text-caption text-fg">
                {tag}
              </span>
            ))}
            {tags.length > 2 ? (
              <span className="rounded-control bg-panel px-2 py-1 text-caption">
                +{tags.length - 2}
              </span>
            ) : null}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
          <h3 className="line-clamp-2 text-body-sm font-semibold">{option.name}</h3>
          <p className="mt-auto text-body text-fg-muted">
            {n.kcal} kcal {option.locked ? <Lock className="ml-1 inline size-4" /> : null}
          </p>
          <div className="flex flex-wrap gap-2 text-caption tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Protein className="size-4 text-macro-protein" />
              {n.proteinG} g
            </span>
            <span className="inline-flex items-center gap-1">
              <Carbs className="size-4 text-macro-carbs" />
              {n.carbsG} g
            </span>
            <span className="inline-flex items-center gap-1">
              <Fat className="size-4 text-macro-fat" />
              {n.fatG} g
            </span>
          </div>
          {n.kcal !== original.kcal ? (
            <p className="text-caption text-fg-subtle">
              {n.kcal - original.kcal > 0 ? "+" : ""}
              {n.kcal - original.kcal} kcal from original
            </p>
          ) : null}
          {conflicts.length ? (
            <p className="text-caption text-danger">{conflicts.join(" · ")}</p>
          ) : null}
        </div>
      </button>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        aria-label={`Remove ${option.name}`}
        className="absolute top-4 right-4 rounded-full bg-panel"
        onClick={remove}
      >
        <X className="size-4" />
      </Button>
    </article>
  );
}
function PlanOptionEditor({
  option,
  studioId,
  change,
  expanded,
  toggle,
}: {
  option: PlanOption;
  studioId: string;
  change: (option: PlanOption) => void;
  expanded: boolean;
  toggle: () => void;
}) {
  const [stepsOpen, setStepsOpen] = useState(false);
  const [nutrientsOpen, setNutrientsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ingredients = useIngredients(studioId, { search, page, perPage: 10 });
  const reducedMotion = useReducedMotion();
  const [compare, setCompare] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const copyId = useRef<{ fingerprint: string; id: string } | null>(null);
  const qc = useQueryClient();
  const n = optionNutrition(option);
  return (
    <section className={`flex flex-col gap-5 rounded-surface border bg-panel p-4 sm:p-5 ${expanded ? "border-line-focus" : "border-line"}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-line-focus"
        >
          {option.imageUrl ? (
            <img
              src={option.imageUrl}
              alt=""
              className="size-20 shrink-0 rounded-control object-cover"
            />
          ) : null}
          <span className="flex flex-col gap-3">
            <span className="text-body font-semibold">{option.name}</span>
            <span className="flex flex-wrap gap-3 text-body-sm tabular-nums">
              <span className="flex items-center gap-1">
                <Flame className="size-4 text-macro-protein" />
                {n.kcal} kcal
              </span>
              <span className="flex items-center gap-1">
                <Protein className="size-4 text-macro-protein" />
                {n.proteinG} g
              </span>
              <span className="flex items-center gap-1">
                <Carbs className="size-4 text-macro-carbs" />
                {n.carbsG} g
              </span>
              <span className="flex items-center gap-1">
                <Fat className="size-4 text-macro-fat" />
                {n.fatG} g
              </span>
            </span>
          </span>
        </button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            aria-pressed={compare}
            onClick={() => setCompare((v) => !v)}
          >
            Compare
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-pressed={option.locked}
            onClick={() => change({ ...option, locked: !option.locked })}
          >
            <Lock className="size-4" />
            {option.locked ? "Locked" : "Lock"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              const fingerprint = JSON.stringify(option);
              const id =
                copyId.current?.fingerprint === fingerprint
                  ? copyId.current.id
                  : crypto.randomUUID();
              copyId.current = { fingerprint, id };
              try {
                await nutritionApi.recipes.create(studioId, {
                  id,
                  name: `${option.name.slice(0, 235)} (plan version)`,
                  servings: 1,
                  description: null,
                  imageUrl: option.imageUrl,
                  videoUrl: null,
                  videoLinkUrl: null,
                  mealTypes: option.mealTypes.length ? option.mealTypes : ["Other"],
                  dietaryTags: option.dietaryTags,
                  allergenTags: option.allergenTags,
                  difficulty: "none",
                  prepMinutes: null,
                  cookMinutes: null,
                  ingredients: option.ingredients.map((l) => ({
                    ingredientId: l.ingredientId,
                    quantity: l.quantity,
                    unit: l.unit,
                    preparationNote: l.preparationNote,
                    minimumUnitAmount: l.minimumUnitAmount,
                  })),
                  steps: option.steps,
                });
                void qc.invalidateQueries({ queryKey: ["nutrition", studioId, "recipes"] });
                setError("Saved to your Personal recipes.");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Couldn't save Personal recipe.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Copy className="size-4" />
            {busy ? "Saving…" : "Save as Personal recipe"}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={expanded ? `Collapse ${option.name}` : `Expand ${option.name}`}
            onClick={toggle}
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>
      </header>
      {expanded ? (
        <>
          <Button
            type="button"
            variant="ghost"
            className="self-start"
            aria-expanded={nutrientsOpen}
            onClick={() => setNutrientsOpen((v) => !v)}
          >
            Nutrients
          </Button>
          {nutrientsOpen ? <NutrientSummary nutrition={n} servings={1} /> : null}
          {error ? (
            <p role="status" className="text-body-sm text-fg-muted">
              {error}
            </p>
          ) : null}
          <p className="text-caption text-fg-subtle">
            Changes apply to this meal plan. Lock this option to preserve its quantities when
            targets change.
          </p>
          <div className="flex min-w-0 flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="mb-2 w-full rounded-full"
              onClick={() => setAdding((v) => !v)}
            >
              <Plus className="size-4" />
              Add ingredient
            </Button>
            {adding ? (
              <div className="mb-3 flex flex-col gap-2 rounded-control border border-line p-3">
                <Input
                  aria-label="Search meal ingredients"
                  placeholder="Search ingredients…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {ingredients.isPending ? (
                  <LibraryLoading />
                ) : ingredients.isError ? (
                  <LibraryError retry={() => ingredients.refetch()} />
                ) : (
                  ingredients.data.items.map((ingredient) => (
                    <Button
                      key={ingredient.id}
                      type="button"
                      variant="ghost"
                      className="h-auto justify-between whitespace-normal text-left"
                      disabled={option.ingredients.some((l) => l.ingredientId === ingredient.id)}
                      onClick={() => {
                        const line: PlanIngredient = {
                          ingredientId: ingredient.id,
                          name: ingredient.name,
                          quantity: 100,
                          originalQuantity: 100,
                          unit: "grams",
                          defaultUnit: ingredient.defaultUnit,
                          gramsPerUnit: ingredient.gramsPerUnit,
                          preparationNote: null,
                          minimumUnitAmount: "all",
                          nutrients: {
                            kcal: ingredient.kcal,
                            proteinG: ingredient.proteinG,
                            carbsG: ingredient.carbsG,
                            fatG: ingredient.fatG,
                            micronutrients: ingredient.micronutrients,
                          },
                        };
                        change({
                          ...option,
                          ingredients: [...option.ingredients, line],
                          allergenTags: [
                            ...new Set([...option.allergenTags, ...ingredient.allergenTags]),
                          ],
                        });
                      }}
                    >
                      {ingredient.name}
                      <Plus className="size-4" />
                    </Button>
                  ))
                )}
                {ingredients.data && !ingredients.data.items.length ? (
                  <p className="text-body-sm text-fg-muted">No ingredients match your search.</p>
                ) : null}
                {ingredients.data ? (
                  <Pagination
                    total={ingredients.data.total}
                    page={page}
                    perPage={10}
                    onChange={setPage}
                  />
                ) : null}
              </div>
            ) : null}
            {option.ingredients.map((line, index) => {
              const nutrition = recipeNutrition(
                [
                  {
                    grams: gramsForUnit(line, line.quantity, line.unit) ?? 0,
                    ingredient: line.nutrients,
                  },
                ],
                1,
              );
              return (
                <div
                  key={`${line.ingredientId}:${index}`}
                  className="flex flex-wrap items-center gap-3 rounded-control bg-sunken px-3 py-3"
                >
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="text-body-sm font-medium">{line.name}</p>
                    <p className="mt-1 flex flex-wrap gap-3 text-caption text-fg-muted">
                      <span className="inline-flex items-center gap-1">
                        <Protein className="size-3 text-macro-protein" />
                        {nutrition.proteinG} g
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Carbs className="size-3 text-macro-carbs" />
                        {nutrition.carbsG} g
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Fat className="size-3 text-macro-fat" />
                        {nutrition.fatG} g
                      </span>
                    </p>
                    {line.preparationNote ? (
                      <p className="text-caption text-fg-subtle">{line.preparationNote}</p>
                    ) : null}
                    {compare ? (
                      <p className="text-caption text-fg-muted">
                        Original: {Math.round(line.originalQuantity * 1000) / 1000} {line.unit}
                      </p>
                    ) : null}
                  </div>
                  <Input
                    aria-label={`Plan quantity of ${line.name}`}
                    className="w-24"
                    type="number"
                    min={0.001}
                    step="any"
                    value={line.quantity}
                    onChange={(e) =>
                      change({
                        ...option,
                        ingredients: option.ingredients.map((l, n) =>
                          n === index ? { ...l, quantity: Number(e.target.value) } : l,
                        ),
                      })
                    }
                  />
                  <Pick
                    label={`Plan unit for ${line.name}`}
                    value={line.unit}
                    options={[
                      ...new Set([
                        "grams",
                        ...(line.defaultUnit && line.gramsPerUnit ? [line.defaultUnit] : []),
                      ]),
                    ]}
                    onChange={(unit) => {
                      const previousFactor = line.unit === "grams" ? 1 : (line.gramsPerUnit ?? 1);
                      const factor = unit === "grams" ? 1 : (line.gramsPerUnit ?? 1);
                      change({
                        ...option,
                        ingredients: option.ingredients.map((l, n) =>
                          n === index
                            ? {
                                ...l,
                                unit,
                                quantity:
                                  Math.round(((l.quantity * previousFactor) / factor) * 1000) /
                                  1000,
                                originalQuantity: (l.originalQuantity * previousFactor) / factor,
                              }
                            : l,
                        ),
                      });
                    }}
                  />
                  <span className="text-body-sm tabular-nums">
                    {nutrition.kcal} <span className="text-caption text-fg-muted">kcal</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label={`Remove ${line.name}`}
                    onClick={() =>
                      change({
                        ...option,
                        ingredients: option.ingredients.filter((_, n) => n !== index),
                      })
                    }
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              type="button"
              variant="ghost"
              className="mx-auto mt-2 rounded-full"
              aria-expanded={stepsOpen}
              onClick={() => setStepsOpen((v) => !v)}
            >
              {stepsOpen ? "Hide Steps" : "Show Steps"}
              {stepsOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>
            <AnimatePresence initial={false}>
              {stepsOpen ? (
                <motion.div
                  key="steps"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3 pt-2">
                    <RecipeSteps
                      steps={option.steps}
                      onChange={(steps) => change({ ...option, steps })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => change({ ...option, steps: [...option.steps, ""] })}
                    >
                      <Plus className="size-4" />
                      Add step
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </>
      ) : null}
    </section>
  );
}

export function PlanMealSheet({
  slot,
  selectedId,
  studioId,
  select,
  change,
  close,
}: {
  slot: PlanSlot;
  selectedId: string;
  studioId: string;
  select: (id: string) => void;
  change: (option: PlanOption) => void;
  close: () => void;
}) {
  const content = useRef<HTMLDivElement>(null);
  const index = slot.options.findIndex((o) => o.id === selectedId);
  useEffect(() => {
    const row = content.current?.querySelector<HTMLElement>(`[data-option-id="${selectedId}"]`);
    if (row && content.current)
      content.current.scrollTop = row.offsetTop - content.current.offsetTop;
  }, [selectedId]);
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <SheetContent className="w-full gap-0 sm:max-w-3xl">
        <SheetHeader className="shrink-0 border-b border-line px-6 py-5">
          <SheetTitle>{slot.name}</SheetTitle>
          <SheetDescription>
            Edit recipe options for {slot.name}. Changes are kept in your meal plan draft.
          </SheetDescription>
        </SheetHeader>
        <div
          ref={content}
          className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6"
        >
          {slot.options.map((option) => (
            <div key={option.id} data-option-id={option.id}>
              <PlanOptionEditor
                option={option}
                studioId={studioId}
                expanded={selectedId === option.id}
                toggle={() => select(selectedId === option.id ? "" : option.id)}
                change={change}
              />
            </div>
          ))}
        </div>
        <footer className="flex shrink-0 items-center gap-3 border-t border-line bg-panel px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={index <= 0}
            aria-label="Previous recipe"
            onClick={() => {
              const option = slot.options[index - 1];
              if (option) select(option.id);
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button type="button" className="flex-1 rounded-full" onClick={close}>
            Done
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={index < 0 || index >= slot.options.length - 1}
            aria-label="Next recipe"
            onClick={() => {
              const option = slot.options[index + 1];
              if (option) select(option.id);
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
