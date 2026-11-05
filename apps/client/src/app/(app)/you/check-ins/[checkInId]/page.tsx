"use client";
import { Button } from "@traiv/ui/components/button";
import { ArrowLeft, Star } from "@traiv/ui/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { checkInDate, Delta } from "@/components/check-in/history-card";
import type { CheckInAnswer } from "@/lib/api";
import { useActiveStudio, useCheckIn } from "@/lib/query";
import { useProfileHistory } from "@/lib/query/use-profile-history";

export default function CheckInDetailPage() {
  const { checkInId } = useParams<{ checkInId: string }>();
  const { studioId } = useActiveStudio();
  const history = useProfileHistory(studioId);
  const detail = useCheckIn(studioId, checkInId);
  const hero = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setCollapsed(!entry?.isIntersecting), {
      threshold: 0,
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [detail.data]);
  if (detail.isPending)
    return <p className="p-10 text-center text-sm text-fg-muted">Loading check-in…</p>;
  if (detail.isError || !detail.data)
    return (
      <div role="alert" className="p-6">
        <p>Couldn't load this check-in.</p>
        <Button variant="outline" onClick={() => void detail.refetch()}>
          Try again
        </Button>
        <Link href="/you/check-ins" className="mt-4 block text-sm underline">
          Back to history
        </Link>
      </div>
    );
  const row = detail.data.checkIn;
  const answers = row.answers;
  const photos = answers.filter((a) => a.imageUrl);
  const ratings = answers.filter((a) => a.ratingValue != null);
  const numbers = answers.filter((a) => a.numberValue != null);
  const notes = answers.filter((a) => a.textValue);
  const average = ratings.length
    ? (ratings.reduce((sum, a) => sum + (a.ratingValue ?? 0), 0) / ratings.length).toFixed(1)
    : "—";
  const index = history.data?.checkIns.findIndex((c) => c.id === checkInId) ?? -1;
  const previous = index >= 0 ? history.data?.checkIns[index + 1] : undefined;
  return (
    <article className="mx-auto w-full max-w-3xl pb-6">
      <header
        className={`sticky top-0 z-20 -mb-16 grid h-16 grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 px-4 transition-colors ${collapsed ? "border-b border-line bg-surface text-fg" : "bg-signal text-signal-fg"}`}
      >
        <Link
          href="/you/check-ins"
          aria-label="Back to check-in history"
          className={`flex size-10 items-center justify-center rounded-full ${collapsed ? "bg-surface shadow-sm" : "bg-black/15"}`}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className={`min-w-0 text-center ${collapsed ? "visible" : "invisible"}`}>
          <p className="text-sm font-semibold">Weekly Check-In</p>
          <p className="mt-0.5 text-xs text-fg-subtle">{checkInDate(row, true)}</p>
        </div>
        <span />
      </header>
      <div ref={hero} className="bg-signal px-5 pt-32 pb-5 text-signal-fg">
        <h1 className="text-2xl font-semibold">Weekly Check-In</h1>
        <p className="mt-1 text-sm opacity-70">{checkInDate(row, true)}</p>
        <dl className="mt-4 grid grid-cols-3 rounded-2xl bg-black/20 py-3 text-center">
          {[
            ["Rating", ratings.length ? `${average} / 5` : "—"],
            ["Photos", photos.length],
            ["Metrics", numbers.length],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs opacity-70">{label}</dt>
              <dd className="mt-1 text-base font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="space-y-4 p-4">
        {photos.length > 0 && <PhotoCarousel photos={photos} />}
        {ratings.length > 0 && (
          <Section title="Ratings">
            <div className="space-y-2">
              {ratings.map((a) => (
                <div
                  key={a.metricId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-3 py-3"
                >
                  <p className="text-sm leading-relaxed">{a.name}</p>
                  <span className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                    <Star className="size-5 fill-current text-warning" />
                    {a.ratingValue?.toFixed(1)} / 5
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}
        {numbers.length > 0 && (
          <Section title="Measurements">
            <dl className="grid grid-cols-2 gap-2">
              {numbers.map((a) => (
                <div
                  key={a.metricId}
                  className="min-w-0 rounded-2xl border border-line bg-panel px-3 py-3"
                >
                  <dt className="text-xs text-fg-subtle">{a.name}</dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {a.numberValue} {a.unit}
                    <Delta
                      value={a.numberValue ?? 0}
                      previous={
                        previous?.answers.find((p) => p.metricId === a.metricId)?.numberValue
                      }
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        )}
        {notes.length > 0 && (
          <Section title="Answers">
            <div className="divide-y divide-line">
              {notes.map((a) => (
                <div key={a.metricId} className="py-3 first:pt-0 last:pb-0">
                  <h3 className="mb-2 text-sm leading-relaxed">{a.name}</h3>
                  <p className="rounded-2xl border border-line bg-panel px-3 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                    {a.textValue}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}
        {!answers.length && (
          <Section title="Check-in">
            <p className="text-sm text-fg-muted">No answers were saved for this check-in.</p>
          </Section>
        )}
      </div>
    </article>
  );
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] bg-surface p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function PhotoCarousel({ photos }: { photos: CheckInAnswer[] }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  return (
    <section className="overflow-hidden rounded-[24px] bg-surface py-5">
      <div className="px-4 sm:px-5">
        <h2 className="text-base font-semibold">Progress Photos</h2>
        <p aria-live="polite" className="mt-1 text-xs text-fg-subtle">
          {photos[active]?.name}
        </p>
      </div>
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          const first = el.firstElementChild as HTMLElement | null;
          if (first)
            setActive(
              Math.min(
                photos.length - 1,
                Math.max(0, Math.round(el.scrollLeft / (first.offsetWidth + 12))),
              ),
            );
        }}
        className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:px-5"
      >
        {photos.map((photo) => (
          <button
            key={photo.metricId}
            type="button"
            aria-label={`View ${photo.name}`}
            onClick={() => setViewing(photo.imageUrl)}
            className="w-full shrink-0 snap-center overflow-hidden rounded-[20px]"
          >
            <img
              src={photo.imageUrl ?? ""}
              alt={photo.name}
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {photos.map((photo, i) => (
          <button
            key={photo.metricId}
            type="button"
            aria-label={`Show ${photo.name}`}
            aria-pressed={active === i}
            onClick={() => {
              const el = scroller.current;
              const child = el?.children[i] as HTMLElement | undefined;
              if (el && child)
                el.scrollTo({
                  left: child.offsetLeft - (el.firstElementChild as HTMLElement).offsetLeft,
                  behavior: "smooth",
                });
            }}
            className="flex size-6 items-center justify-center"
          >
            <span
              className={`block h-2 rounded-full ${active === i ? "w-5 bg-fg-muted" : "w-2 bg-line"}`}
            />
          </button>
        ))}
      </div>
      {viewing && <PhotoViewer url={viewing} onClose={() => setViewing(null)} />}
    </section>
  );
}

import { Dialog, DialogContent, DialogTitle } from "@traiv/ui/components/dialog";

function PhotoViewer({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-auto p-3">
        <DialogTitle className="sr-only">Progress photo</DialogTitle>
        <img
          src={url}
          alt="Check-in progress"
          className="max-h-[80dvh] w-full rounded-xl object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
