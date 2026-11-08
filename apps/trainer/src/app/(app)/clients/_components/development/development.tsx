"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Dialog, DialogContent, DialogTitle } from "@traiv/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import type { StepsData } from "@traiv/ui/components/steps-progress";
import { StepsProgress } from "@traiv/ui/components/steps-progress";
import { Switch } from "@traiv/ui/components/switch";
import { TooltipRich } from "@traiv/ui/components/tooltip";
import {
  Apple,
  Camera,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  ArrowsMaximize as IconArrowsMaximize,
  TrendingUp as IconTrendingUp,
  MessageSquareText,
  Ruler,
  Smile,
  Star,
} from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { http } from "@/lib/api/client";
import { BodyProgress } from "./measurements";
import { DevelopmentNutrition } from "./nutrition";
import { DevelopmentTraining } from "./training";

type Answer = {
  code: string;
  name: string;
  unit: string | null;
  numberValue: number | null;
  ratingValue: number | null;
  textValue: string | null;
  imageUrl: string | null;
};
type CheckIn = {
  id: string;
  dueOn: string;
  completedAt: string | null;
  reviewed: boolean;
  answers: Answer[];
};
type Data = {
  checkIns: CheckIn[];
  progressEntries?: CheckIn[];
  weight: { start: number | null; latest: number | null; goal: number | null };
  goal: string | null;
  clientName: string;
};
const ratings = [
  ["mood", "Mood"],
  ["energy", "Energy"],
  ["nutrition", "Nutrition"],
  ["progress", "Progress"],
  ["sleep_quality", "Sleep"],
] as const;
const card = "rounded-2xl border border-line bg-surface";
const date = (v: string) =>
  new Date(v.length === 10 ? v + "T12:00:00" : v).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const value = (c: CheckIn | undefined, code: string) => c?.answers.find((a) => a.code === code);
const average = (c: CheckIn | undefined) => {
  const r = c?.answers.filter((a) => a.ratingValue != null) ?? [];
  return r.length ? r.reduce((s, a) => s + (a.ratingValue ?? 0), 0) / r.length : null;
};
const n = (v: number) => Number(v.toFixed(1)).toLocaleString();
export function Development({ studioId, clientId }: { studioId: string; clientId: string }) {
  const path = `/studios/${studioId}/clients/${clientId}`,
    qc = useQueryClient(),
    key = ["development", studioId, clientId];
  const query = useQuery({
    queryKey: key,
    queryFn: async () => (await http.get<Data>(path + "/development")).data,
    staleTime: 15000,
    refetchInterval: 15000,
  });
  const [selected, setSelected] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [image, setImage] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeSection, setActiveSection] = useState("check-in");
  useEffect(() => {
    const update = () => {
      const section = document.getElementById("development-nutrition");
      const measurements = document.getElementById("development-measurements");
      const training = document.getElementById("development-training");
      setActiveSection(
        training && training.getBoundingClientRect().top <= headerHeight + 100
          ? "training"
          : measurements && measurements.getBoundingClientRect().top <= headerHeight + 100
            ? "measurements"
            : section && section.getBoundingClientRect().top <= headerHeight + 100
              ? "nutrition"
              : "check-in",
      );
    };
    window.addEventListener("scroll", update, true);
    return () => window.removeEventListener("scroll", update, true);
  }, [headerHeight]);
  useEffect(() => {
    const header = document.querySelector("[data-client-header]");
    if (!header) return;
    const measure = () => setHeaderHeight(header.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  const load = useCallback(
    async (start: string, end: string) =>
      (await http.get<StepsData>(path + "/steps", { params: { start, end } })).data,
    [path],
  );
  const goalSave = useCallback(
    async (day: string, count: number) => {
      await http.put(path + "/step-goal", { date: day, count });
    },
    [path],
  );
  if (query.isPending) return <div className="p-6 text-sm text-fg-muted">Loading development…</div>;
  if (!query.data || query.isError)
    return (
      <div className="p-6">
        <Button onClick={() => void query.refetch()}>Retry development</Button>
      </div>
    );
  const data = query.data,
    index = Math.max(
      0,
      data.checkIns.findIndex((c) => c.id === selected),
    ),
    current = data.checkIns[index],
    previous = data.checkIns[index + 1];
  const currentWeight = value(current, "weight")?.numberValue ?? null,
    previousWeight = value(previous, "weight")?.numberValue ?? null;
  const weight = currentWeight ?? data.weight.latest,
    start = data.weight.start,
    goal = data.weight.goal;
  const total = weight != null && start != null ? weight - start : null,
    delta = currentWeight != null && previousWeight != null ? currentWeight - previousWeight : null;
  const completion =
    weight != null && start != null && goal != null && goal !== start
      ? Math.max(0, Math.min(1, (weight - start) / (goal - start)))
      : null;
  async function review() {
    if (!current) return;
    setBusy(true);
    try {
      await http.post(path + "/development/" + current.id + "/review");
      await qc.invalidateQueries({ queryKey: key });
      notifyAction("Check-in marked as reviewed", "success");
    } catch {
      notifyAction("Couldn't review check-in. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="relative flex gap-4 px-3 py-4 lg:px-4">
      <aside
        style={{ top: headerHeight + 12, borderRadius: 16 }}
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          if (!link) return;
          const target = document.getElementById(link.hash.slice(1));
          if (!target) return;
          event.preventDefault();
          target.style.scrollMarginTop = `${headerHeight + 16}px`;
          target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
            block: "start",
          });
        }}
        className="sticky h-fit w-11 shrink-0 self-start rounded-2xl border border-line bg-surface p-1"
      >
        <TooltipRich
          delayDuration={0}
          side="right"
          title="Check-in"
          description="Answers, ratings, weight and photos."
        >
          <a
            style={{ borderRadius: 10 }}
            href="#development-check-in"
            aria-label="Check-in"
            className={
              "flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-selected hover:text-signal-text focus-visible:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal " +
              (activeSection === "check-in" ? "bg-selected text-signal-text" : "text-fg-muted")
            }
          >
            <ClipboardList className="size-[18px]" />
          </a>
        </TooltipRich>
        <TooltipRich
          delayDuration={0}
          side="right"
          title="Nutrition"
          description="Logged food against the client's targets."
        >
          <a
            style={{ borderRadius: 10 }}
            href="#development-nutrition"
            aria-label="Nutrition"
            className={
              "mt-1 flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-selected hover:text-signal-text focus-visible:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal " +
              (activeSection === "nutrition" ? "bg-selected text-signal-text" : "text-fg-muted")
            }
          >
            <Apple className="size-[18px]" />
          </a>
        </TooltipRich>
        <TooltipRich
          delayDuration={0}
          side="right"
          title="Measurements"
          description="Weight, circumference and other measurements."
        >
          <a
            style={{ borderRadius: 10 }}
            href="#development-measurements"
            aria-label="Measurements"
            className={
              "mt-1 flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-selected hover:text-signal-text focus-visible:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal " +
              (activeSection === "measurements" ? "bg-selected text-signal-text" : "text-fg-muted")
            }
          >
            <Ruler className="size-[18px]" />
          </a>
        </TooltipRich>
        <TooltipRich
          delayDuration={0}
          side="right"
          title="Training"
          description="Recent sessions and exercise progress."
        >
          <a
            style={{ borderRadius: 10 }}
            href="#development-training"
            aria-label="Training"
            className={
              "mt-1 flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-selected hover:text-signal-text focus-visible:bg-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal " +
              (activeSection === "training" ? "bg-selected text-signal-text" : "text-fg-muted")
            }
          >
            <Dumbbell className="size-[18px]" />
          </a>
        </TooltipRich>
      </aside>
      <div
        id="development-check-in"
        style={{ scrollMarginTop: headerHeight + 16 }}
        className="min-w-0 flex-1"
      >
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Check-in</h2>
            <p className="mt-1 text-xs text-fg-muted">
              {current
                ? "Answers, ratings, weight and photos from this check-in."
                : "No check-ins yet."}
            </p>
          </div>
          {current ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!previous}
                onClick={() => setSelected(previous?.id ?? null)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <strong className="text-xs">
                {current ? date(current.completedAt ?? current.dueOn) : "No check-ins yet"}
              </strong>
              {current && index === 0 ? (
                <span className="rounded-full bg-selected px-2 py-1 text-xs font-medium text-signal-text">
                  Latest
                </span>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={() => setSelected(data.checkIns[index - 1]?.id ?? null)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ) : null}
        </header>
        {current ? (
          <>
            {index === 0 && !current.reviewed ? (
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-signal/15 bg-selected p-4">
                <span className="rounded-lg bg-signal p-2 text-white">
                  <Smile className="size-5" />
                </span>
                <div className="flex-1">
                  <strong className="text-sm">Latest check-in</strong>
                  <p className="mt-1 text-xs text-fg-muted">
                    Your client has submitted their latest check-in. Review it when you're ready.
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={busy}
                  className="rounded-full"
                  onClick={() => void review()}
                >
                  {busy ? "Saving…" : "Mark as reviewed"}
                </Button>
              </div>
            ) : null}
            <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {[
                ["Average Rating", average(current), average(previous)],
                ...ratings.map(([code, name]) => [
                  name,
                  value(current, code)?.ratingValue ?? null,
                  value(previous, code)?.ratingValue ?? null,
                ]),
              ].map(([label, raw, prev], i) => {
                const rating = raw as number | null,
                  prior = prev as number | null,
                  change =
                    rating != null && prior != null && prior !== 0
                      ? ((rating - prior) / prior) * 100
                      : null;
                return (
                  <section
                    key={String(label)}
                    className={card + " p-3 " + (i === 0 ? "bg-selected" : "")}
                  >
                    <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-selected text-signal-text">
                      {i < 2 ? <Smile className="size-5" /> : <Star className="size-5" />}
                    </span>
                    <p className="text-xs text-fg-muted">{label}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
                      <strong className="text-xl">
                        {rating == null ? "—" : n(rating)}
                        <span className="text-xs font-normal text-fg-muted">/5</span>
                      </strong>
                      {change != null ? (
                        <span
                          className={
                            "rounded-full px-2 py-1 text-[10px] " +
                            (change < 0
                              ? "bg-red-50 text-red-500"
                              : change > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-panel text-fg-muted")
                          }
                        >
                          {change > 0 ? "+" : ""}
                          {n(change)}%
                        </span>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 pb-8 pt-3 text-center sm:min-h-72">
            <span className="mb-5 flex size-20 items-center justify-center rounded-full bg-panel text-fg-muted">
              <Smile className="size-10" />
            </span>
            <h3 className="text-lg font-semibold">No development data found</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
              We couldn't find any development data for this client. The client has not submitted
              any check-ins yet.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href={`/inbox?client=${clientId}`}>
                <MessageSquareText className="size-4" />
                Message them to check in
              </Link>
            </Button>
          </div>
        )}
        <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
          {current ? (
            <>
              <section className={card + " min-h-64 p-5"}>
                <h3 className="mb-5 text-sm font-semibold">Responses</h3>
                <div className="space-y-1.5">
                  {current?.answers
                    .filter((a) => a.textValue?.trim())
                    .map((a) => (
                      <div key={a.code} className="rounded-xl bg-panel px-3 py-3 text-sm">
                        <p className="font-medium">{a.name}</p>
                        <p className="mt-1 whitespace-pre-wrap text-fg-muted">{a.textValue}</p>
                      </div>
                    ))}
                  {!current?.answers.some((a) => a.textValue?.trim()) ? (
                    <p className="text-sm text-fg-muted">No written responses for this check-in.</p>
                  ) : null}
                </div>
              </section>
              <div className="space-y-2">
                <section className={card + " p-5 text-center"}>
                  {delta != null ? (
                    <span className="inline-block rounded-full bg-selected px-3 py-1 text-xs font-medium text-signal-text">
                      {delta > 0 ? "+" : ""}
                      {n(delta)} kg since last check-in
                    </span>
                  ) : (
                    <p className="text-xs text-fg-muted">Weight progress</p>
                  )}
                  <div className="relative mx-auto mt-4 max-w-64">
                    <svg
                      viewBox="0 0 240 140"
                      className="w-full"
                      aria-label={
                        completion == null
                          ? "Weight goal not set"
                          : Math.round(completion * 100) + "% of weight goal"
                      }
                    >
                      <path
                        d="M 20 120 A 100 100 0 0 1 220 120"
                        fill="none"
                        stroke="var(--color-line,#e5e7eb)"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />
                      {completion != null ? (
                        <path
                          d="M 20 120 A 100 100 0 0 1 220 120"
                          fill="none"
                          stroke="var(--color-signal,#2456b8)"
                          strokeWidth="18"
                          strokeLinecap="round"
                          pathLength="100"
                          strokeDasharray={`${completion * 100} 100`}
                        />
                      ) : null}
                    </svg>
                    <div className="absolute inset-x-0 bottom-3">
                      <strong className="text-3xl">
                        {total == null ? "—" : (total > 0 ? "+" : "") + n(total) + " kg"}
                      </strong>
                      <p className="mt-1 text-xs text-fg-muted">
                        {total == null
                          ? "No weight recorded"
                          : total < 0
                            ? "Total weight lost"
                            : "Total weight gained"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      ["Starting weight", start],
                      ["Current weight", weight],
                      ["Goal weight", goal],
                    ].map(([label, v]) => (
                      <div key={String(label)}>
                        <p className="text-[10px] text-fg-subtle">{label}</p>
                        <strong className="mt-2 block text-xl">
                          {v == null ? "—" : n(Number(v))}
                          <span className="text-xs"> {v != null ? "kg" : ""}</span>
                        </strong>
                      </div>
                    ))}
                  </div>
                  {goal == null ? (
                    <p className="mt-3 text-xs text-fg-subtle">
                      No goal weight set in the client's profile.
                    </p>
                  ) : null}
                </section>
                <section className={card + " flex items-center gap-3 p-4"}>
                  <span className="rounded-full bg-selected p-3 text-signal-text">
                    <IconTrendingUp className="size-5" />
                  </span>
                  <div>
                    <p className="text-[10px] text-fg-subtle">{data.clientName}'s goal</p>
                    <strong className="text-sm">
                      {data.goal?.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) ??
                        "No goal set"}
                    </strong>
                  </div>
                </section>
              </div>
            </>
          ) : null}
          <ProgressPhotos checkIns={data.progressEntries ?? data.checkIns} onImage={setImage} />
          <div className="space-y-5">
            {current ? (
              <section className={card + " p-5"}>
                <h3 className="mb-6 text-sm font-semibold">Average Rating</h3>
                <RatingChart checkIns={data.progressEntries ?? data.checkIns} />
              </section>
            ) : null}
            <StepsProgress scope={clientId} load={load} saveGoal={goalSave} />
          </div>
        </div>
        <DevelopmentNutrition
          studioId={studioId}
          clientId={clientId}
          clientName={data.clientName}
        />
        <BodyProgress
          studioId={studioId}
          clientId={clientId}
          clientName={data.clientName}
          weightGoal={data.weight.goal}
        />
        <DevelopmentTraining studioId={studioId} clientId={clientId} />
      </div>
      <Dialog open={!!image} onOpenChange={() => setImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">Progress photo</DialogTitle>
          {image ? (
            <img src={image} alt="Progress" className="max-h-[80dvh] w-full object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
function RatingChart({ checkIns }: { checkIns: CheckIn[] }) {
  const gradient = useId();
  const points = checkIns.toReversed().flatMap((c) => {
    const v = average(c);
    return v == null ? [] : [{ date: c.completedAt ?? c.dueOn, value: v }];
  });
  if (!points.length)
    return <p className="py-12 text-center text-sm text-fg-muted">No ratings recorded yet.</p>;
  const x = (i: number) => (points.length === 1 ? 150 : 15 + (i / (points.length - 1)) * 270),
    y = (v: number) => 100 - (v / 5) * 80;
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  return (
    <>
      <svg
        viewBox="0 0 300 120"
        className="w-full"
        role="img"
        aria-label="Average check-in ratings over time"
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal,#2456b8)" stopOpacity=".16" />
            <stop offset="100%" stopColor="var(--color-signal,#2456b8)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${x(0)},100 ${line} ${x(points.length - 1)},100`}
          fill={`url(#${gradient})`}
        />
        <line x1="15" y1="20" x2="285" y2="20" stroke="#eee" />
        <line x1="15" y1="100" x2="285" y2="100" stroke="#eee" />
        <polyline points={line} fill="none" stroke="var(--color-signal,#2456b8)" strokeWidth="2" />
        {points.map((p, i) => (
          <g key={i}>
            <title>
              {date(p.date)}: {p.value.toFixed(2)}/5
            </title>
            <circle cx={x(i)} cy={y(p.value)} r="3" fill="var(--color-signal,#2456b8)" />
            {i === 0 || i === points.length - 1 ? (
              <text
                x={x(i)}
                y={y(p.value) - 8}
                textAnchor="middle"
                fontSize="8"
                fill="currentColor"
              >
                {p.value.toFixed(2)}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-fg-muted">
        <span>{date(points[0]!.date)}</span>
        <span>{date(points.at(-1)!.date)}</span>
      </div>
    </>
  );
}
function ProgressPhotos({
  checkIns,
  onImage,
}: {
  checkIns: CheckIn[];
  onImage: (s: string) => void;
}) {
  const controlsId = useId();
  const [compare, setCompare] = useState(false),
    [angle, setAngle] = useState("photo_front"),
    [before, setBefore] = useState(""),
    [after, setAfter] = useState(""),
    [weight, setWeight] = useState(true),
    [showDate, setShowDate] = useState(true),
    [labels, setLabels] = useState(true);
  const photoChecks = checkIns.filter((c) => c.answers.some((a) => a.imageUrl));
  const options = photoChecks.filter((c) => value(c, angle)?.imageUrl);
  const left = options.find((c) => c.id === before) ?? options.at(-1),
    right = options.find((c) => c.id === after) ?? options[0];
  function picker(v: string, change: (v: string) => void) {
    return (
      <Select value={v} onValueChange={change}>
        <SelectTrigger className="mt-2 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {date(c.completedAt ?? c.dueOn)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  return (
    <section className={card + " min-w-0 p-5"}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Progress Photos</h3>
        <div className="flex rounded-xl bg-panel p-1">
          {["Overview", "Comparison"].map((label, i) => (
            <button
              type="button"
              key={label}
              onClick={() => setCompare(!!i)}
              className={
                "rounded-lg px-3 py-1.5 text-xs " +
                (compare === !!i ? "bg-surface font-medium shadow-sm" : "text-fg-muted")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {!photoChecks.length ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-fg-muted">
          <Camera className="size-7" />
          <p>No progress photos available</p>
        </div>
      ) : compare ? (
        <div className="grid gap-4 sm:grid-cols-[140px_1fr_1fr]">
          <div>
            <div className="rounded-xl bg-panel p-1">
              {[
                ["photo_side", "Side Photo"],
                ["photo_back", "Back Photo"],
                ["photo_front", "Front Photo"],
              ].map(([v, label]) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setAngle(v!)}
                  className={
                    "block w-full rounded-lg py-2 text-xs " +
                    (angle === v ? "bg-surface shadow-sm" : "text-fg-muted")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            {[
              ["Weight", weight, setWeight],
              ["Date", showDate, setShowDate],
              ["Before/After text", labels, setLabels],
            ].map(([label, on, set]) => (
              <label
                key={String(label)}
                htmlFor={controlsId + String(label)}
                className="mt-2 flex items-center gap-2 rounded-lg bg-panel p-2 text-xs"
              >
                <Switch
                  id={controlsId + String(label)}
                  aria-label={String(label)}
                  checked={Boolean(on)}
                  onCheckedChange={(checked) => (set as (v: boolean) => void)(checked)}
                />
                {label as string}
              </label>
            ))}
          </div>
          {[
            [left, "Before", setBefore],
            [right, "After", setAfter],
          ].map(([raw, label, change]) => {
            const c = raw as CheckIn | undefined,
              url = value(c, angle)?.imageUrl;
            return (
              <div key={String(label)} className="min-w-0">
                <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-panel">
                  {url ? (
                    <button
                      type="button"
                      className="relative size-full"
                      onClick={() => onImage(url)}
                    >
                      <Image
                        src={url}
                        alt={String(label)}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                      <span className="absolute right-2 bottom-2 rounded-full bg-black/50 p-1.5 text-white">
                        <IconArrowsMaximize className="size-3" />
                      </span>
                    </button>
                  ) : (
                    <p className="p-4 text-sm text-fg-muted">No photo for this angle</p>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap justify-between gap-1 bg-gradient-to-b from-black/40 p-2 text-white">
                    {labels ? <strong>{label as string}</strong> : null}
                    {showDate && c ? (
                      <span className="text-[10px]">{date(c.completedAt ?? c.dueOn)}</span>
                    ) : null}
                  </div>
                  {weight && c && value(c, "weight")?.numberValue != null ? (
                    <strong className="pointer-events-none absolute bottom-4 inset-x-0 text-center text-3xl text-white drop-shadow">
                      {value(c, "weight")?.numberValue}kg
                    </strong>
                  ) : null}
                </div>
                {c ? picker(c.id, change as (v: string) => void) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-h-[580px] space-y-5 overflow-y-auto pr-1">
          {photoChecks.map((c) => (
            <div key={c.id}>
              <p className="mb-2 text-xs text-fg-muted">{date(c.completedAt ?? c.dueOn)}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["photo_front", "Front Photo"],
                  ["photo_side", "Side Photo"],
                  ["photo_back", "Back Photo"],
                ].map(([code, label]) => {
                  const url = value(c, code!)?.imageUrl;
                  return (
                    <button
                      type="button"
                      key={code}
                      disabled={!url}
                      onClick={() => url && onImage(url)}
                      className="relative aspect-[3/4] overflow-hidden rounded-lg bg-panel"
                    >
                      {url ? (
                        <Image
                          src={url}
                          alt={label ?? ""}
                          fill
                          sizes="33vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs text-fg-muted">No photo</span>
                      )}
                      <span className="absolute top-1 left-1 rounded bg-black/30 px-1 text-[10px] text-white">
                        {label}
                      </span>
                      {url ? (
                        <IconArrowsMaximize className="absolute right-1 top-1 size-5 rounded-full bg-black/40 p-1 text-white" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
