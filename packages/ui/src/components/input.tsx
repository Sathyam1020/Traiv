"use client";
import { Input as WensityInput, type InputProps } from "./wensity/input";
export function Input(props: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <WensityInput nativeLayout {...props} />;
}
