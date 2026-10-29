/**
 * A minimal RFC4180 CSV reader — no dependency added for it.
 *
 * Both ingredient seeds (`fdc-ingredients.ts`, `ifct-ingredients.ts`) read large,
 * well-formed government/public-domain CSV exports. Adding a CSV library for two
 * one-time import scripts would need the dependency process CLAUDE.md requires for
 * anything shipped in the app; this never ships — it only ever runs as
 * `pnpm --filter @traiv/api seed:*` against a local or CI database. A ~30-line parser
 * that handles quoted fields and `""`-escaped quotes covers every row either dataset
 * actually contains.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // Normalise line endings up front so \r\n and \n behave identically below.
  const body = text.replace(/\r\n/g, "\n");

  for (let i = 0; i < body.length; i++) {
    const c = body[i];

    if (inQuotes) {
      if (c === '"') {
        if (body[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/** Rows as objects keyed by the first row's header — the shape every USDA/IFCT CSV needs. */
export function parseCsvRecords(text: string): Record<string, string>[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) return [];
  return rows
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}
