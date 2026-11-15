"use client";

import { energy, resolveBody } from "@traiv/calculators/energy";
import { bmr } from "@traiv/nutrition/bmr";
import type { ActivityLevel } from "@traiv/nutrition/types";
import { useState } from "react";
import {
  ActivityField,
  BODY_ERROR,
  ErrorText,
  fmt,
  Headline,
  Note,
  ResultPanel,
  Stats,
  ToolForm,
  ToolLayout,
  useBody,
} from "../kit";

/** BMR: researched defaults are imperial and male; sex is a dropdown on that page. */
export function BmrWidget() {
  const body = useBody();
  const compute = () => {
    const b = resolveBody(body.input);
    return b.ok ? ({ ok: true, value: bmr(b.value) } as const) : b;
  };
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="BMR calculator"
          submitLabel="Calculate BMR"
          onSubmit={() => setResult(compute())}
        >
          {body.unitsField({ imperial: "Imperial", metric: "Metric" })}
          {body.sexField("select")}
          {body.ageField}
          {body.heightField}
          {body.weightField()}
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label="Your basal metabolic rate"
                value={fmt(result.value)}
                unit="kcal/day"
                note="Calories burned at complete rest, before any movement, training or digestion."
              />
              <Stats
                items={[
                  { label: "Per hour at rest", value: `${fmt(result.value / 24)} kcal` },
                  { label: "Desk day (× 1.2)", value: `${fmt(result.value * 1.2)} kcal` },
                  {
                    label: "Training 3 to 5 days (× 1.55)",
                    value: `${fmt(result.value * 1.55)} kcal`,
                  },
                ]}
              />
              <Note>
                Mifflin-St Jeor equation. BMR is not a calorie target: eating at it would leave no
                energy for the day itself. Use the TDEE or maintenance calculator for that.
              </Note>
            </>
          ) : (
            <ErrorText>{BODY_ERROR[result.error]}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/** Maintenance: researched defaults are male, imperial, moderate. */
export function MaintenanceWidget() {
  const body = useBody();
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const compute = () => energy({ ...body.input, activity });
  const [result, setResult] = useState(compute);

  return (
    <ToolLayout
      form={
        <ToolForm
          label="Maintenance calorie calculator"
          submitLabel="Calculate maintenance calories"
          onSubmit={() => setResult(compute())}
        >
          {body.sexField("pills")}
          {body.unitsField({ imperial: "Imperial (lb, ft)", metric: "Metric (kg, cm)" })}
          {body.ageField}
          {body.weightField()}
          {body.heightField}
          <ActivityField value={activity} onChange={setActivity} />
        </ToolForm>
      }
      result={
        <ResultPanel>
          {result.ok ? (
            <>
              <Headline
                label="Your maintenance calories"
                value={fmt(result.value.maintain)}
                unit="kcal/day"
                note={`BMR ${fmt(result.value.bmr)} kcal × activity factor ${result.value.factor}`}
              />
              <Stats
                items={[
                  {
                    label: "To lose about 0.5 kg (1 lb) a week",
                    value: `${fmt(result.value.cut)} kcal`,
                  },
                  { label: "To gain slowly", value: `${fmt(result.value.bulk)} kcal` },
                ]}
              />
              <Note>
                Hold this intake for two to three weeks. If the weekly average weight barely moves,
                this is your real maintenance.
              </Note>
            </>
          ) : (
            <ErrorText>{BODY_ERROR[result.error]}</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}
