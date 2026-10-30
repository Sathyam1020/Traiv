"use client";
import { Button } from "@traiv/ui/components/button";
import { Checkbox } from "@traiv/ui/components/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { ChevronDown, ChevronLeft, ChevronRight, type Icon } from "@traiv/ui/icons";
import { type ReactNode, useId } from "react";

export const MEALS = [
  "Breakfast",
  "Morning Snack",
  "Lunch",
  "Afternoon Snack",
  "Dinner",
  "Evening Snack",
];
export const DIETS = [
  "Vegan",
  "Vegetarian",
  "Eggetarian",
  "Pescetarian",
  "Non-Vegetarian",
  "Jain",
  "Pregnancy",
  "PCOS",
  "Diabetic Friendly",
  "High Protein",
  "Low Carbs",
  "Halal",
  "Kosher",
  "Other",
];
export const ALLERGENS = [
  "Contains Peanuts",
  "Gluten",
  "Fish",
  "Shellfish",
  "Eggs",
  "Soy",
  "Nuts",
  "Sesame",
  "Lactose",
  "Dairy",
  "Sugar",
];
export const MICROS: Record<string, string> = {
  fiberG: "Fiber (g)",
  sugarG: "Sugar (g)",
  sodiumMg: "Sodium (mg)",
  saturatedFatG: "Saturated fat (g)",
  cholesterolMg: "Cholesterol (mg)",
  ironMg: "Iron (mg)",
  calciumMg: "Calcium (mg)",
  potassiumMg: "Potassium (mg)",
  vitaminDUg: "Vitamin D (µg)",
  vitaminCMg: "Vitamin C (mg)",
  transFatG: "Trans fat (g)",
  monounsaturatedFatG: "Monounsaturated fat (g)",
  polyunsaturatedFatG: "Polyunsaturated fat (g)",
  omega3G: "Omega-3 (g)",
  omega6G: "Omega-6 (g)",
  saltG: "Salt (g)",
  magnesiumMg: "Magnesium (mg)",
  phosphorusMg: "Phosphorus (mg)",
  zincMg: "Zinc (mg)",
  vitaminAUg: "Vitamin A (µg)",
  vitaminEMg: "Vitamin E (mg)",
  thiaminMg: "Thiamin B1 (mg)",
  riboflavinMg: "Riboflavin B2 (mg)",
  niacinMg: "Niacin B3 (mg)",
  vitaminB6Mg: "Vitamin B6 (mg)",
  folateUg: "Folate B9 (µg)",
  vitaminB12Ug: "Vitamin B12 (µg)",
};
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-body-sm font-medium">{label}</span>
      {children}
      {hint ? <p className="text-caption text-fg-subtle">{hint}</p> : null}
    </div>
  );
}
export function Pick({
  label,
  value,
  options,
  onChange,
  disabled = false,
  icon: IconComponent,
  filterLabel,
}: {
  label: string;
  icon?: Icon;
  filterLabel?: string;
  disabled?: boolean;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label={label}
        className={
          filterLabel
            ? "h-8 w-auto min-w-0 rounded-full border-dashed bg-transparent text-body-sm"
            : "w-auto min-w-0 bg-surface"
        }
      >
        {IconComponent ? <IconComponent className="size-4 shrink-0 text-fg-muted" /> : null}
        {filterLabel && value.startsWith("All ") ? (
          <span>{filterLabel}</span>
        ) : (
          <SelectValue placeholder={label} />
        )}
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        sideOffset={6}
        className="max-h-72 rounded-control border-line bg-raised p-1 data-[state=open]:duration-150 data-[state=closed]:duration-100 motion-reduce:animate-none"
      >
        {options.map((o) => (
          <SelectItem
            value={o}
            key={o}
            className="min-h-9 cursor-pointer rounded-control py-2 pr-8 pl-3 text-body-sm focus:bg-selected focus:text-fg"
          >
            {(
              {
                name: "Name A–Z",
                "name-desc": "Name Z–A",
                newest: "Newest first",
                protein: "Protein",
                carbs: "Carbohydrate",
                fat: "Fat",
                mixed: "Mixed",
                condiment: "Condiment",
                spice: "Spice",
              } as Record<string, string>
            )[o] ?? o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function MultiPick({
  label,
  values,
  options,
  onChange,
  icon: IconComponent,
  filter = false,
}: {
  label: string;
  icon?: Icon;
  filter?: boolean;
  values: string[];
  options: readonly string[];
  onChange: (v: string[]) => void;
}) {
  const id = useId();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={
            filter
              ? "h-8 justify-between rounded-full border-dashed text-body-sm"
              : "w-full min-w-0 justify-between text-body-sm"
          }
        >
          {IconComponent ? <IconComponent className="size-4 shrink-0 text-fg-muted" /> : null}
          <span className="truncate">{label}</span>
          {values.length ? ` (${values.length})` : ""}
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-72 overflow-y-auto rounded-control border-line bg-raised p-1.5 data-[state=open]:duration-150 data-[state=closed]:duration-100 motion-reduce:animate-none"
      >
        {options.map((o) => (
          <label
            key={o}
            htmlFor={`${id}-${encodeURIComponent(o)}`}
            className="flex min-h-9 cursor-pointer items-center gap-2 rounded-control px-3 py-2 hover:bg-hover"
          >
            <Checkbox
              id={`${id}-${encodeURIComponent(o)}`}
              checked={values.includes(o)}
              onCheckedChange={(v) => onChange(v ? [...values, o] : values.filter((x) => x !== o))}
            />
            <span className="text-body-sm">{o}</span>
          </label>
        ))}
        {values.length ? (
          <Button type="button" variant="ghost" className="w-full" onClick={() => onChange([])}>
            Clear selection
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
export function LibraryLoading() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading library">
      {[0, 1, 2, 3, 4].map((n) => (
        <Skeleton key={n} className="h-16 w-full" />
      ))}
    </div>
  );
}
export function LibraryError({
  retry,
  message = "Couldn't load the library. Try again.",
}: {
  retry: () => void;
  message?: string;
}) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 py-8 text-body-sm">
      <p>{message}</p>
      <Button variant="outline" onClick={retry}>
        Try again
      </Button>
    </div>
  );
}
export function Pagination({
  total,
  page,
  perPage = 25,
  onChange,
}: {
  total: number;
  page: number;
  perPage?: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const nearby = page <= 3 ? [1, 2, 3, 4] : [page - 1, page, page + 1];
  const numbers = [...new Set([1, ...nearby, pages])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 text-caption text-fg-muted">
      <span>
        {total
          ? `${(page - 1) * perPage + 1}–${Math.min(page * perPage, total)} of ${total}`
          : "0 results"}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="sm:hidden">
          {page} / {pages}
        </span>
        <div className="hidden items-center gap-1 sm:flex">
          {numbers.map((n, index) => (
            <span key={n} className="flex items-center gap-1">
              {index > 0 && n - (numbers[index - 1] ?? n) > 1 ? (
                <span className="px-2">…</span>
              ) : null}
              <Button
                type="button"
                variant={page === n ? "outline" : "ghost"}
                size="icon"
                className="rounded-full"
                aria-label={`Page ${n}`}
                aria-current={page === n ? "page" : undefined}
                onClick={() => onChange(n)}
              >
                {n}
              </Button>
            </span>
          ))}
        </div>
        <Button variant="ghost" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </footer>
  );
}
