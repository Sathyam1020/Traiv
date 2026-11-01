"use client";
import { Slider as WensitySlider, type SliderProps } from "./wensity/slider";
export function Slider({
  value,
  defaultValue,
  onValueChange,
  ...props
}: Omit<SliderProps, "value" | "defaultValue" | "onValueChange"> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
}) {
  return (
    <WensitySlider
      {...props}
      value={value?.[0]}
      defaultValue={defaultValue?.[0]}
      onValueChange={(n) => onValueChange?.([n])}
    />
  );
}
