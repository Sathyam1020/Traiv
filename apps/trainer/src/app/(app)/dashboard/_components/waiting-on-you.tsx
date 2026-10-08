import { Avatar } from "@traiv/ui/components/avatar";
import type { WaitingCheckin } from "../_lib/roster";
import { press, Section } from "./section";

/** Check-ins with the client's own words leading, so the coach knows what they're opening. */
export function WaitingOnYou({ items }: { items: WaitingCheckin[] }) {
  return (
    <Section label="Waiting on you" count={String(items.length)}>
      <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-surface border border-line bg-surface">
        {items.map((w) => (
          <li key={w.id}>
            <article className={`flex gap-3 p-3.5 ${press}`}>
              <Avatar name={w.name} size={30} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-body-sm font-semibold">{w.name}</span>
                  <span className="shrink-0 text-caption text-fg-subtle">{w.askedAt}</span>
                </div>
                <p className="text-body-sm leading-snug text-fg-muted">{w.excerpt}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
