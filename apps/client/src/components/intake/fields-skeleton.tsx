/** A few pulsing rows — for a step whose fields depend on data that has to load first
 * (the studio's measurement catalog, current settings), so the screen never pops from
 * empty straight to populated with nothing in between. */
export function FieldsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, n) => n).map((n) => (
        <div key={n} className="h-14 w-full animate-pulse rounded-control bg-sunken" />
      ))}
    </div>
  );
}
