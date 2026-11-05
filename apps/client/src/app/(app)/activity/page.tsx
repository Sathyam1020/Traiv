"use client";
import { useActiveNav } from "@traiv/ui/components/shell/nav-override-context";
import { Button } from "@traiv/ui/components/button";
import { ArrowLeft } from "@traiv/ui/icons";
import Link from "next/link";
import { useState } from "react";
import { useActiveStudio } from "@/lib/query";
import { useActivityList } from "@/lib/query/use-activity";
import { ActivityCard } from "../dashboard/_components/recent-activity";
export default function ActivityHistory() {
  useActiveNav("/dashboard");
  const { studioId } = useActiveStudio();
  const [page, setPage] = useState(1);
  const list = useActivityList(studioId, page);
  return (
    <main className="mx-auto w-full max-w-3xl pb-5">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-panel px-4 py-5">
        <Link
          href="/dashboard"
          aria-label="Back to Today"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-medium tracking-tight">Recent activity</h1>
      </header>
      <div className="space-y-3 p-4">
        {list.isPending ? (
          <p className="py-8 text-center text-sm text-fg-muted">Loading activity…</p>
        ) : list.isError ? (
          <div role="alert">
            <p>Couldn't load activity.</p>
            <Button variant="outline" onClick={() => void list.refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            {list.data.activities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
            {!list.data.activities.length && (
              <p className="py-8 text-center text-sm text-fg-muted">No completed activities yet.</p>
            )}
            {(page > 1 || list.data.hasMore) && (
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="py-2 text-sm text-fg-muted">Page {page}</span>
                <Button
                  variant="outline"
                  disabled={!list.data.hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
