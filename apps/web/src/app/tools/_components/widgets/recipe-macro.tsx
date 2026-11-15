"use client";

import { type Ingredient, type RecipeView, recipeTotals } from "@traiv/calculators/recipe";
import { Input } from "@traiv/ui/components/input";
import { Plus, X } from "@traiv/ui/icons";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Segmented } from "../segmented";
import { useTool } from "../tool-context";
import { trackCalculateSettled, trackTool } from "../track";

/*
 * Matches the researched tool: four sample rows pre-filled, six empty rows after them,
 * add and remove rows, servings, and a whole / per serving / per 100 g switch. No food
 * database: values come from the label.
 */

type Row = { key: string } & { [K in keyof Ingredient]: Ingredient[K] | "" };

const SAMPLE: Omit<Row, "key">[] = [
  { name: "Chicken breast", grams: 200, proteinPer100: 23, carbsPer100: 0, fatPer100: 1.5 },
  { name: "White rice (dry)", grams: 150, proteinPer100: 7, carbsPer100: 78, fatPer100: 0.6 },
  { name: "Olive oil", grams: 15, proteinPer100: 0, carbsPer100: 0, fatPer100: 100 },
  { name: "Broccoli", grams: 100, proteinPer100: 2.8, carbsPer100: 7, fatPer100: 0.4 },
];
const EMPTY: Omit<Row, "key"> = {
  name: "",
  grams: "",
  proteinPer100: "",
  carbsPer100: "",
  fatPer100: "",
};
const START_EMPTY_ROWS = 6;
const MAX_ROWS = 30;

let seq = 0;
const keyed = (r: Omit<Row, "key">): Row => ({ ...r, key: `r${seq++}` });

const VIEW_LABEL: Record<RecipeView, string> = {
  recipe: "whole recipe",
  serving: "per serving",
  per100: "per 100 g",
};

const num = (v: number | "" | string) => (v === "" ? 0 : Number(v));

export function RecipeMacroWidget() {
  const tool = useTool();
  const [rows, setRows] = useState<Row[]>(() => [
    ...SAMPLE.map(keyed),
    ...Array.from({ length: START_EMPTY_ROWS }, () => keyed(EMPTY)),
  ]);
  const [servings, setServings] = useState<number | "">(2);
  const [view, setView] = useState<RecipeView>("recipe");
  const firstRender = useRef(true);
  const headingId = useId();
  const servingsId = useId();
  const addRef = useRef<HTMLButtonElement>(null);

  const ingredients = useMemo(() => rowsToIngredients(rows), [rows]);
  const result = useMemo(
    () => recipeTotals(ingredients, num(servings), view),
    [ingredients, servings, view],
  );
  // The summary sentence always quotes the whole recipe and one serving, whichever view is on.
  const whole = useMemo(
    () => recipeTotals(ingredients, num(servings), "recipe"),
    [ingredients, servings],
  );
  const perServing = useMemo(
    () => recipeTotals(ingredients, num(servings), "serving"),
    [ingredients, servings],
  );

  // Only edits count as a calculation, not the pre-filled sample on page load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackCalculateSettled(tool.slug, tool.group, tool.kind);
  }, [result, tool]);

  function update(key: string, field: keyof Ingredient, value: string) {
    setRows((rs) =>
      rs.map((r) =>
        r.key !== key
          ? r
          : { ...r, [field]: field === "name" ? value : value === "" ? "" : Number(value) },
      ),
    );
  }

  const round = (x: number) => Math.round(x).toLocaleString("en-US");
  const macros = [
    { label: "Protein", m: result.protein, tone: "bg-brand" },
    { label: "Carbs", m: result.carbs, tone: "bg-fg-muted" },
    { label: "Fat", m: result.fat, tone: "bg-fg" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby={headingId}
        className="rounded-surface border border-line bg-surface p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 id={headingId} className="font-display text-subheading font-semibold">
            Build your recipe
          </h2>
          <p className="max-w-[22rem] text-caption text-fg-subtle">
            Type protein, carbs and fat per 100 g as printed on each label.
          </p>
        </div>

        <div className="mt-5 hidden grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))_2.75rem] gap-2 text-caption font-medium text-fg-subtle md:grid">
          <span>Ingredient</span>
          <span>Grams</span>
          <span>Protein /100 g</span>
          <span>Carbs /100 g</span>
          <span>Fat /100 g</span>
          <span />
        </div>

        <ul className="mt-2 flex flex-col gap-3 md:gap-2">
          {rows.map((r, i) => (
            <li
              key={r.key}
              className="grid grid-cols-2 gap-2 rounded-control border border-line p-3 md:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))_2.75rem] md:border-0 md:p-0"
            >
              <Input
                id={`${r.key}-name`}
                aria-label={`Ingredient ${i + 1} name`}
                placeholder="Ingredient"
                value={r.name}
                onChange={(e) => update(r.key, "name", e.target.value)}
                className="col-span-2 md:col-span-1"
              />
              {(
                [
                  ["grams", "Grams used", 1, undefined],
                  ["proteinPer100", "Protein per 100 g", 0.1, 100],
                  ["carbsPer100", "Carbs per 100 g", 0.1, 100],
                  ["fatPer100", "Fat per 100 g", 0.1, 100],
                ] as const
              ).map(([field, label, step, max]) => (
                // On a phone the column headers are hidden, so each field carries its own
                // visible label; from md up the header row does that job.
                <div key={field} className="flex flex-col gap-1">
                  <label
                    htmlFor={`${r.key}-${field}`}
                    className="text-caption text-fg-subtle md:sr-only"
                  >
                    <span className="sr-only">{`Ingredient ${i + 1}: `}</span>
                    {label}
                  </label>
                  <Input
                    id={`${r.key}-${field}`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={max}
                    step={step}
                    placeholder="0"
                    value={r[field]}
                    onChange={(e) => update(r.key, field, e.target.value)}
                    className="tabular-nums"
                  />
                </div>
              ))}
              <button
                type="button"
                aria-label={`Remove ingredient ${i + 1}${r.name ? `, ${r.name}` : ""}`}
                onClick={() => {
                  // The button that had focus is about to unmount. Hand focus to the next
                  // row's name field, or to "Add ingredient" after the last row, so a
                  // keyboard user is not thrown back to the top of the page.
                  const nextKey = rows[i + 1]?.key;
                  setRows((rs) => rs.filter((x) => x.key !== r.key));
                  requestAnimationFrame(() => {
                    const target = nextKey
                      ? document.getElementById(`${nextKey}-name`)
                      : addRef.current;
                    target?.focus();
                  });
                }}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover hover:text-fg"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            ref={addRef}
            type="button"
            disabled={rows.length >= MAX_ROWS}
            onClick={() => setRows((rs) => [...rs, keyed(EMPTY)])}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-control border border-line-strong px-4 text-body-sm font-medium transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus aria-hidden="true" className="size-4" /> Add ingredient
          </button>
          <div className="flex items-center gap-3 text-body-sm">
            <label htmlFor={servingsId}>Servings this recipe makes</label>
            <Input
              id={servingsId}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={servings}
              onChange={(e) => setServings(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-20 tabular-nums"
            />
          </div>
        </div>
      </section>

      <section
        aria-live="polite"
        aria-label="Recipe totals"
        className="dark rounded-surface border border-line bg-canvas p-5 text-fg sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-caption font-medium text-fg-subtle">Recipe totals</p>
          <Segmented
            label="Show totals for"
            value={view}
            onChange={(v) => {
              setView(v);
              trackTool({ event: "tool_result_action", slug: tool.slug, action: `view_${v}` });
            }}
            options={[
              { value: "recipe", label: "Whole recipe" },
              { value: "serving", label: "Per serving" },
              { value: "per100", label: "Per 100 g" },
            ]}
          />
        </div>

        {result.ingredientCount === 0 ? (
          <p className="mt-6 text-body-sm text-fg-muted">
            Add an ingredient with its grams to see the totals.
          </p>
        ) : (
          <>
            <p className="mt-4 font-display text-display font-medium tabular-nums">
              {round(result.kcal)} <span className="text-lead text-fg-muted">kcal</span>
            </p>
            <p className="text-body-sm text-fg-muted">
              {VIEW_LABEL[view]} · {result.ingredientCount} ingredient
              {result.ingredientCount === 1 ? "" : "s"}
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {macros.map(({ label, m, tone }) => (
                <li key={label} className="rounded-control border border-line bg-surface p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-body-sm font-medium">{label}</span>
                    <span className="font-display text-subheading font-semibold tabular-nums">
                      {round(m.grams)} g
                    </span>
                  </div>
                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full rounded-full ${tone}`}
                      style={{ width: `${Math.round(m.share * 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-caption text-fg-muted tabular-nums">
                    <span>{round(m.kcal)} kcal</span>
                    <span>{Math.round(m.share * 100)}%</span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-body-sm text-fg-muted">
              The whole recipe weighs about {round(result.totalGrams)} g raw and comes to{" "}
              {round(whole.kcal)} kcal, or roughly {round(perServing.kcal)} kcal for each of{" "}
              {result.servings} serving{result.servings === 1 ? "" : "s"}.
            </p>
            <p className="mt-2 text-caption text-fg-subtle">
              Calories are counted at 4 kcal per gram of protein and carbohydrate and 9 per gram of
              fat. The percentages show where the calories come from.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function rowsToIngredients(rows: Row[]): Ingredient[] {
  return rows.map((r) => ({
    name: String(r.name),
    grams: num(r.grams),
    proteinPer100: num(r.proteinPer100),
    carbsPer100: num(r.carbsPer100),
    fatPer100: num(r.fatPer100),
  }));
}
