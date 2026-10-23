"use client";

import { Button } from "@traiv/ui/components/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActiveStudioId } from "@/lib/active-studio";
import { useClient, useTags } from "@/lib/query";
import { ClientHeader, ClientHeaderSkeleton } from "../_components/client-header";

/**
 * One client.
 *
 * Only the header exists so far. The five tabs it carries are the shape of what comes
 * next, and the body below says which one is being built rather than filling the space
 * with cards that have no data behind them — the roster already taught us that a panel
 * with nothing in it reads as broken rather than as unfinished.
 */
export default function ClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const studioId = useActiveStudioId();
  const client = useClient(studioId, clientId);
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

      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <p className="max-w-sm text-center text-body-sm text-fg-subtle">
          The overview is next: weight against their goal, the energy targets and how they were
          worked out, and whether they are actually training.
        </p>
      </div>
    </div>
  );
}
