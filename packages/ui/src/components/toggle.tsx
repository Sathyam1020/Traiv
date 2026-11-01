"use client";
import {
  Toggle as WensityToggle,
  toggleVariants as variants,
  type ToggleProps,
} from "./wensity/toggle";
export function Toggle({
  size = "default",
  ...props
}: Omit<ToggleProps, "size"> & { size?: "default" | "sm" | "lg" }) {
  return <WensityToggle {...props} size={size === "default" ? "md" : size} />;
}
export const toggleVariants = variants;
