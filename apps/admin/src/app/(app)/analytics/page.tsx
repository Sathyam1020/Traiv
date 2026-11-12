import { redirect } from "next/navigation";

/** `/analytics` on its own has no content of its own — Overview is the default tab. */
export default function AnalyticsIndexPage() {
  redirect("/analytics/overview");
}
