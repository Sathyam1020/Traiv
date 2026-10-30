"use client";
import { useQuery } from "@tanstack/react-query";
import { readPlanDocument, type PlanDocument } from "@traiv/nutrition/meal-plans";
import { Button } from "@traiv/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { StickyPageHeader } from "@traiv/ui/components/shell/sticky-page-header";
import {
  Carbs,
  Copy,
  Fat,
  Flame,
  MoreHorizontal,
  Plus,
  Protein,
  Search,
  Trash,
} from "@traiv/ui/icons";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import { mealPlansApi } from "@/lib/api/meal-plans";
import { LibraryError, LibraryLoading, Pagination } from "../_components/controls";
import { emptyMealPlan, PlanSettingsSheet } from "./_components/plan-settings";
export default function MealPlansPage() {
  const studioId = useActiveStudioId() ?? "";
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [initial, setInitial] = useState<PlanDocument | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const createId = useRef("");
  const copies = useRef<Record<string, string>>({});
  const query = useQuery({
    queryKey: ["mealplans", studioId, search, page],
    queryFn: () => mealPlansApi.list(studioId, search, page),
    enabled: Boolean(studioId),
  });
  const key = `traiv:mealplan-create:${studioId}`;
  const open = () => {
    setError("");
    let document = emptyMealPlan();
    createId.current = crypto.randomUUID();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (
          saved &&
          typeof saved === "object" &&
          "document" in saved &&
          "id" in saved &&
          typeof saved.id === "string"
        ) {
          const parsed = readPlanDocument(saved.document);
          if (parsed) {
            document = parsed;
            createId.current = saved.id;
          }
        }
      }
    } catch {
      setError("Couldn't restore the saved draft. You can start a new template.");
    }
    setInitial(document);
  };
  return (
    <Page className="max-w-none gap-5 pb-24 lg:pb-5">
      <StickyPageHeader>
        <div className="flex items-center gap-3">
          <SidebarToggle />
          <h1 className="text-lead font-semibold">Mealplans</h1>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
            <Input
              className="pl-9"
              aria-label="Search mealplans"
              placeholder="Search mealplans"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button disabled={!studioId} onClick={open}>
            <Plus className="size-4" />
            New meal plan
          </Button>
        </div>
      </StickyPageHeader>
      {error && !initial ? (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      ) : null}
      {query.isPending ? (
        <LibraryLoading />
      ) : query.isError ? (
        <LibraryError retry={() => query.refetch()} />
      ) : query.data.items.length ? (
        <div className="overflow-hidden rounded-surface border border-line bg-surface">
          <div className="hidden grid-cols-12 gap-4 border-b border-line px-4 py-3 pr-16 text-caption text-fg-muted md:grid">
            <span className="col-span-4">Name</span>
            <span className="col-span-2">Calories</span>
            <span className="col-span-3">Macros</span>
            <span className="col-span-2">Status</span>
          </div>
          {query.data.items.map((plan) => (
            <div key={plan.id} className="relative border-b border-line hover:bg-hover">
              <button
                type="button"
                onClick={() => router.push(`/nutrition/mealplans/${plan.id}`)}
                className="grid w-full grid-cols-1 items-center gap-3 px-4 py-4 pr-16 text-left outline-none focus-visible:ring-2 focus-visible:ring-line-focus md:grid-cols-12 md:gap-4"
              >
                <span className="flex min-w-0 items-center gap-3 md:col-span-4">
                  {plan.coverImageUrl ? (
                    <img
                      src={plan.coverImageUrl}
                      alt=""
                      className="size-11 shrink-0 rounded-control object-cover"
                    />
                  ) : (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-sunken text-caption text-fg-muted">
                      {plan.name.slice(0, 2)}
                    </span>
                  )}
                  <span className="text-body-sm font-medium">{plan.name}</span>
                </span>
                <span className="flex items-center gap-1 text-body-sm tabular-nums md:col-span-2">
                  <Flame className="size-4 text-macro-protein" />
                  {plan.calorieTarget}
                  <span className="text-caption text-fg-subtle">kcal</span>
                </span>
                <span className="flex flex-wrap gap-3 text-body-sm tabular-nums md:col-span-3">
                  <span className="flex items-center gap-1">
                    <Protein className="size-4 text-macro-protein" />
                    {plan.proteinPct}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Carbs className="size-4 text-macro-carbs" />
                    {plan.carbsPct}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Fat className="size-4 text-macro-fat" />
                    {plan.fatPct}%
                  </span>
                </span>
                <span
                  className={`w-fit rounded-control px-2 py-1 text-caption font-medium md:col-span-2 ${plan.hasChanges ? "bg-signal-subtle text-signal-text" : plan.status === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}
                >
                  {plan.hasChanges ? "Local changes" : plan.status === "active" ? "Live" : "Draft"}
                </span>
              </button>
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${plan.name}`}
                      disabled={busy}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled={busy}
                      onSelect={async () => {
                        setBusy(true);
                        setError("");
                        const id = copies.current[plan.id] ?? crypto.randomUUID();
                        copies.current[plan.id] = id;
                        try {
                          const copy = await mealPlansApi.duplicate(studioId, plan.id, id);
                          delete copies.current[plan.id];
                          router.push(`/nutrition/mealplans/${copy.id}`);
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "Couldn't duplicate template.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      <Copy className="size-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={busy}
                      onSelect={async () => {
                        setBusy(true);
                        setError("");
                        try {
                          await mealPlansApi.archive(studioId, plan.id, plan.updatedAt);
                          await query.refetch();
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "Couldn't archive template.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      <Trash className="size-4" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          <div className="bg-sunken px-4 py-3">
            <Pagination total={query.data.total} page={page} onChange={setPage} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-12">
          <p className="text-body-sm text-fg-muted">
            {search
              ? "No mealplans match your search."
              : "Create a meal plan template with recipe options for each meal."}
          </p>
          <Button variant="outline" onClick={open}>
            <Plus className="size-4" />
            New meal plan
          </Button>
        </div>
      )}
      {initial ? (
        <PlanSettingsSheet
          studioId={studioId}
          initial={initial}
          create
          busy={busy}
          error={error}
          close={() => setInitial(null)}
          draft={(document) => {
            try {
              localStorage.setItem(key, JSON.stringify({ id: createId.current, document }));
            } catch {
              setError("Draft storage is unavailable. Keep this sheet open until you save.");
            }
          }}
          submit={async (document) => {
            setBusy(true);
            setError("");
            try {
              const plan = await mealPlansApi.create(studioId, createId.current, document);
              localStorage.removeItem(key);
              router.push(`/nutrition/mealplans/${plan.id}`);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Couldn't create the template.");
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
    </Page>
  );
}
