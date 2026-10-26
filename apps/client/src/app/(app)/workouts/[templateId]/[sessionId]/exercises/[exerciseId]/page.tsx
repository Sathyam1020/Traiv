"use client";

import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  Clock,
  Dumbbell,
  NotebookPen,
  Repeat,
  TrendingUp,
  Weight,
} from "@traiv/ui/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useActiveStudio, useExercise, useWorkoutSession } from "@/lib/query";
import { formatSetSummary } from "../../../../_components/set-summary";
import { Sparkline } from "../../../../_components/sparkline";

type TabName = "details" | "notes" | "history" | "charts";

const tabs: { value: TabName; label: string }[] = [
  { value: "details", label: "Details" },
  { value: "notes", label: "Notes" },
  { value: "history", label: "History" },
  { value: "charts", label: "Charts" },
];

export default function ExerciseDetailPage() {
  const { templateId, sessionId, exerciseId } = useParams<{
    templateId: string;
    sessionId: string;
    exerciseId: string;
  }>();

  const { studioId } = useActiveStudio();
  const session = useWorkoutSession(studioId, templateId, sessionId);
  const detail = useExercise(studioId, exerciseId);

  const [activeTab, setActiveTab] = useState<TabName>("details");

  if (session.isPending || detail.isPending) {
    return <Loading />;
  }

  const sessionExercise = session.data?.exercises.find((e) => e.exerciseId === exerciseId);

  if (!sessionExercise || detail.error || !detail.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <p className="text-body text-fg-muted">We couldn&apos;t find that exercise.</p>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/workouts/${templateId}/${sessionId}`}>Back to the workout</Link>
        </Button>
      </div>
    );
  }

  const { exercise, history, stats } = detail.data;
  const notes = history.filter((h) => h.note);

  const summary = formatSetSummary(sessionExercise.fields, sessionExercise.sets);

  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {/* Responsive exercise header */}
      <header className="w-full bg-brand px-4 pt-4 pb-7 text-brand-fg sm:px-6 sm:pt-6 sm:pb-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
          <Link
            href={`/workouts/${templateId}/${sessionId}`}
            aria-label="Back to the workout"
            className="flex size-9 items-center justify-center rounded-control bg-brand-fg/15 text-brand-fg transition-colors hover:bg-brand-fg/25"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="flex flex-col gap-3 pt-1">
            <h1 className="break-words text-2xl font-medium leading-tight sm:text-3xl lg:text-4xl">
              {sessionExercise.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {summary.map((item) => {
                const lower = item.toLowerCase();

                const Icon = /rest|sec|min/.test(lower)
                  ? Clock
                  : /rep/.test(lower)
                    ? Repeat
                    : /kg|weight|lb/.test(lower)
                      ? Weight
                      : Dumbbell;

                return (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-fg/15 px-2.5 py-1.5 text-caption font-medium"
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Responsive content panel */}
      <main className="relative z-10 -mt-3 flex min-h-0 w-full flex-1 flex-col rounded-t-panel bg-panel px-4 pt-4 pb-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          {/* Custom animated segmented tabs */}
          <div
            role="tablist"
            aria-label="Exercise information"
            className="relative grid h-12 w-full grid-cols-4 rounded-full border border-line bg-sunken p-1"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 top-1 rounded-full border border-line bg-panel shadow-sm transition-transform duration-300 ease-in-out motion-reduce:transition-none"
              style={{
                left: "4px",
                width: "calc((100% - 8px) / 4)",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />

            {tabs.map((tab) => {
              const selected = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  id={`exercise-tab-${tab.value}`}
                  aria-selected={selected}
                  aria-controls={`exercise-panel-${tab.value}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative z-10 flex min-w-0 items-center justify-center rounded-full px-1 text-caption font-medium transition-colors duration-200 motion-reduce:transition-none ${
                    selected ? "text-fg" : "text-fg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Details */}
          <section
            id="exercise-panel-details"
            role="tabpanel"
            aria-labelledby="exercise-tab-details"
            hidden={activeTab !== "details"}
            className="mt-4"
          >
            <div className="mx-auto w-full max-w-3xl rounded-surface border border-line bg-surface p-3 sm:p-4">
              <div className="mb-3 flex items-center gap-2">
                <Dumbbell className="size-4 text-fg-muted" />

                <h2 className="text-body-sm font-semibold">Exercise image</h2>
              </div>

              <div className="overflow-hidden rounded-control bg-sunken">
                {exercise.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exercise.imageUrl}
                    alt={sessionExercise.name}
                    className="aspect-video max-h-[220px] w-full object-cover sm:max-h-[300px] lg:max-h-[360px]"
                  />
                ) : (
                  <div className="flex aspect-video max-h-[360px] w-full items-center justify-center">
                    <Dumbbell className="size-8 text-fg-subtle" />
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-sunken px-2.5 py-1 text-caption text-fg-muted">
                  {exercise.muscle}
                </span>

                <span className="rounded-full bg-sunken px-2.5 py-1 text-caption text-fg-muted">
                  {exercise.equipment}
                </span>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section
            id="exercise-panel-notes"
            role="tabpanel"
            aria-labelledby="exercise-tab-notes"
            hidden={activeTab !== "notes"}
            className="mt-4"
          >
            {notes.length === 0 ? (
              <EmptyTab
                icon={<NotebookPen className="size-6 text-fg-subtle" />}
                message="No notes recorded. Add notes during your workouts to track how you feel."
              />
            ) : (
              <div className="flex flex-col gap-2">
                {notes.map((h) => (
                  <article
                    key={h.date}
                    className="rounded-surface border border-line bg-surface p-3"
                  >
                    <p className="text-caption text-fg-subtle">{longDate(h.date)}</p>

                    <p className="mt-1 text-body-sm">{h.note}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* History */}
          <section
            id="exercise-panel-history"
            role="tabpanel"
            aria-labelledby="exercise-tab-history"
            hidden={activeTab !== "history"}
            className="mt-4"
          >
            {history.length === 0 ? (
              <div className="rounded-surface border border-line bg-surface p-4">
                <div className="mb-3 flex items-center gap-2 text-body-sm font-medium">
                  <CalendarDays className="size-4 text-fg-subtle" />
                  History
                </div>

                <EmptyTab message="No workout history yet. Start training!" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((h) => (
                  <article
                    key={h.date}
                    className="rounded-surface border border-line bg-surface p-4"
                  >
                    <div className="mb-3 flex items-center gap-2 text-body-sm font-medium">
                      <CalendarDays className="size-4 text-fg-subtle" />
                      {longDate(h.date)}
                    </div>

                    <div className="flex flex-col gap-2">
                      {h.sets.map((set) => (
                        <div
                          key={set.setNumber}
                          className="flex items-center gap-2 rounded-control bg-sunken/60 p-2"
                        >
                          <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-control bg-surface text-caption">
                            <span className="text-fg-subtle">Set</span>
                            <span className="font-semibold tabular-nums">{set.setNumber}</span>
                          </span>

                          <span className="flex flex-1 flex-col items-center">
                            <span className="text-caption text-fg-subtle">Weight</span>
                            <span className="font-semibold tabular-nums">{set.loadKg ?? "—"}</span>
                          </span>

                          <span className="flex flex-1 flex-col items-center">
                            <span className="text-caption text-fg-subtle">Reps</span>
                            <span className="font-semibold tabular-nums">{set.reps ?? "—"}</span>
                          </span>

                          <CircleCheck className="size-6 shrink-0 text-success" />
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Charts */}
          <section
            id="exercise-panel-charts"
            role="tabpanel"
            aria-labelledby="exercise-tab-charts"
            hidden={activeTab !== "charts"}
            className="mt-4"
          >
            <div className="flex flex-col gap-3">
              <StatCard
                icon={<Weight className="size-4 text-fg-subtle" />}
                value={stats.maxWeightKg != null ? `${stats.maxWeightKg} kg` : "—"}
                label="Max Weight"
                series={stats.series.map((p) => p.volumeKg)}
              />

              <StatCard
                icon={<Repeat className="size-4 text-fg-subtle" />}
                value={stats.maxReps != null ? String(stats.maxReps) : "—"}
                label="Max Reps"
                series={stats.series.map((p) => p.volumeKg)}
              />

              <StatCard
                icon={<TrendingUp className="size-4 text-fg-subtle" />}
                value={stats.totalVolumeKg != null ? `${stats.totalVolumeKg} kg` : "—"}
                label="Total Volume"
                series={stats.series.map((p) => p.volumeKg)}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  series,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  series: number[];
}) {
  return (
    <div className="rounded-surface border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-sunken">
          {icon}
        </span>

        <span className="flex flex-col">
          <span className="text-heading font-semibold tabular-nums">{value}</span>
          <span className="text-caption text-fg-muted">{label}</span>
        </span>
      </div>

      <div className="mt-4">
        {series.length < 2 ? (
          <p className="py-6 text-center text-caption text-fg-subtle">
            Not enough data points to display chart
          </p>
        ) : (
          <Sparkline values={series} />
        )}
      </div>
    </div>
  );
}

function EmptyTab({ icon, message }: { icon?: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      {icon}

      <p className="max-w-[32ch] text-body-sm text-fg-muted">{message}</p>
    </div>
  );
}

function longDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-4 sm:px-6 lg:px-10">
      <Skeleton className="h-32 w-full rounded-surface sm:h-36" />
      <Skeleton className="h-12 w-full rounded-surface" />
      <Skeleton className="h-48 w-full rounded-surface" />
    </div>
  );
}
