"use client";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { ArrowLeft, Camera, ChevronRight, ClipboardList } from "@traiv/ui/icons";
import { useRef, useState } from "react";
import { type FoodItem, foodApi, uploadFoodImage } from "@/lib/api/food";
import { useAction } from "./actions";
import { ErrorText, Field } from "./common";

const categories = [
  "Meal",
  "Bread",
  "Dairy",
  "Yoghurt",
  "Cheese",
  "Fruit",
  "Vegetables",
  "Meat",
  "Fish",
  "Grains",
  "Drinks",
  "Chocolate",
  "Sweets",
  "Snack bar",
  "Protein supplement",
];
const nutrients = [
  { key: "kcal", name: "Calories", unit: "kcal" },
  { key: "proteinG", name: "Protein", unit: "g" },
  { key: "carbsG", name: "Carbs", unit: "g" },
  { key: "fatG", name: "Fat", unit: "g" },
  { key: "Saturated fat (g)", name: "Sat. fat", unit: "g" },
  { key: "Sugar (g)", name: "Sugars", unit: "g" },
  { key: "Fiber (g)", name: "Fiber", unit: "g" },
  { key: "Salt (NaCl) (g)", name: "Salt", unit: "g" },
] as const;
export function PersonalFoodEditor({
  studio,
  initial,
  onClose,
  onSaved,
}: {
  studio: string;
  initial: FoodItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const action = useAction();
  const id = useRef(initial?.id ?? crypto.randomUUID());
  const file = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState(Boolean(initial));
  const [name, setName] = useState(initial?.name ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [barcode, setBarcode] = useState(initial?.barcode ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [unit, setUnit] = useState(initial?.baseUnit ?? "grams");
  const [servingName, setServingName] = useState(initial?.servingUnit ?? "");
  const [serving, setServing] = useState(
    initial?.servingUnit ? String(initial.baseGrams ?? "") : "",
  );
  const [basis, setBasis] = useState("100");
  const [notice, setNotice] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const macro = initial?.per100 ?? initial;
    const micro = initial?.per100Micronutrients ?? initial?.micronutrients ?? {};
    return Object.fromEntries(
      nutrients.map((n) => [
        n.key,
        String(
          n.key === "kcal"
            ? (macro?.kcal ?? "")
            : n.key === "proteinG"
              ? (macro?.proteinG ?? "")
              : n.key === "carbsG"
                ? (macro?.carbsG ?? "")
                : n.key === "fatG"
                  ? (macro?.fatG ?? "")
                  : (micro[n.key] ?? ""),
        ),
      ]),
    );
  });
  async function scan(image: File) {
    const imageUrl = await uploadFoodImage(studio, image, "food-label");
    const result = await foodApi(studio).post<{
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
    setUnit(result.basis === "100ml" ? "ml" : "grams");
    setBasis(result.basis === "serving" ? "serving" : "100");
    setServing(String(result.servingAmount ?? ""));
    if (result.basis === "serving") setServingName("serving");
    setValues({
      kcal: String(result.kcal ?? ""),
      proteinG: String(result.proteinG ?? ""),
      carbsG: String(result.carbsG ?? ""),
      fatG: String(result.fatG ?? ""),
      "Fiber (g)": String(result.fiberG ?? ""),
      "Sugar (g)": String(result.sugarG ?? ""),
      "Salt (NaCl) (g)": result.sodiumMg === null ? "" : String((result.sodiumMg * 2.5) / 1000),
    });
    setNotice("Check every value against the label before saving.");
  }
  const valid =
    Boolean(name.trim() && values.kcal?.trim()) &&
    Object.values(values).every((v) => Number.isFinite(Number(v)) && Number(v) >= 0) &&
    (!barcode || /^\d{8,14}$/.test(barcode)) &&
    (basis !== "serving" || Number(serving) > 0) &&
    (!servingName.trim() || Number(serving) > 0);
  const panel = "space-y-4 rounded-3xl border border-line bg-surface p-4";
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <header className="flex shrink-0 items-center justify-between px-4 py-5">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Back"
          onClick={() => (method && !initial ? setMethod(false) : onClose())}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-body font-semibold">{initial ? "Edit food" : "Create food"}</h1>
        <span className="size-10" />
      </header>
      <input
        ref={file}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const image = e.target.files?.[0];
          if (image) {
            setMethod(true);
            void action.run(() => scan(image));
          }
          e.target.value = "";
        }}
      />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-6">
        {!method ? (
          <>
            <div className="text-center">
              <h2 className="text-body font-semibold">How do you want to add it?</h2>
              <p className="mt-2 text-body-sm text-fg-muted">
                Scan the nutrition label for a head start, or type it in yourself.
              </p>
            </div>
            <button
              disabled={action.busy}
              onClick={() => file.current?.click()}
              className={`${panel} flex w-full flex-col items-center py-10 text-center`}
            >
              <Camera className="mb-4 size-16 text-signal-text" />
              <strong>Snap label photo</strong>
              <p className="text-body-sm text-fg-muted">
                Point your camera at the nutrition label and we'll fill in what we can.
              </p>
              <span className="rounded-full bg-selected px-3 py-1 text-caption text-signal-text">
                Fastest way
              </span>
            </button>
            <button
              onClick={() => setMethod(true)}
              className={`${panel} flex w-full flex-col items-center py-10 text-center`}
            >
              <ClipboardList className="mb-4 size-16 text-signal-text" />
              <strong>Enter manually</strong>
              <p className="text-body-sm text-fg-muted">Type in the nutrition details yourself.</p>
            </button>
          </>
        ) : (
          <>
            <button
              disabled={action.busy}
              onClick={() => file.current?.click()}
              className="flex w-full items-center gap-3 rounded-3xl border border-line bg-surface p-4 text-left"
            >
              <Camera className="size-9 shrink-0 text-signal-text" />
              <span className="flex-1">
                <strong className="block text-body-sm">
                  {action.busy ? "Reading label…" : "Scan nutrition label"}
                </strong>
                <span className="text-caption text-fg-muted">
                  Snap a photo of the nutrition label and we'll fill in what we can.
                </span>
              </span>
              <ChevronRight className="size-5" />
            </button>
            {notice ? (
              <p role="status" className="text-body-sm text-fg-muted">
                {notice}
              </p>
            ) : null}
            <h2 className="font-semibold">Details</h2>
            <section className={panel}>
              <Field label="Name *">
                <Input
                  value={name}
                  maxLength={255}
                  placeholder="e.g. Greek yogurt 2%"
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="Brand">
                <Input
                  value={brand}
                  maxLength={200}
                  placeholder="e.g. Fage"
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Field>
              <Field label="Barcode">
                <Input
                  value={barcode}
                  inputMode="numeric"
                  placeholder="Optional"
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </Field>
              <Field label="Base unit">
                <div className="flex rounded-xl bg-sunken p-1">
                  {[
                    { id: "grams", name: "Grams (solid)" },
                    { id: "ml", name: "Millilitres (liquid)" },
                  ].map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setUnit(u.id === "ml" ? "ml" : "grams")}
                      className={`flex-1 rounded-lg px-2 py-3 text-caption ${unit === u.id ? "bg-surface shadow-sm" : "text-fg-muted"}`}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              </Field>
            </section>
            <h2 className="font-semibold">Category</h2>
            <section className={panel}>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(category === c ? "" : c)}
                    className={`shrink-0 rounded-2xl border px-3 py-4 text-caption ${category === c ? "border-signal bg-selected text-signal-text" : "border-line"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-caption text-fg-muted">
                Optional — picks the category shown next to this food.
              </p>
            </section>
            <h2 className="font-semibold">Serving</h2>
            <section className={panel}>
              <Field label="Serving name (optional)">
                <Input
                  value={servingName}
                  placeholder="e.g. 1 cup, 1 bar"
                  onChange={(e) => setServingName(e.target.value)}
                />
              </Field>
              <Field label={`Serving size (${unit === "ml" ? "ml" : "g"}) (optional)`}>
                <Input
                  value={serving}
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="0"
                  onChange={(e) => setServing(e.target.value)}
                />
              </Field>
            </section>
            <h2 className="font-semibold">Nutrition</h2>
            <section className={panel}>
              <Field label="Values are per">
                <div className="flex rounded-xl bg-sunken p-1">
                  {[
                    { id: "100", name: `100 ${unit === "ml" ? "ml" : "g"}` },
                    { id: "serving", name: "1 serving" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBasis(b.id)}
                      className={`flex-1 rounded-lg py-3 text-body-sm ${basis === b.id ? "bg-surface shadow-sm" : "text-fg-muted"}`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </Field>
              {nutrients.map((n, i) => (
                <div key={n.key}>
                  {i === 4 ? (
                    <p className="pb-4 text-body-sm text-fg-muted">Optional nutrients</p>
                  ) : null}
                  <label className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
                    <span>
                      <span className="block text-body-sm">{n.name}</span>
                      <span className="text-caption text-fg-muted">
                        {i === 0 ? "Required" : "Optional"}
                      </span>
                    </span>
                    <div className="relative w-28 shrink-0">
                      <Input
                        aria-label={n.name}
                        value={values[n.key] ?? ""}
                        onChange={(e) => setValues({ ...values, [n.key]: e.target.value })}
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        placeholder="0"
                        className="h-11 rounded-2xl pr-10 text-right"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-caption text-fg-muted">
                        {n.unit}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </section>
            {!valid ? (
              <p className="text-center text-caption text-fg-muted">
                Fill in a name and calories. Per-serving values need a serving size.
              </p>
            ) : null}
            <Button
              disabled={!valid || action.busy}
              className="h-14 w-full rounded-full bg-signal text-signal-fg hover:bg-signal/90"
              onClick={() =>
                void action.run(async () => {
                  const factor = basis === "serving" ? 100 / Number(serving) : 1;
                  const micro = Object.fromEntries(
                    nutrients.slice(4).map((n) => [n.key, Number(values[n.key] ?? 0) * factor]),
                  );
                  const body = {
                    id: id.current,
                    name: name.trim(),
                    brand: brand.trim() || null,
                    barcode: barcode || undefined,
                    category: category || null,
                    baseUnit: unit,
                    defaultUnit: servingName.trim() || (Number(serving) > 0 ? "serving" : null),
                    gramsPerUnit: Number(serving) > 0 ? Number(serving) : null,
                    kcal: Math.round(Number(values.kcal) * factor),
                    proteinG: Number(values.proteinG ?? 0) * factor,
                    carbsG: Number(values.carbsG ?? 0) * factor,
                    fatG: Number(values.fatG ?? 0) * factor,
                    micronutrients: { ...(initial?.per100Micronutrients ?? {}), ...micro },
                  };
                  if (initial) await foodApi(studio).put(`/foods/${initial.id}`, body);
                  else await foodApi(studio).post("/foods", body);
                  onSaved();
                  onClose();
                })
              }
            >
              {action.busy ? "Saving…" : initial ? "Save food" : "Create food"}
            </Button>
          </>
        )}
        <ErrorText error={action.error} />
      </div>
    </div>
  );
}
