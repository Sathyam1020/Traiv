import { createSign } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { requestJson } from "./adapters.ts";
import { statuses } from "./domain.ts";
import { type Cell, model, type Sheet } from "./export.ts";
import type { Store } from "./store.ts";
export type Request = Record<string, unknown>;
export const title = "Traiv | Bengaluru Lead Intelligence & Sales CRM";
export function value(v: Cell) {
  return typeof v === "number"
    ? { numberValue: v }
    : typeof v === "boolean"
      ? { boolValue: v }
      : { stringValue: String(v ?? "") };
}
export function writes(s: Sheet, sheetId: number, existing: Cell[][] = []): Request[] {
  const req: Request[] = [];
  const push = (r: number, c: number, values: Cell[]) =>
    req.push({
      updateCells: {
        start: { sheetId, rowIndex: r, columnIndex: c },
        rows: [{ values: values.map((v) => ({ userEnteredValue: value(v) })) }],
        fields: "userEnteredValue",
      },
    });
  if (s.name === "Outreach Tracker" && existing.length) {
    const seen = new Set(
      existing
        .slice(1)
        .map((r) => String(r[10] ?? ""))
        .filter(Boolean),
    );
    let row = existing.length;
    for (const cells of s.rows.slice(1)) {
      const id = String(cells[10] ?? "");
      if (!id) throw Error("Outreach requires an Attempt ID");
      if (!seen.has(id)) {
        push(row++, 0, cells);
        seen.add(id);
      }
    }
    return req;
  }
  const byId = new Map<string, number>();
  for (let i = 1; i < existing.length; i++) {
    const id = String(existing[i]?.[0] ?? "");
    if (id) {
      if (byId.has(id)) throw Error(`Duplicate remote Lead ID in ${s.name}`);
      byId.set(id, i);
    }
  }

  const isLead = ["Gym Leads", "Online Trainer Leads"].includes(s.name);
  let next = Math.max(1, existing.length);
  if (existing.length && isLead) {
    const header = existing[0] ?? [];
    const expected = s.rows[0] ?? [];
    if (
      header.length < expected.length - 1 ||
      JSON.stringify(header) !== JSON.stringify(expected.slice(0, header.length))
    )
      throw Error(`Header mismatch in ${s.name}; sync stopped`);
  }
  for (let i = 0; i < s.rows.length; i++) {
    const cells = s.rows[i] ?? [];
    const id = String(cells[0] ?? "");
    const found = isLead ? byId.get(id) : undefined;
    const r = i === 0 ? 0 : isLead ? (found ?? next++) : i;
    let start = 0;
    let block: Cell[] = [];
    for (let c = 0; c <= cells.length; c++) {
      if (c === cells.length || (i > 0 && found !== undefined && s.manual.includes(c))) {
        if (block.length) push(r, start, block);
        block = [];
        start = c + 1;
      } else {
        block.push(cells[c] ?? "");
      }
    }
  }
  for (const f of s.formulas) {
    const m = /^([A-Z]+)(\d+)$/.exec(f.cell);
    if (!m?.[1] || !m[2]) throw Error("Bad cell");
    let col = 0;
    for (const ch of m[1]) col = col * 26 + ch.charCodeAt(0) - 64;
    req.push({
      updateCells: {
        start: { sheetId, rowIndex: Number(m[2]) - 1, columnIndex: col - 1 },
        rows: [{ values: [{ userEnteredValue: { formulaValue: f.formula } }] }],
        fields: "userEnteredValue",
      },
    });
  }
  return req;
}
export function formatting(sheetId: number, s: Sheet, capacity = 2000): Request[] {
  const width = Math.max(14, s.rows[0]?.length ?? 2);
  const req: Request[] = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            rowCount: capacity,
            columnCount: Math.max(26, width),
            frozenRowCount: s.name === "Dashboard" ? 0 : 1,
            hideGridlines: true,
          },
        },
        fields: "gridProperties",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: width,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.18, green: 0.12, blue: 0.32 },
            textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: width },
        properties: { pixelSize: 180 },
        fields: "pixelSize",
      },
    },
  ];
  if (s.name === "Gym Leads" || s.name === "Online Trainer Leads") {
    const status = s.name === "Gym Leads" ? 19 : 17;
    req.push(
      {
        setBasicFilter: {
          filter: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: capacity,
              startColumnIndex: 0,
              endColumnIndex: width,
            },
          },
        },
      },
      {
        setDataValidation: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: capacity,
            startColumnIndex: status,
            endColumnIndex: status + 1,
          },
          rule: {
            condition: {
              type: "ONE_OF_LIST",
              values: statuses.map((userEnteredValue) => ({ userEnteredValue })),
            },
            strict: true,
            showCustomUi: true,
          },
        },
      },
      {
        addConditionalFormatRule: {
          index: 0,
          rule: {
            ranges: [
              {
                sheetId,
                startRowIndex: 1,
                endRowIndex: capacity,
                startColumnIndex: status,
                endColumnIndex: status + 1,
              },
            ],
            booleanRule: {
              condition: { type: "TEXT_EQ", values: [{ userEnteredValue: "Do Not Contact" }] },
              format: { backgroundColor: { red: 1, green: 0.8, blue: 0.8 } },
            },
          },
        },
      },
    );
    for (const c of s.manual)
      req.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: capacity,
            startColumnIndex: c,
            endColumnIndex: c + 1,
          },
          cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.97, blue: 0.85 } } },
          fields: "userEnteredFormat.backgroundColor",
        },
      });
    for (const c of s.name === "Gym Leads" ? [21, 22, 25] : [18, 19, 22])
      req.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: capacity,
            startColumnIndex: c,
            endColumnIndex: c + 1,
          },
          cell: { userEnteredFormat: { numberFormat: { type: "DATE", pattern: "dd mmm yyyy" } } },
          fields: "userEnteredFormat.numberFormat",
        },
      });
  }
  if (s.name === "Dashboard")
    req.push({
      addChart: {
        chart: {
          spec: {
            title: "Current outreach pipeline",
            basicChart: {
              chartType: "BAR",
              legendPosition: "NO_LEGEND",
              axis: [
                { position: "BOTTOM_AXIS", title: "Leads" },
                { position: "LEFT_AXIS", title: "Status" },
              ],
              domains: [
                {
                  domain: {
                    sourceRange: {
                      sources: [
                        {
                          sheetId,
                          startRowIndex: 20,
                          endRowIndex: 35,
                          startColumnIndex: 0,
                          endColumnIndex: 1,
                        },
                      ],
                    },
                  },
                },
              ],
              series: [
                {
                  series: {
                    sourceRange: {
                      sources: [
                        {
                          sheetId,
                          startRowIndex: 20,
                          endRowIndex: 35,
                          startColumnIndex: 1,
                          endColumnIndex: 2,
                        },
                      ],
                    },
                  },
                  targetAxis: "BOTTOM_AXIS",
                },
              ],
              headerCount: 1,
            },
          },
          position: {
            overlayPosition: {
              anchorCell: { sheetId, rowIndex: 3, columnIndex: 3 },
              widthPixels: 780,
              heightPixels: 450,
            },
          },
        },
      },
    });
  return req;
}
async function token() {
  if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN;
  const path = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  if (!path) throw Error("Set GOOGLE_ACCESS_TOKEN or GOOGLE_SERVICE_ACCOUNT_FILE");
  const sa = JSON.parse(await readFile(path, "utf8"));
  if (typeof sa.client_email !== "string" || typeof sa.private_key !== "string")
    throw Error("Invalid service account");
  const enc = (v: unknown) => Buffer.from(JSON.stringify(v)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = createSign("RSA-SHA256").update(payload).sign(sa.private_key, "base64url");
  const r = (await requestJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${payload}.${sig}`,
    }),
  })) as { access_token?: string };
  if (!r.access_token) throw Error("Token unavailable");
  return r.access_token;
}
export async function sync(store: Store) {
  const auth = await token();
  const api = async (path: string, body?: unknown) =>
    requestJson(
      `https://sheets.googleapis.com/v4/spreadsheets${path}`,
      {
        method: body ? "POST" : "GET",
        headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      },
      body ? 1 : 3,
    );
  const sheets = model(store);
  let id =
    process.env.GOOGLE_SPREADSHEET_ID ||
    String(
      store.db.prepare("SELECT value FROM meta WHERE key='spreadsheet_id'").get()?.value ?? "",
    );
  let created = false;
  if (!id) {
    const r = (await api("", {
      properties: { title, timeZone: "Asia/Kolkata", locale: "en_US" },
      sheets: sheets.map((s, i) => ({
        properties: {
          sheetId: i,
          title: s.name,
          gridProperties: { rowCount: 4000, columnCount: 28 },
        },
      })),
    })) as { spreadsheetId: string };
    id = r.spreadsheetId;
    if (!id) throw Error("Creation did not return ID");
    store.db.prepare("INSERT OR REPLACE INTO meta VALUES('spreadsheet_id',?)").run(id);
    created = true;
  }
  const metadata = (await api(`/${id}`)) as {
    sheets: Array<{ properties: { title: string; sheetId: number } }>;
  };
  for (const s of sheets) {
    const remote = metadata.sheets.find((x) => x.properties.title === s.name);
    if (!remote) throw Error(`Missing tab ${s.name}`);
    const rows = (await api(
      `/${id}/values/${encodeURIComponent(`'${s.name}'!A1:AB4000`)}?valueRenderOption=UNFORMATTED_VALUE`,
    )) as { values?: Cell[][] };
    const requests = [
      {
        updateSheetProperties: {
          properties: {
            sheetId: remote.properties.sheetId,
            gridProperties: {
              rowCount: Math.max(
                4000,
                ...s.formulas.map((f) => Number(f.cell.match(/\d+$/)?.[0] ?? 1)),
              ),
              columnCount: Math.max(28, s.rows[0]?.length ?? 1),
            },
          },
          fields: "gridProperties.rowCount,gridProperties.columnCount",
        },
      },
      ...(created ? formatting(remote.properties.sheetId, s) : []),
      ...writes(s, remote.properties.sheetId, rows.values ?? []),
    ];
    for (let i = 0; i < requests.length; i += 400)
      await api(`/${id}:batchUpdate`, { requests: requests.slice(i, i + 400) });
  }
  await writeFile(
    "data/google-spreadsheet.json",
    JSON.stringify({ id, url: `https://docs.google.com/spreadsheets/d/${id}/edit` }),
  );
  return id;
}
