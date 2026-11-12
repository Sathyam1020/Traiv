"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Calendar } from "@traiv/ui/components/calendar";
import { Input } from "@traiv/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { Textarea } from "@traiv/ui/components/textarea";
import { CalendarDays, Minus, Plus, Star } from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics/track";
import { type Entry, type FoodItem, foodApi, localDay, type Slot, slots } from "@/lib/api/food";
import { card, ErrorText, Field, NutritionRing, Panel } from "./common";
export function Logger({
  studio,
  item,
  entry,
  date: initialDate,
  slot: initialSlot,
  initialQuantity = 1,
  onClose,
  onSaved,
}: {
  studio: string;
  item: FoodItem;
  entry?: Entry;
  initialQuantity?: number;
  date: string;
  slot: Slot;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [quantity, setQuantity] = useState(entry?.quantity ?? initialQuantity),
    [mode, setMode] = useState<"serving" | "grams" | "ml">(entry?.unit ?? "serving"),
    [date, setDate] = useState(initialDate),
    [slot, setSlot] = useState(initialSlot),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null),
    [notice, setNotice] = useState(""),
    [reporting, setReporting] = useState(false),
    [report, setReport] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const requestId = useRef(crypto.randomUUID());
  const reportId = useRef(crypto.randomUUID());
  const api = foodApi(studio);
  const favorites = useQuery({
    queryKey: ["food-favorites", studio],
    queryFn: () => api.get<{ kind: string; resourceId: string }[]>("/favorites"),
  });
  const favoriteTarget =
    item.kind === "food"
      ? { kind: "food", id: item.id }
      : item.kind === "recipe"
        ? { kind: "recipe", id: item.id }
        : item.recipeId
          ? { kind: "recipe", id: item.recipeId }
          : null;
  const favorite =
    favorites.data?.some(
      (f) => f.kind === favoriteTarget?.kind && f.resourceId === favoriteTarget?.id,
    ) ?? false;

  const scale =
    mode === "grams"
      ? quantity / (item.baseGrams ?? 100)
      : mode === "ml"
        ? quantity / (item.baseGrams ?? 100)
        : quantity;
  const value = {
    kcal: item.kcal * scale,
    proteinG: item.proteinG * scale,
    carbsG: item.carbsG * scale,
    fatG: item.fatG * scale,
  };
  async function save() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (entry)
        await api.patch(`/entries/${entry.id}`, { revision: entry.revision, date, slot, quantity });
      else {
        await api.post("/entries", {
          id: requestId.current,
          date,
          slot,
          kind: item.kind,
          resourceId: item.id,
          planId: item.planId,
          quantity,
          mode,
          ...(item.kind === "manual"
            ? {
                name: item.name,
                nutrition: {
                  kcal: item.kcal,
                  proteinG: item.proteinG,
                  carbsG: item.carbsG,
                  fatG: item.fatG,
                },
              }
            : {}),
        });
        // Never the food name or quantity — see `privacy-security.md`. Only on a fresh
        // log, not the edit/PATCH branch above.
        void track("meal_logged", { kind: item.kind });
      }
      notifyAction(entry ? "Changes saved" : "Meal logged", "success");
      onSaved();
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  async function action(fn: () => Promise<unknown>, message: string) {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      setNotice(message);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel
      title={item.name}
      description={item.baseGrams ? `${Math.round(item.baseGrams)} g per serving` : "per serving"}
      eyebrow="Log food"
      onClose={onClose}
      footer={
        <Button
          className="h-14 w-full rounded-full bg-signal text-signal-fg hover:bg-signal/90"
          disabled={
            busy ||
            !date ||
            !Number.isFinite(quantity) ||
            quantity <= 0 ||
            Boolean(
              entry && quantity === entry.quantity && date === entry.date && slot === entry.slot,
            )
          }
          onClick={save}
        >
          {busy
            ? "Saving…"
            : entry
              ? "Save changes"
              : `+ Add to ${slot} · ${Math.round(value.kcal)} kcal`}
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-2">
          {favoriteTarget && !entry ? (
            <Button
              variant="outline"
              disabled={busy}
              onClick={() =>
                action(
                  async () => {
                    await api.put("/favorites", {
                      kind: favoriteTarget.kind,
                      id: favoriteTarget.id,
                      favorite: !favorite,
                    });
                    await favorites.refetch();
                  },
                  favorite ? "Removed from favorites" : "Added to favorites",
                )
              }
            >
              <Star className="size-4" />
              {favorite ? "Favorited" : "Favorite"}
            </Button>
          ) : null}
        </div>
        {notice ? (
          <p role="status" className="text-caption text-fg-muted">
            {notice}
          </p>
        ) : null}
        <div className="flex gap-1 rounded-2xl bg-sunken p-1">
          {(["serving", item.baseUnit === "ml" ? "ml" : "grams"] as const).map((v) => (
            <Button
              key={v}
              variant="ghost"
              className={`h-10 flex-1 rounded-xl ${mode === v ? "bg-surface text-fg shadow-sm" : "text-fg-muted"}`}
              disabled={Boolean(entry) || (v === "grams" && !item.baseGrams)}
              onClick={() => {
                setQuantity(v === "serving" ? 1 : (item.baseGrams ?? 100));
                setMode(v);
              }}
            >
              {v === "serving"
                ? item.kind === "food"
                  ? (item.servingLabel ?? `100 ${item.baseUnit === "ml" ? "ml" : "g"}`)
                  : "Servings"
                : v === "ml"
                  ? "Millilitres"
                  : "Grams"}
            </Button>
          ))}
        </div>
        <p className="text-body-sm text-fg-muted">How much did you eat?</p>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2">
          <Button
            aria-label="Decrease quantity"
            variant="outline"
            onClick={() => setQuantity((q) => Math.max(0.25, q - (mode !== "serving" ? 10 : 0.25)))}
          >
            <Minus className="size-4" />
          </Button>
          <Input
            className="border-0 bg-transparent text-center text-heading shadow-none"
            inputMode="decimal"
            aria-label="Quantity"
            type="number"
            min="0.01"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Button
            aria-label="Increase quantity"
            variant="outline"
            onClick={() => setQuantity((q) => q + (mode !== "serving" ? 10 : 0.25))}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-3">
          <div className="shrink-0 [&>div]:size-20 [&_svg]:size-20 [&_span:first-child]:text-body">
            <NutritionRing value={value} />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2 text-center text-caption">
            {[
              { name: "Protein", grams: value.proteinG, energy: 4, color: "text-macro-protein" },
              { name: "Carbs", grams: value.carbsG, energy: 4, color: "text-macro-carbs" },
              { name: "Fat", grams: value.fatG, energy: 9, color: "text-macro-fat" },
            ].map((m) => (
              <div key={m.name}>
                <span className={m.color}>
                  {Math.round(
                    ((m.grams * m.energy) /
                      (value.proteinG * 4 + value.carbsG * 4 + value.fatG * 9 || 1)) *
                      100,
                  )}
                  %
                </span>
                <strong className="block text-body">{Math.round(m.grams)}g</strong>
                <span className="text-fg-muted">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Meal">
            <Select value={slot} onValueChange={(v) => setSlot(v as Slot)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {slots.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-2xl text-signal-text"
                >
                  {date === localDay()
                    ? "Today"
                    : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                  <CalendarDays className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(`${date}T12:00:00`)}
                  defaultMonth={new Date(`${date}T12:00:00`)}
                  onSelect={(day) => {
                    if (day) {
                      setDate(localDay(day));
                      setCalendarOpen(false);
                    }
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>
        {item.kind === "food" && !entry ? (
          <Button
            variant="ghost"
            className="w-full text-fg-muted"
            onClick={() => setReporting(true)}
          >
            Report incorrect food information
          </Button>
        ) : null}
        {reporting ? (
          <div className={card}>
            <Field label="What's incorrect?">
              <Textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder="Tell your coach what needs correcting."
              />
            </Field>
            <Button
              className="mt-3"
              disabled={busy || !report.trim()}
              onClick={() =>
                action(async () => {
                  await api.post("/reports", {
                    id: reportId.current,
                    ingredientId: item.id,
                    note: report,
                  });
                  reportId.current = crypto.randomUUID();
                  setReport("");
                  setReporting(false);
                }, "Report sent to your coach.")
              }
            >
              Send report
            </Button>
          </div>
        ) : null}
        <ErrorText error={error} />
      </div>
    </Panel>
  );
}
