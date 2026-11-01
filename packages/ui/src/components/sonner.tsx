"use client";
import type { ReactNode } from "react";
import { createToastManager, ToastProvider, ToastList, type ToastPlacement } from "./wensity/toast";
const manager = createToastManager();
export function toast(
  title: ReactNode,
  options?: { description?: ReactNode; duration?: number; id?: string },
) {
  return manager.add({
    title,
    description: options?.description,
    timeout: options?.duration,
    id: options?.id,
    data: { variant: "info" },
  });
}
export function Toaster({
  theme: _theme,
  position = "bottom-center",
}: {
  theme?: "light" | "dark" | "system";
  position?: ToastPlacement;
}) {
  return (
    <ToastProvider toastManager={manager}>
      <ToastList placement={position} />
    </ToastProvider>
  );
}
