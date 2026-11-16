import type { Metadata } from "next";
import { ToolProvider } from "@/app/tools/_components/tool-context";
import { RpeWidget } from "@/app/tools/_components/widgets/strength";
import { RPE_TOOL_PATH } from "@/content/tools/embed";

export const metadata: Metadata = {
  title: "RPE calculator",
  robots: { index: false, follow: false },
  alternates: { canonical: RPE_TOOL_PATH },
};

export default function Page() {
  return (
    <ToolProvider
      value={{ slug: "rpe-calculator", group: "strength", kind: "calculator", embedded: true }}
    >
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <h1 className="text-lead font-semibold">RPE calculator</h1>
        <RpeWidget />
      </div>
    </ToolProvider>
  );
}
