"use client";
import { Check, Image, Plus, Star, X } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useId, useRef, useState } from "react";
import type { AnswerInput, Metric } from "@/lib/api";
import { uploadApi } from "@/lib/api";
import { inchesToCm, type LengthUnit, useCmInches } from "@/lib/length-units";
import { TRAINING_CHOICES, type WeeklyStep } from "./weekly-steps";

type Props = {
  step: WeeklyStep;
  metrics: Metric[];
  answers: Record<string, AnswerInput>;
  onAnswer: (value: AnswerInput) => void;
  onClear: (id: string) => void;
  studioId: string;
  uploads: boolean;
  onBusy: (busy: boolean) => void;
};
export function WeeklyFields(p: Props) {
  const metrics = p.step.codes.map((code) => p.metrics.find((m) => m.code === code && m.shared));
  if (metrics.some((m) => !m))
    return (
      <p role="alert" className="rounded-2xl border border-line bg-surface p-4 text-sm text-danger">
        This check-in is missing a required question. Please refresh, or ask your coach to update
        the check-in setup.
      </p>
    );
  const items = metrics as Metric[];
  if (p.step.kind === "measurements")
    return (
      <MeasurementStep
        items={items}
        answers={p.answers}
        onAnswer={p.onAnswer}
        onClear={p.onClear}
      />
    );
  if (p.step.kind === "photos")
    return (
      <>
        <div className="grid grid-cols-3 gap-2.5 pt-5">
          {items.map((m) => (
            <Photo key={m.id} {...p} metric={m} />
          ))}
        </div>
        {!p.uploads ? (
          <p role="status" className="mt-4 text-sm text-fg-muted">
            Photo uploads are unavailable. Your progress is saved; please try again later.
          </p>
        ) : null}
      </>
    );
  const m = items[0];
  if (!m) return null;
  const value = p.answers[m.id];
  if (p.step.kind === "text")
    return (
      <div>
        <textarea
          aria-label={p.step.title}
          value={value?.textValue ?? ""}
          maxLength={2048}
          onChange={(e) => p.onAnswer({ metricId: m.id, textValue: e.target.value })}
          placeholder="Enter your response here…"
          className="block h-[150px] w-full resize-none rounded-[20px] border border-line bg-surface p-4 text-base leading-relaxed outline-none focus:border-signal focus:ring-2 focus:ring-signal/10"
        />
        <p className="mt-2 text-right text-xs text-fg-subtle">
          {2048 - (value?.textValue?.length ?? 0)} characters remaining
        </p>
      </div>
    );
  if (p.step.kind === "choice")
    return (
      <fieldset className="space-y-2.5">
        <legend className="sr-only">{p.step.title}</legend>
        {TRAINING_CHOICES.map((option) => (
          <label
            key={option}
            className={cn(
              "flex min-h-12 cursor-pointer items-center justify-between rounded-2xl border bg-surface px-4 py-3 text-base font-semibold focus-within:ring-2 focus-within:ring-signal/30",
              value?.textValue === option ? "border-signal bg-selected" : "border-line",
            )}
          >
            <input
              type="radio"
              name={m.id}
              className="sr-only"
              checked={value?.textValue === option}
              onChange={() => p.onAnswer({ metricId: m.id, textValue: option })}
            />
            {option}
            {value?.textValue === option ? <Check className="size-5 text-signal-text" /> : null}
          </label>
        ))}
      </fieldset>
    );
  return <Rating metric={m} answer={value} mood={p.step.kind === "mood"} onAnswer={p.onAnswer} />;
}
/**
 * The "Body Measurement" (weight, kg) and "Circumference Measurement" (arm/chest/
 * forearm/hips/thigh/waist, cm) steps both render through here, but never mixed — each
 * is its own step with fields in one unit. One toggle covers every field in the step at
 * once, same reasoning as onboarding's circumference step: nobody wants a different
 * unit per body part.
 */
function MeasurementStep({
  items,
  answers,
  onAnswer,
  onClear,
}: {
  items: Metric[];
  answers: Props["answers"];
  onAnswer: Props["onAnswer"];
  onClear: Props["onClear"];
}) {
  const [unit, setUnit] = useState<LengthUnit>("cm");
  const isLengthStep = items.length > 0 && items.every((m) => m.unit === "cm");
  return (
    <div className="flex flex-col gap-2">
      {isLengthStep ? (
        <button
          type="button"
          onClick={() => setUnit((u) => (u === "cm" ? "in" : "cm"))}
          className="ml-auto cursor-pointer text-sm text-fg-muted underline-offset-2 transition-colors hover:text-fg hover:underline"
        >
          {unit === "cm" ? "Use inches" : "Use centimetres"}
        </button>
      ) : null}
      <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
        {items.map((m) => (
          <Measurement
            key={m.id}
            metric={m}
            answer={answers[m.id]}
            onAnswer={onAnswer}
            onClear={onClear}
            unit={isLengthStep ? unit : "cm"}
          />
        ))}
      </div>
    </div>
  );
}
function Measurement({
  metric: m,
  answer,
  onAnswer,
  onClear,
  unit,
}: {
  metric: Metric;
  answer?: AnswerInput;
  onAnswer: Props["onAnswer"];
  onClear: Props["onClear"];
  unit: LengthUnit;
}) {
  const isLength = m.unit === "cm";
  const length = useCmInches(answer?.numberValue ?? null, isLength ? unit : undefined);
  const [raw, setRaw] = useState(answer?.numberValue?.toString() ?? "");

  const value = isLength ? length.text : raw;
  const displayUnit = isLength ? length.unit : m.unit;

  function handleChange(next: string) {
    if (!/^\d{0,3}(\.\d{0,2})?$/.test(next)) return;
    if (isLength) {
      length.setText(next);
      if (!next || next === ".") onClear(m.id);
      else
        onAnswer({
          metricId: m.id,
          numberValue: unit === "cm" ? Number(next) : inchesToCm(Number(next)),
        });
    } else {
      setRaw(next);
      if (!next || next === ".") onClear(m.id);
      else onAnswer({ metricId: m.id, numberValue: Number(next) });
    }
  }

  return (
    <label className="flex min-h-[60px] items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium">{m.code === "hips" ? "Hip" : m.name}</span>
        <span className="block text-xs text-fg-subtle">Required</span>
      </span>
      <input
        aria-label={m.name}
        inputMode="decimal"
        type="text"
        autoComplete="off"
        value={value}
        placeholder="0"
        className="w-20 min-w-0 border-0 bg-transparent text-right text-xl font-semibold tabular-nums outline-none placeholder:text-fg-subtle/40"
        onChange={(e) => handleChange(e.target.value)}
      />
      <span className="w-6 text-sm text-fg-subtle">{displayUnit}</span>
    </label>
  );
}
function Rating({
  metric,
  answer,
  mood,
  onAnswer,
}: {
  metric: Metric;
  answer?: AnswerInput;
  mood: boolean;
  onAnswer: Props["onAnswer"];
}) {
  const group = useId();
  const value = answer?.ratingValue ?? 0;
  return (
    <fieldset className="flex min-h-[110px] items-center justify-between gap-1 rounded-[24px] border border-line bg-surface px-4 py-6">
      <legend className="sr-only">{metric.name}</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <label
          key={n}
          className={cn(
            "flex size-11 cursor-pointer items-center justify-center rounded-full transition-transform duration-150 active:scale-90 focus-within:ring-2 focus-within:ring-signal/30 motion-reduce:transition-none",
            mood && value === n && "bg-selected ring-1 ring-signal",
          )}
        >
          <input
            type="radio"
            className="sr-only"
            name={group}
            value={n}
            checked={value === n}
            onChange={() => onAnswer({ metricId: metric.id, ratingValue: n })}
          />
          <span className="sr-only">
            {mood ? ["Very low", "Low", "Neutral", "Good", "Great"][n - 1] : `${n} out of 5`}
          </span>
          {mood ? (
            <MoodFace level={n} selected={value === n} />
          ) : (
            <Star
              className={cn(
                "size-9",
                n <= value ? "fill-amber-400 text-amber-400" : "text-fg-subtle/50",
              )}
              aria-hidden="true"
            />
          )}
        </label>
      ))}
    </fieldset>
  );
}
function MoodFace({ level, selected }: { level: number; selected: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn("size-9", selected ? "text-signal-text" : "text-fg-subtle/50")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="20" cy="20" r="14" fill={selected ? "currentColor" : "none"} />
      <g stroke={selected ? "white" : "currentColor"}>
        <path d="M15 15v2m10-2v2" strokeLinecap="round" />
        {level <= 2 ? (
          <path d="M14 27q6-9 12 0" />
        ) : level === 3 ? (
          <path d="M14 25h12" />
        ) : (
          <path d="M14 23q6 10 12 0" />
        )}
      </g>
    </svg>
  );
}
function Photo(p: Props & { metric: Metric }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const url = p.answers[p.metric.id]?.imageUrl;
  async function pick(file: File) {
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setError("Choose an image up to 10 MB.");
      return;
    }
    setBusy(true);
    p.onBusy(true);
    setError("");
    try {
      const ticket = await uploadApi.sign(p.studioId);
      const imageUrl = await uploadApi.put(ticket, file);
      p.onAnswer({ metricId: p.metric.id, imageUrl });
    } catch {
      setError("Upload failed. Tap to retry.");
    } finally {
      setBusy(false);
      p.onBusy(false);
    }
  }
  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-surface">
        <button
          type="button"
          aria-label={`Add ${p.metric.name}`}
          disabled={busy || !p.uploads}
          onClick={() => input.current?.click()}
          className="flex size-full flex-col items-center justify-center gap-1 text-fg-subtle disabled:cursor-wait"
        >
          {url ? (
            <img
              alt={p.metric.name}
              src={url}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <>
              <span className="flex size-8 items-center justify-center rounded-full bg-panel">
                <Plus className="size-5" />
              </span>
              <span className="text-xs">{busy ? "Uploading…" : "Add"}</span>
            </>
          )}
          {url ? (
            <span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white">
              <Image className="size-3.5" />
            </span>
          ) : null}
        </button>
        {url && !busy ? (
          <button
            type="button"
            aria-label={`Remove ${p.metric.name}`}
            onClick={() => p.onClear(p.metric.id)}
            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-center text-xs capitalize text-fg-subtle">{p.metric.name}</p>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : null}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) void pick(selected);
          e.target.value = "";
        }}
      />
    </div>
  );
}
