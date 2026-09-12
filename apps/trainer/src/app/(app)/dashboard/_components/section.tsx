export function Section({
  label,
  count,
  children,
}: {
  label: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between px-1 pb-2">
        <h2 className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
          {label}
        </h2>
        {count ? <span className="text-caption text-fg-subtle">{count}</span> : null}
      </div>
      {children}
    </section>
  );
}

/** Touch-first press feedback. Hover is a desktop bonus, not the primary affordance. */
export const press =
  "cursor-pointer select-none transition-[background-color,transform] duration-150 " +
  "active:scale-[0.99] hover:bg-hover active:bg-active " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus";
