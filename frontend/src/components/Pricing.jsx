import { Link } from "react-router-dom";
import { Check, Coffee, BookOpen, Crown } from "lucide-react";
import { BOOK } from "@/data/content";
import useReveal from "@/hooks/useReveal";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);

export default function Pricing() {
  const ref = useReveal();
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 bg-bg-primary overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Akses Intelektual
            </span>
          </div>
          <h2
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Bukan toko ebook.
            <br />
            <span className="text-gold">Pintu ke ruang refleksi.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Tier 1: Free */}
          <article
            data-testid="pricing-card-free"
            className="lift-card bg-bg-secondary border border-white/10 p-8 lg:p-10 flex flex-col"
          >
            <BookOpen size={24} className="text-ink-secondary mb-6" />
            <div className="font-body text-xs uppercase tracking-[0.3em] text-ink-muted mb-3">
              Tier · Free Trial
            </div>
            <h3 className="font-heading text-3xl uppercase tracking-tight mb-1">Bab 1</h3>
            <div className="font-quote italic text-ink-secondary mb-6">Gratis</div>
            <div className="font-heading text-5xl text-ink-primary mb-2">Rp0</div>
            <p className="font-body text-sm text-ink-muted mb-8">
              Buka pintu kecilnya. Lihat dulu apakah cermin ini berbicara padamu.
            </p>
            <ul className="space-y-3 mb-10 flex-1">
              {["Bab 1 lengkap", "Reader mode premium", "Tanpa registrasi"].map((f) => (
                <Feat key={f} text={f} />
              ))}
            </ul>
            <Link to="/read/bab-1" data-testid="pricing-cta-free" className="btn-ghost w-full">
              Baca Bab 1
            </Link>
          </article>

          {/* Tier 2: Per chapter */}
          <article
            data-testid="pricing-card-coffee"
            className="lift-card bg-bg-secondary border border-white/10 p-8 lg:p-10 flex flex-col"
          >
            <Coffee size={24} className="text-ink-secondary mb-6" />
            <div className="font-body text-xs uppercase tracking-[0.3em] text-ink-muted mb-3">
              Tier · Per Bab
            </div>
            <h3 className="font-heading text-3xl uppercase tracking-tight mb-1">Traktir Kopi</h3>
            <div className="font-quote italic text-ink-secondary mb-6">Per Bab</div>
            <div className="font-heading text-5xl text-ink-primary mb-2">
              Rp10<span className="text-2xl">K</span>
            </div>
            <p className="font-body text-sm text-ink-muted mb-8">
              Pilih bab. Bayar harga kopi. Refleksi mengalir.
            </p>
            <ul className="space-y-3 mb-10 flex-1">
              {["Akses 1 bab pilihan", "Format reader & PDF", "Tanpa langganan"].map((f) => (
                <Feat key={f} text={f} />
              ))}
            </ul>
            <a href="#ai" data-testid="pricing-cta-coffee" className="btn-ghost w-full">
              Tanya AI Dulu
            </a>
          </article>

          {/* Tier 3: Full Book — HIGHLIGHT */}
          <article
            data-testid="pricing-card-full"
            className="lift-card relative bg-bg-secondary border border-gold gold-glow p-8 lg:p-10 flex flex-col paper-bg overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gold text-black font-heading text-[10px] tracking-[0.3em] px-3 py-1.5">
              PALING DIREKOMENDASIKAN
            </div>
            <Crown size={24} className="text-gold mb-6 mt-4" />
            <div className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">
              Tier · Lengkap
            </div>
            <h3 className="font-heading text-3xl uppercase tracking-tight mb-1 text-ink-primary">
              Full Book
            </h3>
            <div className="font-quote italic text-ink-secondary mb-6">
              11 Bab · Akses selamanya
            </div>
            <div className="font-heading text-6xl text-gold mb-2">
              Rp{fmt(BOOK.price)}
            </div>
            <p className="font-body text-sm text-ink-secondary mb-8">
              Sekali bayar. Akses selamanya. Pembaruan masa depan termasuk.
            </p>
            <ul className="space-y-3 mb-10 flex-1">
              {[
                "Full 11 Bab",
                "PDF Premium",
                "EPUB Mobile",
                "Flipbook Interaktif",
                "AI Reflection Assistant (unlimited)",
                "Future Update Access",
              ].map((f) => (
                <Feat key={f} text={f} gold />
              ))}
            </ul>
            <Link to="/checkout" data-testid="pricing-cta-full" className="btn-gold w-full">
              Ambil Full Book
            </Link>
          </article>
        </div>

        <p className="mt-10 text-center font-body text-xs uppercase tracking-[0.3em] text-ink-muted">
          Sekali bayar · Tanpa langganan tersembunyi · Pembayaran aman
        </p>
      </div>
    </section>
  );
}

function Feat({ text, gold }) {
  return (
    <li className="flex items-start gap-3 font-body text-sm text-ink-secondary">
      <Check
        size={16}
        className={`flex-shrink-0 mt-0.5 ${gold ? "text-gold" : "text-ink-muted"}`}
      />
      <span className={gold ? "text-ink-primary" : ""}>{text}</span>
    </li>
  );
}
