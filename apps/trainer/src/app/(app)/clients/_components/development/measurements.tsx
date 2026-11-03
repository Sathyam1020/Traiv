"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useId, useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Popover, PopoverTrigger, PopoverContent } from "@traiv/ui/components/popover";
import { Calendar } from "@traiv/ui/components/calendar";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@traiv/ui/components/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@traiv/ui/components/dialog";
import { Switch } from "@traiv/ui/components/switch";
import {
  ChevronDown,
  Plus,
  Check,
  Download,
  SlidersHorizontal,
  CalendarDays,
} from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import { localDay } from "@traiv/ui/lib/steps";
import { http } from "@/lib/api/client";
import {
  type MeasurementEvent,
  type MeasurementField,
  pointsFor,
  weeklyPoints,
  swapChart,
  monday,
} from "./measurement-model";

type Data = { fields: MeasurementField[]; entries: MeasurementEvent[] };
const n = (v: number) => Number(v.toFixed(1)).toLocaleString();
const signed = (v: number) => (v > 0 ? "+" : "") + n(v);
const dateLabel = (date: string) =>
  new Date(date.length === 10 ? date + "T12:00:00" : date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const shortDate = (date: string) =>
  new Date(date.length === 10 ? date + "T12:00:00" : date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
const agoRange = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days + 1);
  return localDay(date);
};
const chip = "rounded-full border border-line bg-surface px-3 py-1.5 text-xs";
function DateControl({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs" aria-label={label}>
          {dateLabel(value)}
          <CalendarDays className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1">
        <Calendar
          mode="single"
          selected={new Date(value + "T12:00:00")}
          disabled={{ after: new Date() }}
          onSelect={(date) => {
            if (date) {
              onChange(localDay(date));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
export function BodyProgress({
  studioId,
  clientId,
  clientName,
  weightGoal,
}: {
  studioId: string;
  clientId: string;
  clientName: string;
  weightGoal: number | null;
}) {
  const qc = useQueryClient();
  const [from, setFrom] = useState(() => agoRange(30)),
    [to, setTo] = useState(localDay());
  const [rangeDraft, setRangeDraft] = useState({ from, to }),
    [rangeOpen, setRangeOpen] = useState(false);
  const [preset, setPreset] = useState(30),
    [layout, setLayout] = useState(2),
    [values, setValues] = useState(true);
  const [charts, setCharts] = useState(["total_circumference", "mood", "weight"]);
  const [hidden, setHidden] = useState<string[]>([]),
    [weekly, setWeekly] = useState(false);
  const [adding, setAdding] = useState(false),
    [sharing, setSharing] = useState(false),
    [busy, setBusy] = useState(false);
  const [entryDate, setEntryDate] = useState(localDay()),
    [inputs, setInputs] = useState<Record<string, string>>({});
  const [entryId, setEntryId] = useState("");
  const key = ["body-progress", studioId, clientId, from, to];
  const query = useQuery({
    queryKey: key,
    queryFn: async () =>
      (
        await http.get<Data>(`/studios/${studioId}/clients/${clientId}/measurements`, {
          params: { from, to },
        })
      ).data,
    staleTime: 15000,
    refetchInterval: 30000,
  });
  const fields = query.data?.fields ?? [],
    entries = query.data?.entries ?? [];
  const available = fields.filter((f) => pointsFor(entries, f.code).length);
  const rows = available.filter((f) => !hidden.includes(f.code));
  const resolvedCharts: string[] = [];
  for (const code of charts) {
    const next =
      available.find((f) => f.code === code && !resolvedCharts.includes(f.code)) ??
      available.find((f) => !resolvedCharts.includes(f.code));
    if (next) resolvedCharts.push(next.code);
  }
  const selectedCharts = resolvedCharts.slice(0, layout === 0 ? 1 : layout === 1 ? 2 : 3);
  const columns = weekly
    ? [...new Set(entries.map((e) => monday(e.takenAt)))].sort()
    : entries.map((e) => e.id);
  const inputFields = fields.filter(
    (f) =>
      f.code !== "total_circumference" &&
      [
        "weight",
        "waist",
        "hips",
        "chest",
        "thigh",
        "arm",
        "forearm",
        "mood",
        "energy",
        "nutrition",
        "progress",
        "sleep_quality",
      ].includes(f.code),
  );
  const parsed = Object.entries(inputs).filter(([, v]) => v.trim() !== "");
  const valid =
    parsed.length > 0 &&
    parsed.every(([code, raw]) => {
      const v = Number(raw),
        field = fields.find((f) => f.code === code);
      return (
        Number.isFinite(v) &&
        (code === "weight"
          ? v >= 25 && v <= 400
          : field?.unit === "cm"
            ? v > 0 && v <= 500
            : Number.isInteger(v) && v >= 1 && v <= 5)
      );
    });
  async function save() {
    if (!valid || busy) return;
    setBusy(true);
    try {
      await http.post(`/studios/${studioId}/clients/${clientId}/measurements`, {
        id: entryId,
        date: entryDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        values: Object.fromEntries(parsed.map(([key, value]) => [key, Number(value)])),
      });
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["body-progress", studioId, clientId] }),
        qc.invalidateQueries({ queryKey: ["development", studioId, clientId] }),
      ]);
      if (entryDate < from || entryDate > to) {
        setFrom(entryDate < from ? entryDate : from);
        setTo(entryDate > to ? entryDate : to);
        setPreset(0);
      }
      setAdding(false);
      notifyAction("Measurement added", "success");
    } catch {
      notifyAction("Couldn't save the measurement. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const escape = (s: string) =>
      s.replace(
        /[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
      );
    const summary = rows
      .map((f, i) => {
        const points = pointsFor(entries, f.code),
          a = points[0]!,
          b = points.at(-1)!;
        return `<text x="48" y="${174 + i * 48}" font-size="17" fill="#263442">${escape(f.name)}</text><text x="440" y="${174 + i * 48}" font-size="17" fill="#2456b8">${escape(n(b.value) + " " + f.unit + "   (" + signed(b.value - a.value) + ")")}</text>`;
      })
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="820" height="${Math.max(320, 220 + rows.length * 48)}"><rect width="100%" height="100%" fill="white"/><text x="48" y="55" font-family="sans-serif" font-size="26" font-weight="600" fill="#263442">${escape(clientName)} · Progress</text><text x="48" y="88" font-family="sans-serif" font-size="15" fill="#637080">${escape(dateLabel(from) + " – " + dateLabel(to))}</text><g font-family="sans-serif">${summary}</g><text x="48" y="${Math.max(290, 195 + rows.length * 48)}" font-family="sans-serif" font-size="12" fill="#637080">Traiv · Changes are relative to the first recorded value in this period</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `progress-${from}-${to}.svg`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notifyAction("Progress image downloaded", "success");
  }
  return (
    <section id="development-measurements" className="mt-8 scroll-mt-64 border-t border-line pt-7">
      <h2 className="text-base font-semibold">Body progress</h2>
      <p className="mb-5 mt-1 text-xs text-fg-muted">
        Weight, circumference and every other measurement, week by week.
      </p>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="text-xs text-fg-muted">
            {dateLabel(from)} – {dateLabel(to)}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-panel p-1">
              {[
                [30, "30 days"],
                [90, "90 days"],
                [183, "6 months"],
                [365, "12 months"],
              ].map(([days, text]) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setPreset(Number(days));
                    setFrom(agoRange(Number(days)));
                    setTo(localDay());
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs ${preset === days ? "bg-surface font-semibold shadow-sm" : "text-fg-muted"}`}
                >
                  {text}
                </button>
              ))}
            </div>
            <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => setRangeDraft({ from, to })}
                >
                  {dateLabel(from)} – {dateLabel(to)}
                  <ChevronDown className="size-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 space-y-3">
                <strong className="text-sm">Date range</strong>
                <p className="text-xs text-fg-muted">Up to one year</p>
                <DateControl
                  label="From date"
                  value={rangeDraft.from}
                  onChange={(v) => setRangeDraft((d) => ({ ...d, from: v }))}
                />
                <DateControl
                  label="To date"
                  value={rangeDraft.to}
                  onChange={(v) => setRangeDraft((d) => ({ ...d, to: v }))}
                />
                <Button
                  className="w-full"
                  disabled={
                    rangeDraft.from > rangeDraft.to ||
                    (Date.parse(rangeDraft.to) - Date.parse(rangeDraft.from)) / 86400000 > 366
                  }
                  onClick={() => {
                    setFrom(rangeDraft.from);
                    setTo(rangeDraft.to);
                    setPreset(0);
                    setRangeOpen(false);
                  }}
                >
                  Apply range
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        {available.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              Layout
              <div className="flex rounded-full bg-panel p-1">
                {[0, 1, 2, 3].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={
                      [
                        "One chart",
                        "Two columns",
                        "Two charts above one wide chart",
                        "One large chart beside two charts",
                      ][v]
                    }
                    aria-pressed={layout === v}
                    onClick={() => setLayout(v)}
                    className={`rounded-full px-2 py-1.5 ${layout === v ? "bg-surface text-signal-text shadow-sm" : "text-fg-muted"}`}
                  >
                    <LayoutIcon layout={v} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs">
                <Switch checked={values} onCheckedChange={setValues} />
                Values
              </label>
              <Button
                size="sm"
                variant="outline"
                disabled={!rows.length}
                onClick={() => setSharing(true)}
              >
                Share progress
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setInputs({});
                  setEntryDate(localDay());
                  setEntryId(crypto.randomUUID());
                  setAdding(true);
                }}
              >
                <Plus className="size-3" />
                Add measurement
              </Button>
            </div>
          </div>
        ) : null}
        {query.isPending ? (
          <p className="p-12 text-center text-sm text-fg-muted">Loading measurements…</p>
        ) : query.isError ? (
          <div className="p-6">
            <Button onClick={() => void query.refetch()}>Retry measurements</Button>
          </div>
        ) : !available.length ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-5 py-14 text-center">
            <h3 className="text-base font-semibold">No measurements in this period</h3>
            <p className="mt-3 text-sm text-fg-muted">
              Pick a longer period, or add a measurement yourself.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPreset(365);
                  setFrom(agoRange(365));
                  setTo(localDay());
                }}
              >
                Show last 12 months
              </Button>
              <Button
                onClick={() => {
                  setInputs({});
                  setEntryDate(localDay());
                  setEntryId(crypto.randomUUID());
                  setAdding(true);
                }}
              >
                <Plus className="size-4" />
                Add measurement
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-2 bg-panel/25 p-2 lg:h-[clamp(480px,60dvh,680px)] ${layout === 0 ? "grid-cols-1 lg:grid-rows-1" : layout === 1 ? "lg:grid-cols-2 lg:grid-rows-1" : layout === 2 ? "lg:grid-cols-2 lg:grid-rows-2" : "lg:grid-cols-[2fr_1fr] lg:grid-rows-2"}`}
            >
              {selectedCharts.map((code, index) => {
                const field =
                  fields.find((f) => f.code === code) ?? available[index % available.length]!;
                return (
                  <MeasurementChart
                    key={index}
                    field={field}
                    entries={entries}
                    fields={available}
                    values={values}
                    goal={field.code === "weight" ? weightGoal : null}
                    index={index}
                    charts={resolvedCharts}
                    setChart={(code) => setCharts(swapChart(resolvedCharts, index, code))}
                    className={
                      layout === 2 && index === 2
                        ? "lg:col-span-2"
                        : layout === 3 && index === 0
                          ? "lg:row-span-2"
                          : ""
                    }
                  />
                );
              })}
            </div>
            <div className="m-2 overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="max-h-[min(650px,65dvh)] overflow-auto overscroll-y-auto">
                <table className="w-full text-xs [&_th]:px-4 [&_td]:px-4">
                  <thead className="sticky top-0 z-10 bg-surface">
                    <tr className="border-b border-line">
                      <th className="sticky left-0 z-20 min-w-44 bg-surface px-4 py-3 text-left font-medium text-fg-muted">
                        Measurement
                      </th>
                      {columns.map((column) => {
                        const event = entries.find((e) => e.id === column);
                        return (
                          <th key={column} className="min-w-28 p-3 text-center font-medium">
                            {weekly ? (
                              <>Week of {shortDate(column)}</>
                            ) : (
                              <>
                                {shortDate(event!.takenAt)}
                                <span className="mt-1 block text-[10px] font-normal text-fg-muted">
                                  {event?.source === "check_in" ? "● " : ""}
                                  {new Date(event!.takenAt).toLocaleTimeString(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </>
                            )}
                          </th>
                        );
                      })}
                      <th className="min-w-28 p-4 text-right font-medium text-fg-muted">
                        {weekly ? "Total" : "In period"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((field) => {
                      const points = pointsFor(entries, field.code),
                        first = points[0]!,
                        latest = points.at(-1)!;
                      return (
                        <tr
                          key={field.code}
                          className="border-b border-line last:border-0 hover:bg-panel/40"
                        >
                          <th className="sticky left-0 z-[1] bg-surface px-4 py-3 text-left font-medium">
                            <span className="block">{field.name}</span>
                            <span className="mt-1 block text-[10px] font-normal text-fg-muted">
                              {field.unit} · {points.length} entries
                            </span>
                          </th>
                          {columns.map((column) => {
                            const point = weekly
                              ? weeklyPoints(entries, field.code).find((p) => p.week === column)
                              : points.find((p) => p.id === column);
                            const value = point?.value;
                            const previous =
                              !weekly && point
                                ? points[points.findIndex((p) => p.id === column) - 1]
                                : null;
                            return (
                              <td key={column} className="px-4 py-3 text-center tabular-nums">
                                {value == null ? (
                                  <span className="text-fg-subtle">—</span>
                                ) : (
                                  <>
                                    <strong className="font-medium">
                                      {weekly && point && "change" in point
                                        ? signed(Number(point.change))
                                        : n(value)}
                                    </strong>
                                    {weekly ? (
                                      <span className="mt-1 block text-[10px] text-fg-muted">
                                        {n(value)} {field.unit}
                                      </span>
                                    ) : previous ? (
                                      <span className="mt-1 block text-[10px] text-fg-muted">
                                        {signed(value - previous.value)}
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-right">
                            <span className="inline-block rounded-full bg-selected px-2.5 py-1 font-medium text-signal-text">
                              {signed(latest.value - first.value)}{" "}
                              {field.unit === "1–5" ? "" : field.unit}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-3">
                <div className="flex items-center gap-3">
                  <div className="flex rounded-full bg-panel p-1">
                    {[false, true].map((value) => (
                      <button
                        type="button"
                        key={String(value)}
                        onClick={() => setWeekly(value)}
                        className={`rounded-full px-3 py-1.5 text-xs ${weekly === value ? "bg-surface font-medium shadow-sm" : "text-fg-muted"}`}
                      >
                        {value ? "Total change" : "Every entry"}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-fg-muted">
                    <span className="text-signal">●</span> Check-in submitted
                  </span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className={chip + " flex items-center gap-2"}>
                      <SlidersHorizontal className="size-3" />
                      {rows.length} of {available.length} shown
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="w-72 p-0">
                    <div className="border-b border-line p-4">
                      <strong className="text-sm">Rows in the table</strong>
                      <p className="mt-1 text-xs text-fg-muted">
                        Measurements with entries in this period.
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2">
                      {available.map((f) => (
                        <label
                          key={f.code}
                          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm hover:bg-panel"
                        >
                          <input
                            type="checkbox"
                            className="accent-[var(--color-signal)]"
                            checked={!hidden.includes(f.code)}
                            onChange={(e) =>
                              setHidden((old) =>
                                e.target.checked
                                  ? old.filter((code) => code !== f.code)
                                  : [...old, f.code],
                              )
                            }
                          />
                          <span className="flex-1">{f.name}</span>
                          <span className="text-xs text-fg-muted">{f.unit}</span>
                        </label>
                      ))}
                    </div>
                    <footer className="flex items-center justify-between border-t border-line bg-panel p-3 text-xs">
                      <span>{rows.length} rows shown</span>
                      <button
                        type="button"
                        className="font-medium text-signal-text"
                        onClick={() => setHidden([])}
                      >
                        Show all
                      </button>
                    </footer>
                  </PopoverContent>
                </Popover>
              </footer>
            </div>
          </>
        )}
      </div>
      <Sheet
        open={adding}
        onOpenChange={(v) => {
          if (!busy) setAdding(v);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetTitle>Add measurement</SheetTitle>
          <SheetDescription>Record measurements without creating a check-in.</SheetDescription>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-5">
            <label className="block space-y-2 text-xs font-medium">
              <span>Date</span>
              <DateControl value={entryDate} onChange={setEntryDate} label="Measurement date" />
            </label>
            {inputFields.map((f) => (
              <label
                key={f.code}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3"
              >
                <span className="flex-1 text-sm">{f.name}</span>
                <input
                  aria-label={f.name}
                  type="number"
                  inputMode="decimal"
                  step={f.unit === "1–5" ? 1 : 0.1}
                  min={f.code === "weight" ? 25 : f.unit === "cm" ? 0.1 : 1}
                  max={f.code === "weight" ? 400 : f.unit === "cm" ? 500 : 5}
                  value={inputs[f.code] ?? ""}
                  placeholder="—"
                  onChange={(e) => setInputs((old) => ({ ...old, [f.code]: e.target.value }))}
                  className="h-9 w-24 rounded-lg border border-line bg-panel px-2 text-right text-sm"
                />
                <span className="w-8 text-xs text-fg-muted">{f.unit}</span>
              </label>
            ))}
          </div>
          <div className="flex shrink-0 gap-3 border-t border-line pt-4">
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" disabled={!valid || busy} onClick={() => void save()}>
              {busy ? "Saving…" : "Save measurement"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={sharing} onOpenChange={setSharing}>
        <DialogContent>
          <DialogTitle>Share progress</DialogTitle>
          <DialogDescription>
            Download a progress summary for {clientName}. Only measurements visible in your table
            are included.
          </DialogDescription>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-line p-4">
            <p className="mb-4 text-xs text-fg-muted">
              {dateLabel(from)} – {dateLabel(to)}
            </p>
            {rows.map((f) => {
              const points = pointsFor(entries, f.code);
              return (
                <p key={f.code} className="my-2 flex justify-between text-sm">
                  <span>{f.name}</span>
                  <strong>
                    {n(points.at(-1)!.value)} {f.unit}
                  </strong>
                </p>
              );
            })}
          </div>
          <Button onClick={download}>
            <Download className="size-4" />
            Download progress image
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
function LayoutIcon({ layout }: { layout: number }) {
  return (
    <svg
      viewBox="0 0 24 18"
      className="h-4 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      {layout === 0 ? (
        <rect x="1" y="1" width="22" height="16" rx="2" />
      ) : layout === 1 ? (
        <>
          <rect x="1" y="1" width="10" height="16" rx="2" />
          <rect x="13" y="1" width="10" height="16" rx="2" />
        </>
      ) : layout === 2 ? (
        <>
          <rect x="1" y="1" width="10" height="7" rx="2" />
          <rect x="13" y="1" width="10" height="7" rx="2" />
          <rect x="1" y="10" width="22" height="7" rx="2" />
        </>
      ) : (
        <>
          <rect x="1" y="1" width="14" height="16" rx="2" />
          <rect x="17" y="1" width="6" height="7" rx="1" />
          <rect x="17" y="10" width="6" height="7" rx="1" />
        </>
      )}
    </svg>
  );
}
function MeasurementChart({
  field,
  entries,
  fields,
  values,
  goal,
  index,
  charts,
  setChart,
  className,
}: {
  field: MeasurementField;
  entries: MeasurementEvent[];
  fields: MeasurementField[];
  values: boolean;
  goal: number | null;
  index: number;
  charts: string[];
  setChart: (code: string) => void;
  className?: string;
}) {
  const gradient = useId(),
    [open, setOpen] = useState(false),
    [hover, setHover] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotSize, setPlotSize] = useState({ width: 640, height: 220 });
  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry)
        setPlotSize({
          width: Math.max(240, entry.contentRect.width),
          height: Math.max(90, entry.contentRect.height),
        });
    });
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);
  const right = plotSize.width - 68,
    bottom = plotSize.height - 28;
  const points = pointsFor(entries, field.code),
    first = points[0],
    latest = points.at(-1),
    previous = points.at(-2);
  const numbers = [...points.map((p) => p.value), ...(goal != null ? [goal] : [])];
  const low = field.unit === "1–5" ? 1 : Math.min(...numbers),
    high = field.unit === "1–5" ? 5 : Math.max(...numbers);
  const padding = field.unit === "1–5" ? 0 : Math.max((high - low) * 0.15, high * 0.02, 1);
  const min = Math.max(0, low - padding),
    max = high + padding;
  const t0 = first ? Date.parse(first.takenAt) : 0,
    t1 = latest ? Date.parse(latest.takenAt) : 1;
  const x = (i: number) =>
    points.length === 1
      ? (45 + right) / 2
      : 45 + ((Date.parse(points[i]!.takenAt) - t0) / Math.max(1, t1 - t0)) * (right - 45);
  const y = (v: number) => bottom - ((v - min) / Math.max(0.01, max - min)) * (bottom - 22);
  const line = points
    .map((p, i) =>
      i === 0
        ? `M${x(i)},${y(p.value)}`
        : `C${(x(i - 1) + x(i)) / 2},${y(points[i - 1]!.value)} ${(x(i - 1) + x(i)) / 2},${y(p.value)} ${x(i)},${y(p.value)}`,
    )
    .join(" ");
  return (
    <section
      className={`flex min-h-0 min-w-0 flex-col rounded-2xl border border-line bg-surface p-4 ${className ?? ""}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="flex items-center gap-2 text-sm font-semibold">
              <i className="size-2 rounded-sm bg-signal" />
              {field.name}
              <ChevronDown className="size-3 text-fg-muted" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-0">
            <div className="border-b border-line p-4">
              <strong className="text-sm">Show in this chart</strong>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                Measurements with entries in this period. Picking one already shown swaps the two
                charts.
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {[...new Set(fields.map((f) => f.group))].map((group) => (
                <div key={group}>
                  <p className="px-2 pb-1 pt-3 text-[10px] text-fg-muted">{group}</p>
                  {fields
                    .filter((f) => f.group === group)
                    .map((f) => {
                      const last = pointsFor(entries, f.code).at(-1)!,
                        shown = charts.indexOf(f.code);
                      return (
                        <button
                          type="button"
                          key={f.code}
                          onClick={() => {
                            setChart(f.code);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs ${field.code === f.code ? "bg-panel font-medium" : "hover:bg-panel"}`}
                        >
                          <span className="flex-1">{f.name}</span>
                          <span className="text-[10px] text-fg-muted">
                            {shown !== -1 && shown !== index ? `in chart ${shown + 1} · ` : ""}
                            {n(last.value)} {f.unit}
                          </span>
                          {f.code === field.code ? (
                            <Check className="size-3 text-signal-text" />
                          ) : null}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <p className="text-[10px] text-fg-muted">
          {points.length} entries
          {latest
            ? ` · last ${dateLabel(latest.takenAt)}, ${new Date(latest.takenAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
            : ""}
        </p>
      </header>
      {latest && first ? (
        <>
          <p className="mt-2 shrink-0 text-2xl font-semibold">
            {n(latest.value)}
            <span className="ml-1 text-xs font-normal text-fg-muted">
              {field.unit === "1–5" ? "/ 5" : field.unit}
            </span>
          </p>
          <div className="mt-1 flex shrink-0 flex-wrap items-center gap-2 text-[10px] text-fg-muted">
            {previous ? (
              <>
                <span className="rounded-full bg-selected px-2 py-1 font-medium text-signal-text">
                  {signed(latest.value - previous.value)} {field.unit === "1–5" ? "" : field.unit}
                </span>
                <span>since last entry</span>
              </>
            ) : null}
            <span className="rounded-full bg-selected px-2 py-1 font-medium text-signal-text">
              {signed(latest.value - first.value)} {field.unit === "1–5" ? "" : field.unit}
            </span>
            <span>in period</span>
          </div>
          <div
            ref={plotRef}
            className="relative mt-2 h-48 min-h-0 flex-1 lg:h-auto"
            onMouseLeave={() => setHover(null)}
          >
            <svg
              viewBox={`0 0 ${plotSize.width} ${plotSize.height}`}
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label={`${field.name} history: ${points.map((p) => `${dateLabel(p.takenAt)} ${n(p.value)}`).join(", ")}`}
            >
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="var(--color-signal)" stopOpacity=".12" />
                  <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((i) => {
                const v = min + ((max - min) * i) / 4;
                return (
                  <g key={i}>
                    <line
                      x1="40"
                      x2={right}
                      y1={y(v)}
                      y2={y(v)}
                      stroke="var(--color-line)"
                      strokeWidth=".6"
                    />
                    <text
                      x="30"
                      y={y(v) + 3}
                      textAnchor="end"
                      fill="var(--color-fg-muted)"
                      fontSize="9"
                    >
                      {n(v)}
                    </text>
                  </g>
                );
              })}
              {goal != null ? (
                <>
                  <line
                    x1="40"
                    x2={right}
                    y1={y(goal)}
                    y2={y(goal)}
                    stroke="var(--color-fg-muted)"
                    strokeDasharray="2 3"
                  />
                  <text x={right + 5} y={y(goal) + 3} fontSize="9" fill="var(--color-fg-muted)">
                    Goal {n(goal)}
                  </text>
                </>
              ) : null}
              <path
                d={`${line} L${x(points.length - 1)},${bottom} L${x(0)},${bottom} Z`}
                fill={`url(#${gradient})`}
              />
              <path d={line} fill="none" stroke="var(--color-signal)" strokeWidth="1.8" />
              {points.map((p, i) => (
                <g key={p.id}>
                  <circle
                    cx={x(i)}
                    cy={y(p.value)}
                    r="3.5"
                    fill="var(--color-signal)"
                    stroke="var(--color-surface)"
                    strokeWidth="1.5"
                  />
                  {values ? (
                    <text
                      x={x(i)}
                      y={y(p.value) - 9}
                      fontSize="10"
                      textAnchor="middle"
                      fill="currentColor"
                    >
                      {n(p.value)}
                    </text>
                  ) : null}
                  <circle
                    cx={x(i)}
                    cy={y(p.value)}
                    r="12"
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${dateLabel(p.takenAt)}: ${n(p.value)} ${field.unit}`}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onMouseEnter={() => setHover(i)}
                  />
                  <text
                    x={x(i)}
                    y={bottom + 21}
                    fontSize="9"
                    textAnchor="middle"
                    fill="var(--color-fg-muted)"
                  >
                    {points.length <= 5 || i === 0 || i === points.length - 1
                      ? shortDate(p.takenAt)
                      : ""}
                  </text>
                </g>
              ))}
            </svg>
            {hover != null && points[hover] ? (
              <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-xl border border-line bg-surface p-3 text-xs shadow-lg">
                <p className="text-fg-muted">
                  {dateLabel(points[hover]!.takenAt)} ·{" "}
                  {new Date(points[hover]!.takenAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <strong className="mt-1 block">
                  {n(points[hover]!.value)} {field.unit}
                </strong>
                <p className="mt-1 text-[10px] text-fg-muted">
                  {signed(points[hover]!.value - first.value)} vs {shortDate(first.takenAt)} ·{" "}
                  {points[hover]!.source === "check_in" ? "Check-in" : "Manual entry"}
                </p>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <p className="py-20 text-center text-sm text-fg-muted">
          No entries for this measurement in this period
        </p>
      )}
    </section>
  );
}
