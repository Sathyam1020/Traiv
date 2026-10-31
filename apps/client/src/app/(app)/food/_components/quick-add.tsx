"use client";
import { useRef, useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@traiv/ui/components/select";
import { Plus } from "@traiv/ui/icons";
import { foodApi, slots, type Slot } from "@/lib/api/food";
import { Panel, Field, ErrorText } from "./common";
export function QuickAdd({
  studio,
  date,
  slot: initialSlot,
  onSaved,
  onClose,
}: {
  studio: string;
  date: string;
  slot: Slot;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [slot, setSlot] = useState(initialSlot);
  const [name, setName] = useState(""),
    [values, setValues] = useState({ kcal: "", proteinG: "", carbsG: "", fatG: "" }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null),
    id = useRef(crypto.randomUUID());
  return (
    <Panel
      title="Log food"
      eyebrow={
        <span className="inline-flex items-center gap-1">
          Quick add to{" "}
          <Select
            value={slot}
            onValueChange={(value) => {
              const selected = slots.find((meal) => meal === value);
              if (selected) setSlot(selected);
            }}
          >
            <SelectTrigger
              aria-label="Meal"
              className="h-auto w-auto gap-1 border-0 bg-transparent p-0 text-caption font-semibold uppercase text-signal-text shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {slots.map((meal) => (
                <SelectItem key={meal} value={meal} className="capitalize">
                  {meal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      }
      onClose={onClose}
    >
      <div className="space-y-5">
        <Field label="Name">
          <Input
            placeholder="e.g. Homemade smoothie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-2xl"
          />
        </Field>
        <Field label="Calories">
          <div className="relative">
            <Input
              aria-label="Calories"
              inputMode="decimal"
              type="number"
              min="0"
              placeholder="0"
              value={values.kcal}
              onChange={(e) => setValues({ ...values, kcal: e.target.value })}
              className="h-12 rounded-2xl pr-12"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-caption text-fg-muted">
              kcal
            </span>
          </div>
        </Field>
        <fieldset className="min-w-0">
          <legend className="mb-2 text-body-sm text-fg-muted">Macros (optional)</legend>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "proteinG", name: "Protein", color: "text-macro-protein" },
                { key: "carbsG", name: "Carbs", color: "text-macro-carbs" },
                { key: "fatG", name: "Fat", color: "text-macro-fat" },
              ] as const
            ).map((m) => (
              <label
                key={m.key}
                className="min-w-0 rounded-2xl border border-line bg-surface px-3 py-2"
              >
                <span className={`text-caption ${m.color}`}>{m.name}</span>
                <div className="flex items-center gap-1">
                  <input
                    aria-label={`${m.name} grams`}
                    inputMode="decimal"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={values[m.key]}
                    onChange={(e) => setValues({ ...values, [m.key]: e.target.value })}
                    className="h-8 w-full min-w-0 bg-transparent text-body outline-none focus-visible:ring-1 focus-visible:ring-line-focus"
                  />
                  <span className="text-caption text-fg-muted">g</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
        <ErrorText error={error} />
        <Button
          className="h-14 w-full rounded-full bg-signal text-signal-fg hover:bg-signal/90"
          disabled={
            busy ||
            !date ||
            !name.trim() ||
            !Number.isFinite(Number(values.kcal)) ||
            Number(values.kcal) <= 0 ||
            Object.values(values).some((v) => !Number.isFinite(Number(v)) || Number(v) < 0)
          }
          onClick={async () => {
            setBusy(true);
            try {
              await foodApi(studio).post("/entries", {
                id: id.current,
                kind: "manual",
                name,
                date,
                slot,
                mode: "serving",
                quantity: 1,
                nutrition: Object.fromEntries(
                  Object.entries(values).map(([k, v]) => [k, Number(v)]),
                ),
              });
              onSaved();
              onClose();
            } catch (e) {
              setError(e);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? (
            "Saving…"
          ) : (
            <>
              <Plus className="size-5" />
              Add to {slot}
            </>
          )}
        </Button>
      </div>
    </Panel>
  );
}
