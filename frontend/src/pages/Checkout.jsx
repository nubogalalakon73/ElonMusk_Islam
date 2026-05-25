import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { BOOK } from "@/data/content";
import { api, track } from "@/lib/api";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);

const PAYMENTS = [
  { id: "qris", label: "QRIS" },
  { id: "gopay", label: "GoPay" },
  { id: "dana", label: "Dana" },
  { id: "shopeepay", label: "ShopeePay" },
  { id: "va", label: "Virtual Account" },
  { id: "cc", label: "Credit Card" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    city: "",
    profession: "",
  });
  const [pay, setPay] = useState("qris");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Checkout — Full Book · EMI";
    track("checkout_view");
    window.scrollTo(0, 0);
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.whatsapp) {
      toast.error("Mohon lengkapi nama, email, dan WhatsApp.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Format email belum valid.");
      return;
    }
    setBusy(true);
    track("checkout_submit", { payment: pay });
    try {
      // Save lead too
      api.post("/leads", { ...form, source: "checkout" }).catch(() => {});
      const { data } = await api.post("/orders", form);
      track("payment_success_mock", { order_id: data.order_id });
      toast.success("Pembayaran berhasil (simulasi). Membuka ruang rahasia…");
      setTimeout(() => navigate(`/success/${data.access_token}`), 900);
    } catch (err) {
      console.error(err);
      toast.error("Maaf, terjadi gangguan. Coba lagi.");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary text-ink-primary py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          data-testid="checkout-back"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] text-ink-secondary hover:text-gold transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>

        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-gold">
              Akses Penuh · 11 Bab
            </span>
          </div>
          <h1
            className="font-heading uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Elon Musk <span className="text-gold">×</span> Islam
          </h1>
          <p className="font-quote italic text-xl text-ink-secondary max-w-2xl">
            "Pertanyaan yang tepat sering lebih mahal daripada jawaban nyaman."
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={submit} data-testid="checkout-form" className="lg:col-span-3 glass-panel p-6 md:p-10 space-y-6">
            <div>
              <h2 className="font-heading text-2xl uppercase tracking-tight mb-1">
                Data Pembaca
              </h2>
              <p className="font-body text-sm text-ink-muted">
                Link private download akan dikirim ke email kamu setelah pembayaran.
              </p>
            </div>

            <Field label="Nama Lengkap *" testid="checkout-name">
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                required
                placeholder="Nama lengkapmu"
                data-testid="checkout-input-name"
                className="w-full bg-black/40 border border-white/10 focus:border-gold outline-none px-4 py-3 font-body text-sm"
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Email *">
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  required
                  placeholder="nama@email.com"
                  data-testid="checkout-input-email"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold outline-none px-4 py-3 font-body text-sm"
                />
              </Field>
              <Field label="WhatsApp *">
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={update("whatsapp")}
                  required
                  placeholder="0812..."
                  data-testid="checkout-input-wa"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold outline-none px-4 py-3 font-body text-sm"
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Kota">
                <input
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  placeholder="Jakarta"
                  data-testid="checkout-input-city"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold outline-none px-4 py-3 font-body text-sm"
                />
              </Field>
              <Field label="Profesi (opsional)">
                <input
                  type="text"
                  value={form.profession}
                  onChange={update("profession")}
                  placeholder="Founder, mahasiswa, dll."
                  data-testid="checkout-input-prof"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold outline-none px-4 py-3 font-body text-sm"
                />
              </Field>
            </div>

            <div className="pt-2">
              <div className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">
                Metode Pembayaran
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PAYMENTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPay(p.id)}
                    data-testid={`pay-${p.id}`}
                    className={`px-3 py-3 border font-body text-xs uppercase tracking-[0.2em] transition-all ${
                      pay === p.id
                        ? "border-gold text-gold bg-gold/5"
                        : "border-white/10 text-ink-secondary hover:border-white/30"
                    }`}
                  >
                    {pay === p.id && <Check size={12} className="inline mr-1.5" />}
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-ink-muted">
                <ShieldCheck size={12} /> Simulasi · Midtrans akan diintegrasikan
              </p>
            </div>

            <button
              type="submit"
              disabled={busy}
              data-testid="checkout-pay"
              className="btn-gold w-full !py-4 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Memproses…
                </>
              ) : (
                <>Bayar Sekarang · Rp{fmt(BOOK.price)}</>
              )}
            </button>
          </form>

          {/* Summary */}
          <aside data-testid="checkout-summary" className="lg:col-span-2">
            <div className="bg-bg-secondary border border-gold gold-glow p-8 paper-bg space-y-5 sticky top-8">
              <div className="font-body text-xs uppercase tracking-[0.3em] text-gold">
                Ringkasan
              </div>
              <div>
                <div className="font-heading text-3xl uppercase tracking-tight">
                  Full Book
                </div>
                <div className="font-quote italic text-ink-secondary">
                  11 Bab · Akses selamanya
                </div>
              </div>

              <ul className="space-y-2 font-body text-sm text-ink-secondary border-t border-white/10 pt-5">
                {[
                  "Full 11 Bab",
                  "PDF Premium",
                  "EPUB Mobile",
                  "Flipbook Interaktif",
                  "AI Reflection Assistant",
                  "Future Update Access",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-5 flex items-baseline justify-between">
                <span className="font-body text-sm text-ink-secondary">Total</span>
                <span className="font-heading text-4xl text-gold">
                  Rp{fmt(BOOK.price)}
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-muted">
                Sekali bayar · Tanpa langganan
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="font-body text-[11px] uppercase tracking-[0.3em] text-ink-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}
