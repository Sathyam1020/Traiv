"use client";
import { Button } from "@traiv/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { ArrowRight, Copy, MoreVertical, Salad, Trash } from "@traiv/ui/icons";
import Link from "next/link";
import type { Recipe } from "@/lib/api/nutrition";
import { MacroBars } from "./macro-bars";

export function RecipeCard({
  recipe,
  view,
  busy,
  onDuplicate,
  onDelete,
}: {
  recipe: Recipe;
  view: string;
  busy: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const grid = view === "Grid";
  const href = `/nutrition/recipes/${recipe.id}`;
  return (
    <article
      className={
        grid
          ? "relative min-w-0 overflow-hidden rounded-surface border border-line bg-surface shadow-inset transition-colors hover:border-line-strong"
          : "relative min-w-0 border-b border-line"
      }
    >
      <Link
        href={href}
        aria-label={`Open ${recipe.name}`}
        className={
          grid
            ? "group flex h-full min-w-0 flex-col rounded-surface p-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-focus"
            : "group flex min-w-0 items-start gap-4 rounded-control py-4 pr-14 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-focus"
        }
      >
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt=""
            loading="lazy"
            className={
              grid
                ? "aspect-video w-full rounded-control object-cover"
                : "size-16 shrink-0 rounded-control object-cover"
            }
          />
        ) : (
          <div
            className={
              grid
                ? "flex aspect-video w-full items-center justify-center rounded-control bg-sunken"
                : "flex size-16 shrink-0 items-center justify-center rounded-control bg-sunken"
            }
          >
            <Salad className="size-8 text-fg-subtle" />
          </div>
        )}
        <div
          className={
            grid
              ? "flex flex-1 flex-col gap-2 px-2 pt-3 pb-2"
              : "flex min-w-0 flex-1 flex-col gap-3"
          }
        >
          <h2 className="line-clamp-2 break-words text-body-sm font-semibold text-fg">
            {recipe.name}
          </h2>
          <div className="mt-auto flex flex-col gap-2">
            <p className="text-body text-fg-muted tabular-nums">
              {recipe.nutrition.kcal} kcal<span className="sr-only"> per serving</span>
            </p>
            <MacroBars nutrition={recipe.nutrition} compact={!grid} />
          </div>
        </div>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={busy}
            aria-label={`Actions for ${recipe.name}`}
            className={
              grid
                ? "absolute top-4 right-4 z-10 size-8 rounded-full border-line bg-panel text-fg shadow-inset hover:bg-selected pointer-coarse:size-11"
                : "absolute top-4 right-0 z-10 rounded-full bg-panel text-fg"
            }
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {recipe.studioId ? "Personal recipe" : "System recipe"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={href}>
              <ArrowRight className="size-4" />
              Open recipe
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={busy} onSelect={onDuplicate}>
            <Copy className="size-4" />
            Duplicate recipe
          </DropdownMenuItem>
          {recipe.studioId ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" disabled={busy} onSelect={onDelete}>
                <Trash className="size-4" />
                Delete recipe
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}
