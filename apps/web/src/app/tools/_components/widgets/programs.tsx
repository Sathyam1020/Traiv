"use client";

import {
  type Area,
  buildPlan,
  type Equipment,
  type Experience,
  exerciseSwap,
  type PlanGoal,
  type Severity,
  SWAP_EXERCISES,
  type SwapExercise,
  type SwapGoal,
} from "@traiv/calculators/programs";
import { useState } from "react";
import { Headline, Note, Pills, ResultPanel, Select, ToolForm, ToolLayout, Warning } from "../kit";

export function PlanBuilderWidget() {
  const [days, setDays] = useState("4");
  const [goal, setGoal] = useState<PlanGoal>("muscle");
  const [exp, setExp] = useState<Experience>("intermediate");
  const r = buildPlan(Number(days), goal, exp);
  return (
    <ToolLayout
      form={
        <ToolForm label="Workout plan builder">
          <Select
            label="Training days a week"
            value={days}
            onChange={setDays}
            options={["2", "3", "4", "5", "6"].map((d) => ({ value: d, label: `${d} days` }))}
          />
          <Select
            label="Primary goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "muscle", label: "Build muscle" },
              { value: "strength", label: "Get stronger" },
              { value: "fitness", label: "General fitness" },
              { value: "fatloss", label: "Fat loss" },
            ]}
          />
          <Select
            label="Experience"
            value={exp}
            onChange={setExp}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your weekly plan">
          <Headline
            label="Your split"
            value={r.splitName}
            note={`${r.weeklySets} working sets a week · rest ${r.rest}`}
          />
          <ol className="flex flex-col gap-3">
            {r.plan.map((d) => (
              <li key={d.day} className="rounded-control border border-line bg-surface p-4">
                <p className="text-caption font-medium text-fg-subtle">
                  Day {d.day} · {d.title}
                </p>
                <ul className="mt-2 flex flex-col gap-1 text-body-sm tabular-nums">
                  {d.exercises.map((e) => (
                    <li key={e.name} className="flex justify-between gap-3">
                      <span className={e.main ? "font-medium" : ""}>{e.name}</span>
                      <span className="shrink-0 text-fg-muted">
                        {e.sets} × {e.reps}
                      </span>
                    </li>
                  ))}
                </ul>
                {d.finisher ? (
                  <p className="mt-2 text-caption text-fg-muted">Finish with {d.finisher}.</p>
                ) : null}
              </li>
            ))}
          </ol>
          <Note>
            Add weight or reps each week while form stays solid. Take a lighter week every four to
            six weeks.
          </Note>
        </ResultPanel>
      }
    />
  );
}

const AREAS: { value: Area; label: string }[] = [
  { value: "shoulder", label: "Shoulder" },
  { value: "lowerback", label: "Lower back" },
  { value: "knee", label: "Knee" },
  { value: "elbow", label: "Elbow" },
  { value: "wrist", label: "Wrist" },
  { value: "hip", label: "Hip" },
];

export function InjurySwapWidget() {
  const [area, setArea] = useState<Area>("shoulder");
  const [severity, setSeverity] = useState<Severity>("twinge");
  const [exercise, setExercise] = useState<SwapExercise>("Barbell bench");
  const [goal, setGoal] = useState<SwapGoal>("hypertrophy");
  const [equipment, setEquipment] = useState<Equipment>("gym");
  const r = exerciseSwap({ area, severity, exercise, goal, equipment });
  return (
    <ToolLayout
      form={
        <ToolForm label="Injury exercise swap">
          <Pills label="Where it hurts" value={area} onChange={setArea} options={AREAS} />
          <Pills
            label="How it feels"
            value={severity}
            onChange={setSeverity}
            options={[
              { value: "twinge", label: "Twinge, fine under load" },
              { value: "painful", label: "Painful under load" },
              { value: "cannot", label: "Cannot load at all" },
            ]}
          />
          <Select
            label="Exercise to replace"
            value={exercise}
            onChange={setExercise}
            options={SWAP_EXERCISES.map((e) => ({ value: e, label: e }))}
          />
          <Pills
            label="Training goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "strength", label: "Strength" },
              { value: "hypertrophy", label: "Hypertrophy" },
              { value: "general", label: "General" },
            ]}
          />
          <Pills
            label="Equipment"
            value={equipment}
            onChange={setEquipment}
            options={[
              { value: "gym", label: "Full gym" },
              { value: "dumbbells", label: "Dumbbells" },
              { value: "cables", label: "Cables / machines" },
              { value: "bands", label: "Bands" },
              { value: "bodyweight", label: "Bodyweight" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your swaps">
          {r.swaps.length === 0 ? (
            <Warning>{r.message}</Warning>
          ) : (
            <>
              <Headline
                label={`Instead of ${exercise.toLowerCase()}`}
                value={r.swaps[0]?.name ?? ""}
                note={r.dose ? r.dose : undefined}
              />
              <ol className="flex flex-col gap-2">
                {r.swaps.map((s) => (
                  <li key={s.name} className="rounded-control border border-line bg-surface p-4">
                    <p className="text-body-sm font-medium">{s.name}</p>
                    <p className="mt-1 text-caption leading-relaxed text-fg-muted">{s.why}</p>
                  </li>
                ))}
              </ol>
              <div>
                <p className="text-caption font-medium text-fg-subtle">
                  Before trying an alternative
                </p>
                <ul className="mt-2 flex flex-col gap-1 text-body-sm">
                  {r.ramp.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              {r.refer ? (
                <Warning>{r.message}</Warning>
              ) : (
                <Note>{r.message} Stop and get it checked if pain rises the next day.</Note>
              )}
            </>
          )}
        </ResultPanel>
      }
    />
  );
}
