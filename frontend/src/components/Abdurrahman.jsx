import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function Abdurrahman() {
  const ref = useReveal();
  return (
    <section
      id="auf"
      data-testid="auf-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 overflow-hidden bg-bg-secondary"
    >
      <div className="absolute inset-0">
        <img
          src={IMAGES.madinah}
          alt="Pasar Madinah"
          className="w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Bab 06 — Historical Cinematic
            </span>
          </div>

          <h2
            data-testid="auf-headline"
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            "Tunjukkan saja aku
            <br />
            <span className="text-gold">jalan ke pasar.</span>"
          </h2>

          <div className="space-y-5 font-body text-ink-secondary text-lg leading-relaxed max-w-2xl">
            <p>
              Ketika tiba di Madinah, Abdurrahman bin Auf bisa saja meminta uang.
              Bisa saja meminta sedekah. Bisa saja meminta belas kasihan.
            </p>
            <p>
              Ia tidak meminta semua itu. Ia hanya meminta <span className="text-gold">akses</span> —
              akses untuk menciptakan nilai. Sisanya, ia bayar dengan kerja, dengan
              pikiran, dengan keringat.
            </p>
            <p className="text-ink-primary">
              Sebagian manusia mengejar papan skor. Sebagian lain bermain di lapangan.
            </p>
          </div>

          <div className="q-mark border-l-2 border-gold pl-6 max-w-2xl">
            <p className="font-quote italic text-2xl md:text-3xl text-ink-primary leading-snug">
              Keberkahan tidak lahir dari permintaan. Ia lahir dari kontribusi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
