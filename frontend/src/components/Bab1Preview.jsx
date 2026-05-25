import { Link } from "react-router-dom";
import { BookOpen, Smartphone } from "lucide-react";
import useReveal from "@/hooks/useReveal";

export default function Bab1Preview() {
  const ref = useReveal();
  return (
    <section
      id="bab1"
      data-testid="bab1-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 bg-bg-secondary overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Bab Satu — Gratis
            </span>
          </div>
          <h2
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Baca dulu.
            <br />
            <span className="text-gold">Tanpa unduh PDF.</span>
          </h2>
          <p className="font-body text-lg text-ink-secondary leading-relaxed max-w-xl">
            Pengalaman membaca premium langsung di browser. Mode gelap. Tipografi
            editorial. Tanpa iklan. Tanpa popup. Hanya kamu, satu cermin, dan
            beberapa pertanyaan yang mungkin akan tinggal di kepalamu lebih lama
            daripada jawabannya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/read/bab-1" data-testid="bab1-cta-read" className="btn-gold">
              <BookOpen size={18} /> Mulai Membaca
            </Link>
            <a href="#pricing" data-testid="bab1-cta-pricing" className="btn-ghost">
              Atau ambil 11 bab
            </a>
          </div>
        </div>

        {/* Smartphone mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-gold/5 blur-3xl rounded-full" />
            <div className="relative w-[260px] h-[520px] bg-bg-primary border-2 border-white/20 rounded-[2.5rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-bg-paper rounded-[2rem] overflow-hidden flex flex-col p-5">
                <div className="text-[9px] uppercase tracking-[0.3em] text-gold mb-3 flex items-center gap-2">
                  <Smartphone size={10} /> Reader · Dark
                </div>
                <div className="font-heading text-2xl uppercase leading-tight mb-3">
                  Paradoks Bayang-Bayang
                </div>
                <div className="font-quote italic text-base text-ink-secondary mb-4">
                  "Anto bangun pukul lima pagi…"
                </div>
                <div className="space-y-2 font-body text-[11px] text-ink-secondary leading-relaxed">
                  <p>
                    Tanggal 25, saldonya purnama. Tanggal 5, gerhana. Tanggal 25
                    lagi, purnama. Begitu seterusnya.
                  </p>
                  <p>
                    Seperti bulan yang tak pernah benar-benar memiliki cahayanya
                    sendiri…
                  </p>
                  <p className="text-ink-muted">
                    Mungkin masalahnya bukan jumlah gajinya. Mungkin
                    masalahnya cara kita memandang uang…
                  </p>
                </div>
                <div className="mt-auto h-1 w-1/3 bg-gold/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
