import { Link } from "react-router-dom";
import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function ParadoksAnto() {
  const ref = useReveal();
  return (
    <section
      id="paradox"
      data-testid="paradox-section"
      ref={ref}
      className="reveal relative bg-bg-secondary py-24 md:py-40 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Visual */}
        <div className="lg:col-span-5 order-2 lg:order-1 relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <img
              src={IMAGES.anto}
              alt="Anto — purnama & gerhana"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent" />
            {/* Moon animation */}
            <div className="absolute top-8 left-8 moon shadow-[0_0_60px_rgba(245,245,240,0.3)]" />
          </div>
          <div className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-ink-muted">
            01 — Anto & Fase Bulan
          </div>
        </div>

        {/* Narrative */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">Bab 05</span>
          </div>

          <h2
            data-testid="paradox-headline"
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Tanggal 25 <span className="text-gold">Purnama.</span>
            <br />
            Tanggal 5 <span className="text-stroke">Gerhana.</span>
          </h2>

          <div className="space-y-5 font-body text-ink-secondary text-lg leading-relaxed max-w-2xl">
            <p>
              Anto bangun pukul lima. Bekerja keras. Pulang larut. Setiap tanggal
              gajian, saldonya purnama: penuh, terang, bisa diraba.
            </p>
            <p>
              Sepuluh hari kemudian, saldo itu menjadi sabit. Lima hari setelah
              itu, gerhana. Anto kembali bekerja. Lalu purnama. Lalu gerhana.
              <span className="text-ink-primary"> Seperti bulan yang tak pernah benar-benar memiliki cahayanya sendiri.</span>
            </p>
            <p>
              Mungkin masalahnya bukan Anto. Mungkin masalahnya cara kita
              memandang uang — sebagai tujuan, bukan sebagai bayangan dari
              sesuatu yang lebih besar.
            </p>
          </div>

          <div className="border-l-2 border-gold pl-6 py-2">
            <p className="font-quote italic text-2xl md:text-3xl text-ink-primary leading-snug">
              "Semakin keras manusia mengejar uang, semakin lihai ia menyelinap."
            </p>
          </div>

          <Link to="/read/bab-1" data-testid="paradox-cta" className="btn-ghost mt-4 inline-flex">
            Lanjut Baca Bab 1
          </Link>
        </div>
      </div>
    </section>
  );
}
