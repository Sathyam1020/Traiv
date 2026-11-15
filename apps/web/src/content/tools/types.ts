import type { ReactNode } from "react";

export type ToolGroup = "nutrition" | "strength" | "body" | "cardio" | "business";
export type ToolKind = "calculator" | "reader" | "generator" | "timer";

/** Structural facts about a tool, generated from the research. */
export type ToolEntry = {
  slug: string;
  name: string;
  group: ToolGroup;
  kind: ToolKind;
  faqCount: number;
  sections: { prompt: boolean; aiLinks: boolean; demo: boolean; sources: boolean };
  related: string[];
};

/** Where a tool's contextual CTA points. Every key must be a feature that exists. */
export type PitchKey = "nutrition" | "workouts" | "check-ins" | "client-app" | "messaging";

export type Faq = { q: string; a: string };
export type Source = { label: string; href?: string };

export type ProsePart = { heading: string; body: ReactNode };

/**
 * Everything a reader reads on one tool page. Written by us, per tool, in
 * `copy/<slug>.tsx`. The page renders these in the researched section order.
 */
export type ToolCopy = {
  /** Title tag, under 60 characters. */
  title: string;
  /** Meta description, under 160 characters. */
  description: string;
  /** Small label above the H1, e.g. "Free tool · nutrition". */
  eyebrow: string;
  h1: string;
  intro: ReactNode;
  method?: string;
  sources?: readonly Source[];
  /** "The short answer": 2 to 4 sentences, written to be quoted. */
  shortAnswer: { question: string; answer: ReactNode };
  /** Method and reference sections, in order. */
  sections: readonly ProsePart[];
  /** "How coaches use this". */
  forCoaches: ProsePart;
  pitch: { key: PitchKey; heading: string; body: ReactNode };
  /** The line under the result. Follows on from the number just calculated. */
  next: { label: string; href: string }[];
  nextPitch: string;
  prompt?: { heading: string; whenToUse: string; pasteIn: string; text: string };
  faq: readonly Faq[];
  disclaimer?: ReactNode;
  keepGoing: { label: string; href: string }[];
  close: { heading: string; body: string };
};

export type LiveTool = ToolEntry & { copy: ToolCopy };
