/**
 * Seven days of training, oldest to today. Gives every row a fingerprint — a gap in
 * training is visible as a gap rather than described in a sentence.
 */
export function WeekStrip({
  week,
  tone = "default",
}: {
  week: boolean[];
  tone?: "default" | "danger";
}) {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {week.map((trained, i) => (
        <span
          key={`${i}-${trained}`}
          className={[
            "w-[6px] rounded-[1.5px]",
            trained
              ? tone === "danger"
                ? "h-4 bg-danger/70"
                : "h-4 bg-brand-text/80"
              : "h-1.5 bg-line-strong",
          ].join(" ")}
        />
      ))}
    </span>
  );
}
