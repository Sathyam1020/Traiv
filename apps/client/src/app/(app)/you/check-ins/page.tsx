"use client";
import { Button } from "@traiv/ui/components/button";
import { ArrowLeft } from "@traiv/ui/icons";
import Link from "next/link";
import { HistoryCard } from "@/components/check-in/history-card";
import { useActiveStudio } from "@/lib/query";
import { useProfileHistory } from "@/lib/query/use-profile-history";
export default function CheckInHistoryPage() {
  const { studioId } = useActiveStudio();
  const history = useProfileHistory(studioId);
  return (
    <div className="mx-auto w-full max-w-3xl pb-6">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-panel px-4 py-5">
        <Link
          href="/you"
          aria-label="Back to profile"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-medium tracking-tight">Check-in History</h1>
      </header>
      <div className="space-y-3 p-4">
        {history.isPending ? (
          <p className="py-12 text-center text-sm text-fg-muted">Loading check-ins…</p>
        ) : history.isError ? (
          <div role="alert" className="p-5">
            <p>Couldn't load your history.</p>
            <Button variant="outline" onClick={() => void history.refetch()}>
              Try again
            </Button>
          </div>
        ) : history.data?.checkIns.length ? (
          history.data.checkIns.map((row, i) => (
            <HistoryCard key={row.id} row={row} previous={history.data.checkIns[i + 1]} />
          ))
        ) : (
          <p className="rounded-[20px] bg-surface p-6 text-sm text-fg-muted">
            Your completed check-ins will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
