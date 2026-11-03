"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityDetail, type Message } from "@traiv/ui/components/chat";
import { Dialog, DialogContent, DialogTitle } from "@traiv/ui/components/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@traiv/ui/components/tooltip";
import { Button } from "@traiv/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@traiv/ui/components/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Star,
  Search,
  Dumbbell,
  TrendingUp,
  MoreHorizontal,
  ExternalLink as Eye,
  Trash as Trash2,
  X,
  Clock,
} from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import { http } from "@/lib/api/client";

type Session = NonNullable<Message["detail"]> & { id: string; completedAt: string; date: string };
const date = (s: string) =>
  new Date(s).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
function FullName({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild delay={0}>
        <span className="block truncate">{children}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{children}</TooltipContent>
    </Tooltip>
  );
}
function Pages({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const count = Math.max(1, Math.ceil(total / 5));
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 border-t border-line py-3 text-xs text-fg-muted"
    >
      <span className="shrink-0 tabular-nums">
        {Math.min(page * 5 + 1, total)}–{Math.min((page + 1) * 5, total)}{" "}
        <span className="opacity-70">of {total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-lg border border-line bg-surface text-fg transition-colors hover:bg-selected disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span
          aria-label={`Page ${page + 1} of ${count}`}
          className="min-w-7 text-center font-medium tabular-nums text-fg"
        >
          {page + 1}/{count}
        </span>
        <button
          type="button"
          disabled={page + 1 >= count}
          onClick={() => onChange(page + 1)}
          className="flex h-8 items-center justify-center gap-1 rounded-lg bg-signal px-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-30"
        >
          Next <ChevronRight className="size-3.5" />
        </button>
      </div>
    </nav>
  );
}
export function DevelopmentTraining({
  studioId,
  clientId,
}: {
  studioId: string;
  clientId: string;
}) {
  const path = `/studios/${studioId}/clients/${clientId}/training`,
    key = ["development-training", studioId, clientId],
    qc = useQueryClient();
  const query = useQuery({
    queryKey: key,
    queryFn: async () => (await http.get<Session[]>(path)).data,
  });
  const [search, setSearch] = useState(""),
    [selected, setSelected] = useState<string | null>(null),
    [detail, setDetail] = useState<Session | null>(null),
    [remove, setRemove] = useState<Session | null>(null),
    [busy, setBusy] = useState(false);
  const [sessionPage, setSessionPage] = useState(0);
  const [exercisePage, setExercisePage] = useState(0);
  const sessions = query.data ?? [];
  const currentSessionPage = Math.min(sessionPage, Math.max(0, Math.ceil(sessions.length / 5) - 1));
  const exercises = [
    ...new Map(
      sessions.flatMap((s) => (s.exercises ?? []).map((r) => [r.exercise.id, r.exercise] as const)),
    ).values(),
  ];
  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );
  const currentExercisePage = Math.min(
    exercisePage,
    Math.max(0, Math.ceil(filteredExercises.length / 5) - 1),
  );
  const exercise = exercises.find((e) => e.id === selected) ?? exercises[0];
  const points = sessions
    .slice()
    .reverse()
    .flatMap((s) => {
      const logs = (s.exercises ?? []).filter(
        (r) => r.exercise.id === exercise?.id && r.log.completed,
      );
      if (!logs.length) return [];
      return [
        {
          date: s.completedAt,
          weight: Math.max(0, ...logs.map((r) => r.log.loadKg ?? 0)),
          reps: Math.max(0, ...logs.map((r) => r.log.reps ?? 0)),
          sets: logs.length,
        },
      ];
    });
  const valid = sessions.flatMap((s) =>
    (s.exercises ?? []).filter(
      (r) => r.exercise.id === exercise?.id && r.log.completed && (r.log.reps ?? 0) > 0,
    ),
  );
  const best = Math.max(0, ...valid.map((r) => r.log.loadKg ?? 0));
  const rm = Math.max(
    0,
    ...valid
      .filter((r) => (r.log.reps ?? 0) <= 12)
      .map((r) => (r.log.loadKg ?? 0) * (1 + (r.log.reps ?? 0) / 30)),
  );
  const history = useQuery({
    queryKey: [...key, detail?.id],
    enabled: !!detail,
    queryFn: async () =>
      (await http.get<NonNullable<Session["histories"]>>(path + `/${detail!.id}/history`)).data,
  });
  const message = {
    kind: "workout",
    detail: { ...detail, histories: history.data ?? [] },
  } as Message;
  const max = Math.max(1, ...points.flatMap((p) => [p.weight, p.reps, p.sets]));
  return (
    <section
      id="development-training"
      className="mt-8 border-t border-line pt-6"
      style={{ scrollMarginTop: "var(--development-scroll-offset, 260px)" }}
    >
      <h2 className="font-semibold">Training</h2>
      <p className="mt-1 text-xs text-fg-muted">
        Recent sessions and how each exercise is progressing.
      </p>
      {query.isSuccess && sessions.length === 0 ? (
        <div className="mt-8 space-y-5">
          <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-7 text-center">
            <Activity className="mb-4 size-10 text-fg-muted/35" />
            <h3 className="font-semibold">No sessions found</h3>
            <p className="mt-1 text-sm text-fg-muted">
              This client hasn't completed any workouts or tracked any activities yet.
            </p>
          </div>
          <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-7 text-center">
            <TrendingUp className="mb-4 size-10 text-fg-muted/35" />
            <h3 className="font-semibold">No exercises found</h3>
            <p className="mt-1 text-sm text-fg-muted">
              This client hasn't performed any exercises yet.
            </p>
          </div>
        </div>
      ) : (
        <>
          <h3 className="mt-5 mb-3 text-sm font-semibold">Recent Sessions &amp; Activities</h3>
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line">
                  <tr>
                    {["When", "Description", "Stats", "Type", "Note", ""].map((t) => (
                      <th key={t} className="px-4 py-3 font-semibold">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(currentSessionPage * 5, currentSessionPage * 5 + 5).map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-line last:border-0 transition-colors hover:bg-panel"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">{date(s.completedAt)}</td>
                      <td className="px-4 py-4 font-medium">
                        <div className="max-w-60">
                          <FullName>{s.name}</FullName>
                        </div>
                        <div className="max-w-60 text-xs font-normal text-fg-muted">
                          <FullName>{s.programName}</FullName>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="flex text-amber-400"
                          aria-label={`${s.quality ?? 0} out of 5`}
                        >
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className="size-4"
                              fill={i < (s.quality ?? 0) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-lg border border-line bg-panel px-2 py-1 text-xs">
                          Workout
                        </span>
                      </td>
                      <td className="max-w-52 px-4 py-4 text-fg-muted">
                        <FullName>{s.note}</FullName>
                      </td>
                      <td className="px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Session actions">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetail(s)}>
                              <Eye className="size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRemove(s)} className="text-red-600">
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!sessions.length && (
                <p className="p-8 text-center text-sm text-fg-muted">
                  {query.isPending
                    ? "Loading training…"
                    : query.isError
                      ? "Couldn't load training."
                      : "No completed sessions yet."}
                </p>
              )}
              {query.isError && <Button onClick={() => query.refetch()}>Retry</Button>}
            </div>
            {sessions.length > 0 && (
              <div className="px-4">
                <Pages
                  page={currentSessionPage}
                  total={sessions.length}
                  onChange={setSessionPage}
                />
              </div>
            )}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <h3 className="text-sm font-semibold">Training analysis</h3>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-3 size-4 text-fg-muted" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setExercisePage(0);
                  }}
                  placeholder="Search exercises"
                  className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm"
                />
              </div>
              <div className="mt-3 space-y-2">
                {filteredExercises
                  .slice(currentExercisePage * 5, currentExercisePage * 5 + 5)
                  .map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelected(e.id)}
                      className={`flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors hover:border-signal/20 hover:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${exercise?.id === e.id ? "border-signal/20 bg-selected" : "border-transparent bg-panel"}`}
                    >
                      {e.imageUrl ? (
                        <img
                          src={e.imageUrl}
                          alt=""
                          className="size-9 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <Dumbbell className="size-8 shrink-0" />
                      )}
                      <span className="min-w-0 flex-1 font-medium">
                        <FullName>{e.name}</FullName>
                        <span className="block text-xs font-normal text-fg-muted">
                          {e.equipment}
                        </span>
                      </span>
                      <TrendingUp className="size-4 shrink-0" />
                    </button>
                  ))}
              </div>
              {!filteredExercises.length && (
                <p className="py-5 text-center text-xs text-fg-muted">No exercises found.</p>
              )}
              {filteredExercises.length > 0 && (
                <Pages
                  page={currentExercisePage}
                  total={filteredExercises.length}
                  onChange={setExercisePage}
                />
              )}
            </div>
            <div className="min-w-0 rounded-2xl border border-line bg-surface p-5">
              <div className="grid grid-cols-2 border-b border-line pb-5 text-center">
                <div>
                  <p className="text-xs text-fg-muted">Best entered set</p>
                  <strong className="text-xl">{best ? `${best.toLocaleString()} kg` : "—"}</strong>
                </div>
                <div>
                  <p className="text-xs text-fg-muted">Estimated 1RM</p>
                  <strong className="text-xl">
                    {rm ? `${Math.round(rm).toLocaleString()} kg` : "—"}
                  </strong>
                </div>
              </div>
              {points.length ? (
                <>
                  <svg
                    viewBox="0 0 800 300"
                    className="mt-5 h-[300px] w-full"
                    role="img"
                    aria-label={`${exercise?.name} training history`}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <g key={i}>
                        <line
                          x1="45"
                          x2="780"
                          y1={260 - i * 60}
                          y2={260 - i * 60}
                          stroke="currentColor"
                          opacity=".1"
                          strokeDasharray="3 3"
                        />
                        <text
                          x="35"
                          y={264 - i * 60}
                          textAnchor="end"
                          fill="currentColor"
                          fontSize="11"
                        >
                          {Math.round((max * i) / 4)}
                        </text>
                      </g>
                    ))}
                    {(
                      [
                        ["weight", "#398640"],
                        ["reps", "#29a399"],
                        ["sets", "#315565"],
                      ] as const
                    ).map(([k, color]) => (
                      <g key={k}>
                        <polyline
                          fill="none"
                          stroke={color}
                          strokeWidth="2.5"
                          points={points
                            .map(
                              (p, i) =>
                                `${45 + (points.length === 1 ? 367 : (i * 735) / (points.length - 1))},${260 - (p[k] / max) * 240}`,
                            )
                            .join(" ")}
                        />
                        {points.map((p, i) => (
                          <circle
                            key={p.date}
                            cx={45 + (points.length === 1 ? 367 : (i * 735) / (points.length - 1))}
                            cy={260 - (p[k] / max) * 240}
                            r="4"
                            fill={color}
                          >
                            <title>
                              {date(p.date)}: {p[k]} {k}
                            </title>
                          </circle>
                        ))}
                      </g>
                    ))}
                    {points
                      .filter((_, i) => i === 0 || i === points.length - 1)
                      .map((p, i) => (
                        <text
                          key={p.date}
                          x={i === 0 ? 45 : 780}
                          y="288"
                          textAnchor={i === 0 ? "start" : "end"}
                          fill="currentColor"
                          fontSize="11"
                        >
                          {new Date(p.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </text>
                      ))}
                  </svg>
                  <div className="flex justify-center gap-5 text-xs">
                    {[
                      ["Weight (kg)", "#398640"],
                      ["Max reps", "#29a399"],
                      ["Total sets", "#315565"],
                    ].map(([label, color]) => (
                      <span key={label} className="flex items-center gap-1">
                        <i className="size-2 rounded-sm" style={{ background: color }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="flex h-72 items-center justify-center text-sm text-fg-muted">
                  Complete a workout to see exercise progress.
                </p>
              )}
            </div>
          </div>
        </>
      )}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent
          variant="scrollable"
          showCloseButton={false}
          className="max-h-[85dvh] w-[calc(100vw-2rem)] max-w-[960px] overflow-hidden rounded-3xl p-0"
        >
          <div className="relative shrink-0 bg-gradient-to-br from-signal to-[#153a79] p-6 text-white">
            <button
              onClick={() => setDetail(null)}
              aria-label="Close details"
              className="absolute right-4 top-4 rounded-full bg-white p-2 text-fg"
            >
              <X className="size-4" />
            </button>
            <DialogTitle className="text-xl text-white">{detail?.name}</DialogTitle>
            <p className="mt-5 flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              {Math.round((detail?.totalSeconds ?? 0) / 60)}m · {detail && date(detail.completedAt)}
            </p>
            <p className="mt-4 text-sm">
              Intensity: {detail?.intensity ?? "—"}/5　 Rating: {detail?.quality ?? "—"}/5
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ActivityDetail
              message={message}
              onImage={(url) => window.open(url, "_blank", "noopener,noreferrer")}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!remove} onOpenChange={(o) => !o && setRemove(null)}>
        <DialogContent>
          <DialogTitle>Delete this workout session?</DialogTitle>
          <p className="text-sm text-fg-muted">
            This removes the logged session and its chat activity. This cannot be undone.
          </p>
          <Button variant="outline" onClick={() => setRemove(null)}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await http.delete(path + `/${remove!.id}`);
                await qc.invalidateQueries({ queryKey: key });
                setRemove(null);
                notifyAction("Workout session deleted", "success");
              } catch {
                notifyAction("Couldn't delete session", "error");
              } finally {
                setBusy(false);
              }
            }}
          >
            Delete session
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
