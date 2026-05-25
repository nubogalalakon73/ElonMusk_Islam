import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, FileText, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { api, API, track } from "@/lib/api";

export default function Success() {
  const { token } = useParams();
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    document.title = "Selamat datang, pembaca — EMI";
    track("success_view", { token });
    (async () => {
      try {
        const { data } = await api.get(`/orders/by-token/${token}`);
        setOrder(data);
      } catch (e) {
        setErr(true);
      }
    })();
  }, [token]);

  if (err) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-primary text-ink-primary p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="font-heading text-3xl uppercase tracking-tight">
            Akses tidak ditemukan
          </h1>
          <p className="font-body text-ink-secondary">
            Link akses ini tidak valid atau sudah kedaluwarsa.
          </p>
          <Link to="/" className="btn-ghost">
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-primary text-gold">
        <Loader2 size={32} className="animate-spin" />
      </main>
    );
  }

  const dl = (kind) => `${API}/download/${kind}/${token}`;

  return (
    <main className="min-h-screen bg-bg-primary text-ink-primary relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full animate-pulse-glow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold gold-glow mb-10">
          <Sparkles size={14} className="text-gold" />
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-gold">
            Ruang Rahasia Terbuka
          </span>
        </div>

        <h1
          data-testid="success-headline"
          className="font-heading uppercase leading-[0.85] tracking-tight mb-8"
          style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
        >
          Selamat datang,
          <br />
          <span className="text-gold">pembaca.</span>
        </h1>

        <p className="font-quote italic text-2xl md:text-3xl text-ink-secondary max-w-2xl mx-auto leading-snug mb-12">
          Kadang manusia membeli buku. Kadang manusia membeli cara baru
          memandang hidup.
        </p>

        <div className="border border-white/10 bg-bg-secondary p-6 md:p-8 mb-10 text-left paper-bg">
          <div className="grid sm:grid-cols-2 gap-4 font-body text-sm">
            <Row label="Order ID" value={order.order_id} />
            <Row label="Status" value={<span className="text-gold uppercase">{order.status}</span>} />
            <Row label="Nama" value={order.name} />
            <Row label="Email" value={order.email} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-12" data-testid="success-downloads">
          <DlBtn href={dl("pdf")} icon={FileText} label="PDF Premium" />
          <DlBtn href={dl("epub")} icon={BookOpen} label="EPUB Mobile" />
          <DlBtn href={dl("flipbook")} icon={Download} label="Flipbook" />
        </div>

        <div className="space-y-4">
          <Link to="/" className="btn-ghost" data-testid="success-back">
            Kembali ke beranda
          </Link>
          <p className="font-quote italic text-lg text-ink-muted max-w-xl mx-auto pt-8">
            "Sebagian orang membeli hiburan. Sebagian lain membeli cermin.
            <br />
            Dan malam ini, mungkin Anda baru saja membeli pertanyaan yang akan
            tinggal lebih lama daripada jawabannya."
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-ink-muted mb-1">{label}</div>
      <div className="text-ink-primary">{value}</div>
    </div>
  );
}

function DlBtn({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-testid={`dl-${label.split(" ")[0].toLowerCase()}`}
      className="group border border-white/10 hover:border-gold bg-bg-secondary px-5 py-6 flex flex-col items-center gap-3 transition-all lift-card"
    >
      <Icon size={24} className="text-gold group-hover:scale-110 transition-transform" />
      <span className="font-heading text-sm tracking-[0.2em] uppercase">{label}</span>
    </a>
  );
}
