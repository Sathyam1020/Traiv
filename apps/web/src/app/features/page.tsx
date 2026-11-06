import { ArrowUpRight } from "@traiv/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCta } from "@/components/marketing-sections";
import { ProductScene, sceneForFeature } from "@/components/product-scenes";
import { FEATURES } from "@/content/features";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({
  title: "Coaching features",
  description:
    "Explore Traiv's workout plans, diet plans, check-ins, client payments and client app.",
  alternates: { canonical: "/features" },
});
export default function FeaturesPage() {
  return (
    <>
      <section className="subpage-hero traiv-content-wrap">
        <span className="section-note">Inside Traiv</span>
        <h1>
          The plan. The person.
          <br />
          The progress.
        </h1>
        <p className="page-lede">
          A connected workflow for your coaching, from the first workout plan to the next check-in.
        </p>
      </section>
      <section className="marketing-section">
        <div className="traiv-content-wrap feature-overview-list">
          {FEATURES.map((f, i) => (
            <div className={`workflow-row ${i % 2 ? "workflow-reverse" : ""}`} key={f.slug}>
              <div className="workflow-copy">
                <span className="section-note">{f.name}</span>
                <h2>{f.headline}</h2>
                <p>{f.body}</p>
                <Link href={`/features/${f.slug}`}>
                  Explore {f.name.toLowerCase()} <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </div>
              <ProductScene kind={sceneForFeature(f.slug)} />
            </div>
          ))}
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
