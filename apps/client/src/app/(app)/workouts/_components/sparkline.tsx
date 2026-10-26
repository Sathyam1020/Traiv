/**
 * A minimal line chart for a stat with 2+ data points — no charting library for five
 * lines of SVG. Not evidenced by any screenshot (both reference frames only showed the
 * "not enough data points" state), so this is a plain, token-colored line rather than a
 * guess at Coachway's own styling.
 */
export function Sparkline({ values }: { values: number[] }) {
  const width = 280;
  const height = 64;
  const pad = 4;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-16 w-full text-signal"
      role="img"
      aria-label="Progress over time"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={`${i}-${p}`} cx={x} cy={y} r={2.5} fill="currentColor" />;
      })}
    </svg>
  );
}
