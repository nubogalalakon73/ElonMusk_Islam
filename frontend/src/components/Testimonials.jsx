import { TESTIMONIALS } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function Testimonials() {
  const ref = useReveal();
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 bg-bg-secondary overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-16 max-w-2xl space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Pantulan Pembaca
            </span>
          </div>
          <h2
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            Bukan testimoni.
            <br />
            <span className="text-gold">Refleksi.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              data-testid={`testi-${i}`}
              className="bg-bg-primary border-l-2 border-crimson hover:border-gold transition-colors p-8 lg:p-10 paper-bg"
            >
              <div className="font-quote text-gold text-6xl leading-none mb-4">"</div>
              <blockquote className="font-quote italic text-2xl md:text-3xl text-ink-primary leading-snug mb-6">
                {t.quote}
              </blockquote>
              <figcaption className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="font-heading text-sm tracking-[0.25em] uppercase text-ink-primary">
                  {t.by}
                </span>
                <span className="font-body text-xs text-ink-muted">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
