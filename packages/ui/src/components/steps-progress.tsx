"use client";
import {
  IconShoe as Footprints,
  IconTarget as Target,
  IconTrophy as Trophy,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil } from "../icons";
import { notifyAction } from "../lib/action-feedback";
import { goalFor, localDay, type StepsData, weekDates } from "../lib/steps";
import { Button } from "./button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";

export { goalFor, localDay, type StepsData, weekDates } from "../lib/steps";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Props = {
  scope: string;
  load: (start: string, end: string) => Promise<StepsData>;
  save?: (date: string, count: number) => Promise<void>;
  saveGoal?: (date: string, count: number) => Promise<void>;
  heightCm?: number;
  weightKg?: number;
};
export function StepsProgress(p: Props) {
  const [offset, setOffset] = useState(0),
    [open, setOpen] = useState(false),
    [edit, setEdit] = useState(false),
    [raw, setRaw] = useState(""),
    [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(localDay());
  const days = weekDates(localDay(), offset),
    first = days[0]!,
    last = days[6]!;
  const [data, setData] = useState<StepsData>(),
    [pending, setPending] = useState(true),
    [failed, setFailed] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true,
      inFlight = false;
    setPending(true);
    setFailed(false);
    const refresh = () => {
      if (inFlight) return;
      inFlight = true;
      p.load(first, last)
        .then((d) => {
          if (active) {
            setData(d);
            setFailed(false);
          }
        })
        .catch(() => {
          if (active) setFailed(true);
        })
        .finally(() => {
          inFlight = false;
          if (active) setPending(false);
        });
    };
    refresh();
    const onFocus = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const timer = window.setInterval(onFocus, 15000);
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [p.scope, first, last, revision, p.load]);
  const query = { isPending: pending, isError: failed, refetch: () => setRevision((n) => n + 1) };
  const count = data?.days.find((d) => d.date === selected)?.count ?? 0;
  const goal = data ? goalFor(data, selected) : 10000;
  const currentGoal = data ? goalFor(data, localDay()) : 10000;
  const heightCm = p.heightCm ?? data?.profile?.heightCm ?? undefined;
  const total = data?.days.reduce((s, d) => s + d.count, 0) ?? 0;
  const onTarget = data
    ? days.filter(
        (d) =>
          d <= localDay() && (data.days.find((r) => r.date === d)?.count ?? -1) >= goalFor(data, d),
      ).length
    : 0;
  const short = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  async function commit() {
    const n = Number(raw);
    if (!Number.isInteger(n) || n < (p.saveGoal ? 100 : 0) || n > (p.saveGoal ? 100000 : 200000))
      return;
    setBusy(true);
    try {
      if (p.saveGoal) await p.saveGoal(localDay(), n);
      else await p.save?.(selected, n);
      setRevision((n) => n + 1);
      setEdit(false);
      notifyAction(p.saveGoal ? "Steps goal updated" : "Steps saved", "success");
    } catch {
      notifyAction("Couldn't save steps. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }
  function editor() {
    return (
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <label className="text-sm font-semibold">
          {p.saveGoal ? "Daily steps goal" : "Steps for " + short(selected)}
          <input
            aria-label="Steps count"
            type="number"
            min={p.saveGoal ? 100 : 0}
            max={p.saveGoal ? 100000 : 200000}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="mt-3 h-11 w-full rounded-xl border border-line bg-panel px-3"
          />
        </label>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setEdit(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              busy ||
              raw.trim() === "" ||
              !Number.isInteger(Number(raw)) ||
              Number(raw) < (p.saveGoal ? 100 : 0) ||
              Number(raw) > (p.saveGoal ? 100000 : 200000)
            }
            onClick={() => void commit()}
          >
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    );
  }
  function trainerChart() {
    const counts = days.map((day) => data?.days.find((entry) => entry.date === day)?.count ?? 0);
    const maximum = Math.max(currentGoal, ...counts, 1) * 1.1;
    return (
      <div className="mt-5">
        <div className="text-center">
          <p className="text-sm text-fg-muted">Average</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {Math.round(total / 7).toLocaleString()}
          </p>
        </div>
        <div className="relative mt-8 h-48">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
          >
            {[0, 1, 2, 3, 4].map((line) => (
              <div key={line} className="border-t border-line/60" />
            ))}
          </div>
          <div className="relative grid h-full grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={day} className="group relative flex h-full items-end justify-center">
                <button
                  type="button"
                  aria-label={short(day) + ": " + counts[index]?.toLocaleString() + " steps"}
                  className="relative flex h-full w-full items-end justify-center outline-none"
                >
                  <span
                    className="w-5 rounded-t-md bg-signal/80 transition-[height] duration-200 group-hover:bg-signal group-focus-within:bg-signal"
                    style={{
                      height: `${((counts[index] ?? 0) / maximum) * 100}%`,
                      minHeight: counts[index] ? 3 : 0,
                    }}
                  />
                  <span className="pointer-events-none absolute bottom-1/2 left-1/2 z-10 hidden w-max max-w-40 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-left text-xs shadow-lg group-hover:block group-focus-within:block">
                    <strong className="block">
                      {new Date(day + "T12:00:00").toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </strong>
                    <span className="mt-1 block text-fg-muted">
                      Steps <b className="ml-2 text-fg">{counts[index]?.toLocaleString()}</b>
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-fg-muted">
          {days.map((day) => (
            <span key={day}>
              {new Date(day + "T12:00:00").toLocaleDateString(undefined, {
                weekday: "short",
                day: "numeric",
              })}
            </span>
          ))}
        </div>
      </div>
    );
  }
  function chart() {
    const maximum = Math.max(currentGoal, ...(data?.days.map((d) => d.count) ?? []), 1);
    return (
      <div className="mt-5 rounded-2xl border border-line p-4">
        <div className="mb-4 flex justify-between text-xs font-semibold">
          <span>This week</span>
          <span className="text-fg-subtle">Avg {Math.round(total / 7).toLocaleString()}</span>
        </div>
        <div
          className="relative grid h-32 grid-cols-7 gap-2"
          role="img"
          aria-label={
            "Daily steps: " +
            days
              .map(
                (d) =>
                  short(d) + ": " + (data?.days.find((r) => r.date === d)?.count ?? "not recorded"),
              )
              .join(", ")
          }
        >
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-signal/40"
            style={{ bottom: `${Math.min(100, (currentGoal / maximum) * 100)}%` }}
          />
          {days.map((d) => (
            <button
              type="button"
              key={d}
              aria-label={short(d)}
              title={
                short(d) +
                ": " +
                (data?.days.find((r) => r.date === d)?.count.toLocaleString() ?? "No recorded") +
                " steps"
              }
              onClick={() => setSelected(d)}
              className="relative flex items-end rounded-md bg-panel"
              disabled={d > localDay()}
            >
              <span
                className={`w-full rounded-md ${d === selected ? "bg-signal" : "bg-signal/40"}`}
                style={{
                  height: `${((data?.days.find((r) => r.date === d)?.count ?? 0) / maximum) * 100}%`,
                }}
              />
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 text-center text-xs text-fg-subtle">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={days[i]}>{d}</span>
          ))}
        </div>
      </div>
    );
  }
  if (p.save)
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-[24px] border border-line bg-surface p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-selected p-3 text-signal-text">
              <Footprints className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm text-fg-muted">Steps</p>
              <strong>
                {query.isPending
                  ? "Loading…"
                  : query.isError
                    ? "Couldn't load steps — tap to retry"
                    : data?.days.length
                      ? count.toLocaleString() + " steps"
                      : "No Steps Recorded"}
              </strong>
            </div>
            <ChevronRight className="size-4 text-fg-muted" />
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {days.map((d, i) => {
              const n = data?.days.find((r) => r.date === d)?.count;
              return (
                <div key={d} className="text-center">
                  <span
                    className="mx-auto flex aspect-square items-center justify-center rounded-full text-[10px] font-semibold"
                    style={{
                      background: `conic-gradient(var(--color-signal, #2456b8) ${Math.min(100, ((n ?? 0) / (data ? goalFor(data, d) : 10000)) * 100)}%, var(--color-line,#eee) 0)`,
                    }}
                  >
                    <span className="flex size-[82%] items-center justify-center rounded-full bg-surface">
                      {n === undefined ? "—" : n.toLocaleString()}
                    </span>
                  </span>
                  <p className="mt-1 text-xs text-fg-subtle">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-fg-muted">
            Track your daily steps to see your progress here.
          </p>
        </button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="mx-auto max-h-[92dvh] max-w-lg overflow-y-auto rounded-t-[28px] pb-8"
          >
            <SheetHeader>
              <SheetTitle>Steps</SheetTitle>
              <SheetDescription>{short(selected)}</SheetDescription>
            </SheetHeader>
            {query.isError ? (
              <div role="alert" className="mb-4 text-sm text-danger">
                Couldn't load steps.{" "}
                <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
                  Retry
                </Button>
              </div>
            ) : null}
            <div className="rounded-2xl bg-selected p-4 text-sm">
              <Trophy className="mr-2 inline size-5 text-signal-text" />
              <strong>{onTarget} of 7 days on target</strong>
              <p className="mt-1 text-fg-muted">Keep it up — your coach loves to see consistency</p>
            </div>
            <div className="mt-4 rounded-2xl border border-line bg-panel p-5 text-center">
              <div
                className="mx-auto flex size-48 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--color-signal,#2456b8) ${Math.min(100, (count / goal) * 100)}%, var(--color-line,#eee) 0)`,
                }}
              >
                <div className="flex size-[88%] flex-col items-center justify-center rounded-full bg-panel">
                  <strong className="text-4xl font-medium">{count.toLocaleString()}</strong>
                  <span className="mt-2 text-sm text-fg-muted">of {goal.toLocaleString()}</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                {Math.round((count / goal) * 100)}% · {Math.max(0, goal - count).toLocaleString()}{" "}
                to go
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-fg-subtle">
                <span>
                  {data?.days.find((d) => d.date === selected)?.updatedAt
                    ? "Updated " +
                      new Date(
                        data.days.find((d) => d.date === selected)!.updatedAt,
                      ).toLocaleString()
                    : "No steps recorded"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRaw(String(count));
                    setEdit(true);
                  }}
                >
                  <Pencil className="size-3" />
                  Edit steps
                </Button>
              </div>
              {edit ? editor() : null}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                [
                  "Distance",
                  heightCm ? "~" + ((count * heightCm * 0.00414) / 1000).toFixed(1) + " km" : "—",
                ],
                [
                  "Calories",
                  p.weightKg && heightCm
                    ? "~" +
                      Math.round(((count * heightCm * 0.00414) / 1000) * p.weightKg * 0.5) +
                      " kcal"
                    : "—",
                ],
                ["Active", "~" + Math.round(count / 100) + " min"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line p-3 text-sm">
                  <p className="text-fg-muted">{label}</p>
                  <strong className="mt-2 block">{value}</strong>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-fg-subtle">
              Estimates from your steps and available profile data.
            </p>
            {chart()}
          </SheetContent>
        </Sheet>
      </>
    );
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Previous week"
            onClick={() => setOffset((n) => n - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-center">
            <h3 className="font-semibold">Steps</h3>
            <p className="text-xs text-fg-muted">
              {short(first)} – {short(last)}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            disabled={offset === 0}
            aria-label="Next week"
            onClick={() => setOffset((n) => n + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        {query.isPending ? (
          <p className="py-16 text-center text-sm">Loading steps…</p>
        ) : query.isError ? (
          <Button onClick={() => void query.refetch()}>Retry loading steps</Button>
        ) : data?.days.length ? (
          trainerChart()
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center text-sm">
            <strong className="font-medium">No step data for this period</strong>
            <p className="mt-2 max-w-xs text-fg-muted">
              Use the arrows to view another seven-day period.
            </p>
          </div>
        )}
      </div>
      <footer className="flex items-center justify-between border-t border-line p-4 text-xs">
        <span className="flex items-center gap-1 text-fg-muted">
          <Target className="size-4" />
          Goal {currentGoal.toLocaleString()} steps
        </span>
        <Popover open={edit} onOpenChange={setEdit}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="font-medium text-signal-text"
              onClick={() => setRaw(String(currentGoal))}
            >
              Adjust goal
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-80 p-0">
            <div className="rounded-t-xl bg-selected p-4">
              <strong className="text-sm">Daily Steps Goal</strong>
              <p className="mt-1 text-xs text-fg-muted">Set the target steps for this client</p>
            </div>
            {editor()}
          </PopoverContent>
        </Popover>
      </footer>
    </section>
  );
}
