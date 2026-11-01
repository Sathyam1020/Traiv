"use client";
import {
  Button as WensityButton,
  buttonVariants as wensityVariants,
  type ButtonProps as WensityProps,
} from "./wensity/button";
import { cn } from "@traiv/ui/lib/cn";
import type { Ref } from "react";
type Size = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
const sizes: Record<Size, string> = {
  default: "pointer-coarse:min-h-11",
  xs: "h-6 px-2 text-caption",
  sm: "pointer-coarse:min-h-10",
  lg: "pointer-coarse:min-h-12",
  icon: "size-9 pointer-coarse:size-11",
  "icon-xs": "size-6 p-0",
  "icon-sm": "size-8 p-0 pointer-coarse:size-10",
  "icon-lg": "size-10 p-0 pointer-coarse:size-12",
};
function mapSize(size: Size): WensityProps["size"] {
  return size.startsWith("icon")
    ? "icon"
    : size === "lg"
      ? "lg"
      : size === "sm" || size === "xs"
        ? "sm"
        : "md";
}
export function buttonVariants({
  size = "default",
  className,
  ...props
}: {
  variant?: WensityProps["variant"];
  className?: string;
  size?: Size | null;
} = {}) {
  const selected = size ?? "default";
  return cn(wensityVariants({ ...props, size: mapSize(selected) }), sizes[selected], className);
}
export function Button({
  size = "default",
  className,
  ...props
}: Omit<WensityProps, "size"> & { size?: Size; ref?: Ref<HTMLButtonElement> }) {
  return <WensityButton {...props} size={mapSize(size)} className={cn(sizes[size], className)} />;
}
