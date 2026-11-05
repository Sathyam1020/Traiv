import { redirect } from "next/navigation";

/** Keep saved programme URLs working; sessions now live on the workout cards. */
export default function ProgramPage() {
  redirect("/workouts");
}
