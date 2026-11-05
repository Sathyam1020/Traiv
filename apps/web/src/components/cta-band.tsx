import { ClosingCta } from "./marketing-sections";
/** Shared closing action across marketing pages. */
export function CtaBand(_props: {
  source: string;
  title?: string;
  note?: string;
  secondary?: { href: string; label: string };
}) {
  return <ClosingCta />;
}
