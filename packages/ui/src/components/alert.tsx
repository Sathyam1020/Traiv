"use client";
import { Alert as WensityAlert, type AlertProps } from "./wensity/alert";
export { AlertTitle, AlertDescription } from "./wensity/alert";
export function Alert({
  variant = "default",
  ...props
}: Omit<AlertProps, "variant"> & { variant?: "default" | "destructive" }) {
  return <WensityAlert {...props} variant={variant === "destructive" ? "error" : "neutral"} />;
}
