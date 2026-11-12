"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@traiv/ui/components/sheet";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { Pencil, Plus, Trash } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useEffect, useState } from "react";
import { AdminState, Empty } from "@/components/common/admin-state";
import { ExportCsvButton } from "@/components/common/export-csv-button";
import type { Funnel, FunnelInput, FunnelReport, FunnelStepInput, FunnelSummary } from "@/lib/api";
import { toCsv } from "@/lib/csv";
import {
  useDeleteFunnel,
  useEventNames,
  useFunnel,
  useFunnelList,
  useSaveFunnel,
  useSession,
} from "@/lib/query";

/**
 * "Where do people actually drop off?" — `admin-dashboard-spec.md` §3.
 *
 * Reads `funnel_definition` rows (data, not code — a new funnel ships with no deploy)
 * and computes step counts/drop-off on demand, bounded by date range. The builder below
 * is `implementation-roadmap.md` Phase 4: anyone with admin access can define a new
 * funnel without a deploy, not just the two seeded at launch.
 */
export default function FunnelsPage() {
  const [days, setDays] = useState(30);
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<Funnel | "new" | null>(null);
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const list = useFunnelList(signedIn);
  const funnel = useFunnel(selected, days);
  const deleteFunnel = useDeleteFunnel();

  useEffect(() => {
    if (!selected && list.data?.funnels.length) setSelected(list.data.funnels[0]?.id ?? null);
  }, [selected, list.data]);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-medium">Funnels</h1>
          <p className="text-body-sm text-fg-muted">
            Each step counts only people who reached every step before it, in order.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList>
              <TabsTrigger value="7">7 days</TabsTrigger>
              <TabsTrigger value="30">30 days</TabsTrigger>
              <TabsTrigger value="90">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button type="button" size="sm" className="gap-1.5" onClick={() => setEditing("new")}>
            <Plus className="size-3.5" /> New funnel
          </Button>
        </div>
      </header>

      <AdminState
        pending={list.isPending || session.isPending}
        error={list.error}
        onRetry={() => void list.refetch()}
        skeleton={<Skeleton className="h-10 w-64 rounded-surface" />}
      >
        {list.data?.funnels.length ? (
          <FunnelPicker
            funnels={list.data.funnels}
            selected={selected}
            onSelect={setSelected}
            onEdit={(f) => setEditing(f)}
            onDelete={(id) => {
              void deleteFunnel.mutateAsync(id).then(() => {
                if (selected === id) setSelected(null);
              });
            }}
          />
        ) : (
          <Empty>No funnels defined yet — create one above.</Empty>
        )}
      </AdminState>

      <AdminState
        pending={funnel.isPending}
        error={funnel.error}
        onRetry={() => void funnel.refetch()}
        skeleton={<Skeleton className="h-64 rounded-surface" />}
      >
        {funnel.data ? <FunnelDetail data={funnel.data} /> : null}
      </AdminState>

      <FunnelBuilderSheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        existing={editing === "new" ? null : editing}
      />
    </Page>
  );
}

function FunnelPicker({
  funnels,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  funnels: FunnelSummary[];
  selected: string | null;
  onSelect: (id: string) => void;
  onEdit: (f: Funnel | "new") => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {funnels.map((f) => (
        <div
          key={f.id}
          className={cn(
            "flex items-center gap-1 rounded-full border pl-3.5 pr-1.5 py-1 text-body-sm font-medium transition-colors",
            selected === f.id ? "border-fg bg-fg text-bg" : "border-line text-fg-muted",
          )}
        >
          <button type="button" onClick={() => onSelect(f.id)} className="py-0.5">
            {f.name}
          </button>
          <button
            type="button"
            aria-label={`Edit ${f.name}`}
            onClick={() =>
              // The list row has only id/name/stepCount — the full step list is fetched
              // fresh when the sheet opens, via `useFunnel`'s own cache if already warm.
              onEdit({ id: f.id, name: f.name, steps: [] })
            }
            className="rounded-full p-1 hover:bg-fg/10"
          >
            <Pencil className="size-3" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${f.name}`}
            onClick={() => onDelete(f.id)}
            className="rounded-full p-1 hover:bg-fg/10"
          >
            <Trash className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function FunnelDetail({ data }: { data: FunnelReport }) {
  const first = data.steps[0]?.reached ?? 0;

  return (
    <section className="flex flex-col gap-5 rounded-surface border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-subheading font-semibold">{data.name}</h2>
          <p className="text-caption text-fg-subtle">Last {data.days} days</p>
        </div>
        <ExportCsvButton
          filename={`funnel-${data.name.toLowerCase().replace(/\s+/g, "-")}.csv`}
          getCsv={() =>
            toCsv(
              ["step", "event", "reached", "drop_off_rate", "median_seconds_since_previous"],
              data.steps.map((s, i) => [
                i + 1,
                s.name,
                s.reached,
                s.dropOffRate === null ? "" : Math.round(s.dropOffRate * 1000) / 10,
                s.medianSecondsSincePreviousStep ?? "",
              ]),
            )
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        {data.steps.map((step, i) => {
          const pct = first > 0 ? Math.round((step.reached / first) * 100) : 0;
          return (
            <div key={`${step.name}-${i}`} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm">
                  {i + 1}. {step.name}
                  {typeof step.properties.step_index === "number"
                    ? ` (step ${step.properties.step_index})`
                    : ""}
                </span>
                <span className="text-body-sm font-medium tabular-nums">
                  {step.reached}
                  <span className="ml-1.5 text-caption text-fg-subtle">{pct}%</span>
                </span>
              </div>
              <span className="h-2 w-full overflow-hidden rounded-full bg-sunken">
                <span className="block h-full rounded-full bg-fg" style={{ width: `${pct}%` }} />
              </span>
              {step.dropOffRate !== null ? (
                <span className="text-caption text-fg-subtle">
                  {Math.round(step.dropOffRate * 100)}% dropped off from the previous step
                  {step.medianSecondsSincePreviousStep !== null
                    ? ` · median ${formatDuration(step.medianSecondsSincePreviousStep)} to get here`
                    : ""}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

const BLANK_STEP: FunnelStepInput = { name: "" };

function FunnelBuilderSheet({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing: Funnel | null;
}) {
  const eventNames = useEventNames(open);
  const save = useSaveFunnel();
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<FunnelStepInput[]>([BLANK_STEP, BLANK_STEP]);
  const [error, setError] = useState<string | null>(null);

  // Loaded fresh each time the sheet opens, from `useFunnel`'s own full step list — the
  // picker row only carries id/name/stepCount, not the steps themselves.
  const fullExisting = useFunnel(existing?.id ?? null, 30);
  useEffect(() => {
    if (!open) return;
    if (!existing) {
      setName("");
      setSteps([BLANK_STEP, BLANK_STEP]);
      return;
    }
    setName(existing.name);
  }, [open, existing]);
  useEffect(() => {
    if (!fullExisting.data) return;
    setSteps(
      fullExisting.data.steps.map((s) => {
        const [propertyKey, propertyValue] = Object.entries(s.properties)[0] ?? [];
        return {
          name: s.name,
          ...(propertyKey !== undefined
            ? { propertyKey, propertyValue: propertyValue as string | number | boolean }
            : {}),
        };
      }),
    );
  }, [fullExisting.data]);

  async function onSave() {
    setError(null);
    if (!name.trim()) return setError("Give the funnel a name.");
    const cleanSteps = steps
      .filter((s) => s.name)
      .map((s) => ({
        ...s,
        propertyValue:
          s.propertyKey && s.propertyValue !== undefined && !Number.isNaN(Number(s.propertyValue))
            ? Number(s.propertyValue)
            : s.propertyValue,
      }));
    if (cleanSteps.length < 2) return setError("A funnel needs at least two steps.");

    const input: FunnelInput = { name: name.trim(), steps: cleanSteps };
    try {
      await save.mutateAsync({ id: existing?.id ?? null, input });
      onClose();
    } catch {
      setError("Couldn't save. Check the fields and try again.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-5 p-5">
        <SheetHeader>
          <SheetTitle>{existing ? "Edit funnel" : "New funnel"}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-2">
          <label htmlFor="funnel-name" className="text-caption font-medium text-fg-muted">
            Name
          </label>
          <Input
            id="funnel-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Trainer activation"
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-caption font-medium text-fg-muted">Steps, in order</span>
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-surface border border-line p-3">
              <div className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-caption text-fg-subtle">{i + 1}.</span>
                <Select
                  value={step.name}
                  onValueChange={(v) =>
                    setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, name: v } : s)))
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {(eventNames.data ?? []).map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {steps.length > 2 ? (
                  <button
                    type="button"
                    aria-label="Remove step"
                    onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))}
                    className="rounded-full p-1.5 text-fg-subtle hover:bg-sunken hover:text-fg"
                  >
                    <Trash className="size-3.5" />
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-2 pl-7">
                <Input
                  placeholder="property (optional)"
                  value={step.propertyKey ?? ""}
                  onChange={(e) =>
                    setSteps((prev) =>
                      prev.map((s, j) => (j === i ? { ...s, propertyKey: e.target.value } : s)),
                    )
                  }
                  className="h-8 text-caption"
                />
                <Input
                  placeholder="value"
                  value={String(step.propertyValue ?? "")}
                  onChange={(e) =>
                    setSteps((prev) =>
                      prev.map((s, j) => (j === i ? { ...s, propertyValue: e.target.value } : s)),
                    )
                  }
                  className="h-8 text-caption"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 self-start"
            onClick={() => setSteps((prev) => [...prev, BLANK_STEP])}
          >
            <Plus className="size-3.5" /> Add step
          </Button>
        </div>

        {error ? <p className="text-caption text-danger">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="button" onClick={() => void onSave()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save funnel"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
