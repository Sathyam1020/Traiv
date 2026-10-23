"use client";

import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@traiv/ui/components/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { JoinCard } from "@/app/(app)/settings/_components/join-card";

/**
 * How a coach actually adds a client.
 *
 * There is no form here because there is no "create a client" endpoint — a coaching
 * relationship starts when the person joins with the code, which is what makes the
 * client's own account theirs rather than a record the coach typed. So the button opens
 * the thing that does the work: the QR to show across a gym floor and the link to send
 * on WhatsApp, the same component the settings page uses rather than a second copy.
 */
export function AddClientDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-0 flex-1 sm:flex-none">
          <Plus className="size-4" />
          Add client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[25rem]">
        <DialogHeader className="text-left">
          <DialogTitle>Add a client</DialogTitle>
          <DialogDescription>
            Send them the link, or have them scan this. They appear here the moment they join.
          </DialogDescription>
        </DialogHeader>
        <JoinCard bare />
      </DialogContent>
    </Dialog>
  );
}
