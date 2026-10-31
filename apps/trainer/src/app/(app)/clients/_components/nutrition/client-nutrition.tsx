"use client";
import { ClientFoodTools } from "./client-food-tools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@traiv/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@traiv/ui/components/sheet";
import { Carbs, Copy, Fat, Plus, Protein, Salad, ArrowLeft } from "@traiv/ui/icons";
import {
  mealPlansApi,
  type MealPlan,
  type PlanDocument,
  type PlanSettings,
} from "@/lib/api/meal-plans";
import type { EnergyCard } from "@/lib/api";
import { PlanBuilder } from "../../../nutrition/mealplans/_components/plan-builder";
import {
  emptyMealPlan,
  PlanSettingsSheet,
} from "../../../nutrition/mealplans/_components/plan-settings";
import {
  Field,
  Pick,
  LibraryLoading,
  LibraryError,
  Pagination,
} from "../../../nutrition/_components/controls";

type Template = PlanSettings & { id: string };
export function ClientNutrition({
  studioId,
  clientId,
  name,
  energy,
}: {
  studioId: string | null;
  clientId: string;
  name: string;
  energy?: EnergyCard;
}) {
  const studio = studioId ?? "";
  const qc = useQueryClient();
  const plans = useQuery({
    queryKey: ["client-mealplans", studio, clientId],
    queryFn: () => mealPlansApi.clientPlans(studio, clientId),
    enabled: Boolean(studio),
    refetchOnWindowFocus: false,
  });
  const [selected, setSelected] = useState<string | null>(null),
    [initial, setInitial] = useState<PlanDocument | null>(null),
    [copying, setCopying] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const requestId = useRef("");
  const recommendation = energy && energy.source !== "none" ? energy.kcal : undefined;
  const active = plans.data?.find((p) => p.id === selected) ?? plans.data?.[0];
  const adopt = (plan: MealPlan) => {
    qc.setQueryData<MealPlan[]>(["client-mealplans", studio, clientId], (old) => [
      plan,
      ...(old ?? []).filter((p) => p.id !== plan.id),
    ]);
    setSelected(plan.id);
    setInitial(null);
    setCopying(false);
  };
  const create = () => {
    requestId.current = crypto.randomUUID();
    const d = emptyMealPlan();
    d.settings.name = `${name.slice(0, 28)}'s Meal Plan`.slice(0, 40);
    setError("");
    setInitial(d);
  };
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <ClientFoodTools studio={studio} clientId={clientId} />
      {error ? (
        <p role="alert" className="px-6 py-3 text-body-sm text-danger">
          {error}
        </p>
      ) : null}
      {plans.isPending ? (
        <div className="p-6">
          <LibraryLoading />
        </div>
      ) : plans.isError ? (
        <div className="p-6">
          <LibraryError retry={() => plans.refetch()} />
        </div>
      ) : active ? (
        <>
          <PlanBuilder
            key={active.id}
            plan={active}
            studioId={studio}
            embedded
            planSelector={
              <Select value={active.id} onValueChange={setSelected}>
                <SelectTrigger aria-label="Client meal plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(plans.data ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.document.settings.name} ·{" "}
                      {p.published ? (p.hasChanges ? "Local changes" : "Live") : "Draft"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            onCreate={create}
            onCopy={() => {
              setError("");
              setCopying(true);
            }}
            onSaved={adopt}
            onArchive={async () => {
              setError("");
              try {
                await mealPlansApi.archive(studio, active.id, active.updatedAt);
                setSelected(null);
                await plans.refetch();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Couldn't archive the plan.");
              }
            }}
          />
        </>
      ) : (
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <Salad className="size-14 text-fg-subtle" />
          <h2 className="text-subheading font-semibold">No meal plan found</h2>
          <p className="max-w-md text-body-sm text-fg-muted">
            This client does not have a nutrition plan assigned yet.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={create}>
              <Plus className="size-4" />
              Create new plan
            </Button>
            <Button variant="outline" onClick={() => setCopying(true)}>
              <Copy className="size-4" />
              Create from template
            </Button>
          </div>
        </div>
      )}
      {initial ? (
        <PlanSettingsSheet
          clientPlan
          create
          initial={initial}
          studioId={studio}
          busy={busy}
          error={error}
          recommendedKcal={recommendation}
          close={() => {
            if (!busy) setInitial(null);
          }}
          submit={async (document) => {
            setBusy(true);
            setError("");
            try {
              adopt(
                await mealPlansApi.createClient(studio, clientId, {
                  id: requestId.current,
                  document,
                }),
              );
            } catch (e) {
              setError(e instanceof Error ? e.message : "Couldn't create the client's plan.");
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
      {copying ? (
        <CopyPlan
          studioId={studio}
          clientId={clientId}
          recommendedKcal={recommendation}
          close={() => setCopying(false)}
          done={adopt}
        />
      ) : null}
    </div>
  );
}
function CopyPlan({
  studioId,
  clientId,
  recommendedKcal,
  close,
  done,
}: {
  studioId: string;
  clientId: string;
  recommendedKcal?: number;
  close: () => void;
  done: (plan: MealPlan) => void;
}) {
  const [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<Template | null>(null),
    [name, setName] = useState(""),
    [custom, setCustom] = useState(false),
    [calories, setCalories] = useState(2000),
    [split, setSplit] = useState("30/40/30"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const id = useRef(crypto.randomUUID());
  const templates = useQuery({
    queryKey: ["live-mealplan-templates", studioId, search, page],
    queryFn: () => mealPlansApi.liveTemplates(studioId, search, page),
    enabled: Boolean(studioId),
  });
  const valid =
    name.trim().length > 0 &&
    name.length <= 40 &&
    (!custom || (Number.isInteger(calories) && calories >= 100 && calories <= 20000));
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open && !busy) close();
      }}
    >
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b border-line px-6 py-5">
          <SheetTitle>Create from existing</SheetTitle>
          <SheetDescription>
            Select a published template to copy and customize for this client.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {error ? (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          ) : null}
          {!selected ? (
            <>
              <Input
                aria-label="Search meal plan templates"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {templates.isPending ? (
                <LibraryLoading />
              ) : templates.isError ? (
                <LibraryError retry={() => templates.refetch()} />
              ) : templates.data.items.length ? (
                templates.data.items.map((t) => (
                  <section
                    key={t.id}
                    className="flex flex-col gap-4 rounded-surface border border-line bg-surface p-5"
                  >
                    <header className="flex items-center gap-3">
                      {t.coverImageUrl ? (
                        <img
                          src={t.coverImageUrl}
                          alt=""
                          className="size-12 rounded-control object-cover"
                        />
                      ) : (
                        <span className="flex size-12 items-center justify-center rounded-control bg-sunken text-caption">
                          {t.name.slice(0, 2)}
                        </span>
                      )}
                      <div className="flex-1">
                        <h3 className="text-body font-semibold">{t.name}</h3>
                        <p className="text-body-sm text-fg-muted">
                          {t.calorieTarget.toLocaleString()} kcal
                        </p>
                      </div>
                      <span className="rounded-control bg-success-subtle px-2 py-1 text-caption text-success">
                        Live
                      </span>
                    </header>
                    {[
                      {
                        label: "Protein",
                        value: t.proteinPct,
                        Icon: Protein,
                        color: "bg-macro-protein",
                        track: "bg-macro-protein/10",
                      },
                      {
                        label: "Carbs",
                        value: t.carbsPct,
                        Icon: Carbs,
                        color: "bg-macro-carbs",
                        track: "bg-macro-carbs/10",
                      },
                      {
                        label: "Fat",
                        value: t.fatPct,
                        Icon: Fat,
                        color: "bg-macro-fat",
                        track: "bg-macro-fat/10",
                      },
                    ].map(({ label, value, Icon, color, track }) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-body-sm">
                          <span className="flex items-center gap-2">
                            <Icon className="size-4" />
                            {label}
                          </span>
                          <span>{value}%</span>
                        </div>
                        <div className={`h-2 overflow-hidden rounded-full ${track}`}>
                          <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setSelected(t);
                        setName(t.name);
                        setCalories(t.calorieTarget);
                        setSplit(`${t.proteinPct}/${t.carbsPct}/${t.fatPct}`);
                        id.current = crypto.randomUUID();
                      }}
                    >
                      Select template
                    </Button>
                  </section>
                ))
              ) : (
                <p className="text-body-sm text-fg-muted">
                  No published templates found. Publish a plan in Mealplans first, or create a new
                  client plan.
                </p>
              )}
              {templates.data ? (
                <Pagination total={templates.data.total} page={page} onChange={setPage} />
              ) : null}
            </>
          ) : (
            <>
              <Field label="Plan name">
                <Input
                  value={name}
                  maxLength={40}
                  aria-label="Client plan name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-body-sm font-semibold">Macro configuration</legend>
                <label className="flex items-start gap-3 text-body-sm">
                  <input
                    type="radio"
                    name="copy-targets"
                    checked={!custom}
                    onChange={() => setCustom(false)}
                  />
                  Use existing calories and macros from template
                </label>
                <label className="flex items-start gap-3 text-body-sm">
                  <input
                    type="radio"
                    name="copy-targets"
                    checked={custom}
                    onChange={() => setCustom(true)}
                  />
                  Define custom calories and macros
                </label>
              </fieldset>
              {custom ? (
                <>
                  <Field label="Target calories">
                    <Input
                      aria-label="Custom calories"
                      type="number"
                      min={100}
                      max={20000}
                      value={calories}
                      onChange={(e) => setCalories(Number(e.target.value))}
                    />
                  </Field>
                  {recommendedKcal ? (
                    <div className="flex items-center justify-between gap-3 rounded-control bg-warning-subtle p-3 text-body-sm">
                      <span>
                        {recommendedKcal.toLocaleString()} kcal recommended for this client
                      </span>
                      <Button variant="ghost" onClick={() => setCalories(recommendedKcal)}>
                        Apply
                      </Button>
                    </div>
                  ) : null}
                  <Pick
                    label="Macro split (Protein / Carbs / Fat)"
                    value={split}
                    options={[
                      ...new Set([
                        `${selected.proteinPct}/${selected.carbsPct}/${selected.fatPct}`,
                        "30/40/30",
                        "40/40/20",
                        "50/25/25",
                        "30/50/20",
                        "40/30/30",
                      ]),
                    ]}
                    onChange={setSplit}
                  />
                </>
              ) : null}
            </>
          )}
        </div>
        {selected ? (
          <footer className="flex shrink-0 gap-3 border-t border-line px-6 py-4">
            <Button variant="outline" disabled={busy} onClick={() => setSelected(null)}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={busy || !valid}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  const [proteinPct = 30, carbsPct = 40, fatPct = 30] = split
                    .split("/")
                    .map(Number);
                  done(
                    await mealPlansApi.createClient(studioId, clientId, {
                      id: id.current,
                      templateId: selected.id,
                      name,
                      targets: custom
                        ? { calorieTarget: calories, proteinPct, carbsPct, fatPct }
                        : undefined,
                    }),
                  );
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Couldn't copy the template.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Creating…" : "Create"}
            </Button>
          </footer>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
