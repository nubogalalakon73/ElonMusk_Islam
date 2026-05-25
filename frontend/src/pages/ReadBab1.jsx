import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BAB_1, BOOK } from "@/data/content";
import { track } from "@/lib/api";

export default function ReadBab1() {
  useEffect(() => {
    document.title = "Bab 1 · Paradoks Bayang-Bayang — EMI";
    track("read_bab1_view");
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-bg-paper paper-bg text-ink-primary">
      {/* Mini nav */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            data-testid="read-back"
            className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] text-ink-secondary hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Kembali
          </Link>
          <span className="font-heading text-xs tracking-[0.3em] text-gold">
            BAB 01 · GRATIS
          </span>
        </div>
      </header>

      <article className="max-w-2xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Bab Satu
            </span>
          </div>
          <h1
            data-testid="bab1-title"
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            Paradoks Bayang-Bayang
          </h1>
          <p className="font-quote italic text-xl text-ink-secondary">
            — Dari buku "Elon Musk × Islam" oleh {BOOK.author}
          </p>
          <div className="editorial-rule" />
        </div>

        <div className="space-y-12">
          {BAB_1.map((sec, i) => (
            <section key={i} className="space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-gold">
                {sec.heading}
              </h2>
              <div className="space-y-5 font-quote text-xl md:text-[1.35rem] leading-[1.7] text-ink-primary">
                {sec.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-white/10 space-y-6 text-center">
          <p className="font-quote italic text-2xl text-ink-secondary">
            "Pertanyaan yang tepat sering lebih mahal
            <br />
            daripada jawaban nyaman."
          </p>
          <p className="font-body text-sm text-ink-muted max-w-md mx-auto">
            Bab 1 telah selesai. Sepuluh bab berikutnya menunggumu — termasuk
            Neraca Jiwa, Pemulung Berlian, dan Laporan Semangka.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/checkout" data-testid="read-cta-buy" className="btn-gold">
              Ambil Full Book Rp75K
            </Link>
            <Link to="/#ai" data-testid="read-cta-ai" className="btn-ghost">
              Tanya AI Reflection
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
