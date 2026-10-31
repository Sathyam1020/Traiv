"use client";
import type { Nutrients, FoodItem } from "@/lib/api/food";
import { Shopping } from "./shopping";
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
  if (tool === "shopping") return <Shopping studio={studio} onClose={onClose} />;
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
