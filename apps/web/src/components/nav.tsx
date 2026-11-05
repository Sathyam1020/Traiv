import { Wordmark } from "@traiv/ui/components/logo";
import Link from "next/link";
import { SITE } from "@/content/site";
import { MobileMenu } from "./mobile-menu";
import { TrialLink } from "./trial-link";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/gyms", label: "For gyms" },
  { href: "/pricing", label: "Pricing" },
];
export function Nav() {
  return (
    <header className="marketing-nav">
      <div className="marketing-nav-inner">
        <Link href="/" aria-label="Traiv home">
          <Wordmark size={36} />
        </Link>
        <nav aria-label="Main navigation" className="desktop-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-signin" href={SITE.app.signin}>
            Sign in
          </a>
          <TrialLink location="navigation" compact />
        </div>
        <MobileMenu>
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a href={SITE.app.signin}>Sign in</a>
        </MobileMenu>
      </div>
    </header>
  );
}
