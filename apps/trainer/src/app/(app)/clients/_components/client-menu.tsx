"use client";

import { Button } from "@traiv/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useUpdateClient } from "@/lib/query";

/**
 * Pause and end. Nothing else lives here until there is a screen behind it.
 *
 * Shared by the roster row and the client's own header, so the two can never drift into
 * offering different things — which is how a coach ends up pausing from one screen and
 * finding no way to resume from the other.
 */
export function ClientMenu({
  studioId,
  client,
}: {
  studioId: string | null;
  client: { id: string; name: string; status: string };
}) {
  const update = useUpdateClient(studioId);
  const paused = client.status === "paused";
  const ended = client.status === "archived";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`More for ${client.name}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() =>
            update.mutate({ clientId: client.id, status: paused || ended ? "active" : "paused" })
          }
        >
          {paused ? "Resume coaching" : ended ? "Start again" : "Pause coaching"}
        </DropdownMenuItem>
        {ended ? null : (
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => update.mutate({ clientId: client.id, status: "archived" })}
          >
            End coaching
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
