"use client";

import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@traiv/ui/components/dialog";
import { useActiveNav } from "@traiv/ui/components/shell/nav-override-context";
import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { ArrowLeft, Dumbbell, Plus, Settings } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { Exercise, TemplateInput, WorkoutSession } from "@/lib/api";
import { isApiError } from "@/lib/api";
import {
  useSaveSectionForReuse,
  useSaveTemplate,
  useTemplate,
  useTemplateActions,
} from "@/lib/query";
import { BuilderExercisePicker } from "../_components/builder-exercise-picker";
import { BuilderExerciseRow } from "../_components/builder-exercise-row";
import { CreateTemplatePanel } from "../_components/create-template-panel";
import { SessionNamePrompt } from "../_components/session-name-prompt";
import { SessionTabs } from "../_components/session-tabs";

/**
 * The template builder.
 *
 * Two panes, matching the real screen: the left is the exercise picker, the right is
 * the session being edited, as tabs with a `+` to add another. Everything is edited
 * locally — "Local changes" / "Discard Changes" / "Save" — and the whole tree is
 * replaced in one `PATCH` on Save, the same contract `updateTemplate` was built for.
 */
export default function BuilderPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const router = useRouter();
  const studioId = useActiveStudioId();

  const template = useTemplate(studioId, templateId);
  const save = useSaveTemplate(studioId ?? "", templateId);
  const actions = useTemplateActions(studioId ?? "", templateId);
  const saveSection = useSaveSectionForReuse(studioId ?? "");

  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  const [activeSession, setActiveSession] = useState(0);
  const [editing, setEditing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessions === null && template.data) setSessions(template.data.sessions);
  }, [template.data, sessions]);

  const dirty = useMemo(
    () =>
      sessions !== null &&
      template.data &&
      JSON.stringify(sessions) !== JSON.stringify(template.data.sessions),
    [sessions, template.data],
  );

  // The builder lives at `/templates/:id` even for a client's own programme — the route
  // alone can't say that, so the rail is told explicitly rather than lighting up
  // "Templates" for a screen the coach reached from a client's Workouts tab.
  useActiveNav(template.data?.clientId ? "/clients" : null);

  if (template.isPending || sessions === null) return <Loading />;

  if (template.error || !template.data || !studioId) {
    return (
      <Page className="gap-3">
        <SidebarToggle />
        <h1 className="text-heading font-medium">Workout not found</h1>
        <Button asChild variant="secondary" className="mt-2 self-start">
          <Link href="/templates">All workouts</Link>
        </Button>
      </Page>
    );
  }

  const published = template.data.status === "active";
  const session = sessions[activeSession] ?? null;
  // A client's programme is a `workout_template` row with `clientId` set (ADR 0024) —
  // it belongs to that client's Workouts tab, not the shared library, so every way back
  // out of the builder has to return there instead of the Templates list.
  const backHref = template.data.clientId
    ? `/clients/${template.data.clientId}?tab=workouts`
    : "/templates";

  const setSession = (next: WorkoutSession) =>
    setSessions(sessions.map((s, i) => (i === activeSession ? next : s)));

  function addExercise(e: Exercise) {
    if (!session) return;
    setSession({
      ...session,
      exercises: [
        ...session.exercises,
        {
          exerciseId: e.id,
          name: e.name,
          muscle: e.muscle,
          equipment: e.equipment,
          imageUrl: e.imageUrl,
          fields: e.defaultFields,
          sets: Array.from({ length: template.data?.defaultValues?.sets ?? 3 }, () => ({
            reps: template.data?.defaultValues?.reps ?? 10,
            weightKg: template.data?.defaultValues?.weightKg ?? null,
            restSeconds: template.data?.defaultValues?.rest ?? 60,
          })),
        },
      ],
    });
  }

  async function persist() {
    setError(null);
    try {
      await save.mutateAsync({
        name: template.data?.name ?? "",
        description: template.data?.description,
        imageUrl: template.data?.imageUrl,
        defaultValues: template.data?.defaultValues,
        sessions: sessions ?? [],
      } as TemplateInput);
      // Save is the builder's only exit — there's no separate "Done" button, so it
      // returns to wherever this workout belongs: the client's own Workouts tab for a
      // client program, the shared library for a studio template.
      router.push(backHref);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't save. Try again.");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-line border-b px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="truncate text-heading font-medium">{template.data.name}</h1>
          {dirty ? (
            <span className="shrink-0 rounded-full bg-signal-subtle px-2.5 py-1 text-caption font-medium text-signal-text">
              Local changes
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {dirty ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSessions(template.data?.sessions ?? [])}
            >
              Discard Changes
            </Button>
          ) : null}
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <Settings className="size-3.5" />
            Edit
          </Button>
          {published ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => actions.setStatus.mutate("draft")}
              disabled={actions.setStatus.isPending}
            >
              Unpublish
            </Button>
          ) : (
            <Button size="sm" onClick={() => setPublishing(true)}>
              Publish
            </Button>
          )}
          <Button size="sm" onClick={() => void persist()} disabled={!dirty || save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      {error ? <p className="px-4 pt-2 text-caption text-danger sm:px-6">{error}</p> : null}

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[22rem_1fr]">
        <div className="min-h-0 border-line border-b p-4 lg:border-r lg:border-b-0">
          <BuilderExercisePicker studioId={studioId} onAdd={addExercise} />
        </div>

        <div className="flex min-h-0 flex-col gap-4 p-4 sm:p-6">
          {sessions.length > 0 ? (
            <SessionTabs
              sessions={sessions}
              active={activeSession}
              onSelect={setActiveSession}
              onReorder={(from, to) => {
                const next = [...sessions];
                const [moved] = next.splice(from, 1);
                if (!moved) return;
                next.splice(to, 0, moved);
                setSessions(next);
                setActiveSession(to);
              }}
              onCreate={(name) => {
                setSessions([...sessions, { name, exercises: [] }]);
                setActiveSession(sessions.length);
              }}
              onRename={(i, name) =>
                setSessions(sessions.map((s, si) => (si === i ? { ...s, name } : s)))
              }
              onDuplicate={(i) => {
                const source = sessions[i];
                if (!source) return;
                const copy: WorkoutSession = {
                  name: `${source.name} (copy)`,
                  exercises: source.exercises.map((e) => ({
                    exerciseId: e.exerciseId,
                    name: e.name,
                    muscle: e.muscle,
                    equipment: e.equipment,
                    imageUrl: e.imageUrl,
                    fields: e.fields,
                    note: e.note,
                    // Ids dropped — a duplicate is new rows, not a second pointer at the
                    // same ones.
                    sets: e.sets.map((set) => ({
                      reps: set.reps,
                      repsMax: set.repsMax,
                      weightKg: set.weightKg,
                      seconds: set.seconds,
                      distanceM: set.distanceM,
                      calories: set.calories,
                      restSeconds: set.restSeconds,
                    })),
                  })),
                };
                setSessions([...sessions, copy]);
                setActiveSession(sessions.length);
              }}
              onDelete={(i) => {
                const next = sessions.filter((_, si) => si !== i);
                setSessions(next);
                setActiveSession((a) => Math.min(a, Math.max(next.length - 1, 0)));
              }}
              onSaveForReuse={(i) => {
                const s = sessions[i];
                if (s?.id) void saveSection.mutateAsync({ sessionId: s.id });
              }}
              savingSection={saveSection.isPending}
            />
          ) : null}

          {!session ? (
            <EmptySession
              creating={creatingSession}
              onCreatingChange={setCreatingSession}
              onCreate={(name) => {
                setSessions([{ name, exercises: [] }]);
                setActiveSession(0);
              }}
            />
          ) : session.exercises.length === 0 ? (
            <p className="rounded-control border border-line border-dashed px-4 py-10 text-center text-body-sm text-fg-muted">
              No exercises in this session yet. Add one from the panel on the left.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {session.exercises.map((ex, i) => (
                <BuilderExerciseRow
                  key={ex.id ?? `${ex.exerciseId}-${i}`}
                  exercise={ex}
                  onChange={(next) =>
                    setSession({
                      ...session,
                      exercises: session.exercises.map((x, xi) => (xi === i ? next : x)),
                    })
                  }
                  onRemove={() =>
                    setSession({
                      ...session,
                      exercises: session.exercises.filter((_, xi) => xi !== i),
                    })
                  }
                  onSaveForReuse={
                    session.id
                      ? () => void saveSection.mutateAsync({ sessionId: session.id as string })
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateTemplatePanel
        open={editing}
        onOpenChange={setEditing}
        creating={save.isPending}
        onCreate={(input) =>
          void save
            .mutateAsync({ ...input, sessions: sessions ?? [] })
            .then((saved) => {
              // Same reason as `persist()`: pick up the real ids the server assigned.
              setSessions(saved.sessions);
              setEditing(false);
            })
            .catch((e) => setError(isApiError(e) ? e.message : "Couldn't save. Try again."))
        }
      />

      <PublishDialog
        open={publishing}
        onOpenChange={setPublishing}
        publishing={actions.setStatus.isPending}
        onConfirm={() => {
          actions.setStatus.mutate("active");
          setPublishing(false);
        }}
      />
    </div>
  );
}

function EmptySession({
  creating,
  onCreatingChange,
  onCreate,
}: {
  creating: boolean;
  onCreatingChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
      <Dumbbell className="size-8 text-fg-subtle" />
      <h2 className="text-subheading font-medium">No session added yet</h2>
      <p className="max-w-[40ch] text-body-sm text-fg-muted">
        Create a new session to get started, or copy from another template.
      </p>
      <SessionNamePrompt
        open={creating}
        onOpenChange={onCreatingChange}
        onSubmit={onCreate}
        trigger={
          <Button>
            <Plus className="size-4" />
            Create Session
          </Button>
        }
      />
    </div>
  );
}

/** "Are you sure you want to publish this template? Clients assigned to this template
 *  will be able to see it." — the exact confirmation copy on the real screen. */
function PublishDialog({
  open,
  onOpenChange,
  onConfirm,
  publishing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  publishing: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Publish Template</DialogTitle>
          <DialogDescription>
            Are you sure you want to publish this template? Clients assigned to this template will
            be able to see it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Loading() {
  return (
    <Page className="max-w-none gap-4">
      <SidebarToggle />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-surface" />
    </Page>
  );
}
