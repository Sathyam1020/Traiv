"use client";
import { Textarea as WensityTextarea, type TextareaProps } from "./wensity/text-area";
import type { Ref } from "react";
export function Textarea({
  className,
  ...props
}: TextareaProps & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <WensityTextarea
      {...props}
      textareaClassName={className}
      autoResize={props.autoResize ?? false}
    />
  );
}
