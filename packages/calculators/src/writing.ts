/**
 * Fifteen habits that make a draft read like generic AI copy. Each rule finds spans in
 * the text; the score counts rules hit, not authorship. It cannot tell who wrote a text.
 */

export type Tell = {
  id: string;
  name: string;
  /** Points when hit. Contrast framing and a pile of buzzwords count double. */
  points: (hits: number) => number;
  find: (text: string) => [number, number][];
};

const all = (re: RegExp) => (text: string) => {
  const out: [number, number][] = [];
  for (const m of text.matchAll(re)) out.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  return out;
};
const atLeast = (n: number, re: RegExp) => (text: string) => {
  const hits = all(re)(text);
  return hits.length >= n ? hits : [];
};
const one = () => 1;

const BUZZ = /\b(?:unlock(?:ing)?|elevate|journey|game[- ]?changer|transform(?:ative|ation)?|delve|empower(?:ing)?|holistic|synergy|leverage|seamless(?:ly)?|next level|supercharge|ultimate|revolutionary|crush(?:ing)? it|optimi[sz]e your|potential)\b/gi;

export const TELLS: Tell[] = [
  { id: "contrast", name: "Contrast framing", points: () => 2, find: all(/\b(?:it'?s|this is|that'?s)? ?not (?:just )?(?:about )?[^.!?\n]{1,40}[.,;]\s*(?:it'?s|this is) (?:about )?/gi) },
  { id: "worldopener", name: "Big-picture opener", points: one, find: all(/\b(?:in today'?s (?:fast[- ]paced |busy |modern )?world|in a world where|now more than ever|in this day and age)\b/gi) },
  { id: "questions", name: "Stacked questions", points: one, find: all(/(?:[^.!?\n]{3,80}\?\s*){2,}/g) },
  { id: "triple", name: "List of three abstractions", points: one, find: all(/\b[A-Za-z]+(?:ness|ence|ance|ity|ion|ment|ship)?, [a-z]+(?:ness|ence|ance|ity|ion|ment|ship)?,? and [a-z]+(?:ness|ence|ance|ity|ion|ment|ship)\b/g) },
  { id: "buzz", name: "Buzzwords", points: (h) => (h >= 3 ? 2 : 1), find: all(BUZZ) },
  { id: "cheer", name: "Cheerleader sign-off", points: one, find: all(/\b(?:you'?ve got this|let'?s go|you deserve it|keep crushing|you can do (?:it|this)|believe in yourself)\b/gi) },
  { id: "offer", name: "Assistant-style offer to help", points: one, find: all(/\b(?:if you'?d like,? i can|let me know if you(?:'?d like| want| need)|feel free to reach out|happy to help further|i hope this helps)\b/gi) },
  { id: "tired", name: "\"Are you tired of\" hook", points: one, find: all(/\b(?:are you (?:tired|sick) of|struggling with|frustrated (?:with|by))\b/gi) },
  { id: "signpost", name: "Throat-clearing signposts", points: one, find: all(/\b(?:here'?s the thing|let'?s dive in|let'?s break it down|without further ado|buckle up)\b/gi) },
  { id: "imagine", name: "\"Imagine\" opener", points: one, find: all(/(?:^|[.!?]\s+)imagine\b/gi) },
  { id: "intensifiers", name: "Stacked intensifiers", points: one, find: atLeast(3, /\b(?:truly|really|incredibly|absolutely|extremely|super|literally)\b/gi) },
  { id: "dashes", name: "Dash overuse", points: one, find: atLeast(3, /—|–|\s-\s/g) },
  { id: "exclaim", name: "Exclamation marks", points: one, find: atLeast(2, /!/g) },
  { id: "hedge", name: "Hedging filler", points: one, find: all(/\b(?:it'?s important to note|it'?s worth noting|can potentially|may potentially|in some cases|it is essential to)\b/gi) },
  { id: "wrapup", name: "Summary wrap-up", points: one, find: all(/\b(?:in conclusion|ultimately|at the end of the day|the bottom line is|to sum up)\b/gi) },
];

export function checkWriting(text: string) {
  const hits = TELLS.map((t) => ({ tell: t, spans: t.find(text) })).filter((h) => h.spans.length > 0);
  const points = hits.reduce((a, h) => a + h.tell.points(h.spans.length), 0);
  const score = Math.min(10, points);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[^.!?\n]+[.!?]+|[^.!?\n]+$/gm) ?? []).filter((x) => x.trim()).length : 0;
  const band: "post" | "edit" | "rewrite" = score <= 2 ? "post" : score <= 5 ? "edit" : "rewrite";
  return { hits, points, score, band, words, sentences };
}

/** Merge overlapping spans and return text segments flagged as hit or plain. */
export function segments(text: string, spans: [number, number][]) {
  const sorted = [...spans].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const s of sorted) {
    const last = merged[merged.length - 1];
    if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]);
    else merged.push([s[0], s[1]]);
  }
  const out: { text: string; hit: boolean }[] = [];
  let i = 0;
  for (const [a, b] of merged) {
    if (a > i) out.push({ text: text.slice(i, a), hit: false });
    out.push({ text: text.slice(a, b), hit: true });
    i = b;
  }
  if (i < text.length) out.push({ text: text.slice(i), hit: false });
  return out;
}

export const wordCount = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);
