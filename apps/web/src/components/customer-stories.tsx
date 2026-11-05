import { TESTIMONIALS } from "@/content/testimonials";
export function CustomerStories() {
  if (!TESTIMONIALS.length) return null;
  return (
    <section className="marketing-section">
      <div className="marketing-container">
        <h2>From coaches using Traiv</h2>
        {TESTIMONIALS.filter((t) => t.consentDate).map((t) => (
          <figure key={`${t.name}-${t.city}`}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              {t.name}, {t.role} · {t.city}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
