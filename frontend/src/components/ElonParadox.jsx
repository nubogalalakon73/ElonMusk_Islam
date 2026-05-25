import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function ElonParadox() {
  const ref = useReveal();
  return (
    <section
      id="elon"
      data-testid="elon-section"
      ref={ref}
      className="reveal relative bg-bg-primary py-24 md:py-40 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${IMAGES.elon})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/80 to-bg-primary" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 space-y-16">
        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">Bab 07</span>
          </div>
          <h2
            data-testid="elon-headline"
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Orang Terkaya Dunia…
            <br />
            <span className="text-gold">tidur di rumah</span> 50 ribu dolar.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="border-l-2 border-crimson pl-8 py-6 space-y-4">
            <h3 className="font-heading text-2xl tracking-wide uppercase text-ink-muted">
              Kiri · Flexing Culture
            </h3>
            <p className="font-body text-base md:text-lg text-ink-secondary leading-relaxed">
              Mansion. Yacht. Watch. Mobil sport. Sebuah peradaban
              dibangun di atas asumsi: "yang kaya, yang menang."
            </p>
            <p className="font-quote italic text-xl text-ink-muted">
              Hidup menjadi papan skor yang tak pernah cukup.
            </p>
          </div>

          <div className="border-l-2 border-gold pl-8 py-6 space-y-4 gold-glow bg-bg-secondary/40">
            <h3 className="font-heading text-2xl tracking-wide uppercase text-gold">
              Kanan · Value Creation
            </h3>
            <p className="font-body text-base md:text-lg text-ink-primary leading-relaxed">
              Mansion dijual. Tidur di rumah kecil sewaan. Fokus pada Mars,
              pada listrik, pada pertanyaan yang lebih besar daripada angka rekening.
            </p>
            <p className="font-quote italic text-xl text-ink-primary">
              "Money is just an information system."
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="font-quote italic text-3xl md:text-4xl text-ink-primary max-w-3xl mx-auto leading-snug">
            Uang yang dikejar — menjauh.
            <br />
            Uang yang diciptakan — datang sebagai bayangan.
          </p>
        </div>
      </div>
    </section>
  );
}
