"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@traiv/ui/components/sheet";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ClipboardList,
  FileText,
  Footprints,
  Ruler,
  Star,
  Upload,
} from "@traiv/ui/icons";
import { localDay, type StepsData } from "@traiv/ui/lib/steps";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { type Metric, uploadApi } from "@/lib/api";
import { http } from "@/lib/api/client";
import { useCmInches } from "@/lib/length-units";
import { useCheckIns } from "@/lib/query";

import { useVault } from "@/lib/query/use-vault";

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
function offset(date: string, by: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + by);
  return localDay(d);
}
export function ProfileActions({ studioId }: { studioId: string }) {
  const router = useRouter();
  const checkIns = useCheckIns(studioId);
  const vault = useVault(studioId);
  const unread = vault.data?.filter((r) => !r.seenAt).length ?? 0;
  const [sheet, setSheet] = useState<"steps" | "measurement" | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Metric | null>(null);
  const pending = checkIns.data?.checkIns
    .filter((c) => c.state === "upcoming" || c.state === "overdue")
    .sort((a, b) => a.dueOn.localeCompare(b.dueOn))[0];
  const rowClass =
    "client-tappable flex min-h-14 w-full items-center gap-4 px-4 py-4 text-left text-sm font-medium";
  return (
    <section className="px-4 pt-7">
      <h2 className="mb-4 text-sm font-medium text-fg-muted">My profile</h2>
      <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
        <button
          type="button"
          className={rowClass}
          disabled={checkIns.isPending}
          onClick={() => {
            if (pending) router.push(`/check-in/${pending.id}?from=profile`);
            else
              setError(
                checkIns.isError
                  ? "Couldn't load your check-in. Please try again."
                  : "You have no open check-ins right now.",
              );
          }}
        >
          <ClipboardList className="size-5 text-fg-subtle" />
          New check-in
          <ChevronRight className="ml-auto size-4 text-fg-subtle" />
        </button>
        <button
          type="button"
          className={rowClass}
          onClick={() => {
            setSelected(null);
            setSheet("measurement");
          }}
        >
          <Ruler className="size-5 text-fg-subtle" />
          Add measurement
          <ChevronRight className="ml-auto size-4 text-fg-subtle" />
        </button>
        <button type="button" className={rowClass} onClick={() => setSheet("steps")}>
          <Footprints className="size-5 text-fg-subtle" />
          Edit steps
          <ChevronRight className="ml-auto size-4 text-fg-subtle" />
        </button>
        <Link href="/vault?from=profile" className={rowClass}>
          <FileText className="size-5 text-fg-subtle" />
          Lessons &amp; Documents{unread > 0 ? ` (${unread})` : ""}
          <ChevronRight className="ml-auto size-4 text-fg-subtle" />
        </Link>
      </div>
      {error && (
        <p role="status" className="mt-3 text-sm text-fg-muted">
          {error}
        </p>
      )}
      <Sheet open={sheet === "steps"} onOpenChange={(open) => !open && setSheet(null)}>
        {sheet === "steps" && <StepsEditor studioId={studioId} onClose={() => setSheet(null)} />}
      </Sheet>
      <Sheet open={sheet === "measurement"} onOpenChange={(open) => !open && setSheet(null)}>
        {sheet === "measurement" &&
          (selected ? (
            <MeasurementEditor
              key={selected.id}
              metric={selected}
              studioId={studioId}
              onBack={() => setSelected(null)}
              onClose={() => setSheet(null)}
            />
          ) : (
            <MeasurementPicker studioId={studioId} onSelect={setSelected} />
          ))}
      </Sheet>
    </section>
  );
}
function DatePager({ date, onChange }: { date: string; onChange: (date: string) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface p-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Previous day"
        onClick={() => onChange(offset(date, -1))}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <div className="text-center">
        <p className="text-sm font-semibold">
          {date === localDay()
            ? "Today"
            : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "long" })}
        </p>
        <p className="mt-1 text-xs text-fg-subtle">{date}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Next day"
        disabled={date >= localDay()}
        onClick={() => onChange(offset(date, 1))}
      >
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
function Actions({
  busy,
  disabled,
  onCancel,
}: {
  busy: boolean;
  disabled?: boolean;
  onCancel: () => void;
}) {
  return (
    <footer className="grid shrink-0 grid-cols-2 gap-3 px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={busy || disabled} className="bg-signal text-signal-fg">
        {busy ? "Saving…" : "Save"}
      </Button>
    </footer>
  );
}
function StepsEditor({ studioId, onClose }: { studioId: string; onClose: () => void }) {
  const [date, setDate] = useState(localDay());
  return (
    <SheetContent side="bottom" className="gap-0 bg-panel p-0">
      <SheetHeader className="text-center">
        <SheetTitle className="pr-0 text-lg">Edit steps</SheetTitle>
      </SheetHeader>
      <StepsForm
        key={date}
        studioId={studioId}
        date={date}
        onDateChange={setDate}
        onClose={onClose}
      />
    </SheetContent>
  );
}
function StepsForm({
  studioId,
  date,
  onDateChange,
  onClose,
}: {
  studioId: string;
  date: string;
  onDateChange: (date: string) => void;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fieldId = useId();
  const current = useQuery({
    queryKey: ["profile-steps", studioId, date],
    queryFn: async () =>
      (await http.get<StepsData>(`/c/${studioId}/steps`, { params: { start: date, end: date } }))
        .data,
  });
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const valid = /^\d+$/.test(raw) && Number(raw) <= 200000;
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError("");
    try {
      await http.put(`/c/${studioId}/steps`, { date, count: Number(raw), timeZone: timeZone() });
      await qc.invalidateQueries({ queryKey: ["profile-steps", studioId] });
      window.dispatchEvent(new Event("traiv:steps-updated"));
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save steps.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="flex min-h-0 flex-col">
      <div className="space-y-5 overflow-y-auto px-5 py-3">
        <DatePager date={date} onChange={onDateChange} />
        <div>
          <p className="text-xs text-fg-subtle">Current registered steps</p>
          <p className="mt-1 text-base font-semibold">
            {current.isPending
              ? "Loading…"
              : current.isError
                ? "Unavailable"
                : (current.data.days[0]?.count ?? 0)}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor={fieldId} className="text-sm font-medium">
            Override steps
          </label>
          <div className="relative">
            <Input
              id={fieldId}
              type="number"
              inputMode="numeric"
              min={0}
              max={200000}
              step={1}
              placeholder="0"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              disabled={busy}
              className="h-12 w-full bg-surface pr-20"
            />
            <span className="pointer-events-none absolute inset-y-2 right-0 flex w-16 items-center justify-center border-l border-line text-sm text-fg-subtle">
              steps
            </span>
          </div>
        </div>
        {current.isError && (
          <p role="alert" className="text-sm text-danger">
            Couldn't load registered steps.{" "}
            <button type="button" className="underline" onClick={() => void current.refetch()}>
              Retry
            </button>
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
      <Actions
        busy={busy}
        disabled={!valid || current.isPending || current.isError}
        onCancel={onClose}
      />
    </form>
  );
}
const order = [
  "weight",
  "arm",
  "chest",
  "forearm",
  "hips",
  "thigh",
  "waist",
  "photo_back",
  "photo_front",
  "photo_side",
  "mood",
  "energy",
  "nutrition",
  "progress",
  "sleep_quality",
];
export function MeasurementPicker({
  studioId,
  onSelect,
}: {
  studioId: string;
  onSelect: (metric: Metric) => void;
}) {
  const metrics = useQuery({
    queryKey: ["profile-metrics", studioId],
    queryFn: async () => (await http.get<Metric[]>(`/c/${studioId}/measurements`)).data,
  });
  const sorted = [...(metrics.data ?? [])].sort(
    (a, b) =>
      (order.indexOf(a.code) < 0 ? 999 : order.indexOf(a.code)) -
      (order.indexOf(b.code) < 0 ? 999 : order.indexOf(b.code)),
  );
  return (
    <SheetContent side="bottom" className="h-[75dvh] gap-0 bg-panel p-0">
      <SheetHeader className="shrink-0 text-center">
        <SheetTitle className="pr-0 text-lg">Select a measurement</SheetTitle>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {metrics.isPending ? (
          <p className="p-6 text-center text-sm">Loading measurements…</p>
        ) : metrics.isError ? (
          <div role="alert" className="p-5 text-center">
            <p>Couldn't load measurements.</p>
            <Button variant="outline" onClick={() => void metrics.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-xl bg-surface">
            {sorted.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m)}
                className="client-tappable flex min-h-16 w-full flex-col justify-center gap-1 px-4 py-3 text-left"
              >
                <span className="text-sm font-medium">{m.name}</span>
                <span className="text-xs text-fg-subtle">
                  {m.type === "image" ? "Image" : m.type === "rating" ? "Rating" : m.unit}
                </span>
              </button>
            ))}
            {!sorted.length && (
              <p className="p-5 text-sm text-fg-muted">
                Your coach hasn't enabled measurements yet.
              </p>
            )}
          </div>
        )}
      </div>
    </SheetContent>
  );
}
export function MeasurementEditor({
  studioId,
  metric,
  onBack,
  onClose,
}: {
  studioId: string;
  metric: Metric;
  onBack: () => void;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fieldId = useId();
  const input = useRef<HTMLInputElement>(null);
  const id = useRef(crypto.randomUUID());
  const [date, setDate] = useState(localDay());
  const [raw, setRaw] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // A circumference field is the only kind measured in cm — weight (kg), sleep
  // (hours), and ratings all keep the plain `raw` field below untouched. Called
  // unconditionally because hooks must be; only read when it actually applies.
  const length = useCmInches(null);
  const isLength = metric.type === "number" && metric.unit === "cm";
  const hasValue = isLength ? length.hasValue : raw !== "";
  const numeric = isLength ? (length.cm ?? Number.NaN) : Number(raw);
  const valid =
    metric.type === "image"
      ? Boolean(file)
      : hasValue &&
        Number.isFinite(numeric) &&
        numeric > 0 &&
        numeric <= (metric.type === "rating" ? 5 : metric.code === "weight" ? 500 : 1000);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError("");
    try {
      let value: number | string = numeric;
      if (metric.type === "image" && file) {
        value = url || (await uploadApi.put(await uploadApi.sign(studioId), file));
        setUrl(value);
      }
      await http.post(`/c/${studioId}/measurements`, {
        id: id.current,
        metricId: metric.id,
        date,
        timeZone: timeZone(),
        value,
      });
      await qc.invalidateQueries({ queryKey: ["client", "today", studioId] });
      await qc.invalidateQueries({ queryKey: ["measurement-history", studioId] });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save measurement.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <SheetContent
      side="bottom"
      className="max-h-[85dvh] gap-0 bg-panel p-0"
      dragToDismiss={!busy}
      onInteractOutside={(e) => busy && e.preventDefault()}
    >
      <SheetHeader className="relative shrink-0 text-center">
        <button
          type="button"
          aria-label="Choose another measurement"
          disabled={busy}
          onClick={onBack}
          className="absolute top-4 left-4 flex size-8 items-center justify-center"
        >
          <ArrowLeft className="size-4" />
        </button>
        <SheetTitle className="pr-0 text-lg">{metric.name}</SheetTitle>
      </SheetHeader>
      <form onSubmit={save} className="flex min-h-0 flex-col">
        <div className="space-y-5 overflow-y-auto px-5 py-3">
          <DatePager date={date} onChange={setDate} />
          {metric.type === "image" ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface p-5 text-center">
              <input
                ref={input}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const chosen = e.target.files?.[0];
                  if (
                    chosen &&
                    chosen.type.startsWith("image/") &&
                    chosen.size <= 20 * 1024 * 1024
                  ) {
                    setFile(chosen);
                    setUrl("");
                    setError("");
                  } else setError("Choose an image up to 20 MB.");
                }}
              />
              <Button type="button" variant="outline" onClick={() => input.current?.click()}>
                <Upload className="size-4" />
                {file ? "Change image" : "Choose image"}
              </Button>
              {file && <p className="mt-3 break-all text-xs text-fg-muted">{file.name}</p>}
            </div>
          ) : metric.type === "rating" ? (
            <div className="flex justify-center gap-3 py-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  aria-label={`Rate ${n} out of 5`}
                  aria-pressed={numeric === n}
                  onClick={() => setRaw(String(n))}
                  className="p-1"
                >
                  <Star
                    className={`size-8 ${numeric >= n ? "fill-current text-warning" : "text-fg-subtle"}`}
                  />
                </button>
              ))}
            </div>
          ) : isLength ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={fieldId} className="text-sm">
                  {metric.name}
                </label>
                <button
                  type="button"
                  onClick={length.toggle}
                  className="cursor-pointer text-caption text-fg-muted underline-offset-2 transition-colors hover:text-fg hover:underline"
                >
                  {length.unit === "cm" ? "Use inches" : "Use centimetres"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id={fieldId}
                  className="h-12 w-full bg-surface"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0.1}
                  value={length.text}
                  onChange={(e) => length.setText(e.target.value)}
                  required
                />
                <span className="text-sm text-fg-muted">{length.unit}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor={fieldId} className="text-sm">
                {metric.name} ({metric.unit})
              </label>
              <Input
                id={fieldId}
                className="h-12 w-full bg-surface"
                type="number"
                inputMode="decimal"
                step="any"
                min={0.1}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                required
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
        </div>
        <Actions busy={busy} disabled={!valid} onCancel={onClose} />
      </form>
    </SheetContent>
  );
}
