import { Link } from "react-router-dom";
import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function FinalCTA() {
  const ref = useReveal();
  return (
    <section
      id="final"
      data-testid="final-section"
      ref={ref}
      className="reveal relative min-h-[90vh] flex items-center justify-center overflow-hidden vignette"
    >
      <div className="absolute inset-0">
        <img
          src={IMAGES.finalSky}
          alt=""
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center space-y-10 py-32">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gold" />
          <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
            Penutup
          </span>
          <span className="h-px w-16 bg-gold" />
        </div>

        <h2
          data-testid="final-headline"
          className="font-heading uppercase leading-[0.85] tracking-tight max-w-5xl mx-auto"
          style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
        >
          Matahari tidak pernah
          <br />
          <span className="text-gold">mengejar bayangannya.</span>
        </h2>

        <p className="font-quote italic text-2xl md:text-3xl text-ink-secondary max-w-2xl mx-auto leading-snug">
          Dan mungkin… selama ini kita hanya sibuk
          mengejar bayangan.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="flex -space-x-2">
            {["R","H","A","N","D","M"].map((l, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-bg-secondary/80 border border-white/20 flex items-center justify-center text-[10px] font-heading text-gold">
                {l}
              </div>
            ))}
          </div>
          <p className="font-body text-sm text-ink-muted">
            <span className="text-ink-secondary">1.200+ pembaca</span> sudah ambil full book
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/checkout" data-testid="final-cta-buy" className="btn-gold !px-10 !py-5 !text-lg">
            📚 Ambil Full Book Rp75.000
          </Link>
          <a href="#ai" data-testid="final-cta-ai" className="btn-ghost !px-10 !py-5 !text-lg">
            🤖 Ngobrol dengan AI Reflection
          </a>
        </div>
        <p className="font-body text-xs text-ink-muted/60 tracking-wider uppercase mt-2">
          Sekali bayar · Akses selamanya · PDF + EPUB + Flipbook + AI unlimited
        </p>
      </div>
    </section>
  );
}
