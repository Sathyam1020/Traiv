"use client";
import { useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@traiv/ui/components/select";
import { Field } from "./common";
export function useAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null);
  const lock = useRef(false);
  async function run(fn: () => Promise<unknown>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { busy, error, run };
}
export function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((v) => (
            <SelectItem key={v} value={v}>
              {choiceLabel(v)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function choiceLabel(value: string) {
  const labels: Record<string, string> = {
    default: "Every day",
    current: "Current targets",
    custom: "Custom targets",
    none: "No targets",
    "100g": "Per 100 grams",
    "100ml": "Per 100 ml",
    serving: "Per serving",
    sedentary: "Sedentary",
    light: "Lightly active",
    moderate: "Moderately active",
    very: "Very active",
    extra: "Extremely active",
  };
  if (value.startsWith("weekday:"))
    return (
      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
        Number(value.slice(8))
      ] ?? value
    );
  return labels[value] ?? value.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
}
