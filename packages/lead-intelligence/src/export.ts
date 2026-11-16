import { mkdir, readFile, writeFile } from "node:fs/promises";
import { cellSafe, isFresh, type Lead, statuses } from "./domain.ts";
import type { Store } from "./store.ts";
export type Cell = string | number | boolean | null;
export type Sheet = {
  name: string;
  rows: Cell[][];
  formulas: Array<{ cell: string; formula: string }>;
  manual: number[];
};
export const gymHeaders = [
  "Lead ID",
  "Business Name",
  "Category",
  "Locality",
  "Address",
  "Website",
  "Public Phone",
  "Public Email",
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Google Maps URL",
  "Owner/Manager",
  "Online Coaching",
  "Personal Training",
  "Existing Software",
  "Lead Score",
  "Confidence Score",
  "Priority",
  "Lead Status",
  "Assigned To",
  "Last Contacted",
  "Next Follow Up",
  "Notes",
  "Source URL",
  "Last Verified",
  "Traiv Fit",
  "Verification",
];
export const coachHeaders = [
  "Lead ID",
  "Coach Name",
  "Coaching Specialty",
  "Locality",
  "Online Coaching Status",
  "Website",
  "Public Phone",
  "Public Email",
  "Instagram",
  "Followers",
  "YouTube",
  "LinkedIn",
  "Coaching Offer",
  "Existing Software",
  "Lead Score",
  "Confidence Score",
  "Priority",
  "Lead Status",
  "Last Contacted",
  "Next Follow Up",
  "Notes",
  "Source URL",
  "Last Verified",
  "Assigned To",
  "Traiv Fit",
  "Verification",
  "Contact Route",
];
export function column(n: number): string {
  let s = "";
  for (n++; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}
const fact = (l: Lead, k: string): Cell => l.facts[k]?.value ?? "";
function date(v: unknown): Cell {
  return v
    ? Math.floor((Date.parse(String(v)) + (String(v).includes("T") ? 19800000 : 0)) / 86400000) +
        25569
    : "";
}
export function verification(l: Lead, store: Store): string {
  if (l.facts.qualityConcern) return `Review required: ${l.facts.qualityConcern.value}`;
  const check = store.db.prepare("SELECT status FROM url_check WHERE url=?").get(l.source);
  if (check && check.status !== "resolves") return `Source issue: ${check.status}`;
  if (l.verification !== "page-reviewed") return "Search-index evidence; page review required";
  if (!l.facts.phone && !l.facts.email && !l.facts.whatsapp)
    return "Page reviewed; direct contact missing";
  return l.facts.personalTraining?.value === true || l.onlineStatus === "Confirmed online coach"
    ? "Page-reviewed contact and coaching offer; qualify buyer need"
    : "Page-reviewed contact; qualify coaching offer";
}
export function leadRow(l: Lead, store: Store): Cell[] {
  const s = store.sales(l.id);
  return l.kind === "gym"
    ? [
        l.id,
        l.name,
        fact(l, "category"),
        l.locality,
        fact(l, "address"),
        fact(l, "website"),
        fact(l, "phone"),
        fact(l, "email"),
        fact(l, "whatsapp"),
        fact(l, "instagram"),
        fact(l, "facebook"),
        fact(l, "maps"),
        fact(l, "owner"),
        l.onlineStatus,
        fact(l, "personalTraining") || "Unknown",
        fact(l, "software") || "Unknown",
        l.score,
        l.confidence,
        l.priority,
        String(s.status),
        String(s.assigned_to),
        date(s.last_contacted),
        date(s.next_follow_up),
        String(s.notes),
        l.source,
        date(l.collectedAt),
        l.explanation,
        verification(l, store),
      ]
    : [
        l.id,
        l.name,
        fact(l, "category"),
        l.locality,
        l.onlineStatus,
        fact(l, "website"),
        fact(l, "phone"),
        fact(l, "email"),
        fact(l, "instagram"),
        fact(l, "followers"),
        fact(l, "youtube"),
        fact(l, "linkedin"),
        fact(l, "offer"),
        fact(l, "software") || "Unknown",
        l.score,
        l.confidence,
        l.priority,
        String(s.status),
        date(s.last_contacted),
        date(s.next_follow_up),
        String(s.notes),
        l.source,
        date(l.collectedAt),
        String(s.assigned_to),
        l.explanation,
        verification(l, store),
        l.facts.whatsapp
          ? `WhatsApp: https://wa.me/${String(l.facts.whatsapp.value).replace(/\D/g, "")}`
          : l.facts.phone
            ? `Call: ${l.facts.phone.value}`
            : l.facts.email
              ? `Email: ${l.facts.email.value}`
              : `Enquiry form: ${l.facts.booking?.value ?? l.facts.website?.value ?? l.source}`,
      ];
}
export function quality(store: Store) {
  const rows: Cell[][] = [["Lead ID", "Business", "Issue", "Detail", "Source URL"]];
  for (const l of store.leads()) {
    const add = (issue: string, detail: string) =>
      rows.push([l.id, l.name, issue, detail, l.source]);
    if (l.facts.qualityConcern) add("Source quality concern", String(l.facts.qualityConcern.value));
    if (!l.facts.phone && !l.facts.email && !l.facts.whatsapp)
      add("Missing contact", "No public phone/email/WhatsApp identified");
    if (l.kind === "coach" && l.onlineStatus !== "Confirmed online coach")
      add("Unverified online coaching", l.onlineStatus);
    if (Object.values(l.facts).some((e) => !isFresh(e)))
      add("Stale evidence", "One or more facts older than 90 days");
    if (l.verification === "search-snippet")
      add(
        "Source review needed",
        "Search-index evidence; current trading not independently confirmed",
      );
  }
  for (const r of store.db.prepare("SELECT * FROM url_check WHERE status!='resolves'").all())
    rows.push(["", "", "URL verification", String(r.status), String(r.url)]);
  for (const r of store.db.prepare("SELECT * FROM review WHERE status='open'").all())
    rows.push([String(r.lead_id), "", "Manual review", String(r.reason), String(r.other_id ?? "")]);
  for (const r of store.db.prepare("SELECT * FROM audit WHERE error!=''").all())
    rows.push(["", "", "Collection failure", String(r.error), String(r.source)]);
  return rows;
}
export function model(store: Store): Sheet[] {
  const leads = store.leads();
  const gym = leads.filter((l) => l.kind === "gym"),
    coach = leads.filter((l) => l.kind === "coach");
  const capacity = Math.max(300, gym.length + 100, coach.length + 100);
  const sheets: Sheet[] = [
    {
      name: "Dashboard",
      rows: [
        ["Traiv | Bengaluru Lead Intelligence & Sales CRM"],
        ["Public source evidence; contact activity and current trading require verification."],
        ["Metric", "Count"],
      ],
      formulas: [],
      manual: [],
    },
    {
      name: "Gym Leads",
      rows: [gymHeaders, ...gym.map((l) => leadRow(l, store))],
      formulas: [],
      manual: [19, 20, 21, 22, 23],
    },
    {
      name: "Online Trainer Leads",
      rows: [coachHeaders, ...coach.map((l) => leadRow(l, store))],
      formulas: [],
      manual: [17, 18, 19, 20, 23],
    },
    {
      name: "Outreach Tracker",
      rows: [
        [
          "Lead ID",
          "Contact channel",
          "Contact date",
          "Message version",
          "Response",
          "Interest level",
          "Demo status",
          "Next action",
          "Next follow up date",
          "Outcome",
          "Attempt ID",
        ],
        ...store.db
          .prepare("SELECT * FROM outreach")
          .all()
          .map((r) => {
            const p = JSON.parse(String(r.payload));
            return [
              String(r.lead_id),
              p.channel ?? "",
              date(p.date),
              p.version ?? "",
              p.response ?? "",
              p.interest ?? "",
              p.demo ?? "",
              p.nextAction ?? "",
              date(p.nextFollowUp),
              p.outcome ?? "",
              String(r.id),
            ];
          }),
      ],
      formulas: [],
      manual: Array.from({ length: 11 }, (_, i) => i),
    },
    {
      name: "Follow Ups",
      rows: [["Lead ID", "Business", "Status", "Owner", "Follow up date", "Reason"]],
      formulas: [],
      manual: [],
    },
    { name: "Data Quality", rows: quality(store), formulas: [], manual: [] },
    {
      name: "Source Audit",
      rows: [
        [
          "Discovery source",
          "Query",
          "Collection date (IST)",
          "Records found",
          "Accepted observations",
          "Duplicates",
          "Errors",
          "Restrictions",
        ],
        ...store.db
          .prepare("SELECT * FROM audit ORDER BY id")
          .all()
          .map((r) => [
            String(r.source),
            String(r.query),
            String(r.collected_at),
            Number(r.found),
            Number(r.accepted),
            Number(r.duplicates),
            String(r.error),
            String(r.restrictions),
          ]),
      ],
      formulas: [],
      manual: [],
    },
  ];
  const dash = sheets[0];
  const follow = sheets[4];
  if (!dash || !follow) throw Error("Missing sheets");
  const count = (col: string, criterion: string, tab: string) =>
    `COUNTIF('${tab}'!${col}2:${col}${capacity},${criterion})`;
  const both = (gc: string, cc: string, criterion: string) =>
    `${count(gc, criterion, "Gym Leads")}+${count(cc, criterion, "Online Trainer Leads")}`;
  const metrics: Array<[string, string]> = [
    [
      "Total unique leads",
      `COUNTA('Gym Leads'!A2:A${capacity})+COUNTA('Online Trainer Leads'!A2:A${capacity})`,
    ],
    ["Gyms", `COUNTA('Gym Leads'!A2:A${capacity})`],
    ["Confirmed online coaches", count("E", '"Confirmed online coach"', "Online Trainer Leads")],
    ["Unverified trainers", `COUNTA('Online Trainer Leads'!A2:A${capacity})-B6`],
    [
      "Published business emails",
      `ROWS('Gym Leads'!H2:H${capacity})-COUNTBLANK('Gym Leads'!H2:H${capacity})+ROWS('Online Trainer Leads'!H2:H${capacity})-COUNTBLANK('Online Trainer Leads'!H2:H${capacity})`,
    ],
    [
      "Published business phones",
      `ROWS('Gym Leads'!G2:G${capacity})-COUNTBLANK('Gym Leads'!G2:G${capacity})+ROWS('Online Trainer Leads'!G2:G${capacity})-COUNTBLANK('Online Trainer Leads'!G2:G${capacity})`,
    ],
    ["High priority", both("S", "Q", '"High priority"')],
    ["Leads contacted", both("V", "S", '">0"')],
    ["Replies (current status)", both("T", "R", '"Replied"')],
    ["Interested (current status)", both("T", "R", '"Interested"')],
    ["Demos booked (current status)", both("T", "R", '"Demo Booked"')],
    ["Trials started (current status)", both("T", "R", '"Trial Started"')],
    ["Paying customers", both("T", "R", '"Converted"')],
    ["Lead to customer conversion", "IFERROR(B16/B4,0)"],
    ["Contact to customer conversion", "IFERROR(B16/B11,0)"],
  ];
  metrics.forEach(([label, formula], i) => {
    dash.rows[i + 3] = [label];
    dash.formulas.push({ cell: `B${i + 4}`, formula: `=${formula}` });
  });
  dash.rows[20] = ["Current pipeline", "Leads"];
  statuses.forEach((s, i) => {
    dash.rows[i + 21] = [s];
    dash.formulas.push({ cell: `B${i + 22}`, formula: `=${both("T", "R", JSON.stringify(s))}` });
  });
  const localities = [...new Set(leads.map((l) => l.locality))].sort();
  dash.rows[37] = ["Locality", "Leads"];
  localities.forEach((s, i) => {
    dash.rows[i + 38] = [s];
    dash.formulas.push({ cell: `B${i + 39}`, formula: `=${both("D", "D", JSON.stringify(s))}` });
  });
  const sourceStart = 40 + localities.length;
  dash.rows[sourceStart] = ["Source URL", "Leads"];
  [...new Set(leads.map((l) => l.source))].forEach((s, i) => {
    dash.rows[sourceStart + i + 1] = [s];
    dash.formulas.push({
      cell: `B${sourceStart + i + 2}`,
      formula: `=${both("Y", "V", JSON.stringify(s))}`,
    });
  });
  follow.rows[0] = [
    "Lead ID",
    "Business",
    "Status",
    "Owner",
    "Follow up date",
    "Reason",
    "",
    "",
    "Lead ID",
    "Business",
    "Status",
    "Owner",
    "Follow up date",
    "Reason",
  ];
  let row = 2;
  for (const [tab, statusCol, ownerCol, dateCol] of [
    ["Gym Leads", "T", "U", "W"],
    ["Online Trainer Leads", "R", "X", "T"],
  ])
    for (let r = 2; r <= capacity; r++, row++) {
      for (const [c, ref] of [
        ["I", "A"],
        ["J", "B"],
        ["K", statusCol],
        ["L", ownerCol],
        ["M", dateCol],
      ])
        follow.formulas.push({
          cell: `${c}${row}`,
          formula: `=IF('${tab}'!A${r}="","",'${tab}'!${ref}${r})`,
        });
      follow.formulas.push({
        cell: `N${row}`,
        formula: `=IF(OR(I${row}="",K${row}="Do Not Contact",K${row}="Converted",K${row}="Not Interested",K${row}="Unqualified"),"",IF(AND(ISNUMBER(M${row}),M${row}>0,M${row}<TODAY()),"Overdue",IF(AND(ISNUMBER(M${row}),M${row}=TODAY()),"Due today",IF(AND(ISNUMBER(M${row}),M${row}>TODAY(),M${row}<=TODAY()+7),"Next seven days",IF(K${row}="Interested","Awaiting demo",IF(K${row}="Trial Started","Trial follow up",""))))))`,
      });
    }
  follow.formulas.push({
    cell: "A2",
    formula: `=IFERROR(FILTER(I2:N${row - 1},N2:N${row - 1}<>""),"No follow ups due")`,
  });
  // Fill sparse dashboard rows so export shape is deterministic.
  dash.rows = Array.from({ length: dash.rows.length }, (_, i) => dash.rows[i] ?? []);
  return sheets;
}
export async function exports(store: Store, out: string) {
  await mkdir(out, { recursive: true });
  store.rescore();
  const leads = store.leads();
  const groups: Record<string, Lead[]> = {
    gyms: leads.filter((l) => l.kind === "gym"),
    "online-trainers": leads.filter(
      (l) => l.kind === "coach" && l.onlineStatus === "Confirmed online coach",
    ),
    "unverified-trainers": leads.filter(
      (l) => l.kind === "coach" && l.onlineStatus !== "Confirmed online coach",
    ),
  };
  for (const [name, ls] of Object.entries(groups)) {
    const rows = [name === "gyms" ? gymHeaders : coachHeaders, ...ls.map((l) => leadRow(l, store))];
    await writeFile(
      `${out}/${name}.csv`,
      `${rows.map((r) => r.map((v) => `"${String(cellSafe(v) ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n")}\r\n`,
    );
  }
  const shortlist = leads.filter((l) =>
    verification(l, store).startsWith("Page-reviewed contact and"),
  );
  const shortRows: Cell[][] = [
    [
      "Lead ID",
      "Business",
      "Type",
      "Locality",
      "Phone",
      "Email",
      "WhatsApp",
      "Coaching offer",
      "Source URL",
      "Qualification",
    ],
    ...shortlist.map((l) => [
      l.id,
      l.name,
      l.kind,
      l.locality,
      fact(l, "phone"),
      fact(l, "email"),
      fact(l, "whatsapp"),
      fact(l, "offer") ||
        (l.facts.personalTraining?.value ? "Personal training" : "Online coaching"),
      l.source,
      "Confirm decision maker, current software, client count and need before pitching",
    ]),
  ];
  await writeFile(
    `${out}/reviewed-shortlist.csv`,
    shortRows
      .map((r) => r.map((v) => `"${String(cellSafe(v) ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\r\n"),
  );
  await writeFile(`${out}/reviewed-shortlist.json`, JSON.stringify(shortlist, null, 2));
  const config = JSON.parse(await readFile(new URL("../config.json", import.meta.url), "utf8"));
  const ratio = (n: number) => (leads.length ? Math.round((n / leads.length) * 1000) / 10 : 0);
  const report = {
    generatedAt: new Date().toISOString(),
    totalDiscoveredRecords: Number(
      store.db
        .prepare("SELECT COALESCE(SUM(found),0) n FROM audit WHERE source='Codex web search'")
        .get()?.n,
    ),
    uniqueDiscoveryUrls: Number(store.db.prepare("SELECT COUNT(*) n FROM candidate").get()?.n),
    storedEvidenceObservations: Number(
      store.db.prepare("SELECT COUNT(*) n FROM observation").get()?.n,
    ),
    uniqueAcceptedLeads: leads.length,
    reviewedContactAndOffer: leads.filter((l) =>
      verification(l, store).startsWith("Page-reviewed contact and"),
    ).length,
    pageReviewed: leads.filter((l) => l.verification === "page-reviewed").length,
    gyms: groups.gyms?.length,
    confirmedOnlineCoaches: groups["online-trainers"]?.length,
    unverifiedTrainers: groups["unverified-trainers"]?.length,
    publicPhoneCoveragePercent: ratio(leads.filter((l) => l.facts.phone).length),
    publishedEmailCoveragePercent: ratio(leads.filter((l) => l.facts.email).length),
    highPriority: leads.filter((l) => l.score >= 80).length,
    duplicateObservations: Number(
      store.db.prepare("SELECT COALESCE(SUM(duplicates),0) n FROM audit").get()?.n,
    ),
    confidenceDistribution: {
      low: leads.filter((l) => l.confidence < 40).length,
      medium: leads.filter((l) => l.confidence >= 40 && l.confidence < 70).length,
      high: leads.filter((l) => l.confidence >= 70).length,
    },
    sources: [...new Set(leads.map((l) => new URL(l.source).hostname))],
    localitiesCovered: [...new Set(leads.map((l) => l.locality))].sort(),
    localityGaps: config.localities.filter((s: string) => !leads.some((l) => l.locality === s)),
    urlChecks: store.db.prepare("SELECT status,COUNT(*) n FROM url_check GROUP BY status").all(),
    limitations: [
      "Current trading is not independently confirmed by calls or visits.",
      "Published contacts are not deliverability-verified.",
      "Google Places, Bing and restricted directories not bulk collected; no credentials or approved storage route.",
      "Search adapter requires a storage-permitted API account; reviewed public-source import runs without keys.",
      "No outreach has been sent.",
      "Stretch targets not reached; coverage remains incomplete.",
    ],
    apiCostIncurredByPackage: 0,
  };
  await writeFile(`${out}/leads.json`, JSON.stringify(leads, null, 2));
  await writeFile(`${out}/crm-model.json`, JSON.stringify(model(store)));
  await writeFile(`${out}/quality-report.json`, JSON.stringify(report, null, 2));
  await writeFile(
    `${out}/data-quality.csv`,
    quality(store)
      .map((r) => r.map((v) => `"${String(cellSafe(v) ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n"),
  );
  await writeFile(
    `${out}/source-coverage.json`,
    JSON.stringify(
      {
        covered: report.localitiesCovered,
        gaps: report.localityGaps,
        audit: store.db.prepare("SELECT * FROM audit").all(),
      },
      null,
      2,
    ),
  );
  return report;
}
