"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { useStudios, useSwitchStudio } from "@/lib/query";

/**
 * A trainer always has at least one studio — their own. With only one there is nothing to
 * switch, so it renders as plain text rather than a control that does nothing.
 */
export function StudioSwitcher() {
  const { data } = useStudios();
  const switchStudio = useSwitchStudio();

  const studios = data?.studios ?? [];
  const active = studios.find((s) => s.id === data?.activeStudioId);
  if (!active) return null;

  if (studios.length === 1) {
    return (
      <span className="truncate text-body-sm font-medium" title={active.name}>
        {active.name}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={switchStudio.isPending}
        className="flex max-w-[12rem] cursor-pointer items-center gap-1.5 rounded-control px-2 py-1 text-body-sm font-medium transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
      >
        <span className="truncate">{active.name}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-fg-subtle" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {studios.map((s) => (
          <DropdownMenuItem
            key={s.id}
            onClick={() => s.id !== active.id && switchStudio.mutate(s.id)}
            className="flex items-center gap-2"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate">{s.name}</span>
              <span className="text-caption text-fg-subtle">
                {s.role === "owner" ? "Your studio" : "Coach"} · {s.tier}
              </span>
            </div>
            {s.id === active.id ? <Check className="size-4 shrink-0 text-brand-text" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
