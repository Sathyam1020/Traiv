"use client";
import * as React from "react";
import * as W from "./wensity/tabs";
const Variant = React.createContext<(value: W.TabsVariant) => void>(() => {});
export function Tabs({
  orientation,
  variant: initial = "default",
  ...props
}: W.TabsProps & { orientation?: "horizontal" | "vertical" }) {
  const [variant, setVariant] = React.useState(initial);
  return (
    <Variant.Provider value={setVariant}>
      <W.Tabs
        {...props}
        variant={orientation === "vertical" ? "vertical" : variant}
        className={`group/tabs ${props.className ?? ""}`}
        data-orientation={orientation ?? "horizontal"}
      />
    </Variant.Provider>
  );
}
export function TabsList({
  variant = "default",
  ...props
}: W.TabsListProps & { variant?: "default" | "line" }) {
  const setVariant = React.useContext(Variant);
  React.useLayoutEffect(() => {
    setVariant(variant === "line" ? "underline" : "default");
  }, [variant, setVariant]);
  return (
    <W.TabsList
      {...props}
      className={`group/tabs-list ${props.className ?? ""}`}
      data-variant={variant}
    />
  );
}
export const TabsTrigger = W.TabsTrigger;
export const TabsContent = W.TabsContent;
