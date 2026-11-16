"use client";

import type { BodyError, BodyInput, Sex } from "@traiv/calculators/energy";
import type { MacroResult } from "@traiv/calculators/macros";
import {
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  type UnitSystem,
} from "@traiv/calculators/units";
import type { ActivityLevel } from "@traiv/nutrition/types";
import { type FormEvent, type ReactNode, useState } from "react";
import { Choice, Field, FieldGroup, NumberField } from "@/components/tool-controls";
import { Segmented } from "./segmented";
import { useTool } from "./tool-context";
import { trackCalculateSettled } from "./track";

/**
 * The shared building blocks of the free-tool widgets: the form and result panels, the
 * body fields most nutrition tools ask for, stat cards and macro bars. Each widget keeps
 * its own maths and its own defaults; this file only keeps them looking and behaving alike.
 */

export type Num = number | "";
export const n = (v: Num) => (v === "" ? Number.NaN : v);

/** Two panels side by side on wide screens: the form, then the result. */
export function ToolLayout({ form, result }: { form: ReactNode; result: ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {form}
      {result}
    </div>
  );
}

export function ToolForm({
  label,
  submitLabel,
  onSubmit,
  children,
}: {
  label: string;
  submitLabel?: string;
  onSubmit?: () => void;
  children: ReactNode;
}) {
  const tool = useTool();
  return (
    <form
      aria-label={label}
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit?.();
        if (!tool.embedded) trackCalculateSettled(tool.slug, tool.group, tool.kind, 0);
      }}
      className="flex min-w-0 flex-col gap-5 rounded-surface border border-line bg-surface p-5 sm:p-7"
    >
      {children}
      {submitLabel ? (
        <button
          type="submit"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control bg-brand px-5 py-2.5 text-body-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
        >
          {submitLabel}
        </button>
      ) : null}
    </form>
  );
}

export function ResultPanel({
  label = "Your result",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-live="polite"
      aria-label={label}
      className="flex min-w-0 flex-col gap-5 rounded-surface border border-line bg-sunken p-5 sm:p-7"
    >
      {children}
    </section>
  );
}

export function Headline({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  note?: ReactNode;
}) {
  return (
    <div>
      <p className="text-caption font-medium text-fg-muted">{label}</p>
      <p className="mt-2 font-display text-display font-medium tabular-nums">
        {value} {unit ? <span className="text-lead text-fg-muted">{unit}</span> : null}
      </p>
      {note ? <p className="mt-2 text-body-sm text-fg-muted">{note}</p> : null}
    </div>
  );
}

export function Stats({ items }: { items: { label: string; value: string; note?: string }[] }) {
  const cols =
    items.length >= 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : items.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";
  return (
    <ul className={`grid gap-3 ${cols}`}>
      {items.map((c) => (
        <li key={c.label} className="min-w-0 rounded-control border border-line bg-surface p-4">
          <p className="text-caption font-medium text-fg-subtle">{c.label}</p>
          <p className="mt-1 font-display text-lead font-medium break-words tabular-nums">
            {c.value}
          </p>
          {c.note ? <p className="text-caption text-fg-muted">{c.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-caption leading-relaxed text-fg-muted">{children}</p>;
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-control border border-line-strong bg-surface p-3 text-body-sm text-fg">
      {children}
    </p>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-body-sm text-fg">
      {children}
    </p>
  );
}

export const fmt = (x: number, digits = 0) =>
  x.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function MacroBars({ m }: { m: MacroResult }) {
  const rows = [
    { label: "Protein", line: m.protein, tone: "bg-brand" },
    { label: "Carbs", line: m.carbs, tone: "bg-fg-muted" },
    { label: "Fat", line: m.fat, tone: "bg-fg" },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {rows.map(({ label, line, tone }) => (
        <li key={label} className="rounded-control border border-line bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-body-sm font-medium">{label}</span>
            <span className="font-display text-subheading font-semibold tabular-nums">
              {fmt(line.grams)} g
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
            <div
              className={`h-full rounded-full ${tone}`}
              style={{ width: `${Math.round(line.share * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-caption text-fg-muted tabular-nums">
            <span>{fmt(line.kcal)} kcal</span>
            <span>{Math.round(line.share * 100)}%</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary: desk job, little exercise" },
  { value: "light", label: "Light: exercise 1 to 3 days a week" },
  { value: "moderate", label: "Moderate: exercise 3 to 5 days a week" },
  { value: "very", label: "Very active: exercise 6 or 7 days a week" },
  { value: "extra", label: "Extra active: hard training or a physical job" },
];

export function ActivityField({
  value,
  onChange,
}: {
  value: ActivityLevel;
  onChange: (v: ActivityLevel) => void;
}) {
  return (
    <Field label="Activity level">
      {(id) => <Choice id={id} value={value} onChange={onChange} options={ACTIVITY_OPTIONS} />}
    </Field>
  );
}

export const BODY_ERROR: Record<BodyError, string> = {
  age: "Enter an age between 14 and 100.",
  height: "Enter a height between 3 ft and 8 ft 11 in (100 to 250 cm).",
  weight: "Enter a weight between 30 and 600 lb (14 to 272 kg).",
};

type BodyDefaults = {
  units?: UnitSystem;
  sex?: Sex;
  age?: Num;
  ft?: Num;
  inch?: Num;
  cm?: Num;
  weight?: Num;
};

/**
 * Units, sex, age, height and weight: state plus fields, with unit switching that carries
 * the same body across rather than resetting it. `sexAs` picks the control the research
 * shows for that tool (pills or a dropdown).
 */
export function useBody(defaults: BodyDefaults = {}) {
  const [units, setUnitsRaw] = useState<UnitSystem>(defaults.units ?? "imperial");
  const [sex, setSex] = useState<Sex>(defaults.sex ?? "male");
  const [age, setAge] = useState<Num>(defaults.age ?? 30);
  const [ft, setFt] = useState<Num>(defaults.ft ?? 5);
  const [inch, setInch] = useState<Num>(defaults.inch ?? 10);
  const [cm, setCm] = useState<Num>(defaults.cm ?? 178);
  const [weight, setWeight] = useState<Num>(defaults.weight ?? 170);

  function setUnits(next: UnitSystem) {
    if (next === units) return;
    if (next === "metric") {
      if (ft !== "" && inch !== "") setCm(Math.round(feetInchesToCm(ft, inch)));
      if (weight !== "") setWeight(Math.round(lbToKg(weight) * 10) / 10);
    } else {
      if (cm !== "") {
        const fi = cmToFeetInches(cm);
        setFt(fi.feet);
        setInch(fi.inches);
      }
      if (weight !== "") setWeight(Math.round(kgToLb(weight)));
    }
    setUnitsRaw(next);
  }

  const input: BodyInput = {
    units,
    sex,
    age: n(age),
    heightFt: n(ft),
    heightIn: n(inch),
    heightCm: n(cm),
    weight: n(weight),
  };

  const unitsField = (
    labels: { imperial: string; metric: string } = {
      imperial: "Imperial (lb / ft)",
      metric: "Metric (kg / cm)",
    },
  ) => (
    <FieldGroup label="Units">
      <Segmented
        label="Units"
        value={units}
        onChange={setUnits}
        options={[
          { value: "imperial", label: labels.imperial },
          { value: "metric", label: labels.metric },
        ]}
      />
    </FieldGroup>
  );

  const sexField = (as: "pills" | "select" = "pills") =>
    as === "pills" ? (
      <FieldGroup label="Sex">
        <Segmented
          label="Sex"
          value={sex}
          onChange={setSex}
          stretch
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </FieldGroup>
    ) : (
      <Field label="Sex">
        {(id) => (
          <Choice
            id={id}
            value={sex}
            onChange={setSex}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        )}
      </Field>
    );

  const ageField = (
    <Field label="Age">
      {(id) => (
        <NumberField id={id} value={age} onChange={setAge} min={14} max={100} suffix="years" />
      )}
    </Field>
  );

  const heightField =
    units === "imperial" ? (
      <FieldGroup label="Height">
        <div className="grid grid-cols-2 gap-3">
          <HeightPart
            label="Height in feet"
            value={ft}
            onChange={setFt}
            min={3}
            max={8}
            suffix="ft"
          />
          <HeightPart
            label="Height in inches"
            value={inch}
            onChange={setInch}
            min={0}
            max={11}
            suffix="in"
          />
        </div>
      </FieldGroup>
    ) : (
      <Field label="Height">
        {(id) => (
          <NumberField id={id} value={cm} onChange={setCm} min={100} max={250} suffix="cm" />
        )}
      </Field>
    );

  const weightField = (label = "Weight") => (
    <Field label={label}>
      {(id) => (
        <NumberField
          id={id}
          value={weight}
          onChange={setWeight}
          min={units === "imperial" ? 30 : 14}
          max={units === "imperial" ? 600 : 272}
          suffix={units === "imperial" ? "lb" : "kg"}
        />
      )}
    </Field>
  );

  return { units, sex, input, unitsField, sexField, ageField, heightField, weightField };
}

function HeightPart(props: {
  label: string;
  value: Num;
  onChange: (v: Num) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <Field label={props.label}>
      {(id) => (
        <NumberField
          id={id}
          value={props.value}
          onChange={props.onChange}
          min={props.min}
          max={props.max}
          suffix={props.suffix}
        />
      )}
    </Field>
  );
}

/** A weight-unit pill pair (lb / kg) for tools that only ask for body weight. */
export function useWeightUnit(initial: "lb" | "kg" = "lb") {
  const [unit, setUnit] = useState<"lb" | "kg">(initial);
  return { unit, setUnit };
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  hint,
}: {
  label: string;
  value: Num;
  onChange: (v: Num) => void;
  min: number;
  max: number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <Field label={label} {...(hint ? { hint } : {})}>
      {(id) => (
        <NumberField
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          {...(suffix ? { suffix } : {})}
        />
      )}
    </Field>
  );
}

export function Pills<T extends string>({
  label,
  value,
  onChange,
  options,
  stretch,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  stretch?: boolean;
}) {
  return (
    <FieldGroup label={label}>
      <Segmented
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        {...(stretch ? { stretch } : {})}
      />
    </FieldGroup>
  );
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <Field label={label}>
      {(id) => <Choice id={id} value={value} onChange={onChange} options={options} />}
    </Field>
  );
}

export function dateLabel(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
