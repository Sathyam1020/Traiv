"use client";
import { Badge as WensityBadge, badgeVariants as variants, type BadgeProps } from "./wensity/badge";
type Variant = "default" | "secondary" | "signal" | "destructive" | "outline" | "ghost" | "link";
const map: Record<Variant, BadgeProps["variant"]> = {
  default: "neutral",
  secondary: "neutral",
  signal: "brand",
  destructive: "danger",
  outline: "outline",
  ghost: "neutral",
  link: "brand",
};
export function Badge({
  variant = "default",
  ...props
}: Omit<BadgeProps, "variant"> & { variant?: Variant }) {
  return <WensityBadge {...props} variant={map[variant]} radius="pill" />;
}
export function badgeVariants({
  variant = "default",
  ...props
}: {
  variant?: Variant;
  size?: BadgeProps["size"];
  className?: string;
  radius?: BadgeProps["radius"];
} = {}) {
  return variants({ ...props, variant: map[variant] });
}
