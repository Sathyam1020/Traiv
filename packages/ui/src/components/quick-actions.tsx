"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Plus, X } from "@traiv/ui/icons";
import type { ComponentType } from "react";

export type QuickAction = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect: () => void;
  disabled?: boolean;
};

const position =
  "fixed right-4 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:right-[max(1.5rem,calc((100vw-48rem)/2+1.5rem))] lg:bottom-6";
const circle =
  "flex size-14 shrink-0 items-center justify-center rounded-full shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4";

/** Modal action launcher: Base UI owns focus trapping, Escape, outside press and scroll lock. */
export function QuickActions({
  open,
  onOpenChange,
  actions,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: QuickAction[];
  message?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        aria-label="Quick actions"
        className={`${position} ${circle} z-20 bg-signal text-signal-fg transition-transform motion-reduce:transition-none hover:scale-105`}
      >
        <Plus className="size-7" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-20 bg-black/15 backdrop-blur-md transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          className={`${position} z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 outline-none transition-[opacity,transform] duration-150 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none`}
        >
          <Dialog.Title className="sr-only">Quick actions</Dialog.Title>
          <Dialog.Description className="sr-only">
            Start a check-in or add a measurement.
          </Dialog.Description>
          {message && (
            <p
              role="status"
              className="max-w-64 rounded-2xl bg-surface p-3 text-sm text-fg shadow-lg"
            >
              {message}
            </p>
          )}
          {actions.map(({ label, icon: Icon, onSelect, disabled }) => (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={onSelect}
              className="group flex items-center gap-3 rounded-full text-fg outline-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4"
            >
              <span className="rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-sm group-hover:bg-hover">
                {label}
              </span>
              <span className={`${circle} bg-surface group-hover:bg-hover`}>
                <Icon className="size-6" />
              </span>
            </button>
          ))}
          <Dialog.Close
            aria-label="Close quick actions"
            className={`${circle} bg-signal text-signal-fg`}
          >
            <X className="size-7" />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
