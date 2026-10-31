import type { IconProps } from "@traiv/ui/icons";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
export function FoodNavIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M2 3v6c0 1.5 3 1.5 3 0V3M3.5 3v18M21 3c-2 3-2 7 0 8v10M21 3v8" />
    </svg>
  );
}
export function WorkoutsNavIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M6 12h3l2-5 3 10 2-5h2" />
    </svg>
  );
}
export function TodayNavIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="m2 10 10-8 6 4V3h3v5l1 2M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M9 14c0 4 6 4 6 0" />
    </svg>
  );
}
