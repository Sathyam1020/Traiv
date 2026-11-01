"use client";
import { Avatar as WensityAvatar, AvatarFallback } from "./wensity/avatar";
export { AvatarImage, AvatarFallback } from "./wensity/avatar";
export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <WensityAvatar
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size <= 28 ? 10 : 11.5 }}
    >
      <AvatarFallback tone="neutral">{name}</AvatarFallback>
    </WensityAvatar>
  );
}
