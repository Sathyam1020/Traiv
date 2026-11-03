"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Dumbbell,
  Pause,
  Play,
  Plus,
  Repeat,
} from "@traiv/ui/icons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { QueryError } from "@/components/common/query-state";
import type { SessionDetail, SessionExerciseDetail } from "@/lib/api";
import {
  useActiveStudio,
  useCancelSession,
  useDeleteSet,
  useLogSet,
  useWorkoutSession,
} from "@/lib/query";
import { queryKeys } from "@/lib/query/keys";
import { createSaveQueue } from "@/lib/workouts/save-queue";
import { ActiveSetRow, type ActiveSetValue } from "../../../_components/active-set-row";
import { IncompleteWorkoutDialog } from "../../../_components/incomplete-workout-dialog";
import { LeaveWorkoutSheet } from "../../../_components/leave-workout-sheet";
import { RestTimerCard, type RestTimerState } from "../../../_components/rest-timer-card";
import { SegmentedProgress } from "../../../_components/segmented-progress";
import { SwipeToDelete } from "../../../_components/swipe-to-delete";

type LocalSet = ActiveSetValue & {
  setNumber: number;
  persisted: boolean;
};

type LocalSets = Record<string, LocalSet[]>;

type ActiveRestTimer = RestTimerState & {
  sessionExerciseId: string;
};

const DEFAULT_REST_SECONDS = 60;

function buildInitialSets(data: SessionDetail): LocalSets {
  const out: LocalSets = {};

  for (const exercise of data.exercises) {
    const live = data.live?.sets.filter((set) => set.sessionExerciseId === exercise.id) ?? [];

    const maxLogged = live.reduce((max, set) => Math.max(max, set.setNumber), 0);

    const count = Math.max(exercise.sets.length, maxLogged);

    out[exercise.id] = Array.from({ length: count }, (_, i) => {
      const setNumber = i + 1;
      const logged = live.find((set) => set.setNumber === setNumber);

      return {
        setNumber,
        reps: logged?.reps ?? null,
        loadKg: logged?.loadKg ?? null,
        completed: logged?.completed ?? false,
        persisted: Boolean(logged),
      };
    });
  }

  return out;
}

function restSecondsFor(exercise: SessionExerciseDetail, index: number) {
  const prescribed = exercise.sets[Math.min(index, exercise.sets.length - 1)];

  return prescribed?.restSeconds ?? DEFAULT_REST_SECONDS;
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-4 sm:px-6">
      <Skeleton className="h-28 w-full rounded-surface" />
      <Skeleton className="h-40 w-full rounded-surface" />
      <Skeleton className="h-40 w-full rounded-surface" />
    </div>
  );
}

export default function ActiveSessionPage() {
  const { templateId, sessionId } = useParams<{
    templateId: string;
    sessionId: string;
  }>();

  const router = useRouter();
  const qc = useQueryClient();
  const reduceMotion = useReducedMotion();
  const [saveQueue] = useState(createSaveQueue);
  const pendingCount = useRef(0);
  const [saving, setSaving] = useState(0);
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const { studioId } = useActiveStudio();
  const session = useWorkoutSession(studioId, templateId, sessionId);

  const [sets, setSets] = useState<LocalSets | null>(null);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const [restTimer, setRestTimer] = useState<ActiveRestTimer | null>(null);

  const [restTimerPaused, setRestTimerPaused] = useState(false);
  const [restTimerEditing, setRestTimerEditing] = useState(false);
  const [headerRunning, setHeaderRunning] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [incompleteOpen, setIncompleteOpen] = useState(false);

  const trainingSessionId = session.data?.live?.id ?? null;

  const logSet = useLogSet(studioId ?? "", trainingSessionId ?? "");
  const deleteSet = useDeleteSet(studioId ?? "", trainingSessionId ?? "");
  const cancelSession = useCancelSession(studioId ?? "");

  useEffect(() => {
    if (sets === null && session.data) {
      setSets(buildInitialSets(session.data));
    }
  }, [session.data, sets]);

  // Workout elapsed timer.
  useEffect(() => {
    if (!headerRunning) return;

    const id = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(id);
  }, [headerRunning]);

  // Rest countdown. No countdown updates are scheduled while paused.
  useEffect(() => {
    if (!restTimer || restTimerPaused || restTimerEditing) return;

    if (restTimer.remainingSeconds <= 0) return;

    const id = setTimeout(() => {
      setRestTimer((current) =>
        current
          ? {
              ...current,
              remainingSeconds: Math.max(0, current.remainingSeconds - 1),
            }
          : null,
      );
    }, 1000);

    return () => clearTimeout(id);
  }, [restTimer, restTimerPaused, restTimerEditing]);

  const live = session.data?.live ?? null;

  const elapsedSeconds = live
    ? Math.max(0, Math.floor((now - new Date(live.startedAt).getTime()) / 1000))
    : 0;

  const allComplete = useMemo(() => {
    if (!sets) return false;

    return Object.values(sets).every(
      (rows) => rows.length > 0 && rows.every((row) => row.completed),
    );
  }, [sets]);

  if (session.isError && !session.data) {
    return (
      <div className="p-4">
        <QueryError
          title="Couldn't load your workout."
          busy={session.isFetching}
          onRetry={() => void session.refetch()}
        />
      </div>
    );
  }

  if (session.isPending || (session.data?.live && sets === null)) {
    return <Loading />;
  }

  if (session.error || !session.data || !live) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <p className="text-body text-fg-muted">
          We couldn&apos;t find a workout in progress. Start one from the preview first.
        </p>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/workouts/${templateId}/${sessionId}`}>Back to the workout</Link>
        </Button>
      </div>
    );
  }

  const exercises = session.data.exercises;

  function setFor(sessionExerciseId: string) {
    return sets?.[sessionExerciseId] ?? [];
  }

  function patchSet(sessionExerciseId: string, index: number, patch: Partial<LocalSet>) {
    setSets((previous) => {
      if (!previous) return previous;

      const rows = [...(previous[sessionExerciseId] ?? [])];
      const row = rows[index];

      if (!row) return previous;

      rows[index] = { ...row, ...patch };

      return {
        ...previous,
        [sessionExerciseId]: rows,
      };
    });
  }

  // Serialize writes so a blur save cannot overtake the completion tap that follows.
  // Per-row revisions prevent stale responses from clearing newer errors or edits.
  async function persistRow(
    sessionExerciseId: string,
    index: number,
    row: LocalSet,
    rollbackCompleted?: boolean,
  ) {
    if (!trainingSessionId) return;
    const key = `${sessionExerciseId}:${row.setNumber}`;
    pendingCount.current += 1;
    setSaving(pendingCount.current);
    let succeeded = false;
    const task = saveQueue.run(key, async (isLatest) => {
      try {
        const saved = await logSet.mutateAsync({
          sessionExerciseId,
          setNumber: row.setNumber,
          reps: row.reps,
          loadKg: row.loadKg,
          completed: row.completed,
        });
        qc.setQueryData<SessionDetail>(
          queryKeys.client.workoutSession(studioId ?? "", templateId, sessionId),
          (previous) =>
            previous?.live ? { ...previous, live: { ...previous.live, sets: saved } } : previous,
        );
        succeeded = true;
        if (isLatest()) {
          patchSet(sessionExerciseId, index, { persisted: true });
          setSaveErrors((previous) => {
            const next = { ...previous };
            delete next[key];
            return next;
          });
        }
      } catch {
        if (isLatest()) {
          if (rollbackCompleted !== undefined) {
            patchSet(sessionExerciseId, index, { completed: rollbackCompleted });
            if (!rollbackCompleted)
              setRestTimer((current) =>
                current?.sessionExerciseId === sessionExerciseId ? null : current,
              );
          }
          setSaveErrors((previous) => ({
            ...previous,
            [key]: "This set couldn't be saved. Your entered values are still here.",
          }));
        }
      } finally {
        pendingCount.current -= 1;
        setSaving(pendingCount.current);
      }
    });
    await task;
    return succeeded;
  }

  function toggleComplete(exercise: SessionExerciseDetail, index: number) {
    if (deleteSet.isPending || cancelSession.isPending) return;
    const row = sets?.[exercise.id]?.[index];

    if (!row) return;

    const next: LocalSet = {
      ...row,
      completed: !row.completed,
    };

    patchSet(exercise.id, index, {
      completed: next.completed,
    });

    void persistRow(exercise.id, index, next, row.completed);

    if (next.completed) {
      const totalSeconds = restSecondsFor(exercise, index);

      setRestTimerPaused(false);

      setRestTimer({
        sessionExerciseId: exercise.id,
        exerciseName: exercise.name,
        totalSeconds,
        remainingSeconds: totalSeconds,
      });
    } else if (restTimer?.sessionExerciseId === exercise.id) {
      setRestTimer(null);
      setRestTimerPaused(false);
    }
  }

  function commitRow(sessionExerciseId: string, index: number) {
    const row = sets?.[sessionExerciseId]?.[index];

    if (row) {
      void persistRow(sessionExerciseId, index, row);
    }
  }

  function addSet(exercise: SessionExerciseDetail) {
    setSets((previous) => {
      if (!previous) return previous;

      const rows = previous[exercise.id] ?? [];
      const last = rows.at(-1);

      const next: LocalSet = {
        setNumber: Math.max(0, ...rows.map((row) => row.setNumber)) + 1,
        reps: last?.reps ?? null,
        loadKg: last?.loadKg ?? null,
        completed: false,
        persisted: false,
      };

      return {
        ...previous,
        [exercise.id]: [...rows, next],
      };
    });
  }

  async function removeSet(sessionExerciseId: string, index: number) {
    const row = sets?.[sessionExerciseId]?.[index];

    if (!row || pendingCount.current > 0) return;

    if (row.persisted && trainingSessionId) {
      try {
        const saved = await deleteSet.mutateAsync({ sessionExerciseId, setNumber: row.setNumber });
        qc.setQueryData<SessionDetail>(
          queryKeys.client.workoutSession(studioId ?? "", templateId, sessionId),
          (previous) =>
            previous?.live ? { ...previous, live: { ...previous.live, sets: saved } } : previous,
        );
        setActionError(null);
      } catch {
        setActionError("Couldn't delete this set. Try again.");
        return;
      }
    }

    setSaveErrors((previous) => {
      const next = { ...previous };
      delete next[`${sessionExerciseId}:${row.setNumber}`];
      return next;
    });
    setSets((previous) => {
      if (!previous) return previous;

      const rows = (previous[sessionExerciseId] ?? []).filter((_, i) => i !== index);

      return {
        ...previous,
        [sessionExerciseId]: rows,
      };
    });
  }

  function handleHeaderFinish() {
    if (pendingCount.current > 0 || Object.keys(saveErrors).length > 0) return;
    if (allComplete) {
      router.push(`/workouts/${templateId}/${sessionId}/finish`);
    } else {
      setIncompleteOpen(true);
    }
  }

  async function cancelWorkout() {
    try {
      await cancelSession.mutateAsync(trainingSessionId as string);
      router.push("/workouts");
    } catch {
      setActionError("Couldn't cancel your workout. Try again.");
      setLeaveOpen(false);
    }
  }

  function handleSkipRestTimer() {
    setRestTimer(null);
    setRestTimerPaused(false);
  }

  function handleChangeRestDuration(totalSeconds: number) {
    setRestTimer((current) =>
      current
        ? {
            ...current,
            totalSeconds,
            remainingSeconds: totalSeconds,
          }
        : null,
    );

    setRestTimerPaused(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Workout header */}
      <div className="client-workout-header sticky top-0 z-10 flex flex-col gap-3 bg-brand px-4 pt-4 pb-4 text-brand-fg sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => setLeaveOpen(true)}
            aria-label="Leave workout"
            className="flex size-9 shrink-0 items-center justify-center rounded-control bg-brand-fg/15 text-brand-fg transition-colors hover:bg-brand-fg/25"
          >
            <ArrowLeft className="size-4" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-heading font-medium">{session.data.session.name}</h1>

            <p className="text-caption text-brand-fg/80">
              {exercises.length} exercise
              {exercises.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHeaderRunning((running) => !running)}
              aria-label={headerRunning ? "Pause timer" : "Resume timer"}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-fg/15 text-brand-fg transition-colors hover:bg-brand-fg/25"
            >
              {headerRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>

            <span className="font-semibold text-heading tabular-nums">
              {formatClock(elapsedSeconds)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleHeaderFinish}
            disabled={saving > 0 || deleteSet.isPending || Object.keys(saveErrors).length > 0}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-fg/15 px-3.5 py-2 text-body-sm font-medium transition-colors hover:bg-brand-fg/25"
          >
            Finish
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <SegmentedProgress
          fractions={exercises.map((exercise) => {
            const rows = setFor(exercise.id);

            return rows.length ? rows.filter((row) => row.completed).length / rows.length : 0;
          })}
        />
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {saving > 0
          ? "Saving your sets"
          : Object.keys(saveErrors).length
            ? "A set needs saving. Review the message below it."
            : "All changes saved"}
      </div>
      {actionError ? (
        <p role="alert" className="mx-4 mt-3 text-body-sm text-danger">
          {actionError}
        </p>
      ) : null}
      {/* Exercise list */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 bg-panel px-4 pt-4 pb-32 sm:px-6">
        {exercises.map((exercise) => {
          const rows = setFor(exercise.id);
          const firstSet = exercise.sets[0];

          const repLabel =
            firstSet?.repsMax != null
              ? `${firstSet.reps ?? ""}-${firstSet.repsMax} reps`
              : firstSet?.reps != null
                ? `${firstSet.reps} reps`
                : "Reps";

          const restSeconds = firstSet?.restSeconds;

          return (
            <div
              key={exercise.id}
              className="scroll-mt-44 rounded-surface border border-line bg-surface"
            >
              {/* Exercise title and metadata */}
              <Link
                href={`/workouts/${templateId}/${sessionId}/exercises/${exercise.exerciseId}`}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-hover"
              >
                {exercise.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exercise.imageUrl}
                    alt=""
                    className="size-11 shrink-0 rounded-control object-cover"
                  />
                ) : (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-sunken">
                    <Dumbbell className="size-4 text-fg-subtle" />
                  </span>
                )}

                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-medium text-body-sm">{exercise.name}</span>

                  {/* Metadata icons */}
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-fg-muted">
                    <span className="inline-flex items-center gap-1">
                      <Activity aria-hidden="true" className="size-4 shrink-0" />
                      {rows.length} sets
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Repeat aria-hidden="true" className="size-4 shrink-0" />
                      {repLabel}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden="true" className="size-4 shrink-0" />
                      {restSeconds} s
                    </span>
                  </span>
                </span>

                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
              </Link>

              {/* Set rows */}
              <div className="flex flex-col gap-1.5 border-line border-t px-2 py-2">
                {rows.map((row, index) => {
                  const key = `${exercise.id}:${row.setNumber}`;

                  const prescribed = exercise.sets[Math.min(index, exercise.sets.length - 1)];

                  return (
                    <SwipeToDelete
                      key={key}
                      open={openRow === key}
                      onOpenChange={(open) => setOpenRow(open ? key : null)}
                      disabled={rows.length <= 1 || saving > 0 || deleteSet.isPending}
                      onDelete={() => void removeSet(exercise.id, index)}
                    >
                      <div>
                        <ActiveSetRow
                          index={index}
                          fields={exercise.fields}
                          value={row}
                          placeholder={{
                            reps: prescribed?.reps ?? null,
                            repsMax: prescribed?.repsMax ?? null,
                            weightKg: prescribed?.weightKg ?? null,
                          }}
                          onChange={(patch) => patchSet(exercise.id, index, patch)}
                          onBlur={() => commitRow(exercise.id, index)}
                          onToggleComplete={() => toggleComplete(exercise, index)}
                        />
                        {saveErrors[key] ? (
                          <div
                            role="alert"
                            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-caption text-danger"
                          >
                            <span>{saveErrors[key]}</span>
                            <button
                              type="button"
                              disabled={saving > 0}
                              onClick={() => commitRow(exercise.id, index)}
                              className="min-h-11 font-medium underline underline-offset-4"
                            >
                              Retry save
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </SwipeToDelete>
                  );
                })}

                <button
                  type="button"
                  onClick={() => addSet(exercise)}
                  disabled={deleteSet.isPending || cancelSession.isPending}
                  className="flex w-fit cursor-pointer items-center gap-1 rounded-control px-2 py-1.5 text-caption text-fg-muted transition-colors hover:bg-hover"
                >
                  <Plus className="size-3.5" />
                  Add set
                </button>
              </div>
            </div>
          );
        })}

        {allComplete ? (
          <Button
            size="lg"
            className="w-full"
            disabled={saving > 0 || deleteSet.isPending || Object.keys(saveErrors).length > 0}
            onClick={handleHeaderFinish}
          >
            {saving > 0 ? "Saving sets…" : "Finish workout"}
          </Button>
        ) : null}
      </div>

      {/* Sticky rest timer */}
      <AnimatePresence initial={false}>
        {restTimer ? (
          <motion.div
            key="rest-timer"
            className="sticky bottom-0 z-20"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
          >
            <RestTimerCard
              timer={restTimer}
              paused={restTimerPaused}
              onPausedChange={setRestTimerPaused}
              onSkip={handleSkipRestTimer}
              onEditingChange={setRestTimerEditing}
              onChangeDuration={handleChangeRestDuration}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <LeaveWorkoutSheet
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        onPause={() => router.push(`/workouts/${templateId}/${sessionId}`)}
        onCancelWorkout={() => void cancelWorkout()}
        cancelling={cancelSession.isPending}
        saving={saving > 0}
      />

      <IncompleteWorkoutDialog
        open={incompleteOpen}
        onOpenChange={setIncompleteOpen}
        onConfirm={() => router.push(`/workouts/${templateId}/${sessionId}/finish`)}
      />
    </div>
  );
}
