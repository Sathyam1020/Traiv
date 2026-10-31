"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Barcode, Camera, Zap, Plus, Clock, Star, Salad } from "@traiv/ui/icons";
import { Button } from "@traiv/ui/components/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@traiv/ui/components/select";
import { useActiveStudio } from "@/lib/query";
import { foodApi, localDay, slots, type Diary, type FoodItem, type Slot } from "@/lib/api/food";
import { Logger } from "../_components/logger";
import { QuickAdd } from "../_components/quick-add";
import { BarcodeScanner } from "../_components/search";
import { FoodTools } from "../_components/tools";
import { ErrorText } from "../_components/common";

export default function LogFoodPage() {
  const router = useRouter();
  const { studioId, stalled } = useActiveStudio();
  const studio = studioId ?? "";
  const api = foodApi(studio);
  const qc = useQueryClient();
  const [date, setDate] = useState(localDay);
  const [slot, setSlot] = useState<Slot>("breakfast");
  const [mode, setMode] = useState("recent");
  const [tool, setTool] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string>();
  const [item, setItem] = useState<FoodItem | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState<unknown>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const day = params.get("date");
    if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) setDate(day);
    setSlot(slots.find((s) => s === params.get("meal")) ?? "breakfast");
  }, []);
  const diary = useQuery({
    queryKey: ["food-diary", studio, date],
    queryFn: () => api.get<Diary>(`/days/${date}`),
    enabled: Boolean(studio),
  });
  const query = useQuery({
    queryKey: ["food-search", studio, "", mode],
    queryFn: () => api.get<FoodItem[]>(`/search?mode=${mode}`),
    enabled: Boolean(studio),
  });
  async function select(value: FoodItem) {
    if (selecting) return;
    setSelecting(true);
    setError(null);
    try {
      const fresh =
        value.kind === "manual"
          ? value
          : await api.get<FoodItem>(
              `/items/${value.kind}/${value.id}${value.planId ? `?planId=${encodeURIComponent(value.planId)}` : ""}`,
            );
      setItem(fresh);
      setTool(null);
    } catch (cause) {
      setError(cause);
    } finally {
      setSelecting(false);
    }
  }
  function refresh() {
    void qc.invalidateQueries({ queryKey: ["food-search", studio] });
    void qc.invalidateQueries({ queryKey: ["food-diary", studio] });
  }
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-5">
        <Link
          href={`/food?date=${date}`}
          aria-label="Back to food"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase text-fg-muted">Logging into</p>
          <h1 className="text-body font-semibold">Log food</h1>
        </div>
        <Select
          value={slot}
          onValueChange={(value) => {
            const meal = slots.find((s) => s === value);
            if (meal) setSlot(meal);
          }}
        >
          <SelectTrigger
            aria-label="Meal"
            className="w-auto border-0 bg-transparent capitalize text-signal-text shadow-none"
          >
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
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              name: "Scan barcode",
              Icon: Barcode,
              view: "barcode",
              enabled: diary.data?.permissions.barcode,
              color: "text-macro-protein",
            },
            {
              name: "Photo Log",
              Icon: Camera,
              view: "photos",
              enabled: diary.data?.permissions.photoLog,
              color: "text-macro-carbs",
            },
            {
              name: "Quick add",
              Icon: Zap,
              view: "quick",
              enabled: Boolean(diary.data),
              color: "text-macro-fat",
            },
          ].map((a) => (
            <button
              key={a.view}
              disabled={!a.enabled || Boolean(stalled)}
              onClick={() => setTool(a.view)}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-2 py-5 text-caption font-semibold disabled:opacity-50"
            >
              <span
                className={`flex size-10 items-center justify-center rounded-2xl bg-sunken ${a.color}`}
              >
                <a.Icon className="size-6" />
              </span>
              {a.name}
            </button>
          ))}
        </div>
        <div
          className="my-5 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Food sources"
        >
          {[
            { id: "recent", name: "Recent", Icon: Clock },
            { id: "favorites", name: "Favorites", Icon: Star },
            { id: "recipes", name: "My recipes", Icon: Salad },
            { id: "mine", name: "My foods", Icon: Salad },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() =>
                tab.id === "recipes" || tab.id === "mine"
                  ? router.push(
                      `/food/${tab.id === "recipes" ? "recipes" : "foods"}?date=${date}&meal=${slot}`,
                    )
                  : setMode(tab.id)
              }
              className={`flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2 text-body-sm ${mode === tab.id ? "bg-signal text-signal-fg" : "bg-surface text-fg-muted"}`}
            >
              <tab.Icon className="size-4" />
              {tab.name}
            </button>
          ))}
        </div>
        <ErrorText error={query.error ?? diary.error ?? error} />
        {query.isError ? (
          <Button variant="outline" onClick={() => void query.refetch()}>
            Try again
          </Button>
        ) : null}
        {query.isPending ? (
          <p className="py-8 text-center text-body-sm text-fg-muted">Loading foods…</p>
        ) : null}
        <div className="space-y-2">
          {query.data?.map((food) => (
            <button
              key={`${food.kind}:${food.id}`}
              disabled={selecting || Boolean(stalled)}
              onClick={() => void select(food)}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left disabled:opacity-50"
            >
              {food.imageUrl ? (
                <img
                  src={food.imageUrl}
                  alt=""
                  className="size-10 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <Salad className="size-9 shrink-0 text-fg-muted" />
              )}
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-body-sm">{food.name}</strong>
                <span className="text-caption text-fg-muted">
                  {food.kind === "food" ? (food.servingLabel ?? "100 g") : "1 serving"}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <strong className="block text-body-sm">{Math.round(food.kcal)}</strong>
                <span className="text-caption text-fg-muted">kcal</span>
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-selected text-signal-text">
                <Plus className="size-5" />
              </span>
            </button>
          ))}
        </div>
        {query.data?.length === 0 ? (
          <p className="py-10 text-center text-body-sm text-fg-muted">
            {mode === "recent"
              ? "Foods you log will appear here."
              : mode === "favorites"
                ? "Your favorite foods will appear here."
                : mode === "recipes"
                  ? "No personal recipes yet."
                  : "No personal foods yet."}
          </p>
        ) : null}
      </div>
      {tool === "quick" ? (
        <QuickAdd
          studio={studio}
          date={date}
          slot={slot}
          onClose={() => setTool(null)}
          onSaved={refresh}
        />
      ) : tool === "barcode" ? (
        <BarcodeScanner
          studio={studio}
          onSelect={(value) => void select(value)}
          onClose={() => setTool(null)}
          onCreate={(code) => {
            setBarcode(code);
            setTool("foods");
          }}
        />
      ) : tool ? (
        <FoodTools
          studio={studio}
          tool={tool}
          barcode={barcode}
          date={date}
          target={diary.data?.target ?? null}
          onSelect={(value) => void select(value)}
          onClose={() => {
            setTool(null);
            setBarcode(undefined);
          }}
          onSaved={refresh}
        />
      ) : null}
      {item ? (
        <Logger
          studio={studio}
          item={item}
          date={date}
          slot={slot}
          onClose={() => setItem(null)}
          onSaved={refresh}
        />
      ) : null}
    </div>
  );
}
