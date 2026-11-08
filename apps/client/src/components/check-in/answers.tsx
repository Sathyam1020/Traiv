"use client";

import { Star } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import type { CheckInAnswer } from "@/lib/api";

/**
 * A submitted check-in, read back.
 *
 * Grouped by how a value is read rather than by metric type: photos want to be looked
 * at side by side, numbers want to line up, and a written note wants the width of a
 * paragraph. Coachway's detail screen makes the same three cuts — photo carousel,
 * then ratings and measurements, then text.
 */
export function CheckInAnswers({ answers }: { answers: CheckInAnswer[] }) {
  if (answers.length === 0) {
    return (
      <p className="rounded-surface border border-line border-dashed bg-surface p-4 text-body-sm text-fg-muted">
        Nothing was answered on this one.
      </p>
    );
  }

  const photos = answers.filter((a) => a.imageUrl);
  const numbers = answers.filter((a) => a.numberValue !== null);
  const ratings = answers.filter((a) => a.ratingValue !== null);
  const notes = answers.filter((a) => a.textValue);

  return (
    <div className="flex flex-col gap-6">
      {photos.length > 0 ? (
        <section className="flex flex-col gap-2">
          <Heading>Photos</Heading>
          {/* Scrolls in its own container so three photos never push the page sideways. */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((a) => (
              <figure key={a.metricId} className="flex w-36 shrink-0 flex-col gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.imageUrl ?? ""}
                  alt={a.name}
                  className="aspect-[3/4] w-full rounded-surface border border-line object-cover"
                />
                <figcaption className="text-caption text-fg-subtle">{a.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {numbers.length > 0 || ratings.length > 0 ? (
        <section className="flex flex-col gap-2">
          <Heading>Numbers</Heading>
          <dl className="flex flex-col divide-y divide-line overflow-hidden rounded-surface border border-line bg-surface">
            {numbers.map((a) => (
              <Row key={a.metricId} label={a.name}>
                <span className="tabular-nums">{a.numberValue}</span>
                {a.unit ? <span className="text-fg-subtle"> {a.unit}</span> : null}
              </Row>
            ))}
            {ratings.map((a) => (
              <Row key={a.metricId} label={a.name}>
                <Stars value={a.ratingValue ?? 0} />
              </Row>
            ))}
          </dl>
        </section>
      ) : null}

      {notes.length > 0 ? (
        <section className="flex flex-col gap-2">
          <Heading>Notes</Heading>
          {notes.map((a) => (
            <div
              key={a.metricId}
              className="flex flex-col gap-1 rounded-surface border border-line bg-surface p-4"
            >
              <span className="text-caption text-fg-subtle">{a.name}</span>
              {/* `pre-wrap` because somebody's paragraph breaks are part of what they said. */}
              <p className="whitespace-pre-wrap text-body-sm leading-relaxed">{a.textValue}</p>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

const Heading = ({ children }: { children: string }) => (
  <h2 className="text-caption font-semibold uppercase tracking-[0.08em] text-fg-subtle">
    {children}
  </h2>
);

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="min-w-0 truncate text-body-sm text-fg-muted">{label}</dt>
      <dd className="shrink-0 text-body-sm font-medium">{children}</dd>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn("size-3.5", n <= value ? "fill-current text-brand" : "text-fg-subtle/40")}
        />
      ))}
    </span>
  );
}
