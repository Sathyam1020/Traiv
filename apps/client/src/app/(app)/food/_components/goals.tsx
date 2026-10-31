"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Trash } from "@traiv/ui/icons";
import { foodApi, type Nutrients } from "@/lib/api/food";
import { useIntake } from "@/lib/query";
import { Panel, Field, ErrorText, card } from "./common";
import { useAction, Choice } from "./actions";
export function Goals({
  studio,
  date,
  target,
  onClose,
  onSaved,
}: {
  studio: string;
  date: string;
  target: Nutrients | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const api = foodApi(studio),
    action = useAction(),
    qc = useQueryClient();
  const profile = useIntake(studio);
  const query = useQuery({
    queryKey: ["food-goals", studio],
    queryFn: () => api.get<(Nutrients & { id: string; day: string })[]>("/goals"),
  });
  const [values, setValues] = useState<Nutrients>(
      target ?? { kcal: 2000, proteinG: 150, carbsG: 200, fatG: 67 },
    ),
    [day, setDay] = useState("default"),
    [age, setAge] = useState(""),
    [height, setHeight] = useState(""),
    [weight, setWeight] = useState(""),
    [sex, setSex] = useState("undisclosed"),
    [goal, setGoal] = useState("maintain"),
    [activity, setActivity] = useState("moderate"),
    [diet, setDiet] = useState("non_vegetarian"),
    [health, setHealth] = useState<string[]>([]),
    [review, setReview] = useState<string[]>([]),
    [notice, setNotice] = useState("");
  return (
    <Panel
      title="Nutrition targets"
      description="Set daily, weekly, or date-specific targets."
      onClose={onClose}
    >
      <div className="space-y-5">
        <details className={card}>
          <summary className="cursor-pointer font-semibold">Calorie calculator</summary>
          {profile.data?.intake ? (
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => {
                const i = profile.data?.intake;
                if (!i) return;
                setAge(i.birthYear ? String(new Date().getFullYear() - i.birthYear) : "");
                setHeight(String(i.heightCm ?? ""));
                setWeight(String(profile.data?.weightKg ?? ""));
                setSex(i.sex ?? "undisclosed");
                setGoal(i.goal ?? "maintain");
                setActivity(i.dailyActivity ?? "moderate");
                setDiet(i.diet ?? "non_vegetarian");
                setHealth(i.healthFlags ?? []);
              }}
            >
              Use my profile
            </Button>
          ) : null}
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Age", age, setAge],
                ["Height (cm)", height, setHeight],
                ["Weight (kg)", weight, setWeight],
              ].map(([label, value, setter]) => (
                <Field key={String(label)} label={String(label)}>
                  <Input
                    type="number"
                    value={String(value)}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                  />
                </Field>
              ))}
            </div>
            <Choice
              label="Sex"
              value={sex}
              options={["male", "female", "undisclosed"]}
              onChange={setSex}
            />
            <Choice
              label="Goal"
              value={goal}
              options={[
                "lose_fat",
                "build_muscle",
                "get_stronger",
                "maintain",
                "improve_fitness",
                "general_health",
              ]}
              onChange={setGoal}
            />
            <Choice
              label="Activity"
              value={activity}
              options={["sedentary", "light", "moderate", "very", "extra"]}
              onChange={setActivity}
            />
            <Choice
              label="Diet"
              value={diet}
              options={["vegetarian", "non_vegetarian", "eggetarian", "vegan", "jain"]}
              onChange={setDiet}
            />
            <fieldset className="space-y-2">
              <legend className="mb-2 text-body-sm">Health considerations</legend>
              {["diabetes", "blood_pressure", "thyroid", "pcos", "pregnancy"].map((v) => (
                <label key={v} className="flex gap-2 text-body-sm">
                  <input
                    type="checkbox"
                    checked={health.includes(v)}
                    onChange={(e) =>
                      setHealth(e.target.checked ? [...health, v] : health.filter((h) => h !== v))
                    }
                  />
                  {v.replaceAll("_", " ")}
                </label>
              ))}
            </fieldset>
            <Button
              disabled={action.busy || !age || !height || !weight}
              onClick={() =>
                action.run(async () => {
                  const result = await api.post<{
                    kcal?: number;
                    protein?: number;
                    carbs?: number;
                    fat?: number;
                    review: string[];
                  }>("/calculate", {
                    age: Number(age),
                    heightCm: Number(height),
                    weightKg: Number(weight),
                    sex,
                    goal,
                    activity,
                    diet,
                    health,
                  });
                  setReview(result.review);
                  if (
                    result.kcal !== undefined &&
                    result.protein !== undefined &&
                    result.carbs !== undefined &&
                    result.fat !== undefined
                  ) {
                    setValues({
                      kcal: result.kcal,
                      proteinG: result.protein,
                      carbsG: result.carbs,
                      fatG: result.fat,
                    });
                    setNotice("Calculated. Review the targets below before saving.");
                  }
                })
              }
            >
              Calculate
            </Button>
            {review.length ? (
              <p className="text-body-sm text-fg-muted">
                Your coach needs to review this calculation:{" "}
                {review.map((r) => r.replaceAll("_", " ")).join(", ")}. No target has been applied.
              </p>
            ) : null}
          </div>
        </details>
        <Choice
          label="Apply targets to"
          value={day}
          options={["default", ...Array.from({ length: 7 }, (_, i) => `weekday:${i}`), date]}
          onChange={setDay}
        />
        <p className="text-caption text-fg-muted">
          Weekly targets apply on that weekday. A specific date overrides weekly and daily targets.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(values).map(([key, value]) => (
            <Field
              key={key}
              label={key === "kcal" ? "Calories (kcal)" : `${key.replace("G", "")} (g)`}
            >
              <Input
                type="number"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValues({ ...values, [key]: Number(e.target.value) })}
              />
            </Field>
          ))}
        </div>
        <ErrorText error={action.error ?? query.error} />
        {notice ? (
          <p role="status" className="text-body-sm text-fg-muted">
            {notice}
          </p>
        ) : null}
        <Button
          className="w-full"
          disabled={action.busy || Boolean(review.length)}
          onClick={() =>
            action.run(async () => {
              await api.put("/goals", { ...values, day });
              await qc.invalidateQueries({ queryKey: ["food-goals", studio] });
              onSaved();
              setNotice("Targets saved.");
            })
          }
        >
          Save targets
        </Button>
        {query.data?.map((g) => (
          <div
            className="flex items-center justify-between gap-3 border-t border-line py-3"
            key={g.id}
          >
            <button
              type="button"
              className="text-left text-body-sm"
              onClick={() => {
                setDay(g.day);
                setValues({ kcal: g.kcal, proteinG: g.proteinG, carbsG: g.carbsG, fatG: g.fatG });
              }}
            >
              {g.day} · {g.kcal} kcal
            </button>
            <Button
              aria-label={`Remove ${g.day} targets`}
              variant="ghost"
              disabled={action.busy}
              onClick={() =>
                action.run(async () => {
                  await api.delete(`/goals/${g.id}`);
                  await qc.invalidateQueries({ queryKey: ["food-goals", studio] });
                  onSaved();
                })
              }
            >
              <Trash className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
