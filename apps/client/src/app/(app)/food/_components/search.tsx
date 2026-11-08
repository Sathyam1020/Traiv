"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Barcode, Camera, Plus, Salad, Search } from "@traiv/ui/icons";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { type FoodItem, foodApi } from "@/lib/api/food";
import { ErrorText, Macros, Panel } from "./common";
export function FoodSearch({
  studio,
  onSelect,
  onClose,
  ingredientsOnly = false,
  recipesOnly = false,
  onBarcode,
  onPhoto,
  onQuick,
}: {
  studio: string;
  onSelect: (item: FoodItem) => void;
  onClose: () => void;
  ingredientsOnly?: boolean;
  recipesOnly?: boolean;
  onBarcode?: () => void;
  onPhoto?: () => void;
  onQuick?: () => void;
}) {
  const [search, setSearch] = useState(""),
    [mode, setMode] = useState("all");
  const [selectionError, setSelectionError] = useState<unknown>(null),
    [selecting, setSelecting] = useState(false);
  async function select(item: FoodItem) {
    if (selecting) return;
    setSelecting(true);
    setSelectionError(null);
    try {
      const fresh =
        item.kind === "manual"
          ? item
          : await foodApi(studio).get<FoodItem>(
              `/items/${item.kind}/${item.id}${item.planId ? `?planId=${item.planId}` : ""}`,
            );
      onSelect(fresh);
    } catch (e) {
      setSelectionError(e);
    } finally {
      setSelecting(false);
    }
  }
  const deferred = useDeferredValue(search);
  const query = useQuery({
    queryKey: ["food-search", studio, deferred, mode],
    queryFn: () =>
      foodApi(studio).get<FoodItem[]>(`/search?q=${encodeURIComponent(deferred)}&mode=${mode}`),
    enabled: !ingredientsOnly || Boolean(deferred.trim()),
  });
  return (
    <Panel title={ingredientsOnly ? "Add ingredients" : "Log food"} onClose={onClose}>
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-fg-muted" />
        {ingredientsOnly && onBarcode ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Scan ingredient barcode"
            onClick={onBarcode}
            className="absolute right-1 top-1 z-10 text-signal-text"
          >
            <Barcode className="size-4" />
          </Button>
        ) : null}
        <Input
          className="pl-9 pr-12"
          autoFocus
          placeholder="Search foods and recipes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {!ingredientsOnly && !recipesOnly ? (
        <div className="my-4 grid grid-cols-3 gap-2">
          {onBarcode ? (
            <Button variant="outline" onClick={onBarcode}>
              <Barcode className="size-4" />
              Scan
            </Button>
          ) : null}
          {onPhoto ? (
            <Button variant="outline" onClick={onPhoto}>
              <Camera className="size-4" />
              Photo Log
            </Button>
          ) : null}
          {onQuick ? (
            <Button variant="outline" onClick={onQuick}>
              <Plus className="size-4" />
              Quick add
            </Button>
          ) : null}
        </div>
      ) : null}
      {!ingredientsOnly ? (
        <div className="my-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ["all", "Search"],
            ["recent", "Recent"],
            ["favorites", "Favorites"],
            ["recipes", "My recipes"],
            ["mine", "My foods"],
          ]
            .filter(([key]) => !ingredientsOnly || key !== "recipes")
            .map(([key, label]) => (
              <Button
                className="shrink-0"
                key={key}
                variant={mode === key ? "default" : "outline"}
                onClick={() => setMode(key ?? "all")}
              >
                {label}
              </Button>
            ))}
        </div>
      ) : (
        <Button variant="ghost" className="my-3 w-full" onClick={onClose}>
          Done
        </Button>
      )}
      <ErrorText error={selectionError} />
      {ingredientsOnly && !deferred.trim() ? (
        <p className="py-16 text-center text-body-sm text-fg-muted">
          Type to search for foods to add.
        </p>
      ) : query.isPending ? (
        <p className="py-8 text-fg-muted">Searching…</p>
      ) : query.isError ? (
        <>
          <ErrorText error={query.error} />
          <Button onClick={() => query.refetch()}>Try again</Button>
        </>
      ) : (
        <div className="divide-y divide-line">
          {query.data
            .filter((item) => !recipesOnly || item.kind === "recipe")
            .filter((item) => !ingredientsOnly || (item.kind === "food" && item.baseUnit !== "ml"))
            .map((item) => (
              <button
                type="button"
                key={`${item.kind}:${item.id}`}
                className="flex w-full items-center gap-3 py-4 text-left"
                disabled={selecting}
                onClick={() => select(item)}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-control object-cover"
                  />
                ) : (
                  <Salad className="size-8 shrink-0 text-fg-subtle" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="block text-body-sm font-medium">{item.name}</span>
                  <span className="text-caption text-fg-muted">
                    {item.kcal} kcal /{" "}
                    {item.kind === "food"
                      ? (item.servingLabel ?? `100 ${item.baseUnit === "ml" ? "ml" : "g"}`)
                      : "serving"}
                  </span>
                  <Macros value={item} />
                </div>
                <Plus className="size-5 shrink-0" />
              </button>
            ))}
          {!query.data.length ? (
            <p className="py-8 text-body-sm text-fg-muted">
              No results. Try a simpler food name or create a food from its label.
            </p>
          ) : null}
        </div>
      )}
    </Panel>
  );
}
export function BarcodeScanner({
  studio,
  onSelect,
  onClose,
  onCreate,
}: {
  studio: string;
  onSelect: (item: FoodItem) => void;
  onClose: () => void;
  onCreate: (code?: string) => void;
}) {
  const video = useRef<HTMLVideoElement>(null),
    control = useRef<{ stop: () => void } | null>(null),
    found = useRef(false);
  const [code, setCode] = useState(""),
    [camera, setCamera] = useState(false),
    [error, setError] = useState<unknown>(null),
    [busy, setBusy] = useState(false);
  async function lookup(value: string) {
    if (found.current) return;
    found.current = true;
    control.current?.stop();
    setBusy(true);
    setCode(value);
    try {
      const item = await foodApi(studio).get<FoodItem>(`/barcode/${encodeURIComponent(value)}`);
      onSelect(item);
    } catch (e) {
      setError(e);
      found.current = false;
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!camera || !video.current) return;
    let cancelled = false;
    async function start() {
      try {
        const { BrowserMultiFormatOneDReader } = await import("@zxing/browser");
        if (cancelled) return;
        const reader = new BrowserMultiFormatOneDReader();
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: "environment" }, audio: false },
          video.current ?? undefined,
          (result) => {
            if (result && !cancelled) void lookup(result.getText());
          },
        );
        if (cancelled) controls.stop();
        else control.current = controls;
      } catch {
        setError(
          new Error(
            "Camera unavailable. Allow camera access over HTTPS, or enter the barcode below.",
          ),
        );
      }
    }
    void start();
    return () => {
      cancelled = true;
      control.current?.stop();
    };
  }, [camera]);
  return (
    <Panel
      title="Scan barcode"
      description="Point the camera at the product barcode, or enter its number."
      onClose={onClose}
    >
      <div className="space-y-4">
        {camera ? (
          <video
            ref={video}
            autoPlay
            muted
            playsInline
            className="aspect-square w-full rounded-surface bg-sunken object-cover"
          />
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setCamera(true)}>
            <Camera className="size-4" />
            Open camera
          </Button>
        )}
        <Input
          aria-label="Barcode"
          inputMode="numeric"
          placeholder="Enter barcode number"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <ErrorText error={error} />
        <Button
          className="w-full"
          disabled={busy || !/^\d{8,14}$/.test(code)}
          onClick={() => lookup(code)}
        >
          {busy ? "Looking up…" : "Find food"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onCreate(/^\d{8,14}$/.test(code) ? code : undefined)}
        >
          Can't find it? Create food
        </Button>
      </div>
    </Panel>
  );
}
