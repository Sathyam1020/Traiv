import {
  Dumbbell,
  Utensils,
  ClipboardList,
  Smartphone,
  MessageSquareText,
  CreditCard,
  Folder,
} from "@traiv/ui/icons";
import type { ComponentType } from "react";
export type Feature = {
  slug: string;
  name: string;
  blurb: string;
  icon: ComponentType<{ className?: string }>;
  headline: string;
  body: string;
  status?: "building";
  points: { title: string; body: string }[];
};
export const FEATURES: readonly Feature[] = [
  {
    slug: "today",
    name: "Today",
    blurb: "Your client's day in one place",
    icon: Smartphone,
    headline: "Their plan for today. Ready to follow.",
    body: "Clients can find their assigned workout and diet plan, log progress and open shared resources from Traiv.",
    points: [
      { title: "Plans on their phone", body: "Give your client a place to find what to do next." },
      {
        title: "Progress in context",
        body: "Weight, measurements and recent activity help clients follow their progress.",
      },
    ],
  },
  {
    slug: "plan-builder",
    name: "Workout plans",
    blurb: "Build once. Personalise for each client.",
    icon: Dumbbell,
    headline: "Your method, in every workout plan.",
    body: "Create sessions, choose exercises and set the details. Save templates to reuse with your clients.",
    points: [
      { title: "Plan the session", body: "Set exercises, sets, reps, weights and rest periods." },
      {
        title: "Give clients context",
        body: "Exercise demonstrations are available where the library includes media.",
      },
      {
        title: "Reuse your work",
        body: "Duplicate templates, personalise plans and download them as PDFs.",
      },
    ],
  },
  {
    slug: "nutrition",
    name: "Diet plans",
    blurb: "Meals that fit your client's routine",
    icon: Utensils,
    headline: "Give their diet plan a place to live.",
    body: "Build diet plans with recipes, ingredients and daily calorie and macro targets. Clients can view their assigned plans and log food.",
    points: [
      {
        title: "Set daily targets",
        body: "Choose calories and the protein, carbohydrate and fat split.",
      },
      {
        title: "Build with recipes",
        body: "Use recipe ingredients and portions to create meals around your client.",
      },
      { title: "Follow food logs", body: "Review what clients have logged and adjust their plan." },
    ],
  },
  {
    slug: "check-ins",
    name: "Check-ins and progress",
    blurb: "Understand the week behind the numbers",
    icon: ClipboardList,
    headline: "A clearer picture of their week.",
    body: "Review check-in answers, ratings, measurements and progress together, then decide what your client needs next.",
    points: [
      { title: "Hear from your client", body: "Collect answers and ratings through check-ins." },
      { title: "Follow changes", body: "Review weight trends and body measurements over time." },
      { title: "See the context", body: "Keep client progress alongside the plans you assign." },
    ],
  },
  {
    slug: "client-app",
    name: "Client app",
    blurb: "Their coaching, wherever they are",
    icon: Smartphone,
    headline: "Their next step is on their phone.",
    body: "Clients use Traiv to open plans, log workouts and food, and send check-ins. Add your name and logo in the app.",
    points: [
      {
        title: "No app store download",
        body: "Open Traiv in the browser on Android or iPhone, or add it to the home screen.",
      },
      { title: "Your name and logo", body: "Clients see your coaching identity inside Traiv." },
      {
        title: "Stay connected",
        body: "Keep conversations and shared resources with their coaching.",
      },
    ],
  },
  {
    slug: "payments",
    name: "Client payments",
    blurb: "Collect coaching fees through Razorpay",
    icon: CreditCard,
    headline: "Coaching and client fees, together.",
    body: "Collect client fees through Razorpay in Traiv. Keep payments connected to the client they belong to.",
    points: [
      {
        title: "Client fee collection",
        body: "Give clients a payment route for their coaching fees.",
      },
      {
        title: "Through Razorpay",
        body: "Payment processing charges and settlement terms depend on your payment provider.",
      },
    ],
  },
  {
    slug: "messaging",
    name: "Chat",
    blurb: "Keep the conversation with the coaching",
    icon: MessageSquareText,
    headline: "A conversation with context.",
    body: "Talk to clients in Traiv, alongside the plans and progress you review.",
    points: [
      { title: "One place to talk", body: "Clients and trainers can send messages in Traiv." },
    ],
  },
  {
    slug: "vault",
    name: "Shared resources",
    blurb: "Useful files, ready for your clients",
    icon: Folder,
    headline: "Share the resources behind your coaching.",
    body: "Keep files and links in your vault, then assign them to clients.",
    points: [
      { title: "Your resource library", body: "Upload files or save links for future use." },
      {
        title: "Share with clients",
        body: "Clients can open the resources assigned to them in Traiv.",
      },
    ],
  },
];
export const NAV_FEATURES = FEATURES.slice(0, 5);
export function featureBySlug(slug: string) {
  return FEATURES.find((f) => f.slug === slug);
}
