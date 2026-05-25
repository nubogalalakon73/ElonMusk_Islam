import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { BOOK, IMAGES, CHAPTERS } from "@/data/content";

export default function Hero() {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen w-full overflow-hidden flex items-center pt-20 vignette"
    >
      {/* Cinematic cover background */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Elon Musk x Islam — Cover"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-bg-primary/70 to-bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-transparent to-bg-primary/60" />
      </div>

      {/* Floating chapter titles (animated marquee in background) */}
      <div className="absolute inset-x-0 top-[18%] opacity-[0.08] pointer-events-none select-none overflow-hidden">
        <div className="marquee whitespace-nowrap font-heading text-[6vw] tracking-tight text-ink-primary">
          {[...CHAPTERS, ...CHAPTERS].map((c, i) => (
            <span key={i} className="mx-12">{c.title}</span>
          ))}
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 w-full grid lg:grid-cols-12 gap-12 items-center py-24">
        <div className="lg:col-span-8 space-y-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Esai Hibrida · Vol. 1
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className="font-heading uppercase leading-[0.85] tracking-tight text-ink-primary"
            style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)" }}
          >
            Elon Musk
            <br />
            <span className="text-gold">×</span> Islam
          </h1>

          <p className="font-quote italic text-2xl md:text-3xl lg:text-4xl text-ink-primary/90 max-w-3xl leading-snug">
            Ketika seorang insinyur Silicon Valley dan tradisi berusia empat belas
            abad ternyata sedang membicarakan kebenaran yang sama.
          </p>

          <div className="border-l-2 border-gold pl-6 max-w-2xl">
            <p className="font-body text-base md:text-lg text-ink-secondary leading-relaxed">
              Buku ini bukan tentang Elon Musk. Tetapi tentang cara manusia modern
              kehilangan arah hidupnya.
            </p>
            <p className="mt-3 font-body text-xs uppercase tracking-[0.3em] text-ink-muted">
              — {BOOK.author}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/read/bab-1" data-testid="hero-cta-read" className="btn-gold">
              📖 Baca Bab 1 Gratis
            </Link>
            <Link to="/checkout" data-testid="hero-cta-buy" className="btn-outline-gold">
              ☕ Ambil Full Book Rp75K
            </Link>
          </div>
        </div>

        {/* Cover float right */}
        <div className="hidden lg:block lg:col-span-4 relative">
          <div className="relative aspect-[3/4] w-full max-w-[360px] mx-auto">
            <div className="absolute -inset-4 bg-gold/10 blur-3xl rounded-full" />
            <img
              src={BOOK.cover}
              alt="Book cover"
              className="relative w-full h-full object-cover shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-bg-primary border border-gold px-4 py-2 font-heading text-sm tracking-[0.2em] text-gold">
              Vol. 01
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-glow">
        <span className="font-body text-[10px] uppercase tracking-[0.4em] text-ink-muted">
          Gulir untuk membuka cermin
        </span>
        <ArrowDown size={18} className="text-gold" />
      </div>
    </section>
  );
}
