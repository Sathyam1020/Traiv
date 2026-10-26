"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@traiv/ui/components/popover";
import { useEffect, useState } from "react";

/**
 * "Enter session name" — the real builder asks for a name the moment you create a
 * session, rather than silently numbering it "Session 1", "Session 2".
 */
export function SessionNamePrompt({
  trigger,
  onSubmit,
  open,
  onOpenChange,
}: {
  trigger: React.ReactNode;
  onSubmit: (name: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    onOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="flex w-64 flex-col gap-2">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Enter session name"
        />
        <Button size="sm" onClick={submit} disabled={!name.trim()}>
          Create
        </Button>
      </PopoverContent>
    </Popover>
  );
}
