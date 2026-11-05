"use client";

import { QuickActions } from "@traiv/ui/components/quick-actions";
import { Sheet } from "@traiv/ui/components/sheet";
import { ClipboardList, Ruler } from "@traiv/ui/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Metric } from "@/lib/api";
import { useCheckIns } from "@/lib/query";
import { MeasurementEditor, MeasurementPicker } from "../../you/_components/profile-actions";

export function HomeQuickActions({ studioId }: { studioId: string }) {
  const router = useRouter();
  const checkIns = useCheckIns(studioId);
  const [open, setOpen] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [selected, setSelected] = useState<Metric | null>(null);
  const [message, setMessage] = useState("");
  function startCheckIn() {
    const pending = checkIns.data?.checkIns
      .filter((c) => c.state === "upcoming" || c.state === "overdue")
      .sort((a, b) => a.dueOn.localeCompare(b.dueOn))[0];
    if (!pending) {
      setMessage(
        checkIns.isError
          ? "Couldn't load your check-in. Tap New check-in to retry."
          : "You have no open check-ins right now.",
      );
      if (checkIns.isError) void checkIns.refetch();
      return;
    }
    setOpen(false);
    router.push(`/check-in/${pending.id}`);
  }
  return (
    <>
      <QuickActions
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          setMessage("");
        }}
        message={message}
        actions={[
          {
            label: "New check-in",
            icon: ClipboardList,
            disabled: checkIns.isPending,
            onSelect: startCheckIn,
          },
          {
            label: "Add measurement",
            icon: Ruler,
            onSelect: () => {
              setOpen(false);
              setSelected(null);
              setMeasuring(true);
            },
          },
        ]}
      />
      <Sheet open={measuring} onOpenChange={setMeasuring}>
        {measuring &&
          (selected ? (
            <MeasurementEditor
              key={selected.id}
              studioId={studioId}
              metric={selected}
              onBack={() => setSelected(null)}
              onClose={() => setMeasuring(false)}
            />
          ) : (
            <MeasurementPicker studioId={studioId} onSelect={setSelected} />
          ))}
      </Sheet>
    </>
  );
}
