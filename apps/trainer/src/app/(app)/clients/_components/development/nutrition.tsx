"use client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@traiv/ui/components/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@traiv/ui/components/select";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@traiv/ui/components/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Utensils,
  ExternalLink,
  SlidersHorizontal,
} from "@traiv/ui/icons";
import { localDay, weekDates } from "@traiv/ui/lib/steps";
import { http } from "@/lib/api/client";

type Nutrition = { kcal: number; proteinG: number; carbsG: number; fatG: number };
type Entry = Nutrition & {
  id: string;
  slot: string;
  recipeId: string | null;
  manualName: string | null;
  servings: number | null;
  quantity: number | null;
  unit: string | null;
  snapshot: { name?: string; kind?: string } | null;
};
type Day = { date: string; entries: Entry[]; target: Nutrition | null; total: Nutrition };
const macros = [
  { key: "proteinG", label: "Protein", color: "#ed8b57", energy: 4 },
  { key: "carbsG", label: "Carbs", color: "#57a48c", energy: 4 },
  { key: "fatG", label: "Fat", color: "#d9ad43", energy: 9 },
] as const;
const slots = ["breakfast", "lunch", "dinner", "snacks"];
const number = (v: number) => Number(v.toFixed(1)).toLocaleString();
const label = (day: string, full = false) =>
  new Date(day + "T12:00:00").toLocaleDateString(undefined, {
    weekday: full ? "long" : "short",
    month: full ? "long" : "short",
    day: "numeric",
  });
const short = (day: string) =>
  new Date(day + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
const sum = (entries: Entry[]): Nutrition =>
  entries.reduce(
    (a, e) => ({
      kcal: a.kcal + e.kcal,
      proteinG: a.proteinG + e.proteinG,
      carbsG: a.carbsG + e.carbsG,
      fatG: a.fatG + e.fatG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
const name = (entry: Entry) => entry.snapshot?.name ?? entry.manualName ?? "Food";
function MacroValues({ value }: { value: Nutrition }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
      {macros.map((m) => (
        <span key={m.key} className="inline-flex items-center gap-1">
          <i className="size-1.5 rounded-full" style={{ background: m.color }} />
          <strong>{number(value[m.key])}</strong>
          <span className="text-fg-muted">g</span>
        </span>
      ))}
    </div>
  );
}
function weekLabel(offset: number) {
  const days = weekDates(localDay(), offset);
  const thursday = new Date(days[3]! + "T12:00:00Z");
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `Week ${week} (${short(days[0]!)} – ${short(days[6]!)})`;
}
export function DevelopmentNutrition({
  studioId,
  clientId,
  clientName,
}: {
  studioId: string;
  clientId: string;
  clientName: string;
}) {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [opened, setOpened] = useState<string | null>(null);
  const [showMacros, setShowMacros] = useState(true);
  const [showTargets, setShowTargets] = useState(true);
  const dates = weekDates(localDay(), offset);
  const first = dates[0]!;
  const query = useQuery({
    queryKey: ["development-nutrition", studioId, clientId, first],
    queryFn: async () =>
      (
        await http.get<{ days: Day[] }>(`/studios/${studioId}/clients/${clientId}/food/week`, {
          params: { from: first },
        })
      ).data,
    staleTime: 15000,
    refetchInterval: 30000,
  });
  const days = query.data?.days ?? [];
  const logged = days.filter((d) => d.entries.length);
  const weekly = sum(logged.flatMap((d) => d.entries));
  const avg = {
    kcal: weekly.kcal / 7,
    proteinG: weekly.proteinG / 7,
    carbsG: weekly.carbsG / 7,
    fatG: weekly.fatG / 7,
  };
  const onTarget = logged.filter(
    (d) =>
      d.target &&
      d.target.kcal > 0 &&
      Math.abs(d.total.kcal - d.target.kcal) / d.target.kcal <= 0.1,
  ).length;
  const max = Math.max(...days.map((d) => Math.max(d.total.kcal, d.target?.kcal ?? 0)), 1);
  const activeDay = days.find((d) => d.date === opened);
  function meals(day: Day, full = false) {
    const largest = slots.toSorted(
      (a, b) =>
        sum(day.entries.filter((e) => e.slot === b)).kcal -
        sum(day.entries.filter((e) => e.slot === a)).kcal,
    )[0];
    return (
      <div className={full ? "space-y-3" : "grid gap-3 md:grid-cols-2"}>
        {slots.map((slot) => {
          const entries = day.entries.filter((e) => e.slot === slot);
          if (!entries.length) return null;
          const totals = sum(entries);
          return (
            <section
              key={slot}
              className="overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <header
                className={`flex flex-wrap items-center gap-2 ${full ? "border-b border-line bg-panel px-4 py-3" : "px-4 pb-2 pt-4"}`}
              >
                <Utensils className="size-4 text-fg-muted" />
                <strong className="mr-auto text-xs capitalize">{slot}</strong>
                {!full && largest === slot ? (
                  <span className="rounded-full bg-selected px-2 py-0.5 text-[9px] font-semibold text-signal-text">
                    Largest
                  </span>
                ) : null}
                <MacroValues value={totals} />
                <strong className="ml-2 text-sm">
                  {number(totals.kcal)} <small className="font-normal text-fg-muted">kcal</small>
                </strong>
              </header>
              <div className={full ? "divide-y divide-line" : "px-4 pb-4"}>
                {entries.map((e) => (
                  <div
                    key={e.id}
                    className={`flex items-center gap-3 ${full ? "px-4 py-3" : "py-1"}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{name(e)}</p>
                      {full ? (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-fg-muted">
                          <span>
                            {e.servings != null
                              ? `${e.servings} serving${e.servings === 1 ? "" : "s"}`
                              : `${e.quantity ?? 1} ${e.unit ?? "serving"}`}
                          </span>
                          <span className="rounded-full bg-selected px-2 text-signal-text">
                            {e.recipeId ? "Recipe" : "Food"}
                          </span>
                          <MacroValues value={e} />
                        </div>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-xs tabular-nums">{number(e.kcal)} kcal</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }
  return (
    <section id="development-nutrition" className="mt-8 scroll-mt-64 border-t border-line pt-7">
      <h2 className="text-base font-semibold">Nutrition</h2>
      <p className="mb-5 mt-1 text-xs text-fg-muted">
        Logged food against the client's targets, day by day.
      </p>
      <div
        className={
          logged.length
            ? "grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]"
            : ""
        }
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4">
            <strong className="text-xs">
              {logged.length} / 7 days logged
              {logged.length ? ` · avg ${number(avg.kcal)} kcal` : ""}
            </strong>
            <div className="flex items-center gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="outline" aria-label="Nutrition display options">
                    <SlidersHorizontal className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 space-y-3 p-4">
                  <strong className="text-sm">Display options</strong>
                  <p className="text-xs text-fg-muted">
                    On target means within 10% of the daily calorie target. Averages include all
                    seven days.
                  </p>
                  <label className="flex items-center justify-between text-xs">
                    Macros
                    <input
                      type="checkbox"
                      checked={showMacros}
                      onChange={(e) => setShowMacros(e.target.checked)}
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs">
                    Target status
                    <input
                      type="checkbox"
                      checked={showTargets}
                      onChange={(e) => setShowTargets(e.target.checked)}
                    />
                  </label>
                </PopoverContent>
              </Popover>
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous nutrition week"
                onClick={() => setOffset((n) => n - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Select value={String(offset)} onValueChange={(v) => setOffset(Number(v))}>
                <SelectTrigger className="w-auto min-w-48 text-xs" aria-label="Nutrition week">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.max(26, -offset + 1) }, (_, i) => (
                    <SelectItem key={i} value={String(-i)}>
                      {weekLabel(-i)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="icon"
                variant="outline"
                disabled={offset === 0}
                aria-label="Next nutrition week"
                onClick={() => setOffset((n) => n + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </header>
          {query.isPending ? (
            <p className="p-5 text-sm text-fg-muted">Loading food diary…</p>
          ) : query.isError ? (
            <div className="p-4">
              <Button variant="outline" onClick={() => void query.refetch()}>
                Retry food diary
              </Button>
            </div>
          ) : !logged.length ? (
            <p className="px-4 py-5 text-sm text-fg-muted">Nothing logged this week</p>
          ) : (
            days.map((day) => {
              const has = day.entries.length > 0;
              const status = !has
                ? "Not logged"
                : !day.target?.kcal
                  ? "No goal"
                  : Math.abs(day.total.kcal - day.target.kcal) / day.target.kcal <= 0.1
                    ? "On target"
                    : day.total.kcal > day.target.kcal
                      ? "Above target"
                      : "Below target";
              const energy = day.total.proteinG * 4 + day.total.carbsG * 4 + day.total.fatG * 9;
              return (
                <div key={day.date} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    disabled={!has}
                    aria-expanded={expanded === day.date}
                    onClick={() => setExpanded(expanded === day.date ? null : day.date)}
                    className="flex w-full flex-wrap items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-panel disabled:cursor-default"
                  >
                    <div className="w-24 shrink-0">
                      <strong className="text-xs">{label(day.date)}</strong>
                      <p className="mt-1 text-[10px] text-fg-muted">
                        {has
                          ? `${day.entries.length} item${day.entries.length === 1 ? "" : "s"}`
                          : "Not logged"}
                      </p>
                    </div>
                    <div className="hidden min-w-12 flex-1 md:block">
                      <div className="h-2 rounded-full bg-panel">
                        <div
                          className="h-full rounded-full bg-signal"
                          style={{ width: `${(day.total.kcal / max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <strong className="ml-auto w-20 text-right text-xs tabular-nums">
                      {has ? number(day.total.kcal) : "—"}
                    </strong>
                    {showMacros ? (
                      <div className="w-40">
                        {has ? (
                          <>
                            <MacroValues value={day.total} />
                            <div className="mt-1 flex h-1 gap-0.5 overflow-hidden rounded-full">
                              {macros.map((m) => (
                                <span
                                  key={m.key}
                                  style={{
                                    background: m.color,
                                    width: `${energy ? ((day.total[m.key] * m.energy) / energy) * 100 : 0}%`,
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="h-3 rounded-full border border-line bg-panel" />
                        )}
                      </div>
                    ) : null}
                    {showTargets ? (
                      <span className="w-24 rounded-full bg-panel px-2 py-1 text-center text-[9px] font-semibold text-fg-muted">
                        {status}
                      </span>
                    ) : null}
                    <ChevronDown
                      className={`size-3 shrink-0 text-fg-muted transition-transform ${expanded === day.date ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded === day.date ? (
                      <motion.div
                        key={day.date}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.24,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-line bg-panel/40 p-4">
                          {meals(day)}
                          <Button
                            className="mt-3 rounded-full"
                            size="sm"
                            onClick={() => setOpened(day.date)}
                          >
                            <ExternalLink className="size-3" />
                            Open full food log
                          </Button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
        {logged.length ? (
          <aside className="space-y-3">
            <section className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex justify-between text-[10px] text-fg-muted">
                <strong>Week at a glance</strong>
                <span>kcal · vs daily target</span>
              </div>
              <div className="mt-5 grid h-28 grid-cols-7 items-end gap-2">
                {days.map((d) => (
                  <div
                    key={d.date}
                    className="relative flex h-full items-end justify-center"
                    title={`${label(d.date)}: ${number(d.total.kcal)} kcal${d.target ? ` / ${number(d.target.kcal)} target` : ""}`}
                  >
                    <div
                      className="w-full max-w-8 rounded-t-sm bg-signal/85"
                      style={{ height: `${(d.total.kcal / max) * 100}%` }}
                    />
                    {d.target?.kcal ? (
                      <span
                        className="absolute w-full border-t border-dashed border-fg-muted"
                        style={{ bottom: `${(d.target.kcal / max) * 100}%` }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 text-center text-[9px] text-fg-muted">
                {"MTWTFSS".split("").map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-4 border-line text-xs font-semibold">
                  {onTarget}/7
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-signal-text">This week</p>
                  <strong className="text-xs">Days on target</strong>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-fg-muted">Avg calories</p>
                  <strong className="text-base">{number(avg.kcal)}</strong>
                </div>
              </div>
              <p className="mt-4 text-[10px] font-medium text-fg-muted">
                Macro averages <span className="float-right font-normal">avg / day vs target</span>
              </p>
              {macros.map((m) => {
                const goals = days.filter((d) => d.target);
                const target = goals.length
                  ? goals.reduce((n, d) => n + (d.target?.[m.key] ?? 0), 0) / goals.length
                  : 0;
                return (
                  <div key={m.key} className="mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <i className="size-1.5 rounded-full" style={{ background: m.color }} />
                        {m.label}
                      </span>
                      <strong>
                        {number(avg[m.key])}{" "}
                        <small className="font-normal text-fg-muted">
                          g{target ? ` / ${number(target)}` : ""}
                        </small>
                      </strong>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel">
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: m.color,
                          width: `${target ? Math.min(100, (avg[m.key] / target) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          </aside>
        ) : null}
      </div>
      <Sheet
        open={opened !== null}
        onOpenChange={(v) => {
          if (!v) setOpened(null);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-3xl p-0">
          <div className="shrink-0 border-b border-line bg-surface p-5 pr-14">
            <SheetDescription>Food log · {clientName}</SheetDescription>
            <div className="mt-4 flex items-center justify-between gap-2">
              <SheetTitle>{opened ? label(opened, true) : "Food log"}</SheetTitle>
              <div className="flex gap-1">
                {[-1, 1].map((direction) => {
                  const index = dates.indexOf(opened ?? "") + direction;
                  return (
                    <Button
                      key={direction}
                      size="icon"
                      variant="outline"
                      disabled={index < 0 || index > 6}
                      aria-label={direction < 0 ? "Previous day" : "Next day"}
                      onClick={() => setOpened(dates[index]!)}
                    >
                      {direction < 0 ? (
                        <ChevronLeft className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold">
              {number(activeDay?.total.kcal ?? 0)}{" "}
              <small className="text-xs font-normal text-fg-muted">kcal</small>
            </p>
            <p className="mb-3 mt-5 text-xs text-fg-muted">Macro targets</p>
            <div className="grid grid-cols-3 gap-4">
              {macros.map((m) => (
                <div key={m.key}>
                  <span className="text-xs" style={{ color: m.color }}>
                    {m.label}
                  </span>
                  <p className="mt-2 text-sm font-semibold">
                    {number(activeDay?.total[m.key] ?? 0)}{" "}
                    <span className="font-normal text-fg-muted">
                      / {activeDay?.target ? number(activeDay.target[m.key]) : "—"} g
                    </span>
                  </p>
                  <div className="mt-2 h-1 rounded-full bg-panel">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: m.color,
                        width: `${activeDay?.target?.[m.key] ? Math.min(100, (activeDay.total[m.key] / activeDay.target[m.key]) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-panel/50 p-5">
            {activeDay?.entries.length ? (
              meals(activeDay, true)
            ) : (
              <p className="py-12 text-center text-sm text-fg-muted">Nothing logged this day</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
