"use client";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import { StickyPageHeader } from "@traiv/ui/components/shell/sticky-page-header";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { Plus, Search, Sort, Tag, ClipboardList, List, LayoutGrid } from "@traiv/ui/icons";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { LibraryOptions } from "@/lib/api/nutrition";
import { useNutritionActions, useRecipes } from "@/lib/query/use-nutrition";
import {
  ALLERGENS,
  DIETS,
  LibraryError,
  LibraryLoading,
  MEALS,
  MultiPick,
  Pagination,
  Pick,
} from "../_components/controls";
import { RecipeCard } from "../_components/recipe-card";
import { RecipePanel } from "../_components/recipe-panel";
export default function RecipesPage() {
  const studioId = useActiveStudioId() ?? "";
  const [opts, setOpts] = useState<LibraryOptions>({ page: 1, sort: "name" });
  const [view, setView] = useState("Grid");
  const [creating, setCreating] = useState(false);
  const query = useRecipes(studioId, opts);
  const actions = useNutritionActions(studioId);
  const router = useRouter();
  const copyIds = useRef<Record<string, string>>({});
  const [actionError, setActionError] = useState("");

  const filter = (v: Partial<LibraryOptions>) => setOpts((old) => ({ ...old, ...v, page: 1 }));
  return (
    <Page className="max-w-none gap-5">
      <StickyPageHeader>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <h1 className="text-display font-medium">Recipes</h1>
          </div>
        </header>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 basis-64 sm:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
            <Input
              aria-label="Search recipes"
              placeholder="Search recipes…"
              className="w-full pl-9"
              value={opts.search ?? ""}
              onChange={(e) => filter({ search: e.target.value })}
            />
          </div>
          <div className="hidden flex-1 sm:block" />
          <Pick
            icon={Sort}
            label="Sort recipes"
            value={opts.sort ?? "name"}
            options={["name", "name-desc", "newest"]}
            onChange={(sort) => filter({ sort })}
          />
          <div
            role="group"
            aria-label="Recipe view"
            className="flex items-center gap-1 rounded-control border border-line bg-sunken p-1"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="List view"
              aria-pressed={view === "List"}
              className={view === "List" ? "bg-surface text-fg shadow-inset" : "text-fg-muted"}
              onClick={() => setView("List")}
            >
              <List className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Grid view"
              aria-pressed={view === "Grid"}
              className={view === "Grid" ? "bg-surface text-fg shadow-inset" : "text-fg-muted"}
              onClick={() => setView("Grid")}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
          <Button disabled={!studioId} onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            New recipe
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <MultiPick
            filter
            icon={Tag}
            label="Tags"
            values={opts.tags?.split(",") ?? []}
            options={[...DIETS, ...ALLERGENS]}
            onChange={(v) => filter({ tags: v.length ? v.join(",") : undefined })}
          />
          <MultiPick
            filter
            icon={ClipboardList}
            label="Meal type"
            values={opts.mealType?.split(",") ?? []}
            options={MEALS}
            onChange={(v) => filter({ mealType: v.length ? v.join(",") : undefined })}
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
      {actionError ? (
        <p role="alert" className="text-body-sm text-danger">
          {actionError}
        </p>
      ) : null}
      {query.isPending ? (
        <LibraryLoading />
      ) : query.isError ? (
        <LibraryError retry={() => query.refetch()} />
      ) : query.data.items.length ? (
        <div
          className={
            view === "Grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col"
          }
        >
          {query.data.items.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              view={view}
              busy={actions.duplicateRecipe.isPending || actions.deleteRecipe.isPending}
              onDuplicate={async () => {
                setActionError("");
                const copyId = copyIds.current[recipe.id] ?? crypto.randomUUID();
                copyIds.current[recipe.id] = copyId;
                try {
                  const copy = await actions.duplicateRecipe.mutateAsync({ id: recipe.id, copyId });
                  delete copyIds.current[recipe.id];
                  router.push(`/nutrition/recipes/${copy.id}`);
                } catch (error) {
                  setActionError(
                    error instanceof Error
                      ? error.message
                      : "Couldn't duplicate the recipe. Try again.",
                  );
                }
              }}
              onDelete={async () => {
                setActionError("");
                try {
                  await actions.deleteRecipe.mutateAsync(recipe.id);
                } catch (error) {
                  setActionError(
                    error instanceof Error
                      ? error.message
                      : "Couldn't delete the recipe. Try again.",
                  );
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 py-12">
          <p className="text-body-sm text-fg-muted">
            No recipes match. Change the filters or create a recipe.
          </p>
          <Button variant="outline" onClick={() => setCreating(true)}>
            New recipe
          </Button>
        </div>
      )}
      {query.data ? (
        <Pagination
          total={query.data.total}
          page={opts.page ?? 1}
          onChange={(page) => setOpts((o) => ({ ...o, page }))}
        />
      ) : null}
      {creating ? (
        <RecipePanel key={studioId} studioId={studioId} close={() => setCreating(false)} />
      ) : null}
    </Page>
  );
}
