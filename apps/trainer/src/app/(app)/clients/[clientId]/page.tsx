"use client";

import { Button } from "@traiv/ui/components/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActiveStudioId } from "@/lib/active-studio";
import { useCheckIns, useClient, useClientOverview, useTags } from "@/lib/query";
import { ClientHeader, ClientHeaderSkeleton } from "../_components/client-header";
import { Overview, OverviewSkeleton } from "../_components/overview/overview";

/**
 * One client.
 *
 * The header and the overview are built. The four remaining tabs it carries are the
 * shape of what comes next.
 *
 * Two requests, not one: the header and the overview are separate so the name and status
 * paint immediately while the aggregate is still in flight. They are separate cache
 * entries for the same reason.
 */
export default function ClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const studioId = useActiveStudioId();
  const client = useClient(studioId, clientId);
  const overview = useClientOverview(studioId, clientId);
  const checkIns = useCheckIns(studioId, clientId);
  const tags = useTags(studioId);

  if (client.isPending) {
    return (
      <div className="flex flex-1 flex-col">
        <ClientHeaderSkeleton />
      </div>
    );
  }

  if (client.isError || !client.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <p className="text-body text-fg-muted">
          We couldn&apos;t find that client. They may have been removed.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/clients">Back to the roster</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <ClientHeader studioId={studioId} client={client.data} tags={tags.data ?? []} />

      {overview.isPending ? (
        <OverviewSkeleton />
      ) : overview.data ? (
        <Overview data={overview.data} checkIns={checkIns.data} />
      ) : (
        <p className="px-6 py-16 text-center text-body-sm text-fg-muted">
          We couldn&apos;t load this client&apos;s overview. Reload to try again.
        </p>
      )}
    </div>
  );
}
