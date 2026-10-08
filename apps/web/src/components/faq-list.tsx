import type { Question } from "@/content/faq";

/**
 * Questions and answers as a description list, open.
 *
 * Not an accordion. Six answers a coach wants before they trust the price should not need
 * six clicks, and a closed accordion is also invisible to anybody skim-reading on a phone.
 */
export function FaqList({ items }: { items: readonly Question[] }) {
  return (
    <dl className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.q}
          className="grid gap-2 border-t border-line py-7 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:gap-10"
        >
          <dt className="text-body font-semibold">{item.q}</dt>
          <dd className="max-w-[42rem] text-body-sm leading-relaxed text-fg-muted">{item.a}</dd>
        </div>
      ))}
    </dl>
  );
}
