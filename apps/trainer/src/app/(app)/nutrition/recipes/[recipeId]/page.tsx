"use client";
import { useQueryClient } from "@tanstack/react-query";
import { gramsForUnit, recipeNutrition } from "@traiv/nutrition/recipes";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@traiv/ui/components/sheet";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Copy,
  Plus,
  Salad,
  Trash,
} from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { Ingredient, Nutrients, Recipe, RecipeWrite } from "@/lib/api/nutrition";
import { clearNutritionDraft, editorDraft } from "@/lib/nutrition-drafts";
import { useIngredients, useNutritionActions, useRecipe } from "@/lib/query/use-nutrition";
import { LibraryError, LibraryLoading, Pagination, Pick } from "../../_components/controls";
import { NutrientSummary } from "../../_components/nutrients";
import { RecipeSteps } from "../../_components/recipe-steps";
import { RecipeIdentity } from "../../_components/recipe-panel";

export default function RecipePage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const studioId = useActiveStudioId() ?? "";
  const query = useRecipe(studioId, recipeId);
  if (query.isPending)
    return (
      <Page>
        <LibraryLoading />
      </Page>
    );
  if (query.isError)
    return (
      <Page>
        <Link href="/nutrition/recipes">Back to recipes</Link>
        <LibraryError
          retry={() => query.refetch()}
          message="Couldn't open this recipe. It may have been removed."
        />
      </Page>
    );
  return (
    <Editor
      key={`${studioId}:${recipeId}:${query.data.updatedAt}`}
      recipe={query.data}
      studioId={studioId}
    />
  );
}
function recipeFingerprint(value: RecipeWrite) {
  return JSON.stringify({
    name: value.name,
    servings: value.servings,
    description: value.description ?? "",
    imageUrl: value.imageUrl ?? "",
    videoUrl: value.videoUrl ?? "",
    videoLinkUrl: value.videoLinkUrl ?? "",
    mealTypes: [...value.mealTypes].sort(),
    dietaryTags: [...value.dietaryTags].sort(),
    allergenTags: [...value.allergenTags].sort(),
    difficulty: value.difficulty ?? "none",
    prepMinutes: value.prepMinutes ?? null,
    cookMinutes: value.cookMinutes ?? null,
    ingredients: value.ingredients.map((l) => ({
      ingredientId: l.ingredientId,
      quantity: l.quantity,
      unit: l.unit,
      preparationNote: l.preparationNote ?? "",
      minimumUnitAmount: l.minimumUnitAmount ?? "all",
    })),
    steps: value.steps,
  });
}
function Editor({ recipe, studioId }: { recipe: Recipe; studioId: string }) {
  const [value, setValue] = useState<RecipeWrite>(() => ({
    ...recipe,
    id: recipe.studioId ? recipe.id : crypto.randomUUID(),
    expectedUpdatedAt: recipe.updatedAt,
  }));
  const [known, setKnown] = useState<Ingredient[]>(() =>
    recipe.ingredients.map((l) => l.ingredient),
  );
  const dirty = recipeFingerprint(value) !== recipeFingerprint(recipe);
  const detailsBefore = useRef<RecipeWrite | null>(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [recovery, setRecovery] = useState<{ value: RecipeWrite; known: Ingredient[] } | null>(
    null,
  );
  const [editing, setEditing] = useState(false);
  const [expandedIngredient, setExpandedIngredient] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [pickerPage, setPickerPage] = useState(1);
  const [picking, setPicking] = useState(false);
  const [copyId] = useState(() => crypto.randomUUID());
  const router = useRouter();
  const qc = useQueryClient();
  const actions = useNutritionActions(studioId);
  const ingredients = useIngredients(studioId, { search, page: pickerPage, perPage: 10 });
  const readOnly = false;
  const system = !recipe.studioId;
  const key = `traiv:recipe-draft:${studioId}:${recipe.id}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw && !readOnly) {
        const saved = editorDraft(raw);
        if (saved.value.expectedUpdatedAt === recipe.updatedAt) {
          setValue(saved.value);
          setKnown(saved.known);
        } else {
          setRecovery(saved);
          setError(
            "An older draft is saved on this device. The recipe has changed since then; reload its saved version or recover the draft before editing.",
          );
        }
      }
    } catch {
      setError("Couldn't restore your draft. Keep this page open until you save.");
    }
    setReady(true);
  }, [key, readOnly, recipe.updatedAt]);
  useEffect(() => {
    if (!ready || recovery) return;
    if (!dirty) {
      clearNutritionDraft(key);
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify({ value, known }));
    } catch {
      setError("Draft storage is unavailable. Keep this page open until you save.");
    }
  }, [value, known, dirty, ready, key, recovery]);
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  const patch = (v: Partial<RecipeWrite>) => {
    if (recovery) return;
    setValue((old) => ({ ...old, ...v }));
  };
  let invalidConversion = false;
  const lines: { grams: number; ingredient: Nutrients }[] = [];
  for (const line of value.ingredients) {
    const ingredient = known.find((i) => i.id === line.ingredientId);
    const grams = ingredient ? gramsForUnit(ingredient, line.quantity, line.unit) : null;
    if (!ingredient || grams === null) {
      invalidConversion = true;
      continue;
    }
    lines.push({
      grams,
      ingredient: { ...ingredient, micronutrients: ingredient.micronutrients ?? {} },
    });
  }
  const totals = recipeNutrition(lines, Math.max(1, value.servings));
  const save = async () => {
    if (recovery || !dirty || actions.saveRecipe.isPending) return;
    setError("");
    try {
      const saved = await actions.saveRecipe.mutateAsync({
        id: system ? undefined : recipe.id,
        input: system ? { ...value, expectedUpdatedAt: undefined } : value,
      });
      clearNutritionDraft(key);
      setEditing(false);
      qc.setQueryData(["nutrition", studioId, "recipe", saved.id], saved);
      if (system) router.replace(`/nutrition/recipes/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the recipe. Try again.");
    }
  };
  const saveDisabled =
    Boolean(recovery) ||
    !dirty ||
    invalidConversion ||
    actions.saveRecipe.isPending ||
    !value.name.trim() ||
    !value.mealTypes.length ||
    value.servings < 1 ||
    value.ingredients.some((l) => l.quantity <= 0) ||
    value.steps.some((step) => !step.trim());
  const closeDetails = () => {
    if (actions.saveRecipe.isPending) return;
    if (detailsBefore.current) setValue(detailsBefore.current);
    detailsBefore.current = null;
    setEditing(false);
  };
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/nutrition/recipes" aria-label="Back to recipes">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-subheading font-semibold">{readOnly ? "Recipe" : "Edit recipe"}</h1>
            <p className="text-caption text-fg-subtle">
              {system
                ? "System recipe · Changes save to your Personal library"
                : dirty
                  ? "Unsaved changes · Draft saved on this device"
                  : "Personal recipe"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={actions.duplicateRecipe.isPending || dirty}
            onClick={async () => {
              try {
                const copy = await actions.duplicateRecipe.mutateAsync({ id: recipe.id, copyId });
                router.push(`/nutrition/recipes/${copy.id}`);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Couldn't duplicate. Try again.");
              }
            }}
          >
            <Copy className="size-4" />
            {actions.duplicateRecipe.isPending ? "Duplicating…" : "Duplicate"}
          </Button>
          {!readOnly ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  detailsBefore.current = value;
                  setEditing(true);
                }}
              >
                Edit recipe
              </Button>
              <Button disabled={saveDisabled} onClick={save}>
                {actions.saveRecipe.isPending ? "Saving…" : "Save recipe"}
              </Button>
            </>
          ) : null}
        </div>
      </header>
      {error ? (
        <div
          role="alert"
          className="flex shrink-0 flex-wrap items-center gap-3 px-6 py-3 text-body-sm text-danger"
        >
          <p>{error}</p>
          {recovery ? (
            <Button
              variant="outline"
              onClick={() => {
                setValue({ ...recovery.value, expectedUpdatedAt: recipe.updatedAt });
                setKnown(recovery.known);
                setRecovery(null);
                setError("");
              }}
            >
              Recover draft
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => {
              clearNutritionDraft(key);
              setValue({
                ...recipe,
                id: system ? crypto.randomUUID() : recipe.id,
                expectedUpdatedAt: recipe.updatedAt,
              });
              setKnown(recipe.ingredients.map((l) => l.ingredient));
              setRecovery(null);
              setError("");
            }}
          >
            Use saved version
          </Button>
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pb-24 md:flex-row md:overflow-hidden lg:pb-0">
        <aside className="flex min-w-0 shrink-0 flex-col gap-4 p-4 sm:p-6 md:w-72 md:overflow-y-auto md:overscroll-contain md:border-r md:border-line lg:w-80">
          <div className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-2">
            {value.imageUrl ? (
              <img
                src={value.imageUrl}
                alt={value.name}
                className="aspect-video w-full rounded-control object-cover"
              />
            ) : null}
            <div className="flex flex-col gap-3 px-2 pb-2">
              <div>
                <h2 className="text-subheading font-semibold">{value.name}</h2>
                <p className="mt-1 text-caption text-fg-subtle">
                  {value.servings} {value.servings === 1 ? "serving" : "servings"}
                </p>
              </div>
              {
                <>
                  <p className="text-body-sm text-fg-muted">{value.description}</p>
                  <div className="flex flex-wrap gap-2 text-caption text-fg-muted">
                    {[...value.mealTypes, ...value.dietaryTags].map((t) => (
                      <span className="rounded-control bg-sunken px-2 py-1" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {value.allergenTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-control bg-danger/10 px-2 py-1 text-caption text-danger"
                      >
                        {t.startsWith("Contains ") ? t : `Contains ${t}`}
                      </span>
                    ))}
                  </div>
                  <p className="text-caption text-fg-subtle">
                    {value.prepMinutes ?? 0} min prep · {value.cookMinutes ?? 0} min cook
                  </p>
                  {value.videoUrl || value.videoLinkUrl ? (
                    <a
                      href={value.videoUrl ?? value.videoLinkUrl ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="text-body-sm underline"
                    >
                      Watch recipe video
                    </a>
                  ) : null}
                </>
              }
            </div>
          </div>
          <NutrientSummary nutrition={totals} servings={value.servings} />
          {recipe.studioId ? (
            <Button
              variant="ghost"
              className="justify-start text-danger"
              disabled={actions.deleteRecipe.isPending}
              onClick={async () => {
                try {
                  await actions.deleteRecipe.mutateAsync(recipe.id);
                  clearNutritionDraft(key);
                  router.push("/nutrition/recipes");
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Couldn't delete. Try again.");
                }
              }}
            >
              <Trash className="size-4" />
              Delete recipe
            </Button>
          ) : null}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6 md:overflow-y-auto md:overscroll-contain">
          <section className="rounded-surface border border-line bg-surface p-4 sm:p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-body">
              <Salad className="size-5" />
              Ingredients
            </h2>
            {!value.ingredients.length ? (
              <p className="py-4 text-body-sm text-fg-subtle">
                Add ingredients to calculate this recipe's nutrition.
              </p>
            ) : null}
            {value.ingredients.map((l, index) => {
              const ingredient = known.find((i) => i.id === l.ingredientId);
              const grams = ingredient ? gramsForUnit(ingredient, l.quantity, l.unit) : null;
              return (
                <div
                  key={`${l.ingredientId}:${index}`}
                  className="mb-2 flex flex-wrap items-center gap-3 rounded-control bg-sunken px-3 py-3"
                >
                  <button
                    type="button"
                    className="flex min-h-11 min-w-0 flex-1 basis-40 items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-line-focus"
                    aria-expanded={expandedIngredient === index}
                    aria-label={`Details for ${ingredient?.name ?? "ingredient"}`}
                    onClick={() =>
                      setExpandedIngredient(expandedIngredient === index ? null : index)
                    }
                  >
                    {expandedIngredient === index ? (
                      <ChevronDown className="size-4 shrink-0 text-fg-subtle" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-fg-subtle" />
                    )}
                    <span className="text-body-sm font-medium">
                      {ingredient?.name ?? "Unavailable ingredient"}
                      {ingredient?.gramsPerUnit ? (
                        <span className="ml-2 inline-block rounded-control border border-line px-2 py-0.5 text-caption text-fg-muted">
                          {ingredient.gramsPerUnit} g / {ingredient.defaultUnit}
                        </span>
                      ) : null}
                    </span>
                  </button>
                  <Input
                    aria-label={`Quantity of ${ingredient?.name ?? "ingredient"}`}
                    disabled={readOnly}
                    type="number"
                    min={0.01}
                    max={100000}
                    step="any"
                    className="w-20 bg-surface"
                    value={l.quantity}
                    onChange={(e) =>
                      patch({
                        ingredients: value.ingredients.map((x, n) =>
                          n === index ? { ...x, quantity: Number(e.target.value) } : x,
                        ),
                      })
                    }
                  />
                  <Pick
                    label={`Unit for ${ingredient?.name ?? "ingredient"}`}
                    disabled={readOnly}
                    value={l.unit}
                    options={[
                      ...new Set([
                        "grams",
                        ...(ingredient?.defaultUnit ? [ingredient.defaultUnit] : []),
                      ]),
                    ]}
                    onChange={(unit) => {
                      if (!readOnly)
                        patch({
                          ingredients: value.ingredients.map((x, n) =>
                            n === index
                              ? {
                                  ...x,
                                  unit,
                                  quantity:
                                    grams !== null && ingredient
                                      ? Math.round(
                                          (unit === "grams"
                                            ? grams
                                            : grams / (ingredient.gramsPerUnit ?? 1)) * 1000,
                                        ) / 1000
                                      : x.quantity,
                                }
                              : x,
                          ),
                        });
                    }}
                  />
                  <span className="w-16 shrink-0 text-right text-body-sm tabular-nums">
                    {grams === null || !ingredient
                      ? "—"
                      : Math.round((ingredient.kcal * grams) / 100)}{" "}
                    <span className="text-caption text-fg-subtle">kcal</span>
                  </span>
                  {!readOnly ? (
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${ingredient?.name ?? "ingredient"}`}
                        onClick={() =>
                          patch({ ingredients: value.ingredients.filter((_, n) => n !== index) })
                        }
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  ) : null}
                  <AnimatePresence initial={false}>
                    {expandedIngredient === index && ingredient ? (
                      <motion.div
                        key="preparation"
                        initial={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
                        transition={{ duration: reduceMotion ? 0.1 : 0.16 }}
                        className="w-full overflow-hidden"
                      >
                        <div className="flex flex-col gap-4 border-t border-line pt-4">
                          <label
                            htmlFor={`preparation-${index}`}
                            className="flex flex-col gap-2 text-body-sm"
                          >
                            Preparation note
                            <Input
                              id={`preparation-${index}`}
                              aria-label={`Preparation note for ${ingredient.name}`}
                              placeholder="e.g. finely chopped, peeled"
                              value={l.preparationNote ?? ""}
                              onChange={(e) =>
                                patch({
                                  ingredients: value.ingredients.map((x, n) =>
                                    n === index ? { ...x, preparationNote: e.target.value } : x,
                                  ),
                                })
                              }
                            />
                          </label>
                          <div className="flex flex-col gap-2">
                            <p className="text-body-sm">Minimum unit amount</p>
                            <fieldset
                              aria-label={`Minimum unit amount for ${ingredient.name}`}
                              className="grid grid-cols-4 gap-1 rounded-control bg-selected p-1"
                            >
                              {(["whole", "halves", "quarters", "all"] as const).map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant="ghost"
                                  aria-pressed={(l.minimumUnitAmount ?? "all") === amount}
                                  className={
                                    (l.minimumUnitAmount ?? "all") === amount
                                      ? "min-w-0 border border-line-strong bg-surface px-1 text-caption text-fg shadow-inset"
                                      : "min-w-0 px-1 text-caption text-fg-muted"
                                  }
                                  onClick={() =>
                                    patch({
                                      ingredients: value.ingredients.map((x, n) =>
                                        n === index ? { ...x, minimumUnitAmount: amount } : x,
                                      ),
                                    })
                                  }
                                >
                                  {amount.charAt(0).toUpperCase() + amount.slice(1)}
                                </Button>
                              ))}
                            </fieldset>
                          </div>
                          <p className="text-caption text-fg-subtle">
                            {grams === null
                              ? "Choose a serving unit"
                              : `${Math.round(grams * 10) / 10} g in recipe`}{" "}
                            · Protein {((ingredient.proteinG * (grams ?? 0)) / 100).toFixed(1)} g ·
                            Carbs {((ingredient.carbsG * (grams ?? 0)) / 100).toFixed(1)} g · Fat{" "}
                            {((ingredient.fatG * (grams ?? 0)) / 100).toFixed(1)} g
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
            {!readOnly ? (
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => setPicking((v) => !v)}
              >
                <Plus className="size-4" />
                {picking ? "Close ingredient search" : "Add ingredient"}
              </Button>
            ) : null}
            {picking ? (
              <div className="mt-4 flex flex-col gap-3 rounded-surface bg-sunken p-4">
                <Input
                  autoFocus
                  aria-label="Find an ingredient"
                  placeholder="Search ingredients…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPickerPage(1);
                  }}
                />
                {ingredients.isPending ? (
                  <LibraryLoading />
                ) : ingredients.isError ? (
                  <LibraryError retry={() => ingredients.refetch()} />
                ) : ingredients.data.items.length ? (
                  ingredients.data.items.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      className="flex min-h-11 items-center justify-between gap-3 rounded-control px-2 py-2 text-left text-body-sm hover:bg-hover"
                      onClick={() => {
                        setKnown((old) => (old.some((x) => x.id === i.id) ? old : [...old, i]));
                        patch({
                          ingredients: [
                            ...value.ingredients,
                            { ingredientId: i.id, quantity: 100, unit: "grams" },
                          ],
                        });
                      }}
                    >
                      <span>
                        {i.name}
                        <span className="block text-caption text-fg-subtle">
                          {i.kcal} kcal / 100 g
                        </span>
                      </span>
                      <Plus className="size-4 shrink-0" />
                    </button>
                  ))
                ) : (
                  <p className="text-body-sm text-fg-muted">
                    No ingredients match. Add one in Ingredients first.
                  </p>
                )}
                {ingredients.data ? (
                  <Pagination
                    total={ingredients.data.total}
                    page={pickerPage}
                    perPage={10}
                    onChange={setPickerPage}
                  />
                ) : null}
              </div>
            ) : null}
          </section>
          <section className="rounded-surface border border-line bg-surface p-4 sm:p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-body">
              <ClipboardList className="size-5" />
              Instructions
            </h2>
            {!value.steps.length ? (
              <p className="py-4 text-body-sm text-fg-subtle">
                {readOnly
                  ? "No instructions provided."
                  : "Add the steps someone needs to make this recipe."}
              </p>
            ) : null}
            <RecipeSteps steps={value.steps} onChange={(steps) => patch({ steps })} />
            {!readOnly ? (
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => patch({ steps: [...value.steps, ""] })}
              >
                <Plus className="size-4" />
                Add step
              </Button>
            ) : null}
          </section>
        </div>
      </div>
      <Sheet
        open={editing}
        onOpenChange={(open) => {
          if (!open) closeDetails();
        }}
      >
        <SheetContent
          className="w-full gap-0 sm:max-w-3xl"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <SheetHeader className="shrink-0 border-b border-line px-6 py-5">
            <SheetTitle>Edit recipe</SheetTitle>
            <SheetDescription>Update your recipe details</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <RecipeIdentity value={value} patch={patch} studioId={studioId} />
            {error ? (
              <p role="alert" className="mt-4 text-body-sm text-danger">
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-3 border-t border-line bg-panel px-6 py-4">
            <Button
              className="flex-1"
              variant="outline"
              onClick={closeDetails}
              disabled={actions.saveRecipe.isPending}
            >
              Cancel
            </Button>
            <Button className="flex-1" disabled={saveDisabled} onClick={save}>
              {actions.saveRecipe.isPending ? "Saving…" : "Save recipe"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
