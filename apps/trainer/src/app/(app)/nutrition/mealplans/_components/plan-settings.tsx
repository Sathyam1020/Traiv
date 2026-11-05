"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PlanDocument, PlanSettings, PlanSlot } from "@traiv/nutrition/meal-plans";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Textarea } from "@traiv/ui/components/textarea";
import { Check, GripVertical, Plus, Trash } from "@traiv/ui/icons";
import { useEffect, useRef, useState } from "react";
import { mealPlansApi } from "@/lib/api/meal-plans";
import { ALLERGENS, DIETS, Field, Pick } from "../../_components/controls";
import { MediaField } from "../../_components/media-field";

export function emptyMealPlan(): PlanDocument {
  return {
    settings: {
      name: "",
      description: "",
      coverImageUrl: null,
      calorieTarget: 2000,
      recipesPerMeal: 4,
      proteinPct: 30,
      carbsPct: 40,
      fatPct: 30,
      dietaryPreferences: [],
      allergensToAvoid: [],
      recipeSourceSetting: "all",
      recipeMatching: "scale",
    },
    slots: [
      "Breakfast",
      "Morning Snack",
      "Lunch",
      "Afternoon Snack",
      "Dinner",
      "Evening Snack",
    ].map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      percentage: [25, 0, 35, 0, 40, 0][index] ?? 0,
      enabled: [0, 2, 4].includes(index),
      options: [],
    })),
  };
}
export function settingsValid(document: PlanDocument) {
  const s = document.settings;
  return (
    Boolean(s.name.trim()) &&
    s.name.length <= 40 &&
    s.calorieTarget >= 100 &&
    s.calorieTarget <= 20000 &&
    Number.isInteger(s.calorieTarget) &&
    s.recipesPerMeal >= 1 &&
    s.recipesPerMeal <= 20 &&
    Number.isInteger(s.recipesPerMeal) &&
    [s.proteinPct, s.carbsPct, s.fatPct].every((p) => p >= 0 && p <= 100) &&
    Math.abs(s.proteinPct + s.carbsPct + s.fatPct - 100) < 0.01 &&
    document.slots.some((m) => m.enabled) &&
    document.slots.filter((m) => m.enabled).reduce((n, m) => n + m.percentage, 0) === 100 &&
    document.slots.every(
      (m) =>
        m.name.trim() &&
        m.percentage >= 0 &&
        m.percentage <= 100 &&
        Number.isInteger(m.percentage) &&
        (!m.enabled ? m.percentage === 0 : m.percentage > 0),
    ) &&
    new Set(document.slots.map((m) => m.name.trim().toLowerCase())).size === document.slots.length
  );
}
export function PlanSettingsSheet({
  initial,
  studioId,
  create = false,
  busy,
  error,
  close,
  submit,
  draft,
  clientPlan = false,
  recommendedKcal,
}: {
  clientPlan?: boolean;
  recommendedKcal?: number;
  initial: PlanDocument;
  studioId: string;
  create?: boolean;
  busy: boolean;
  error: string;
  close: () => void;
  submit: (document: PlanDocument) => void;
  draft?: (document: PlanDocument) => void;
}) {
  const [document, setDocument] = useState<PlanDocument>(() => structuredClone(initial));
  const [mode, setMode] = useState("%");
  const [customMacros, setCustomMacros] = useState(false);
  const [presetName, setPresetName] = useState<string | null>(null);
  const [presetError, setPresetError] = useState("");
  const [presetBusy, setPresetBusy] = useState(false);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const moving = useRef<number | null>(null);
  const qc = useQueryClient();
  const presets = useQuery({
    queryKey: ["mealplan-presets", studioId],
    queryFn: () => mealPlansApi.presets(studioId),
    enabled: Boolean(studioId),
  });
  const draftCallback = useRef(draft);
  draftCallback.current = draft;
  useEffect(() => {
    draftCallback.current?.(document);
  }, [document]);
  const settings = document.settings;
  const patch = (change: Partial<PlanSettings>) =>
    setDocument((d) => ({ ...d, settings: { ...d.settings, ...change } }));
  const slots = (next: PlanSlot[]) => setDocument((d) => ({ ...d, slots: next }));
  const total = settings.proteinPct + settings.carbsPct + settings.fatPct;
  const distribution = document.slots
    .filter((m) => m.enabled)
    .reduce((n, m) => n + m.percentage, 0);
  const changed = JSON.stringify(document) !== JSON.stringify(initial);
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= document.slots.length) return;
    const next = [...document.slots];
    const [item] = next.splice(from, 1);
    if (item) {
      next.splice(to, 0, item);
      slots(next);
      moving.current = to;
      setMessage(`${item.name} moved to position ${to + 1}`);
    }
  };
  const presetOptions = [
    { name: "Default 30/40/30", proteinPct: 30, carbsPct: 40, fatPct: 30 },
    { name: "High Protein (P40/C40/F20)", proteinPct: 40, carbsPct: 40, fatPct: 20 },
    { name: "Low Carb (P50/C25/F25)", proteinPct: 50, carbsPct: 25, fatPct: 25 },
    { name: "Muscle Gain (P30/C50/F20)", proteinPct: 30, carbsPct: 50, fatPct: 20 },
    { name: "Balanced (P40/C30/F30)", proteinPct: 40, carbsPct: 30, fatPct: 30 },
    ...(presets.data ?? []).filter(
      (p) =>
        ![
          "Default 30/40/30",
          "High Protein (P40/C40/F20)",
          "Low Carb (P50/C25/F25)",
          "Muscle Gain (P30/C50/F20)",
          "Balanced (P40/C30/F30)",
          "Custom",
        ].includes(p.name),
    ),
  ];
  const selectedPreset =
    presetOptions.find(
      (p) =>
        p.proteinPct === settings.proteinPct &&
        p.carbsPct === settings.carbsPct &&
        p.fatPct === settings.fatPct,
    )?.name ?? "Custom";
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open && !busy) close();
      }}
    >
      <SheetContent
        className="w-full gap-0 sm:max-w-5xl"
        onInteractOutside={(event) => {
          if (changed || busy) event.preventDefault();
        }}
      >
        <SheetHeader className="shrink-0 border-b border-line px-6 py-5">
          <SheetTitle>
            {clientPlan
              ? create
                ? "New client meal plan"
                : "Edit client meal plan"
              : create
                ? "New meal plan template"
                : "Edit meal plan template"}
          </SheetTitle>
          <SheetDescription>Configure meal options and daily nutrition targets.</SheetDescription>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy && settingsValid(document)) submit(document);
          }}
        >
          <fieldset
            disabled={busy}
            className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5"
          >
            <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-5">
                <Field label={`Template name · ${settings.name.length}/40`}>
                  <Input
                    aria-label="Template name"
                    maxLength={40}
                    required
                    placeholder="e.g. 4-week high protein plan"
                    value={settings.name}
                    onChange={(e) => patch({ name: e.target.value })}
                  />
                </Field>
                <Field label={`Description · ${settings.description.length}/4096`}>
                  <Textarea
                    className="min-h-32"
                    aria-label="Plan description"
                    maxLength={4096}
                    placeholder="Add a note for the meal plan"
                    value={settings.description}
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </Field>
                <MediaField
                  studioId={studioId}
                  kind="mealplan-cover"
                  label="Cover image"
                  value={settings.coverImageUrl ?? ""}
                  onChange={(url) => patch({ coverImageUrl: url || null })}
                />
                {settings.coverImageUrl ? (
                  <img
                    src={settings.coverImageUrl}
                    alt="Meal plan cover"
                    className="aspect-video w-full rounded-control object-cover"
                  />
                ) : null}
                <h3 className="border-t border-line pt-5 text-body-sm font-semibold">
                  Preferences
                </h3>
                <ChipChoices
                  label="Dietary preferences to favor"
                  options={DIETS}
                  values={settings.dietaryPreferences}
                  onChange={(dietaryPreferences) => patch({ dietaryPreferences })}
                />
                <ChipChoices
                  label="Allergens to avoid"
                  options={ALLERGENS}
                  values={settings.allergensToAvoid}
                  onChange={(allergensToAvoid) => patch({ allergensToAvoid })}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-5">
                <h3 className="text-body-sm font-semibold">Nutrition targets</h3>
                {recommendedKcal ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-control bg-warning-subtle p-3 text-body-sm text-warning">
                    <span>{recommendedKcal.toLocaleString()} kcal recommended for this client</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => patch({ calorieTarget: recommendedKcal })}
                    >
                      Apply
                    </Button>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <Stepper
                    label="Calories"
                    value={settings.calorieTarget}
                    min={100}
                    max={20000}
                    step={50}
                    change={(calorieTarget) => patch({ calorieTarget })}
                  />
                  <Stepper
                    label="Recipes per meal"
                    value={settings.recipesPerMeal}
                    min={1}
                    max={20}
                    step={1}
                    change={(recipesPerMeal) => patch({ recipesPerMeal })}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-line pt-5">
                  <h3 className="text-body-sm font-semibold">Macro split</h3>
                  <div className="flex rounded-control bg-sunken p-1">
                    {["%", "g"].map((v) => (
                      <Button
                        key={v}
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-pressed={mode === v}
                        className={mode === v ? "bg-surface text-fg" : "text-fg-muted"}
                        onClick={() => setMode(v)}
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                </div>
                <p
                  className={
                    Math.abs(total - 100) < 0.01
                      ? "flex items-center gap-2 text-caption text-success"
                      : "text-caption text-danger"
                  }
                >
                  {Math.abs(total - 100) < 0.01 ? <Check className="size-4" /> : null}Total:{" "}
                  {Math.round(total * 100) / 100}%
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      ["proteinPct", "Protein", 4],
                      ["carbsPct", "Carbs", 4],
                      ["fatPct", "Fat", 9],
                    ] as const
                  ).map(([key, label, energy]) => (
                    <Field key={key} label={label}>
                      <Input
                        aria-label={`${label} target ${mode}`}
                        type="number"
                        min={0}
                        step="any"
                        value={
                          mode === "%"
                            ? settings[key]
                            : Math.round(
                                ((settings.calorieTarget * settings[key]) / 100 / energy) * 10,
                              ) / 10
                        }
                        onChange={(e) =>
                          patch({
                            [key]:
                              Math.round(
                                (mode === "%"
                                  ? Number(e.target.value)
                                  : ((Number(e.target.value) * energy) /
                                      Math.max(1, settings.calorieTarget)) *
                                    100) * 100,
                              ) / 100,
                          })
                        }
                      />
                    </Field>
                  ))}
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-sunken">
                  {(
                    [
                      [settings.proteinPct, "bg-macro-protein"],
                      [settings.carbsPct, "bg-macro-carbs"],
                      [settings.fatPct, "bg-macro-fat"],
                    ] as const
                  ).map(([n, color]) => (
                    <div key={color} className={color} style={{ width: `${Math.max(0, n)}%` }} />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pick
                    label="Macro preset"
                    value={customMacros ? "Custom" : selectedPreset}
                    options={[...presetOptions.map((p) => p.name), "Custom"]}
                    onChange={(name) => {
                      setCustomMacros(name === "Custom");
                      const p = presetOptions.find((x) => x.name === name);
                      if (p)
                        patch({ proteinPct: p.proteinPct, carbsPct: p.carbsPct, fatPct: p.fatPct });
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => setPresetName("")}>
                    Save as preset…
                  </Button>
                </div>
                {presetName !== null ? (
                  <div className="flex gap-2">
                    <Input
                      aria-label="Preset name"
                      maxLength={40}
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Preset name"
                    />
                    <Button
                      type="button"
                      disabled={presetBusy || !presetName.trim() || Math.abs(total - 100) >= 0.01}
                      onClick={async () => {
                        setPresetBusy(true);
                        setPresetError("");
                        try {
                          await mealPlansApi.savePreset(studioId, {
                            id: crypto.randomUUID(),
                            name: presetName,
                            proteinPct: settings.proteinPct,
                            carbsPct: settings.carbsPct,
                            fatPct: settings.fatPct,
                          });
                          await qc.invalidateQueries({ queryKey: ["mealplan-presets", studioId] });
                          setPresetName(null);
                        } catch (e) {
                          setPresetError(e instanceof Error ? e.message : "Couldn't save preset.");
                        } finally {
                          setPresetBusy(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setPresetName(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : null}
                {presets.isError || presetError ? (
                  <p role="alert" className="text-caption text-danger">
                    {presetError || "Couldn't load presets. You can still enter targets manually."}
                  </p>
                ) : null}
                <h3 className="border-t border-line pt-5 text-body-sm font-semibold">
                  Meal distribution
                </h3>
                <p className="sr-only" role="status">
                  {message}
                </p>
                <div className="flex flex-col gap-2">
                  {document.slots.map((slot, index) => (
                    <div
                      key={slot.id}
                      data-meal-slot={index}
                      className="flex min-w-0 flex-wrap items-center gap-2 rounded-control bg-sunken p-3"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="touch-none cursor-grab"
                        aria-label={`Reorder ${slot.name}`}
                        onPointerDown={(e) => {
                          if (e.button !== 0) return;
                          e.preventDefault();
                          moving.current = index;
                          e.currentTarget.setPointerCapture(e.pointerId);
                        }}
                        onPointerMove={(e) => {
                          if (moving.current === null || !e.buttons) return;
                          const row = window.document
                            .elementFromPoint(e.clientX, e.clientY)
                            ?.closest<HTMLElement>("[data-meal-slot]");
                          if (row) move(moving.current, Number(row.dataset.mealSlot));
                        }}
                        onPointerUp={() => {
                          moving.current = null;
                        }}
                        onPointerCancel={() => {
                          moving.current = null;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                            move(index, index + (e.key === "ArrowUp" ? -1 : 1));
                          }
                        }}
                      >
                        <GripVertical className="size-4" />
                      </Button>
                      <span className="min-w-0 flex-1 text-body-sm">{slot.name}</span>
                      <Input
                        aria-label={`${slot.name} percentage`}
                        type="number"
                        disabled={!slot.enabled}
                        className="w-20"
                        min={0}
                        max={100}
                        value={slot.percentage}
                        onChange={(e) =>
                          slots(
                            document.slots.map((s, n) =>
                              n === index ? { ...s, percentage: Number(e.target.value) } : s,
                            ),
                          )
                        }
                      />
                      <span className="text-caption">%</span>
                      <input
                        type="checkbox"
                        role="switch"
                        aria-label={`Enable ${slot.name}`}
                        className="size-5 accent-signal"
                        checked={slot.enabled}
                        onChange={(e) =>
                          slots(
                            document.slots.map((s, n) =>
                              n === index
                                ? {
                                    ...s,
                                    enabled: e.target.checked,
                                    percentage: e.target.checked ? 10 : 0,
                                  }
                                : s,
                            ),
                          )
                        }
                      />
                      {![
                        "Breakfast",
                        "Morning Snack",
                        "Lunch",
                        "Afternoon Snack",
                        "Dinner",
                        "Evening Snack",
                      ].includes(slot.name) ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${slot.name}`}
                          onClick={() => slots(document.slots.filter((s) => s.id !== slot.id))}
                        >
                          <Trash className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-3">
                  <span
                    className={
                      distribution === 100
                        ? "text-caption text-success"
                        : "text-caption text-danger"
                    }
                  >
                    Total: {distribution}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    aria-label="Custom meal name"
                    maxLength={80}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Custom meal name"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      !custom.trim() ||
                      document.slots.length >= 12 ||
                      document.slots.some(
                        (s) => s.name.toLowerCase() === custom.trim().toLowerCase(),
                      )
                    }
                    onClick={() => {
                      slots([
                        ...document.slots,
                        {
                          id: crypto.randomUUID(),
                          name: custom.trim(),
                          enabled: false,
                          percentage: 0,
                          options: [],
                        },
                      ]);
                      setCustom("");
                    }}
                  >
                    <Plus className="size-4" />
                    Add meal
                  </Button>
                </div>
              </div>
            </div>
            <Distribution document={document} change={slots} />
            <div className="grid grid-cols-1 gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <RadioChoices
                label="Recipe source"
                value={settings.recipeSourceSetting}
                options={[
                  ["all", "All recipes", "Shared library and your own collection."],
                  ["mine", "My recipes only", "Only your Personal recipes."],
                ]}
                change={(v) => patch({ recipeSourceSetting: v === "mine" ? "mine" : "all" })}
              />
              <RadioChoices
                label="Recipe matching"
                value={settings.recipeMatching}
                options={[
                  [
                    "scale",
                    "Scale to targets",
                    "Adjust ingredient quantities toward meal targets.",
                  ],
                  [
                    "best_match",
                    "Best match, unscaled",
                    "Keep original quantities and choose the closest fit.",
                  ],
                ]}
                change={(v) => patch({ recipeMatching: v === "scale" ? "scale" : "best_match" })}
              />
            </div>
            {!create && settings.recipesPerMeal < initial.settings.recipesPerMeal ? (
              <p className="text-body-sm text-warning">
                Saving removes surplus unlocked options. Locked options are retained.
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="text-body-sm text-danger">
                {error}
              </p>
            ) : null}
          </fieldset>
          <footer className="flex shrink-0 justify-end gap-3 border-t border-line bg-panel px-6 py-4">
            <Button type="button" variant="outline" disabled={busy} onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={busy || !settingsValid(document) || (!create && !changed)}
            >
              {busy
                ? create
                  ? "Selecting recipes…"
                  : "Updating template…"
                : clientPlan
                  ? "Save plan"
                  : "Save template"}
            </Button>
          </footer>
        </form>
      </SheetContent>
    </Sheet>
  );
}
function ChipChoices({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-body-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            size="sm"
            className={
              values.includes(option)
                ? "rounded-full border-signal bg-signal-subtle text-signal-text"
                : "rounded-full text-fg-muted"
            }
            aria-pressed={values.includes(option)}
            onClick={() =>
              onChange(
                values.includes(option) ? values.filter((v) => v !== option) : [...values, option],
              )
            }
          >
            {option}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
function Stepper({
  label,
  value,
  min,
  max,
  step,
  change,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  change: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center rounded-control border border-line bg-surface p-1">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => change(Math.max(min, value - step))}
        >
          −
        </Button>
        <Input
          aria-label={label}
          className="min-w-0 border-0 bg-transparent px-1 text-center text-lead"
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => change(Number(e.target.value))}
        />
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => change(Math.min(max, value + step))}
        >
          +
        </Button>
      </div>
    </Field>
  );
}
function RadioChoices({
  label,
  value,
  options,
  change,
}: {
  label: string;
  value: string;
  options: string[][];
  change: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-body-sm font-semibold">{label}</legend>
      <div className="overflow-hidden rounded-control border border-line">
        {options.map(([key, title, hint]) => (
          <label
            key={key}
            className={`flex cursor-pointer items-start gap-3 border-b border-line p-4 last:border-0 ${key === value ? "bg-signal-subtle" : "bg-surface"}`}
          >
            <input
              type="radio"
              name={label}
              value={key}
              checked={key === value}
              onChange={() => {
                if (key) change(key);
              }}
              className="mt-1 accent-signal"
            />
            <span>
              <span className="block text-body-sm font-medium">{title}</span>
              <span className="text-caption text-fg-muted">{hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function Distribution({
  document,
  change,
}: {
  document: PlanDocument;
  change: (slots: PlanSlot[]) => void;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const drag = useRef<{ left: string; right: string; x: number; a: number; b: number } | null>(
    null,
  );
  const enabled = document.slots.filter((s) => s.enabled);
  const adjust = (left: string, right: string, amount: number) => {
    const a = document.slots.find((s) => s.id === left),
      b = document.slots.find((s) => s.id === right);
    if (!a || !b) return;
    const delta = Math.max(1 - a.percentage, Math.min(b.percentage - 1, amount));
    change(
      document.slots.map((s) =>
        s.id === left
          ? { ...s, percentage: s.percentage + delta }
          : s.id === right
            ? { ...s, percentage: s.percentage - delta }
            : s,
      ),
    );
  };
  return (
    <section className="flex flex-col gap-3 border-t border-line pt-5">
      <h3 className="text-body-sm font-semibold">Distribution slider</h3>
      <div
        ref={bar}
        className="flex min-h-24 items-stretch overflow-hidden rounded-control border border-line bg-sunken"
      >
        {enabled.map((slot, index) => (
          <div
            key={slot.id}
            className="relative min-w-0 border-r border-line bg-signal-subtle p-3 last:border-0"
            style={{ width: `${slot.percentage}%` }}
          >
            <span className="block truncate text-body-sm font-medium">{slot.name}</span>
            <span className="block text-caption text-fg-muted">
              {slot.percentage}% ·{" "}
              {Math.round((document.settings.calorieTarget * slot.percentage) / 100)} kcal
            </span>
            {enabled[index + 1] ? (
              <button
                type="button"
                role="separator"
                aria-label={`Adjust ${slot.name} and ${enabled[index + 1]?.name}`}
                aria-orientation="vertical"
                aria-valuenow={slot.percentage}
                aria-valuemin={1}
                aria-valuemax={slot.percentage + (enabled[index + 1]?.percentage ?? 0) - 1}
                className="absolute inset-y-0 right-0 z-10 w-3 touch-none cursor-col-resize border-r-2 border-signal outline-none focus-visible:bg-signal/30"
                onPointerDown={(e) => {
                  const next = enabled[index + 1];
                  if (!next) return;
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = {
                    left: slot.id,
                    right: next.id,
                    x: e.clientX,
                    a: slot.percentage,
                    b: next.percentage,
                  };
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (!d || !bar.current) return;
                  const delta = Math.round(
                    ((e.clientX - d.x) / bar.current.getBoundingClientRect().width) * 100,
                  );
                  const a = Math.max(1, Math.min(d.a + d.b - 1, d.a + delta));
                  change(
                    document.slots.map((s) =>
                      s.id === d.left
                        ? { ...s, percentage: a }
                        : s.id === d.right
                          ? { ...s, percentage: d.a + d.b - a }
                          : s,
                    ),
                  );
                }}
                onPointerUp={() => {
                  drag.current = null;
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
                onKeyDown={(e) => {
                  const next = enabled[index + 1];
                  if (next && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                    e.preventDefault();
                    adjust(slot.id, next.id, e.key === "ArrowRight" ? 1 : -1);
                  }
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-caption text-fg-subtle">
        Drag a boundary or focus it and use the arrow keys to adjust neighbouring meals.
      </p>
    </section>
  );
}
