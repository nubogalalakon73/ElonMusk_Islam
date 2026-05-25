import { IMAGES } from "@/data/content";
import useReveal from "@/hooks/useReveal";

export default function Marshmallow() {
  const ref = useReveal();
  return (
    <section
      id="marshmallow"
      data-testid="marshmallow-section"
      ref={ref}
      className="reveal relative py-24 md:py-40 overflow-hidden bg-bg-primary"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-square w-full">
            <img
              src={IMAGES.marshmallow}
              alt="Marshmallow"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary/80 via-transparent to-transparent" />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Bab 09 · Delayed Gratification
            </span>
          </div>

          <h2
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            Sebagian ingin
            <br />
            kenyamanan <span className="text-gold">instan.</span>
            <br />
            Sebagian lain — <span className="text-stroke">menunda.</span>
          </h2>

          <div className="space-y-4 font-body text-ink-secondary text-lg leading-relaxed max-w-xl">
            <p>
              Eksperimen marshmallow itu sederhana: anak kecil diberi satu permen.
              Jika ia bisa menunggu 15 menit, ia mendapat dua.
            </p>
            <p>
              Yang menunda — biasanya — tumbuh menjadi orang yang berbeda.
            </p>
            <p className="text-ink-primary">
              Kadang harga 75 ribu rupiah bukan harga ebook. Itu harga satu
              marshmallow yang sengaja kamu tunda untuk hidup yang lebih besar.
            </p>
          </div>

          <div className="border-l-2 border-gold pl-6 max-w-xl">
            <p className="font-quote italic text-2xl md:text-3xl text-ink-primary leading-snug">
              Yang mengejar validasi akan lelah.
              <br />
              Yang menciptakan nilai akan dicari.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
