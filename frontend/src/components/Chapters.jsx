import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CHAPTERS } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function Chapters() {
  const ref = useReveal();
  const scrollRef = useRef(null);

  const scrollBy = (dx) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dx, behavior: "smooth" });
    }
  };

  return (
    <section
      id="chapters"
      data-testid="chapters-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 bg-bg-primary overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
                Arsip Intelektual · 11 Bab
              </span>
            </div>
            <h2
              className="font-heading uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              Sebelas Cermin.
              <br />
              <span className="text-gold">Satu Refleksi.</span>
            </h2>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollBy(-400)}
              data-testid="chapters-prev"
              className="border border-white/20 hover:border-gold hover:text-gold p-3 transition-colors"
              aria-label="Sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy(400)}
              data-testid="chapters-next"
              className="border border-white/20 hover:border-gold hover:text-gold p-3 transition-colors"
              aria-label="Berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          data-testid="chapters-scroller"
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin"
          style={{ scrollbarWidth: "thin" }}
        >
          {CHAPTERS.map((c, i) => (
            <article
              key={c.n}
              data-testid={`chapter-card-${c.n}`}
              className="lift-card snap-start flex-shrink-0 w-[280px] md:w-[340px] h-[420px] bg-bg-secondary border border-white/10 hover:border-gold/60 paper-bg p-7 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 font-heading text-[8rem] leading-none text-white/[0.04] group-hover:text-gold/10 transition-colors">
                {c.n}
              </div>
              <div className="relative space-y-4">
                <div className="font-body text-xs uppercase tracking-[0.3em] text-gold">
                  Bab {c.n}
                </div>
                <h3 className="font-heading text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] text-ink-primary group-hover:text-gold transition-colors">
                  {c.title}
                </h3>
              </div>
              <div className="relative space-y-3">
                <p className="font-quote italic text-lg text-ink-secondary leading-snug">
                  {c.excerpt}
                </p>
                <div className="h-px w-12 bg-gold/40 group-hover:w-24 transition-all duration-500" />
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-ink-muted">
                  {i === 0 ? "Gratis · Bisa dibaca" : "Akses penuh · Full Book"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
