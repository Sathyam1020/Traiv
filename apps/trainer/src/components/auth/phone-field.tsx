import { Label } from "@traiv/ui/components/label";

/**
 * Ten digits with a fixed +91. India-only for now, so the country code is a label rather
 * than a picker — a picker implies choice we don't support yet.
 */
export function PhoneField({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="phone">Phone number</Label>
      <div className="flex items-stretch gap-2">
        <span className="flex items-center gap-1.5 rounded-control border border-line-strong bg-surface px-2.5 text-body-sm tabular-nums text-fg-muted">
          <span aria-hidden="true">🇮🇳</span> +91
        </span>
        <input
          id="phone"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="98765 43210"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="h-10 min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-3 text-body-sm tabular-nums outline-none placeholder:text-fg-subtle focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-line-focus"
        />
      </div>
      {hint ? <p className="text-caption text-fg-subtle">{hint}</p> : null}
    </div>
  );
}
