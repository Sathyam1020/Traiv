"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import { ArrowLeft, Check, Minus, Pencil, Plus, ShoppingBasket, Trash } from "@traiv/ui/icons";
import Link from "next/link";
import { useRef, useState } from "react";
import { foodApi, type ShoppingItem } from "@/lib/api/food";
import { useActiveStudio } from "@/lib/query";
import { Choice, useAction } from "./actions";
import { ErrorText, Field, Panel } from "./common";

const categories = [
  "Dairy and Eggs",
  "Fruits and Vegetables",
  "Meat and Fish",
  "Pantry and Groceries",
  "Other",
];
export function ShoppingPage() {
  const { studioId, stalled } = useActiveStudio();
  return <Shopping studio={studioId ?? ""} stalled={Boolean(stalled)} />;
}
export function Shopping({ studio, stalled = false }: { studio: string; stalled?: boolean }) {
  const api = foodApi(studio),
    qc = useQueryClient(),
    action = useAction();
  const query = useQuery({
    queryKey: ["food-shopping", studio],
    queryFn: () => api.get<ShoppingItem[]>("/shopping"),
    enabled: Boolean(studio),
  });
  const createId = useRef("");
  const [edit, setEdit] = useState<ShoppingItem | null>(null);
  const [adding, setAdding] = useState(false),
    [editing, setEditing] = useState(false),
    [filter, setFilter] = useState("All");
  const [name, setName] = useState(""),
    [amount, setAmount] = useState("0"),
    [unit, setUnit] = useState("unit"),
    [category, setCategory] = useState("Other"),
    [note, setNote] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["food-shopping", studio] });
  const items = query.data ?? [];
  const groups = items.reduce<Record<string, ShoppingItem[]>>((all, item) => {
    (all[item.category || "Other"] ??= []).push(item);
    return all;
  }, {});
  const recipeCount = new Set(items.flatMap((item) => item.contributions.map((c) => c.name))).size;
  const valid = Boolean(
    name.trim() &&
      unit.trim() &&
      Number.isFinite(Number(amount)) &&
      Number(amount) > 0 &&
      Number(amount) <= 100000,
  );
  function open(item: ShoppingItem | null) {
    createId.current = crypto.randomUUID();
    setEdit(item);
    setName(item?.name ?? "");
    setAmount(String(item?.amount ?? 0));
    setUnit(item?.unit ?? "unit");
    setCategory(item?.category || "Other");
    setNote(item?.note ?? "");
    setAdding(true);
  }
  function save() {
    if (!valid || !studio) return;
    void action.run(async () => {
      await api.put("/shopping", {
        id: edit?.id ?? createId.current,
        name: name.trim(),
        amount: Number(amount),
        unit: unit.trim(),
        category,
        note: note.trim() || null,
        checked: Boolean(edit?.checked),
      });
      await refresh();
      setAdding(false);
    });
  }
  return (
    <div className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <header className="flex shrink-0 items-center justify-between px-4 py-5">
        <Link
          href="/food"
          aria-label="Back to food"
          className="flex size-10 items-center justify-center rounded-full border border-line bg-surface"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-body-lg font-semibold">Shopping list</h1>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="Add item"
          disabled={!studio || action.busy}
          onClick={() => open(null)}
        >
          <Plus className="size-5" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-6">
        <div className="flex items-center gap-3 rounded-surface border border-line bg-surface p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-signal/10 text-signal">
            <ShoppingBasket className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">From your recipes</h2>
            <p className="text-body-sm text-fg-muted">
              {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-full"
            disabled={!items.length}
            onClick={() => setEditing(!editing)}
          >
            <Pencil className="size-4" />
            {editing ? "Done" : "Edit"}
          </Button>
        </div>
        <div className="my-5 flex gap-2 overflow-x-auto pb-1" aria-label="Shopping categories">
          {["All", ...Object.keys(groups)].map((group) => (
            <button
              type="button"
              key={group}
              aria-pressed={filter === group}
              onClick={() => setFilter(group)}
              className={`flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2 text-body-sm font-semibold ${filter === group ? "bg-signal text-signal-fg" : "bg-surface"}`}
            >
              {group}
              <span className="opacity-70">
                {group === "All" ? items.length : groups[group]?.length}
              </span>
            </button>
          ))}
        </div>
        <ErrorText
          error={query.error ?? action.error ?? (stalled ? new Error("Studio unavailable") : null)}
        />
        {query.isPending ? (
          <p className="py-8 text-center text-fg-muted">Loading shopping list…</p>
        ) : null}
        {query.isError ? (
          <Button variant="outline" onClick={() => void query.refetch()}>
            Try again
          </Button>
        ) : null}
        {!query.isPending && !query.isError && !items.length ? (
          <div className="flex flex-col items-center py-12 text-center">
            <ShoppingBasket className="mb-4 size-12 text-signal" />
            <h2 className="text-body-lg font-semibold">Your shopping list is empty</h2>
            <p className="mb-5 mt-2 max-w-xs text-body-sm text-fg-muted">
              Add ingredients from a recipe, or add an item you need.
            </p>
            <Button disabled={!studio} onClick={() => open(null)}>
              <Plus className="size-4" />
              Add item
            </Button>
          </div>
        ) : null}
        {Object.entries(groups)
          .filter(([group]) => filter === "All" || !groups[filter] || filter === group)
          .map(([group, rows]) => (
            <section key={group} className="mb-5">
              <h2 className="mb-3 flex items-center gap-2 text-body-sm font-semibold">
                {group}
                <span className="rounded-full bg-well px-2 py-0.5 text-caption text-fg-muted">
                  {rows.length}
                </span>
              </h2>
              <div className="space-y-2">
                {rows.map((item) => {
                  const count = new Set(item.contributions.map((c) => c.name)).size;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
                    >
                      <button
                        type="button"
                        onClick={() => open(item)}
                        className={`flex min-w-0 flex-1 items-center gap-3 text-left ${item.checked ? "opacity-50" : ""}`}
                      >
                        <span className="shrink-0 rounded-lg bg-well px-2 py-1 text-body-sm text-fg-muted">
                          {Number(item.amount).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}{" "}
                          {item.unit === "grams" ? "g" : item.unit}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block font-semibold ${item.checked ? "line-through" : ""}`}
                          >
                            {item.name}
                          </span>
                          <span className="block text-caption text-fg-muted">
                            {count
                              ? `from ${count} ${count === 1 ? "recipe" : "recipes"}`
                              : "Added by you"}
                          </span>
                          {item.note ? (
                            <span className="block text-caption text-fg-muted">{item.note}</span>
                          ) : null}
                        </span>
                      </button>
                      {editing ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${item.name}`}
                          disabled={action.busy}
                          onClick={() =>
                            void action.run(async () => {
                              await api.delete(`/shopping/${item.id}`);
                              await refresh();
                            })
                          }
                        >
                          <Trash className="size-5 text-danger" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={Boolean(item.checked)}
                          aria-label={`Bought ${item.name}`}
                          disabled={action.busy}
                          onClick={() =>
                            void action.run(async () => {
                              await api.put("/shopping", { ...item, checked: !item.checked });
                              await refresh();
                            })
                          }
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${item.checked ? "border-signal bg-signal text-signal-fg" : "border-line bg-surface"}`}
                        >
                          {item.checked ? <Check className="size-5" /> : null}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
      </div>
      {adding ? (
        <Panel
          title={edit ? "Edit item" : "Add item"}
          description="Add the details for your shopping item."
          eyebrow="Shopping list"
          onClose={() => {
            if (!action.busy) setAdding(false);
          }}
          footer={
            <Button className="w-full rounded-full" disabled={action.busy || !valid} onClick={save}>
              {action.busy ? "Saving…" : "Save item"}
            </Button>
          }
        >
          <form
            className="space-y-5 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Field label="Item name">
              <Input
                placeholder="Item name"
                maxLength={255}
                value={name}
                disabled={action.busy}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Amount">
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Decrease amount"
                  disabled={action.busy || Number(amount) <= 0}
                  onClick={() => setAmount(String(Math.max(0, Number(amount) - 1)))}
                >
                  <Minus className="size-5" />
                </Button>
                <Input
                  aria-label="Quantity"
                  type="number"
                  min="0.01"
                  max="100000"
                  step="any"
                  value={amount}
                  disabled={action.busy}
                  className="min-w-0 flex-1 text-center"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                  aria-label="Unit"
                  value={unit}
                  maxLength={40}
                  disabled={action.busy}
                  className="w-20"
                  onChange={(e) => setUnit(e.target.value)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Increase amount"
                  disabled={action.busy || Number(amount) >= 100000}
                  onClick={() => setAmount(String(Math.min(100000, Number(amount) + 1)))}
                >
                  <Plus className="size-5" />
                </Button>
              </div>
            </Field>
            <Choice
              label="Category"
              value={category}
              options={[...new Set([...categories, ...Object.keys(groups), category])]}
              onChange={(value) => {
                if (!action.busy) setCategory(value);
              }}
            />
            <Field label="Note">
              <Textarea
                placeholder="Add a note…"
                value={note}
                disabled={action.busy}
                maxLength={1000}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
            <ErrorText error={action.error} />
          </form>
        </Panel>
      ) : null}
    </div>
  );
}
