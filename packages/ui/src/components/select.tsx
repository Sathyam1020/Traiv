"use client";

import * as React from "react";
import {
  Select as WensitySelect,
  type SelectProps as WensityProps,
  type SelectOption,
  type SelectGroup as WensityGroup,
} from "./wensity/select";

type PartProps = {
  children?: React.ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  size?: "sm" | "default";
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
};
export function SelectItem(_props: PartProps & { value: string }) {
  return null;
}
export function SelectTrigger(_props: PartProps) {
  return null;
}
export function SelectValue(_props: PartProps) {
  return null;
}
export function SelectContent(
  _props: PartProps & {
    align?: "start" | "end" | "center";
    position?: "popper" | "item-aligned";
    side?: "top" | "bottom" | "left" | "right";
    sideOffset?: number;
    onCloseAutoFocus?: (event: Event) => void;
  },
) {
  return null;
}
export function SelectGroup(_props: PartProps) {
  return null;
}
export function SelectLabel(_props: PartProps) {
  return null;
}
export function SelectSeparator(_props: PartProps) {
  return null;
}
function find(children: React.ReactNode, type: unknown): PartProps | undefined {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<PartProps>(child)) continue;
    if (child.type === type) return child.props;
    const nested = find(child.props.children, type);
    if (nested) return nested;
  }
  return undefined;
}
function options(children: React.ReactNode): SelectOption[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<PartProps>(child)) return [];
    if (child.type === SelectItem && child.props.value !== undefined)
      return [
        { value: child.props.value, label: child.props.children, disabled: child.props.disabled },
      ];
    return options(child.props.children);
  });
}
export function Select({
  children,
  ...props
}: Omit<WensityProps, "options"> & { children?: React.ReactNode }) {
  const trigger = find(children, SelectTrigger);
  const content = find(children, SelectContent);
  const display = find(children, SelectValue);
  const triggerChildren = React.Children.toArray(trigger?.children).filter(
    (child) => React.isValidElement(child) && child.type !== SelectValue,
  );
  const leadingIcon = triggerChildren.find(
    (child) => React.isValidElement(child) && child.type !== "span",
  );
  const displayLabel = triggerChildren.find(
    (child) => React.isValidElement(child) && child.type === "span",
  );
  const groups: WensityGroup[] = [];
  function collect(nodes: React.ReactNode) {
    for (const child of React.Children.toArray(nodes)) {
      if (!React.isValidElement<PartProps>(child)) continue;
      if (child.type === SelectGroup)
        groups.push({
          label: find(child.props.children, SelectLabel)?.children,
          options: options(child.props.children),
        });
      else collect(child.props.children);
    }
  }
  collect(children);
  const all = options(children);
  const groupedValues = new Set(
    groups.flatMap((group) => group.options.map((option) => option.value)),
  );
  const ungrouped = all.filter((option) => !groupedValues.has(option.value));
  return (
    <WensitySelect
      {...props}
      fullWidth={props.fullWidth ?? false}
      containerClassName={[
        "inline-flex min-w-0 shrink-0 align-middle",
        trigger?.className
          ?.split(/\s+/)
          .filter((name) =>
            /^(?:(?:sm|md|lg|xl|2xl):)*(?:w-|min-w-|max-w-|flex-|shrink-|grow|basis-|self-|col-|mx-|ml-|mr-)/.test(
              name,
            ),
          )
          .join(" "),
        props.containerClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      options={
        groups.length ? [...(ungrouped.length ? [{ options: ungrouped }] : []), ...groups] : all
      }
      id={props.id ?? trigger?.id}
      placeholder={props.placeholder ?? display?.placeholder}
      aria-label={props["aria-label"] ?? trigger?.["aria-label"]}
      aria-labelledby={props["aria-labelledby"] ?? trigger?.["aria-labelledby"]}
      aria-describedby={props["aria-describedby"] ?? trigger?.["aria-describedby"]}
      aria-invalid={props["aria-invalid"] ?? trigger?.["aria-invalid"]}
      leadingIcon={props.leadingIcon ?? leadingIcon}
      displayLabel={displayLabel}
      triggerClassName={trigger?.className}
      contentClassName={content?.className}
      selectSize={trigger?.size === "sm" ? "sm" : "md"}
    />
  );
}
