/** One segment per exercise, filling as that exercise's sets complete. */
export function SegmentedProgress({ fractions }: { fractions: number[] }) {
  return (
    <div className="flex gap-1">
      {fractions.map((f, i) => (
        <div key={`${i}-${f}`} className="h-1 flex-1 overflow-hidden rounded-full bg-brand-fg/25">
          <div
            className="h-full rounded-full bg-brand-fg transition-[width] duration-300"
            style={{ width: `${Math.round(f * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
}
