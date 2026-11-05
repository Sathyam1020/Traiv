"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { Barcode, Copy, MoreHorizontal, Plus, Salad, Trash, Zap } from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QueryError } from "@/components/common/query-state";
import { ClientActionBar } from "@/components/layout/client-action-bar";
import { http } from "@/lib/api/client";
import {
  type Diary,
  type Entry,
  type FoodItem,
  foodApi,
  localDay,
  offsetDay,
  type PublishedPlan,
  type Slot,
  slots,
} from "@/lib/api/food";
import { useActiveStudio } from "@/lib/query";
import { ActivePlanCard } from "./_components/active-plan-card";
import { ErrorText, Field, Panel } from "./_components/common";
import { DiarySummary } from "./_components/diary-summary";
import { FoodHeader } from "./_components/food-header";
import { FoodSkeleton } from "./_components/food-skeleton";
import { Logger } from "./_components/logger";
import { MealCard } from "./_components/meal-card";
import { QuickAdd } from "./_components/quick-add";
import { BarcodeScanner } from "./_components/search";
import { FoodTools } from "./_components/tools";

type View =
  | "barcode"
  | "quick"
  | "shopping"
  | "recipes"
  | "foods"
  | "photos"
  | "goals"
  | "personal"
  | null;
export default function FoodPage() {
  const { studioId, stalled } = useActiveStudio(),
    studio = studioId ?? "",
    qc = useQueryClient();
  const [date, setDate] = useState(localDay),
    [view, setView] = useState<View>(null),
    [newBarcode, setNewBarcode] = useState<string | undefined>(),
    [slot, setSlot] = useState<Slot>("breakfast"),
    [item, setItem] = useState<FoodItem | null>(null),
    [entry, setEntry] = useState<Entry | undefined>(),
    [error, setError] = useState<unknown>(null),
    [busy, setBusy] = useState(false),
    [copy, setCopy] = useState<Entry[] | null>(null),
    [copyDate, setCopyDate] = useState(date),
    [copySlot, setCopySlot] = useState<Slot | "original">("breakfast");
  const router = useRouter();
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("date");
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) setDate(value);
  }, []);
  const actionIds = useRef(new Map<string, string>());
  function actionId(key: string) {
    const id = actionIds.current.get(key) ?? crypto.randomUUID();
    actionIds.current.set(key, id);
    return id;
  }
  const api = foodApi(studio);
  const diary = useQuery({
    queryKey: ["food-diary", studio, date],
    queryFn: () => api.get<Diary>(`/days/${date}`),
    enabled: Boolean(studio),
  });
  const plans = useQuery({
    queryKey: ["published-mealplans", studio],
    queryFn: async () => (await http.get<PublishedPlan[]>(`/c/${studio}/mealplans`)).data,
    enabled: Boolean(studio),
  });
  const data = diary.data;
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["food-search", studio] });
    return qc.invalidateQueries({ queryKey: ["food-diary", studio] });
  };
  async function perform(fn: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e);
    } finally {
      void refresh();
      setBusy(false);
    }
  }
  function choose(food: FoodItem) {
    setNewBarcode(undefined);
    setEntry(undefined);
    setItem(food);
    setView(null);
  }
  return (
    <div className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden bg-panel">
      <FoodHeader
        date={date}
        onDateChange={setDate}
        loggedDays={data?.loggedDays ?? []}
        onShopping={() => router.push("/food/shopping")}
        onCopyDay={
          data?.entries.length && !stalled
            ? () => {
                setCopy(data.entries);
                setCopyDate(date);
                setCopySlot("original");
              }
            : undefined
        }
      />
      <div className="client-action-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <Page className="gap-5 pt-2 pb-0">
          <ErrorText error={error} />
          {plans.isError ? (
            <QueryError
              title="Couldn't load your meal plans."
              busy={plans.isFetching}
              onRetry={() => void plans.refetch()}
            />
          ) : null}
          {diary.isPending ? (
            <FoodSkeleton diary />
          ) : diary.isError && !data ? (
            <QueryError
              title="Couldn't load your diary."
              busy={diary.isFetching}
              onRetry={() => void diary.refetch()}
            />
          ) : !data ? null : (
            <>
              <DiarySummary total={data.total} target={data.target} />
              {plans.data?.length ? (
                <section className="space-y-3">
                  <h2 className="text-body font-medium">Meal plans</h2>
                  {plans.data.map((p) => (
                    <ActivePlanCard
                      key={p.id}
                      plan={p}
                      onOpen={() =>
                        router.push(`/food/plans/${encodeURIComponent(p.id)}?date=${date}`)
                      }
                    />
                  ))}
                </section>
              ) : null}
              <h2 className="text-body font-medium">Today's meals</h2>
              {slots.map((s) => {
                const entries = data.entries.filter((e) => e.slot === s);
                const yesterday = (data.yesterdayEntries ?? []).filter((e) => e.slot === s);
                return (
                  <MealCard
                    key={s}
                    slot={s}
                    entries={entries}
                    yesterday={yesterday}
                    busy={busy}
                    disabled={Boolean(stalled)}
                    onAdd={() => {
                      setSlot(s);
                      router.push(`/food/log?date=${date}&meal=${s}`);
                    }}
                    onCopyYesterday={() =>
                      perform(async () => {
                        const previous = await api.get<Diary>(`/days/${offsetDay(date, -1)}`);
                        const ids = previous.entries.filter((e) => e.slot === s).map((e) => e.id);
                        if (!ids.length) {
                          await refresh();
                          return;
                        }
                        await api.post("/copy", {
                          ids,
                          date,
                          slot: s,
                          operationId: actionId(`yesterday:${date}:${s}`),
                        });
                      })
                    }
                    actions={
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" aria-label={`${s} actions`}>
                            <MoreHorizontal className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={!entries.length || Boolean(stalled)}
                            onSelect={() => {
                              setCopy(entries);
                              setCopyDate(date);
                              setCopySlot(s);
                            }}
                          >
                            <Copy className="size-4" />
                            Copy meal to another day
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!entries.length || Boolean(stalled)}
                            onSelect={() =>
                              perform(async () => {
                                for (const e of entries) await api.delete(`/entries/${e.id}`);
                                notifyAction("Meal cleared", "success");
                              })
                            }
                          >
                            <Trash className="size-4" />
                            Clear meal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }
                  >
                    {entries.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        disabled={!e.snapshot || Boolean(stalled)}
                        className="flex w-full items-center gap-3 py-3 text-left disabled:opacity-60"
                        onClick={() => {
                          if (e.snapshot) {
                            setItem(e.snapshot);
                            setEntry(e);
                            setSlot(e.slot);
                          }
                        }}
                      >
                        {e.snapshot?.imageUrl ? (
                          <img
                            src={e.snapshot.imageUrl}
                            alt=""
                            className="size-10 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sunken">
                            <span className="size-2 rounded-full bg-signal" />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-body-sm font-semibold">
                            {e.snapshot?.name ?? e.manualName ?? "Food"}
                          </span>
                          <span className="mt-0.5 block text-caption text-fg-muted">
                            {e.quantity}{" "}
                            {e.unit === "serving"
                              ? e.quantity === 1
                                ? "serving"
                                : "servings"
                              : e.unit === "grams"
                                ? "g"
                                : "ml"}
                          </span>
                        </span>
                        <span className="shrink-0 text-right tabular-nums">
                          <strong className="block text-body-sm">{Math.round(e.kcal)}</strong>
                          <span className="text-caption text-fg-muted">kcal</span>
                        </span>
                      </button>
                    ))}
                  </MealCard>
                );
              })}
              <Link
                href={`/food/recipes?date=${date}&meal=${slot}&from=food`}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-line bg-surface px-4 py-5 transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-line-focus"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-selected text-signal-text">
                  <Salad className="size-7" />
                </span>
                <span className="text-body-sm font-semibold">My recipes</span>
              </Link>
            </>
          )}
        </Page>
      </div>
      <ClientActionBar
        className="pointer-events-none justify-center"
        role="toolbar"
        aria-label="Food logging actions"
      >
        <button
          type="button"
          aria-label="Quick add food"
          disabled={Boolean(stalled) || !data}
          onClick={() => setView("quick")}
          className="pointer-events-auto flex size-[calc(3.25rem+2px)] shrink-0 items-center justify-center rounded-full border border-line bg-surface text-signal-text shadow-float disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <Zap className="size-6" />
        </button>
        <button
          type="button"
          disabled={Boolean(stalled) || !data?.permissions.search}
          onClick={() => router.push(`/food/log?date=${date}&meal=${slot}`)}
          className="pointer-events-auto flex h-[calc(3.25rem+2px)] items-center justify-center gap-2 rounded-full bg-signal px-7 text-body font-semibold text-signal-fg hover:bg-signal/90 shadow-float disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <Plus className="size-5" />
          Log food
        </button>
        <button
          type="button"
          aria-label="Scan food barcode"
          disabled={Boolean(stalled) || !data?.permissions.barcode}
          onClick={() => setView("barcode")}
          className="pointer-events-auto flex size-[calc(3.25rem+2px)] shrink-0 items-center justify-center rounded-full border border-line bg-surface text-signal-text shadow-float disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-line-focus"
        >
          <Barcode className="size-6" />
        </button>
      </ClientActionBar>
      {view === "barcode" ? (
        <BarcodeScanner
          studio={studio}
          onSelect={choose}
          onClose={() => setView(null)}
          onCreate={(code) => {
            setNewBarcode(code);
            setView("foods");
          }}
        />
      ) : view === "quick" ? (
        <QuickAdd
          studio={studio}
          date={date}
          slot={slot}
          onSaved={refresh}
          onClose={() => setView(null)}
        />
      ) : view ? (
        <FoodTools
          key={view}
          studio={studio}
          tool={view}
          barcode={view === "foods" ? newBarcode : undefined}
          date={date}
          target={diary.data?.target ?? null}
          onSelect={choose}
          onClose={() => {
            setView(null);
            setNewBarcode(undefined);
          }}
          onSaved={refresh}
        />
      ) : null}
      {item ? (
        <Logger
          studio={studio}
          item={item}
          entry={entry}
          date={entry?.date ?? date}
          slot={slot}
          onClose={() => {
            setItem(null);
            setEntry(undefined);
          }}
          onSaved={refresh}
        />
      ) : null}
      {copy ? (
        <CopyMeal
          entries={copy}
          studio={studio}
          date={copyDate}
          slot={copySlot}
          onClose={() => setCopy(null)}
          onSaved={refresh}
        />
      ) : null}
    </div>
  );
}
function CopyMeal({
  entries,
  studio,
  date: initial,
  slot: initialSlot,
  onClose,
  onSaved,
}: {
  entries: Entry[];
  studio: string;
  date: string;
  slot: Slot | "original";
  onClose: () => void;
  onSaved: () => void;
}) {
  const [date, setDate] = useState(initial),
    [slot, setSlot] = useState(initialSlot),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null),
    id = useRef(crypto.randomUUID());
  return (
    <Panel title={initialSlot === "original" ? "Copy day" : "Copy meal"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-2">
          {(["original", ...slots] as const).map((s) => (
            <Button key={s} variant={s === slot ? "default" : "outline"} onClick={() => setSlot(s)}>
              {s === "original" ? "Keep original meals" : s}
            </Button>
          ))}
        </div>
        <ErrorText error={error} />
        <Button
          disabled={busy || !date}
          onClick={async () => {
            setBusy(true);
            try {
              await foodApi(studio).post("/copy", {
                ids: entries.map((e) => e.id),
                date,
                slot,
                operationId: id.current,
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
          Copy {entries.length} foods
        </Button>
      </div>
    </Panel>
  );
}
