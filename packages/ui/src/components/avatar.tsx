"use client";
import {
  AvatarFallback,
  AvatarImage,
  type AvatarSize,
  Avatar as WensityAvatar,
} from "./wensity/avatar";

export { AvatarFallback, AvatarImage } from "./wensity/avatar";

/**
 * WensityAvatar's own size is the `xs`-`xl` enum driving its fixed Tailwind
 * `size-*` classes on the inner circle — passing pixels only ever reached an
 * outer wrapper with no intrinsic size, so the circle silently stayed at the
 * `md` (40px) default regardless of what callers asked for. Snap to the
 * nearest enum step instead of pretending this accepts an arbitrary size.
 */
const SIZE_STEPS: { px: number; size: AvatarSize }[] = [
  { px: 24, size: "xs" },
  { px: 32, size: "sm" },
  { px: 40, size: "md" },
  { px: 48, size: "lg" },
  { px: 64, size: "xl" },
];

function nearestSize(px: number): AvatarSize {
  return SIZE_STEPS.reduce((best, step) =>
    Math.abs(step.px - px) < Math.abs(best.px - px) ? step : best,
  ).size;
}

export function Avatar({
  name,
  size = 34,
  src,
}: {
  name: string;
  size?: number;
  src?: string | null;
}) {
  return (
    <WensityAvatar aria-hidden="true" size={nearestSize(size)}>
      {src ? <AvatarImage src={src} alt="" className="object-cover" /> : null}
      <AvatarFallback tone="neutral">{name}</AvatarFallback>
    </WensityAvatar>
  );
}
