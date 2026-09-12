import { initials } from "@/components/common/initials";

export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size <= 28 ? 10 : 11.5 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-sunken font-semibold tracking-[0.02em] text-fg-muted inset-ring-1 inset-ring-line"
    >
      {initials(name)}
    </span>
  );
}
