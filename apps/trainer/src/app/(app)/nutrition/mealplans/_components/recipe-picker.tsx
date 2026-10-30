"use client";
import {
  optionConflicts,
  scaleOption,
  type PlanDocument,
  type PlanOption,
  type PlanSlot,
} from "@traiv/nutrition/meal-plans";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@traiv/ui/components/sheet";
import { Plus, Search, Tag } from "@traiv/ui/icons";
import { useState } from "react";
import { mealPlansApi } from "@/lib/api/meal-plans";
import { useRecipes } from "@/lib/query/use-nutrition";
import {
  DIETS,
  LibraryError,
  LibraryLoading,
  MEALS,
  MultiPick,
  Pagination,
  Pick,
} from "../../_components/controls";
export function PlanRecipePicker({
  studioId,
  document,
  slot,
  add,
  close,
}: {
  studioId: string;
  document: PlanDocument;
  slot: PlanSlot;
  add: (option: PlanOption) => void;
  close: () => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [meal, setMeal] = useState(MEALS.includes(slot.name) ? slot.name : "All meal types");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const query = useRecipes(studioId, {
    search,
    page,
    perPage: 20,
    type: document.settings.recipeSourceSetting === "mine" ? "Personal" : undefined,
    tags: tags.length ? tags.join(",") : undefined,
    mealType: meal === "All meal types" ? undefined : meal,
  });
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <SheetContent side="left" className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b border-line px-6 py-5">
          <SheetTitle>Add recipe</SheetTitle>
          <SheetDescription>
            {slot.name} · {slot.options.length} options selected
          </SheetDescription>
        </SheetHeader>
        <div className="flex shrink-0 flex-col gap-3 border-b border-line px-6 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
            <Input
              autoFocus
              className="pl-9"
              aria-label="Search plan recipes"
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <MultiPick
              icon={Tag}
              filter
              label="Tags"
              options={DIETS}
              values={tags}
              onChange={(v) => {
                setTags(v);
                setPage(1);
              }}
            />
            <Pick
              label="Meal type"
              value={meal}
              options={["All meal types", ...MEALS]}
              onChange={(v) => {
                setMeal(v);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {error ? (
            <p role="alert" className="mb-3 text-body-sm text-danger">
              {error}
            </p>
          ) : null}
          {query.isPending ? (
            <LibraryLoading />
          ) : query.isError ? (
            <LibraryError retry={() => query.refetch()} />
          ) : query.data.items.length ? (
            query.data.items.map((recipe) => {
              const added = slot.options.some((o) => o.recipeId === recipe.id);
              const conflicts = optionConflicts(
                { personal: Boolean(recipe.studioId), allergenTags: recipe.allergenTags },
                document.settings,
              );
              return (
                <div key={recipe.id} className="flex items-center gap-3 border-b border-line py-3">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt=""
                      className="size-16 shrink-0 rounded-control object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-medium">{recipe.name}</p>
                    <p className="mt-1 text-caption text-fg-muted">
                      {recipe.nutrition.kcal} kcal · P {recipe.nutrition.proteinG} g · C{" "}
                      {recipe.nutrition.carbsG} g · F {recipe.nutrition.fatG} g
                    </p>
                    {added ? (
                      <p className="mt-1 text-caption text-signal-text">Already in {slot.name}</p>
                    ) : conflicts.length ? (
                      <p className="mt-1 text-caption text-danger">{conflicts.join(" · ")}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label={`Add ${recipe.name}`}
                    disabled={added || Boolean(busy) || Boolean(conflicts.length)}
                    onClick={async () => {
                      setBusy(recipe.id);
                      setError("");
                      try {
                        const option = await mealPlansApi.option(studioId, recipe.id);
                        add(scaleOption(option, document.settings, slot.percentage));
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Couldn't add the recipe.");
                      } finally {
                        setBusy(null);
                      }
                    }}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="py-8 text-body-sm text-fg-muted">
              No matching recipes. Try another search or filter.
            </p>
          )}
        </div>
        {query.data ? (
          <div className="shrink-0 border-t border-line px-6 py-3">
            <Pagination total={query.data.total} page={page} perPage={20} onChange={setPage} />
          </div>
        ) : null}
        <div className="shrink-0 border-t border-line px-6 py-3">
          <Button variant="outline" className="w-full" onClick={close}>
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
