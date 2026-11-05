import { optionNutrition, type PlanDocument, type PlanOption } from "@traiv/nutrition/meal-plans";
import { jsPDF } from "jspdf";
import type { PrescribedSet, SessionExercise, WorkoutTemplate } from "../api/types";

// Reference export: A4 portrait, 41 CSS px margins, Arial, with Traiv sapphire / graphite colors.
// Kept independent from the browser so the exact downloaded documents can be rendered
// and checked with long/multi-page fixtures without a running application or database.
const M = 30.75;
// Print palette matches packages/ui/src/styles/premium-theme.css light tokens.
const ACCENT = "#2459b8";
const ACCENT_SUBTLE = "#f0f6ff";
const INK = "#252b28";
const MUTED = "#657168";
const LINE = "#d9dfd8";
const WELL = "#f3f4f1";
export type PdfAssets = {
  regular: string;
  bold: string;
  /** Square, already-cropped PNG data URLs keyed by the original source URL. */
  images: Map<string, string>;
};
export type RecipeMetadata = {
  description?: string | null;
  prepMinutes?: number | null;
  cookMinutes?: number | null;
  difficulty?: string | null;
};
export type PdfContext = { assets: PdfAssets; date?: Date; origin?: string };

function clean(value: string): string {
  return Array.from(value)
    .filter((c) => c.charCodeAt(0) >= 32 || c === "\n" || c === "\t")
    .join("");
}
const number = (value: number | null | undefined) =>
  value == null
    ? "—"
    : Number.isInteger(value)
      ? String(value)
      : String(Math.round(value * 100) / 100);
const time = (seconds: number | null | undefined) => {
  if (seconds == null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes}m${rest ? ` ${rest}s` : ""}` : `${rest}s`;
};
export function quantity(value: number): string {
  const whole = Math.floor(value);
  const fraction = value - whole;
  const symbol = [
    [0.25, "¼"],
    [0.5, "½"],
    [0.75, "¾"],
  ].find(([n]) => Math.abs(fraction - Number(n)) < 0.005)?.[1];
  return symbol ? `${whole || ""}${symbol}` : number(value);
}
function unitName(unit: string): string {
  return (
    (
      {
        grams: "g",
        gram: "g",
        milliliters: "ml",
        milliliter: "ml",
        teaspoons: "tsp",
        tablespoons: "tbsp",
      } as Record<string, string>
    )[unit] ?? unit
  );
}
function safeLink(value: string | null | undefined): string | undefined {
  try {
    const url = new URL(value ?? "");
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

class Document {
  readonly pdf = new jsPDF({
    unit: "pt",
    format: [595.92, 841.92],
    compress: true,
    putOnlyUsedFonts: true,
  });
  readonly width = this.pdf.internal.pageSize.getWidth();
  readonly height = this.pdf.internal.pageSize.getHeight();
  readonly content = this.width - M * 2;
  y = M;
  readonly bottom = this.height - M;
  constructor(
    readonly context: PdfContext,
    title: string,
  ) {
    this.pdf.addFileToVFS("Arimo-Regular.ttf", context.assets.regular);
    this.pdf.addFont("Arimo-Regular.ttf", "Arimo", "normal");
    this.pdf.addFileToVFS("Arimo-Bold.ttf", context.assets.bold);
    this.pdf.addFont("Arimo-Bold.ttf", "Arimo", "bold");
    this.pdf.setProperties({ title: clean(title), creator: "Traiv", subject: "Coaching plan" });
    this.pdf.setLineWidth(0.5);
    this.font();
  }
  font(size = 9, bold = false, color = INK) {
    this.pdf.setFont("Arimo", bold ? "bold" : "normal");
    this.pdf.setFontSize(size);
    this.pdf.setTextColor(color);
  }
  lines(text: string, width: number, size = 9, bold = false): string[] {
    this.font(size, bold);
    return this.pdf.splitTextToSize(clean(text), Math.max(12, width)) as string[];
  }
  text(text: string, x: number, y: number, size = 9, bold = false, color = INK) {
    this.font(size, bold, color);
    this.pdf.text(clean(text), x, y, { baseline: "top" });
  }
  right(text: string, x: number, y: number, size = 8.25, color = MUTED) {
    this.font(size, false, color);
    this.pdf.text(clean(text), x, y, { align: "right", baseline: "top" });
  }
  next() {
    this.pdf.addPage();
    this.y = M - 3;
  }
  ensure(height: number) {
    if (this.y + height > this.bottom) this.next();
  }
  rule(x = M, width = this.content) {
    this.pdf.setDrawColor(LINE);
    this.pdf.line(x, this.y, x + width, this.y);
  }
  paragraph(text: string, size = 9, color = MUTED, x = M, width = this.content, bold = false) {
    const lines = this.lines(text, width, size, bold);
    for (const line of lines) {
      this.ensure(size * 1.45);
      this.text(line, x, this.y, size, bold, color);
      this.y += size * 1.45;
    }
  }
  section(title: string, size = 12) {
    const lines = this.lines(title.toUpperCase(), this.content - 24, size, true);
    const h = Math.max(30.75, lines.length * 16 + 12);
    this.ensure(h + 65);
    this.pdf.setFillColor(ACCENT_SUBTLE);
    this.pdf.rect(M, this.y, this.content, h, "F");
    this.pdf.setFillColor(ACCENT);
    this.pdf.rect(M, this.y, 2.25, h, "F");
    lines.forEach((line, i) => {
      this.text(line, M + 12, this.y + 9 + i * 16, size, true, ACCENT);
    });
    this.y += h + 12;
  }
  image(url: string | null | undefined, x: number, y: number, size: number) {
    const data = url ? this.context.assets.images.get(url) : undefined;
    if (data) {
      this.pdf.saveGraphicsState();
      this.pdf.roundedRect(x, y, size, size, 4, 4, null);
      this.pdf.clip();
      this.pdf.discardPath();
      this.pdf.addImage(data, "PNG", x, y, size, size);
      this.pdf.restoreGraphicsState();
    } else {
      this.pdf.setFillColor(WELL);
      this.pdf.roundedRect(x, y, size, size, 4, 4, "F");
      this.pdf.setDrawColor("#657168");
      this.pdf.line(x + size * 0.28, y + size * 0.5, x + size * 0.72, y + size * 0.5);
      this.pdf.line(x + size * 0.32, y + size * 0.35, x + size * 0.32, y + size * 0.65);
      this.pdf.line(x + size * 0.68, y + size * 0.35, x + size * 0.68, y + size * 0.65);
    }
  }
  footer() {
    this.y += 8;
    // The small footer can use the otherwise-empty bottom margin.
    if (this.y + 20 > this.height - 12) this.next();
    this.rule();
    const date = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(this.context.date ?? new Date());
    this.font(7.5, false, "#657168");
    this.pdf.text(`Generated on ${date}`, this.width / 2, this.y + 12, {
      align: "center",
      baseline: "top",
    });
  }
  cover(name: string, description: string | null) {
    this.y = M + 1.65;
    this.paragraph(name, 21, INK, M, this.content, true);
    this.y += 5.5;
    if (description) this.paragraph(description, 10.5);
  }
}

type Column = {
  label: string;
  width: number;
  value: (set: PrescribedSet, index: number) => string;
};
function columns(exercise: SessionExercise): Column[] {
  const fields = exercise.fields ?? ["weight", "reps", "rest"];
  const cols: Omit<Column, "width">[] = [{ label: "SET", value: (_, i) => String(i + 1) }];
  if (fields.includes("weight"))
    cols.push({ label: "WEIGHT (KG)", value: (s) => number(s.weightKg) });
  if (fields.includes("reps"))
    cols.push({
      label: "REP RANGE",
      value: (s) =>
        s.repsMax != null && s.reps != null && s.repsMax !== s.reps
          ? `${s.reps}–${s.repsMax}`
          : number(s.reps),
    });
  if (fields.includes("duration")) cols.push({ label: "DURATION", value: (s) => time(s.seconds) });
  if (fields.includes("distance"))
    cols.push({ label: "DISTANCE (M)", value: (s) => number(s.distanceM) });
  if (fields.includes("calories"))
    cols.push({ label: "CALORIES", value: (s) => number(s.calories) });
  if (fields.includes("rest")) cols.push({ label: "REST", value: (s) => time(s.restSeconds) });
  return cols.map((c, i) => ({
    ...c,
    width:
      i === 0
        ? 0.06
        : cols.length === 4 && fields.includes("weight")
          ? ([0, 0.44, 0.41, 0.09][i] as number)
          : 0.94 / (cols.length - 1 || 1),
  }));
}
export function workoutPdf(template: WorkoutTemplate, context: PdfContext): jsPDF {
  const d = new Document(context, template.name);
  d.cover(template.name, template.description);
  if (!template.sessions.length) {
    d.y += 15;
    d.paragraph("No sessions added yet.");
  }
  template.sessions.forEach((session) => {
    d.next();
    d.section(session.name);
    if (!session.exercises.length) d.paragraph("No exercises added yet.");
    session.exercises.forEach((exercise, index) => {
      const cols = columns(exercise);
      const x = M + 27;
      const width = d.content - 27;
      const name = d.lines(exercise.name ?? "Exercise", width - 72, 11.25, true);
      const meta = d.lines(
        [exercise.muscle, exercise.equipment].filter(Boolean).join(" · "),
        width - 72,
        8.25,
      );
      const headerHeight = Math.max(37.5, name.length * 14 + meta.length * 11 + 3);
      d.ensure(headerHeight + 65);
      d.pdf.setFillColor(ACCENT);
      d.pdf.circle(M + 9.75, d.y + 10, 9.75, "F");
      d.font(9.75, true, "#ffffff");
      d.pdf.text(String(index + 1), M + 9.75, d.y + 10, { align: "center", baseline: "middle" });
      d.image(exercise.imageUrl, x, d.y, 37.5);
      name.forEach((line, i) => {
        d.text(line, x + 46, d.y + i * 14, 11.25, true);
      });
      meta.forEach((line, i) => {
        d.text(line, x + 46, d.y + name.length * 14 + 3 + i * 11, 8.25, false, MUTED);
      });
      const detailUrl = context.origin
        ? `${context.origin}/exercises?exercise=${encodeURIComponent(exercise.exerciseId)}`
        : undefined;
      const link = safeLink(exercise.videoUrl) ?? safeLink(detailUrl);
      if (link) {
        d.pdf.setDrawColor(ACCENT);
        d.pdf.roundedRect(d.width - M - 21, d.y + 1, 21, 18, 2, 2, "S");
        d.text("→", d.width - M - 17, d.y + 3, 10, false, ACCENT);
        d.pdf.link(d.width - M - 21, d.y, 21, 20, { url: link });
      }
      d.y += headerHeight + 6;
      if (exercise.note) {
        d.paragraph(exercise.note, 8.25, MUTED, x, width);
        d.y += 6;
      }
      const tableHeader = () => {
        d.pdf.setFillColor(WELL);
        d.pdf.rect(x, d.y, width, 18.75, "F");
        let left = x;
        cols.forEach((c) => {
          d.text(c.label, left + 7, d.y + 5, cols.length > 5 ? 6 : 7, true, MUTED);
          left += width * c.width;
        });
        d.y += 18.75;
        d.rule(x, width);
      };
      d.ensure(40);
      tableHeader();
      if (!exercise.sets.length) {
        d.text("No sets added yet.", x + 7, d.y + 6, 8.25, false, MUTED);
        d.y += 22;
      }
      exercise.sets.forEach((set, i) => {
        if (d.y + 22 > d.bottom) {
          d.next();
          d.paragraph(exercise.name ?? "Exercise", 10, INK, x, width, true);
          d.y += 8;
          tableHeader();
        }
        let left = x;
        cols.forEach((c) => {
          d.text(c.value(set, i), left + 7, d.y + 6, 8.25);
          left += width * c.width;
        });
        d.y += 21.75;
        d.rule(x, width);
      });
      d.y += 16;
    });
  });
  d.footer();
  return d.pdf;
}

function recipeMeta(meta: RecipeMetadata | undefined): string {
  return [
    meta?.prepMinutes ? `Prep: ${meta.prepMinutes} min` : "",
    meta?.cookMinutes ? `Cook: ${meta.cookMinutes} min` : "",
    meta?.difficulty,
    "1 serving",
  ]
    .filter(Boolean)
    .join("   ");
}
function recipeHeight(d: Document, option: PlanOption, meta?: RecipeMetadata): number {
  const header = Math.max(
    48,
    d.lines(option.name, d.content - 57, 12, true).length * 14 +
      (meta?.description ? d.lines(meta.description, d.content - 57, 9).length * 11 + 4 : 0) +
      17,
  );
  return (
    header +
    48 +
    option.ingredients.reduce(
      (sum, l) => sum + Math.max(20.25, d.lines(l.name, d.content - 95, 9).length * 11 + 9),
      0,
    ) +
    30 +
    option.steps.reduce(
      (sum, s) => sum + Math.max(26.25, d.lines(s, d.content - 24, 9).length * 12 + 10),
      0,
    ) +
    20
  );
}
export function mealPlanPdf(
  document: PlanDocument,
  context: PdfContext,
  metadata = new Map<string, RecipeMetadata>(),
): jsPDF {
  const d = new Document(context, document.settings.name);
  const s = document.settings;
  d.cover(s.name, s.description || null);
  d.y += 3;
  const cards = [
    [number(s.calorieTarget), "CALORIES", ""],
    [`${Math.round((s.calorieTarget * s.proteinPct) / 400)}g`, "PROTEIN", `${s.proteinPct}%`],
    [`${Math.round((s.calorieTarget * s.carbsPct) / 400)}g`, "CARBS", `${s.carbsPct}%`],
    [`${Math.round((s.calorieTarget * s.fatPct) / 900)}g`, "FAT", `${s.fatPct}%`],
  ];
  d.ensure(72);
  const w = (d.content - 30) / 4;
  cards.forEach(([value, label, pct], i) => {
    const x = M + i * (w + 10);
    d.pdf.setFillColor(i === 0 ? ACCENT_SUBTLE : "#f3f4f1");
    d.pdf.setDrawColor(i === 0 ? "#c5dbff" : LINE);
    d.pdf.roundedRect(x, d.y, w, 70.5, 5, 5, "FD");
    d.font(16.5, true, i === 0 ? ACCENT : INK);
    d.pdf.text(value ?? "", x + w / 2, d.y + 14, { align: "center", baseline: "top" });
    d.font(8.25, true, MUTED);
    d.pdf.text(label ?? "", x + w / 2, d.y + 38, { align: "center", baseline: "top" });
    if (pct) {
      d.font(8.25, false, "#657168");
      d.pdf.text(pct, x + w / 2, d.y + 52, { align: "center", baseline: "top" });
    }
  });
  d.y += 70.5;
  const slots = document.slots.filter((slot) => slot.enabled);
  if (!slots.length) {
    d.y += 20;
    d.paragraph("No meals added yet.");
  }
  slots.forEach((slot) => {
    d.next();
    d.section(slot.name, 13.5);
    d.text(
      `${slot.percentage}% of daily calories · ~${Math.round((s.calorieTarget * slot.percentage) / 100)} kcal`,
      M + 12,
      d.y - 4,
      9,
      false,
      MUTED,
    );
    d.y += 18;
    if (!slot.options.length) d.paragraph("No recipe options added yet.");
    slot.options.forEach((option, recipeIndex) => {
      const meta = metadata.get(option.recipeId);
      const estimate = recipeHeight(d, option, meta);
      if (estimate < d.bottom - M && d.y + estimate > d.bottom) d.next();
      d.ensure(90);
      if (recipeIndex > 0 && d.y > M) {
        d.rule();
        d.y += 13;
      }
      const start = d.y;
      d.image(option.imageUrl, M, start, 48);
      d.paragraph(option.name, 12, INK, M + 57, d.content - 57, true);
      if (meta?.description) {
        d.y += 3;
        d.paragraph(meta.description, 9, MUTED, M + 57, d.content - 57);
      }
      d.y += 5;
      d.paragraph(recipeMeta(meta), 8.25, MUTED, M + 57, d.content - 57);
      d.y = Math.max(d.y, start + 48) + 7;
      const n = optionNutrition(option);
      const macros = [
        `${Math.round(n.kcal)} kcal`,
        `${Math.round(n.proteinG)}g Protein`,
        `${Math.round(n.carbsG)}g Carbs`,
        `${Math.round(n.fatG)}g Fat`,
      ];
      d.ensure(40);
      let left = M;
      macros.forEach((label, i) => {
        d.font(9, true);
        const width = d.pdf.getTextWidth(label) + 14;
        d.pdf.setFillColor(i === 0 ? ACCENT_SUBTLE : WELL);
        d.pdf.roundedRect(left, d.y, width, 19.5, 3, 3, "F");
        d.text(label, left + 7, d.y + 5, 9, true, i === 0 ? ACCENT : "#59645d");
        left += width + 6;
      });
      d.y += 31;
      d.text("INGREDIENTS", M, d.y, 9.75, true, "#59645d");
      d.y += 17;
      if (!option.ingredients.length) {
        d.paragraph("No ingredients added yet.", 9);
        d.y += 8;
      }
      option.ingredients.forEach((line) => {
        const label = [line.name, line.preparationNote].filter(Boolean).join(" · ");
        const lines = d.lines(label, d.content - 95, 9);
        for (let index = 0; index < lines.length; index++) {
          d.ensure(21);
          d.text(lines[index] ?? "", M, d.y + 4, 9);
          if (index === 0)
            d.right(`${quantity(line.quantity)} ${unitName(line.unit)}`, d.width - M, d.y + 4, 9);
          d.y += index === lines.length - 1 ? 20.25 : 11;
        }
        d.rule();
      });
      if (option.steps.length) {
        d.ensure(55);
        d.y += 10;
        d.text("INSTRUCTIONS", M, d.y, 9.75, true, "#59645d");
        d.y += 20;
        option.steps.forEach((step, index) => {
          const lines = d.lines(step, d.content - 24, 9);
          d.ensure(Math.min(40, lines.length * 12 + 10));
          d.pdf.setFillColor(ACCENT);
          d.pdf.circle(M + 9, d.y + 9, 9, "F");
          d.font(9, true, "#ffffff");
          d.pdf.text(String(index + 1), M + 9, d.y + 9, {
            align: "center",
            baseline: "middle",
          });
          lines.forEach((line, i) => {
            d.ensure(12);
            d.text(line, M + 24, d.y + (i === 0 ? 2 : 0), 9, false, "#59645d");
            d.y += 12;
          });
          d.y += 12;
          d.rule(M + 24, d.content - 24);
          d.y += 2;
        });
      }
      d.y += 18;
    });
  });
  if (slots.length) d.y -= 18;
  d.footer();
  return d.pdf;
}
