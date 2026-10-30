"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  optionConflicts,
  optionNutrition,
  planRange,
  planWarnings,
  readPlanDocument,
  slotTargets,
  type MealPlan,
  type PlanDocument,
  type PlanOption,
} from "@traiv/nutrition/meal-plans";
import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { ArrowLeft, Carbs, Fat, Pencil, Plus, Protein } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import { mealPlansApi } from "@/lib/api/meal-plans";
import { LibraryError, LibraryLoading, MICROS } from "../../_components/controls";
import { PlanOptionCard, PlanMealSheet } from "../_components/plan-option";
import { PlanSettingsSheet, settingsValid } from "../_components/plan-settings";
import { PlanRecipePicker } from "../_components/recipe-picker";

export default function MealPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const studioId = useActiveStudioId() ?? "";
  const query = useQuery({
    queryKey: ["mealplan", studioId, planId],
    queryFn: () => mealPlansApi.get(studioId, planId),
    enabled: Boolean(studioId),
    refetchOnWindowFocus: false,
  });
  if (query.isPending)
    return (
      <Page>
        <LibraryLoading />
      </Page>
    );
  if (query.isError)
    return (
      <Page>
        <Link href="/nutrition/mealplans">Back to mealplans</Link>
        <LibraryError retry={() => query.refetch()} />
      </Page>
    );
  return <Builder key={`${studioId}:${planId}`} plan={query.data} studioId={studioId} />;
}
function mean(options: PlanOption[]) {
  const result = { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  for (const option of options) {
    const n = optionNutrition(option);
    for (const key of ["kcal", "proteinG", "carbsG", "fatG"] as const)
      result[key] += n[key] / options.length;
  }
  return result;
}
function Builder({ plan: initialPlan, studioId }: { plan: MealPlan; studioId: string }) {
  const [plan, setPlan] = useState(initialPlan);
  const [document, setDocument] = useState<PlanDocument>(() => structuredClone(plan.document));
  const [ready, setReady] = useState(false);
  const [recovery, setRecovery] = useState<PlanDocument | null>(null);
  const [editing, setEditing] = useState(false);
  const [picking, setPicking] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mealSheet, setMealSheet] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const qc = useQueryClient();
  const key = `traiv:mealplan-draft:${studioId}:${plan.id}`;
  const dirty = JSON.stringify(document) !== JSON.stringify(plan.document);
  const valid =
    settingsValid(document) &&
    document.slots.every((s) =>
      s.options.every(
        (o) =>
          o.steps.every((step) => Boolean(step.trim())) &&
          o.ingredients.length > 0 &&
          o.ingredients.every(
            (l) => Number.isFinite(l.quantity) && l.quantity > 0 && l.quantity <= 100000,
          ),
      ),
    );
  const publishable =
    valid &&
    document.slots
      .filter((s) => s.enabled)
      .every(
        (s) =>
          s.options.length > 0 &&
          s.options.every((o) => !optionConflicts(o, document.settings).length),
      );
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (saved && typeof saved === "object" && "document" in saved && "version" in saved) {
          const parsed = readPlanDocument(saved.document);
          if (parsed) {
            if (saved.version === plan.updatedAt) setDocument(parsed);
            else setRecovery(parsed);
          }
        }
      }
    } catch {
      setError("Couldn't restore your device draft. Keep this page open until you save.");
    }
    setReady(true);
  }, [key, plan.updatedAt]);
  useEffect(() => {
    if (!ready || recovery) return;
    try {
      if (dirty) localStorage.setItem(key, JSON.stringify({ document, version: plan.updatedAt }));
      else localStorage.removeItem(key);
    } catch {
      setError("Draft storage is unavailable. Keep this page open until you save.");
    }
  }, [document, dirty, key, ready, recovery, plan.updatedAt]);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  const adopt = (saved: MealPlan) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* Server save succeeded even when device storage is unavailable. */
    }
    setPlan(saved);
    setDocument(structuredClone(saved.document));
    setEditing(false);
    qc.setQueryData(["mealplan", studioId, plan.id], saved);
    void qc.invalidateQueries({ queryKey: ["mealplans", studioId] });
  };
  const save = async (input = document, rebalance = false) => {
    if (busy || recovery) return;
    setBusy(true);
    setError("");
    try {
      adopt(await mealPlansApi.save(studioId, plan.id, input, plan.updatedAt, rebalance));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the meal plan.");
    } finally {
      setBusy(false);
    }
  };
  const updateOption = (slotId: string, option: PlanOption) =>
    setDocument((d) => ({
      ...d,
      slots: d.slots.map((s) =>
        s.id === slotId
          ? { ...s, options: s.options.map((o) => (o.id === option.id ? option : o)) }
          : s,
      ),
    }));
  const warnings = planWarnings(document);
  const range = planRange(document);
  const enabled = document.slots.filter((s) => s.enabled);
  const daily = enabled.reduce(
    (sum, s) => {
      const n = mean(s.options);
      return {
        kcal: sum.kcal + n.kcal,
        proteinG: sum.proteinG + n.proteinG,
        carbsG: sum.carbsG + n.carbsG,
        fatG: sum.fatG + n.fatG,
      };
    },
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
  const pickerSlot = enabled.find((s) => s.id === picking);
  const editingMeal = enabled.find((s) => s.id === mealSheet);
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarToggle />
          <Button asChild variant="ghost" size="icon">
            <Link href="/nutrition/mealplans" aria-label="Back to mealplans">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="truncate text-subheading font-semibold">{document.settings.name}</h1>
          <span className="shrink-0 rounded-control bg-sunken px-2 py-1 text-caption text-fg-muted">
            {plan.published ? (dirty || plan.hasChanges ? "Local changes" : "Live") : "Draft"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={busy || Boolean(recovery)}
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            disabled={!dirty || !valid || busy || Boolean(recovery)}
            onClick={() => save()}
          >
            {busy ? "Saving…" : "Save changes"}
          </Button>
          <Button
            disabled={
              !publishable ||
              busy ||
              Boolean(recovery) ||
              Boolean(plan.published && !dirty && !plan.hasChanges)
            }
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const saved = dirty
                  ? await mealPlansApi.save(studioId, plan.id, document, plan.updatedAt)
                  : plan;
                // Retain the saved version if publishing fails, so retry does not use a stale revision.
                if (dirty) adopt(saved);
                const published = await mealPlansApi.publish(studioId, plan.id, saved.updatedAt);
                adopt(published);
                router.push("/nutrition/mealplans");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Couldn't publish the meal plan.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Publish
          </Button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-6 lg:pb-6">
        {error ? (
          <p role="alert" className="mb-4 text-body-sm text-danger">
            {error}
          </p>
        ) : null}
        {recovery ? (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-surface border border-line p-4">
            <p className="flex-1 text-body-sm">
              An older device draft is available. The saved template has changed since then.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setDocument(recovery);
                setRecovery(null);
              }}
            >
              Recover draft
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRecovery(null);
                setDocument(structuredClone(plan.document));
              }}
            >
              Use saved version
            </Button>
          </div>
        ) : null}
        {plan.published && (dirty || plan.hasChanges) ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-body-sm text-fg-muted">
            <p>Your published version stays live until you publish these changes.</p>
            <Button
              variant="ghost"
              disabled={busy || Boolean(recovery)}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  adopt(await mealPlansApi.discard(studioId, plan.id, plan.updatedAt));
                  setDocument(structuredClone(plan.published ?? plan.document));
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "Couldn't restore the published version.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Discard changes
            </Button>
          </div>
        ) : null}
        <fieldset
          disabled={busy || Boolean(recovery)}
          className="flex min-w-0 flex-col gap-5 disabled:opacity-70"
        >
          <section className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-subheading font-semibold tabular-nums">
                  {Math.round(range.low)}–{Math.round(range.high)}{" "}
                  <span className="text-body-sm font-normal text-fg-muted">kcal</span>
                </p>
                <p className="text-caption text-fg-subtle">
                  Target: {document.settings.calorieTarget} kcal · Choose one recipe per meal
                </p>
              </div>
              <p className="text-caption text-fg-subtle">
                Macros below show the average of each meal’s options
              </p>
            </div>
            <MacroBars actual={daily} target={slotTargets(document.settings, 100)} />
            <p className="text-caption text-fg-subtle">
              Target split: Protein {document.settings.proteinPct}% · Carbs{" "}
              {document.settings.carbsPct}% · Fat {document.settings.fatPct}%
            </p>
            <details className="border-t border-line pt-3">
              <summary className="cursor-pointer text-body-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-line-focus">
                Daily micronutrients
              </summary>
              <p className="mt-2 text-caption text-fg-subtle">
                Average of the available recipe options. Missing source values are unknown; these
                are not daily value scores.
              </p>
              <DailyMicros document={document} />
            </details>
            {document.settings.description ? (
              <p className="text-body-sm text-fg-muted">{document.settings.description}</p>
            ) : null}
          </section>
          {warnings.length ? (
            <div
              role="status"
              className="rounded-control bg-sunken px-4 py-3 text-body-sm text-fg-muted"
            >
              <p className="font-medium">Review before publishing</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {warnings.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {!valid ? (
            <p className="text-body-sm text-danger">
              Complete the settings and use positive ingredient quantities before saving.
            </p>
          ) : null}
          {enabled.map((slot) => {
            const calories = slot.options.map((o) => optionNutrition(o).kcal);
            return (
              <section
                key={slot.id}
                className="flex min-w-0 flex-col gap-5 rounded-surface border border-line bg-surface p-4 sm:p-5"
              >
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-subheading font-semibold">
                    {slot.name}{" "}
                    <span className="text-body-sm font-normal text-fg-subtle">
                      ({slot.options.length} recipes)
                    </span>
                  </h2>
                  <Button
                    variant="outline"
                    disabled={slot.options.length >= 30}
                    onClick={() => setPicking(slot.id)}
                  >
                    <Plus className="size-4" />
                    Add a meal
                  </Button>
                </header>
                <div className="flex flex-col gap-3">
                  <p className="text-body-sm font-medium tabular-nums">
                    {calories.length ? `${Math.min(...calories)}–${Math.max(...calories)}` : "0"}{" "}
                    kcal{" "}
                    <span className="ml-2 font-normal text-fg-subtle">
                      Target:{" "}
                      {Math.round((document.settings.calorieTarget * slot.percentage) / 100)} kcal
                    </span>
                  </p>
                  <MacroBars
                    actual={mean(slot.options)}
                    target={slotTargets(document.settings, slot.percentage)}
                  />
                </div>
                <div
                  role="region"
                  aria-label={`${slot.name} recipe options`}
                  tabIndex={0}
                  className="grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto overscroll-x-contain pb-3 outline-none focus-visible:ring-2 focus-visible:ring-line-focus sm:auto-cols-[calc((100%-var(--spacing)*4)/2)] xl:auto-cols-[calc((100%-var(--spacing)*12)/4)]"
                >
                  {slot.options.map((option) => (
                    <PlanOptionCard
                      key={option.id}
                      option={option}
                      settings={document.settings}
                      selected={expanded === option.id}
                      open={() => {
                        setExpanded(option.id);
                        setMealSheet(slot.id);
                      }}
                      remove={() =>
                        setDocument((d) => ({
                          ...d,
                          slots: d.slots.map((s) =>
                            s.id === slot.id
                              ? { ...s, options: s.options.filter((o) => o.id !== option.id) }
                              : s,
                          ),
                        }))
                      }
                    />
                  ))}
                </div>
                {!slot.options.length ? (
                  <p className="text-body-sm text-fg-muted">
                    No eligible recipes were found. Add a recipe or adjust your preferences in Edit.
                  </p>
                ) : null}
              </section>
            );
          })}
        </fieldset>
      </div>
      {editingMeal ? (
        <PlanMealSheet
          slot={editingMeal}
          selectedId={expanded ?? ""}
          studioId={studioId}
          select={setExpanded}
          change={(option) => {
            if (mealSheet) updateOption(mealSheet, option);
          }}
          close={() => {
            setMealSheet(null);
            setExpanded(null);
          }}
        />
      ) : null}
      {editing ? (
        <PlanSettingsSheet
          initial={document}
          studioId={studioId}
          busy={busy}
          error={error}
          close={() => {
            if (!busy) setEditing(false);
          }}
          submit={(input) => save(input, true)}
        />
      ) : null}
      {pickerSlot ? (
        <PlanRecipePicker
          key={pickerSlot.id}
          studioId={studioId}
          document={document}
          slot={pickerSlot}
          close={() => setPicking(null)}
          add={(option) =>
            setDocument((d) => ({
              ...d,
              slots: d.slots.map((s) =>
                s.id === pickerSlot.id && !s.options.some((o) => o.recipeId === option.recipeId)
                  ? { ...s, options: [...s.options, option] }
                  : s,
              ),
            }))
          }
        />
      ) : null}
    </div>
  );
}
function MacroBars({
  actual,
  target,
}: {
  actual: { proteinG: number; carbsG: number; fatG: number };
  target: { proteinG: number; carbsG: number; fatG: number };
}) {
  // Show composition, not target completion: meeting all three targets should
  // still produce distinct protein/carbohydrate/fat shares.
  const energy = actual.proteinG * 4 + actual.carbsG * 4 + actual.fatG * 9;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {(
        [
          {
            key: "proteinG",
            label: "Protein",
            Icon: Protein,
            color: "bg-macro-protein",
            track: "bg-macro-protein/10",
            multiplier: 4,
            text: "text-macro-protein",
          },
          {
            key: "carbsG",
            label: "Carbs",
            Icon: Carbs,
            color: "bg-macro-carbs",
            track: "bg-macro-carbs/10",
            multiplier: 4,
            text: "text-macro-carbs",
          },
          {
            key: "fatG",
            label: "Fat",
            Icon: Fat,
            color: "bg-macro-fat",
            track: "bg-macro-fat/10",
            multiplier: 9,
            text: "text-macro-fat",
          },
        ] as const
      ).map(({ key, label, Icon, color, track, multiplier, text }) => (
        <div key={key}>
          <div className="mb-2 flex items-center justify-between gap-2 text-caption">
            <span className="flex items-center gap-2 font-medium">
              <Icon className={`size-4 ${text}`} />
              {label}
            </span>
            <span className="tabular-nums text-fg-muted">
              ~{Math.round(actual[key])} g / {Math.round(target[key])} g
            </span>
          </div>
          <div
            role="meter"
            aria-label={`${label} share of macro calories`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={energy ? Math.round(((actual[key] * multiplier) / energy) * 100) : 0}
            className={`h-2 overflow-hidden rounded-full ${track}`}
          >
            <div
              className={`h-full rounded-full ${color}`}
              style={{
                width: `${Math.min(100, Math.max(0, energy ? ((actual[key] * multiplier) / energy) * 100 : 0))}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyMicros({ document }: { document: PlanDocument }) {
  const totals: Record<string, number> = {};
  for (const slot of document.slots.filter((s) => s.enabled)) {
    for (const option of slot.options) {
      for (const [key, value] of Object.entries(optionNutrition(option).micronutrients))
        totals[key] = (totals[key] ?? 0) + value / slot.options.length;
    }
  }
  return (
    <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-body-sm sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(totals).map(([key, value]) => (
        <div key={key} className="flex justify-between gap-3">
          <dt className="text-fg-muted">{MICROS[key] ?? key}</dt>
          <dd className="tabular-nums">{Math.round(value * 10) / 10}</dd>
        </div>
      ))}
      {!Object.keys(totals).length ? (
        <p className="text-fg-subtle">No micronutrient values provided.</p>
      ) : null}
    </dl>
  );
}
