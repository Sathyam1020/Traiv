/**
 * CSV export, shared by every analytics page — `admin-dashboard-spec.md`'s cross-cutting
 * requirement: "CSV export (aggregate rows only, per `privacy-security.md`)."
 *
 * Small-cell suppression lives here, not per-page: any count below `SUPPRESS_BELOW` is
 * replaced with `"<5"` rather than exported exactly or silently dropped — dropping the
 * row would still leak its approximate size by the gap it leaves in the total, so
 * masking the value is the one option that hides it without lying about the row's
 * existence. `privacy-security.md` suggests 5 as the minimum group size.
 */
const SUPPRESS_BELOW = 5;

/** Wrap a count so the exporter masks it below the threshold — pass real cell values
 *  through this instead of a bare number wherever a column is a small-group count. */
export function suppressible(n: number): number | "suppressed" {
  return n > 0 && n < SUPPRESS_BELOW ? "suppressed" : n;
}

function escapeCell(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(
  headers: string[],
  rows: (string | number | null | undefined | "suppressed")[][],
): string {
  const body = rows.map((row) =>
    row.map((cell) => escapeCell(cell === "suppressed" ? "<5" : cell)).join(","),
  );
  return [headers.map(escapeCell).join(","), ...body].join("\n");
}

/** Triggers a real browser download — this is a deployed app, not a sandboxed preview. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
