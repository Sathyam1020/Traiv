"use client";
import type { Nutrients, FoodItem } from "@/lib/api/food";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Photos } from "./photos";
import { MyLibrary } from "./library";
import { Goals } from "./goals";
import { PersonalPlans } from "./personal";
export function FoodTools({
  studio,
  tool,
  barcode,
  date,
  target,
  onSelect,
  onClose,
  onSaved,
}: {
  studio: string;
  tool: string;
  barcode?: string;
  date: string;
  target: Nutrients | null;
  onSelect: (item: FoodItem) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    if (tool === "shopping") router.replace("/food/shopping");
  }, [tool, router]);
  if (tool === "shopping") return null;
  if (tool === "photos") return <Photos studio={studio} onClose={onClose} />;
  if (tool === "goals")
    return (
      <Goals studio={studio} date={date} target={target} onClose={onClose} onSaved={onSaved} />
    );
  if (tool === "personal")
    return <PersonalPlans studio={studio} target={target} onClose={onClose} onSelect={onSelect} />;
  return (
    <MyLibrary
      studio={studio}
      initialBarcode={barcode}
      kind={tool === "recipes" ? "recipe" : "food"}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
