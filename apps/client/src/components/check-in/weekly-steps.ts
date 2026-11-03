import type { AnswerInput, Metric } from "@/lib/api";
export const WEEKLY_STEPS = [
  {
    title: "Body Measurement",
    description: "Enter your measurements in the fields below",
    kind: "measurements",
    codes: ["weight"],
  },
  {
    title: "Circumference Measurement",
    description: "Enter your measurements in the fields below",
    kind: "measurements",
    codes: ["arm", "chest", "forearm", "hips", "thigh", "waist"],
  },
  {
    title: "Progression Photos",
    description: "",
    kind: "photos",
    codes: ["photo_back", "photo_front", "photo_side"],
  },
  {
    title: "How are you feeling this week?",
    description: "Overall mood and mindset over the past week",
    kind: "mood",
    codes: ["mood"],
  },
  {
    title: "How were your energy levels?",
    description: "Think about your energy throughout the last week",
    kind: "stars",
    codes: ["energy"],
  },
  {
    title: "How well did you follow your meal plan?",
    description: "Be honest — no judgment here",
    kind: "stars",
    codes: ["nutrition"],
  },
  {
    title: "How confident are you feeling about your progress?",
    description: "Reflect on your results and your consistency over the past week",
    kind: "stars",
    codes: ["progress"],
  },
  {
    title: "What was your biggest win last week?",
    description: "Big or small — anything you're proud of",
    kind: "text",
    codes: ["biggest_win"],
  },
  {
    title: "How did your training feel?",
    description: "Think about your strength, technique, and overall performance",
    kind: "choice",
    codes: ["training_feel"],
  },
  {
    title: "How was your sleep quality?",
    description: "Did you wake up feeling rested?",
    kind: "stars",
    codes: ["sleep_quality"],
  },
] as const;
export const TRAINING_CHOICES = ["Struggled", "Okay", "Good", "Great", "Amazing"];
export type WeeklyStep = (typeof WEEKLY_STEPS)[number];
export function validAnswer(metric: Metric, answer?: AnswerInput): boolean {
  if (!answer) return false;
  if (metric.type === "number")
    return (
      typeof answer.numberValue === "number" &&
      Number.isFinite(answer.numberValue) &&
      answer.numberValue > 0 &&
      answer.numberValue <= (metric.code === "weight" ? 500 : 300)
    );
  if (metric.type === "rating")
    return (
      Number.isInteger(answer.ratingValue) &&
      Number(answer.ratingValue) >= 1 &&
      Number(answer.ratingValue) <= 5
    );
  if (metric.type === "image")
    return Boolean(answer.imageUrl && /^https:\/\//.test(answer.imageUrl));
  const text = answer.textValue?.trim() ?? "";
  return (
    text.length > 0 &&
    text.length <= 2048 &&
    (metric.code !== "training_feel" || TRAINING_CHOICES.includes(text))
  );
}
export function stepValid(
  step: WeeklyStep,
  metrics: Metric[],
  answers: Record<string, AnswerInput>,
) {
  return step.codes.every((code) => {
    const metric = metrics.find((m) => m.code === code && m.shared);
    return metric != null && validAnswer(metric, answers[metric.id]);
  });
}
