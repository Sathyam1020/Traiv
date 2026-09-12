"use client";

import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** MOCK — replace with real numbers and quotes before launch. */
const stats = [
  { value: "2,400+", label: "Clients coached" },
  { value: "180k+", label: "Sessions logged" },
  { value: "4.9", label: "from coaches", star: true },
];

const quotes = [
  {
    title: "“Cut my Sunday in half”",
    body: "I used to spend three hours rebuilding spreadsheets every weekend. Now I build one plan and send it to everyone. The time I got back goes into actually coaching.",
    name: "Aarav Sharma",
    role: "Online fitness coach, Pune",
    initials: "AS",
  },
  {
    title: "“Nobody disappears quietly now”",
    body: "It tells me who stopped training before they cancel. I've saved four clients this year who I'd have lost without noticing they'd gone quiet.",
    name: "Priya Kulkarni",
    role: "Nutrition coach, Bengaluru",
    initials: "PK",
  },
  {
    title: "“My clients actually use it”",
    body: "Everything arrives on WhatsApp, so there's nothing new for them to learn. That's the only reason it stuck where two other apps didn't.",
    name: "Rohan Das",
    role: "Strength coach, Kolkata",
    initials: "RD",
  },
];

export function AuthAside() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, []);

  const q = quotes[i] ?? quotes[0];
  if (!q) return null;

  return (
    <aside className="hidden flex-col justify-between rounded-panel bg-brand p-10 lg:flex xl:p-14">
      <div />

      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap gap-x-12 gap-y-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-heading font-semibold text-brand-fg tabular-nums tracking-[-0.02em]">
                {s.star ? <Star className="size-5 fill-brand-fg text-brand-fg" /> : null}
                {s.value}
              </span>
              <span className="text-body-sm text-brand-fg/70">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-1" aria-label="Five out of five">
            {Array.from({ length: 5 }, (_, n) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed rating icons
              <Star key={n} className="size-4 fill-brand-fg text-brand-fg" />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease }}
              className="flex flex-col gap-4"
            >
              <p className="text-subheading font-semibold text-brand-fg tracking-[-0.015em]">
                {q.title}
              </p>
              <p className="max-w-[46ch] text-body-sm leading-relaxed text-brand-fg/75">{q.body}</p>
              <figcaption className="flex items-center gap-3 pt-1">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-fg/10 text-caption font-semibold text-brand-fg">
                  {q.initials}
                </span>
                <div className="flex flex-col">
                  <span className="text-body-sm font-semibold text-brand-fg">{q.name}</span>
                  <span className="text-caption text-brand-fg/70">{q.role}</span>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="flex gap-1.5 pt-4">
            {quotes.map((quote, n) => (
              <button
                key={quote.name}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show quote ${n + 1}`}
                aria-current={n === i}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                  n === i ? "w-6 bg-brand-fg" : "w-1.5 bg-brand-fg/30 hover:bg-brand-fg/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-caption text-brand-fg/60">© 2026 Traiv. All rights reserved.</p>
    </aside>
  );
}
