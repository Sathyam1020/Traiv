import { Skeleton } from "@traiv/ui/components/skeleton";

/** Reserve the same footprint as the diary or food rows, rather than flashing text. */
export function FoodSkeleton({ diary = false }: { diary?: boolean }) {
  return (
    <div
      role="status"
      aria-label={diary ? "Loading your food diary" : "Loading foods"}
      className="space-y-3"
    >
      <span className="sr-only">{diary ? "Loading your food diary…" : "Loading foods…"}</span>
      {diary ? <Skeleton aria-hidden="true" className="h-44 w-full rounded-3xl" /> : null}
      {Array.from({ length: diary ? 4 : 3 }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="flex items-center gap-3 rounded-2xl bg-surface p-4"
        >
          {!diary ? <Skeleton className="size-11 shrink-0 rounded-xl" /> : null}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-10" />
        </div>
      ))}
    </div>
  );
}
