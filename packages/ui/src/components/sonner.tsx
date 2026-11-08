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
  options?: {
    description?: ReactNode;
    duration?: number;
    id?: string;
    variant?: ToastVariant;
    /** A single button inside the toast — e.g. "Refresh" on an update-available prompt. */
    action?: { label: ReactNode; onClick: () => void };
  },
) {
  return manager.add({
    title,
    description: options?.description,
    timeout: options?.duration ?? (options?.variant === "error" ? 6500 : 3500),
    id: options?.id,
    data: { variant: options?.variant ?? "info" },
    ...(options?.action
      ? { actionProps: { children: options.action.label, onClick: options.action.onClick } }
      : {}),
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
