"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import { Plus, Star, Trash } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useEffect, useId, useRef, useState } from "react";
import type { AnswerInput, Metric } from "@/lib/api";
import { uploadApi } from "@/lib/api";

/**
 * One component per `metric_type`. Four types, because that is what the column holds.
 *
 * Each one owns a single answer and reports it up as an `AnswerInput` with exactly one
 * value field set — the same shape the API takes and the `check_in_answer_one_value`
 * constraint enforces, so there is no translation layer to get wrong.
 */
export type StepProps = {
  metric: Metric;
  answer: AnswerInput | undefined;
  /** Null clears it. A skipped question is not the same as a zero. */
  onAnswer: (answer: AnswerInput | null) => void;
  studioId: string;
  /** False when Cloudinary is not configured — the photo step says so instead of failing. */
  uploads: boolean;
};

export function Step(props: StepProps) {
  switch (props.metric.type) {
    case "number":
      return <NumberStep {...props} />;
    case "rating":
      return <RatingStep {...props} />;
    case "text":
      return <TextStep {...props} />;
    case "image":
      return <PhotoStep {...props} />;
  }
}

function NumberStep({ metric, answer, onAnswer }: StepProps) {
  // Local string state, because "71." is a valid thing to be typing and not a valid
  // number. Committing on every keystroke would delete the decimal point as it is typed.
  const [text, setText] = useState(answer?.numberValue?.toString() ?? "");

  useEffect(() => {
    setText(answer?.numberValue?.toString() ?? "");
  }, [answer?.numberValue]);

  function commit(raw: string) {
    setText(raw);
    const n = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(n)) onAnswer(null);
    else onAnswer({ metricId: metric.id, numberValue: n });
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        // Android's numeric pad has no decimal point; `decimal` is the one with it.
        inputMode="decimal"
        value={text}
        onChange={(e) => commit(e.target.value)}
        placeholder="—"
        className="h-12 text-subheading tabular-nums"
        aria-label={metric.name}
      />
      {metric.unit ? (
        <span className="shrink-0 text-body-sm text-fg-muted">{metric.unit}</span>
      ) : null}
    </div>
  );
}

const SCALE = [1, 2, 3, 4, 5];

/**
 * Five stars, tappable.
 *
 * Coachway ships both a star and a smiley renderer over the same stored scale. Stars
 * read as a judgement of quality, which is right for energy and sleep; a smiley reads as
 * a mood. One renderer is enough until a metric arrives that needs the other.
 */
function RatingStep({ metric, answer, onAnswer }: StepProps) {
  const value = answer?.ratingValue ?? 0;
  const name = useId();

  /**
   * Real radio inputs behind the stars.
   *
   * A row of buttons with `role="radio"` looks identical and loses arrow-key movement,
   * the single-tab-stop grouping and the announcement of "3 of 5" — all of which a
   * native radio group gives for nothing. The inputs are `sr-only` rather than hidden,
   * because `display: none` takes them out of the tab order along with everything else.
   */
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">{metric.name}</legend>
      <div className="flex gap-1">
        {SCALE.map((n) => (
          <label
            key={n}
            className={cn(
              "flex size-12 cursor-pointer items-center justify-center rounded-control border transition-colors",
              "focus-within:ring-2 focus-within:ring-brand/40",
              n <= value
                ? "border-brand/30 bg-brand/10 text-brand"
                : "border-line bg-surface text-fg-subtle hover:bg-hover",
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onAnswer({ metricId: metric.id, ratingValue: n })}
              className="sr-only"
            />
            <span className="sr-only">{`${n} out of 5`}</span>
            <Star aria-hidden="true" className={cn("size-5", n <= value && "fill-current")} />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-caption text-fg-subtle">
          {value === 0 ? "Not answered" : `${value} out of 5`}
        </span>
        {/* A radio group has no way back to unanswered — this is it. */}
        {value > 0 ? (
          <button
            type="button"
            onClick={() => onAnswer(null)}
            className="cursor-pointer text-caption text-fg-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>
    </fieldset>
  );
}

function TextStep({ metric, answer, onAnswer }: StepProps) {
  return (
    <Textarea
      value={answer?.textValue ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onAnswer(v.trim() === "" ? null : { metricId: metric.id, textValue: v });
      }}
      rows={5}
      placeholder="Anything your coach should know."
      aria-label={metric.name}
      className="min-h-32"
    />
  );
}

/** Coachway retries a failed photo twice before offering to continue without it. */
const RETRIES = 2;

async function uploadWithRetry(studioId: string, file: File): Promise<string> {
  let last: unknown;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const ticket = await uploadApi.sign(studioId);
      return await uploadApi.put(ticket, file);
    } catch (e) {
      last = e;
      // A fresh ticket each time: the signature carries a timestamp, so a retry on a
      // stale one fails for a different reason than the first attempt did.
    }
  }
  throw last;
}

function PhotoStep({ metric, answer, onAnswer, studioId, uploads }: StepProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = answer?.imageUrl ?? null;

  if (!uploads) {
    return (
      <p className="rounded-surface border border-line border-dashed bg-surface p-4 text-body-sm leading-relaxed text-fg-muted">
        Photos aren't set up on this account yet, so skip this one — everything else in your
        check-in still goes through.
      </p>
    );
  }

  async function pick(file: File) {
    setBusy(true);
    setFailed(false);
    try {
      onAnswer({ metricId: metric.id, imageUrl: await uploadWithRetry(studioId, file) });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {url ? (
        <div className="relative overflow-hidden rounded-surface border border-line">
          {/* A plain img: next/image would want the Cloudinary host in its config, and
              this is one photo somebody just took, not a page asset to optimise. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={metric.name} className="aspect-[3/4] w-full object-cover" />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAnswer(null)}
            className="absolute right-2 top-2"
          >
            <Trash className="size-3.5" />
            Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="flex aspect-[3/4] max-h-80 cursor-pointer flex-col items-center justify-center gap-2 rounded-surface border border-line border-dashed bg-surface text-fg-subtle transition-colors hover:bg-hover disabled:cursor-wait"
        >
          <Plus className="size-6" />
          <span className="text-body-sm">{busy ? "Uploading…" : "Add a photo"}</span>
        </button>
      )}

      {failed ? (
        <p className="text-caption text-danger">
          That photo didn't upload. Try again, or carry on without it — the rest of your check-in is
          saved.
        </p>
      ) : null}

      <input
        ref={input}
        type="file"
        accept="image/*"
        // Opens the camera directly on a phone, which is where a progress photo is taken.
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void pick(file);
          // Cleared so picking the same file twice still fires a change event.
          e.target.value = "";
        }}
      />
    </div>
  );
}
