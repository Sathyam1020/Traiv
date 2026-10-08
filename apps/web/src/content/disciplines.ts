import { Apple, Dumbbell, HeartPulse, type LucideIcon, Salad, Sparkles } from "lucide-react";

export type Discipline = {
  name: string;
  icon: LucideIcon;
  /** What their week actually looks like. */
  problem: string;
  /** The part of Traiv that matters most to them, named. */
  fit: string;
  uses: string[];
};

/**
 * The five kinds of coach in `CLAUDE.md`, each with the part of the product they buy for.
 *
 * Written as five different answers rather than one list with the names swapped, because
 * a dietitian and a physiotherapist want almost opposite things from this product, and a
 * page that pretends otherwise reads as having been written for nobody.
 */
export const DISCIPLINES: readonly Discipline[] = [
  {
    name: "Personal trainers",
    icon: Dumbbell,
    problem:
      "You train people in a gym and you have slowly become their nutritionist, their accountability partner and their WhatsApp support line — unpaid, in the evenings.",
    fit: "The plan builder and the client app. Eight weeks built once, on their phone, with their last numbers next to the set they are about to do.",
    uses: [
      "Train in person, coach online between sessions",
      "Charge for the week rather than the hour",
      "See who skipped before they tell you",
    ],
  },
  {
    name: "Dietitians",
    icon: Salad,
    problem:
      "You write plans in Word, send them as PDFs, and have no idea whether anybody ate from them until the next appointment.",
    fit: "Calculated targets with the working shown, and meals in katoris and rotis. The number is Mifflin-St Jeor, not a guess, and anything that needs a human waits for one.",
    uses: [
      "Targets you can defend to a client and a doctor",
      "Vegetarian, Jain, egg and vegan handled properly",
      "Logs that tell you what was actually eaten",
    ],
  },
  {
    name: "Nutrition coaches",
    icon: Apple,
    problem:
      "Half your clients want a meal plan and the other half want to be told what to swap. Both of them want it on WhatsApp.",
    fit: "Plans your client can follow without a kitchen scale, and food logs that take a client ten seconds rather than a diary they abandon in week two.",
    uses: [
      "Home measures, not grams",
      "Swap one meal without rebuilding the week",
      "Weekly weight against the target, charted",
    ],
  },
  {
    name: "Yoga instructors",
    icon: Sparkles,
    problem:
      "You run classes and a handful of one-to-one clients, and the admin for the handful takes as long as the classes.",
    fit: "Sequences as a plan they can follow at home, check-ins that ask how the week felt rather than what they lifted, and payments that collect themselves.",
    uses: [
      "A home practice they can actually follow",
      "Group programmes on the Studio plan",
      "Payment links instead of asking on the 3rd",
    ],
  },
  {
    name: "Physiotherapists",
    icon: HeartPulse,
    problem:
      "Your patients do their exercises for four days. You find out they stopped at the next appointment, by which point two weeks are gone.",
    fit: "Prescribed movements with logging, so adherence is visible between appointments rather than reported after the fact.",
    uses: [
      "Exercises filtered by what a knee or a back can do",
      "Daily logging, visible to you the same day",
      "Progress a patient can see, which is what keeps them going",
    ],
  },
];
