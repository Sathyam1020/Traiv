"use client";
import {
  ToggleGroup as Group,
  ToggleGroupItem as Item,
  type ToggleGroupProps,
  type ToggleGroupItemProps,
} from "./wensity/toggle";
import { cn } from "@traiv/ui/lib/cn";
type Size = "default" | "sm" | "lg";
type Props = Omit<ToggleGroupProps, "size" | "onValueChange"> & {
  size?: Size;
  spacing?: number;
  onValueChange?: ((value: string) => void) | ((value: string[]) => void);
};
export function ToggleGroup({
  size = "default",
  spacing,
  className,
  onValueChange,
  type = "single",
  ...props
}: Props) {
  return (
    <Group
      {...props}
      type={type}
      size={size === "default" ? "md" : size}
      className={cn(spacing ? "gap-2" : undefined, className)}
      onValueChange={(value) => {
        if (type === "multiple")
          (onValueChange as ((v: string[]) => void) | undefined)?.(
            Array.isArray(value) ? value : [value],
          );
        else
          (onValueChange as ((v: string) => void) | undefined)?.(
            Array.isArray(value) ? (value[0] ?? "") : value,
          );
      }}
    />
  );
}
export function ToggleGroupItem({
  size = "default",
  ...props
}: Omit<ToggleGroupItemProps, "size"> & { size?: Size }) {
  return <Item {...props} size={size === "default" ? "md" : size} />;
}
