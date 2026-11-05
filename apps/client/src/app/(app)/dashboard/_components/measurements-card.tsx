"use client";
import { Button } from "@traiv/ui/components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@traiv/ui/components/sheet";
import { ChevronRight, Plus, Ruler } from "@traiv/ui/icons";
import { useId, useState } from "react";
import type { Metric } from "@/lib/api";
import { relativeDay } from "@/lib/dates";
import { type MeasurementEntry, useMeasurements } from "@/lib/query/use-measurements";
import { MeasurementEditor, MeasurementPicker } from "../../you/_components/profile-actions";

const order = ["weight", "waist", "hips", "thigh", "chest", "arm", "forearm"];
const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const clean = (n: number) => Number(n.toFixed(2));
export function MeasurementsCard({ studioId }: { studioId: string }) {
  const history = useMeasurements(studioId);
  const [open, setOpen] = useState(false);
  const fields =
    history.data?.fields.filter((f) => f.type === "number" && f.code !== "weight") ?? [];
  const recorded = fields.flatMap((field) => {
    const point = history.data?.entries.filter((e) => e.values[field.code] != null).at(-1);
    return point ? [{ field, point }] : [];
  });
  const lead = recorded[0];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="client-tappable flex w-full items-center gap-3 rounded-surface border border-line bg-surface px-3.5 py-3 text-left"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-signal-subtle">
          <Ruler className="size-4 text-signal-text" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-body-sm font-medium text-fg-muted">Body composition</span>
          <span className="text-body font-medium">
            {lead
              ? `${lead.field.name} ${clean(lead.point.values[lead.field.code] ?? 0)} ${lead.field.unit ?? ""}`
              : "Measurements & progress"}
            {recorded.length > 1 && (
              <span className="ml-2 text-caption text-fg-subtle">+{recorded.length - 1} more</span>
            )}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-fg-subtle" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        {open && <CompositionSheet studioId={studioId} />}
      </Sheet>
    </>
  );
}
function CompositionSheet({ studioId }: { studioId: string }) {
  const history = useMeasurements(studioId);
  const [code, setCode] = useState("waist");
  const [months, setMonths] = useState(3);
  const [adding, setAdding] = useState(false);
  const [metric, setMetric] = useState<Metric | null>(null);
  const fields = [
    ...(history.data?.fields.filter((f) => f.type === "number" || f.type === "rating") ?? []),
  ].sort(
    (a, b) =>
      (order.includes(a.code) ? order.indexOf(a.code) : 999) -
      (order.includes(b.code) ? order.indexOf(b.code) : 999),
  );
  const field = fields.find((f) => f.code === code) ?? fields[0];
  const entries = history.data?.entries ?? [];
  const series = field ? entries.filter((e) => e.values[field.code] != null) : [];
  const latest = series.at(-1),
    previous = series.at(-2);
  const latestValue = field && latest ? latest.values[field.code] : undefined;
  const delta =
    latestValue != null && field && previous
      ? clean(latestValue - (previous.values[field.code] ?? 0))
      : null;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const points = series.filter((e) => new Date(e.takenAt) >= cutoff);
  const photos = entries.filter((e) => Object.keys(e.imageUrls).length);
  const mostRecent = entries.at(-1);
  return (
    <SheetContent side="bottom" className="h-[88dvh] gap-0 p-0">
      <div aria-hidden="true" className="mx-auto mt-2 h-1 w-8 shrink-0 rounded-full bg-line" />
      <SheetHeader className="shrink-0">
        <p className="mb-1 text-xs text-fg-subtle">BODY</p>
        <SheetTitle className="text-xl font-medium">Body composition</SheetTitle>
      </SheetHeader>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {history.isPending ? (
          <p className="py-10 text-center text-sm text-fg-muted">Loading measurements…</p>
        ) : history.isError ? (
          <div role="alert" className="py-8 text-center">
            <p className="text-sm">Couldn't load your measurements.</p>
            <Button variant="outline" onClick={() => void history.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <section className="rounded-[24px] border border-line bg-panel p-4">
              <h3 className="text-sm text-fg-muted">{field?.name ?? "Measurements"}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <strong className="text-4xl font-medium tracking-tight">
                  {latestValue != null ? clean(latestValue) : "—"}
                </strong>
                <span className="text-sm text-fg-subtle">
                  {field?.unit ?? (field?.type === "rating" ? "/ 5" : "")}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                {delta != null && (
                  <span className="rounded-full border border-line bg-surface px-2 py-1 text-signal-text">
                    {delta > 0 ? "↑" : delta < 0 ? "↓" : "→"} {Math.abs(delta)} {field?.unit}
                  </span>
                )}
                {latest && <span className="text-fg-subtle">{dateLabel(latest.takenAt)}</span>}
              </div>
              <MeasurementChart
                entries={points}
                code={field?.code ?? ""}
                name={field?.name ?? "Measurement"}
              />
              <div className="mt-3 grid grid-cols-4 rounded-full border border-line bg-surface p-1">
                {[1, 3, 6, 12].map((n) => (
                  <button
                    type="button"
                    key={n}
                    aria-pressed={months === n}
                    onClick={() => setMonths(n)}
                    className={`rounded-full py-2 text-xs font-medium ${months === n ? "bg-signal text-signal-fg" : "text-fg-muted"}`}
                  >
                    {n === 12 ? "1Y" : `${n}M`}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Measurements</h3>
                {mostRecent && (
                  <span className="text-xs text-fg-subtle">
                    Updated {relativeDay(mostRecent.takenAt.slice(0, 10))}
                  </span>
                )}
              </div>
              <div className="divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-surface">
                {fields.map((f) => {
                  const rows = entries.filter((e) => e.values[f.code] != null),
                    last = rows.at(-1),
                    prev = rows.at(-2),
                    value = last?.values[f.code],
                    change =
                      value != null && prev ? clean(value - (prev.values[f.code] ?? 0)) : null;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={field?.code === f.code}
                      onClick={() => setCode(f.code)}
                      className={`flex w-full items-center gap-3 px-4 py-4 text-left ${field?.code === f.code ? "bg-signal-subtle/40" : "hover:bg-hover"}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{f.name}</span>
                        <span className="mt-1 block text-xs text-fg-subtle">
                          {prev
                            ? `Previous ${clean(prev.values[f.code] ?? 0)} ${f.unit ?? ""} · ${dateLabel(prev.takenAt)}`
                            : last
                              ? dateLabel(last.takenAt)
                              : "Not recorded yet"}
                        </span>
                      </span>
                      <span className="shrink-0 text-xl font-medium">
                        {value != null ? clean(value) : "—"}
                        <span className="ml-1 text-xs font-normal text-fg-subtle">
                          {f.unit ?? (f.type === "rating" ? "/ 5" : "")}
                        </span>
                      </span>
                      {change != null && (
                        <span className="min-w-12 text-right text-xs font-medium text-signal-text">
                          {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {Math.abs(change)} {f.unit}
                        </span>
                      )}
                    </button>
                  );
                })}
                {!fields.length && (
                  <p className="p-5 text-sm text-fg-muted">
                    Your coach hasn't enabled measurements yet.
                  </p>
                )}
              </div>
            </section>
            {photos.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold">Progress photos</h3>
                <div className="space-y-3">
                  {photos.toReversed().map((e) => (
                    <div key={e.id} className="rounded-2xl border border-line bg-surface p-3">
                      <p className="mb-2 text-xs text-fg-muted">{dateLabel(e.takenAt)}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(e.imageUrls).map(([key, url]) => (
                          <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={url}
                              alt={history.data?.fields.find((f) => f.code === key)?.name ?? key}
                              className="aspect-[3/4] w-full rounded-xl object-cover"
                            />
                            <span className="mt-1 block text-xs text-fg-muted">
                              {history.data?.fields.find((f) => f.code === key)?.name ?? key}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <Button
              className="h-12 w-full rounded-full bg-signal text-signal-fg"
              onClick={() => {
                setMetric(null);
                setAdding(true);
              }}
            >
              <Plus className="size-4" />
              Log new measurement
            </Button>
          </>
        )}
      </div>
      <Sheet open={adding} onOpenChange={setAdding}>
        {adding &&
          (metric ? (
            <MeasurementEditor
              metric={metric}
              studioId={studioId}
              onBack={() => setMetric(null)}
              onClose={() => setAdding(false)}
            />
          ) : (
            <MeasurementPicker studioId={studioId} onSelect={setMetric} />
          ))}
      </Sheet>
    </SheetContent>
  );
}
function MeasurementChart({
  entries,
  code,
  name,
}: {
  entries: MeasurementEntry[];
  code: string;
  name: string;
}) {
  const id = useId().replaceAll(":", "");
  const points = entries.map((e) => ({ date: Date.parse(e.takenAt), value: e.values[code] ?? 0 }));
  if (!points.length)
    return (
      <p className="flex h-40 items-center justify-center text-center text-sm text-fg-subtle">
        No measurements in this period.
      </p>
    );
  const values = points.map((p) => p.value),
    min = Math.min(...values),
    max = Math.max(...values),
    span = max - min || Math.max(Math.abs(max) * 0.1, 1);
  const first = points[0],
    last = points.at(-1);
  if (!first || !last) return null;
  const x = (date: number) =>
    points.length === 1
      ? 160
      : 12 + ((date - first.date) / Math.max(1, last.date - first.date)) * 296;
  const y = (value: number) => (max === min ? 80 : 140 - ((value - min) / span) * 120);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.date)},${y(p.value)}`).join(" ");
  return (
    <svg
      role="img"
      aria-label={`${name}: ${points.length} recorded measurements in this period`}
      viewBox="0 0 320 165"
      className="mt-3 h-44 w-full overflow-visible"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity=".18" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity=".03" />
        </linearGradient>
      </defs>
      {[30, 65, 100, 140].map((n) => (
        <line key={n} x1="12" x2="308" y1={n} y2={n} stroke="var(--line)" strokeWidth=".5" />
      ))}
      {points.length > 1 && (
        <path d={`${line} L${x(last.date)},150 L${x(first.date)},150 Z`} fill={`url(#${id})`} />
      )}
      <path
        d={line}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p, i) => (
        <circle
          key={`${p.date}-${i}`}
          cx={x(p.date)}
          cy={y(p.value)}
          r={i === points.length - 1 ? 4 : 2}
          fill="var(--surface)"
          stroke="var(--signal)"
          strokeWidth="1.5"
        >
          <title>
            {new Date(p.date).toLocaleDateString()}: {clean(p.value)}
          </title>
        </circle>
      ))}
    </svg>
  );
}
