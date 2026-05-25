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

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link to="/checkout" data-testid="final-cta-buy" className="btn-gold !px-10 !py-5 !text-lg">
            📚 Ambil Full Book Rp75.000
          </Link>
          <a href="#ai" data-testid="final-cta-ai" className="btn-ghost !px-10 !py-5 !text-lg">
            🤖 Ngobrol dengan AI Reflection
          </a>
        </div>
      </div>
    </section>
  );
}
