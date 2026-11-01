"use client";
import { Calendar as WensityCalendar, type CalendarProps } from "./wensity/calendar";
import type { Matcher } from "react-day-picker";
function matches(date: Date, matcher: Matcher): boolean {
  if (typeof matcher === "boolean") return matcher;
  if (typeof matcher === "function") return matcher(date);
  if (matcher instanceof Date) return date.toDateString() === matcher.toDateString();
  if (Array.isArray(matcher)) return matcher.some((d) => d.toDateString() === date.toDateString());
  if ("dayOfWeek" in matcher) return matcher.dayOfWeek.includes(date.getDay());
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if ("before" in matcher && "after" in matcher)
    return day < matcher.before.getTime() && day > matcher.after.getTime();
  if ("before" in matcher) return day < matcher.before.getTime();
  if ("after" in matcher) return day > matcher.after.getTime();
  if ("from" in matcher)
    return Boolean(
      matcher.from && day >= matcher.from.getTime() && (!matcher.to || day <= matcher.to.getTime()),
    );
  return false;
}
type Props = Omit<Extract<CalendarProps, { mode?: "single" }>, "disabled"> & {
  disabled?: Matcher | Matcher[];
  autoFocus?: boolean;
  showOutsideDays?: boolean;
  captionLayout?: string;
  buttonVariant?: string;
};
export function Calendar({
  disabled,
  autoFocus: _autoFocus,
  showOutsideDays: _outside,
  captionLayout: _caption,
  buttonVariant: _button,
  ...props
}: Props) {
  return (
    <WensityCalendar
      {...props}
      disabled={
        disabled === undefined
          ? undefined
          : (day) => (Array.isArray(disabled) ? disabled : [disabled]).some((m) => matches(day, m))
      }
    />
  );
}
