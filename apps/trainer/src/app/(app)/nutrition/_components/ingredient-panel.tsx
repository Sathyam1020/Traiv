"use client";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Apple, HeartPulse, Info, Tag } from "@traiv/ui/icons";
import { useEffect, useState } from "react";
import type { Ingredient, IngredientWrite } from "@/lib/api/nutrition";
import { clearNutritionDraft, ingredientDraft } from "@/lib/nutrition-drafts";
import { useNutritionActions } from "@/lib/query/use-nutrition";
import { ALLERGENS, DIETS, Field, MICROS, MultiPick, Pick } from "./controls";
import { MediaField } from "./media-field";

// The source export names additional nutrients; the editor uses stable field keys.
const MICRO_ALIASES: Record<string, string> = {
  "Trans Fat (g)": "transFatG",
  "Monounsaturated Fat (g)": "monounsaturatedFatG",
  "Polyunsaturated Fat (g)": "polyunsaturatedFatG",
  "Omega-3 (g)": "omega3G",
  "Omega-6 (g)": "omega6G",
  "Salt (NaCl) (g)": "saltG",
  "Magnesium (Mg) (mg)": "magnesiumMg",
  "Phosphorus (P) (mg)": "phosphorusMg",
  "Zinc (Zn) (mg)": "zincMg",
  "Vitamin A (RAE) (µg)": "vitaminAUg",
  "Vitamin E (mg)": "vitaminEMg",
  "Vitamin B1 (Thiamin) (mg)": "thiaminMg",
  "Vitamin B2 (Riboflavin) (mg)": "riboflavinMg",
  "Vitamin B3 (Niacin) (mg)": "niacinMg",
  "Vitamin B6 (Pyridoxine) (mg)": "vitaminB6Mg",
  "Vitamin B9 (Folate) (µg)": "folateUg",
  "Vitamin B12 (Cobalamin) (µg)": "vitaminB12Ug",
};
function editable(value: IngredientWrite): IngredientWrite {
  return {
    ...value,
    micronutrients: Object.fromEntries(
      Object.entries(value.micronutrients ?? {}).map(([key, n]) => [MICRO_ALIASES[key] ?? key, n]),
    ),
  };
}

const empty = (): IngredientWrite => ({
  id: crypto.randomUUID(),
  name: "",
  category: null,
  country: "India",
  dietaryTags: [],
  allergenTags: [],
  defaultUnit: null,
  gramsPerUnit: null,
  kcal: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  micronutrients: {},
  imageUrl: null,
});
export function IngredientPanel({
  studioId,
  ingredient,
  close,
  categories = [],
}: {
  studioId: string;
  ingredient: Ingredient | null;
  close: () => void;
  categories?: string[];
}) {
  const [value, setValue] = useState<IngredientWrite>(() =>
    ingredient
      ? editable({ ...ingredient, id: ingredient.studioId ? ingredient.id : crypto.randomUUID() })
      : empty(),
  );
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const actions = useNutritionActions(studioId);
  const readOnly = false;
  const system = Boolean(ingredient && !ingredient.studioId);
  const key = `traiv:ingredient-draft:${studioId}:${ingredient?.id ?? "new"}`;
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const text = localStorage.getItem(key);
      if (text && !readOnly) {
        setValue(editable(ingredientDraft(text)));
        setDirty(true);
      }
    } catch {
      setError("Couldn't restore a saved draft. Your new edits will stay in this form.");
    }
    setRestored(true);
  }, [key, readOnly]);
  useEffect(() => {
    if (!restored || !dirty) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setError("Draft storage is unavailable. Keep this form open until you save.");
    }
  }, [key, value, dirty, restored]);
  const patch = (p: Partial<IngredientWrite>) => {
    setValue((v) => ({ ...v, ...p }));
    setDirty(true);
  };
  const microEntries = Object.entries({
    ...MICROS,
    ...Object.fromEntries(Object.keys(value.micronutrients ?? {}).map((k) => [k, MICROS[k] ?? k])),
  });
  const primaryMicros = new Set([
    "fiberG",
    "sugarG",
    "sodiumMg",
    "saturatedFatG",
    "cholesterolMg",
    "ironMg",
    "calciumMg",
    "potassiumMg",
    "vitaminDUg",
  ]);
  const microFields = (advanced: boolean) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {microEntries
        .filter(([k]) => (advanced ? !primaryMicros.has(k) : primaryMicros.has(k)))
        .map(([k, label]) => (
          <Field key={k} label={`${label} / 100 g`}>
            <Input
              aria-label={label}
              type="number"
              min={0}
              step="any"
              value={value.micronutrients?.[k] ?? ""}
              onChange={(e) => {
                const next = { ...value.micronutrients };
                if (e.target.value) next[k] = Number(e.target.value);
                else delete next[k];
                patch({ micronutrients: next });
              }}
            />
          </Field>
        ))}
    </div>
  );
  const requestClose = () => {
    if (!actions.saveIngredient.isPending) close();
  };
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) requestClose();
      }}
    >
      <SheetContent
        className="w-full gap-0 sm:max-w-2xl"
        onInteractOutside={(e) => {
          if (dirty) e.preventDefault();
        }}
      >
        <SheetHeader className="shrink-0 border-b border-line px-6 py-5">
          <SheetTitle>{ingredient?.name ?? "New ingredient"}</SheetTitle>
          <SheetDescription>
            {ingredient ? "Update the ingredient details" : "Add an ingredient to your library"}
            {system ? " · Changes save to your Personal library." : ""}
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              await actions.saveIngredient.mutateAsync({
                id: ingredient?.studioId ? ingredient.id : undefined,
                input: value,
              });
              clearNutritionDraft(key);
              close();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
            }
          }}
        >
          <fieldset
            disabled={readOnly || actions.saveIngredient.isPending}
            className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-6"
          >
            <h2 className="flex items-center gap-2 font-semibold">
              <Info className="size-5" />
              Basic information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  aria-label="Ingredient name"
                  required
                  maxLength={255}
                  value={value.name}
                  onChange={(e) => patch({ name: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <Pick
                  label="Category"
                  value={value.category ?? "Uncategorised"}
                  options={[
                    ...new Set([
                      "Uncategorised",
                      "Fruits and Vegetables",
                      "Bakery and Bread",
                      "Dairy and Eggs",
                      "Meat and Poultry",
                      "Fish and Seafood",
                      "Vegan and Vegetarian",
                      "Pantry and Groceries",
                      "Snacks and Sweets",
                      ...categories,
                      ...(value.category ? [value.category] : []),
                    ]),
                  ]}
                  onChange={(category) =>
                    patch({ category: category === "Uncategorised" ? null : category })
                  }
                />
              </Field>
              <Field label="Country">
                <Pick
                  label="Country"
                  value={value.country ?? "Global"}
                  options={[
                    ...new Set(["India", "Global", ...(value.country ? [value.country] : [])]),
                  ]}
                  onChange={(country) => patch({ country })}
                />
              </Field>
            </div>
            <h2 className="flex items-center gap-2 border-t border-line pt-5 font-semibold">
              <Apple className="size-5" />
              Nutritional information
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["kcal", "Calories (kcal)"],
                  ["proteinG", "Protein (g)"],
                  ["carbsG", "Carbs (g)"],
                  ["fatG", "Fat (g)"],
                ] as const
              ).map(([k, label]) => (
                <Field label={label} key={k}>
                  <Input
                    aria-label={label}
                    type="number"
                    min={0}
                    max={k === "kcal" ? 2000 : 100}
                    step={k === "kcal" ? 1 : "any"}
                    required
                    value={value[k]}
                    onChange={(e) => patch({ [k]: Number(e.target.value) })}
                  />
                </Field>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Serving unit">
                <Pick
                  label="Serving unit"
                  value={value.defaultUnit ?? "None"}
                  options={[
                    ...new Set([
                      "None",
                      "portion",
                      "piece",
                      "tsp",
                      "tbsp",
                      "cup",
                      "ml",
                      "katori",
                      "handful",
                      "scoop",
                      "slice",
                      "packet",
                      "pinch",
                      "stalk",
                      "oz",
                      ...(value.defaultUnit ? [value.defaultUnit] : []),
                    ]),
                  ]}
                  onChange={(unit) =>
                    patch(
                      unit === "None"
                        ? { defaultUnit: null, gramsPerUnit: null }
                        : { defaultUnit: unit },
                    )
                  }
                />
              </Field>
              <Field label="Grams per unit">
                <Input
                  aria-label="Grams per unit"
                  type="number"
                  min={0.01}
                  step="any"
                  value={value.gramsPerUnit ?? ""}
                  onChange={(e) =>
                    patch({ gramsPerUnit: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </Field>
            </div>
            {value.defaultUnit && value.gramsPerUnit ? (
              <p className="text-caption text-fg-muted">
                1 {value.defaultUnit} = {value.gramsPerUnit} g
              </p>
            ) : null}
            <Field label="Ingredient type">
              <Pick
                label="Ingredient type"
                value={value.nutrientType ?? "Unassigned"}
                options={["Unassigned", "protein", "carbs", "fat", "mixed", "condiment", "spice"]}
                onChange={(nutrientType) =>
                  patch({
                    nutrientType:
                      nutrientType === "protein" ||
                      nutrientType === "carbs" ||
                      nutrientType === "fat" ||
                      nutrientType === "mixed" ||
                      nutrientType === "condiment" ||
                      nutrientType === "spice"
                        ? nutrientType
                        : null,
                  })
                }
              />
            </Field>
            <h2 className="flex items-center gap-2 border-t border-line pt-5 font-semibold">
              <Tag className="size-5" />
              Tags & classification
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MultiPick
                label="Dietary preferences"
                values={value.dietaryTags}
                options={DIETS}
                onChange={(dietaryTags) => patch({ dietaryTags })}
              />
              <MultiPick
                label="Contains allergens"
                values={value.allergenTags}
                options={ALLERGENS}
                onChange={(allergenTags) => patch({ allergenTags })}
              />
            </div>
            <div>
              <h2 className="mb-5 flex items-center gap-2 border-t border-line pt-5 font-semibold">
                <HeartPulse className="size-5" />
                Micronutrients
              </h2>
              {microFields(false)}
              <details className="mt-5">
                <summary className="cursor-pointer py-2 text-center text-body-sm font-medium">
                  Show all nutrients
                </summary>
                <div className="mt-4">{microFields(true)}</div>
              </details>
            </div>
            <MediaField
              studioId={studioId}
              kind="ingredient-image"
              label="Ingredient image"
              value={value.imageUrl ?? ""}
              onChange={(imageUrl) => patch({ imageUrl: imageUrl || null })}
            />
          </fieldset>
          {error ? (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-line bg-panel px-6 py-4">
            <Button type="button" variant="outline" className="flex-1" onClick={requestClose}>
              Cancel
            </Button>
            {!readOnly ? (
              <Button className="flex-1" disabled={actions.saveIngredient.isPending || !dirty}>
                {actions.saveIngredient.isPending
                  ? "Saving…"
                  : ingredient
                    ? "Update ingredient"
                    : "Create ingredient"}
              </Button>
            ) : null}
            {ingredient?.studioId ? (
              <Button
                type="button"
                variant="destructive"
                disabled={actions.deleteIngredient.isPending}
                onClick={async () => {
                  try {
                    await actions.deleteIngredient.mutateAsync(ingredient.id);
                    clearNutritionDraft(key);
                    close();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Couldn't delete. Try again.");
                  }
                }}
              >
                Delete ingredient
              </Button>
            ) : null}
          </div>
          {dirty ? (
            <p className="px-6 pb-3 text-caption text-fg-subtle">
              Unsaved changes are kept as a draft on this device.
            </p>
          ) : null}
        </form>
      </SheetContent>
    </Sheet>
  );
}
