import { notFound } from "next/navigation";
import { legalBySlug } from "../../../../../../../web/src/content/legal";
import { SettingsPage } from "../../settings/common";
export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!["terms", "privacy"].includes(doc)) notFound();
  const page = legalBySlug(doc);
  if (!page) notFound();
  return (
    <SettingsPage title={doc === "terms" ? "Terms and Conditions" : "Privacy Policy"}>
      <article className="space-y-6 px-5 py-6">
        <div>
          <h2 className="text-xl font-semibold">{page.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{page.summary}</p>
          <p className="mt-3 text-xs text-fg-subtle">Last updated {page.updated}</p>
        </div>
        <aside className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-sm font-semibold">Draft — not yet in force</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            These are Traiv’s existing draft legal documents. Company and contact details still need
            to be completed and reviewed. The terms currently describe the coach’s agreement; they
            are not a finalized client agreement.
          </p>
        </aside>
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="mb-3 text-base font-semibold">{section.heading}</h3>
            <div className="space-y-3">
              {section.paras.map((paragraph, i) => (
                <p
                  key={`${section.heading}-${i}`}
                  className="text-sm leading-relaxed text-fg-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </SettingsPage>
  );
}
