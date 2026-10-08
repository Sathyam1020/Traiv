"use client";

import { Page } from "@traiv/ui/components/shell/page";
import { motion } from "motion/react";
import { NeedsYou } from "./_components/needs-you";
import { OnTrack } from "./_components/on-track";
import { WaitingOnYou } from "./_components/waiting-on-you";
import { atRisk, roster, summary, waiting } from "./_lib/roster";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The coach's home. Not a grid of stat tiles — it opens on the people who need them
 * today, because catching a client in week two rather than week four is the whole point.
 *
 * Still reading mock data from `_lib/roster`; real queries land with the roster feature.
 */
export default function DashboardPage() {
  return (
    <Page className="gap-8 py-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="flex flex-col gap-2 px-1 lg:flex-row lg:items-end lg:justify-between"
      >
        <h1 className="text-display font-semibold tracking-[-0.025em]">Three people need you.</h1>
        <p className="text-body-sm tabular-nums text-fg-muted">
          <span className="font-semibold text-fg">{summary.trainedThisWeek}</span> of{" "}
          <span className="font-semibold text-fg">{summary.total}</span> trained this week
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:gap-6">
        <NeedsYou clients={atRisk} />
        <WaitingOnYou items={waiting} />
      </div>

      <OnTrack roster={roster} total={summary.total} />
    </Page>
  );
}
