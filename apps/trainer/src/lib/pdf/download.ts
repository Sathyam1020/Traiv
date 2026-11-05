import { mealPlansApi } from "../api/meal-plans";
import { nutritionApi } from "../api/nutrition";
import { workoutApi } from "../api/workouts";
import { mealPlanPdf, type PdfAssets, type RecipeMetadata, workoutPdf } from "./documents";

let fonts: Promise<Pick<PdfAssets, "regular" | "bold">> | undefined;
function base64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 16384)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 16384));
  return btoa(binary);
}
async function loadFonts() {
  if (!fonts) {
    fonts = Promise.all(
      ["Regular", "Bold"].map(async (weight) => {
        const response = await fetch(`/fonts/pdf/Arimo-${weight}.ttf`, {
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error("Couldn't load PDF fonts. Please try again.");
        return base64(await response.arrayBuffer());
      }),
    )
      .then(([regular, bold]) => ({ regular: regular as string, bold: bold as string }))
      .catch((error) => {
        fonts = undefined;
        throw error;
      });
  }
  return fonts;
}
async function mapLimit<T, R>(items: T[], task: (value: T) => Promise<R>): Promise<R[]> {
  const output = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        output[index] = await task(items[index] as T);
      }
    }),
  );
  return output;
}
async function thumbnail(source: string): Promise<string | null> {
  let bitmap: ImageBitmap | undefined;
  try {
    const url = new URL(source, window.location.origin);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000), credentials: "omit" });
    if (!response.ok) return null;
    const blob = await response.blob();
    // Remote SVGs are deliberately not embedded/executed in the export renderer.
    if (blob.size > 10 * 1024 * 1024 || !/^image\/(png|jpe?g|webp|gif|avif)/iu.test(blob.type))
      return null;
    bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    const context = canvas.getContext("2d");
    if (!context || !bitmap.width || !bitmap.height) return null;
    const side = Math.min(bitmap.width, bitmap.height);
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      240,
      240,
    );
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  } finally {
    bitmap?.close();
  }
}
async function assets(urls: (string | null | undefined)[]) {
  const unique = [...new Set(urls.filter((u): u is string => Boolean(u)))];
  const [font, thumbnails] = await Promise.all([loadFonts(), mapLimit(unique, thumbnail)]);
  const images = new Map<string, string>();
  thumbnails.forEach((data, index) => {
    if (data) images.set(unique[index] as string, data);
  });
  return { assets: { ...font, images }, missingImages: unique.length - images.size };
}
export function pdfFilename(name: string): string {
  return `${
    name
      .normalize("NFKC")
      .replace(/[<>:"/\\|?*]/gu, "-")
      .split("")
      .map((c) => (c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127 ? "-" : c))
      .join("")
      .replace(/[. ]+$/gu, "")
      .trim()
      .slice(0, 120) || "plan"
  }.pdf`;
}

/** Reads the current saved draft, preserving recipe quantities and workout prescriptions. */
export async function downloadPlanPdf(kind: "workout" | "mealplan", studioId: string, id: string) {
  if (kind === "workout") {
    const template = await workoutApi.templates.get(studioId, id);
    const loaded = await assets(
      template.sessions.flatMap((s) => s.exercises.map((e) => e.imageUrl)),
    );
    const pdf = workoutPdf(template, { assets: loaded.assets, origin: window.location.origin });
    await pdf.save(pdfFilename(template.name), { returnPromise: true });
    return loaded.missingImages;
  }
  const plan = await mealPlansApi.get(studioId, id);
  const options = plan.document.slots.filter((s) => s.enabled).flatMap((s) => s.options);
  const recipeIds = [...new Set(options.map((o) => o.recipeId))];
  // Older snapshots omit description/prep/cook. Supplement only display metadata;
  // exported steps, nutrition and quantities always come from the saved plan itself.
  const [loaded, recipes] = await Promise.all([
    assets(options.map((o) => o.imageUrl)),
    mapLimit(recipeIds, async (recipeId) => {
      try {
        return [recipeId, await nutritionApi.recipes.get(studioId, recipeId)] as const;
      } catch {
        return [recipeId, undefined] as const;
      }
    }),
  ]);
  const metadata = new Map<string, RecipeMetadata>();
  recipes.forEach(([recipeId, recipe]) => {
    if (recipe) metadata.set(recipeId, recipe);
  });
  const pdf = mealPlanPdf(plan.document, { assets: loaded.assets }, metadata);
  await pdf.save(pdfFilename(plan.document.settings.name), { returnPromise: true });
  return loaded.missingImages;
}
