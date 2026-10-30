"use client";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { StickyPageHeader } from "@traiv/ui/components/shell/sticky-page-header";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { Carbs, Fat, Folder, Globe, Plus, Protein, Search, Sort, Tag } from "@traiv/ui/icons";
import { useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { Ingredient, LibraryOptions } from "@/lib/api/nutrition";
import { useIngredients } from "@/lib/query/use-nutrition";
import {
  ALLERGENS,
  DIETS,
  LibraryError,
  LibraryLoading,
  MultiPick,
  Pagination,
  Pick,
} from "../_components/controls";
import { IngredientPanel } from "../_components/ingredient-panel";
export default function IngredientsPage() {
  const studioId = useActiveStudioId() ?? "";
  const [opts, setOpts] = useState<LibraryOptions>({ page: 1, sort: "name" });
  const [panel, setPanel] = useState<{ ingredient: Ingredient | null } | null>(null);
  const query = useIngredients(studioId, opts);
  const filter = (v: Partial<LibraryOptions>) => setOpts((old) => ({ ...old, ...v, page: 1 }));
  return (
    <Page className="max-w-none gap-5">
      <StickyPageHeader>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <h1 className="text-lead font-semibold">Ingredients</h1>
          </div>
        </header>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 basis-64 sm:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
            <Input
              aria-label="Search ingredients"
              placeholder="Search ingredients…"
              className="w-full pl-9"
              value={opts.search ?? ""}
              onChange={(e) => filter({ search: e.target.value })}
            />
          </div>
          <div className="hidden flex-1 sm:block" />
          <Pick
            icon={Sort}
            label="Sort ingredients"
            value={opts.sort ?? "name"}
            options={["name", "name-desc", "newest"]}
            onChange={(sort) => filter({ sort })}
          />
          <Button disabled={!studioId} onClick={() => setPanel({ ingredient: null })}>
            <Plus className="size-4" />
            New ingredient
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pick
            icon={Folder}
            filterLabel="Category"
            label="Category"
            value={opts.category ?? "All categories"}
            options={["All categories", ...(query.data?.categories ?? [])]}
            onChange={(category) =>
              filter({ category: category === "All categories" ? undefined : category })
            }
          />
          <MultiPick
            icon={Tag}
            filter
            label="Tags"
            values={opts.tags?.split(",") ?? []}
            options={[...DIETS, ...ALLERGENS]}
            onChange={(v) => filter({ tags: v.length ? v.join(",") : undefined })}
          />
          <Pick
            icon={Globe}
            filterLabel="Country"
            label="Country"
            value={opts.country ?? "All countries"}
            options={["All countries", ...(query.data?.countries ?? [])]}
            onChange={(country) =>
              filter({ country: country === "All countries" ? undefined : country })
            }
          />
          <Pick
            icon={Plus}
            filterLabel="Type"
            label="Library type"
            value={opts.type ?? "All types"}
            options={["All types", "Personal", "System"]}
            onChange={(type) => filter({ type: type === "All types" ? undefined : type })}
          />
        </div>
      </StickyPageHeader>
      {query.isPending ? (
        <LibraryLoading />
      ) : query.isError ? (
        <LibraryError retry={() => query.refetch()} />
      ) : query.data.items.length ? (
        <div className="overflow-hidden rounded-surface border border-line bg-surface">
          <div className="hidden grid-cols-24 gap-4 border-b border-line px-4 py-3 text-caption text-fg-muted md:grid">
            <span className="col-span-8">Name</span>
            <span className="col-span-4 lg:col-span-3">Calories</span>
            <span className="col-span-6 lg:col-span-5">Nutrients</span>
            <span className="hidden col-span-4 lg:block">Category</span>
            <span className="col-span-4 lg:col-span-2">Country</span>
            <span className="col-span-2">Library</span>
          </div>
          {query.data.items.map((i) => (
            <button
              type="button"
              key={i.id}
              className="grid w-full grid-cols-2 items-center gap-2 border-b border-line px-4 py-4 text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-line-focus md:grid-cols-24 md:gap-4"
              onClick={() => setPanel({ ingredient: i })}
            >
              <span className="col-span-2 min-w-0 text-body-sm font-medium md:col-span-8">
                {i.name}
              </span>
              <span className="text-body-sm tabular-nums md:col-span-4 lg:col-span-3">
                {i.kcal}
                <span className="text-caption text-fg-subtle"> kcal / 100 g</span>
              </span>
              <span className="flex flex-wrap items-center gap-2 text-caption tabular-nums md:col-span-6 lg:col-span-5">
                {(
                  [
                    [Protein, i.proteinG, "Protein"],
                    [Carbs, i.carbsG, "Carbs"],
                    [Fat, i.fatG, "Fat"],
                  ] as const
                ).map(([Icon, n, label]) => (
                  <span key={label} className="inline-flex items-center gap-1" title={label}>
                    <Icon
                      className={`size-4 ${label === "Protein" ? "text-macro-protein" : label === "Carbs" ? "text-macro-carbs" : "text-macro-fat"}`}
                    />
                    <span className="sr-only">{label} </span>
                    {Math.round(n * 10) / 10} g
                  </span>
                ))}
              </span>
              <span className="hidden text-caption text-fg-muted lg:col-span-4 lg:block">
                {i.category ?? "Uncategorised"}
              </span>
              <span className="inline-flex items-center gap-1 text-caption text-fg-muted md:col-span-4 lg:col-span-2">
                <span aria-hidden="true">
                  {i.country === "India" ? (
                    "🇮🇳"
                  ) : i.country === "Norway" ? (
                    "🇳🇴"
                  ) : (
                    <Globe className="size-4 shrink-0" />
                  )}
                </span>
                {i.country ?? "Global"}
              </span>
              <span className="w-fit rounded-control border border-line bg-sunken md:col-span-2 px-2 py-1 text-caption text-fg-muted">
                {i.studioId ? "Personal" : "System"}
              </span>
            </button>
          ))}
          <div className="bg-sunken px-4 py-3">
            <Pagination
              total={query.data.total}
              page={opts.page ?? 1}
              onChange={(page) => setOpts((o) => ({ ...o, page }))}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-12">
          <p className="text-body-sm text-fg-muted">
            No ingredients match. Change the filters or add your own.
          </p>
          <Button variant="outline" onClick={() => setPanel({ ingredient: null })}>
            New ingredient
          </Button>
        </div>
      )}
      {panel ? (
        <IngredientPanel
          key={`${studioId}:${panel.ingredient?.id ?? "new"}`}
          studioId={studioId}
          ingredient={panel.ingredient}
          categories={query.data?.categories ?? []}
          close={() => setPanel(null)}
        />
      ) : null}
    </Page>
  );
}
