"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { MessageSquareText } from "lucide-react";
import { motion } from "motion/react";
import { WeekStrip } from "@/components/common/week-strip";
import type { AtRiskClient } from "../_lib/roster";
import { press, Section } from "./section";

const ease = [0.16, 1, 0.3, 1] as const;

/** The reason this screen exists: who is about to quit, and why. */
export function NeedsYou({ clients }: { clients: AtRiskClient[] }) {
  return (
    <Section label="Needs you" count={String(clients.length)}>
      <ul className="flex flex-col gap-2">
        {clients.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease, delay: 0.09 + i * 0.05 }}
          >
            <article
              className={`overflow-hidden rounded-surface border border-line bg-surface ${press}`}
            >
              <div className="flex items-start gap-3 p-3.5 pb-3">
                <Avatar name={c.name} />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate text-body font-semibold tracking-[-0.01em]">
                    {c.name}
                  </span>
                  <p className="text-body-sm leading-snug text-fg-muted">{c.reason}</p>
                </div>
                {/* The number is the point, so it gets the size. */}
                <div className="flex shrink-0 flex-col items-end pl-1">
                  <span
                    className={`text-[26px] font-semibold leading-none tabular-nums tracking-[-0.03em] ${
                      c.severity === "high" ? "text-danger" : "text-warning"
                    }`}
                  >
                    {c.days}
                  </span>
                  <span className="pt-1 text-caption text-fg-subtle">
                    {c.days === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>

              <footer className="flex items-center justify-between gap-3 border-t border-line bg-sunken px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <WeekStrip week={c.week} tone="danger" />
                  <span className="text-caption text-fg-muted">Last trained {c.lastTrained}</span>
                </div>
                <span className="flex items-center gap-1.5 text-caption font-medium text-brand-text">
                  <MessageSquareText className="size-3.5" />
                  Send a note
                </span>
              </footer>
            </article>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
