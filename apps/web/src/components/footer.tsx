import { Wordmark } from "@traiv/ui/components/logo";
import Link from "next/link";
import { SITE } from "@/content/site";
export function Footer() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-container">
        <div className="footer-main">
          <div>
            <Link href="/" aria-label="Traiv home">
              <Wordmark size={38} />
            </Link>
            <p>
              Workout plans, diet plans and progress.
              <br />
              Connected coaching, wherever you are.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <b>Traiv</b>
              <Link href="/features">Features</Link>
              <Link href="/gyms">For gyms</Link>
              <Link href="/pricing">Pricing</Link>
              <a href={SITE.app.signin}>Sign in</a>
            </div>
            <div>
              <b>Explore</b>
              <Link href="/coaches">For trainers</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/tools">Free tools</Link>
              <Link href="/blog">Blog</Link>
            </div>
            <div>
              <b>Company</b>
              <Link href="/about">About</Link>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
              <Link href="/gyms#contact">Talk to us</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Traiv</span>
          <span>Built for trainers and gyms.</span>
        </div>
      </div>
    </footer>
  );
}
