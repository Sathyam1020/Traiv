"use client";

import { RailTip, useRailCollapsed } from "@traiv/ui/components/shell/rail";
import { useActiveStudioId } from "@/lib/active-studio";
import { useStudios } from "@/lib/query";
import { StudioSwitcher } from "./studio-switcher";
import { ThemeToggle } from "./theme-toggle";

export function OrganisationBrand() {
  const { data } = useStudios();
  const activeId = useActiveStudioId();
  const collapsed = useRailCollapsed();
  const active = data?.studios.find((studio) => studio.id === activeId);
  const name = active?.name || "Your organisation";
  const words = name.trim().split(/\s+/u);
  const initials = (
    words.length > 1
      ? words
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
      : name.slice(0, 2)
  ).toUpperCase();
  const badge = (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-control bg-signal text-caption font-semibold text-signal-fg">
      {initials}
      {active?.brandLogoUrl ? (
        <img
          key={active.brandLogoUrl}
          src={active.brandLogoUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </span>
  );
  if (collapsed)
    return (
      <div className="flex flex-col items-center gap-1">
        <RailTip label={`${name} · Traiv`}>{badge}</RailTip>
        <ThemeToggle tone="rail" />
      </div>
    );
  return (
    <div className="flex items-center gap-3 px-2.5 py-1">
      {badge}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="truncate text-label font-semibold text-contrast-fg">
          <StudioSwitcher tone="rail" />
        </div>
        <span className="text-caption text-contrast-fg/70">Traiv</span>
      </div>
      <ThemeToggle tone="rail" />
    </div>
  );
}
