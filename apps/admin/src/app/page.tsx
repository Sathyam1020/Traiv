import { redirect } from "next/navigation";

/** Sign-in is the entry point, the same as the coach app. */
export default function Home() {
  redirect("/signin");
}
