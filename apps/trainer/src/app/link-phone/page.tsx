import { Suspense } from "react";
import { LinkPhoneForm } from "@/components/auth/link-phone-form";

export const metadata = { title: "Add your phone number · Traiv" };

/**
 * Just the card, centered — no `AuthAside`. /signin and /signup are a first impression
 * and sell the product; this is a one-step detour for someone already signed in, and the
 * testimonial rail next to it would be advertising Traiv to somebody already using it.
 */
export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <Suspense>
        <LinkPhoneForm />
      </Suspense>
    </div>
  );
}
