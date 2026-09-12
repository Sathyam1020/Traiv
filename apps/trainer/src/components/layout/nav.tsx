"use client";

import { CalendarCheck, CreditCard, Dumbbell, Inbox, Users } from "lucide-react";

const items = [
  { label: "Today", icon: CalendarCheck, active: true },
  { label: "Clients", icon: Users, active: false },
  { label: "Plans", icon: Dumbbell, active: false },
  { label: "Inbox", icon: Inbox, active: false, badge: 2 },
  { label: "Payments", icon: CreditCard, active: false },
];

const press =
  "cursor-pointer select-none transition-[background-color,transform] duration-150 " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus";

/** Sidebar from lg up, bottom tab bar below it. Same items, same state, one component. */
export function Nav() {
  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-line bg-sunken lg:flex lg:flex-col">
        <div className="flex h-14 items-center px-5">
          <span className="text-label font-semibold tracking-[-0.015em]">Traiv</span>
        </div>
        <nav className="flex flex-col gap-0.5 px-2.5 py-2">
          {items.map(({ label, icon: Icon, active, badge }) => (
            <button
              key={label}
              type="button"
              className={`flex items-center gap-2.5 rounded-control px-2.5 py-1.5 text-body-sm ${press} ${
                active
                  ? "bg-active font-medium text-fg"
                  : "font-normal text-fg-muted hover:bg-hover hover:text-fg"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge ? (
                <span data-numeric className="text-caption text-fg-subtle">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-canvas/95 backdrop-blur-md lg:hidden">
        {items.map(({ label, icon: Icon, active, badge }) => (
          <button
            key={label}
            type="button"
            className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-caption ${press} ${
              active ? "text-fg" : "text-fg-subtle"
            }`}
          >
            <Icon className="size-[18px]" />
            {label}
            {badge ? (
              <span className="absolute top-2 right-[22%] size-1.5 rounded-full bg-brand" />
            ) : null}
          </button>
        ))}
      </nav>
    </>
  );
}
