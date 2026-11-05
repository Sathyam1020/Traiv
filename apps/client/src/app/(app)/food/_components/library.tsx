"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import { ArrowLeft, Camera, Copy, Minus, Plus, Trash } from "@traiv/ui/icons";
import { type ReactNode, useRef, useState } from "react";
import { ClientActionBar } from "@/components/layout/client-action-bar";
import { type FoodItem, foodApi, uploadFoodImage } from "@/lib/api/food";
import { Choice, useAction } from "./actions";
import { card, ErrorText, Field, Macros, Panel } from "./common";
import { BarcodeScanner, FoodSearch } from "./search";
export function MyLibrary({
  studio,
  kind,
  initialBarcode,
  onSelect,
  onClose,
}: {
  studio: string;
  kind: "food" | "recipe";
  initialBarcode?: string;
  onSelect: (item: FoodItem) => void;
  onClose: () => void;
}) {
  const api = foodApi(studio),
    qc = useQueryClient(),
    action = useAction();
  const query = useQuery({
    queryKey: ["food-library", studio, kind],
    queryFn: () => api.get<FoodItem[]>(`/search?mode=${kind === "recipe" ? "recipes" : "mine"}`),
  });
  const [editing, setEditing] = useState<FoodItem | null>(null),
    [create, setCreate] = useState(Boolean(initialBarcode)),
    [pendingBarcode, setPendingBarcode] = useState(initialBarcode);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["food-search", studio] });
    return qc.invalidateQueries({ queryKey: ["food-library", studio, kind] });
  };
  return (
    <Panel title={kind === "recipe" ? "My recipes" : "My foods"} onClose={onClose}>
      <Button
        className="mb-4 w-full"
        onClick={() => {
          setPendingBarcode(undefined);
          setEditing(null);
          setCreate(true);
        }}
      >
        <Plus className="size-4" />
        Create {kind}
      </Button>
      <ErrorText error={query.error ?? action.error} />
      {query.isPending ? <p>Loading…</p> : null}
      <div className="space-y-3">
        {query.data?.map((item) => (
          <article key={item.id} className={card}>
            <button type="button" className="w-full text-left" onClick={() => onSelect(item)}>
              <p className="font-semibold">{item.name}</p>
              <p className="my-2 text-caption text-fg-muted">
                {item.kcal} kcal / {kind === "food" ? (item.servingLabel ?? "100 g") : "serving"}
              </p>
              <Macros value={item} />
            </button>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(item);
                  setCreate(true);
                }}
              >
                Edit
              </Button>
              {kind === "recipe" ? (
                <Button
                  variant="ghost"
                  disabled={action.busy}
                  onClick={() => {
                    setEditing({ ...item, id: "", name: `${item.name} copy` });
                    setCreate(true);
                  }}
                >
                  <Copy className="size-4" />
                  Duplicate
                </Button>
              ) : null}
              <Button
                variant="ghost"
                aria-label={`Delete ${item.name}`}
                disabled={action.busy}
                onClick={() =>
                  action.run(async () => {
                    await api.delete(`/${kind === "food" ? "foods" : "recipes"}/${item.id}`);
                    await refresh();
                  })
                }
              >
                <Trash className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
      {query.data?.length === 0 ? (
        <p className="py-6 text-body-sm text-fg-muted">
          Create your first {kind} to log it again easily.
        </p>
      ) : null}
      {create ? (
        kind === "food" ? (
          <FoodEditor
            studio={studio}
            initial={editing}
            barcode={pendingBarcode}
            onCreated={onSelect}
            onClose={() => setCreate(false)}
            onSaved={refresh}
          />
        ) : (
          <RecipeEditor
            studio={studio}
            initial={editing}
            onClose={() => setCreate(false)}
            onSaved={refresh}
          />
        )
      ) : null}
    </Panel>
  );
}
function FoodEditor({
  studio,
  initial,
  barcode,
  onCreated,
  onClose,
  onSaved,
}: {
  studio: string;
  initial: FoodItem | null;
  barcode?: string;
  onCreated?: (item: FoodItem) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const action = useAction(),
    api = foodApi(studio),
    requestId = useRef(crypto.randomUUID());
  const [name, setName] = useState(initial?.name ?? ""),
    [values, setValues] = useState({
      kcal: String(initial?.per100?.kcal ?? initial?.kcal ?? ""),
      proteinG: String(initial?.per100?.proteinG ?? initial?.proteinG ?? ""),
      carbsG: String(initial?.per100?.carbsG ?? initial?.carbsG ?? ""),
      fatG: String(initial?.per100?.fatG ?? initial?.fatG ?? ""),
    }),
    [micros, setMicros] = useState<Record<string, number>>(
      initial?.per100Micronutrients ?? initial?.micronutrients ?? {},
    ),
    [basis, setBasis] = useState(initial?.baseUnit === "ml" ? "100ml" : "100g"),
    [serving, setServing] = useState("100"),
    [notice, setNotice] = useState("");
  const scan = async (file: File) => {
    const imageUrl = await uploadFoodImage(studio, file, "food-label");
    const result = await api.post<{
      name: string;
      basis: string;
      servingAmount: number | null;
      kcal: number | null;
      proteinG: number | null;
      carbsG: number | null;
      fatG: number | null;
      fiberG: number | null;
      sugarG: number | null;
      sodiumMg: number | null;
    }>("/label-scan", { imageUrl });
    setName(result.name);
    setBasis(result.basis);
    setServing(String(result.servingAmount ?? ""));
    setValues({
      kcal: String(result.kcal ?? ""),
      proteinG: String(result.proteinG ?? ""),
      carbsG: String(result.carbsG ?? ""),
      fatG: String(result.fatG ?? ""),
    });
    setMicros(
      Object.fromEntries(
        [
          ["Fiber (g)", result.fiberG],
          ["Sugar (g)", result.sugarG],
          ["Sodium (mg)", result.sodiumMg],
        ].filter((v): v is [string, number] => typeof v[1] === "number"),
      ),
    );
    setNotice("Check every value against the label before saving.");
  };
  const valid =
    Object.values(values).every((v) => v !== "" && Number.isFinite(Number(v)) && Number(v) >= 0) &&
    name.trim() &&
    (basis !== "serving" || Number(serving) > 0);
  return (
    <Panel
      title={initial ? "Edit food" : "Create food"}
      description="Enter nutrition per 100 g or 100 ml, or scan the package label."
      onClose={onClose}
    >
      <div className="space-y-4">
        <Field label="Scan nutrition label">
          <Input
            type="file"
            accept="image/*"
            capture="environment"
            disabled={action.busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void action.run(() => scan(file));
            }}
          />
        </Field>
        {notice ? (
          <p role="status" className="text-body-sm text-fg-muted">
            {notice}
          </p>
        ) : null}
        <Field label="Food name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Choice
          label="Label values are per"
          value={basis}
          options={["100g", "100ml", "serving"]}
          onChange={setBasis}
        />
        {basis === "serving" ? (
          <Field label="Serving weight (grams)">
            <Input
              type="number"
              min="0.01"
              value={serving}
              onChange={(e) => setServing(e.target.value)}
            />
          </Field>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(values).map(([key, value]) => (
            <Field
              key={key}
              label={key === "kcal" ? "Calories (kcal)" : `${key.replace("G", "")} (g)`}
            >
              <Input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <details className={card}>
          <summary className="cursor-pointer">Micronutrients</summary>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              "Fiber (g)",
              "Sugar (g)",
              "Sodium (mg)",
              "Saturated fat (g)",
              "Calcium (mg)",
              "Iron (mg)",
            ].map((key) => (
              <Field key={key} label={key}>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={micros[key] ?? ""}
                  onChange={(e) => setMicros({ ...micros, [key]: Number(e.target.value) })}
                />
              </Field>
            ))}
          </div>
        </details>
        <ErrorText error={action.error} />
        <Button
          className="w-full"
          disabled={action.busy || !valid}
          onClick={() =>
            action.run(async () => {
              const scale = basis !== "serving" ? 1 : 100 / Number(serving);
              const body = {
                id: initial?.id ?? requestId.current,
                barcode: initial?.barcode ?? barcode,
                baseUnit: basis === "100ml" ? "ml" : "grams",
                defaultUnit:
                  basis === "100ml"
                    ? null
                    : basis === "serving"
                      ? "serving"
                      : (initial?.servingUnit ?? null),
                gramsPerUnit:
                  basis === "100ml"
                    ? null
                    : basis === "serving"
                      ? Number(serving)
                      : initial?.servingUnit
                        ? initial.baseGrams
                        : null,
                name,
                kcal: Math.round(Number(values.kcal) * scale),
                proteinG: Number(values.proteinG) * scale,
                carbsG: Number(values.carbsG) * scale,
                fatG: Number(values.fatG) * scale,
                micronutrients: Object.fromEntries(
                  Object.entries(micros).map(([k, v]) => [k, v * scale]),
                ),
              };
              const saved = initial
                ? await api.put<FoodItem>(`/foods/${initial.id}`, body)
                : await api.post<FoodItem>("/foods", body);
              onSaved();
              onClose();
              if (!initial && barcode) onCreated?.(saved);
            })
          }
        >
          {action.busy ? "Saving…" : "Save food"}
        </Button>
      </div>
    </Panel>
  );
}
export function RecipeEditor({
  embedded = false,
  studio,
  initial,
  onClose,
  onSaved,
}: {
  embedded?: boolean;
  studio: string;
  initial: FoodItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const api = foodApi(studio),
    action = useAction(),
    id = useRef(initial?.id || crypto.randomUUID());
  const [name, setName] = useState(initial?.name ?? ""),
    [servings, setServings] = useState(String(initial?.servings ?? 1)),
    [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? null),
    [lines, setLines] = useState(
      (initial?.ingredients ?? []).map((l) => ({
        ...l,
        grams: l.grams * (initial?.servings ?? 1),
      })),
    ),
    [steps, setSteps] = useState(initial?.steps ?? []),
    [search, setSearch] = useState(false),
    [scanning, setScanning] = useState(false);
  function addIngredient(item: FoodItem) {
    if (item.kind !== "food" || item.baseUnit === "ml") return;
    setLines((previous) =>
      previous.some((line) => line.id === item.id)
        ? previous.map((line) =>
            line.id === item.id ? { ...line, grams: line.grams + 100 } : line,
          )
        : [
            ...previous,
            {
              id: item.id,
              name: item.name,
              grams: 100,
              nutrition: item.per100 ?? {
                kcal: item.kcal,
                proteinG: item.proteinG,
                carbsG: item.carbsG,
                fatG: item.fatG,
              },
            },
          ],
    );
  }
  const actions = (
    <div className="flex w-full items-center gap-3">
      <p className="min-w-0 flex-1 pl-3 text-caption text-fg-muted">
        {lines.length
          ? `${Math.round(lines.reduce((sum, line) => sum + ((line.nutrition?.kcal ?? 0) * line.grams) / 100, 0) / Math.max(1, Number(servings)))} kcal per serving`
          : "Add ingredients to see nutrition"}
      </p>
      <Button
        className="h-12 shrink-0 rounded-full bg-signal px-5 text-signal-fg hover:bg-signal/90"
        disabled={
          action.busy ||
          !name.trim() ||
          !lines.length ||
          lines.some((l) => !Number.isFinite(l.grams) || l.grams <= 0) ||
          !Number.isFinite(Number(servings)) ||
          Number(servings) > 50 ||
          Number(servings) < 1 ||
          steps.some((s) => !s.trim())
        }
        onClick={() =>
          action.run(async () => {
            const value = {
              id: id.current,
              expectedUpdatedAt: initial?.id ? initial.updatedAt : undefined,
              name,
              servings: Number(servings),
              imageUrl,
              steps,
              ingredients: lines.map((l) => ({ id: l.id, grams: l.grams })),
            };
            if (initial?.id) await api.put(`/recipes/${id.current}`, value);
            else await api.post("/recipes", value);
            onSaved();
            onClose();
          })
        }
      >
        {initial?.id ? "Save recipe" : "Create"}
      </Button>
    </div>
  );
  return (
    <RecipeFrame
      embedded={embedded}
      actions={actions}
      title={initial?.id ? "Edit recipe" : "Create recipe"}
      onClose={onClose}
    >
      <div className="space-y-5">
        <label className="relative -mx-4 flex h-52 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden bg-sunken">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Recipe cover"
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
          <span className="relative flex size-14 items-center justify-center rounded-full border border-line bg-surface text-signal-text">
            <Camera className="size-6" />
          </span>
          <span className="relative rounded-lg bg-surface/90 px-2 py-1 text-body-sm font-semibold">
            {imageUrl ? "Change cover photo" : "Add a cover photo"}
          </span>
          {!imageUrl ? (
            <span className="text-caption text-fg-muted">Optional — make it yours</span>
          ) : null}
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            disabled={action.busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                void action.run(async () =>
                  setImageUrl(await uploadFoodImage(studio, file, "food")),
                );
              e.target.value = "";
            }}
          />
        </label>
        <Field label="Recipe name">
          <Input
            placeholder="Recipe name…"
            className="h-14 border-0 bg-transparent text-heading font-semibold shadow-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Servings">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Decrease servings"
              disabled={Number(servings) <= 1}
              onClick={() => setServings(String(Math.max(1, Number(servings) - 1)))}
            >
              <Minus className="size-4" />
            </Button>
            <Input
              type="number"
              min="1"
              max="50"
              className="w-20 text-center"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="Increase servings"
              disabled={Number(servings) >= 50}
              onClick={() => setServings(String(Math.min(50, Number(servings) + 1)))}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </Field>
        <h3 className="font-semibold">Ingredients</h3>
        <p className="text-body-sm text-fg-muted">
          Search your food database and build your recipe ingredient by ingredient.
        </p>
        {lines.map((l, i) => (
          <div key={`${l.id}:${i}`} className="flex items-center gap-2">
            <span className="min-w-0 flex-1 text-body-sm">{l.name}</span>
            <Input
              className="w-24"
              aria-label={`${l.name} grams`}
              type="number"
              min="0.01"
              step="any"
              value={l.grams}
              onChange={(e) =>
                setLines(
                  lines.map((v, j) => (j === i ? { ...v, grams: Number(e.target.value) } : v)),
                )
              }
            />
            <span className="text-caption">g</span>
            <Button
              variant="ghost"
              aria-label={`Remove ${l.name}`}
              onClick={() => setLines(lines.filter((_, j) => j !== i))}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        ))}
        <Button className="w-full" variant="outline" onClick={() => setSearch(true)}>
          <Plus className="size-4" />
          Add ingredient
        </Button>
        <div className={card}>
          <p className="mb-2 text-caption text-fg-muted">Nutrition per serving</p>
          <p className="mb-2 text-body font-semibold">
            {Math.round(
              lines.reduce((n, l) => n + ((l.nutrition?.kcal ?? 0) * l.grams) / 100, 0) /
                Math.max(1, Number(servings)),
            )}{" "}
            kcal
          </p>
          <Macros
            value={lines.reduce(
              (sum, l) => ({
                kcal:
                  sum.kcal +
                  ((l.nutrition?.kcal ?? 0) * l.grams) / 100 / Math.max(1, Number(servings)),
                proteinG:
                  sum.proteinG +
                  ((l.nutrition?.proteinG ?? 0) * l.grams) / 100 / Math.max(1, Number(servings)),
                carbsG:
                  sum.carbsG +
                  ((l.nutrition?.carbsG ?? 0) * l.grams) / 100 / Math.max(1, Number(servings)),
                fatG:
                  sum.fatG +
                  ((l.nutrition?.fatG ?? 0) * l.grams) / 100 / Math.max(1, Number(servings)),
              }),
              { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
            )}
          />
        </div>
        <h3 className="font-semibold">Steps</h3>
        {steps.map((text, i) => (
          <div className="flex items-start gap-2" key={i}>
            <span className="pt-2 text-caption text-fg-muted">{i + 1}</span>
            <Textarea
              aria-label={`Step ${i + 1}`}
              value={text}
              onChange={(e) => setSteps(steps.map((v, j) => (j === i ? e.target.value : v)))}
            />
            <Button
              variant="ghost"
              aria-label={`Remove step ${i + 1}`}
              onClick={() => setSteps(steps.filter((_, j) => j !== i))}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={() => setSteps([...steps, ""])}>
          <Plus className="size-4" />
          Add step
        </Button>
        <ErrorText error={action.error} />
        {!embedded ? actions : null}
      </div>
      {search ? (
        <FoodSearch
          studio={studio}
          ingredientsOnly
          onClose={() => setSearch(false)}
          onBarcode={() => {
            setSearch(false);
            setScanning(true);
          }}
          onSelect={addIngredient}
        />
      ) : null}
      {scanning ? (
        <BarcodeScanner
          studio={studio}
          onClose={() => {
            setScanning(false);
            setSearch(true);
          }}
          onSelect={(item) => {
            addIngredient(item);
            setScanning(false);
            setSearch(true);
          }}
          onCreate={() => {
            setScanning(false);
            setSearch(true);
          }}
        />
      ) : null}
    </RecipeFrame>
  );
}

function RecipeFrame({
  embedded,
  actions,
  title,
  onClose,
  children,
}: {
  embedded: boolean;
  actions: ReactNode;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!embedded)
    return (
      <Panel title={title} onClose={onClose}>
        {children}
      </Panel>
    );
  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <header className="flex shrink-0 items-center gap-3 px-4 py-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Back to recipes"
          onClick={onClose}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="flex-1 text-center text-body font-semibold">{title}</h1>
        <span className="size-10" />
      </header>
      <div className="client-action-scroll min-h-0 flex-1 overflow-y-auto px-4">{children}</div>
      <ClientActionBar className="rounded-full border border-line bg-surface p-2 shadow-float">
        {actions}
      </ClientActionBar>
    </div>
  );
}
