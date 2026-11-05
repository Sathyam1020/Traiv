"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { ArrowLeft } from "@traiv/ui/icons";
import Link from "next/link";
import type { ReactNode } from "react";
export function SettingsPage({
  title,
  children,
  fill = false,
}: {
  title: string;
  children: ReactNode;
  fill?: boolean;
}) {
  return (
    <div
      className={
        fill ? "mx-auto flex w-full max-w-3xl flex-1 flex-col" : "mx-auto w-full max-w-3xl pb-6"
      }
    >
      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-line bg-panel px-4 py-5">
        <Link
          href="/you"
          aria-label="Back to profile"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-medium tracking-tight">{title}</h1>
      </header>
      {children}
    </div>
  );
}
export function SettingSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Select id={id} value={value} onValueChange={onChange} containerClassName="w-full">
      <SelectTrigger aria-label={label} className="h-12 w-full bg-surface">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
