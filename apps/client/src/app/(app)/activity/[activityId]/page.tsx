"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/wensity/button";
import { Input } from "@traiv/ui/components/wensity/input";
import { ArrowLeft, Check, Clock, Dumbbell, Pencil, Star } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { http } from "@/lib/api/client";
import { useActiveStudio } from "@/lib/query";
import { queryKeys } from "@/lib/query/keys";
import { type ActivityDetail, type ActivitySet, useActivity } from "@/lib/query/use-activity";
import { DurationDialog } from "../../workouts/_components/duration-dialog";

const qualityLabels = ["Bad", "OK", "Good", "Great", "Perfect"];
const intensityLabels = ["Very low", "Low", "Medium", "High", "Very high"];
type Field = "loadKg" | "reps" | "seconds" | "distanceM" | "calories" | "restSeconds";
const fields: { key: Field; label: string; max: number; flag: string }[] = [
  { key: "loadKg", label: "Weight (kg)", max: 1000, flag: "weight" },
  { key: "reps", label: "Reps", max: 1000, flag: "rep_range" },
  { key: "seconds", label: "Time (s)", max: 100000, flag: "time" },
  { key: "distanceM", label: "Distance (m)", max: 100000, flag: "distance" },
  { key: "calories", label: "Calories", max: 100000, flag: "calories" },
  { key: "restSeconds", label: "Rest (s)", max: 100000, flag: "rest" },
];

/** `useSearchParams` below requires a Suspense boundary for static prerendering. */
export default function ActivityPage() {
  return (
    <Suspense fallback={<div className="p-6" />}>
      <ActivityPageContent />
    </Suspense>
  );
}

function ActivityPageContent() {
  const { activityId } = useParams<{ activityId: string }>();
  const { studioId } = useActiveStudio();
  const query = useActivity(studioId, activityId);
  const search = useSearchParams();
  const back = search.get("from") === "home" ? "/dashboard" : "/activity";
  if (!query.data || !studioId)
    return (
      <div className="p-6">
        <Link href={back}>← Back</Link>
        <p className="py-8">
          {query.isError ? "Could not load this activity." : "Loading activity…"}
        </p>
        {query.isError && <Button onClick={() => void query.refetch()}>Try again</Button>}
      </div>
    );
  return <ActivityView key={query.data.id} activity={query.data} studioId={studioId} back={back} />;
}

function ActivityView({
  activity,
  studioId,
  back,
}: {
  activity: ActivityDetail;
  studioId: string;
  back: string;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(activity);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [restSetId, setRestSetId] = useState<string | null>(null);
  const shown = editing ? draft : activity;
  const groups = new Map<string, ActivitySet[]>();
  for (const set of shown.sets) {
    const key = set.sessionExerciseId ?? set.id;
    groups.set(key, [...(groups.get(key) ?? []), set]);
  }
  const invalid = draft.sets.some((s) =>
    fields.some(
      (f) =>
        s[f.key] !== null &&
        (!Number.isFinite(s[f.key]) ||
          (s[f.key] ?? 0) < 0 ||
          (s[f.key] ?? 0) > f.max ||
          (["reps", "seconds", "calories", "restSeconds"].includes(f.key) &&
            !Number.isInteger(s[f.key]))),
    ),
  );
  const change = (id: string, patch: Partial<ActivitySet>) =>
    setDraft((d) => ({ ...d, sets: d.sets.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  async function save() {
    if (invalid || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await http.put<ActivityDetail>(
        `/c/${studioId}/activity/${encodeURIComponent(activity.id)}`,
        {
          version: draft.version,
          quality: draft.quality,
          intensity: draft.intensity,
          note: draft.note,
          sets: draft.sets.map((s) => ({
            id: s.id,
            completed: s.completed,
            ...Object.fromEntries(fields.map((f) => [f.key, s[f.key]])),
          })),
        },
      );
      qc.setQueryData(["activity", studioId, "detail", activity.id], response.data);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["activity", studioId, "list"] }),
        qc.invalidateQueries({ queryKey: queryKeys.client.today(studioId) }),
        qc.invalidateQueries({ queryKey: ["profile-history", studioId] }),
        qc.invalidateQueries({ queryKey: ["client", "workout", studioId] }),
        qc.invalidateQueries({ queryKey: ["client", "exercise", studioId] }),
        qc.invalidateQueries({ queryKey: queryKeys.client.workouts(studioId) }),
      ]);
      setEditing(false);
    } catch {
      setError(
        "Could not save. Your edits are still here. If this activity changed elsewhere, cancel and reload before editing again.",
      );
    } finally {
      setSaving(false);
    }
  }
  const seconds = shown.totalSeconds ?? 0;
  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col bg-signal">
      <header className="shrink-0 bg-signal px-5 pb-9 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
        <div className="mb-12 flex items-center justify-between">
          {editing ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              className="rounded-control bg-white/15 p-3"
              aria-label="Cancel editing"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <Link href={back} aria-label="Back" className="rounded-control bg-white/15 p-3">
              <ArrowLeft className="size-5" />
            </Link>
          )}
          {activity.editable && !editing && (
            <button
              type="button"
              onClick={() => {
                setDraft(activity);
                setEditing(true);
              }}
              aria-label="Edit activity"
              className="rounded-control bg-white/15 p-3"
            >
              <Pencil className="size-5" />
            </button>
          )}
        </div>
        <p className="text-sm opacity-80">{shown.programName}</p>
        <h1 className="mt-1 text-3xl font-semibold">{shown.name}</h1>
        <div className="mt-4 flex gap-3 text-sm">
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <Clock className="size-4" />
            {Math.floor(seconds / 60)}:{String(Math.floor(seconds % 60)).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <Dumbbell className="size-4" />
            {groups.size} exercises
          </span>
        </div>
      </header>
      <div
        className={`relative -mt-4 flex-1 space-y-4 rounded-t-[2rem] bg-panel px-4 pt-8 ${editing ? "pb-32" : "pb-8"}`}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-4 h-1 w-8 -translate-x-1/2 rounded-full bg-fg/15"
        />
        {activity.kind === "health" ? (
          <div className="rounded-[20px] bg-surface p-5 text-fg-muted">
            Synced from your health app. Update this workout in the app where it was recorded.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <section className="rounded-[16px] border border-line bg-surface p-3 shadow-sm">
                <p className="text-sm text-fg-muted">Quality</p>
                <p className="mt-1 font-semibold">
                  {shown.quality ? qualityLabels[shown.quality - 1] : "Not rated"}
                </p>
                <div className="mt-2 flex text-amber-500">
                  {Array.from({ length: shown.quality ?? 0 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
              </section>
              <section className="rounded-[16px] border border-line bg-surface p-3 shadow-sm">
                <p className="text-sm text-fg-muted">Intensity</p>
                <p className="mt-1 font-semibold">
                  {shown.intensity ? intensityLabels[shown.intensity - 1] : "Not rated"}
                </p>
                <p className="mt-2 text-signal">{"●".repeat(shown.intensity ?? 0)}</p>
              </section>
            </div>
            {[...groups.entries()].map(([id, sets]) => {
              const first = sets[0];
              if (!first) return null;
              const visible = fields.filter(
                (f) =>
                  f.key !== "restSeconds" &&
                  (sets.some((s) => s[f.key] !== null) ||
                    first.fields?.includes(f.flag) ||
                    (f.key === "reps" && first.fields?.includes("reps")) ||
                    (!first.fields?.length && (f.key === "reps" || f.key === "loadKg"))),
              );
              return (
                <section
                  key={id}
                  className="rounded-[20px] border border-line bg-surface p-4 shadow-sm"
                >
                  <div className="mb-5 flex items-center gap-3">
                    {first.imageUrl ? (
                      <img
                        src={first.imageUrl}
                        alt=""
                        className="size-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-xl bg-hover">
                        <Dumbbell className="size-6" />
                      </div>
                    )}
                    <h2 className="text-lg font-semibold">
                      {first.name ?? "Exercise no longer available"}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {sets.map((s) => (
                      <div key={s.id}>
                        <div className="flex items-end gap-2">
                          <div className="w-8 shrink-0 text-center">
                            <p className="mb-2 text-xs text-fg-muted">Set</p>
                            <p
                              className={`flex h-11 items-center justify-center rounded-lg font-medium ${editing ? "" : "border border-line bg-panel"}`}
                            >
                              {s.setNumber}
                            </p>
                          </div>
                          <div
                            className="grid min-w-0 flex-1 gap-2"
                            style={{
                              gridTemplateColumns: `repeat(${visible.length || 1}, minmax(0, 1fr))`,
                            }}
                          >
                            {visible.map((f) => (
                              <div key={f.key} className="min-w-0">
                                <span className="mb-1 block text-center text-xs text-fg-muted">
                                  {f.label}
                                </span>
                                {editing ? (
                                  <Input
                                    nativeLayout
                                    disabled={saving}
                                    aria-label={`${first.name} set ${s.setNumber} ${f.label}`}
                                    type="number"
                                    min={0}
                                    max={f.max}
                                    step={
                                      ["reps", "seconds", "calories", "restSeconds"].includes(f.key)
                                        ? 1
                                        : "any"
                                    }
                                    value={s[f.key] ?? ""}
                                    onChange={(e) =>
                                      change(s.id, {
                                        [f.key]:
                                          e.target.value === "" ? null : Number(e.target.value),
                                      })
                                    }
                                    className="h-11 min-h-11 w-full min-w-0 rounded-lg border border-line bg-surface px-1 text-center font-medium shadow-none"
                                  />
                                ) : (
                                  <span className="flex min-h-11 items-center justify-center rounded-lg border border-line bg-panel px-2 font-medium">
                                    {s[f.key] ?? "—"}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            aria-label={`Set ${s.setNumber} completed`}
                            aria-pressed={s.completed}
                            disabled={!editing || saving}
                            onClick={() => change(s.id, { completed: !s.completed })}
                            className={`flex size-11 shrink-0 items-center justify-center rounded-lg border ${s.completed ? (editing ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-700 bg-emerald-700 text-white") : "border-line text-fg-muted"}`}
                          >
                            {s.completed ? <Check className="size-5" /> : "—"}
                          </button>
                        </div>
                        {editing && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-signal-text">
                            <span className="h-px flex-1 bg-signal/50" />
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => setRestSetId(s.id)}
                              aria-label={`Edit set ${s.setNumber} rest duration`}
                              className="shrink-0 whitespace-nowrap py-1 tabular-nums"
                            >
                              {s.restSeconds ?? 0}s
                            </button>
                            <span className="h-px flex-1 bg-signal/50" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
            {!groups.size && (
              <p className="rounded-[20px] bg-surface p-5 text-fg-muted">
                No exercise sets were recorded for this workout.
              </p>
            )}
            {(editing || shown.note) && (
              <section className="rounded-[20px] bg-surface p-4">
                <h2 className="mb-3 font-semibold">Notes</h2>
                {editing ? (
                  <textarea
                    maxLength={4000}
                    value={draft.note ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value || null }))}
                    className="min-h-28 w-full rounded-control border border-line bg-panel p-3"
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{shown.note}</p>
                )}
              </section>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
      </div>
      <DurationDialog
        open={restSetId !== null}
        onOpenChange={(open) => {
          if (!open) setRestSetId(null);
        }}
        initialSeconds={draft.sets.find((s) => s.id === restSetId)?.restSeconds ?? 0}
        onSubmit={(seconds) => {
          if (restSetId) change(restSetId, { restSeconds: seconds });
        }}
      />
      {editing && (
        <footer className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-[calc(48rem-2rem)] items-center gap-3 rounded-full bg-surface/95 p-2 shadow-lg backdrop-blur-md">
          <Button
            variant="outline"
            className="h-11 rounded-full px-5"
            disabled={saving}
            onClick={() => {
              setEditing(false);
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={saving || invalid}
            onClick={() => void save()}
            className="h-11 flex-1 rounded-full"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </footer>
      )}
    </main>
  );
}
