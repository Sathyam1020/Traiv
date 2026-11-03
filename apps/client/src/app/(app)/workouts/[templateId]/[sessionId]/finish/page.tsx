"use client";

import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { toast } from "@traiv/ui/components/sonner";
import { Textarea } from "@traiv/ui/components/textarea";
import { Activity, CircleCheck } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { QueryError } from "@/components/common/query-state";
import { useActiveStudio, useFinishSession, useWorkoutSession } from "@/lib/query";
import { IntensityRating, QualityRating } from "../../../_components/rating";

/**
 * "Workout completed / You've done it!" — the numbers are computed here from what's
 * already logged (the same simple sums `finishSession` itself computes and freezes),
 * so the screen can show them before the one real write this page makes.
 */
export default function FinishPage() {
  const { templateId, sessionId } = useParams<{ templateId: string; sessionId: string }>();
  const router = useRouter();
  const { studioId } = useActiveStudio();
  const session = useWorkoutSession(studioId, templateId, sessionId);
  const finish = useFinishSession(studioId ?? "");

  const [quality, setQuality] = useState<number | null>(null);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [note, setNote] = useState("");

  if (session.isPending) return <Loading />;

  if (session.isError)
    return (
      <div className="p-4">
        <QueryError
          title="Couldn't load your workout summary."
          busy={session.isFetching}
          onRetry={() => void session.refetch()}
        />
      </div>
    );

  const live = session.data?.live;
  if (!live) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <p className="text-body text-fg-muted">There&apos;s no workout in progress to finish.</p>
        <Button asChild variant="secondary" size="sm">
          <Link href="/workouts">All workouts</Link>
        </Button>
      </div>
    );
  }

  const completed = live.sets.filter((s) => s.completed);
  const totalReps = sum(completed.map((s) => s.reps));
  const totalWeightKg = sum(completed.map((s) => (s.reps && s.loadKg ? s.reps * s.loadKg : null)));
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(live.startedAt).getTime()) / 1000),
  );
  const exerciseCount = session.data?.exercises.length ?? 0;

  async function complete() {
    if (!live) return;
    try {
      await finish.mutateAsync({
        trainingSessionId: live.id,
        quality,
        intensity,
        note: note.trim() || null,
        totalSeconds: elapsedSeconds,
      });
      toast("Workout complete", { description: "Your session has been saved." });
      router.push("/workouts");
    } catch {
      /* Keep summary and entered ratings visible for retry. */
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 pt-10 pb-8 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CircleCheck aria-hidden="true" className="size-16 text-success" strokeWidth={1.5} />
        <h1 className="text-heading font-medium">Workout summary</h1>
        <p className="text-body-sm text-fg-muted">Your session is ready to save.</p>
      </div>

      <div className="overflow-hidden rounded-surface border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex flex-col">
            <span className="font-medium">{session.data?.session.name}</span>
            <span className="text-caption text-fg-muted">
              {(totalWeightKg ?? 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
              total volume
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-sunken px-2.5 py-1 text-caption text-fg-muted">
            <Activity className="size-3.5" />
            {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="grid grid-cols-3 border-line border-t bg-sunken/50">
          <Stat label="Time" value={formatDuration(elapsedSeconds)} />
          <Stat label="Sets" value={String(completed.length)} />
          <Stat label="Reps" value={String(totalReps ?? 0)} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-body-sm">How was the workout?</h2>
        <QualityRating value={quality} onChange={setQuality} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-body-sm">How was the intensity?</h2>
        <IntensityRating value={intensity} onChange={setIntensity} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="workout-note" className="font-medium text-body-sm">
          Leave a note
        </label>
        <Textarea
          id="workout-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How did the workout feel?"
          rows={4}
        />
      </div>

      {/* Not `fixed` — see the preview screen's own note on why: the floating mobile
          nav pill is fixed at a higher z-index and would eat this button's taps. */}
      {finish.isError ? (
        <p role="alert" className="text-body-sm text-danger">
          Couldn't save your workout. Your ratings and note are still here. Try again.
        </p>
      ) : null}
      <Button
        aria-busy={finish.isPending}
        size="lg"
        className="w-full"
        onClick={() => void complete()}
        disabled={finish.isPending}
      >
        {finish.isPending ? "Saving workout…" : "Save workout"}
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-3">
      <span className="font-semibold text-heading tabular-nums">{value}</span>
      <span className="text-caption text-fg-muted">{label}</span>
    </div>
  );
}

function sum(values: (number | null)[]): number | null {
  const real = values.filter((v): v is number => v !== null);
  return real.length ? real.reduce((a, b) => a + b, 0) : null;
}

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 pt-10 sm:px-6">
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-28 w-full max-w-md rounded-surface" />
      <Skeleton className="h-24 w-full max-w-md rounded-surface" />
    </div>
  );
}
