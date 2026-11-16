import { createHash } from "node:crypto";
import { z } from "zod";
export type Evidence = {
  value: string | number | boolean;
  status: "confirmed" | "inferred";
  source: string;
  observedAt: string;
  basis: string;
};
export type Observation = {
  name: string;
  kind: "gym" | "coach";
  locality: string;
  branch: string;
  source: string;
  query: string;
  collectedAt: string;
  verification: "page-reviewed" | "search-snippet";
  facts: Record<string, Evidence>;
};
export type Lead = Observation & {
  id: string;
  score: number;
  confidence: number;
  priority: string;
  onlineStatus: string;
  explanation: string;
};
export const statuses = [
  "New",
  "Researched",
  "Ready to Contact",
  "Contacted",
  "Replied",
  "Interested",
  "Demo Booked",
  "Demo Completed",
  "Trial Started",
  "Converted",
  "Not Interested",
  "Unqualified",
  "No Response",
  "Do Not Contact",
];
export const defaultWeights: Record<string, number> = {
  coaching: 20,
  independent: 15,
  noClientApp: 15,
  activeSocial: 10,
  publicContact: 10,
  weakCapture: 10,
  recurring: 10,
  payingClients: 10,
};
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
export const hash = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 24);
export function url(s: string): string {
  const u = new URL(s);
  if (!["https:", "http:"].includes(u.protocol) || u.username || u.password)
    throw Error("Expected public HTTP(S) URL");
  u.hash = "";
  return u.toString();
}
export const domain = (s: string) => new URL(s).hostname.toLowerCase().replace(/^www\./, "");
export function phone(s: string): string {
  let n = s.replace(/[^\d+]/g, "");
  if (n.startsWith("0091")) n = `+${n.slice(2)}`;
  if (n.startsWith("0")) n = n.slice(1);
  if (/^\d{10}$/.test(n)) n = `+91${n}`;
  if (/^91\d{10}$/.test(n)) n = `+${n}`;
  if (!/^\+91[1-9]\d{9}$/.test(n)) throw Error("Invalid Indian business phone format");
  return n;
}
function object(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) throw Error("Expected object");
  return v as Record<string, unknown>;
}
function string(v: unknown): string {
  if (typeof v !== "string" || !v.trim()) throw Error("Expected nonempty string");
  return v.trim();
}
export function parseObservation(v: unknown): Observation {
  const shape = z.object({
    name: z.string().min(1),
    kind: z.enum(["gym", "coach"]),
    locality: z.string().min(1),
    branch: z.string().min(1),
    source: z.string().url(),
    query: z.string().min(1),
    collectedAt: z.string(),
    verification: z.enum(["page-reviewed", "search-snippet"]),
    facts: z.record(
      z.string(),
      z.object({
        value: z.union([z.string(), z.number().finite(), z.boolean()]),
        status: z.enum(["confirmed", "inferred"]),
        source: z.string().url(),
        observedAt: z.string(),
        basis: z.string().min(1),
      }),
    ),
  });
  const x = shape.parse(v);
  const kind = x.kind;
  if (kind !== "gym" && kind !== "coach") throw Error("Invalid lead kind");
  const collectedAt = string(x.collectedAt);
  if (!Number.isFinite(Date.parse(collectedAt)) || Date.parse(collectedAt) > Date.now() + 86400000)
    throw Error("Invalid collection date");
  const facts: Record<string, Evidence> = {};
  for (const [k, v] of Object.entries(object(x.facts))) {
    const e = object(v);
    if (!["string", "boolean", "number"].includes(typeof e.value))
      throw Error("Invalid evidence value");
    if (e.status !== "confirmed" && e.status !== "inferred") throw Error("Invalid evidence status");
    const observedAt = string(e.observedAt);
    if (!Number.isFinite(Date.parse(observedAt)) || Date.parse(observedAt) > Date.now() + 86400000)
      throw Error("Invalid evidence timestamp");
    let value = e.value as string | number | boolean;
    if (["phone", "whatsapp"].includes(k)) value = phone(string(value));
    if (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string(value)))
      throw Error("Invalid email");
    if (
      [
        "website",
        "instagram",
        "facebook",
        "linkedin",
        "youtube",
        "booking",
        "contactPage",
        "maps",
      ].includes(k)
    )
      value = url(string(value));
    facts[k] = {
      value,
      status: e.status,
      source: url(string(e.source)),
      observedAt,
      basis: string(e.basis),
    };
  }
  if (facts.bengaluruBased?.value !== true || facts.bengaluruBased.status !== "confirmed")
    throw Error("Explicit Bengaluru location evidence required");
  const verification = x.verification;
  if (verification !== "page-reviewed" && verification !== "search-snippet")
    throw Error("Invalid verification");
  return {
    name: string(x.name),
    kind,
    locality: string(x.locality),
    branch: string(x.branch),
    source: url(string(x.source)),
    query: string(x.query),
    collectedAt,
    verification,
    facts,
  };
}
export const isFresh = (e: Evidence, now = Date.now(), days = 90) =>
  now - Date.parse(e.observedAt) <= days * 86400000;
export function qualify(
  o: Observation,
  id: string,
  weights = defaultWeights,
  now = Date.now(),
): Lead {
  if (
    Object.values(weights).some((x) => !Number.isFinite(x) || x < 0) ||
    Object.values(weights).reduce((a, b) => a + b, 0) !== 100
  )
    throw Error("Weights must be nonnegative and sum to 100");
  const yes = (k: string) => {
    const e = o.facts[k];
    return e?.value === true && e.status === "confirmed" && isFresh(e, now);
  };
  const known = (k: string) => {
    const e = o.facts[k];
    return !!e && e.status === "confirmed" && isFresh(e, now);
  };
  const signals: Record<string, boolean> = {
    coaching: yes("personalTraining") || yes("onlineCoaching"),
    independent: yes("independent"),
    noClientApp: yes("noClientApp"),
    activeSocial: yes("activeSocial"),
    publicContact: ["phone", "email", "whatsapp"].some(known),
    weakCapture: yes("weakCapture"),
    recurring: yes("recurring"),
    payingClients: yes("payingClients"),
  };
  const score = Object.entries(signals).reduce((s, [k, v]) => s + (v ? (weights[k] ?? 0) : 0), 0);
  const dimensions = [
    "bengaluruBased",
    "address",
    "website",
    "phone",
    "email",
    "owner",
    "personalTraining",
    "onlineCoaching",
    "independent",
    "clientApp",
  ];
  const confidence = Math.round((dimensions.filter(known).length / dimensions.length) * 100);
  const e = o.facts.onlineCoaching;
  const onlineStatus = yes("onlineCoaching")
    ? "Confirmed online coach"
    : e?.value === true
      ? "Likely online coach, needs verification"
      : known("onlineCoaching") && e?.value === false
        ? "Offline only"
        : "Unknown";
  const phrases = [
    yes("personalTraining") ? "Publishes personal training services" : null,
    yes("onlineCoaching") ? "advertises online coaching" : null,
    yes("recurring") ? "offers recurring programs" : null,
  ].filter(Boolean);
  return {
    ...o,
    id,
    score,
    confidence,
    priority:
      score >= 80
        ? "High priority"
        : score >= 60
          ? "Medium priority"
          : score >= 40
            ? "Low priority"
            : "Research further",
    onlineStatus,
    explanation: phrases.length
      ? `${phrases.join("; ")}. Potential fit for Traiv coaching and client-management tools; current workflow needs discovery.`
      : "Bengaluru fitness business. Verify coaching services and workflow before assessing Traiv fit.",
  };
}
export function match(a: Observation, b: Observation): "same" | "review" | "different" {
  if (a.kind !== b.kind) return "different";
  const av = (k: string) => String(a.facts[k]?.value ?? "");
  const bv = (k: string) => String(b.facts[k]?.value ?? "");
  const sameName = norm(a.name) === norm(b.name);
  const sameBranch = norm(a.branch) === norm(b.branch);
  const samePhone = !!av("phone") && av("phone") === bv("phone");
  const sameDomain =
    !!av("website") && !!bv("website") && domain(av("website")) === domain(bv("website"));
  const sameSocial =
    !!av("instagram") && av("instagram").replace(/\/$/, "") === bv("instagram").replace(/\/$/, "");
  if (a.kind === "gym" && !sameBranch)
    return (samePhone || sameDomain || sameSocial) && norm(a.locality) === norm(b.locality)
      ? "review"
      : "different";
  const sameAddress = !!av("address") && norm(av("address")) === norm(bv("address"));
  if (
    sameName &&
    sameBranch &&
    (samePhone || sameDomain || sameSocial || sameAddress || a.source === b.source)
  )
    return "same";
  if (samePhone || sameSocial || (sameName && sameBranch)) return "review";
  // Fuzzy names only produce a review candidate, never an automatic merge.
  const tokens = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .split(/\W+/)
        .filter((x) => x.length > 2),
    );
  const aa = tokens(a.name),
    bb = tokens(b.name);
  const j = [...aa].filter((x) => bb.has(x)).length / new Set([...aa, ...bb]).size;
  return j >= 0.75 && sameBranch ? "review" : "different";
}
export const cellSafe = (v: unknown) =>
  typeof v === "string" && /^[\s]*[=+@-]/.test(v) ? `'${v}` : v;
