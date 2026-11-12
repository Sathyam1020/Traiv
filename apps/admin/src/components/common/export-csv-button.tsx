"use client";

import { Button } from "@traiv/ui/components/button";
import { Download } from "@traiv/ui/icons";
import { downloadCsv } from "@/lib/csv";

/** One button, every analytics page — `admin-dashboard-spec.md`'s cross-cutting "CSV
 *  export" requirement. `getCsv` is called lazily, only on click, so a page with no
 *  data yet never has to build a CSV string it won't use. */
export function ExportCsvButton({ filename, getCsv }: { filename: string; getCsv: () => string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => downloadCsv(filename, getCsv())}
    >
      <Download className="size-3.5" /> Export CSV
    </Button>
  );
}
