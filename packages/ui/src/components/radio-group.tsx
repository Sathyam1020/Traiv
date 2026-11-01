"use client";
import {
  RadioGroup as Group,
  RadioOption,
  type RadioGroupProps,
  type RadioOptionProps,
} from "./wensity/radio-group";
export function RadioGroup(props: RadioGroupProps) {
  return <Group {...props} />;
}
export function RadioGroupItem({ className, ...props }: Omit<RadioOptionProps, "label">) {
  return <RadioOption {...props} label={null} className="w-fit" controlClassName={className} />;
}
