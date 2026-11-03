/** One segment per exercise, filling as that exercise's sets complete. */
export function SegmentedProgress({ fractions }: { fractions: number[] }) {
  return (
    <div
      className="flex gap-1"
      role="progressbar"
      aria-label="Workout progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={
        fractions.length
          ? Math.round((fractions.reduce((sum, f) => sum + f, 0) / fractions.length) * 100)
          : 0
      }
    >
      {fractions.map((f, i) => (
        <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-brand-fg/25">
          <div
            className="h-full rounded-full bg-brand-fg transition-transform duration-200 motion-reduce:transition-none"
            style={{ transform: `scaleX(${Math.max(0, Math.min(1, f))})`, transformOrigin: "left" }}
          />
        </div>
      ))}
    </div>
  );
}
