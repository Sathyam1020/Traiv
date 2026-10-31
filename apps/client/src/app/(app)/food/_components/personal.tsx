"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Plus, Trash } from "@traiv/ui/icons";
import { foodApi, type Nutrients, type FoodItem } from "@/lib/api/food";
import { Panel, Field, ErrorText, card } from "./common";
import { useAction, Choice } from "./actions";
import { FoodSearch } from "./search";
type PersonalPlan = {
  id: string;
  name: string;
  targets: Nutrients | null;
  meals: { name: string; percentage: number; options: FoodItem[] }[];
};
export function PersonalPlans({
  studio,
  target,
  onClose,
  onSelect,
}: {
  studio: string;
  target: Nutrients | null;
  onClose: () => void;
  onSelect: (item: FoodItem) => void;
}) {
  const api = foodApi(studio),
    action = useAction(),
    qc = useQueryClient();
  const query = useQuery({
    queryKey: ["food-personal", studio],
    queryFn: () => api.get<PersonalPlan[]>("/personal-plans"),
  });
  const [edit, setEdit] = useState<PersonalPlan | null>(null),
    [source, setSource] = useState("current"),
    [searchMeal, setSearchMeal] = useState<number | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["food-personal", studio] });
  return (
    <Panel
      title="My meal plans"
      description="Your personal meal structure. Your coach’s assigned plans stay separate."
      onClose={onClose}
    >
      <Button
        className="mb-4 w-full"
        onClick={() => {
          setSource(target ? "current" : "none");
          setEdit({
            id: crypto.randomUUID(),
            name: "My meal plan",
            targets: target,
            meals: [
              { name: "Breakfast", percentage: 25, options: [] },
              { name: "Lunch", percentage: 35, options: [] },
              { name: "Dinner", percentage: 40, options: [] },
            ],
          });
        }}
      >
        <Plus className="size-4" />
        Create plan
      </Button>
      <ErrorText error={query.error ?? action.error} />
      <div className="space-y-3">
        {query.data?.map((p) => (
          <article key={p.id} className={card}>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="mt-1 text-caption text-fg-muted">
              {p.targets ? `${p.targets.kcal} kcal` : "No calorie target"}
            </p>
            {p.meals.map((m, i) => (
              <div key={i} className="mt-3 flex justify-between text-body-sm">
                <span>{m.name}</span>
                <span>
                  {p.targets
                    ? `${Math.round((p.targets.kcal * m.percentage) / 100)} kcal`
                    : `${m.percentage}%`}
                </span>
              </div>
            ))}
            <div className="mt-4 space-y-3">
              {p.meals.map((meal, index) => (
                <section key={index}>
                  <p className="text-body-sm font-semibold">{meal.name}</p>
                  <div className="mt-2 flex gap-3 overflow-x-auto">
                    {(meal.options ?? []).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="w-40 shrink-0 rounded-control border border-line p-2 text-left"
                        onClick={() =>
                          action.run(async () =>
                            onSelect(
                              await api.get<FoodItem>(
                                `/items/personal/${option.id}?planId=${p.id}`,
                              ),
                            ),
                          )
                        }
                      >
                        {option.imageUrl ? (
                          <img
                            src={option.imageUrl}
                            alt=""
                            className="aspect-video w-full rounded-control object-cover"
                          />
                        ) : null}
                        <p className="mt-2 text-caption font-medium">{option.name}</p>
                        <p className="text-caption text-fg-muted">{option.kcal} kcal</p>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSource(p.targets ? "custom" : "none");
                  setEdit(p);
                }}
              >
                Edit
              </Button>
              <Button
                aria-label={`Delete ${p.name}`}
                variant="ghost"
                disabled={action.busy}
                onClick={() =>
                  action.run(async () => {
                    await api.delete(`/personal-plans/${p.id}`);
                    await refresh();
                  })
                }
              >
                <Trash className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
      {edit ? (
        <Panel title="Personal meal plan" onClose={() => setEdit(null)}>
          <div className="space-y-4">
            <Field label="Name">
              <Input
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              />
            </Field>
            <Choice
              label="Nutrition targets"
              value={source}
              options={target ? ["current", "custom", "none"] : ["custom", "none"]}
              onChange={(v) => {
                setSource(v);
                setEdit({
                  ...edit,
                  targets:
                    v === "none"
                      ? null
                      : v === "current"
                        ? target
                        : (edit.targets ?? { kcal: 2000, proteinG: 150, carbsG: 200, fatG: 67 }),
                });
              }}
            />
            {source === "custom" && edit.targets ? (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(edit.targets).map(([key, value]) => (
                  <Field key={key} label={key}>
                    <Input
                      type="number"
                      min="0"
                      value={value}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          targets: {
                            ...(edit.targets ?? { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }),
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Field>
                ))}
              </div>
            ) : null}
            <h3 className="font-semibold">Meals</h3>
            {edit.meals.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  aria-label={`Meal ${i + 1} name`}
                  value={m.name}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      meals: edit.meals.map((v, j) =>
                        i === j ? { ...v, name: e.target.value } : v,
                      ),
                    })
                  }
                />
                <Input
                  aria-label={`${m.name} percent`}
                  className="w-20"
                  type="number"
                  min="0"
                  max="100"
                  value={m.percentage}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      meals: edit.meals.map((v, j) =>
                        i === j ? { ...v, percentage: Number(e.target.value) } : v,
                      ),
                    })
                  }
                />
                <span>%</span>
                <Button
                  variant="ghost"
                  aria-label={`Remove ${m.name}`}
                  onClick={() => setEdit({ ...edit, meals: edit.meals.filter((_, j) => j !== i) })}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            ))}
            <p className="text-caption text-fg-muted">
              Total: {edit.meals.reduce((n, m) => n + m.percentage, 0)}%
            </p>
            <div className="space-y-4">
              {edit.meals.map((meal, index) => (
                <section className={card} key={index}>
                  <h4 className="font-semibold">{meal.name} recipes</h4>
                  {(meal.options ?? []).map((option, oi) => (
                    <div
                      key={`${option.id}:${oi}`}
                      className="mt-2 flex items-center justify-between gap-2 text-body-sm"
                    >
                      <span>{option.name}</span>
                      <Button
                        variant="ghost"
                        aria-label={`Remove ${option.name}`}
                        onClick={() =>
                          setEdit({
                            ...edit,
                            meals: edit.meals.map((m, i) =>
                              i === index
                                ? { ...m, options: (m.options ?? []).filter((_, j) => j !== oi) }
                                : m,
                            ),
                          })
                        }
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="mt-3 w-full"
                    variant="outline"
                    disabled={meal.percentage <= 0}
                    onClick={() => setSearchMeal(index)}
                  >
                    <Plus className="size-4" />
                    Choose recipe
                  </Button>
                </section>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setEdit({
                  ...edit,
                  meals: [...edit.meals, { name: "Snack", percentage: 0, options: [] }],
                })
              }
            >
              <Plus className="size-4" />
              Add meal
            </Button>
            <ErrorText error={action.error} />
            <Button
              className="w-full"
              disabled={
                action.busy ||
                !edit.name.trim() ||
                Math.abs(edit.meals.reduce((n, m) => n + m.percentage, 0) - 100) > 0.01
              }
              onClick={() =>
                action.run(async () => {
                  await api.put("/personal-plans", edit);
                  await refresh();
                  setEdit(null);
                })
              }
            >
              Save plan
            </Button>
          </div>
        </Panel>
      ) : null}
      {searchMeal !== null && edit ? (
        <FoodSearch
          studio={studio}
          recipesOnly
          onClose={() => setSearchMeal(null)}
          onSelect={(item) => {
            setEdit({
              ...edit,
              meals: edit.meals.map((m, i) =>
                i === searchMeal ? { ...m, options: [...(m.options ?? []), item] } : m,
              ),
            });
            setSearchMeal(null);
          }}
        />
      ) : null}
    </Panel>
  );
}
