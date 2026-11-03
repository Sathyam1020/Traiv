"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { ArrowLeft, Plus, Salad, Search, Trash } from "@traiv/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QueryError } from "@/components/common/query-state";
import { type FoodItem, foodApi, localDay, type Slot, slots } from "@/lib/api/food";
import { useActiveStudio } from "@/lib/query";
import { useAction } from "./actions";
import { ErrorText } from "./common";
import { FoodSkeleton } from "./food-skeleton";
import { RecipeEditor } from "./library";
import { Logger } from "./logger";
import { PersonalFoodEditor } from "./personal-food-editor";

export function LibraryPage({ kind }: { kind: "food" | "recipe" }) {
  const router = useRouter();
  const { studioId, stalled } = useActiveStudio();
  const studio = studioId ?? "";
  const qc = useQueryClient();
  const action = useAction();
  const [search, setSearch] = useState("");
  const [fromFood, setFromFood] = useState(false);
  const [date, setDate] = useState(localDay);
  const [slot, setSlot] = useState<Slot>("breakfast");
  const [logging, setLogging] = useState<FoodItem | null>(null);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [create, setCreate] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setFromFood(q.get("from") === "food");
    const day = q.get("date");
    if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) setDate(day);
    setSlot(slots.find((s) => s === q.get("meal")) ?? "breakfast");
  }, []);
  const query = useQuery({
    queryKey: ["food-library", studio, kind],
    queryFn: () =>
      foodApi(studio).get<FoodItem[]>(`/search?mode=${kind === "recipe" ? "recipes" : "mine"}`),
    enabled: Boolean(studio),
  });
  function refresh() {
    void qc.invalidateQueries({ queryKey: ["food-library", studio] });
    void qc.invalidateQueries({ queryKey: ["food-search", studio] });
  }
  if (create)
    return kind === "recipe" ? (
      <RecipeEditor
        embedded
        studio={studio}
        initial={editing}
        onClose={() => setCreate(false)}
        onSaved={refresh}
      />
    ) : (
      <PersonalFoodEditor
        studio={studio}
        initial={editing}
        onClose={() => setCreate(false)}
        onSaved={refresh}
      />
    );
  const items = (query.data ?? []).filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <header className="flex shrink-0 items-center justify-between px-4 py-5">
        <Link
          href={fromFood ? `/food?date=${date}` : `/food/log?date=${date}&meal=${slot}`}
          aria-label={fromFood ? "Back to food" : "Back to log food"}
          className="flex size-10 items-center justify-center rounded-full border border-line bg-surface"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-body font-semibold">My {kind === "recipe" ? "recipes" : "foods"}</h1>
        <span className="size-10" />
      </header>
      {kind === "recipe" ? (
        <div className="relative mx-4 mb-5">
          <Search className="absolute top-3.5 left-4 size-4 text-fg-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your recipes"
            className="h-12 rounded-full pl-10"
          />
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-44">
        <ErrorText error={action.error} />
        {query.isError ? (
          <QueryError
            title={`Couldn't load your ${kind === "recipe" ? "recipes" : "foods"}.`}
            busy={query.isFetching}
            onRetry={() => void query.refetch()}
          />
        ) : null}
        {query.isPending ? <FoodSkeleton /> : null}
        <div className={kind === "recipe" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-line bg-surface p-2"
            >
              <button
                type="button"
                className="w-full text-left"
                disabled={Boolean(stalled)}
                onClick={() => {
                  if (kind === "recipe")
                    router.push(
                      `/food/recipes/${item.id}?date=${date}&meal=${slot}${fromFood ? "&from=food" : ""}`,
                    );
                  else {
                    setEditing(item);
                    setCreate(true);
                  }
                }}
              >
                {kind === "recipe" ? (
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-sunken">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <Salad className="mx-auto mt-8 size-10 text-fg-muted" />
                    )}
                  </div>
                ) : null}
                <div className="px-1 py-2">
                  <h2 className="line-clamp-2 text-body-sm font-semibold">{item.name}</h2>
                  <p className="mt-1 text-caption text-fg-muted">
                    {Math.round(item.kcal)} kcal · {Math.round(item.proteinG)}g protein
                  </p>
                </div>
              </button>
              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-signal-text"
                  onClick={() => setLogging(item)}
                >
                  Log food
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${item.name}`}
                  disabled={action.busy || Boolean(stalled)}
                  onClick={() => {
                    if (window.confirm(`Delete ${item.name}?`))
                      void action.run(async () => {
                        await foodApi(studio).delete(
                          `/${kind === "recipe" ? "recipes" : "foods"}/${item.id}`,
                        );
                        refresh();
                      });
                  }}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
        {!query.isPending && !query.isError && !items.length ? (
          <p className="mx-auto max-w-xs py-14 text-center text-body-sm text-fg-muted">
            {kind === "food"
              ? "Foods you create appear here so you can edit or remove them."
              : search
                ? "No recipes match your search."
                : "Your recipes will appear here."}
          </p>
        ) : null}
      </div>
      <Button
        disabled={!studio || Boolean(stalled)}
        onClick={() => {
          setEditing(null);
          setCreate(true);
        }}
        className="absolute inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] h-14 rounded-full bg-signal text-signal-fg hover:bg-signal/90 lg:bottom-5"
      >
        <Plus className="size-5" />
        Create {kind}
      </Button>
      {logging ? (
        <Logger
          studio={studio}
          item={logging}
          date={date}
          slot={slot}
          onClose={() => setLogging(null)}
          onSaved={() => {
            void qc.invalidateQueries({ queryKey: ["food-diary", studio] });
            refresh();
          }}
        />
      ) : null}
    </div>
  );
}
