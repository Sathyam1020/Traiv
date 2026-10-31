"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import { Plus, Trash } from "@traiv/ui/icons";
import { foodApi, type ShoppingItem } from "@/lib/api/food";
import { Panel, Field, ErrorText, card } from "./common";
import { useAction } from "./actions";
export function Shopping({ studio, onClose }: { studio: string; onClose: () => void }) {
  const api = foodApi(studio),
    qc = useQueryClient(),
    action = useAction();
  const query = useQuery({
    queryKey: ["food-shopping", studio],
    queryFn: () => api.get<ShoppingItem[]>("/shopping"),
  });
  const createId = useRef(crypto.randomUUID());
  const [edit, setEdit] = useState<ShoppingItem | null>(null),
    [adding, setAdding] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["food-shopping", studio] });
  const [name, setName] = useState(""),
    [amount, setAmount] = useState("1"),
    [unit, setUnit] = useState("piece"),
    [category, setCategory] = useState("Other"),
    [note, setNote] = useState("");
  function open(item: ShoppingItem | null) {
    createId.current = crypto.randomUUID();
    setEdit(item);
    setName(item?.name ?? "");
    setAmount(String(item?.amount ?? 1));
    setUnit(item?.unit ?? "piece");
    setCategory(item?.category ?? "Other");
    setNote(item?.note ?? "");
    setAdding(true);
  }
  return (
    <Panel title="Shopping list" onClose={onClose}>
      <div className="space-y-4">
        <Button className="w-full" variant="outline" onClick={() => open(null)}>
          <Plus className="size-4" />
          Add item
        </Button>
        <ErrorText error={query.error ?? action.error} />
        {query.isPending ? <p>Loading shopping list…</p> : null}
        {Object.entries(
          (query.data ?? []).reduce<Record<string, ShoppingItem[]>>((groups, item) => {
            (groups[item.category] ??= []).push(item);
            return groups;
          }, {}),
        ).map(([group, items]) => (
          <section key={group}>
            <h3 className="mb-2 text-body-sm font-semibold">{group}</h3>
            <div className="divide-y divide-line">
              {items?.map((i) => (
                <div key={i.id} className="flex items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Bought ${i.name}`}
                    checked={Boolean(i.checked)}
                    disabled={action.busy}
                    onChange={() =>
                      action.run(async () => {
                        await api.put("/shopping", { ...i, checked: !i.checked });
                        await refresh();
                      })
                    }
                  />
                  <button
                    type="button"
                    className={`flex-1 text-left ${i.checked ? "line-through text-fg-muted" : ""}`}
                    onClick={() => open(i)}
                  >
                    <span className="block text-body-sm">{i.name}</span>
                    <span className="text-caption text-fg-muted">
                      {Math.round(i.amount * 10) / 10} {i.unit}
                    </span>
                    {i.note ? (
                      <span className="block text-caption text-fg-muted">{i.note}</span>
                    ) : null}
                  </button>
                  <Button
                    variant="ghost"
                    aria-label={`Remove ${i.name}`}
                    disabled={action.busy}
                    onClick={() =>
                      action.run(async () => {
                        await api.delete(`/shopping/${i.id}`);
                        await refresh();
                      })
                    }
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ))}
        {query.data?.length === 0 ? (
          <p className="py-6 text-body-sm text-fg-muted">
            Add ingredients from a recipe, or write your own shopping items.
          </p>
        ) : null}
      </div>
      {adding ? (
        <Panel
          title={edit ? "Edit shopping item" : "Add shopping item"}
          onClose={() => setAdding(false)}
        >
          <div className="space-y-4">
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount">
                <Input
                  type="number"
                  min="0.01"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Field>
              <Field label="Unit">
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
              </Field>
            </div>
            <Field label="Category">
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </Field>
            <Field label="Note">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            {edit?.contributions.length ? (
              <p className="text-caption text-fg-muted">
                Used in: {edit.contributions.map((c) => c.name).join(", ")}
              </p>
            ) : null}
            <ErrorText error={action.error} />
            <Button
              className="w-full"
              disabled={action.busy || !name.trim() || Number(amount) <= 0 || !unit}
              onClick={() =>
                action.run(async () => {
                  await api.put("/shopping", {
                    id: edit?.id ?? createId.current,
                    name,
                    amount: Number(amount),
                    unit,
                    category,
                    note: note || null,
                    checked: Boolean(edit?.checked),
                  });
                  await refresh();
                  setAdding(false);
                })
              }
            >
              Save item
            </Button>
          </div>
        </Panel>
      ) : null}
    </Panel>
  );
}
