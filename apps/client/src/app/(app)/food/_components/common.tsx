"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Carbs, Fat, Protein } from "@traiv/ui/icons";
import { cloneElement, isValidElement, type ReactNode, useEffect, useId } from "react";
import { isApiError } from "@/lib/api/client";
import type { Nutrients } from "@/lib/api/food";
export const card = "rounded-surface border border-line bg-surface p-4";
export function Panel({
  title,
  description,
  children,
  onClose,
  footer,
  eyebrow,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] rounded-t-surface p-0 sm:mx-auto sm:max-w-xl"
      >
        {eyebrow ? (
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-1 w-8 shrink-0 rounded-full bg-line-strong"
          />
        ) : null}
        <SheetHeader className={eyebrow ? "shrink-0 pr-12" : "shrink-0 border-b border-line pr-10"}>
          {eyebrow ? (
            <div className="text-caption font-semibold uppercase text-signal-text">{eyebrow}</div>
          ) : null}
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className={eyebrow && !description ? "sr-only" : undefined}>
            {description ?? "Your nutrition"}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-6">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-line bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
export function Macros({ value }: { value: Nutrients }) {
  return (
    <div className="flex flex-wrap gap-4 text-caption text-fg-muted">
      <span className="flex items-center gap-1">
        <Protein className="size-4 text-macro-protein" />
        {Math.round(value.proteinG * 10) / 10} g
      </span>
      <span className="flex items-center gap-1">
        <Carbs className="size-4 text-macro-carbs" />
        {Math.round(value.carbsG * 10) / 10} g
      </span>
      <span className="flex items-center gap-1">
        <Fat className="size-4 text-macro-fat" />
        {Math.round(value.fatG * 10) / 10} g
      </span>
    </div>
  );
}
export function ErrorText({
  error,
  message = "Couldn't save your changes. Try again.",
}: {
  error: unknown;
  message?: string;
}) {
  useEffect(() => {
    if (error) console.error("Nutrition request failed", error);
  }, [error]);
  const detail =
    isApiError(error) && error.status === 401
      ? "Your session has expired. Sign in again to continue."
      : isApiError(error) && error.status === 403
        ? "This action isn't available for your account."
        : message;
  return error ? (
    <p role="alert" className="my-3 text-body-sm leading-relaxed text-danger">
      {detail}
    </p>
  ) : null;
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  const generatedId = useId();
  const control = isValidElement<{ id?: string }>(children) ? children : null;
  const id = control?.props.id ?? generatedId;
  return (
    <div className="flex min-w-0 flex-col gap-2 text-body-sm">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {control ? cloneElement(control, { id }) : children}
    </div>
  );
}

export function NutritionRing({ value }: { value: Nutrients }) {
  const total = value.proteinG * 4 + value.carbsG * 4 + value.fatG * 9;
  const segments = [
    { value: value.proteinG * 4, color: "text-macro-protein" },
    { value: value.carbsG * 4, color: "text-macro-carbs" },
    { value: value.fatG * 9, color: "text-macro-fat" },
  ];
  let offset = 0;
  return (
    <div className="relative mx-auto flex size-36 items-center justify-center">
      <svg viewBox="0 0 144 144" className="absolute inset-0 size-36 -rotate-90" aria-hidden="true">
        <circle cx="72" cy="72" r="62" fill="none" className="stroke-line" strokeWidth="10" />
        {segments.map((s, i) => {
          const percent = total ? (s.value / total) * 100 : 0;
          const start = offset;
          offset += percent;
          return (
            <circle
              key={i}
              cx="72"
              cy="72"
              r="62"
              fill="none"
              stroke="currentColor"
              className={s.color}
              strokeWidth="10"
              pathLength="100"
              strokeDasharray={`${percent} 100`}
              strokeDashoffset={-start}
            />
          );
        })}
      </svg>
      <div className="text-center">
        <span className="block text-heading font-semibold tabular-nums">
          {Math.round(value.kcal)}
        </span>
        <span className="text-caption text-fg-muted">kcal</span>
      </div>
    </div>
  );
}
