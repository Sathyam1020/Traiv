import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { statuses } from "./domain.ts";

const root = process.env.ARTIFACT_MODULE_DIR;
if (!root)
  throw Error("Set ARTIFACT_MODULE_DIR to the bundled node_modules directory (see README)");
const require = createRequire(resolve(root, "package.json"));
const { Workbook, SpreadsheetFile } = await import(require.resolve("@oai/artifact-tool"));
const out = process.argv[2] ?? "outputs/latest";
const model = JSON.parse(await fs.readFile(`${out}/crm-model.json`, "utf8"));
function col(n) {
  let s = "";
  for (n++; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}
function populate(wb, s) {
  const sheet = wb.worksheets.getItem(s.name);
  const width = Math.max(...s.rows.map((r) => r.length));
  const rows = s.rows.map((r) =>
    Array.from({ length: width }, (_, i) => {
      const v = r[i] ?? null;
      return typeof v === "string" && /^\s*[=+@-]/.test(v) ? `'${v}` : v;
    }),
  );
  if (rows.length) sheet.getRange(`A1:${col(width - 1)}${rows.length}`).values = rows;
  for (const f of s.formulas) sheet.getRange(f.cell).formulas = [[f.formula]];
  sheet.showGridLines = false;
  const range = sheet.getRange(`A1:${col(width - 1)}${Math.max(2, rows.length)}`);
  range.format.font = { name: "Arial", size: 10 };
  range.format.columnWidth = 24;
  range.format.rowHeight = 24;
  if (s.name !== "Dashboard") { range.format.wrapText = true; range.format.rowHeight = 56; }
  if (s.name === "Source Audit") sheet.getRange("C2:C4000").setNumberFormat("dd mmm yyyy");
  sheet.getRange(`A1:${col(width - 1)}1`).format = {
    fill: "#302050",
    font: { name: "Arial", bold: true, color: "#FFFFFF" },
    wrapText: true,
    rowHeight: 38,
  };
  if (s.name !== "Dashboard") sheet.freezePanes.freezeRows(1);
  sheet.getRange("B:B").format.columnWidth = 32;
  if (s.name === "Gym Leads" || s.name === "Online Trainer Leads") {
    sheet.freezePanes.freezeColumns(2);
    sheet.tables.add(
      `A1:${col(width - 1)}${Math.max(2, rows.length)}`,
      true,
      s.name === "Gym Leads" ? "GymLeads" : "TrainerLeads",
    );
    const status = s.name === "Gym Leads" ? "T" : "R";
    sheet.getRange(`${status}2:${status}300`).dataValidation = {
      rule: { type: "list", values: statuses },
    };
    sheet.getRange(`${status}2:${status}300`).conditionalFormats.add("containsText", {
      text: "Do Not Contact",
      format: { fill: "#FFDADA" },
    });
    for (const c of s.manual) sheet.getRange(`${col(c)}2:${col(c)}300`).format.fill = "#FFF7DB";
    for (const c of s.name === "Gym Leads" ? ["V", "W", "Z"] : ["S", "T", "W"])
      sheet.getRange(`${c}2:${c}300`).setNumberFormat("dd mmm yyyy");
  }
  if (s.name === "Dashboard") {
    sheet.getRange("A:A").format.columnWidth = 42;
    sheet.getRange("B:B").format.columnWidth = 15;
    sheet.getRange("B17:B18").setNumberFormat("0.0%");
    const chart = sheet.charts.add("bar", sheet.getRange("A21:B35"));
    chart.title = "Current outreach pipeline";
    chart.setPosition("D4", "M22");
    chart.hasLegend = false;
  }
  if (s.name === "Follow Ups") {
    sheet.getRange("E2:E600").setNumberFormat("dd mmm yyyy");
    sheet.getRange("M2:M600").setNumberFormat("dd mmm yyyy");
  }
  return sheet;
}
const wb = Workbook.create();
for (const s of model) wb.worksheets.add(s.name);
for (const s of model) populate(wb, s);
wb.recalculate();
await fs.writeFile(
  `${out}/workbook-inspection.json`,
  (
    await wb.inspect({
      kind: "table",
      range: "Dashboard!A3:B18",
      include: "values,formulas",
      tableMaxRows: 20,
      tableMaxCols: 2,
      maxChars: 6000,
    })
  ).ndjson,
);
const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 30 },
  maxChars: 3000,
});
await fs.writeFile(`${out}/formula-check.json`, errors.ndjson);
for (const s of model) {
  const preview = await wb.render({
    sheetName: s.name,
    range: s.name === "Dashboard" ? "A1:M23" : s.name === "Follow Ups" ? "A1:F8" : "A1:F8",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    `${out}/${s.name.replaceAll(" ", "-")}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}
await (await SpreadsheetFile.exportXlsx(wb)).save(`${out}/traiv-bengaluru-crm.xlsx`);
const leads = JSON.parse(await fs.readFile(`${out}/leads.json`, "utf8"));
for (const [file, kind, status] of [
  ["gyms", "gym", null],
  ["online-trainers", "coach", "Confirmed online coach"],
  ["unverified-trainers", "coach", "other"],
]) {
  const source = model.find(
    (s) => s.name === (kind === "gym" ? "Gym Leads" : "Online Trainer Leads"),
  );
  const ids = new Set(
    leads
      .filter(
        (l) =>
          l.kind === kind &&
          (status === null || status === "other"
            ? status === null || l.onlineStatus !== "Confirmed online coach"
            : l.onlineStatus === status),
      )
      .map((l) => l.id),
  );
  const data = {
    ...source,
    rows: [source.rows[0], ...source.rows.slice(1).filter((r) => ids.has(r[0]))],
    formulas: [],
  };
  const book = Workbook.create();
  book.worksheets.add(data.name);
  populate(book, data);
  book.recalculate();
  await (await SpreadsheetFile.exportXlsx(book)).save(`${out}/${file}.xlsx`);
}
