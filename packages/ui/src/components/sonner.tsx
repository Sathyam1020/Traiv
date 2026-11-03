"use client";
import type { ReactNode } from "react";
import {
  createToastManager,
  ToastList,
  type ToastPlacement,
  ToastProvider,
  type ToastVariant,
} from "./wensity/toast";

const manager = createToastManager();
export function toast(
  title: ReactNode,
  options?: { description?: ReactNode; duration?: number; id?: string; variant?: ToastVariant },
) {
  return manager.add({
    title,
    description: options?.description,
    timeout: options?.duration ?? (options?.variant === "error" ? 6500 : 3500),
    id: options?.id,
    data: { variant: options?.variant ?? "info" },
  });
}
export function Toaster({
  theme: _theme,
  position = "bottom-center",
  className,
}: {
  theme?: "light" | "dark" | "system";
  position?: ToastPlacement;
  className?: string;
}) {
  return (
    <ToastProvider toastManager={manager}>
      <ToastList placement={position} className={className} />
    </ToastProvider>
  );
}
