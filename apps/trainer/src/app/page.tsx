import { redirect } from "next/navigation";

/** Sign-in is the entry point until the marketing site exists. */
export default function Home() {
  redirect("/signin");
}
